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
            <b-form-text id="input-weight-help">
              Last answer: {{ weight }} sent on {{ lastAnswerDate }}
            </b-form-text>
          </div>

          <b-button type="submit" variant="primary">
            <font-awesome-icon icon="share" />
            &nbsp;{{ $t("actions.b_alert") }}
          </b-button>
        </b-form>

        <div class="container">
          <line-chart v-if="loaded" :chartdata="chartData" :options="options" />
        </div>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
// import { store } from "../../_store";
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment-timezone";
// import { answerService } from "../../_services";
import { toApiDate, fromApiDate } from "../../_helpers";

export default {
  name: "cmp-weight",
  data() {
    return {
      weight: 10,
      initialWeight: 0,
      lastAnswerDate: null,
      // Chart
      loaded: false,
      chartData: {
        labels: ["A", "B", "C"],
        datasets: [
          {
            label: this.$t("weight.graph_label"),
            backgroundColor: "rgba(102, 16, 242, 0.5)",
            data: [1, 25, 12]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: true
            }
          ],
          yAxes: [
            {
              beginAtZero: true,
              ticks: {
                suggestedMin: 30,
                suggestedMax: 150
              }
            }
          ]
        }
      },
      chartLabels: [],
      chartValues: []
    };
  },
  props: {
    /*
     * data may contain: min, max, step, value
     */
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile"),
    LineChart: () => import("../LineChart")
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

      // fixme: value id should be the IRI!
      // this.id = weightValue['@id'];
      // fixme: value id should be provided as an IRI!
      this.id = weightValue["id"];
      this.iri = "/values/" + this.id;

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

      // Raise a signal for the application
      this.$emit("last_values");
    });

    this.$on("last_values", () => {
      this.chartLabels = [];
      this.chartValues = [];

      // Get the last value answer
      this.loadAllValuesAnswers({
        valueId: this.id,
        itemsCount: 20,
        sort: "DESC"
      }).then(() => {
        this.loaded = false;
        let firstValue = true;
        this.allValuesAnswers.forEach(item => {
          if (firstValue) {
            // const ad = fromApiDate(item.answerDate);
            this.lastAnswerDate = fromApiDate(item.receiptDate, "LLL");
            this.weight = parseInt(item.answer.value);
            this.initialWeight = this.weight;

            firstValue = false;
          }

          this.chartLabels.unshift(fromApiDate(item.receiptDate, "LLL"));
          this.chartValues.unshift(parseInt(item.answer.value));
        });

        // Update chart data
        this.chartData.labels = this.chartLabels;
        this.chartData.datasets[0].data = this.chartValues;
        this.loaded = true;
      });
    });

    this.$on("new_weight", () => {
      this.loaded = false;

      // Get the last value answer
      this.loadAllValuesAnswers({
        valueId: this.id,
        itemsCount: 1,
        sort: "DESC"
      }).then(() => {
        this.allValuesAnswers.forEach(item => {
          this.chartLabels.push(fromApiDate(item.receiptDate, "LLL"));
          this.chartValues.push(parseInt(item.answer.value));
        });

        // Update chart data
        this.chartData.labels = this.chartLabels;
        this.chartData.datasets[0].data = this.chartValues;
        this.loaded = true;
      });
    });
  },
  methods: {
    ...mapActions({
      loadAllActivitiesAnswers: "answers/getAllActivitiesAnswers",
      loadAllValuesAnswers: "answers/getAllValuesAnswers",
      newValue: "answers/newActivityAnswer"
    }),
    onWeightChange() {
      // Update data on slider state change
      console.log("Changed for: ", this.weight);
    },
    onSubmit(evt) {
      evt.preventDefault();

      const fmtDate = toApiDate(moment());
      let answers = [
        {
          value: this.iri,
          version: this.version,
          answerDate: fmtDate,
          answer: { value: this.weight }
        }
      ];

      this.newValue({
        answerDate: fmtDate,
        activity: this.activity,
        valueAnswers: answers
      })
        .then(rsp => {
          console.log("Updated !", rsp);
          // Raise a signal for the application
          setTimeout(() => {
            this.$emit("new_weight");
          }, 1000);
        })
        .catch(error => {
          console.log("Error", error);
        });
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
