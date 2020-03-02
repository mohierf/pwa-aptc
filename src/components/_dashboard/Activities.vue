<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Activities widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <em v-if="isLoading">
          <font-awesome-icon icon="spinner" size="2x" spin></font-awesome-icon>
          &nbsp; {{ $t("actions.t_loading") }}
        </em>
        <div v-else-if="isError" class="m-3 bg-danger">
          <h1>Could not get activities: {{ getError }}!</h1>
        </div>
        <div v-else-if="isLoaded">
          <div v-if="itemsCount > 0">
            <b-table
              :id="'table-activities-' + _uid"
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
              aria-controls="table-activities"
              align="right"
            ></b-pagination>
          </div>
          <div v-else class="text-warning">
            {{ $t("freeActivities.no_items") }}
          </div>
        </div>
        <div v-else class="text-warning">
          No known activities!
        </div>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "cmp-activities",
  data() {
    return {
      currentPage: 1,
      perPage: 2,
      // The list of most useful fields
      fields: [
        {
          key: "id",
          label: this.$t("freeActivities.fields.id")
        },
        {
          key: "activity.name",
          label: this.$t("freeActivities.fields.name")
        }
        // {
        //   key: "category",
        //   label: this.$t("freeActivities.fields.category")
        // },
        // {
        //   key: "description",
        //   label: this.$t("freeActivities.fields.description")
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
  methods: {
    ...mapActions({
      loadAllItems: "freeActivities/getAll"
    })
  },
  computed: {
    ...mapGetters({
      isLoading: "freeActivities/isLoading",
      isLoaded: "freeActivities/isLoaded",
      isError: "freeActivities/isError",
      getError: "freeActivities/getError",
      allItems: "freeActivities/allItems",
      itemsCount: "freeActivities/itemsCount"
    }),
    rows() {
      return this.itemsCount;
    }
  },
  created() {
    this.loadAllItems();
    //
    // this.$store.dispatch("activities/getById", { id: 42 }).then(() => {
    //   const widget = this.$store.getters["activities/byId"]({ id: 42 });
    //   console.log(widget);
    // });
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
