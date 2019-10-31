<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

._container_ {
  font-size: 0;
  position: relative;
}

.scroll {
  height: calc(100vh - 216px);
  position: relative;
}

.drag-box {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  transform-origin: top left;
  border: dashed 1px $main;
}
</style>

<template>
  <div class='_container_'
       ref='appMain'
       v-contextmenu:contextmenu
       @contextmenu="handleFatherContextMenu">

    <v-contextmenu ref="contextmenu"
                   theme='dark'
                   class='_menu_warpper_'
                   id='fatherMenu'>
      <v-contextmenu-submenu :title="LAN.Watch.toUpperCase()">
        <v-contextmenu-item @click="setColumn(true)">{{LAN.List.toUpperCase()}}</v-contextmenu-item>
        <v-contextmenu-item @click="setColumn(false)">{{LAN.Thumbnails.toUpperCase()}}</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-submenu :title="LAN.Sort.toUpperCase()">
        <v-contextmenu-item @click="sort('name')">{{LAN.ByName.toUpperCase()}}</v-contextmenu-item>
        <v-contextmenu-item @click="sort('size')">{{LAN.BySize.toUpperCase()}}</v-contextmenu-item>
        <v-contextmenu-item @click="sort('time')">{{LAN.ByDate.toUpperCase()}}</v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-item divider></v-contextmenu-item>
      <!-- <v-contextmenu-item>{{LAN.Refresh}}</v-contextmenu-item> -->
      <v-contextmenu-item @click='newFolder'>{{LAN.NewFolder.toUpperCase()}}</v-contextmenu-item>
    </v-contextmenu>

    <home-top ref='homeTop'
              :isColumn.sync='isColumn'
              :allList='allList'
              :checkList="checkList"
              @emptyCheckList='emptyCheckList'></home-top>

    <table-header :checkAll.sync='checkAll'
                  :breadList='breadList'
                  :allList.sync='allList'
                  :isColumn='isColumn'
                  :sortBy='sortBy'
                  @updateCheckAll='updateCheckAll'
                  @emptyCheckList='emptyCheckList'
                  @goHome='goHome'
                  @back='back'
                  @sort='sort'></table-header>

    <el-scrollbar id='fold-scroll'
                  class='scroll _fixed_right_scroll_'
                  v-hammer:pan='pan'
                  v-hammer:panstart='panStart'
                  v-hammer:panend='panEnd'>

      <box-list :isColumn='isColumn'
                :list='list'
                :breadList='breadList'
                :allList.sync='allList'
                :checkList.sync='checkList'
                @share='share'
                @download='download'
                @upload='upload'
                @emptyCheckList='emptyCheckList'
                @drop='drop'
                @move='move'
                @copy='copy'
                @trigglerImg='trigglerImg'
                @openFolder='openFolder'
                @addList='addList'
                @dropList='dropList'
                @closeMenuBar='closeMenuBar'></box-list>

      <div class='drag-box'
           :style="{left:left-17+'px',top:top-196+'px',width:width+'px',height:height+'px',transform:('scaleX('+(scaleX?-1:1)+') scaleY('+(scaleY?-1:1)+')')}"></div>

    </el-scrollbar>

    <home-swiper :list="list"
                 :activeImg.sync='activeImg'
                 v-if="activeImg"></home-swiper>
  </div>
</template>

<script type='text/ecmascript-6'>
// 头部按钮的组件
import homeTop from "../comp/homeTop";
// 头部面包屑以及表头
import tableHeader from "../comp/tableHeader";
import boxList from "../comp/boxList";
import homeSwiper from "../comp/homeSwiper";
import { formatSize } from "@/filters";
import { mapGetters } from "vuex";
// 一天的毫秒数
const DAY = 24 * 60 * 60 * 1000;
export default {
  components: {
    homeTop,
    tableHeader,
    boxList,
    homeSwiper
  },
  data() {
    return {
      // 排序
      sortBy: "",
      // 切换列表和网格状态
      isColumn: false,
      // 当前的数据
      list: [],
      // 已选中的文件
      checkList: [],
      // 是否全选
      checkAll: false,
      // 激活中查看的图片地址
      activeImg: null,
      // 面包屑
      breadList: [],
      // 拖拽盒子的位置以及大小
      left: "",
      top: "",
      width: "",
      height: "",
      scaleX: "",
      scaleY: "",
      // 临时数据
      tmpList: [],
      // 监听赋值
      newList: [],
      disabled: false,
      progress: 0
    };
  },
  watch: {
    checkList(newVal) {
      let length = this.list.filter(e => e.id !== this.userInfo.prorootid)
        .length;
      this.checkAll = newVal.length === length && newVal.length !== 0;
    },
    staticList: {
      immediate: true,
      handler(newVal) {
        const _this = this;
        _this.newList = newVal;

        let id = _this.breadList.length
          ? _this.breadList[_this.breadList.length - 1].id
          : "";
        if (id === "") {
          this.list = newVal;
        } else {
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
    // 监听面包屑，切换面包屑会清空选中
    breadList(newData) {
      this.$store.dispatch("app/setBreadList", newData);
      this.checkList = [];
      let parentId = "";
      let parentName = this.LAN.MyFolder;
      if (newData.length) {
        parentId = newData[newData.length - 1].id;
        parentName = newData[newData.length - 1].name;
      } else {
        this.list = this.newList;
      }

      this.$store.dispatch("app/setParentId", parentId);
      this.$store.dispatch("app/setParentName", parentName);
      if (newData.length && newData[0].id === this.userInfo.prorootid) {
        this.$store.state.app.isAllowUpload = false;
      } else {
        this.$store.state.app.isAllowUpload = true;
      }
    },
    // 监听全选选中状态
    checkAll(newData) {
      if (newData) {
        this.checkList = this.list
          .filter(e => {
            if (e.id !== this.userInfo.prorootid) {
              return true;
            } else {
              return false;
            }
          })
          .map(e => {
            return e.id;
          });
      }
    },
    showInput(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.disabled = newVal;
        }, 10);
      } else {
        this.disabled = newVal;
      }
    }

    // fileList(newVal) {
    //   if (newVal.length) {
    //     this.uploadImages(newVal);
    //   }
    // }
  },
  async created() {
    this.sortBy = localStorage.getItem("sort");
    this.breadList = [];
    this.isColumn = localStorage.getItem("isColumn") === "true";
    // this.createFolders();
  },
  mounted() {
    // 监听滚动事件
    // let scroll = document.querySelector("#fold-scroll .el-scrollbar__wrap");
    // let scrollReac = scroll.getBoundingClientRect();
    // 触底刷新
    // scroll.addEventListener("scroll", e => {
    //   // 滚动刷新
    //   let scrollView = document.querySelector(
    //     "#fold-scroll .el-scrollbar__wrap .el-scrollbar__view"
    //   );
    //   let react = scrollView.getBoundingClientRect();
    //   if (scroll.scrollTop + scrollReac.height > react.height - 100) {
    //     for (let i = 0; i < 20; i++) {
    //       this.list.push(this.createDom());
    //     }
    //   }
    // });
  },
  computed: {
    ...mapGetters([
      "fileList",
      "staticList",
      "showInput",
      "showMask",
      "userInfo",
      "LAN",
      "showCreateInput"
    ]),
    // 计算所有的值需要一个总数组来存放，计算依据是由两个临时数组
    allList() {
      // 临时空数据计算交集
      let list = [];
      for (var i in this.tmpList) {
        for (var k in this.checkList) {
          if (this.tmpList[i] === this.checkList[k]) {
            list.push(this.tmpList[i]);
          }
        }
      }
      // 临时数据计算并集
      let tmp = [...this.checkList, ...this.tmpList];
      // 并集减交集
      tmp = tmp.filter(e => {
        return !list.includes(e);
      });
      // 结果
      return tmp;
    }
  },
  methods: {
    setColumn(isTrue) {
      this.isColumn = isTrue;
      localStorage.setItem("isColumn", isTrue);
    },
    updateCheckAll(val) {
      this.checkAll = val;
    },
    // 右键事件
    upload() {
      this.$refs.homeTop.upload();
    },
    share() {
      this.$refs.homeTop.showMask("share");
    },
    download() {
      this.$refs.homeTop.download();
    },
    newFolder() {
      this.$store.dispatch("app/trigglerCreateInput", true);
    },
    drop() {
      this.$refs.homeTop.showMask("drop");
    },
    copy() {
      this.$refs.homeTop.showMask("copy");
    },
    move() {
      this.$refs.homeTop.showMask("move");
    },
    // 右击事件
    // 修复子组件点击影响父组件
    handleFatherContextMenu() {
      document.querySelector("#fatherMenu").style.display = "";
    },
    // 修复子组件点击与父组件右击同时出现
    closeMenuBar() {
      document.querySelector("#fatherMenu").style.display = "none";
    },
    // 排序
    sort(method) {
      let s = method;
      let by = 0;
      if (this.sortBy) {
        s = this.sortBy.split("-")[0];
        if (s === method) {
          by = +this.sortBy.split("-")[1] === 1 ? 0 : 1;
        }
      }
      this.sortBy = method + "-" + by;
      // 排序需要后端配合
      localStorage.setItem("sort", this.sortBy);
      this.$store.dispatch("app/sortStaticFiles");
    },
    // 拖拽事件
    // 拖拽开始
    panStart(e) {
      if (this.showInput || this.showCreateInput) {
        return;
      }
      let scroll = document.querySelector("#fold-scroll .el-scrollbar__wrap");
      // 设置起始坐标
      this.left = e.center.x;
      this.top = e.center.y + scroll.scrollTop;
      // 设置临时数据
      this.tmpList = [];
      this.checkList = [];
    },
    // 拖拽
    pan(e) {
      if (this.showInput || this.showCreateInput) {
        return;
      }
      let scroll = document.querySelector("#fold-scroll .el-scrollbar__wrap");
      let scrollReac = scroll.getBoundingClientRect();
      let scrollView = document.querySelector(
        "#fold-scroll .el-scrollbar__wrap .el-scrollbar__view"
      );
      let react = scrollView.getBoundingClientRect();
      // 计算宽高
      this.width = Math.abs(e.center.x - this.left);
      this.height = Math.abs(e.center.y - this.top + scroll.scrollTop);
      // 计算对称
      this.scaleX = e.center.x - this.left < 0;
      this.scaleY = e.center.y - this.top + scroll.scrollTop < 0;
      // 获取到所有的列表
      let folders = document.querySelectorAll(".__fold__");
      // 根据浮层的位置来计算选中的列表文件
      for (let index = 0; index < folders.length; index++) {
        // 文件 DOM 和 DOM 数据
        const fold = folders[index];
        const foldReat = fold.getBoundingClientRect();
        // 浮层坐标
        let start = {
          left: Math.min(this.left, e.center.x),
          top: Math.min(this.top - scroll.scrollTop, e.center.y),
          right: Math.max(this.left, e.center.x),
          bottom: Math.max(this.top - scroll.scrollTop, e.center.y)
        };
        // 文件坐标
        let end = {
          left: foldReat.x,
          top: foldReat.y,
          right: foldReat.x + foldReat.width,
          bottom: foldReat.y + foldReat.height
        };
        // 如果有交集则选中
        if (
          start.right > end.left &&
          end.right > start.left &&
          start.bottom > end.top &&
          end.bottom > start.top
        ) {
          if (
            !this.tmpList.includes(+fold.dataset.id) &&
            +fold.dataset.id !== +this.userInfo.prorootid
          ) {
            this.tmpList.push(+fold.dataset.id);
          }
        } else {
          let idx = this.tmpList.indexOf(+fold.dataset.id);
          if (idx > -1) this.tmpList.splice(idx, 1);
        }
      }

      if (
        e.center.y >= window.innerHeight - 60 &&
        scroll.scrollTop + scrollReac.height < react.height
      ) {
        scroll.scrollTop += 4;
      }

      if (e.center.y <= 300) {
        scroll.scrollTop -= 4;
      }

      // 下拉滚动
    },
    // 拖拽结束
    panEnd(e) {
      if (this.showInput || this.showCreateInput) {
        return;
      }
      // 置空所有数据
      this.left = this.top = this.width = this.height = 0;
      // 临时存储 allList
      let tmp = [...this.allList];
      // 清空临时数据
      this.tmpList = [];
      // 将数据放入 checkList
      this.checkList = [...tmp];
    },
    // 头部事件
    // 返回以及点击面包屑
    back(getId) {
      const _this = this;
      // 如果有 getId 则认为是点击面包屑
      if (getId) {
        // 将面包屑后面的切掉
        for (let index = 0; index < this.breadList.length; index++) {
          const element = this.breadList[index];
          if (this.breadList[index].id === getId) {
            this.breadList.splice(index + 1);
          }
        }
      } else {
        // 否则的话只切掉一个
        this.breadList.pop();
      }

      // 如果面包屑没有长度了说明已经切完了，就要回到第一页
      if (!this.breadList.length) {
        this.list = this.newList;
      } else {
        // 获取 id
        let id = getId || this.breadList[this.breadList.length - 1].id;
        // 递归函数，找到文件夹( 模拟数据中查找，实际获取 parentId 获取就行 )
        (function findFolder(list) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.id === id) {
              _this.list = element.children;
            } else if (element.children && element.children.length) {
              findFolder(element.children);
            }
          }
        })(this.newList);
        // findFolder(this.newList);
      }
    },
    // 返回第一页
    goHome() {
      this.list = this.newList;
      this.breadList = [];
    },
    // 文件事件
    // 打开文件夹
    openFolder(item) {
      this.list = item.children;
      this.breadList.push({
        name: item.name,
        id: item.id
      });
    },
    // 打开图片
    trigglerImg(item) {
      this.activeImg = item;
    },
    // 清空选中
    emptyCheckList() {
      this.checkAll = false;
      this.checkList = [];
    },
    // 文件单击
    // 用于接受单击选中
    addList(item) {
      if (this.checkList.includes(item)) {
        this.checkList.splice(this.checkList.indexOf(item), 1);
        // if (this.checkList.length > 1) {
        //   this.checkList.push(item);
        // } else {
        //   this.checkList = [];
        // }
      } else {
        this.checkList.push(item);
      }
    },
    // 用于接收单击取消
    dropList(index) {
      this.checkList.splice(index, 1);
    },
    // 模拟数据
    // 模拟数据 - 图片
    createDom(index, parentId = "") {
      let r = this.$getRandom(15);
      const sizeList = [
        {
          width: 640,
          height: 356
        },
        {
          width: 658,
          height: 411
        },
        {
          width: 564,
          height: 844
        },
        {
          width: 658,
          height: 1170
        },
        {
          width: 658,
          height: 411
        },
        {
          width: 658,
          height: 440
        },
        {
          width: 658,
          height: 1170
        },
        {
          width: 658,
          height: 438
        },
        {
          width: 658,
          height: 979
        },
        {
          width: 658,
          height: 962
        },
        {
          width: 457,
          height: 800
        },
        {
          width: 427,
          height: 640
        },
        {
          width: 498,
          height: 750
        },
        {
          width: 1908,
          height: 438
        },
        {
          width: 564,
          height: 1958
        }
      ];
      let dom = {
        // 父级ID
        parentId,
        // 文件夹ID
        id: this.$getRandom(1e16),
        // 名称
        name: this.$getRandom(1e6) + ".jpeg",
        // 路径 文件夹为空
        thumb: require("@/assets/images/" + r + ".jpeg"),
        // 宽高
        width: sizeList[r - 1].width,
        height: sizeList[r - 1].height,
        // 大小 文件夹为 '-'
        size: this.$getRandom(1e3) + "KB",
        // 创建时间
        time: new Date(new Date().getTime() + this.$getRandom(-600) * DAY),
        // 文件类型 pic 图片 folder 文件夹
        type: "pic"
      };
      if (this.checkAll) {
        this.checkList.push(dom.id);
      }
      return dom;
    },
    // 模拟数据 - 文件夹
    createFolder(index, parentId = "") {
      let folder = {
        parentId,
        id: this.$getRandom(1e16),
        name: this.$getRandom(1e6),
        type: "folder",
        size: "-",
        time: new Date(new Date().getTime() + this.$getRandom(-600) * DAY),
        children: []
      };
      index++;
      if (index < 5) {
        for (let i = 0; i < this.$getRandom(5); i++) {
          folder.children.push(this.createFolder(index, folder.id));
        }
        for (let i = 0; i < this.$getRandom(10); i++) {
          folder.children.push(this.createDom(index, folder.id));
        }
      } else {
        for (let i = 0; i < this.$getRandom(10); i++) {
          folder.children.push(this.createDom(index, folder.id));
        }
      }

      return folder;
    },
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

      // this.$store.dispatch("app/sortStaticFiles");
    }
  }
};
</script>
