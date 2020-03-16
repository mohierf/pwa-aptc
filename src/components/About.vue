<template>
  <!--
  Modal for the app and legal information
  -----
  configurable with:
  - an identifier (modalId)
  - a title (modalTitle)
  - a size (modalSize)
  - a b-modal configuration (hereunder...)

  The content of the modal is defined in some localizable strings
  , section "about.*"
  -->
  <b-modal
    :id="modalId"
    :title="modalTitle"
    :size="modalSize || 'lg'"
    scrollable
    :header-bg-variant="headerBgVariant || 'dark'"
    :header-text-variant="headerTextVariant || 'light'"
    :body-bg-variant="bodyBgVariant || 'light'"
    :body-text-variant="bodyTextVariant || 'dark'"
    :footer-bg-variant="footerBgVariant || 'dark'"
    :footer-text-variant="footerTextVariant || 'light'"
  >
    <img
      :alt="$t('logo.alt')"
      :title="$t('logo.title')"
      src="../assets/logo.png"
      class="logo"
    />

    <h1>{{ $t("about.header") }}</h1>

    <p class="my-4 mx-4">
      {{ $t("about.p1", { name: appName }) }}
    </p>
    <p class="my-4 mx-4">
      {{ $t("about.p2", { version: appVersion }) }}
    </p>
    <p class="my-4 mx-4">
      {{ $t("about.p3") }}
    </p>

    <template v-slot:modal-footer>
      <div class="w-100 text-right">
        <footer>
          <em>{{ $t("about.footer") }}</em>
        </footer>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "modal-about",
  props: {
    modalId: String,
    modalTitle: String,
    modalSize: String,
    headerBgVariant: String,
    headerTextVariant: String,
    bodyBgVariant: String,
    bodyTextVariant: String,
    footerBgVariant: String,
    footerTextVariant: String
  },
  computed: {
    appID: function() {
      return process.env.VUE_APP_A2HS_APP_ID || "App ID not set";
    },
    appName: function() {
      return process.env.APP_NAME || "App name not set";
    },
    appVersion: function() {
      return process.env.APP_VERSION || "App version not set";
    }
  }
};
</script>

<style>
img.logo {
  width: 100%;
  max-width: 256px;
}
</style>
