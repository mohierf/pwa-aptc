import Vue from "vue";
import { required, email, image } from "vee-validate/dist/rules";
import { extend, configure, localize } from "vee-validate";
import { ValidationProvider, ValidationObserver } from "vee-validate";

// Use Vue-i18n for validation messages locales
import { i18n } from "./i18n";
configure({
  defaultMessage: (field, values) => {
    // override the field name.
    values._field_ = i18n.t(`fields.${field}`);

    return i18n.t(`validation.${values._rule_}`, values);
  }
});

export default function update_locale(code) {
  // Vee-validation locale update
  localize(code);
}

// Install required rule
extend("required", required);

// Install email rule
extend("email", email);

// Install image rule
extend("image", image);

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
