<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.btn-warpper {
  background: $bgBorder;
  padding: 16px 0;

  .btn-right {
    float: right;
    display: flex;
    .lan {
      float: left;
      width: 40px;
      height: 40px;
      background: white;
      @include flexCenter;
    }
    .sort {
      margin-left: 20px;
      float: left;
      .column {
        &.default {
          background: #484848;
          .line {
            background: #eaeaea;
          }
        }
        &.active {
          background: white;
          .line {
            background: $main;
          }
        }
        float: left;
        width: 28px;
        height: 28px;

        @include flexCenter;
        flex-direction: column;
        .line {
          width: 16px;
          height: 2px;
          margin-bottom: 4px;
          &:last-child {
            margin: 0;
          }
        }
      }
      .array {
        &.default {
          background: #484848;
          .box {
            border: solid 2px #eaeaea;
          }
        }
        &.active {
          background: white;
          .box {
            border: solid 2px $main;
          }
        }
        float: left;
        width: 28px;
        height: 28px;
        @include flexCenter;
        flex-wrap: wrap;
        padding: 6px;
        .box {
          border-radius: 2px;
          width: 6px;
          height: 6px;
          margin: 1px;
        }
      }
    }
  }
}
.share {
  .input-item {
    margin: 0 auto;
    display: block;
    font-size: 12px;
    width: 440px;
    height: 38px;
    color: #999;
    padding: 20px 27px;
    border: solid 1px #999;
    box-sizing: border-box;
    margin-bottom: 20px;
    &::placeholder {
      color: #999;
    }
  }
  .ok {
    background: black;
    color: white;
    font-size: 14px;
    line-height: 48px;
    width: 150px;
    margin: 0 auto;
    text-align: center;
    margin-top: 40px;
    cursor: pointer;
  }
}
.inputs {
  display: flex;
  .link-item {
    font-size: 12px;
    color: #999;
    line-height: 38px;
    padding: 0 27px;
    box-sizing: border-box;
    @include overflow1;
    display: inline-block;
    border: solid 1px #999;
  }
  .left {
    flex: 1;
    width: 0;
    margin-right: 30px;
  }
  .right {
    width: 140px;
    text-align: center;
  }
}
.upload-btn {
  position: relative;
  .upload-el {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    opacity: 0;
  }
}
</style>

<template>
  <div class="btn-warpper"
       @click='emptyCheckList'>
    <el-upload :before-upload="beforeUpload"
               action=""
               ref='upload'
               class='upload-el'
               multiple>
      <div ref="uploadBtn">HIDDEN~</div>
    </el-upload>
    <div class='_prem_btn_ upload-btn'
         v-permission="['m:edit']"
         @click.stop="$router.push('/home/edit')">
      {{LAN.CreateProject.toUpperCase()}}
    </div>

    <div class='_prem_btn_ upload-btn'
         v-if='isNotProject'
         @click.stop="upload">

      <i class="el-icon-upload2"></i>
      {{LAN.Upload.toUpperCase()}}
    </div>

    <div class='_prem_btn_'
         @click.stop="newFolder">
      <i class="el-icon-plus"></i>
      {{LAN.NewFolder.toUpperCase()}}
    </div>

    <div class='_prem_btn_'
         v-show="checkList.length&&isNotProject"
         v-permission="['m:home']"
         @click.stop='showMask("share")'>
      {{LAN.Share.toUpperCase()}}
    </div>
    <div class='_prem_btn_'
         @click='download'
         @click.stop
         v-if="checkList.length&&isNotProject">
      <i class="el-icon-download"></i>
      {{LAN.Download.toUpperCase()}}
    </div>

    <div v-if="checkList.length"
         style="display:inline-block">
      <div class='_prem_btn_group_'
           v-if="checkList.length===1"
           @click.stop="rename">
        {{LAN.Rename.toUpperCase()}}
      </div>
      <div class='_prem_btn_group_'
           @click.stop="showMask('drop')">
        {{LAN.Delete.toUpperCase()}}
      </div>
      <div class='_prem_btn_group_'
           @click.stop="showMask('copy')">
        {{LAN.CopyTo.toUpperCase()}}
      </div>
      <div class='_prem_btn_group_'
           @click.stop="showMask('move')">
        {{LAN.MoveTo.toUpperCase()}}
      </div>

    </div>

    <div class="btn-right"
         @click.stop>
      <!-- <div class='lan'>
        <img src="@/assets/icons/lan.png"
             class='lan-icon'>
      </div> -->
      <div class='sort'>
        <div class='column'
             @click="trigglerSort(true)"
             :class="isColumn?'active':'default'">
          <div class='line'
               v-for='i in 3'></div>
        </div>
        <div class='array'
             @click="trigglerSort(false)"
             :class="!isColumn?'active':'default'">
          <div class='box'
               v-for='i in 4'></div>
        </div>
      </div>
    </div>

    <card :title.sync='title'>
      <fold-frame v-if="type==='move'||type==='copy'"
                  :title.sync='title'
                  :type='type'
                  :allList='allList'
                  @emptyCheckList='emptyCheckList'></fold-frame>
      <div class="buttons"
           v-if="type==='drop'">
        <div class='default'
             @click="cancel">{{LAN.Cancel.toUpperCase()}}</div>
        <div class='active'
             @click='confirm'>{{LAN.OK.toUpperCase()}}</div>
      </div>
      <div class='share'
           v-if="type==='share'"
           :title='LAN.YourShareLink'>
        <div class='inputs'>
          <div class='link-text left link-item'>{{settings.host}}#/home/share/{{link}}</div>
          <div class='link-pass right link-item'>{{password}}</div>
        </div>
        <div class='ok'
             v-clipboard:copy='`${LAN.YourShareLink}: ${settings.host}#/home/share/${link}\n${LAN.Password}: ${password}`'
             @click="copyLinkScuccess">{{LAN.CopyLink.toUpperCase()}}</div>
      </div>
    </card>

    <a download="MAC.zip"
       :href="downloadImgSrc"
       ref='downloadImg'
       style="display:none"></a>
  </div>
</template>

<script type='text/ecmascript-6'>
import foldFrame from "./foldFrame";
import settings from "@/settings";
import { mapGetters } from "vuex";
export default {
  components: { foldFrame },
  props: ["isColumn", "allList", "checkList"],
  data() {
    return {
      settings,
      downloadImgSrc: "",
      title: "",
      type: "",
      password: "",
      link: ""
    };
  },
  watch: {
    breadList: {
      immediate: true,
      handler(newVal) {
        if (newVal.length && newVal[0].id === this.userInfo.prorootid) {
          this.$store.dispatch("file/trigglerIsNotProject", false);
          // this.isNotProject = false;
        } else {
          this.$store.dispatch("file/trigglerIsNotProject", true);
        }
      }
    }
  },
  methods: {
    copyLinkScuccess() {
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.copyLinkSuccess
      });
    },
    // 上传文件夹
    beforeUpload(file) {
      if (!this.breadList || !this.breadList.length) {
        file.parentId = "";
        file.parentName = this.LAN.MyFolder;
      } else {
        file.parentId = this.breadList[this.breadList.length - 1].id;
        file.parentName = this.breadList[this.breadList.length - 1].name;
      }

      // file.parentId
      // 在上传之前把文件传入 vuex， 在 upload-list 组件中监听 filelist 来进行队列上传
      this.$store.dispatch("app/pushFileList", file);

      return false;
    },
    async download() {
      if (this.checkList.length < 1) {
        return;
      }
      if (this.checkList.length < 2) {
        let res = await this.$store.dispatch("app/findList", this.checkList);
        if (res.type === "pic") {
          this.downloadImgSrc = res[0].file_url;
          this.$nextTick(() => {
            this.$refs.downloadImg.click();
          });
          return;
        }
      }

      let res = await this.$axios.post({
        url: "download",
        data: {
          id: this.checkList.join(",")
        }
      });

      let downloadLink = res.data.data
        .replace(/\\/g, "/")
        .replace("D:/offering/Mac/", settings.host);

      this.downloadImgSrc = downloadLink;
      this.$nextTick(() => {
        this.$refs.downloadImg.click();
      });
    },
    upload() {
      this.$refs.uploadBtn.click();
    },
    newFolder() {
      this.emptyCheckList();
      this.$store.dispatch("app/trigglerCreateInput", true);
    },
    emptyCheckList() {
      this.$emit("emptyCheckList");
    },
    cancel() {
      this.$store.dispatch("app/trigglerMask");
    },
    postAxiosDrop(tmpList, action) {
      return new Promise(async (resolve, reject) => {
        let filesList = tmpList.map(e => e.id);

        // let folders = tmpList
        //   .filter(e => {
        //     if (e.type === "folder") {
        //       return e.id;
        //     }
        //   })
        //   .map(e => e.id);

        // let pp_id;
        // if (!this.breadList || !this.breadList.length) {
        //   pp_id = this.userInfo.id;
        // } else {
        //   pp_id = this.breadList[this.breadList.length - 1].id;
        // }

        let res = await this.$axios.post({
          url: action,
          data: {
            id: filesList.join(",")
          }
        });
        resolve();
      });
    },
    async confirm() {
      let tmpList = await this.$store.dispatch("app/findList", this.allList);
      await this.postAxiosDrop(tmpList, "/delete");

      this.$store.dispatch("app/dropList", tmpList);
      this.$store.dispatch("app/trigglerMask");
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.emptyCheckList();
    },
    checkEmptyChecked() {
      if (!this.allList.length) {
        return false;
      }
      return true;
    },
    rename() {
      if (!this.checkEmptyChecked()) {
        return;
      }
      if (this.allList.length > 1) {
        return;
      }

      this.$store.dispatch("app/trigglerShowInput", true);
    },
    async getShareLink(call) {
      let res = await this.$axios.post({
        url: "/createshare",
        data: {
          id: this.checkList.join(",")
        }
      });

      call(res);
    },
    showMask(channel) {
      if (!this.checkEmptyChecked()) {
        return;
      }

      this.type = channel;
      switch (channel) {
        case "move":
          this.title = this.LAN.MoveTo;
          break;
        case "copy":
          this.title = this.LAN.CopyTo;
          break;
        case "drop":
          this.title = this.LAN.ComfirmDelete;
          break;
        case "share":
          this.getShareLink(res => {
            this.link = res.data.data.link;
            this.password = res.data.data.password;

            this.title = this.LAN.YourShareLink;
          });
          break;
      }

      this.$store.dispatch("app/trigglerMask");
    },
    trigglerSort(boo) {
      this.$emit("update:isColumn", boo);
      localStorage.setItem("isColumn", boo);
    }
  },
  computed: {
    ...mapGetters([
      "breadList",
      "userInfo",
      "LAN",
      "staticList",
      "isNotProject"
    ])
  }
};
</script>
