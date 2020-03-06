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
      console.log("Got all !");

      console.log("Trying to get Poids...");
      const widget = this.itemByName("Suivi du poids");
      if (widget) {
        console.log("Found");

        const allItems = widget.activity.activityValues;
        for (let index = 0; index < allItems.length; index++) {
          const activityValue = widget.activity.activityValues[index];
          const value = activityValue.value;
          console.log("av: ", value);

          // Ignore not active values
          if (value.active) {
            store.commit("values/setOne", value, { root: true });

            // console.log("av: ", value.id, value.name);
            // console.log("- type: ", value.type);
            // console.log("- version: ", value.version);
            // console.log("- question: ", value.question);
            // console.log(
            //   "- author: ",
            //   value.author.id,
            //   value.author.firstname,
            //   value.author.lastname
            // );
            // console.log("- board display: ", value.boardDisplay);
            // console.log("- mandatory answer: ", value.mandatoryAnswer);
            //
            // console.log("- properties: ", value.properties);
            // console.log("  - bounds type: ", value.properties.boundsType);
            // console.log("  - bounds types: ", value.properties.boundsTypes);
            // console.log("  - min value: ", value.properties.minValue);
            // console.log("  - max value: ", value.properties.maxValue);
            // console.log(
            //   "  - computer min value: ",
            //   value.properties.computedMinValue
            // );
            // console.log(
            //   "  - computed max value: ",
            //   value.properties.computedMaxValue
            // );
            // console.log(
            //   "  - reference value: ",
            //   value.properties.referenceValue
            // );
            // console.log("  - initial value: ", value.properties.initialValue);
            // console.log(
            //   "  - initial value options: ",
            //   value.properties.initialValueOptions
            // );
            // console.log("  - step: ", value.properties.step);
            // console.log("  - steps: ", value.properties.steps);
            // console.log("  - unit: ", value.properties.unit);
            // console.log("  - unit literal: ", value.properties.unitLiteral);
          } else {
            console.warn("Activity is not active: ", value.name);
          }
        }
      } else {
        console.error("Not found - suivi du poids!");
      }
    });

    this.loadAllFreeActivities().then(() => {
      console.log("Loaded all activities (first run only)!");

      // Synchronise to be sure to get real activities...
      const start = async () => {
        const allItems = this.allItems;
        // Use a for() loop because forEach is not really able to chain promises:/
        for (let index = 0; index < allItems.length; index++) {
          const freeActivity = allItems[index];
          // console.log("fa: ", freeActivity.id, freeActivity.activity.name);
          await this.loadOneFreeActivity(freeActivity.id);
        }
        console.log("All activities are now really loaded!");

        // Raise an event when all activities are really loaded
        this.$root.$emit("got_all_activities");
      };
      start();

      // return Promise.resolve("All");
    });
  }
};
</script>

<style>
table > thead {
  display: none !important;
}
</style>
