<template>
  <!--
  Modal pour l'affichage des informations légales
  -----
  configurable avec les propriétés suivantes:
  - un identifiant (modalId)
  - un titre (modalTitle)
  - une taille (modalSize)
  - la configuration d'un b-modal (voir ci-dessous)

  Le contenu de la modal est défini dans les chaines de caractères
  localisables, section "legals.*"
  -->
  <b-modal
    :id="modalId"
    :title="modalTitle"
    :size="modalSize || 'xl'"
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
      class="float-left logo"
    />

    <div class="float-right">
      <h1>{{ $t("legals.header") }}</h1>

      <p class="my-4 mx-4" v-html="$t('legals.p1')"></p>
      <p class="my-4 mx-4" v-html="$t('legals.p2')"></p>
      <p class="my-4 mx-4" v-html="$t('legals.p3')"></p>
      <p class="my-4 mx-4" v-html="$t('legals.p4')"></p>
      <p class="my-4 mx-4" v-html="$t('legals.p5')"></p>
    </div>

    <template v-slot:modal-footer>
      <div class="w-100 text-right">
        <footer>
          <em>{{ $t("legals.footer") }}</em>
        </footer>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "modal-legals",
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
  }
};
</script>

<style>
img.logo {
  width: 100%;
  max-width: 256px;
}
</style>
