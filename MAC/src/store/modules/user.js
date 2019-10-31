import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import axios from "axios";
import $axios from "../../utils/request";
import settings from "@/settings";
import { Notification } from "element-ui";
import store from "../index";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  userInfo: null,
  roles: [],
  perms: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMS: (state, perm) => {
    state.perms = perm;
  },
  SET_INFO: (state, info) => {
    state.userInfo = info;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise(async (resolve, reject) => {
      let res = await axios({
        method: "POST",
        url: settings.baseUrl + "login",
        data: {
          name: userInfo.username,
          password: userInfo.password
        }
      });

      if (res.data.state !== "success") {
        reject(res.data.msg);
      }

      if (+res.data.code === -2) {
        Notification.error({
          title: store.state.language.LAN.Error,
          message: store.state.language.LAN.PasswordError
        });
        reject();
      } else if (+res.data.code === -3) {
        Notification.error({
          title: store.state.language.LAN.Error,
          message: store.state.language.LAN.NoEmail
        });
        reject();
      } else if (+res.data.code === -4) {
        Notification.error({
          title: store.state.language.LAN.Error,
          message: store.state.language.LAN.AccountDisable
        });
        reject();
      } else if (+res.data.code === 0) {
        Notification.success({
          title: store.state.language.LAN.Success,
          message: store.state.language.LAN.Success
        });
        if (res.status === 200) {
          let token = res.data.data.token;

          if (token) {
            commit("SET_TOKEN", token);
            setToken(token);

            resolve();
          } else {
            reject();
          }
        }
      }
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      // const users = {
      //   "admin-token": {
      //     roles: ["admin"],
      //     introduction: "I am a super administrator",
      //     avatar:
      //       "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      //     name: "Super Admin"
      //   },
      //   "editor-token": {
      //     roles: ["editor"],
      //     introduction: "I am an editor",
      //     avatar:
      //       "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      //     name: "Normal Editor"
      //   }
      // };

      // const data = users[state.token];

      let res = await $axios.post({
        url: "foldershow"
      });

      commit("SET_INFO", res.data.data.user);
      commit("SET_ROLES", [res.data.data.user.roles]);
      commit("SET_PERMS", res.data.data.user.perm);
      resolve(res);

      // if (!data) {
      //   reject("Verification failed, please Login again.");
      // }

      // const { roles, name, avatar, introduction } = data;

      // // roles must be a non-empty array
      // if (!roles || roles.length <= 0) {
      //   reject("getInfo: roles must be a non-null array!");
      // }

      // commit("SET_ROLES", roles);
      // commit("SET_NAME", name);
      // commit("SET_AVATAR", avatar);
      // commit("SET_INTRODUCTION", introduction);

      // resolve(data);
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token)
      // .then(() => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resetRouter();
      resolve();
      // })
      // .catch(error => {
      //   reject(error);
      // });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, {
        root: true
      });

      resolve();
    });
  },

  getRoles() {
    return new Promise(async (resolve, reject) => {
      let res = await $axios.post({
        url: "rolelist"
      });

      resolve(res.data.data);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
