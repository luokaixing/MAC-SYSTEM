import Cookies from "js-cookie";

const state = {
  // sidebar: {
  //   opened: Cookies.get("sidebarStatus")
  //     ? !!+Cookies.get("sidebarStatus")
  //     : true,
  //   withoutAnimation: false
  // },
  // device: "desktop",
  // size: Cookies.get("size") || "medium",
  fileList: [],
  historyList: [],
  showMask: false,
  staticList: [],
  showInput: false,
  showCreateInput: false
};

const mutations = {
  // TOGGLE_SIDEBAR: state => {
  //   state.sidebar.opened = !state.sidebar.opened;
  //   state.sidebar.withoutAnimation = false;
  //   if (state.sidebar.opened) {
  //     Cookies.set("sidebarStatus", 1);
  //   } else {
  //     Cookies.set("sidebarStatus", 0);
  //   }
  // },
  // CLOSE_SIDEBAR: (state, withoutAnimation) => {
  //   Cookies.set("sidebarStatus", 0);
  //   state.sidebar.opened = false;
  //   state.sidebar.withoutAnimation = withoutAnimation;
  // },
  // TOGGLE_DEVICE: (state, device) => {
  //   state.device = device;
  // },
  // SET_SIZE: (state, size) => {
  //   state.size = size;
  //   Cookies.set("size", size);
  // },
  SET_FILELIST: (state, list) => {
    state.fileList = list;
  },
  ADD_HISTORY_LIST: (state, dom) => {
    state.historyList.push(dom);
  },
  TRIGGLER_MASK: state => {
    state.showMask = !state.showMask;
  },
  FILTER_REPEAT_LIST: state => {
    state.staticList = (function filterRepeatArray(list) {
      let tmpList = [];
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
    list.sort((a, b) => {
      if (a.type === b.type) {
        return a.time < b.time ? 1 : -1;
      } else {
        return a.type > b.type ? 1 : -1;
      }
    });
    state.staticList = list;
  },
  ADD_LIST: (state, obj) => {
    const { tmpList, checkedId } = obj;
    if (!checkedId) {
      tmpList.filter(f => {
        f.parentId = "";
      });
      state.staticList = state.staticList.concat(tmpList);

      state.staticList.sort((a, b) => {
        if (a.type === b.type) {
          return a.time < b.time ? 1 : -1;
        } else {
          return a.type > b.type ? 1 : -1;
        }
      });
    } else
      (function findChildId(list) {
        list.find(e => {
          if (e.id === checkedId) {
            tmpList.filter(f => {
              f.parentId = e.id;
            });
            e.children = e.children.concat(tmpList);
            e.children.sort((a, b) => {
              if (a.type === b.type) {
                return a.time < b.time ? 1 : -1;
              } else {
                return a.type > b.type ? 1 : -1;
              }
            });
            return e.id === checkedId;
          } else if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(state.staticList);
  },
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
  }
};

const actions = {
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
  trigglerMask({ commit }) {
    commit("TRIGGLER_MASK");
  },
  setFileList({ commit }, list) {
    commit("SET_FILELIST", list);
  },
  addUploadHistoryList({ commit }, item) {
    commit("ADD_HISTORY_LIST", item);
  },
  setList({ commit }, list) {
    commit("SET_LIST", list);
    commit("FILTER_REPEAT_LIST");
  },
  addList({ commit }, obj) {
    commit("ADD_LIST", obj);
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
  }
  // toggleSideBar({ commit }) {
  //   commit("TOGGLE_SIDEBAR");
  // },
  // closeSideBar({ commit }, { withoutAnimation }) {
  //   commit("CLOSE_SIDEBAR", withoutAnimation);
  // },
  // toggleDevice({ commit }, device) {
  //   commit("TOGGLE_DEVICE", device);
  // },
  // setSize({ commit }, size) {
  //   commit("SET_SIZE", size);
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
