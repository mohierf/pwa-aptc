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
      perPage: 5,
      // The list of most useful fields
      fields: [
        // {
        //   key: "id",
        //   label: this.$t("freeActivities.fields.id")
        // },
        {
          key: "activity.name",
          label: this.$t("freeActivities.fields.name")
        },
        {
          key: "activity.description",
          label: this.$t("freeActivities.fields.description")
        },
        {
          key: "lastAnswerDate",
          label: this.$t("freeActivities.fields.lastAnswerDate")
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
      loadAllItems: "freeActivities/getAll",
      loadOne: "freeActivities/getById"
    })
  },
  computed: {
    ...mapGetters({
      isLoading: "freeActivities/isLoading",
      isLoaded: "freeActivities/isLoaded",
      isError: "freeActivities/isError",
      getError: "freeActivities/getError",
      allItems: "freeActivities/allItems",
      itemsCount: "freeActivities/itemsCount",
      itemById: "freeActivities/itemById",
      itemByName: "freeActivities/itemByName"
    }),
    rows() {
      return this.itemsCount;
    }
  },
  created() {
    this.loadAllItems()
      .then(() => {
        console.log("All loaded!");
        const allItems = this.allItems;
        allItems.forEach(async freeActivity => {
          console.log("fa: ", freeActivity.id, freeActivity.activity.name, freeActivity.lastAnswerDate);
          await this.loadOne(freeActivity.id);
        });
        // this.allItems.forEach(freeActivity => {
        //   console.log("fa: ", freeActivity.id, freeActivity.activity.name, freeActivity.lastAnswerDate);
        //   this.loadOne(freeActivity.id);
        // });
        console.log("All really loaded!")
      })
      .then(() => {
        console.log("Trying to get Poids...")
        const widget = this.itemByName("Suivi du poids");
        if (widget) {
          console.log("widget Free Activity", widget.activity);
          console.log("widget Free Activity", widget.activity.value);
        } else {
          console.error("Not found - suivi du poids!");
        }
      });
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
