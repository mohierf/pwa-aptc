//src/components/FooterBar.vue
<template>
  <div>
    <ModalLegals
      modalId="modal-legals"
      :modalTitle="$t('legals.title')"
      modalSize="xl"
      headerBgVariant="primary"
      footerBgVariant="primary"
    ></ModalLegals>

    <b-navbar toggleable="md" type="light" variant="light" fixed="bottom">
      <b-container fluid="md">
        <span>{{ $t("footer.message") }}</span>
        <router-link v-b-modal="'modal-legals'" to="/legals">
          {{ $t("actions.b_legals") }}
        </router-link>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import ModalLegals from "@/components/Legals.vue";

export default {
  name: "footer-bar",
  components: {
    ModalLegals
  },
  data() {
    return {
      modalId: "modal-legals",
      modalShow: false
    };
  }
};
</script>
