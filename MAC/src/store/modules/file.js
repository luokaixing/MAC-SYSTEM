import Cookies from "js-cookie";
import $axios from "../../utils/request";
import { Notification } from "element-ui";
import store from "../index";
import settings from "@/settings";

const state = {
  isNotProject: false
};

const mutations = {
  // SET_STATIC_FILE_LIST(state, list) {
  // }

  TRIGGLER_IS_NOT_PROJECT(state, isNotProject) {
    state.isNotProject = isNotProject;
  }
};

const actions = {
  // 修复前缀
  perfixUrl({}, { item, preText = "D:/offering/Mac/" }) {
    return item.replace(/\\/g, "/").replace(preText, settings.host);
  },
  // 递归数据
  recursive({ dispatch }, { list, call }) {
    return new Promise(resolve => {
      // 排序
      // list.sort((a, b) => {
      //   if (a.isProject === true) {
      //     return -1;
      //   }
      //   if (a.type === b.type) {
      //     return new Date(a.create_time) < new Date(b.create_time) ? 1 : -1;
      //   }
      //   return a.type > b.type ? 1 : -1;
      // });
      // 拿到子文件处理
      list.filter(e => {
        if (e.children && e.children.length) {
          // 继续递归
          dispatch("recursive", { list: e.children, call });
        }
        // 回调
        call(e);
      });
      // 返回
      resolve(list);
    });
  },
  // 修复 list 的图片前缀
  async preFixFileList({ dispatch }, list) {
    let r = await dispatch("recursive", {
      list,
      call: async res => {
        if (res.type === "pic") {
          res.thumb_url = await dispatch("perfixUrl", { item: res.thumb_url });
          res.file_url = await dispatch("perfixUrl", { item: res.file_url });
        } else {
          res.isClose = true;
        }
        res.parentId = res.pid;
      }
    });
    return r;
  },
  // 设置 staticList 的文件
  async setStaticFileList({ commit, dispatch }, fileList) {
    let tmpList = await dispatch("preFixFileList", fileList);

    commit("app/SET_STATIC_FILE_LIST", tmpList, { root: true });
  },
  renameItem({ commit, state }, item) {
    return new Promise(async (resolve, reject) => {
      let res = await $axios.post({
        url: "/rename",
        data: {
          id: item.id,
          name: item.name
        }
      });

      if (res.data.state === "success") {
        item.name = res.data.data.name;
        resolve(true);
      } else {
        Notification.error({
          title: store.state.language.LAN.Error,
          message: store.state.language.LAN.NameRepeat
        });
        resolve(false);
      }
    });
  },
  async createFolder({ commit, state }, file) {
    return new Promise(async (resolve, reject) => {
      const { folderName, isRoot, parentId } = file;

      let res = await $axios.post({
        url: "/folderadd",
        data: {
          folder_id: isRoot ? store.state.user.userInfo.id : parentId,
          folder_name: folderName
        }
      });

      if (res.data.state === "success") {
        let folder = res.data.data;
        folder.name = folderName;
        commit("app/ADD_FOLDER", { folder, isRoot, parentId }, { root: true });
        resolve(true);
      } else {
        Notification.error({
          title: store.state.language.LAN.error,
          message: store.state.language.LAN.NameRepeat
        });
        resolve(false);
      }
    });
  },
  async addNewList({ rootState, commit, dispatch }, obj) {
    let { tmpList, checkedId } = obj;

    if (checkedId === "") {
      rootState.app.staticList = rootState.app.staticList.concat(tmpList);
    } else {
      (function findById(list) {
        list.find(e => {
          if (+e.id === +checkedId) {
            e.children = e.children.concat(tmpList);
            return true;
          } else if (e.children && e.children.length) {
            findById(e.children);
          }
        });
      })(rootState.app.staticList);
    }

    await dispatch("preFixFileList", rootState.app.staticList);
  },
  trigglerIsNotProject({ commit }, isNotProject) {
    commit("TRIGGLER_IS_NOT_PROJECT", isNotProject);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
