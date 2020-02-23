<template>
  <cmp-base-tile :data="data">
    <template v-slot:name>
      <cite>I am a Mood widget #{{ _uid }} : {{ data }}</cite>
    </template>

    <template v-slot:body>
      <b-card-text>
        <font-awesome-icon
          icon="angry"
          :size="data.iconSize || '3x'"
          :pull="data.iconPosition"
        ></font-awesome-icon>
        <font-awesome-icon
          icon="angry"
          :size="data.iconSize || '3x'"
          :pull="data.iconPosition"
        ></font-awesome-icon>
        <font-awesome-icon
          icon="angry"
          :size="data.iconSize || '3x'"
          :pull="data.iconPosition"
        ></font-awesome-icon>
      </b-card-text>
    </template>
  </cmp-base-tile>
</template>

<script>
export default {
  name: "cmp-mood",
  props: {
    data: Object
  },
  components: {
    CmpBaseTile: () => import("./BaseTile")
  }
};
</script>
