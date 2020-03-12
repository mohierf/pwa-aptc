<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Photos widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <b-form @submit="onSubmitPicture" @reset="onResetPicture">
          <div role="group">
            <div v-if="picture1" class="clearfix">
              <div class="w-100 text-center p-1">
                <b-img
                  :src="picture1"
                  alt="Picture 1"
                  class="uploadImage"
                ></b-img>
              </div>
              <div class="w-100 text-center p-2">
                <b-button variant="danger" @click="removeImage1"
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
                id="input-group-1"
                :label="$t('fields.f_picture')"
                label-for="picture-1"
                :description="$t('fields.d_picture')"
              >
                <b-form-file
                  id="picture-1"
                  v-model="picture1"
                  capture
                  accept="image/*"
                  :state="errors[0] ? false : valid ? true : null"
                  :placeholder="$t('fields.p_picture')"
                  :browse-text="$t('actions.b_browse')"
                  :drop-placeholder="$t('fields.p_drop_picture')"
                  @change="onFileChange1"
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

          <div role="group">
            <div v-if="picture2" class="clearfix">
              <div class="w-100 text-center p-1">
                <b-img
                  :src="picture2"
                  alt="Picture 2"
                  class="uploadImage"
                ></b-img>
              </div>
              <div class="w-100 text-center p-2">
                <b-button variant="danger" @click="removeImage2"
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
                id="input-group-2"
                :label="$t('fields.f_picture')"
                label-for="picture-2"
                :description="$t('fields.d_picture')"
              >
                <b-form-file
                  id="picture-2"
                  v-model="picture2"
                  capture
                  accept="image/*"
                  :state="errors[0] ? false : valid ? true : null"
                  :placeholder="$t('fields.p_picture')"
                  :browse-text="$t('actions.b_browse')"
                  :drop-placeholder="$t('fields.p_drop_picture')"
                  @change="onFileChange2"
                ></b-form-file>

                <b-form-invalid-feedback id="input-feedback-2"
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
import { mapGetters, mapState } from "vuex";
import { mediaService } from "../../_services";
// import { router } from "../../_helpers";

export default {
  name: "cmp-photos",
  data() {
    return {
      picture1: null,
      picture2: null,
      file1: null,
      file2: null,
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
    ...mapState({
      values: state => state.values
    }),
    ...mapGetters({
      allItems: "medias/allItems",
      itemsCount: "medias/itemsCount",
      itemById: "medias/itemById",
      itemByName: "medias/itemByName"
    }),
    question() {
      return this.data.question || "Tu as mal où ?";
    }
  },
  created() {
    // Event handler when a weight value is existing
    this.$root.$on("exist_value_photos", () => {
      const value = this.itemByName("Photos", true);
      if (value) {
        console.warn("Found!!!!!");
      }
    });

    // Subscribe to the new weight in the store
    this.$store.subscribe(mutation => {
      if (mutation.type === "medias/setOne") {
        const value = this.itemByName("Photos", false);
        if (value) {
          console.warn("Found remote photos!", value);
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
            console.log("Last weight value:", this.weight);
            this.initialWeight = this.weight;
          } else {
            console.error("Not any last value available...");
          }
        }
      }
    });
  },
  methods: {
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
    onFileChange1(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let vm = this;
      const reader = new FileReader();
      reader.onload = e => {
        vm.picture = e.target.result;
        vm.my_file = files[0];
      };
      reader.readAsDataURL(files[0]);
    },
    onFileChange2(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let vm = this;
      const reader = new FileReader();
      reader.onload = e => {
        vm.picture = e.target.result;
        vm.my_file = files[1];
      };
      reader.readAsDataURL(files[1]);
    },
    removeImage1: function() {
      this.picture1 = null;
    },
    removeImage2: function() {
      this.picture2 = null;
    }
  }
};
</script>

<style lang="css">
.uploadImage {
  width: 60%;
}
</style>
