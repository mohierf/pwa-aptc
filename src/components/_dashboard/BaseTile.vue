<template>
  <!--
  Tuile de base pour le dashboard
  -----
  configurable par un object data qui peut contenir:
  - la configuration d'un b-card (voir ci-dessous)
  - le nom d'une icône Font Awesome (icon)
  - sa taille (iconSize)
  - son texte d'accompagnement (iconText)
  - sa position (iconPosition: left, right)
  - un texte (text) qui se situera en légende sous l'icône

  Si data n'est pas fourni on affiche un texte d'erreur.
  -->
  <b-card
    v-if="data"
    :title="data.title"
    :sub-title="data.subTitle"
    :bg-variant="data.bgVariant || 'light'"
    :text-variant="data.textVariant || 'grey'"
    :border-variant="data.borderVariant || 'primary'"
    :header="data.header"
    :header-bg-variant="data.headerBgVariant || 'primary'"
    :header-text-variant="data.headerTextVariant || 'white'"
    :footer="data.footer"
    :footer-bg-variant="data.footerBgVariant || 'secondary'"
    :footer-text-variant="data.footerTextVariant || 'white'"
  >
    <div>
      <slot name="name" v-if="showName">
        <cite>I am a Base tile widget #{{ _uid }} : {{ data }}</cite>
      </slot>
    </div>

    <slot name="body">
      <div class="align-middle clearfix">
        <b-link
          v-if="data.url"
          :href="data.url"
          :target="data.urlTarget || '_blank'"
        >
          <b-card-text v-if="data.icon || data.iconText">
            <font-awesome-icon
              v-if="data.icon"
              :icon="data.icon"
              :size="data.iconSize || '3x'"
              :pull="data.iconPosition"
            ></font-awesome-icon>
            <span v-if="data.iconText">
              {{ data.iconText }}
            </span>
          </b-card-text>
          <b-card-text v-if="!data.icon && !data.iconText">
            <font-awesome-icon
              icon="angry"
              :size="data.iconSize || '3x'"
              :pull="data.iconPosition"
            ></font-awesome-icon>
          </b-card-text>
        </b-link>
        <div v-else>
          <b-card-text v-if="data.icon || data.iconText">
            <font-awesome-icon
              v-if="data.icon"
              :icon="data.icon"
              :size="data.iconSize || '3x'"
              :pull="data.iconPosition"
            ></font-awesome-icon>
            <span v-if="data.iconText">
              {{ data.iconText }}
            </span>
          </b-card-text>
          <b-card-text v-if="!data.icon && !data.iconText">
            <font-awesome-icon
              icon="angry"
              :size="data.iconSize || '3x'"
              :pull="data.iconPosition"
            ></font-awesome-icon>
          </b-card-text>
        </div>
      </div>
      <div>
        <b-card-text v-if="data.text" class="text-body">
          {{ data.text }}
        </b-card-text>
      </div>
    </slot>

    <slot v-if="data.url && data.showDownloadMessage" name="download">
      <hr />
      <em v-if="data.downloadMessage">
        {{ data.downloadMessage }}
      </em>
      <em v-else>
        {{ $t("download") }}
      </em>
    </slot>
  </b-card>
  <b-card v-else bg-variant="danger" text-variant="white">
    <slot name="name">
      <cite>Missing configuration data for the HelloTile component</cite>
    </slot>
  </b-card>
</template>

<script>
export default {
  name: "cmp-base-tile",
  props: {
    data: Object
  },
  data() {
    return {
      showName: false
    };
  }
};
</script>

<i18n>
{
  "en": {
    "download": "Click on the icon or text to navigate."
  },
  "fr": {
    "download": "Cliquer sur l'icône ou le nom pour naviguer."
  }
}
</i18n>
