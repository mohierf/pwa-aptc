<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Daily Message widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <b-carousel
          id="carousel-1"
          v-model="slide"
          :interval="10000"
          background="#343434"
          img-width="1024"
          img-height="640"
          style="text-shadow: 1px 1px 2px #666;"
          @sliding-start="onSlideStart"
          @sliding-end="onSlideEnd"
        >
          <b-carousel-slide
            v-if="allMessages && allMessages[0]"
            img-blank
            img-alt="Blank image"
          >
            <p>{{ allMessages[0] }}</p>
          </b-carousel-slide>
          <b-carousel-slide
            v-if="allMessages && allMessages[1]"
            img-blank
            img-alt="Blank image"
          >
            <p>{{ allMessages[1] }}</p>
          </b-carousel-slide>
          <b-carousel-slide
            v-if="allMessages && allMessages[2]"
            img-blank
            img-alt="Blank image"
          >
            <p>{{ allMessages[2] }}</p>
          </b-carousel-slide>
          <b-carousel-slide
            v-if="allMessages && allMessages[3]"
            img-blank
            img-alt="Blank image"
          >
            <p>{{ allMessages[3] }}</p>
          </b-carousel-slide>
          <b-carousel-slide
            v-if="allMessages && allMessages[4]"
            img-blank
            img-alt="Blank image"
          >
            <p>{{ allMessages[4] }}</p>
          </b-carousel-slide>
        </b-carousel>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "cmp-daily-message",
  data() {
    return {
      dailyMessage: "",
      slide: 0,
      sliding: null
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
    ...mapGetters({
      allMessages: "dailyMessages/allItems"
    })
  },
  created() {
    this.$root.$on("got_all_my_messages", () => {
      console.log("Messages", this.allMessages);
    });
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    }
  }
};
</script>
