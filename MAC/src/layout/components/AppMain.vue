<style lang="scss" scoped>
@import "@/styles/MAC_SELF.scss";
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: $bgColor;
  font-size: 0;
  box-sizing: border-box;
  &.home {
    border: solid 17px $bgBorder;
    border-top: none;
  }
}

.fixed-header + .app-main {
  padding-top: 48px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 104px);
  }

  .fixed-header + .app-main {
    padding-top: 104px;
  }
}

.upload-mask {
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  font: {
    size: 25px;
    weight: bold;
  }
  color: black;
  opacity: 0.6;
  border: dashed #999 2px;
  display: none;
  &.hide {
    z-index: -1;
    display: none;
  }
  &.show {
    display: flex;
    z-index: 999;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
<template>
  <section class="app-main"
           @mousedown="closeUpladList"
           v-loading="isLoading"
           :class="{home:(key==='/home/file'||key.indexOf('/home/share')>-1)}"
           ref='appMain'>

    <div class='upload-mask'
         :class="isUpload&&isAllow?'show':'hide'">
      <el-upload drag
                 :before-upload="beforeUpload"
                 action=""
                 multiple>
      </el-upload>
      {{LAN.UploadCurrent}}
    </div>
    <!-- <transition name="fade-transform" -->
    <!-- mode="out-in"> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
    <!-- </transition> -->

    <upload-list ref="uploadList"></upload-list>
  </section>
</template>

<script>
import uploadList from "./uploadList";
import { mapGetters } from "vuex";
export default {
  name: "AppMain",
  components: { uploadList },
  data() {
    return {
      // 是否为上传状态
      isUpload: false,
      timeout: null,
      isAllow: false
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(newVal) {
        if (newVal.name === "homepage" || newVal.name === "editPage") {
          this.isAllow = true;
        } else {
          this.isAllow = false;
        }

        this.$store.state.app.showMask = false;
      }
    },
    isAllowUpload(newVal) {
      this.isAllow = newVal;
    },
    showMask: {
      immediate: true,
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs.appMain.ondragleave = e => {
            e.preventDefault(); // 阻止离开时的浏览器默认行为
            if (!newVal) {
              this.timeout = setTimeout(() => {
                this.isUpload = false;
              }, 1000);
            }
          };
          this.$refs.appMain.ondrop = e => {
            e.preventDefault(); // 阻止拖放后的浏览器默认行为
            if (!newVal) {
              const data = e.dataTransfer.files; // 获取文件对象
              if (data.length < 1) {
                return; // 检测是否有文件拖拽到页面
              }
              this.isUpload = false;
              // this.$store.dispatch("app/setFileList", data);
            }
          };
          this.$refs.appMain.ondragenter = e => {
            e.preventDefault(); // 阻止拖入时的浏览器默认行为
            if (!newVal) {
              clearTimeout(this.timeout);
            }
          };
          this.$refs.appMain.ondragover = e => {
            e.preventDefault(); // 阻止拖来拖去的浏览器默认行为
            if (!newVal) {
              this.isUpload = true;
              clearTimeout(this.timeout);
            }
          };
        });
      }
    }
  },
  computed: {
    ...mapGetters([
      "fileList",
      "showMask",
      "parentId",
      "parentName",
      "LAN",
      "isLoading",
      "isAllowUpload"
    ]),

    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  },
  methods: {
    closeUpladList() {
      this.$refs.uploadList.open = false;
    },
    // 上传文件夹
    beforeUpload(file, path) {
      file.parentId = this.parentId;
      file.parentName = this.parentName;

      // file.parentId
      // 在上传之前把文件传入 vuex， 在 upload-list 组件中监听 filelist 来进行队列上传
      this.$store.dispatch("app/pushFileList", file);

      return false;
    }
  },
  async created() {
    let language = localStorage.getItem("language");

    this.$store.dispatch("language/trigglerLanguage", language);
  }
};
</script>
