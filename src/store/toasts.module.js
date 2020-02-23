const state = {
  // A notifications queue
  queue: [],
  // The maximum messages count stored in the queue
  max: 10,
  // A message specific for the login/register pages
  loginMessage: null
};

const actions = {
  success({ commit }, message) {
    commit("success", message);
  },
  warning({ commit }, message) {
    commit("warning", message);
  },
  error({ commit }, message) {
    commit("error", message);
  },
  loginAlert({ commit }, message) {
    commit("loginAlert", message);
  },
  loginClear({ commit }, message) {
    commit("loginClear", message);
  }
};

const getters = {
  lastLoginMessage: _state => {
    return _state.loginMessage &&
      _state.loginMessage !== "null" &&
      _state.loginMessage !== "undefined"
      ? _state.loginMessage
      : "";
  }
};

const mutations = {
  success(_state, message) {
    // Pushes a vue-notification message in the queue
    // See https://github.com/euvl/vue-notification
    _state.queue.push({
      // title: "Success message",
      type: "success",
      duration: 5000,
      text: message
    });

    if (_state.queue.length > _state.max) {
      // Perhaps alerting would be useful?
      _state.queue.shift();
    }
  },
  warning(_state, message) {
    _state.queue.push({
      // title: "Warning message",
      type: "warn",
      duration: 5000,
      text: message
    });

    if (_state.queue.length > _state.max) {
      // Perhaps alerting would be useful?
      _state.queue.shift();
    }
  },
  error(_state, message) {
    _state.queue.push({
      // title: "Alert message",
      type: "error",
      // Very long duration to avoid making it mandatory clickable
      duration: 60000,
      text: message
    });

    if (_state.queue.length > _state.max) {
      // Perhaps alerting would be useful?
      _state.queue.shift();
    }
  },
  loginAlert(_state, message) {
    _state.loginMessage = message;
  },
  // eslint-disable-next-line no-unused-vars
  loginClear(_state, message) {
    _state.loginMessage = null;
  }
};

export const toasts = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
