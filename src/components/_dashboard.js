// From https://fr.vuejs.org/v2/guide/components-registration.html#Enregistrement-global-automatique-des-composants-de-base
// and https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js
// -----
// Globally register all dashboard components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from "vue";

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the dashboard dedicated directory
  "./_dashboard",
  // Do not look in subdirectories
  false,
  // Include all .vue files
  /[A-Za-z0-9-_,\s]+\.vue$/
);

// For each matching file name...
requireComponent.keys().forEach(fileName => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = fileName
    // Remove the "./" from the beginning
    .replace(/^\.\//, "")
    // Remove the file extension from the end
    .replace(/\.\w+$/, "")
    // Split up kebabs
    .split("-")
    // Upper case
    .map(kebab => kebab.charAt(0).toUpperCase() + kebab.slice(1))
    // Concatenated
    .join("");

  // Globally register the component
  // Force prepend Cmp for all the loaded components
  Vue.component(
    "Cmp" + componentName,
    componentConfig.default || componentConfig
  );
});
