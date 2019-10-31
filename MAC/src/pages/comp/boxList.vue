<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.pointNone {
  pointer-events: none;
  opacity: 0;
  display: none !important;
}
.list-warpper {
  .list-item {
    display: flex;
    align-items: center;
    height: 70px;
    padding: 0 30px;
    &:hover {
      background: $activeColor !important;
      .SELF_CHECKBOX {
        display: block !important;
      }
    }
    &.active {
      background: $activeColor !important;
    }
    &:nth-child(2n-1) {
      background: rgba(209, 209, 209, 0.18);
    }
    .SELF_CHECKBOX {
      height: 22px;
      width: 22px;
      flex: 0 0 22px;
    }
    .project,
    .folder {
      width: 30px;
      height: 30px;
      margin: 0 20px;
      cursor: pointer;
    }
    .pic {
      width: 30px;
      height: 30px;
      margin: 0 20px;
      cursor: pointer;
    }
    .name {
      flex: 1;
      @extend .font;
      width: 0;
      @include overflow1;
      line-height: 32px;
      padding: 19px 0;
      margin: 0;
      &.input {
        margin: 19px 0;
        padding: 0;
        padding-left: 10px;
      }
      cursor: pointer;
      vertical-align: top;
      font: {
        size: 12px;
      }

      .name-text {
        font: {
          size: 12px;
        }
        line-height: 1.5;
        display: inline-block;
        padding: 0 10px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .time,
    .size {
      line-height: 70px;
      flex: 0 0 150px;
      @extend .font;
      color: #797979;
      text-align: center;
      cursor: pointer;
    }
  }
}

.box-list-warpper {
  display: flex;
  // flex-wrap: wrap;
  padding: 12px;
  flex-flow: row wrap;
  .flex-item {
    min-width: 132px;
    height: 175px;
    display: inline-block;
    text-align: center;
    margin: 8px;
    position: relative;
    padding-top: 25px;
    box-sizing: border-box;
    flex: 1;
    transition: background 0.4s ease;
    &.list-item {
      .SELF_CHECKBOX {
        padding: 8px;
      }
      cursor: pointer;
      &:hover {
        background-color: rgba(172, 172, 172, 0.18);
        .SELF_CHECKBOX {
          display: block !important;
        }
      }
    }
    &.active {
      background: rgba(172, 172, 172, 0.18);
    }
    .checkList {
      position: absolute;
      top: 0;
      left: 0;
    }

    .folder-warpper {
      width: 96px;
      height: 96px;
      @include flexCenter;
      margin: 0 auto;
      &.isProject {
        background-image: url("../../assets/project/folder-projects-open.png");
      }
      &.isFolder {
        background-image: url("../../assets/icon/folder-open-big.png");
      }
      background: {
        size: 66px 66px;
        position: center;
        repeat: no-repeat;
      }
    }
    .pic-warpper {
      width: 96px;
      height: 96px;
      overflow: hidden;
      display: inline-block;
      text-align: center;
      background: {
        size: contain;
        position: center;
        repeat: no-repeat;
      }
    }
    .name {
      font: {
        size: 12px;
      }
      line-height: 20px;
      margin-top: 12px;
      color: #282828;
      text-align: center;
      @include overflow1;
      padding: 0 10px;
      box-sizing: border-box;
      &.input {
        width: 100px;
      }
      .name-text {
        font: {
          size: 12px;
        }
        line-height: 1.5;
        display: inline-block;
        height: 36px;
        box-sizing: border-box;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        width: 100%;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        overflow: hidden;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .none {
    margin: 0 auto;
  }
}

.none {
  .folder {
    opacity: 0.7;
    width: 50px;
    display: block;
    margin: 0 auto;
    padding-top: 200px;
    pointer-events: none;
  }
  .text {
    text-align: center;
    i,
    span {
      opacity: 0.7;
      font-size: 16px;
      line-height: 67px;
      color: #707070;
    }
    i {
      color: #0d478a;
      cursor: pointer;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>

<template>
  <div>
    <v-contextmenu ref="contextmenu"
                   theme='dark'
                   class='_menu_warpper_'>
      <v-contextmenu-item :disabled='!checkList.length||selfCheckList.length>1'
                          @click="openItem">{{LAN.Open.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item @click="emit('download')"
                          :disabled="!checkList.length"
                          v-if="isNotProject">{{LAN.Download.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="emit('share')"
                          :disabled="!checkList.length"
                          v-if="isNotProject">{{LAN.Share.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item divider
                          :disabled="!checkList.length"
                          v-if="!dsiabledRightClick&&isNotProject"></v-contextmenu-item>
      <v-contextmenu-item v-if="!dsiabledRightClick"
                          :disabled="!checkList.length"
                          @click="emit('copy')">{{LAN.CopyTo.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item v-if="!dsiabledRightClick"
                          :disabled="!checkList.length"
                          @click="emit('move')">{{LAN.MoveTo.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item divider
                          :disabled="!checkList.length"
                          v-if="!dsiabledRightClick"></v-contextmenu-item>
      <v-contextmenu-item :disabled='!checkList.length||selfCheckList.length>1'
                          v-if="!dsiabledRightClick"
                          @click="rename">{{LAN.Rename.toUpperCase()}}</v-contextmenu-item>
      <v-contextmenu-item v-if="!dsiabledRightClick"
                          :disabled="!checkList.length"
                          @click="emit('drop')">{{LAN.Delete.toUpperCase()}}</v-contextmenu-item>
    </v-contextmenu>
    <ul :class="!isColumn?'box-list-warpper':'list-warpper'">

      <!-- 创建文件夹 -->
      <!-- box -->
      <li class='list-item __fold__'
          v-if='showCreateInput&&isColumn'>
        <i class="SELF_CHECKBOX"></i>
        <img src='../../assets/icon/folder.png'
             draggable='false'
             class='folder'>
        <input class='name input'
               ref='folderName'
               @drag.prevent.stop
               @keyup.esc='clearInput'
               @keyup.13.stop="blurCreateInput"
               @blur="createFolder"
               v-focus
               v-model='folderName'>
        <div class="size"></div>
        <div class="time"></div>
      </li>
      <!-- list -->
      <li class='flex-item list-item __fold__'
          v-if='showCreateInput&&!isColumn'>
        <i class="SELF_CHECKBOX"></i>
        <!-- <img src='../../assets/icon/folder.png'
             draggable='false'
             class='folder'> -->
        <div class='folder-warpper'
             :class="!isNotProject?'isProject':'isFolder'"></div>

        <input class='name input'
               ref='folderName'
               @keyup.esc='clearInput'
               @keyup.13.stop="blurCreateInput"
               @blur="createFolder"
               v-model='folderName'
               v-focus>

      </li>
      <li class='none'
          v-if='!list.length&&!showCreateInput'>

        <div v-if="isAllowUpload">
          <img src="../../assets/icon/folder-open-big.png"
               draggable='false'
               class='folder'>
          <div class='text'>
            <span>{{LAN.EmptyFile0}}</span>
            <i class="upload"
               style='margin: 0 5px'
               @click='emit("upload")'>{{LAN.EmptyFile1}}</i>
            <span>{{LAN.EmptyFile2}}</span>
          </div>
        </div>

        <div v-else>
          <img src="../../assets/project/folder-projects-open.png"
               draggable='false'
               class='folder'>
          <div class='text'>
            <span>{{LAN.EmptyFile0}}</span>
            <i class="upload"
               style='margin: 0 5px'
               @click="$router.push('/home/edit')">{{LAN.EmptyFile1}}</i>
            <span>{{LAN.CreateProject.toLowerCase()}}</span>
          </div>
        </div>
      </li>

      <!-- 列表 -->
      <li class='flex-item list-item __fold__'
          :class="{active:selfCheckList.includes(item.id)}"
          :data-id='item.id'
          v-for="(item,index) in list"
          v-contextmenu:contextmenu
          @contextmenu="handleContextMenu"
          @click="isColumn?checkItem(item):doubleClick(item)"
          @click.right.stop>
        <!-- @dblclick="doubleClick(item)" -->

        <div @click.stop
             style="width:22px">
          <el-checkbox-group v-model="selfCheckList"
                             :class="{pointNone:item.id === (userInfo.prorootid)}"
                             class='checkList'
                             @change="changeGroup"
                             :data-id='item.id'>
            <!-- v-if="checkList.includes(item.id)" -->
            <el-checkbox class="SELF_CHECKBOX OPACITY_STYLE"
                         :style="!checkList.includes(item.id)?'display:none':'display:block'"
                         :label='item.id'
                         :ref="'checkbox-'+item.id"
                         :data-id='item.id'></el-checkbox>
          </el-checkbox-group>
        </div>

        <div class='folder-warpper'
             :class="item.id === userInfo.prorootid || !isNotProject?'isProject':'isFolder'"
             v-if="item.type==='folder'&&!isColumn"
             :data-id='item.id'></div>
        <div class='pic-warpper'
             v-if="item.type!=='folder'&&!isColumn"
             :style="'background-image:url('+(item.type==='pic'?item.thumb_url:require('@/assets/project/project.png'))+')'"
             :data-id='item.id'></div>

        <img v-if='isColumn'
             draggable='false'
             :src="item.id === userInfo.prorootid || !isNotProject?(item.type==='folder'?require('../../assets/project/folder-projects-open.png'):require('../../assets/project/project.png')):require('../../assets/icon/'+item.type+'.png')"
             :class="item.type"
             :data-id='item.id'>
        <input class='name input'
               v-focus
               v-if='showInput&&checkList.includes(item.id)'
               v-model='item.name'
               v-enter
               @click.stop
               @dblclick.stop
               @keyup.esc='esc(item)'
               @blur='blurInput(item)'
               @focus='tmpName=item.name'>
        <!-- @keyup.enter='blurInput(item)' -->
        <div class='name'
             v-else
             :data-id='item.id'>
          <span class="name-text"
                @click.stop="doubleClick(item)">{{item.id===userInfo.prorootid?LAN.MyProject:item.name}}</span>
        </div>
        <div class='size'
             v-if='isColumn'
             :data-id='item.id'>{{item.size|filterSize}}</div>
        <div class='time'
             v-if='isColumn&&item.update_time'
             :data-id='item.id'>{{item.update_time|formatTimeSplit}}</div>
        <div class='time'
             v-else-if='isColumn'
             :data-id='item.id'>-</div>
      </li>
      <li class='flex-item'
          v-if='!isColumn&&list.length'
          v-for="i in out">{{out}}</li>
    </ul>

  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  props: [
    "list",
    "allList",
    "checkList",
    "breadList",
    "isColumn",
    "dsiabledRightClick"
  ],
  watch: {
    list: {
      immediate: true,
      handler(newVal) {
        const that = this;
        function getOut() {
          that.$nextTick(() => {
            let container = document.querySelector(".box-list-warpper");
            if (container) {
              let boxWidth = container.getBoundingClientRect().width - 24;
              let column = Math.ceil(boxWidth / 158);

              if (newVal.length) {
                // 计算剩余的个数
                that.out = column;
              } else {
                that.out = column;
              }
            }
          });
        }

        getOut();
        window.onresize = () => {
          getOut();
        };
      }
    },
    isColumn: {
      immediate: true,
      handler(newVal) {
        const that = this;
        function getOut() {
          that.$nextTick(() => {
            let container = document.querySelector(".box-list-warpper");
            if (container) {
              let boxWidth = container.getBoundingClientRect().width - 24;
              let column = Math.ceil(boxWidth / 158);

              if (newVal.length) {
                // 计算剩余的个数
                that.out = column;
              } else {
                that.out = column;
              }
            }
          });
        }

        getOut();
        window.onresize = () => {
          getOut();
        };
      }
    },
    showCreateInput: {
      handler(newVal) {
        if (newVal) {
          this.folderName = this.LAN.NewFolder;
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "showInput",
      "showCreateInput",
      "userInfo",
      "LAN",
      "isNotProject",
      "isAllowUpload"
    ]),
    selfCheckList: {
      // 更改时更新
      set(val) {
        this.$emit("update:checkList", val);
      },
      // 获取时更新
      get() {
        return this.allList;
      }
    }
  },
  methods: {
    changeGroup(e) {
      if (e.includes(this.userInfo.prorootid)) {
        this.$nextTick(() => {
          this.$emit(
            "update:checkList",
            this.checkList.slice(this.checkList.length - 1, 1)
          );
        });
      }
    },
    // 打开文件夹
    async openItem() {
      let item = await this.$store.dispatch("app/findList", this.checkList);

      console.log("item");
      console.log(item);

      this.doubleClick(item[0]);
    },
    // 创建文件夹
    async createFolder() {
      this.isCreate = true;

      this.folderName = this.folderName.trim();

      let parentId;
      let isRoot = !(this.breadList && this.breadList.length);

      // if (isRoot) {
      //   parentId = this.userInfo.id;
      // } else {
      //   }

      if (!isRoot) parentId = this.breadList[this.breadList.length - 1].id;

      if (this.folderName) {
        await this.$store.dispatch("app/createFolder", {
          folderName: this.folderName,
          isRoot,
          parentId
        });
      }

      setTimeout(() => {
        this.isCreate = false;
      }, 500);
      // 切换输入框
      this.$store.dispatch("app/trigglerCreateInput", false);

      // this.$store.dispatch("app/sortStaticFiles");
    },
    // 取消
    clearInput() {
      this.folderName = "";
      this.blurCreateInput();
    },
    // 创建确认
    blurCreateInput() {
      this.$refs.folderName.blur();
      this.$store.dispatch("app/trigglerShowInput", false);
    },
    rename() {
      this.$store.dispatch("app/trigglerShowInput", true);
      // this.$store.dispatch("app/sortStaticFiles");
    },
    async blurInput(item) {
      if (this.isCreate) {
        return;
      }
      if (this.tmpName !== item.name) {
        let res = await this.$store.dispatch("file/renameItem", item);

        if (!res) {
          item.name = this.tmpName;
        }
      }

      this.$store.dispatch("app/trigglerShowInput", false);
      // this.$store.dispatch("app/sortStaticFiles");
    },
    esc(item) {
      item.name = this.tmpName;
      this.$store.dispatch("app/trigglerShowInput", false);
    },
    emit(func) {
      this.$emit(func);
    },
    handleContextMenu(e) {
      let checkedId = +e.target.getAttribute("data-id");

      if (checkedId !== this.userInfo.prorootid) {
        this.$emit("closeMenuBar");

        if (!this.selfCheckList.includes(checkedId)) {
          this.selfCheckList = [checkedId];
        }
      }
    },
    checkItem(e) {
      // this.$emit("emptyCheckList");
      if (e.id !== this.userInfo.prorootid) {
        this.$emit("addList", e.id);
      }
    },
    doubleClick(e) {
      switch (e.type) {
        case "pic":
          this.$emit("trigglerImg", e);
          break;
        case "folder":
          this.$emit("openFolder", e);
          break;
        case "project":
          this.$router.push("/home/edit/" + e.id);
          break;
      }
    }
  },
  data() {
    return {
      // 是否为创建，修复选中时触发更名事件 double
      isCreate: false,
      out: 0,
      tmpName: "",
      folderName: ""
    };
  }
};
</script>
