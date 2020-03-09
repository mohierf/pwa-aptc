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
import { store } from "../../_store";
import { router } from "../../_helpers";

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
      loadAllFreeActivities: "freeActivities/getAll",
      loadOneFreeActivity: "freeActivities/getById"
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
    // Event handler when all activities were fully loaded
    this.$root.$on("got_all_activities", () => {
      store.dispatch("toasts/success", router.app.$t("activities.ok_message"), {
        root: true
      });

      const activity = this.itemByName("Suivi du poids");
      if (activity) {
        console.log("Activity:", activity.activity["@id"]);

        const allValues = activity.activity.activityValues;
        for (let index = 0; index < allValues.length; index++) {
          const value = allValues[index].value;

          // Ignore not active values
          if (value.active) {
            // Add the activity IRI in the value data for the answer
            value["activityId"] = activity.activity["@id"];
            store.commit("values/setOne", value, { root: true });
          } else {
            console.warn("Activity is not active: ", value.name);
          }
        }
      } else {
        console.error("Not found - suivi du poids!");
      }
    });

    this.loadAllFreeActivities().then(() => {
      // Synchronise to be sure to get real activities...
      const start = async () => {
        const allItems = this.allItems;
        // Use a for() loop because forEach is not really able to chain promises:/
        for (let index = 0; index < allItems.length; index++) {
          const freeActivity = allItems[index];
          await this.loadOneFreeActivity(freeActivity.id);
        }

        // Raise an event when all activities are fully loaded
        this.$root.$emit("got_all_activities");
      };
      start();
    });
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
