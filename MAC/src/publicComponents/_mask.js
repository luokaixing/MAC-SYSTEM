import maskComp from "./_mask.vue";

const card = {
  install: function (Vue) {
    Vue.component("card", maskComp);
  }
};

export default card;
