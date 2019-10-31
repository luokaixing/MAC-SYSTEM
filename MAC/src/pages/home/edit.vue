<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.edit-warpper {
  @include flexCenter;
  height: calc(100vh - 48px);
  width: 100%;
  .left,
  .right {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 300px;
    background: white;
    z-index: 8;
    box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    padding-top: $navHeight;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .staticPanel {
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 999;
    width: 512px;
    height: 683px;
  }
  .panel {
    position: relative;
    background: white;
    width: 512px;
    height: 683px;
    box-shadow: 0 2px 4px 1px rgba(40, 120, 255, 0.08),
      0 0 6px 1px rgba(0, 0, 0, 0.08);
  }
}

.zoom {
  position: fixed;
  bottom: 5px;
  right: 350px;
  color: black;
  span,
  i {
    font-size: 16px;
    vertical-align: top;
  }
  i {
    cursor: pointer;
    padding: 5px;
  }
  .number {
    font-size: 12px;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    width: 36px;
  }
}

.panPanel {
  position: fixed;
  top: $navHeight;
  left: 0;
  right: 0;
  bottom: 0;
}

.buttons-save {
  position: absolute;
  left: 50%;
  bottom: 20px;
  margin-left: -216px;
  .save,
  .prev {
    width: 144px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
  }
  .save {
    background: black;
    color: white;
  }
  .prev {
    background: white;
    color: black;
  }
}

.img-warpper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @include flexCenter;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  img {
    width: 600px;
  }
}

.ok {
  background: black;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
  display: inline-block;
}

.default-btn {
  display: inline-block;
  background: #999;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
}
</style>

<template>
  <div class='edit-warpper'
       @mousedown="clearActiveItem">

    <div class='left'
         @mousedown.stop>
      <left ref='left'
            @newProject="newProject"></left>
    </div>
    <div class='panPanel'
         v-hammer:pan='pan'
         v-hammer:panstart='panStart'
         v-hammer:panend='panEnd'></div>
    <panel class='staticPanel'
           style='background:white;z-index:-2'
           :isPrint='true'
           ref='panel'
           id='panel'></panel>
    <panel class='panel'
           id='panel'
           :projectName='MyProjectName'
           v-if="model"
           :style="{
              top:  (box.y+'px'),
              left: (box.x+'px'),
              width: model.width+'px !important',
              height: model.height+'px',
              transform: 'scale(' + (zoomNumber/100/1.5) + ')'
            }"></panel>

    <div class='zoom'>
      <i class="el-icon-zoom-out"
         @click='addZoom(-1)'></i>
      <span class='number'>{{zoomNumber}}%</span>
      <i class="el-icon-zoom-in"
         @click="addZoom(1)"></i>
    </div>
    <div class="right"
         @mousedown.stop>
      <right></right>
    </div>

    <div class='img-warpper'
         style='display:none'>
      <a :href="base64"
         :download="base64"
         ref='downloadImg'></a>
      <img :src="base64"
           draggable='false'>
    </div>

    <div class='buttons-save'>
      <div class='save'
           @click="handlerSaveProject">{{LAN.Save.toUpperCase()}}</div>
      <div class='save'
           @click="showSaveAsProject=true">{{LAN.SaveAs.toUpperCase()}}</div>
      <div class='prev'
           @click='openProject'>{{LAN.ExportTo.toUpperCase()}}</div>
    </div>

    <create-pro :title.sync='LAN.PleaseInputProjectName'
                @cancel="$router.push('/')"
                v-if="showCreateProject">
      <el-input v-model="projectName"
                style="width:100%;display:block"
                class='normal-input'
                :placeholder="LAN.PleaseInputProjectName"></el-input>
      <div class='default-btn'
           @click="cancelCreate">{{LAN.Cancel.toUpperCase()}}</div>
      <div class='ok'
           style="float:right"
           @click="submit">{{LAN.Create.toUpperCase()}}</div>
    </create-pro>

    <create-pro :title.sync='LAN.PleaseInputProjectName'
                @cancel="showSaveAsProject=false"
                v-if="showSaveAsProject">
      <el-input v-model="projectName"
                style="width:100%;"
                class='normal-input'
                :placeholder="LAN.PleaseInputProjectName"></el-input>
      <div class='default-btn'
           @click="showSaveAsProject=false">{{LAN.Cancel.toUpperCase()}}</div>
      <div class='ok'
           style="float:right"
           @click="saveAs">{{LAN.SaveAs.toUpperCase()}}</div>
    </create-pro>

    <card :title.sync='title'>
      <fold-frame v-if="openedProject"
                  @upload='upload'
                  :title.sync='LAN.ExportTo'
                  :allList='staticList'></fold-frame>

      <div class="buttons"
           v-if="openExportTo">
        <div class='default'
             style="width:200px;"
             @click="cancel">{{LAN.Cancel.toUpperCase()}}</div>
        <div class='active'
             style="width:200px;"
             @click='confirm'>{{LAN.OK.toUpperCase()}}</div>
      </div>
    </card>

  </div>
</template>

<script type='text/ecmascript-6'>
import left from "../editComp/left";
import right from "../editComp/right";
import panel from "../editComp/panel";
import html2canvas from "html2canvas";
import createPro from "./create";
import { mapGetters } from "vuex";
import foldFrame from "../comp/foldFrame";

const BORDER = 330;
const BORDERTOP = 75;
const SAFEBORER = 100;
// const TIME = 1000 * 3;
const TIME = 1000 * 60 * 10;

export default {
  components: { left, right, panel, createPro, foldFrame },
  computed: {
    ...mapGetters(["LAN", "model", "userInfo", "modelId", "staticList"])
  },
  data() {
    return {
      // 是否显示另存为
      showSaveAsProject: false,
      // 标题
      title: "",
      // 是否显示导出
      openExportTo: false,
      // 是否显示创建文件夹
      openedProject: false,
      // 工程名
      MyProjectName: "",
      // 输入的文件夹名称
      projectName: "",
      // 是否显示新建文件夹
      showCreateProject: false,
      base64: "",
      client: null,
      keydown: null,
      boxRect: null,
      box: {
        x: 0,
        y: 0,
        scale: 1
      },
      tmp: {
        x: 0,
        y: 0
      },
      tmpBox: {
        x: 0,
        y: 0
      },
      zoomNumber: 100,
      zoomMin: 20,
      zoomMax: 200,
      interval: null
    };
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  async created() {
    let id = this.$route.params.id;

    this.$store.dispatch("edit/setModel", {});

    if (!id) {
      this.showCreateProject = true;
    } else {
      let res = (await this.$axios.post({
        url: "/projectone",
        data: {
          id
        }
      })).data.data;

      this.MyProjectName = res.name;
      this.$store.dispatch("edit/setModelId", res.mid);
      this.$store.dispatch("edit/setModel", JSON.parse(res.model) || {});

      this.interval = setInterval(() => {
        this.saveProject();
      }, TIME);
    }
  },

  mounted() {
    const _this = this;

    this.client = document.body.getBoundingClientRect();

    this.keydown = function(e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      let shiftKey = event.shiftKey;

      let panel = document.querySelector("#panel").getBoundingClientRect();

      if (ctrlKey && keyCode === 189) {
        _this.addZoom(-1);
        e.preventDefault();
      }

      if (ctrlKey && keyCode === 187) {
        _this.addZoom(1);
        e.preventDefault();
      }

      if (ctrlKey && keyCode === 49) {
        _this.box.x = 0;
        _this.box.y = 0;
        _this.zoomNumber = 100;
        e.preventDefault();
      }

      if (keyCode === 9) {
        _this.$store.dispatch("edit/trigglerTab", "");
        e.preventDefault();
      }
      {
        // // 上
        // if (keyCode === 38) {
        //   if (panel.y + panel.height < BORDERTOP + SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.y--;
        // }
        // // 上10
        // if (shiftKey && keyCode === 38) {
        //   if (panel.y + panel.height < BORDERTOP + SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.y -= 9;
        // }
        // // 下
        // if (keyCode === 40) {
        //   if (panel.y > _this.client.height - SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.y++;
        // }
        // // 下10
        // if (shiftKey && keyCode === 40) {
        //   if (panel.y > _this.client.height - SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.y += 9;
        // }
        // // 左
        // if (keyCode === 37) {
        //   if (panel.x + panel.width < BORDER + SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.x--;
        // }
        // // 左10
        // if (shiftKey && keyCode === 37) {
        //   if (panel.x + panel.width < BORDER + SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.x -= 9;
        // }
        // // 右
        // if (keyCode === 39) {
        //   if (panel.x > _this.client.width - BORDER - SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.x++;
        // }
        // // 右10
        // if (shiftKey && keyCode === 39) {
        //   if (panel.x > _this.client.width - BORDER - SAFEBORER) {
        //     return false;
        //   }
        //   _this.box.x += 9;
        // }
      }
    };

    window.onresize = () => {
      this.client = document.body.getBoundingClientRect();
    };
    document.addEventListener("keydown", this.keydown);
  },
  destroyed() {
    document.removeEventListener("keydown", this.keydown, false);
  },
  methods: {
    newProject() {
      this.openExportTo = true;
      this.title = this.LAN.ConfirmCreate;
      this.$store.dispatch("app/trigglerMask");
    },
    // 取消新建
    cancelCreate() {
      this.showCreateProject = false;

      if (!this.$route.params.id) {
        this.$router.push("/");
      }
    },
    // 另存为
    async saveAs() {
      this.saveProject();

      const SIZE = 4;
      let model = JSON.parse(JSON.stringify(this.model));

      if (model.model) {
        model.width = this.model.width * SIZE;
        model.height = this.model.height * SIZE;
        this.model.model.filter((e, index) => {
          if (e.type !== "text") {
            model.model[index].rect.height = e.rect.height * SIZE;
            model.model[index].style.left = e.style.left * SIZE;
            model.model[index].style.top = e.style.top * SIZE;
          } else {
            model.model[index].style.fontSize = e.style.fontSize * SIZE;
          }
          model.model[index].rect.width = e.rect.width * SIZE;
          model.model[index].rect.left = e.rect.left * SIZE;
          model.model[index].rect.top = e.rect.top * SIZE;
        });
      }

      let res = await this.$axios.post({
        url: "projectcopy",
        data: {
          pid: this.userInfo.prorootid,
          name: this.projectName,
          model: JSON.stringify(model),
          mid: this.modelId
        }
      });

      this.$store.dispatch("app/copyItem", {
        copyId: this.$route.params.id,
        getId: res.data.data.id,
        name: res.data.data.name
      });

      // this.$notify.success({
      //   title: this.LAN.Success,
      //   message: this.LAN.SaveSuccess
      // });

      this.showSaveAsProject = false;
    },
    // 点击保存项目
    handlerSaveProject() {
      if (!this.model.mid) {
        return false;
      }
      this.saveProject();
      // this.openExportTo = true;
      // this.title = this.LAN.ConfirmCreate;

      // this.$store.dispatch("app/trigglerMask");
    },
    cancel() {
      this.openExportTo = false;
      this.$store.dispatch("app/trigglerMask");
    },
    confirm() {
      this.saveProject(() => {
        this.$router.push("/home/edit");
      });
      // this.showCreateProject = true;
      // this.$store.dispatch("app/trigglerMask");
    },
    // 上传
    async upload(checkedId) {
      this.$store.dispatch("app/trigglerLoading", true);

      await this.print();

      let res = await this.$axios.post({
        url: "baseimage",
        data: {
          pid: checkedId || this.userInfo.id,
          mid: this.model.mid,
          image: this.base64
        }
      });

      let file = res.data.data;

      file.thumb_url = await this.$store.dispatch("file/perfixUrl", {
        item: file.thumb_url
      });

      file.file_url = await this.$store.dispatch("file/perfixUrl", {
        item: file.file_url
      });

      this.$store.dispatch("app/uploadPushList", {
        parentId: checkedId,
        file
      });

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });

      this.$store.dispatch("app/trigglerLoading", false);
      this.$store.dispatch("app/trigglerMask");
    },
    // 打开项目
    openProject() {
      if (!this.model.mid) {
        return;
      }

      this.openedProject = true;
      this.title = this.LAN.ExportTo;
      this.$store.dispatch("file/trigglerIsNotProject", true);
      this.$store.dispatch("app/trigglerMask");
    },
    // 保存项目
    async saveProject(call) {
      const SIZE = 4;
      let model = JSON.parse(JSON.stringify(this.model));

      if (model.model) {
        model.width = this.model.width * SIZE;
        model.height = this.model.height * SIZE;
        this.model.model.filter((e, index) => {
          if (e.type !== "text") {
            model.model[index].rect.height = e.rect.height * SIZE;
            model.model[index].style.left = e.style.left * SIZE;
            model.model[index].style.top = e.style.top * SIZE;
          } else {
            model.model[index].style.fontSize = e.style.fontSize * SIZE;
          }
          model.model[index].rect.width = e.rect.width * SIZE;
          model.model[index].rect.left = e.rect.left * SIZE;
          model.model[index].rect.top = e.rect.top * SIZE;
        });
      }

      let res = await this.$axios.post({
        url: "projectsave",
        data: {
          id: this.$route.params.id,
          name: this.MyProjectName,
          model: JSON.stringify(model),
          mid: this.modelId
        }
      });
      this.$store.dispatch("edit/setHasSave", true);

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.SaveSuccess
      });

      call ? call() : "";
    },
    // 创建项目
    async submit() {
      if (!this.projectName.trim()) {
        this.$notify.warning({
          title: this.LAN.Warning,
          message: this.LAN.PleaseInputProjectName
        });
        return;
      }

      let res = await this.$axios.post({
        url: "projectadd",
        data: {
          pid: this.userInfo.prorootid,
          name: this.projectName.trim()
        }
      });

      console.log(res);

      let file = {
        create_time: `${new Date().getFullYear()}-${new Date().getMonth() +
          1}-${new Date().getDate()}`,
        id: res.data.data.id,
        mid: "",
        model: {},
        name: this.projectName.trim(),
        pid: this.userInfo.prorootid,
        // proid: res.data.data,
        type: "project",
        update_time: `${new Date().getFullYear()}-${new Date().getMonth() +
          1}-${new Date().getDate()}`
      };

      this.$store.dispatch("file/addNewList", {
        tmpList: [file],
        checkedId: this.userInfo.prorootid
      });
      this.$store.dispatch("app/trigglerMask");
      this.$router.push("/home/edit/" + res.data.data.id);
      this.$store.dispatch("app/sortStaticFiles");
    },
    // 导出
    async print() {
      return new Promise(async (resolve, reject) => {
        this.clearActiveItem();
        const el = this.$refs.panel.$refs.printMe;

        const canvas = await html2canvas(el, {
          backgroundColor: "#fff",
          scale: 4
        });

        let dataURL = canvas.toDataURL("image/png");

        this.base64 = dataURL;

        this.$nextTick(() => {
          // this.$refs.downloadImg.click();
          resolve();
        });
      });
    },
    // 清空
    clearActiveItem() {
      this.$store.dispatch("edit/setActiveItem", null);
    },
    addZoom(num) {
      if (num === 1) {
        if (this.zoomNumber + 20 > this.zoomMax) {
          this.zoomNumber = this.zoomMax;
        } else {
          this.zoomNumber += 20;
        }
      }

      if (num === -1) {
        if (this.zoomNumber - 20 < this.zoomMin) {
          this.zoomNumber = this.zoomMin;
        } else {
          this.zoomNumber -= 20;
        }
      }
    },
    // 拖拽事件
    // 拖拽开始
    panStart(e) {
      // 设置起始坐标
      this.tmp.x = e.center.x;
      this.tmp.y = e.center.y;
      this.tmpBox.x = this.box.x;
      this.tmpBox.y = this.box.y;
    },
    // 拖拽
    pan(e) {
      const client = document.body.getBoundingClientRect();
      const clientWidth = client.width;
      const clientHeight = client.height;
      let panel = document.querySelector("#panel").getBoundingClientRect();
      if (panel.y + SAFEBORER > clientHeight && e.center.y - this.tmp.y > 0) {
        this.panStart(e);
        return;
      }
      if (
        panel.y + panel.height - BORDERTOP - SAFEBORER < 0 &&
        e.center.y - this.tmp.y < 0
      ) {
        this.panStart(e);
        return;
      }
      if (
        panel.x + BORDER + SAFEBORER > clientWidth &&
        e.center.x - this.tmp.x > 0
      ) {
        this.panStart(e);
        return;
      }
      if (
        panel.x + panel.width - BORDER - SAFEBORER < 0 &&
        e.center.x - this.tmp.x < 0
      ) {
        this.panStart(e);
        return;
      }

      this.box.x = e.center.x - this.tmp.x + this.tmpBox.x;
      this.box.y = e.center.y - this.tmp.y + this.tmpBox.y;
    },
    // 拖拽结束
    panEnd(e) {
      this.tmp.x = 0;
      this.tmp.y = 0;
    }
  }
};
</script>
