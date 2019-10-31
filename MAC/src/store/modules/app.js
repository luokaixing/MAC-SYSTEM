import Cookies from "js-cookie";
import $axios from "../../utils/request";
import { Notification } from "element-ui";
import store from "../index";
import settings from "@/settings";

const state = {
  fileList: [], // 上传列表
  historyList: [], // 上传完成列表
  showMask: false,
  staticList: [],
  showInput: false,
  showCreateInput: false,
  size: Cookies.get("size") || "medium",
  languages: ["English"],
  breadList: [],
  parentId: "",
  parentName: "",
  isLoading: false, // 是否加载
  isAllowUpload: true
};

const mutations = {
  // 另存为工程文件
  COPY_ITEM: (state, obj) => {
    console.log("obj");
    console.log(obj);

    let copyItem;

    (function findItem(list) {
      return list.find(e => {
        console.log(e);

        if (+e.id === +obj.copyId) {
          copyItem = e;
          return true;
        } else if (e.children && e.children.length) {
          return findItem(e.children);
        }
      });
    })(state.staticList);

    state.staticList.forEach(e => {
      if (e.isProject) {
        console.log("e");
        console.log(e);

        e.children.push({
          ...copyItem,
          ...{ id: obj.getId, pid: e.id, name: obj.name }
        });
      }
    });
  },
  TRIGGLER_LOADING: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  SET_BREAD_LIST: (state, list) => {
    state.breadList = list;
  },
  SET_FILELIST: (state, list) => {
    state.fileList = list;
  },
  TRIGGLER_MASK: state => {
    state.showMask = !state.showMask;
  },
  SORT_STATIC_FILES: state => {
    // by:name/time/name order:0 从小往大，1从大往小
    let sortBy = localStorage.getItem("sort") || "time-0";
    let by = sortBy.split("-")[0];
    if (by === "time") by = "create_time";
    let order = sortBy.split("-")[1];
    let left = +order === 1 ? 1 : -1;
    let right = +order === 1 ? -1 : 1;

    let l = (function sortList(list) {
      list.sort((a, b) => {
        if (a.isProject === true) {
          return -1;
        }
        if (a.type === b.type) {
          if (by === "size") {
            return +a[by] > +b[by] ? left : right;
          }
          return a[by] > b[by] ? left : right;
        }
        return a.type > b.type ? 1 : -1;
      });
      list.forEach(e => {
        if (e.children) {
          e.children = sortList(e.children);
        }
      });

      return list;
    })(state.staticList);

    l = l.sort((a, b) => {
      return a.isProject ? -1 : 1;
    });

    state.staticList = l;
  },
  FILTER_REPEAT_LIST: state => {
    state.staticList = (function filterRepeatArray(list) {
      let tmpList = [];
      // list = list.sort((a, b) => {
      //   if (a.isProject === true) {
      //     return -1;
      //   }
      //   if (a.type === b.type) {
      //     return new Date(a.update_time) < new Date(b.update_time) ? 1 : -1;
      //   }
      //   return a.type > b.type ? 1 : -1;
      // });
      return list.filter(e => {
        if (e.children && e.children.length) {
          e.children = filterRepeatArray(e.children);
        }
        if (!tmpList.includes(e.id)) {
          tmpList.push(e.id);
          return true;
        } else {
          return false;
        }
      });
    })(state.staticList);
  },
  SET_LIST: (state, list) => {
    // list.sort((a, b) => {
    //   if (a.type === b.type) {
    //     return a.time < b.time ? 1 : -1;
    //   } else {
    //     return a.type > b.type ? 1 : -1;
    //   }
    // });
    state.staticList = list;
  },
  // 上传添加文件
  UPLOAD_PUSH_LIST: (state, listObj) => {
    const { parentId, file } = listObj;

    if (parentId === "") {
      state.staticList.push(file);
    } else {
      (function findChildId(list) {
        list.find(e => {
          if (e.id === parentId) {
            e.children.push(file);
            return e.id === parentId;
          } else if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(state.staticList);
    }
  },
  ADD_LIST: (state, obj) => {
    const { tmpList, checkedId } = obj;
    if (!checkedId) {
      tmpList.filter(f => {
        f.parentId = "";
      });

      state.staticList = tmpList.concat(state.staticList);

      // state.staticList.sort((a, b) => {
      //   if (a.type === b.type) {
      //     return a.time < b.time ? 1 : -1;
      //   } else {
      //     return a.type > b.type ? 1 : -1;
      //   }
      // });
    } else
      (function findChildId(list) {
        list.find(e => {
          if (e.id === checkedId) {
            // tmpList.filter(f => {
            //   f.parentId = e.id;
            // });
            e.children = tmpList.concat(e.children);
            // e.children.sort((a, b) => {
            //   if (a.type === b.type) {
            //     return a.time < b.time ? 1 : -1;
            //   } else {
            //     return a.type > b.type ? 1 : -1;
            //   }
            // });
            return e.id === checkedId;
          } else if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(state.staticList);
  },
  ADD_NEW_LIST: (state, obj) => {
    let { tmpList, checkedId } = obj;
    tmpList = (function run(list, returnList = []) {
      if (list.folder && list.folder.length) {
        returnList = returnList.concat(list.folder);
      }

      if (list.file && list.file.length) {
        list.file.filter(e => {
          e.time = new Date(e.create_time);
          e.parentId = e.pid;
          e.file_url = e.file_url
            .replace(/\\/g, "/")
            .replace("D:/offering/Mac/", settings.host);
          e.thumb_url = e.thumb_url
            .replace(/\\/g, "/")
            .replace("D:/offering/Mac/", settings.host);
        });
        returnList = returnList.concat(list.file);
      }

      list.file.forEach(e => {
        e.type = "pic";
      });

      list.folder.forEach((item, index) => {
        item.parentId = item.pid;
        item.isClose = true;
        item.type = "folder";
        item.time = new Date(item.create_time);
        returnList[index].children = run(item.children);
      });

      return returnList;
    })(tmpList);

    if (!checkedId) {
      tmpList.filter(f => {
        f.parentId = "";
      });

      state.staticList = tmpList.concat(state.staticList);
    } else
      (function findChildId(list) {
        list.find(e => {
          if (e.id === checkedId) {
            e.children = tmpList.concat(e.children);

            return e.id === checkedId;
          } else if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(state.staticList);
  },
  // 清空 ID 文件夹下的所有文件
  DROP_ID: (state, id) => {},
  // 清空列表
  DROP_LIST: (state, tmpList) => {
    // 过滤掉本身的 list
    state.staticList = (function filterList(list) {
      let i = list.filter(e => {
        if (e.children && e.children.length) {
          e.children = filterList(e.children);
        }
        if (tmpList.includes(e)) {
          return !tmpList.includes(e);
        } else {
          return true;
        }
      });
      return i;
    })(state.staticList);
  },
  SET_ISCLOSE: (state, id) => {
    (function findById(list) {
      list.find(e => {
        if (+e.id === +id) {
          e.isClose = false;
          return e.id === +id;
        } else if (e.children && e.children.length) {
          findById(e.children);
        }
      });
    })(state.staticList);
  },
  TRIGGLER_SHOWINPUT: (state, isShow) => {
    state.showInput = isShow;
  },
  TRIGGLER_CREATEINPUT: (state, isShow) => {
    state.showCreateInput = isShow;
  },
  PUSH_FILELIST: (state, file) => {
    state.fileList.push(file);
  },
  CLEAR_FILELIST: state => {
    state.fileList = [];
  },
  // 设置所有文件
  SET_STATIC_FILE_LIST: (state, fileList) => {
    state.staticList = fileList;
  },
  SET_PARENT_ID: (state, id) => {
    state.parentId = id;
  },
  SET_PARENT_NAME: (state, name) => {
    state.parentName = name;
  },
  ADD_FOLDER: (state, file) => {
    let { folder, isRoot, parentId } = file;

    folder.type = "folder";
    folder.children = [];

    if (isRoot) {
      state.staticList.unshift(folder);
    } else {
      (function findById(list) {
        list.find(e => {
          if (+e.id === +parentId) {
            e.children.unshift(folder);
            return true;
          } else if (e.children && e.children.length) {
            findById(e.children);
          }
        });
      })(state.staticList);
    }
  }
};

const actions = {
  // 排序文件
  sortStaticFiles({ commit }) {
    commit("SORT_STATIC_FILES");
  },
  /**
   *
   * @param {commit} param0
   * @param {listObj} {parentId,file}
   * 上传到接口
   */
  uploadPushList({ commit }, listObj) {
    commit("UPLOAD_PUSH_LIST", listObj);
  },
  setBreadList({ commit }, list) {
    commit("SET_BREAD_LIST", list);
  },
  // 获取上传文件
  pushFileList({ commit }, file) {
    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      // ||file.size > 10 * 1024 * 1024
    ) {
      Notification({
        type: "error",
        title: store.state.language.LAN.Error,
        message: store.state.language.LAN.PleaseUploadImage
      });
      return;
    }

    commit("PUSH_FILELIST", file);
  },
  // 清空上传文件列表
  clearFileList({ commit }) {
    commit("CLEAR_FILELIST");
  },
  // 找到 idArray 中的条目
  // allList : [ id ]
  findList({ state }, allList) {
    return new Promise((resolve, reject) => {
      let tmpList = [];
      // 查找选中的条目的对象
      (function filterCheckList(list) {
        list.filter(e => {
          if (allList.includes(e.id)) {
            tmpList.push(e);
          }
          if (e.children && e.children.length) {
            filterCheckList(e.children);
          }
        });
      })(state.staticList);

      resolve(tmpList);
    });
  },
  // 切换显示 mask
  trigglerMask({ commit }) {
    commit("TRIGGLER_MASK");
  },
  setFileList({ commit, dispatch }, list) {
    dispatch("uploadImages", list);
    // commit("SET_FILELIST", list);
  },
  // 排序
  async setList({ commit, dispatch }, list) {
    commit("SET_LIST", list);
    // dispatch("file/recursive", { list: state.staticList });
    commit("FILTER_REPEAT_LIST");
  },
  async addList({ commit, dispatch }, obj) {
    commit("ADD_LIST", obj);
    // dispatch("file/recursive", { list: state.staticList });
    commit("FILTER_REPEAT_LIST");
  },
  // 在移动或复制的时候需要此过滤
  async addNewList({ commit, dispatch }, obj) {
    commit("ADD_NEW_LIST", obj);
    // dispatch("file/recursive", { list: state.staticList });
    commit("FILTER_REPEAT_LIST");
  },
  dropList({ commit }, tmpList) {
    commit("DROP_LIST", tmpList);
  },
  setIsClose({ commit }, id) {
    commit("SET_ISCLOSE", id);
  },
  trigglerShowInput({ commit }, isShow) {
    commit("TRIGGLER_SHOWINPUT", isShow);
  },
  trigglerCreateInput({ commit }, isShow) {
    commit("TRIGGLER_CREATEINPUT", isShow);
  },
  setParentId({ commit }, id) {
    commit("SET_PARENT_ID", id);
  },
  setParentName({ commit }, name) {
    commit("SET_PARENT_NAME", name);
  },
  async createFolder({ commit, state }, file) {
    return new Promise(async (resolve, reject) => {
      const { folderName, isRoot, parentId } = file;

      let res = await $axios.post({
        url: "/folderadd",
        data: {
          // id: store.state.user.userInfo.id,
          folder_id: isRoot ? store.state.user.userInfo.id : parentId,
          folder_name: folderName
        }
      });

      if (res.data.state === "success") {
        let folder = res.data.data;
        commit("ADD_FOLDER", { folder, isRoot, parentId });
        resolve(true);
      } else {
        // Notification.error({
        //   title: store.state.language.LAN.error,
        //   message: store.state.language.LAN.NameRepeat
        // });
        resolve(false);
      }
    });
  },

  trigglerLoading({ commit }, isLoading) {
    commit("TRIGGLER_LOADING", isLoading);
  },
  // 另存为工程文件
  copyItem({ commit }, obj) {
    commit("COPY_ITEM", obj);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
