// LocaleChanger.vue
<template>
  <div v-if="!dropdown" class="text-center">
    <b-list-group horizontal="sm" class="my-3 text-center">
      <b-list-group-item
        button
        :disabled="locale.code === $i18n.locale"
        @click="update_locale(locale.code)"
        v-for="locale in locales"
        :key="locale.code"
        class="w-25 mx-auto"
      >
        <img
          v-if="flag"
          :src="require('../assets/flags/' + locale.flag + '.png')"
          :height="flagHeight"
          :alt="locale.name"
        />
        <span v-if="flag && name" class="d-none d-sm-block">
          &nbsp;&nbsp;
        </span>
        <span v-if="name" class="d-none d-sm-block">
          {{ locale.name }}
        </span>
      </b-list-group-item>
    </b-list-group>
  </div>

  <b-nav-item-dropdown v-else right>
    <template v-slot:button-content>
      <img
        v-if="flag"
        :src="require('@/assets/flags/' + locales[$i18n.locale].flag + '.png')"
        height="16px"
        :alt="locales[$i18n.locale].name"
      />
      <span v-if="flag && name">
        &nbsp;&#8208;&nbsp;
      </span>
      <span v-if="name">
        {{ locales[$i18n.locale].name }}
      </span>
    </template>

    <b-dropdown-item
      @click="update_locale(locale.code)"
      v-for="locale in locales"
      :key="locale.code"
    >
      <img
        v-if="flag"
        :src="require('../assets/flags/' + locale.flag + '.png')"
        :height="flagHeight"
        :alt="locale.name"
      />
      <span v-if="flag && name">
        &nbsp;&#8208;&nbsp;
      </span>
      <span v-if="name">
        {{ locale.name }}
      </span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: "locale-changer",
  data() {
    return {
      locales: {
        en: {
          code: "en",
          flag: "gb",
          name: "English"
        },
        fr: {
          code: "fr",
          flag: "fr",
          name: "Français"
        }
      }
    };
  },
  props: {
    // true to display a drop down for a navigation bar (default: true)
    dropdown: {
      type: Boolean,
      default: true
    },
    // true to display image flags with each language (default: true)
    flag: {
      type: Boolean,
      default: true
    },
    // true to display name with each language (default: true)
    name: {
      type: Boolean,
      default: true
    },
    // set the height of the image flags (default: 32)
    flagHeight: {
      type: Number,
      default: 32
    }
  },
  methods: {
    update_locale(code) {
      // Local change signal for the root application
      this.$root.$emit("locale_signal", code);
    }
  }
};
</script>
