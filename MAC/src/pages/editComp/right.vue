<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.container {
  padding: 26px 0;
  .add {
    margin: 0 auto;
    line-height: 32px;
    color: white;
    font-size: 16px;
    text-align: center;
    background: black;
    margin-bottom: 10px;
    width: 260px;
    position: relative;
    .upload-el {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      opacity: 0;
      div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
      }
    }
  }
  .scroll {
    height: calc(100vh - 116px);
    // padding-left: 25px;
    .list {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      padding-left: 20px;
      .list-item {
        flex: 0 0 130px;
        width: 130px;
        width: 0;
        display: inline-block;
        padding: 15px 10px;
        cursor: pointer;
        vertical-align: top;
        &:hover {
          background-color: $activeColor;
        }
        .image {
          height: 96px;
          width: 96px;
          margin: 0 auto;

          &.pic {
            background: {
              size: contain;
              position: center;
              repeat: no-repeat;
            }
          }
          &.folder {
            background: {
              size: 60%;
              position: center;
              repeat: no-repeat;
            }
          }
        }
        .name {
          font-size: 12px;
          line-height: 20px;
          margin-top: 14px;
          margin-bottom: 3px;
          text-align: center;
          width: 100%;
          @include overflow1;
        }
        .size {
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

.back {
  font-size: 40px;
  color: $main;
  line-height: 96px;
  text-align: center;
}
</style>

<template>
  <div class='container'
       @click.stop>
    <div class='add'>
      <el-upload :before-upload="beforeUpload"
                 action=""
                 ref='upload'
                 class='upload-el'
                 multiple>
        <div>HIDDEN~</div>
      </el-upload>
      <i class="el-icon-plus"></i>
    </div>
    <el-scrollbar class='scroll black'>
      <ul class='list'>
        <li class="list-item"
            v-if="parentId!==userInfo.id&&parentId"
            @click="backItem">
          <div class="image back">
            <i class="el-icon-back"></i>
          </div>
          <div class='name'>{{LAN.Back.toUpperCase()}}</div>
          <div class="size">-</div>
        </li>
        <li class="list-item"
            v-for="item in list"
            @click='clickItem(item)'
            v-if="item.id!==userInfo.prorootid"
            :key="item.id">
          <div class="image"
               :class='item.type'
               :style="{backgroundImage:item.type==='folder'?'url('+require('@/assets/icon/folder-open-big.png')+')':'url('+item.thumb_url+')'}"></div>
          <div class='name'>{{item.name}}</div>
          <div class="size">
            {{item.resolution||'-'}}
            <!-- {{item.type==='pic'?(item.width+'×'+item.height):'-'}} -->
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script type='text/ecmascript-6'>
// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000;
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [],
      parentId: ""
    };
  },
  watch: {
    staticList: {
      immediate: true,
      handler(newVal) {
        let id = this.parentId;

        if (!id || id === this.userInfo.id) {
          this.parentId = this.userInfo.id;
          this.list = newVal;
        } else
          (function findFolder(list) {
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              if (element.id === id) {
                _this.list = element.children;
              } else if (element.children && element.children.length) {
                findFolder(element.children);
              }
            }
          })(newVal);
      }
    }
  },
  computed: {
    ...mapGetters(["staticList", "activeItem", "userInfo", "LAN"]),
    tmpList() {
      return this.staticList;
    }
  },
  methods: {
    // 上传文件夹
    beforeUpload(file) {
      file.parentId = this.parentId === this.userInfo.id ? "" : this.parentId;

      // 在上传之前把文件传入 vuex， 在 upload-list 组件中监听 filelist 来进行队列上传
      this.$store.dispatch("app/pushFileList", file);

      return false;
    },
    clickItem(item) {
      if (item.type === "pic") {
        if (this.activeItem) {
          if (this.activeItem.type !== "text") {
            this.activeItem.style = {
              left: 0,
              top: 0,
              scale: 100,
              rotate: 0,
              bgSrc: item.file_url
            };
            this.$store.dispatch("edit/setHasSave", false);
          }
        } else {
          this.$notify.warning({
            title: this.LAN.Warning,
            message: this.LAN.PleaseClickToSelectAContainer
          });
        }
      } else {
        let list = [];
        this.list.filter(e => {
          if (e.id === item.id) {
            list = e.children;
          }
        });
        this.list = list;
        this.parentId = item.id;
        this.$store.dispatch("app/setParentId", item.id);
        this.$store.dispatch("app/setParentName", item.name);
      }
    },
    backItem() {
      const _this = this;
      function findItem(list) {
        list.find(e => {
          if (e.id === _this.parentId) {
            _this.list = list;
            _this.parentId = list[0].parentId;
            _this.$store.dispatch("app/setParentId", list[0].parentId);
            _this.$store.dispatch("app/setParentName", list[0].name);
            return true;
          } else if (e.children && e.children.length) {
            findItem(e.children);
          }
        });
      }
      findItem(this.staticList);
    },
    dbClick(item) {},
    // 模拟数据
    // 模拟数据 - 图片
    // createDom(index, parentId = "") {
    //   let r = this.$getRandom(15);
    //   const sizeList = [
    //     {
    //       width: 640,
    //       height: 356
    //     },
    //     {
    //       width: 658,
    //       height: 411
    //     },
    //     {
    //       width: 564,
    //       height: 844
    //     },
    //     {
    //       width: 658,
    //       height: 1170
    //     },
    //     {
    //       width: 658,
    //       height: 411
    //     },
    //     {
    //       width: 658,
    //       height: 440
    //     },
    //     {
    //       width: 658,
    //       height: 1170
    //     },
    //     {
    //       width: 658,
    //       height: 438
    //     },
    //     {
    //       width: 658,
    //       height: 979
    //     },
    //     {
    //       width: 658,
    //       height: 962
    //     },
    //     {
    //       width: 457,
    //       height: 800
    //     },
    //     {
    //       width: 427,
    //       height: 640
    //     },
    //     {
    //       width: 498,
    //       height: 750
    //     },
    //     {
    //       width: 1908,
    //       height: 438
    //     },
    //     {
    //       width: 564,
    //       height: 1958
    //     }
    //   ];
    //   let dom = {
    //     // 父级ID
    //     parentId,
    //     // 文件夹ID
    //     id: this.$getRandom(1e16),
    //     // 名称
    //     name: this.$getRandom(1e6) + ".jpeg",
    //     // 路径 文件夹为空
    //     thumb: require("@/assets/images/" + r + ".jpeg"),
    //     // 宽高
    //     width: sizeList[r - 1].width,
    //     height: sizeList[r - 1].height,
    //     // 大小 文件夹为 '-'
    //     size: this.$getRandom(1e3) + "KB",
    //     // 创建时间
    //     time: new Date(new Date().getTime() + this.$getRandom(-600) * DAY),
    //     // 文件类型 pic 图片 folder 文件夹
    //     type: "pic"
    //   };
    //   if (this.checkAll) {
    //     this.checkList.push(dom.id);
    //   }
    //   return dom;
    // },
    // // 模拟数据 - 文件夹
    // createFolder(index, parentId = "") {
    //   let folder = {
    //     parentId,
    //     id: this.$getRandom(1e16),
    //     name: this.$getRandom(1e6),
    //     type: "folder",
    //     size: "-",
    //     thumb: require("@/assets/icons/folder.png"),
    //     time: new Date(new Date().getTime() + this.$getRandom(-600) * DAY),
    //     children: []
    //   };
    //   index++;
    //   if (index < 5) {
    //     for (let i = 0; i < this.$getRandom(5); i++) {
    //       folder.children.push(this.createFolder(index, folder.id));
    //     }
    //     for (let i = 0; i < this.$getRandom(10); i++) {
    //       folder.children.push(this.createDom(index, folder.id));
    //     }
    //   } else {
    //     for (let i = 0; i < this.$getRandom(10); i++) {
    //       folder.children.push(this.createDom(index, folder.id));
    //     }
    //   }

    //   return folder;
    // },
    // 开始模拟数据
    createFolders() {
      let staticList = [];
      for (let i = 0; i < this.$getRandom(5); i++) {
        staticList.push(this.createFolder(1));
      }
      for (let i = 0; i < this.$getRandom(100); i++) {
        staticList.push(this.createDom(1));
      }

      function closeAll(list) {
        list.filter(e => {
          if (e.type === "folder") e.isClose = true;
          if (e.children && e.children.length) {
            closeAll(e.children);
          }
        });
      }

      closeAll(staticList);

      this.$store.dispatch("app/setList", staticList);
      this.list = staticList;
    }
  }
};
</script>
