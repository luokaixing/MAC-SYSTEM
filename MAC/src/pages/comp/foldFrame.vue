<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.fold-item {
  display: flex;
  padding: 10px 0 10px 10px;
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

  .arrow-icon {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    margin-right: 8px;
    margin-top: 3px;
    vertical-align: top;
    line-height: 30px;
  }
  .fold-icon {
    flex: 0 0 30px;
    width: 30px;
    margin-right: 25px;
    vertical-align: top;
    height: 30px;
  }
  .fold-name {
    flex: 1;
    color: #535353;
    font: {
      size: 12px;
    }
    line-height: 30px;
  }
}
</style>

<template>
  <div>
    <el-scrollbar style='height:400px;background:#f4f4f4'>
      <div class="isFolder"
           v-if="isNotProject">
        <div class="fold-item"
             :class="!checkedId?'active':''"
             @click="closeAll">
          <img src="@/assets/icon/arrow-right-g.png"
               draggable='false'
               class='arrow-icon'
               :style="'transform:rotate('+(!close?0:90)+'deg)'">
          <!-- <i :class="!close?'el-icon-caret-right':'el-icon-caret-bottom'"></i> -->
          <img class='fold-icon'
               draggable='false'
               :src="close?require('@/assets/icon/folder.png'):require('@/assets/icon/folder-close.png')">
          <div class='fold-name'>{{LAN.AllFiles}}</div>
        </div>

        <fold v-if="close"
              :isProject='false'
              :parent="{type:'folder',id:'',isClose:close}"
              :index='1'
              :list.sync='newList'
              :checkedId.sync='checkedId'
              :showAdd.sync='showAdd'></fold>
      </div>

      <div class="isProject"
           v-else>
        <div class="fold-item"
             :class="!checkedId?'active':''"
             @click="closeAll">
          <img src="@/assets/icon/arrow-right-g.png"
               draggable='false'
               class='arrow-icon'
               :style="'transform:rotate('+(!close?0:90)+'deg)'">
          <!-- <i :class="!close?'el-icon-caret-right':'el-icon-caret-bottom'"></i> -->
          <img class='fold-icon'
               draggable='false'
               :src="close?require('@/assets/project/folder-projects-open.png'):require('@/assets/project/folder-projects.png')">
          <div class='fold-name'>{{LAN.MyProject}}</div>
        </div>

        <fold v-if="close"
              :isProject="true"
              :parent="{type:'folder',id:'',isClose:close}"
              :index='1'
              :list.sync='projectList'
              :checkedId.sync='checkedId'
              :showAdd.sync='showAdd'></fold>
      </div>
    </el-scrollbar>
    <div class="buttons">
      <div class='default'
           @click="showAddFolder">{{LAN.NewFolder.toUpperCase()}}</div>
      <div class='active'
           v-if="type==='move'"
           @click='handlerMove'>{{LAN.OK.toUpperCase()}}</div>
      <div v-else-if="type==='copy'"
           class='active'
           @click="handlerCopy">{{LAN.OK.toUpperCase()}}</div>
      <div class='active'
           v-else
           @click='hanlderUpload'>{{LAN.OK.toUpperCase()}}</div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import fold from "./fold";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      close: true,
      checkedId: "",
      newList: [],
      showAdd: false
    };
  },
  created() {
    console.log(this.isNotProject);
  },
  components: { fold },
  props: ["allList", "title", "type", "shareList"],
  computed: {
    ...mapGetters(["staticList", "userInfo", "LAN", "isNotProject"]),
    projectList() {
      let res = this.staticList.filter(e => {
        return e.id === this.userInfo.prorootid;
      })[0].children;

      return this.staticList.filter(e => {
        return e.id === this.userInfo.prorootid;
      })[0].children;
    }
  },
  watch: {
    // 设置临时的列表
    staticList: {
      immediate: true,
      handler(newVal) {
        this.newList = newVal;
      }
    },
    // 监听面包屑，切换面包屑会清空选中
    breadList(newData) {
      this.checkList = [];
    },
    // 监听全选选中状态
    checkAll(newData) {
      if (newData) {
        this.checkList = this.list.map(e => e.id);
      }
    },
    // 监听列表的全选状态
    checkList(newData) {
      this.checkAll = newData.length === this.list.length;
    }
  },
  methods: {
    hanlderUpload() {
      this.$emit("upload", this.checkedId);
    },
    // 新建文件的时候打开文件夹
    showAddFolder() {
      if (this.checkedId === "") {
        this.close = true;
      } else {
        this.$store.dispatch("app/setIsClose", this.checkedId);
      }
      this.$nextTick(() => {
        this.showAdd = true;
      });
    },
    // 拷贝
    async handlerCopy() {
      console.log(this.shareList);

      console.log(this.isNotProject);

      const _this = this;
      let tmpList = [];
      if (this.shareList) {
        (function filterCheckList(list) {
          list.filter(e => {
            if (_this.allList.includes(e.id)) {
              tmpList.push(e);
            }
            if (e.children && e.children.length) {
              filterCheckList(e.children);
            }
          });
        })(this.shareList);
      } else {
        tmpList = await this.$store.dispatch("app/findList", this.allList);
      }

      console.log(tmpList);

      let hasId = (function findChildId(list) {
        return list.find(e => {
          if (e.id === _this.checkedId) {
            return e.id === _this.checkedId;
          }
          if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(tmpList);
      // 查找父级的 id
      let parentId = tmpList[0].parentId;

      // 如果没有 id 或者 id 等于本身
      if (hasId || parentId === this.checkedId) {
        this.$notify.error({
          title: this.LAN.Warning,
          message: this.LAN.FilesCannot
        });
        return;
      }

      let res = await this.postAxios(tmpList, "/copy");

      this.$store.dispatch("file/addNewList", {
        tmpList: res.data.data,
        checkedId:
          !this.isNotProject && this.checkedId === ""
            ? this.userInfo.prorootid
            : this.checkedId
      });

      this.$store.dispatch("app/trigglerMask");
      this.$emit("emptyCheckList");
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.$store.dispatch("app/sortStaticFiles");
    },
    // 移动
    async handlerMove() {
      const _this = this;
      // 查找 id 对应的 list
      let tmpList = await this.$store.dispatch("app/findList", this.allList);

      // 判断是否为主目录下的或者为自身目录下的
      let hasId = (function findChildId(list) {
        return list.find(e => {
          if (e.id === _this.checkedId) {
            return e.id === _this.checkedId;
          }
          if (e.children && e.children.length) {
            return findChildId(e.children);
          }
        });
      })(tmpList);
      // 查找父级的 id
      let parentId = tmpList[0].parentId;
      // 如果没有 id 或者 id 等于本身
      if (hasId || parentId === this.checkedId) {
        this.$notify.error({
          title: this.LAN.Warning,
          message: this.LAN.FilesCannot
        });
        return;
      }

      let res = await this.postAxios(tmpList, "/move");

      this.$store.dispatch("app/dropList", tmpList);

      // this.$store.dispatch("app/addNewList", {
      //   tmpList: res.data.data,
      //   checkedId: this.checkedId
      // });

      console.log(this.isNotProject);

      this.$store.dispatch("file/addNewList", {
        tmpList: res.data.data,
        checkedId:
          !this.isNotProject && this.checkedId === ""
            ? this.userInfo.prorootid
            : this.checkedId
      });

      this.$store.dispatch("app/trigglerMask");

      this.$emit("emptyCheckList");
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.$store.dispatch("app/sortStaticFiles");
    },
    // 关闭所有文件
    closeAll() {
      this.close = !this.close;
      this.checkedId = "";
    },
    postAxios(tmpList, action) {
      return new Promise(async (resolve, reject) => {
        let filesList = tmpList.map(e => e.id);

        let rootid = this.userInfo.id;
        if (!this.isNotProject) {
          rootid = this.userInfo.prorootid;
        }

        let res = await this.$axios.post({
          url: action,
          data: {
            folderid: this.checkedId || rootid,
            id: filesList.join(",")
          }
        });
        resolve(res);
      });
    }
  }
};
</script>
