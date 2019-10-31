const getRandomColor = function() {
  let string = "";
  let codeArray = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E"
  ];

  string += codeArray[parseInt(Math.random() * codeArray.length)];
  string += codeArray[parseInt(Math.random() * codeArray.length)];

  return string + string + string;
};

const getRandom = function(num) {
  return parseInt(Math.random() * num);
};

const state = {
  isLeft: true,
  activeItem: null,
  modelList: [
    // {
    //   name: "",
    //   mid: getRandom(1e16),
    //   width: 2048,
    //   height: 2732,
    //   model: [
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 300,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       content: "LIPSTICK",
    //       rect: {
    //         left: 0,
    //         top: 90,
    //         width: 2048,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 82,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       content: "#COLOR",
    //       rect: {
    //         left: 54,
    //         top: 418,
    //         width: 460,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 88,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       content: "#色号",
    //       rect: {
    //         left: 54,
    //         top: 540,
    //         width: 410,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 54,
    //         top: 656,
    //         width: 1948,
    //         height: 2045,
    //         backgroundColor: "#e5e5e5"
    //       }
    //     }
    //   ]
    // },
    // {
    //   name: "",
    //   mid: getRandom(1e16),
    //   width: 2048,
    //   height: 2732,
    //   model: [
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 0,
    //         top: 0,
    //         width: 1024,
    //         height: 1366,
    //         backgroundColor: "#f1f0f0"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1025,
    //         top: 0,
    //         width: 1024,
    //         height: 1366,
    //         backgroundColor: "#f3f3f3"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 0,
    //         top: 1367,
    //         width: 1024,
    //         height: 1366,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1025,
    //         top: 1367,
    //         width: 1024,
    //         height: 1366,
    //         backgroundColor: "#f1f0f0"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 446,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "LIPSTICK",
    //       rect: {
    //         left: 0,
    //         top: 1110,
    //         width: 2048,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 98,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "#COLOR",
    //       rect: {
    //         left: 820,
    //         top: 1595,
    //         width: 406,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     }
    //   ]
    // },
    // {
    //   name: "",
    //   mid: getRandom(1e16),
    //   width: 2048,
    //   height: 2732,
    //   model: [
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 0,
    //         top: 0,
    //         width: 1024,
    //         height: 912,
    //         backgroundColor: "#e5e5e5"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1025,
    //         top: 0,
    //         width: 1024,
    //         height: 912,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 0,
    //         top: 913,
    //         width: 1024,
    //         height: 912,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1025,
    //         top: 913,
    //         width: 1024,
    //         height: 912,
    //         backgroundColor: "#e5e5e5"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 0,
    //         top: 1824,
    //         width: 1024,
    //         height: 908,
    //         backgroundColor: "#e5e5e5"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1025,
    //         top: 1824,
    //         width: 1024,
    //         height: 908,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: require("@/assets/logo-white.png")
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 374,
    //         top: 932,
    //         width: 1300,
    //         height: 130,
    //         backgroundColor: "#eeeeee00"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 400,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "LIPSTICK",
    //       rect: {
    //         left: 0,
    //         top: 1076,
    //         width: 2048,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 72,
    //         fontStyle: "italic",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "#COLOR",
    //       rect: {
    //         left: 827,
    //         top: 1512,
    //         width: 394,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 144,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#dbdbdb"
    //       },
    //       language: "Chinese",
    //       thumb: "",
    //       content: "请输入文字",
    //       rect: {
    //         left: 626,
    //         top: 1627,
    //         width: 796,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     }
    //   ]
    // },
    // {
    //   name: "",
    //   mid: getRandom(1e16),
    //   width: 2048,
    //   height: 2732,
    //   model: [
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 227,
    //         top: 648,
    //         width: 1594,
    //         height: 1787,
    //         backgroundColor: "#e5e5e5"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: require("@/assets/logo-black.png")
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 622,
    //         top: 100,
    //         width: 804,
    //         height: 92,
    //         backgroundColor: "#00"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 66,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#000000"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "XXXXXXXXXX",
    //       rect: {
    //         left: 524,
    //         top: 226,
    //         width: 998,
    //         height: 1,
    //         backgroundColor: "#dcdcdc"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 66,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#000000"
    //       },
    //       language: "English",
    //       thumb: "",
    //       content: "XXXXXXXXXX",
    //       rect: {
    //         left: 524,
    //         top: 324,
    //         width: 998,
    //         height: 1,
    //         backgroundColor: "#dcdcdc"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 50,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#000000"
    //       },
    //       language: "Chinese",
    //       thumb: "",
    //       content: "#COLOR",
    //       rect: {
    //         left: 894,
    //         top: 430,
    //         width: 260,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 50,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#000000"
    //       },
    //       language: "Chinese",
    //       thumb: "",
    //       content: "XXX",
    //       rect: {
    //         left: 922,
    //         top: 570,
    //         width: 206,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "text",
    //       style: {
    //         fontSize: 40,
    //         fontStyle: "normal",
    //         textAlign: "center",
    //         color: "#000000"
    //       },
    //       language: "Chinese",
    //       thumb: "",
    //       content: "XXXXXXXXXX",
    //       rect: {
    //         left: 777,
    //         top: 2472,
    //         width: 494,
    //         height: 1,
    //         backgroundColor: "#eeeeee"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 316,
    //         top: 524,
    //         width: 1416,
    //         height: 12,
    //         backgroundColor: "#000000"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 1722,
    //         top: 524,
    //         width: 12,
    //         height: 2034,
    //         backgroundColor: "#000000"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 316,
    //         top: 2547,
    //         width: 1416,
    //         height: 12,
    //         backgroundColor: "#000000"
    //       }
    //     },
    //     {
    //       id: getRandom(1e16),
    //       type: "pic",
    //       disable: true,
    //       style: {
    //         left: 0,
    //         top: 0,
    //         scale: 100,
    //         rotate: 0,
    //         bgSrc: ""
    //       },
    //       content: "",
    //       // 基于模板的坐标及大小
    //       rect: {
    //         left: 316,
    //         top: 524,
    //         width: 12,
    //         height: 2034,
    //         backgroundColor: "#000000"
    //       }
    //     }
    //   ]
    // }
  ],
  model: null,
  modelId: "",
  isSave: true
};

const mutations = {
  TRIGGLER_TAB: (state, isLeft) => {
    if (isLeft === "") {
      state.isLeft = !state.isLeft;
    } else {
      state.isLeft = isLeft;
    }
  },
  SET_ACTIVE_ITEM: (state, item) => {
    state.activeItem = item;
  },
  SET_MODEL: (state, models) => {
    state.model = models;
  },
  SET_MODEL_LIST: (state, modelList) => {
    state.modelList = modelList;
  },
  SET_MODEL_ID: (state, modelId) => {
    state.modelId = modelId;
  },
  SET_HAS_SAVE: (state, isSave) => {
    state.isSave = isSave;
  }
};

const actions = {
  trigglerTab({ commit }, isLeft) {
    commit("TRIGGLER_TAB", isLeft);
  },
  setActiveItem({ commit }, item) {
    commit("SET_ACTIVE_ITEM", item);
  },
  setModel({ commit }, models) {
    const SIZE = 4;

    let model = {};

    if (models.model) {
      model = JSON.parse(JSON.stringify(models));
      model.width = models.width / SIZE;
      model.height = models.height / SIZE;
      models.model.filter((e, index) => {
        if (e.type !== "text") {
          model.model[index].rect.height = e.rect.height / SIZE;
          model.model[index].style.left = e.style.left / SIZE;
          model.model[index].style.top = e.style.top / SIZE;
        } else {
          model.model[index].style.fontSize = e.style.fontSize / SIZE;
        }
        model.model[index].rect.width = e.rect.width / SIZE;
        model.model[index].rect.left = e.rect.left / SIZE;
        model.model[index].rect.top = e.rect.top / SIZE;
      });
    }
    commit("SET_MODEL", model);
  },
  setModelList({ commit }, modelList) {
    commit("SET_MODEL_LIST", modelList);
  },
  setModelId({ commit }, modelId) {
    commit("SET_MODEL_ID", modelId);
  },
  setHasSave({ commit }, isSave) {
    commit("SET_HAS_SAVE", isSave);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
