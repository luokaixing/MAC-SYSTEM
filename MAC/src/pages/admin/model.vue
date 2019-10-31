<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
._container_ {
  height: calc(100vh - 48px);
  display: flex;
}

.el-header {
  background: #151515;
  padding: 16px 0 16px 30px;
}

.el-main {
  font-size: 14px;
  line-height: 50px;
  padding-left: 0;
  padding-right: 0;
  .body,
  .header {
    display: flex;
    padding: 0 20px;
  }
  .body {
    cursor: pointer;
    &.active {
      background-color: $active;
    }
    &:hover {
      background-color: $activeColor;
    }
  }
  .radio {
    flex: 0 0 100px;
    pointer-events: none;
  }
  .name {
    flex: 0 0 200px;
  }
  .perm {
    flex: 1;
  }
}

.model-item {
  display: inline-block;
  cursor: pointer;
  position: relative;
  .radio {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .image {
    width: 200px;
    height: 200px;
    display: block;
  }
  .image-name {
    display: block;
    font-size: 14px;
    color: #666;
    line-height: 20px;
    text-align: center;
    padding: 0 10px;
    box-sizing: border-box;
  }
}

.download-link {
  font-size: 12px;
  color: #333;
  line-height: 3;
  text-align: center;
  display: block;
  margin: 0 auto;
  text-decoration: underline;
}
</style>

<style lang='scss' type='stylesheet/scss'>
.model-item {
  img {
    pointer-events: none !important;
  }
}

.avatar-uploader .el-upload {
  width: 100%;
}
.avatar-uploader .el-upload-dragger {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  border: dashed 1px #333;
  height: 200px;
}
.avatar-uploader .el-upload-dragger:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 16px;
  color: #666;
  width: 178px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<template>
  <div class='_container_'>
    <el-container>
      <el-header>
        <div class='_prem_btn_'
             @click="uploadPSD">
          {{LAN.uploadPSD.toUpperCase()}}
        </div>

        <div class='_prem_btn_'
             v-if="checkedItem.length"
             @click="deleteModel">
          {{LAN.Delete.toUpperCase()}}
        </div>

        <div style="display:inline-block">
          <el-input class="search-input"
                    :placeholder="LAN.Search"
                    suffix-icon="el-icon-search"
                    @input="search"
                    v-model="searchValue"></el-input>
        </div>
      </el-header>
      <el-container class='content'>
        <my-aside></my-aside>
        <el-main>
          <el-scrollbar style=' height: calc(100vh - 128px);'>
            <div v-for="(item,index) in models"
                 :key="index"
                 v-show="item.isShow"
                 @click="checkItem(item.mid)"
                 class='model-item'>
              <el-image :src="item.thumb"
                        lazy
                        class='image'
                        fit="contain"></el-image>
              <span class='image-name'>{{item.name}}</span>
              <div class="radio">
                <el-checkbox-group v-model="checkedItem"
                                   v-if="checkedItem.includes(item.mid)"
                                   class='checkList'>
                  <el-checkbox class='SELF_CHECKBOX'
                               :label='item.mid'></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>

    <card :title.sync="title">
      <div class="buttons"
           v-if="type==='delete'">
        <div class='default'
             @click="cancel">{{LAN.Cancel.toUpperCase()}}</div>
        <div class='active'
             @click='confirm'>{{LAN.OK.toUpperCase()}}</div>
      </div>
      <div class="uploadPSD"
           v-if="type==='uploadPSD'">
        <el-upload class="avatar-uploader"
                   drag
                   :action="`https://mactrendsystem.rfistudios.com.cn:5678/api/resolvePSD`"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <i class="avatar-uploader-icon">{{LAN.DragPSD}}</i>
        </el-upload>
        <a :href="`${host}/tp5/public/upload/psd/upload.psd`"
           download="upload.psd"
           class="download-link">{{LAN.DownloadTemplateFile}}</a>
      </div>
    </card>
  </div>
</template>

<script type='text/ecmascript-6'>
import myAside from "./myAside";
import { mapGetters } from "vuex";
import settings from "@/settings";
export default {
  components: { myAside },
  data() {
    return {
      searchValue: "",
      // 浮层标题
      title: "",
      // 浮层类型
      type: "",
      // 用户列表
      models: [],
      // 选中
      checkedItem: [],
      host: settings.host
    };
  },
  computed: {
    ...mapGetters(["LAN", "isLoading"])
  },
  mounted() {
    this.getModel();
  },
  methods: {
    search(e) {
      // this.models.forEach(f => {
      //   f.isShow = e.split("").every(m => {
      //     return f.name.includes(m);
      //   });
      // });

      this.models.forEach(f => {
        f.isShow = f.name.indexOf(e) > -1;
      });
      // this.models.forEach(f => {
      //   if (f.name.indexOf(e) > -1) {
      //     f.isShow = true;
      //   } else {
      //     f.isShow = false;
      //   }
      // });
    },
    async handleAvatarSuccess(file) {
      console.log("file");
      console.log(file);

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

      let data = file.data;
      let res = [];

      for (let i = 0; i < data.children[0].children.length; i++) {
        let e = data.children[0].children[i];
        e.path = await this.$store.dispatch("file/perfixUrl", {
          item: e.path
        });
        let obj = {
          type: "pic",
          disable: true,
          content: "",
          rect: {
            backgroundColor: "#00000000",
            height: e.height,
            left: e.left,
            top: e.top,
            width: e.width
          },
          style: {
            bgSrc: e.path,
            left: 0,
            rotate: 0,
            scale: 100,
            top: 0
          }
        };
        console.log("obj");
        console.log(obj);

        res.unshift(obj);
      }

      data.children.forEach((e, index) => {
        let obj;
        if (index) {
          if (e.text) {
            obj = {
              type: "text",
              disable: e.disable,
              content: e.text.value,
              rect: {
                backgroundColor: "#00000000",
                height: 1,
                left: e.left,
                top: e.top,
                width: e.width
              },
              style: {
                color: `rgba(${e.text.font.colors[0]})`,
                fontSize: parseInt(e.name) * 2,
                fontStyle: e.name.indexOf("-i-") > -1 ? "italic" : "normal",
                textAlign: "center"
              }
            };
          } else {
            let bgColor = /\[#([a-fA-F\d]{6})\]/.exec(e.name);
            obj = {
              type: "pic",
              disable: e.disable,
              content: "",
              rect: {
                backgroundColor: bgColor
                  ? "#" + bgColor[1]
                  : "#" + getRandomColor(),
                height: e.height,
                left: e.left,
                top: e.top,
                width: e.width
              },
              style: {
                bgSrc: "",
                left: 0,
                rotate: 0,
                scale: 100,
                top: 0
              }
            };
          }

          res.unshift(obj);
        }
      });

      let result = await this.$axios.post({
        url: "modeladd",
        data: {
          model: JSON.stringify(res),
          width: data.document.width,
          height: data.document.height,
          name: data.document.name,
          thumb: data.document.thumb
        }
      });

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      console.log(this.isLoading);
      this.$store.dispatch("app/trigglerLoading", false);
      this.$store.dispatch("app/trigglerMask");

      this.getModel();
    },
    beforeAvatarUpload(file) {
      const isPSD = file.type === "image/vnd.adobe.photoshop";

      if (!isPSD) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.AcceptPSD
        });
      } else {
        this.$store.dispatch("app/trigglerLoading", true);
        // let psd = PSD.fromFile(file);
        return true;
      }
      return false;
    },
    checkItem(index) {
      let idx = this.checkedItem.indexOf(index);
      if (idx > -1) {
        this.checkedItem.splice(idx, 1);
      } else {
        this.checkedItem.push(index);
      }
    },
    cancel() {
      this.$store.dispatch("app/trigglerMask");
    },
    async confirm() {
      await this.$axios.post({
        url: "modeldelete",
        data: {
          id: this.checkedItem.join(",")
        }
      });
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.getModel();
      this.$store.dispatch("app/trigglerMask");
    },
    uploadPSD() {
      this.title = this.LAN.uploadPSD;
      this.type = "uploadPSD";
      this.$store.dispatch("app/trigglerMask");
    },
    deleteModel(index) {
      this.title = this.LAN.ComfirmDelete;
      this.type = "delete";
      this.$store.dispatch("app/trigglerMask");
    },
    async getModel() {
      let models = await this.$axios.post({
        url: "modelshow"
      });

      models = models.data.data;

      models.forEach(async e => {
        console.log("e");
        console.log(e);

        e.thumb = await this.$store.dispatch("file/perfixUrl", {
          item: e.thumb
        });
        e.isShow = true;
      });

      this.$nextTick(() => {
        this.models = models;
      });
    }
  }
};
</script>
