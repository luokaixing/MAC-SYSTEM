import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import "swiper/dist/css/swiper.css"; // swiper 样式
import "./fonts/stylesheet.css"; // swiper 样式

import i18n from "./i18n/i18n";

import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);

import Element from "element-ui";
import "./styles/element-variables.scss";

import contentmenu from "v-contextmenu";
import "v-contextmenu/dist/index.css";

Vue.use(contentmenu);

import "@/styles/index.scss"; // global css
// import "./styles/MAC_SELF.scss"; // 自定义样式

import App from "./App";
import store from "./store";
import router from "./router";

// 复制
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log

import permission from "@/directive/permission/index.js";
Vue.directive("permission", permission);

import * as filters from "./filters"; // global filters

import card from "./publicComponents/_mask";
Vue.use(card);

import server from "./utils/request";
Vue.prototype.$axios = server;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from "../mock";
// if (process.env.NODE_ENV === "production") {
//   mockXHR();
// }

Vue.use(Element, {
  size: Cookies.get("size") || "medium" // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

Vue.prototype.$fillForm = function() {
  this.$notify.warning({
    title: "Warning",
    message: "Please complete the form"
  });
};

// 获取随机数
Vue.prototype.$getRandom = function(num) {
  return Math.ceil(num * Math.random());
};

Vue.directive("focus", {
  inserted: function(el) {
    // 聚焦元素
    el.focus();
    el.select();
  }
});

Vue.directive("enter", {
  inserted: function(el) {
    setTimeout(() => {
      el.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          el.blur();
        }
      });
    }, 300);
  }
});

new Vue({
  el: "#app",
  i18n,
  router,
  store,
  render: h => h(App)
});
