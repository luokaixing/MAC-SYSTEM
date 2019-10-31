<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.fold-item {
  display: flex;
  padding: 10px 0 10px 30px;
  background: #f4f4f4;
  box-sizing: border-box;
  cursor: pointer;
  &.active {
    background: $activeColor !important;
  }
  &:hover {
    background: #eeeeee;
  }
  i {
    flex: 0 0 32px;
    font-size: 16px;
    line-height: 32px;
    color: #707070;
  }
  .fold-icon {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    margin-right: 25px;
    vertical-align: top;
    // &.folder {
    //   height: 28px;
    //   margin-top: 2px;
    // }
    // &.pic {
    //   height: 32px;
    // }
  }
  .arrow-icon {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    margin-right: 8px;
    margin-top: 4px;
    vertical-align: top;
  }
  .fold-name {
    flex: 1;
    color: #535353;
    &.fold-input {
      border: none;
      padding-left: 20px;
      margin-right: 20px;
    }
    font: {
      size: 12px;
    }
    line-height: 30px;
  }
}
</style>

<template>
  <div class='fold-warpper'>
    <div class='fold-item'
         v-if="parent.type==='folder'&&show&&(checkedId===parent.id)"
         :style="{paddingLeft:index*30+'px'}">
      <i></i>
      <img class='fold-icon folder'
           draggable='false'
           :src="isProject?require('@/assets/project/folder-projects-open.png'):require('@/assets/icon/folder.png')">

      <input class='fold-name fold-input'
             ref='folderName'
             v-focus
             v-model="folderName"
             @keyup.esc='clearInput'
             @keyup.13="blurInput"
             @blur="createFolder">
    </div>
    <div v-for="item in list"
         v-if="(isProject||item.id!==userInfo.prorootid)"
         :key='item.id'>
      <div class="fold-item"
           :style="{paddingLeft:index*30+'px'}"
           :class="checked===item.id?'active':''"
           @click='openItem(item)'>
        <img src="@/assets/icon/arrow-right-g.png"
             draggable='false'
             class='arrow-icon'
             v-if="item.type==='folder'&&item.children&&item.children.length"
             :style="'transform:rotate('+(item.isClose?0:90)+'deg)'">
        <!-- <i :class="item.isClose?'el-icon-caret-right':'el-icon-caret-bottom'"
           v-if="item.type==='folder'&&item.children&&item.children.length"></i> -->
        <i v-else></i>
        <img class='fold-icon'
             draggable='false'
             :class='item.type'
             :src="
             item.type==='project' ? require('@/assets/project/project.png'):
             item.type==='pic' ?
                require('@/assets/icon/pic.png'):
                (
                  !item.isClose?
                  (isProject?require('@/assets/project/folder-projects-open.png'):
                  require('@/assets/icon/folder.png')):
                  (isProject?require('@/assets/project/folder-projects.png'):
                  require('@/assets/icon/folder-close.png'))
                )
                ">
        <div class='fold-name'>{{item.name}}</div>
      </div>

      <fold :index='index+1'
            v-if="!item.isClose"
            :parent="item"
            :list.sync='item.children'
            :checkedId.sync='checked'
            :showAdd.sync='show'></fold>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { formatTimeSplit } from "@/filters";
import { mapGetters } from "vuex";
export default {
  name: "fold",
  props: ["list", "checkedId", "showAdd", "index", "parent", "isProject"],
  computed: {
    ...mapGetters(["LAN", "userInfo", "isNotProject"]),
    show: {
      set(val) {
        this.$emit("update:showAdd", val);
      },
      get() {
        return this.showAdd;
      }
    },
    checked: {
      set(val) {
        this.$emit("update:checkedId", val);
      },
      get() {
        return this.checkedId;
      }
    }
  },
  watch: {
    show: {
      handler(newVal) {
        // if (
        //   newVal &&
        //   this.list &&
        //   this.list.length &&
        //   this.parent.id === this.checkedId
        // ) {
        //   let index = [];
        //   for (let i = 0; i < this.list.length; i++) {
        //     const element = this.list[i];
        //     if (/^New Folder/.test(element.name)) {
        //       index.push(+element.name.slice(10));
        //     }
        //   }

        //   let idx = -1;

        //   while (index.includes(++idx)) {}

        this.folderName = this.LAN.NewFolder;
        // }
      }
    }
  },
  data() {
    return {
      folderName: "New Folder"
    };
  },
  methods: {
    // 取消
    clearInput() {
      this.folderName = "";
      this.blurInput();
    },
    // 确认
    blurInput() {
      this.$refs.folderName.blur();
    },
    // 创建文件夹
    async createFolder() {
      console.log("this.isProject");
      console.log(this.isProject);

      this.folderName = this.folderName.trim();

      let parentId;
      let isRoot = this.checkedId === "";

      if (isRoot) {
        parentId = this.isProject ? this.userInfo.prorootid : this.userInfo.id;
      } else {
        parentId = this.checkedId;
      }

      console.log(parentId);

      if (this.folderName) {
        await this.$store.dispatch("app/createFolder", {
          folderName: this.folderName,
          isRoot: this.isProject ? false : isRoot,
          parentId
        });
      }
      this.show = false;
    },
    // 打开文件夹
    openItem(item) {
      item.isClose = !item.isClose;
      if (item.type === "folder") {
        this.checked = item.id;
      }
      this.$forceUpdate();
    }
  }
};
</script>
