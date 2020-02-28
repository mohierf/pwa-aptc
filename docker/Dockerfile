# -----
# For dev environment
# -----
ARG NODE_VERSION=10

# Base Node image
FROM node:${NODE_VERSION} as node

ARG NODE_VERSION

ENV \
    NODE_ENV=development \
    NODE_USER=node

COPY . /srv/app-web/
COPY ./docker/node/rootfs /
WORKDIR /srv/app-web

RUN set -eux \
    # Install app-web
    && yarn install --non-interactive --no-progress

RUN \
    yarn add @vue/cli@3.7.0 -g \
    && yarn build --verbose \
#    && npm install \
#    && npm install @vue/cli@3.7.0 -g \
    # Fix permissions
    && chown -R "${NODE_USER}:${NODE_USER}" /srv/app-web

ENTRYPOINT [ "/usr/local/sbin/dumb-init", "--", "/docker-entrypoint" ]
CMD [ "yarn", "start" ]

# -----
# For production environment
# -----
FROM nginx:stable-alpine as nginx

ENV \
    API_ENDPOINT="http://localhost" \
    WS_ENDPOINT="http://localhost:81" \
    BRANDING="default" \
    TITLE="apTeleCare"

COPY --from=node /srv/app-web/build /srv/app-web/build
COPY ./docker/nginx/rootfs /
WORKDIR /srv/app-web

RUN set -eux \
    # Prepare system
    && apk add --no-cache --no-progress \
           python2 \
    # Configure nginx
    && rm /etc/nginx/conf.d/default.conf \
    # Clean
    && rm -f -r \
           /root/.npm \
           /tmp/*

ENTRYPOINT [ "/docker-entrypoint" ]
CMD [ "nginx", "-g", "daemon off;" ]
