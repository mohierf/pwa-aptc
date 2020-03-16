<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Photos widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <b-row>
          <b-col v-if="formerPicture">
            <!-- This is a form text block (formerly known as help block) -->
            <b-form-text id="input-weight-help">
              Last picture sent on {{ lastAnswerDate }}
            </b-form-text>
            <div class="w-100 text-center p-1">
              <b-img
                :src="formerPicture"
                alt="Former picture"
                class="uploadImage"
              ></b-img>
            </div>
          </b-col>
          <b-col>
            <b-form @submit="onSubmitPicture" @reset="onResetPicture">
              <div role="group">
                <div v-if="picture" class="clearfix">
                  <div class="w-100 text-center p-1">
                    <b-img
                      :src="picture"
                      alt="Picture 1"
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
                  name="f_picture_1"
                  v-slot="{ valid, errors }"
                >
                  <b-form-group
                    id="input-group-1"
                    :label="$t('fields.f_picture')"
                    label-for="picture-1"
                    :description="$t('fields.d_picture')"
                  >
                    <b-form-file
                      id="picture-1"
                      v-model="picture"
                      capture
                      accept="image/*"
                      :state="errors[0] ? false : valid ? true : null"
                      :placeholder="$t('fields.p_picture')"
                      :browse-text="$t('actions.b_browse')"
                      :drop-placeholder="$t('fields.p_drop_picture')"
                      @change="onFileChange"
                    ></b-form-file>

                    <b-form-invalid-feedback id="input-feedback-1"
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
          </b-col>
        </b-row>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
import { backendConfig } from "../../_helpers";
import moment from "moment-timezone";
import { toApiDate, fromApiDate } from "../../_helpers";

import { mapGetters, mapActions } from "vuex";
import { mediaService } from "../../_services";

export default {
  name: "cmp-photos",
  data() {
    return {
      formerPicture: null,
      picture: null,
      my_file: null,
      medias: []
    };
  },
  props: {
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile")
  },
  computed: {
    ...mapGetters({
      valueByName: "freeActivities/valueByName",
      allValuesAnswers: "answers/allItems",
      answerByIndex: "answers/itemByIndex"
    }),
    question() {
      return this.data.question || "Tu as mal où ?";
    }
  },
  created() {
    // Event handler when a weight value is existing
    this.$root.$on("got_all_my_activities", () => {
      const photosValue = this.valueByName("APP_Photo", false);
      if (!photosValue) {
        console.error("No photos value!");
        return;
      }

      // fixme: value id should be the IRI!
      // this.id = weightValue['@id'];
      // fixme: value id should be provided as an IRI!
      this.id = photosValue["id"];
      this.iri = "/values/" + this.id;

      this.activity = photosValue.activityId;
      this.version = photosValue.version;

      // Raise a signal for the application
      this.$emit("last_values");
    });

    this.$on("last_values", () => {
      // Get the last value answer
      this.loadAllValuesAnswers({
        valueId: this.id,
        itemsCount: 1,
        sort: "DESC"
      }).then(() => {
        let firstValue = true;
        this.allValuesAnswers.forEach(item => {
          if (firstValue) {
            this.lastAnswerDate = fromApiDate(item.receiptDate, "LLL");
            this.formerPicture = `${backendConfig.apiUrl}${backendConfig.mediaEndpoint}/${item.answer.id}`;

            // Not necessary
            // mediaService.getById(item.answer.id).then(
            //   aMedia => {
            //     // console.log(aMedia)
            //     // Must rebuild image for the html control...
            //     var mimeType = "image/jpeg";
            //     var imgBase64 = new Buffer(aMedia, "binary").toString("base64");
            //     const img = "data:" + mimeType + ";base64," + imgBase64;
            //     console.log(img);
            //   },
            //   error => {
            //     console.error("Error when getting a media", error);
            //   }
            // );

            firstValue = false;
          }
        });
      });
    });
  },
  methods: {
    ...mapActions({
      loadAllActivitiesAnswers: "answers/getAllActivitiesAnswers",
      loadAllValuesAnswers: "answers/getAllValuesAnswers",
      newValue: "answers/newActivityAnswer"
    }),
    onSubmitPicture(evt) {
      evt.preventDefault();

      mediaService.newMedia(this.my_file).then(
        aMedia => {
          console.log("Posted:", aMedia);
          if (aMedia) {
            // Returns id, type, and originalName
            this.medias.push(aMedia);

            const fmtDate = toApiDate(moment());
            let answers = [
              {
                value: this.iri,
                version: this.version,
                answerDate: fmtDate,
                answer: { id: this.medias[this.medias.length - 1].id }
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
                  this.$emit("new_photo");
                }, 1000);
              })
              .catch(error => {
                console.log("Error", error);
              });
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
      let vm = this;
      const reader = new FileReader();
      reader.onload = () => {
        // vm.picture = e.target.result;
        vm.my_file = files[0];
      };
      reader.readAsDataURL(files[0]);
    },
    removeImage: function() {
      this.picture = null;
    }
  }
};
</script>

<style lang="css">
.uploadImage {
  width: 60%;
}
</style>
