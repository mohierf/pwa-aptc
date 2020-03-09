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

        <b-form @submit="onSubmitPicture" @reset="onResetPicture">
          <div role="group">
            <div v-if="picture" class="clearfix">
              <div class="w-100 text-center p-1">
                <b-img
                  :src="picture"
                  alt="Problem illustration picture"
                  class="uploadImage"
                ></b-img>
              </div>
              <div class="w-100 text-center p-2">
                <b-button variant="danger" @click="removeImage"
                  >{{ $t("actions.b_remove") }}
                </b-button>
              </div>
            </div>
            <ValidationProvider
              v-else
              rules="image"
              name="f_picture"
              v-slot="{ valid, errors }"
            >
              <b-form-group
                id="input-group-3"
                :label="$t('fields.f_picture')"
                label-for="input-3"
                :description="$t('fields.d_picture')"
              >
                <b-form-file
                  id="input-3"
                  v-model="picture"
                  capture
                  accept="image/*"
                  :state="errors[0] ? false : valid ? true : null"
                  :placeholder="$t('fields.p_picture')"
                  :browse-text="$t('actions.b_browse')"
                  :drop-placeholder="$t('fields.p_drop_picture')"
                  @change="onFileChange"
                  ref="fileInput"
                ></b-form-file>

                <b-form-invalid-feedback id="inputLiveFeedback"
                  >{{ errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>
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
import { mapGetters, mapState, mapActions } from "vuex";
import moment from "moment-timezone";
import { mediaService } from "../../_services";
// import { router } from "../../_helpers";

export default {
  name: "cmp-weight",
  data() {
    return {
      weight: 100,
      initialWeight: 100,
      picture: null,
      my_file: null,
      this.medias: []
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
    },
    unit() {
      return this.data.unit || "Kg";
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
    this.$store.subscribe(mutation => {
      if (mutation.type === "values/setOne") {
        const value = this.itemByName("Poids", false);
        if (value) {
          console.warn("Found remote weight!", value);
          // fixme: value id should be the IRI!
          // this.id = value['@id'];
          // fixme: value id should be provided as an IRI!
          this.id = "/values/" + value["id"];

          this.activity = value.activityId;
          this.version = value.version;

          this.data.min = value.properties.minValue;
          this.data.max = value.properties.maxValue;
          this.data.unit = value.properties.unitLiteral;
          if (value.properties.lastValueAnswer) {
            this.weight = parseInt(value.properties.lastValueAnswer.value);
            this.initialWeight = this.weight;
          } else {
            console.error("Not any last value available...");
          }
        }
      }
    });
  },
  methods: {
    ...mapActions("values", ["newValue"]),
    // ...mapActions("media", ["newMedia"]),
    onWeightChange() {
      // Update data on modal state change
      console.log("Changed for: ", this.weight);
    },
    onSubmit(evt) {
      evt.preventDefault();
      // Format the moment.js date to a string
      const answerDate = moment();
      const fmtDate = answerDate.format("YYYY-MM-DD hh:mm:ss");
      let answers = [
        {
          value: this.id,
          version: this.version,
          answerDate: fmtDate,
          answer: { value: this.weight }
        }
      ];
      this.raise({
        answerDate: fmtDate,
        activity: this.activity,
        valueAnswers: answers
      }).then(() => {
        // Raise a signal for the root application
        this.$root.$emit("new_log");
      });
    },
    onReset() {
      this.weight = this.initialWeight;
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    onSubmitPicture(evt) {
      evt.preventDefault();

      mediaService.newMedia(this.my_file).then(
        aMedia => {
          if (aMedia) {
            // Returns id, type, and originalName
            this.medias.push(aMedia);
          }
        },
        error => {
          console.error("Error when posting a media", error);
        }
      );
    },
    onResetPicture() {
      this.picture = null;
      this.medias = [];
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      let vm = this;
      const reader = new FileReader();
      reader.onload = e => {
        vm.picture = e.target.result;
        vm.my_file = file;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function() {
      this.picture = null;
    }
  },
  watch: {
    status(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (newValue === "success") {
        this.complex = {
          deep: "some deep object"
        };
      }
    }
  }
};
</script>

<style lang="css">
.uploadImage {
  width: 60%;
}
</style>
