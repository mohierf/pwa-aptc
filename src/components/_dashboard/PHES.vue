<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a PHES widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <em v-if="phes.status === 'loading'">
          <font-awesome-icon icon="spinner" size="2x" spin></font-awesome-icon>
          &nbsp; {{ $t("actions.t_loading") }}
        </em>
        <div v-else-if="phes.status === 'error'" class="m-3 bg-danger">
          <h1>Could not get phes: {{ phes.error }}!</h1>
        </div>
        <div v-else-if="phes.status === 'success' && phes.items">
          <div v-if="phes.items.length > 0">
            <b-table
              :id="'table-phes-' + _uid"
              :sticky-header="data.tableHeaderCss"
              :caption="data.tableCaption"
              caption-top
              :per-page="perPage"
              :current-page="currentPage"
              :items="phes.items"
              :fields="fields"
              primary-key="name"
              :responsive="data.tableResponsive"
            >
              <!-- A custom formatted column -->
              <template v-slot:cell(name)="data">
                <div class="align-middle">
                  <b-link
                    v-if="data.item.url"
                    :href="data.item.url"
                    target="_blank"
                  >
                    <div>
                      <font-awesome-icon
                        icon="file-alt"
                        size="4x"
                      ></font-awesome-icon>
                    </div>
                    <div>
                      <strong class="text-primary">{{
                        data.item.description
                      }}</strong>
                    </div>
                  </b-link>
                </div>
              </template>
            </b-table>

            <b-pagination
              v-if="phes.items && phes.items.length > perPage"
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              hide-goto-end-buttons
              size="sm"
              aria-controls="table-phes"
              align="right"
            ></b-pagination>
          </div>
          <div v-else class="text-warning">
            {{ $t("phes.no_items") }}
          </div>
        </div>
        <div v-else class="text-warning">
          No known phes!
        </div>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "cmp-phes",
  data() {
    return {
      currentPage: 1,
      perPage: 2,
      // The list of most useful fields
      fields: [
        {
          key: "id",
          label: this.$t("phes.fields.id")
        },
        {
          key: "title",
          label: this.$t("phes.fields.title")
        }
        // {
        //   key: "category",
        //   label: this.$t("phes.fields.category")
        // },
        // {
        //   key: "description",
        //   label: this.$t("phes.fields.description")
        // }
      ]
    };
  },
  props: {
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile")
  },
  computed: {
    ...mapState({
      phes: state => state.phes
    }),
    rows() {
      return this.phes.items.length;
    }
  },
  created() {
    this.$store.dispatch("phes/getAll");
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
