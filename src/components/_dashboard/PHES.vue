<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a PHES widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <em v-if="isLoading">
          <font-awesome-icon icon="spinner" size="2x" spin></font-awesome-icon>
          &nbsp; {{ $t("actions.t_loading") }}
        </em>
        <div v-else-if="isError" class="m-3 bg-danger">
          <h1>Could not get PHEs: {{ getError }}!</h1>
        </div>
        <div v-else-if="isLoaded">
          <div v-if="itemsCount > 0">
            <b-table
              :id="'table-phes-' + _uid"
              :sticky-header="data.tableHeaderCss"
              :caption="data.tableCaption"
              caption-top
              :per-page="perPage"
              :current-page="currentPage"
              :items="allItems"
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
                      <strong class="text-primary">
                        {{ data.item.description }}</strong
                      >
                    </div>
                  </b-link>
                </div>
              </template>
            </b-table>

            <b-pagination
              v-if="itemsCount > perPage"
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "cmp-phes",
  data() {
    return {
      currentPage: 1,
      perPage: 2,
      // The list of most useful fields
      fields: [
        // {
        //   key: "id",
        //   label: this.$t("phes.fields.id")
        // },
        {
          key: "title",
          label: this.$t("phes.fields.title")
        },
        {
          key: "type",
          label: this.$t("phes.fields.type")
        },
        {
          key: "description",
          label: this.$t("phes.fields.description")
        }
      ]
    };
  },
  props: {
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile")
  },
  methods: {
    ...mapActions({
      loadAllItems: "phes/getAll"
    })
  },
  computed: {
    ...mapGetters({
      isLoading: "phes/isLoading",
      isLoaded: "phes/isLoaded",
      isError: "phes/isError",
      getError: "phes/getError",
      allItems: "phes/allItems",
      itemsCount: "phes/itemsCount",
      itemById: "phes/itemById"
    }),
    rows() {
      return this.itemsCount;
    }
  },
  created() {
    this.loadAllItems();
    //
    // this.$store
    //   .dispatch("phes/getById", "97621464-3044-4a04-adc3-68dd7af08c30")
    //   .then(() => {
    //     const widget = this.itemById("97621464-3044-4a04-adc3-68dd7af08c30");
    //     console.log("widget PHEs", widget);
    //   });
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
