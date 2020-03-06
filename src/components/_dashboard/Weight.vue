<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Weight widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
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
          ></b-form-input>
          <div class="mt-2">Value: {{ weight }}</div>

          <!-- This will only be shown if the preceding input has an invalid state -->
          <b-form-invalid-feedback id="input-weight-feedback">
            Enter a weight...
          </b-form-invalid-feedback>

          <!-- This is a form text block (formerly known as help block) -->
          <b-form-text id="input-weight-help">Your weight... and do not lie ;-)</b-form-text>
        </div>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
  import {mapGetters, mapState} from "vuex";

export default {
  name: "cmp-weight",
  data() {
    return {
      weight: 100
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
      allItems: "values/allItems",
      itemsCount: "values/itemsCount",
      itemById: "values/itemById",
      itemByName: "values/itemByName"
    }),
    weightState() {
      return this.weight > this.min && this.weight < this.max;
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
    }
  },
  created() {
    // Event handler when a weight value is existing
    this.$root.$on("exist_value_weight", () => {
      const value = this.itemByName("Poids", true);
      if (value) {
        console.warn("Found!!!!!");
      }
    });

    // Subscribe to the new weight in the store
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'values/setOne') {
        console.log(mutation, state)
        // console.log(`Updating to ${state.status}`);

        const value = this.itemByName("Poids", true);
        if (value) {
          console.warn("Found!!!!!", value);
          this.data.min = value.properties.minValue;
          this.data.max = value.properties.maxValue;
          if (value.properties.lastValueAnswer) {
            this.weight = parseInt(value.properties.lastValueAnswer.value);
          } else {
            console.error("Not any last value available...");
          }
        }
      }
    });

  },
  watch: {
    status(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (newValue === 'success') {
        this.complex = {
          deep: 'some deep object',
        };
      }
    },
  }
};
</script>
