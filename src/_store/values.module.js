const state = {
  status: "",
  items: [],
  countItems: 0,
  totalItems: 0
};

const actions = {
  setOne({ commit }, data) {
    commit("setOne", data);
  }
};

const mutations = {
  setOne(_state, data) {
    _state.status = "success";

    console.warn("Values getOne: ", data);
    let found = _state.items.find(item => item.id === data.id);
    if (found) {
      const index = _state.items.find(item => item.id === data.id);
      // Remove unused information
      delete data["patient"];
      delete data["prescriber"];
      _state.items[index] = data;
    } else {
      _state.items.push(data);
    }

    // Make it more configurable
    const weightValue = data.name.includes("Poids");
    if (weightValue) {
      console.log("this", this);
      // Raise an event because the user weight is needed
      // this.$root.$emit("exist_value_weight");
    }

    console.warn("Values count: ", _state.items.length);
  }
};

const getters = {
  itemsCount: _state => _state.items.length,
  allItems: _state => _state.items,
  itemById: _state => uuid => {
    return _state.items.find(item => item.id === uuid);
  },
  itemByName: _state => (name, log = false) => {
    const found = _state.items.find(item => item.name.includes(name));
    console.log("Found value by name: ", found);
    console.log("Found value by name: ", found && found.name);

    if (found && log) {
      console.log("av: ", found.id, found.name);
      console.log("- type: ", found.type);
      console.log("- version: ", found.version);
      console.log("- question: ", found.question);
      // console.log(
      //     "- author: ",
      //     found.author.id,
      //     found.author.firstname,
      //     found.author.lastname
      // );
      console.log("- board display: ", found.boardDisplay);
      console.log("- mandatory answer: ", found.mandatoryAnswer);

      console.log("- properties: ", found.properties);
      console.log("  - bounds type: ", found.properties.boundsType);
      // console.log("  - bounds types: ", found.properties.boundsTypes);
      console.log("  - min value: ", found.properties.minValue);
      console.log("  - max value: ", found.properties.maxValue);
      console.log("  - computed min value: ", found.properties.computedMinValue);
      console.log("  - computed max value: ", found.properties.computedMaxValue);
      console.log("  - reference value: ", found.properties.referenceValue);
      console.log("  - initial value: ", found.properties.initialValue);
      // console.log("  - initial value options: ", found.properties.initialValueOptions);
      console.log("  - step: ", found.properties.step);
      // console.log("  - steps: ", found.properties.steps);
      // console.log("  - unit: ", found.properties.unit);
      console.log("  - unit literal: ", found.properties.unitLiteral);
    }
    return found;
  }
};

export const values = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
