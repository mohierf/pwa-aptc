# -----
# For dev environment
# -----
ARG NODE_VERSION=10

# Base Node image
# Tmm image
#FROM registry.tmm-software.net/docker/node:${NODE_VERSION} as node

# -----
# Using the Node base image
FROM node:${NODE_VERSION}-slim AS node

# install dumb-init and gosu
ARG DUMB_INIT_VERSION=1.2.0
ARG GOSU_VERSION=1.10
RUN set -xe \
    && apt update \
    && apt install --no-install-recommends --yes \
        ca-certificates \
        curl \
    && curl --location --output "/usr/local/sbin/dumb-init" \
        "https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_amd64" \
    && chmod +x "/usr/local/sbin/dumb-init" \
    && curl --location --output "/usr/local/sbin/gosu" \
        "https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-amd64" \
    && chmod +sx "/usr/local/sbin/gosu" \
    && apt-mark auto '.*' > /dev/null \
    && apt purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false
# -----

ENV \
    NODE_ENV=development \
    NODE_USER=node

COPY . /srv/app-web/
COPY ./docker/node/rootfs /
WORKDIR /srv/app-web

RUN set -eux &&\
    # Set the yarn default cache location
    yarn config set cache-folder /tmp/.yarn-root-cache &&\
    # Install application dependencies
    yarn install --non-interactive --no-progress &&\
    # Install Vue-js cli
    yarn add @vue/cli@3.7.0 -g &&\
    # Build for production
    yarn build --verbose &&\
    # Fix permissions for the defined node user
    chown -R "$NODE_USER:$NODE_USER" /srv/app-web

ENTRYPOINT [ "/usr/local/sbin/dumb-init", "--", "/docker-entrypoint" ]
CMD [ "yarn", "serve" ]

# -----
# For production environment
# -----
FROM nginx:stable-alpine as nginx

ENV \
    API_ENDPOINT="http://localhost" \
    WS_ENDPOINT="http://localhost:81" \
    BRANDING="default" \
    TITLE="apTeleCare"

COPY --from=node /srv/app-web/dist /srv/app-web/dist
COPY ./docker/nginx/rootfs /
WORKDIR /srv/app-web

RUN set -eux \
    # Prepare system
    && apk add --no-cache --no-progress python2 \
    # Configure nginx
    && rm /etc/nginx/conf.d/default.conf \
    # Clean
    && rm -f -r \
           /root/.npm \
           /tmp/*

ENTRYPOINT [ "/docker-entrypoint" ]
CMD [ "nginx", "-g", "daemon off;" ]
