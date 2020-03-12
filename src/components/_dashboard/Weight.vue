<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Weight widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <b-form @submit="onSubmit" @reset="onReset">
          <div role="group">
            <label for="input-weight">{{ question }}</label>
            <b-form-input
              id="input-weight"
              type="range"
              :min="minimum"
              :max="maximum"
              :step="step"
              v-model="weight"
              :state="weightState"
              aria-describedby="input-weight-help input-weight-feedback"
              placeholder="Enter your weight"
              trim
              @change="onWeightChange"
            ></b-form-input>
            <div class="mt-2">Value: {{ weight }} {{ unit }}</div>

            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-weight-feedback">
              Enter a weight...
            </b-form-invalid-feedback>

            <!-- This is a form text block (formerly known as help block) -->
            <b-form-text id="input-weight-help"
              >Your weight... and do not lie ;-)
            </b-form-text>
          </div>

          <b-button type="submit" variant="primary">
            <font-awesome-icon icon="share" />
            &nbsp;{{ $t("actions.b_alert") }}
          </b-button>
        </b-form>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
// import { store } from "../../_store";
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment-timezone";
import { answerService } from "../../_services";

export default {
  name: "cmp-weight",
  data() {
    return {
      weight: 10,
      initialWeight: 0,
      picture: null,
      my_file: null,
      medias: []
    };
  },
  props: {
    /*
     * data may contain: min, max, step, value
     */
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile")
  },
  computed: {
    ...mapState({
      values: state => state.values
    }),
    ...mapGetters({
      valueByName: "freeActivities/valueByName",
      allValuesAnswers: "answers/allItems",
      answerByIndex: "answers/itemByIndex"
    }),
    weightState() {
      return this.weight >= this.data.min && this.weight <= this.data.max;
    },
    question() {
      return this.data.question || "Tu pèses combien ?";
    },
    minimum() {
      return this.data.min || 30;
    },
    maximum() {
      return this.data.max || 500;
    },
    step() {
      return this.data.step || 5;
    },
    unit() {
      return this.data.unit || "Kg";
    }
  },
  created() {
    this.$root.$on("got_all_my_activities", () => {
      const weightValue = this.valueByName("Poids", false);
      if (!weightValue) {
        console.error("No weight value!");
        return;
      }
      console.log(weightValue);

      // Store apart the found value
      // store.commit("values/setOne", weight);

      // fixme: value id should be the IRI!
      // this.id = weightValue['@id'];
      // fixme: value id should be provided as an IRI!
      this.id = "/values/" + weightValue["id"];

      this.activity = weightValue.activityId;
      this.version = weightValue.version;

      this.data.min = weightValue.properties.minValue;
      this.data.max = weightValue.properties.maxValue;
      this.data.unit = weightValue.properties.unitLiteral;
      if (
        weightValue.properties.initialValue &&
        weightValue.properties.initialValue === "lastPatientValue"
      ) {
        if (weightValue.properties.lastValueAnswer) {
          this.weight = parseInt(weightValue.properties.lastValueAnswer.value);
          this.initialWeight = this.weight;
        }
      }

      // Get the last activity answer
      this.loadAllActivitiesAnswers({
        activityId: this.activity,
        itemsCount: 1
      }).then(answers => {
        console.log("Got all activity answers", answers);
      });

      // Get the last value answer
      this.loadAllValuesAnswers({
        valueId: weightValue["id"],
        itemsCount: 1
      }).then(answers => {
        console.log("Got all answers", answers);
        console.log("Yes, I got them all:", this.answerByIndex(0));
      });
    });
  },
  methods: {
    ...mapActions({
      loadAllActivitiesAnswers: "answers/getAllActivitiesAnswers",
      loadAllValuesAnswers: "answers/getAllValuesAnswers"
    }),
    onWeightChange() {
      // Update data on slider state change
      console.log("Changed for: ", this.weight);
    },
    onSubmit(evt) {
      evt.preventDefault();
      // Format the moment.js date to a string
      const answerDate = moment();
      const fmtDate = answerDate.format("YYYY-MM-DD hh:mm:ss");
      console.log(answerDate.format(), answerDate.utc().format());
      let answers = [
        {
          value: this.id,
          version: this.version,
          answerDate: fmtDate,
          answer: { value: this.weight }
        }
      ];

      console.log(fmtDate, this.activity, answers);
      answerService.newValue(fmtDate, this.activity, answers).then(
        aValue => {
          if (aValue) {
            console.log(aValue);
            // Returns id, type, and originalName
            // this.medias.push(aService);
          }
        },
        error => {
          console.error("Error when posting answers", error);
        }
      );
    },
    onReset() {
      this.weight = this.initialWeight;
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
</script>
