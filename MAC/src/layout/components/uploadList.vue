<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.folder-list-warpper {
  background: white;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
  width: 750px;
  position: absolute;
  right: 60px;
  bottom: 0;
  height: 520px;
  transition: height 0.4s ease, width 0.4s ease, opacity 0.4s ease;
  z-index: 9;
  .folder-list-header {
    font-size: 28px;
    padding: 15px 20px;
    text-align: right;
    .folder-list-title {
      float: left;
      font-size: 16px;
      line-height: 28px;
    }
    i {
      padding: 0 5px;
      cursor: pointer;
    }
  }

  .tips {
    font-size: 12px;
    line-height: 32px;
    height: 32px;
    background: #33ad33;
    color: white;
    padding-left: 25px;
  }

  .fileList {
    height: 430px;
  }
}
.list-item {
  display: flex;
  padding: 14px 25px;
  box-sizing: border-box;
  position: relative;
  &:nth-child(2n + 1) {
    background: rgba(209, 209, 209, 0.2);
  }
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    transition: width 0.2s ease, opacity 2s ease;
    background: $activeColor;
  }
  .image {
    width: 32px;
    margin-right: 30px;
    img {
      width: 100%;
    }
  }
  .name {
    flex: 1;
    font-size: 12px;
    line-height: 32px;
    color: black;
    width: 0;
    @include overflow1;
  }
  .parent,
  .ratio,
  .size {
    font-size: 12px;
    line-height: 32px;
    color: #979797;
  }
  .parent {
    flex: 0 0 100px;
    width: 0;
    @include overflow1;
  }
  .ratio {
    width: 0;
    flex: 0 0 110px;
  }
  .size {
    flex: 0 0 100px;
    width: 0;
  }
  .status {
    flex: 0 0 24px;
    line-height: 32px;
    font-size: 24px;
    color: black;
    flex: 0 0 100px;
  }
}

.el-icon-close {
  line-height: 32px;
}
.upload-progress-text {
  font-size: 10px;
  display: inline-block;
  line-height: 32px;
  vertical-align: top;
}
</style>

<template>
  <div class='folder-list-warpper'
       :style="{height:!open?'58px':'520px',width:!open?'300px':'750px'}"
       @mousedown.stop
       v-if='showMask'>
    <div class="folder-list-header">
      <div class='folder-list-title'>{{LAN.UploadingList}}</div>
      <i :class="open?'el-icon-arrow-down':'el-icon-arrow-up'"
         @click='open=!open'></i>
      <i class="el-icon-close"
         @click="showMask=false"></i>
    </div>
    <div class='tips'
         v-if='open'>
      {{isUpload?LAN.Loading:(complete+' '+LAN.UploadSuccess+', '+error+' '+LAN.UploadFailed)}}
    </div>
    <el-scrollbar class='fileList'
                  v-if='open'>
      <ul>
        <li v-for="item in waitUploadList"
            class='list-item'>
          <div class='progress'
               v-if="item.progress!=='100%'"
               :style="{width:item.progress,opacity:item.progress==='100%'?0:1}">
          </div>
          <div class='image'>
            <img src="@/assets/icon/jpg.png"
                 draggable='false'>
          </div>
          <div class="name">{{item.name}}</div>
          <div class="parent">{{item.parentId === userInfo.id || item.parentId === '' ? LAN.MyFolder : item.parentName}}</div>
          <div class="ratio">{{item.resolution}}</div>
          <div class="size">{{item.size|filterSize}}</div>
          <div class='status'>
            <i class="el-icon-check"
               v-if="!item.uploadError&&item.progress==='100%'"></i>
            <i class="el-icon-refresh-right"
               @click='reUpload(item)'
               v-if="item.uploadError"></i>
            <div v-if="item.progress!=='100%'&&!item.error"
                 class="upload-progress-text">{{item.progress}}</div>
            <i class="el-icon-close"
               @click="cancelUpload(item)"></i>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
import axios from "axios";
import settings from "@/settings";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      showMask: false,
      open: true,
      waitUploadList: [],
      isUpload: false,
      error: 0,
      complete: 0,
      cancelFunc: null,
      source: []
    };
  },
  methods: {
    cancel() {},
    cancelUpload(item) {
      let that = this;
      if (that.source) {
        that.source[item.uid].cancel("取消上传");
      }

      this.waitUploadList = this.waitUploadList.filter(e => {
        return e !== item;
      });
    },
    // 重新上传
    reUpload(item) {
      delete item.isUpload;
      delete item.uploadError;

      item.progress = "";
      this.waitUploadList.splice(this.waitUploadList.indexOf(item), 1);
      this.$store.dispatch("app/pushFileList", item);
    },
    // 统计
    total() {
      this.isUpload = this.waitUploadList.find(g => {
        return g.isUpload;
      });
      this.complete = this.waitUploadList.filter(g => {
        return g.uploadDone;
      }).length;
      this.error = this.waitUploadList.filter(g => {
        return g.uploadError;
      }).length;

      if (!this.isUpload) {
        this.open = false;
      }
      // 更新数据
      this.$forceUpdate();
    }
  },
  watch: {
    // 获取上传文件列表
    fileList(newVal) {
      if (newVal.length) {
        this.showMask = true;
        this.open = true;
        let list = [...newVal];
        this.$store.dispatch("app/clearFileList");
        this.waitUploadList = list.concat(this.waitUploadList);
      }
    },
    // 本地上传列表
    waitUploadList(newVal) {
      const CancelToken = axios.CancelToken;
      const _this = this;
      // 定义一个上传事件
      // 对上传列表进行遍历
      newVal.forEach(async e => {
        console.log(e);

        _this.source[e.uid] = CancelToken.source();
        // 判断是否为上传中或者上传完成或上传失败
        if (!e.isUpload && !e.uploadDone && !e.uploadError) {
          e.isUpload = true;
          // 上传开始
          let param = new FormData();
          param.append("file", e);
          param.append(
            "folder_id",
            e.parentId ? e.parentId : _this.userInfo.id
          );

          axios({
            method: "post",
            url: settings.baseUrl + "fileadd",
            headers: {
              "Content-Type": "multipart/form-data",
              token: getToken()
            },
            withCredentials: true,
            data: param,
            cancelToken: _this.source[e.uid].token,
            // cancelToken: new CancelToken(function(cancel) {
            //   _this.cancelFunc = cancel;
            // }),
            // cancelToken: new CancelToken(function executor(cancelFunc) {}),
            onUploadProgress: f => {
              // 监听上传进度
              var completeProgress = (((f.loaded / f.total) * 100) | 0) + "%";
              e.progress = completeProgress;
              // 统计上传数据
              _this.total();
            }
          })
            .then(function(response) {
              let file = response.data.data;

              file.type = "pic";
              file.file_url = file.file_url
                .replace(/\\/g, "/")
                .replace("D:/offering/Mac/", settings.host);
              file.thumb_url = file.thumb_url
                .replace(/\\/g, "/")
                .replace("D:/offering/Mac/", settings.host);

              file.update_time = `${new Date().getFullYear()}-${new Date().getMonth() +
                1}-${new Date().getDate()}`;

              e.resolution = file.resolution;

              // 上传完成
              e.isUpload = false;
              e.uploadDone = true;
              _this.$store.dispatch("app/uploadPushList", {
                parentId: e.parentId,
                file
              });
              // 统计上传数据
              _this.total();
            })
            .catch(function(error) {
              // 上传失败
              e.isUpload = false;
              e.uploadError = true;

              if (axios.isCancel(error)) {
                e.progress = "";
                //主要是这里
                console.log("CANCEL");
              }

              // 统计上传数据
              _this.total();
            });
        }
      });
    },
    $route: {
      deep: true,
      handler(newVal) {
        this.open = false;
      }
    }
  },
  computed: {
    ...mapGetters(["fileList", "staticList", "userInfo", "LAN"])
  }
};
</script>
