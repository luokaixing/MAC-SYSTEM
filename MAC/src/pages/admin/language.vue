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
  padding-left: 10px;
  .el-scrollbar {
    height: calc(100vh - 178px);
  }
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
.lan-body {
  & > div > div {
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:nth-child(2n-1) {
      background: #f2f2f2;
    }
  }
}
.lan-header {
  & > div {
    padding: 0 10px;
  }
}
.lan-body,
.lan-header {
  display: flex;
  .name {
    flex: 0 0 140px;
    width: 0;
    & > div {
      padding: 0 10px;
    }
  }
  .lan-head-name {
    flex: 1;
    width: 0;
    & > div {
      padding: 0 10px;
    }
  }
}
.radio {
  display: inline-block;
  padding-left: 0 !important;
  padding-right: 5px !important;
}

.btns {
  display: inline-block;
  margin-right: 5px;
}
</style>

<style lang='scss' type='stylesheet/scss'>
.model-item {
  img {
    pointer-events: none !important;
  }
}
</style>

<template>
  <div class='_container_'>
    <el-container>
      <el-header>
        <div class='btns'>
          <div class='_prem_btn_group_'
               @click="addLanguage">
            {{LAN.AddLanguage.toUpperCase()}}
          </div>
          <div class='_prem_btn_group_'
               v-if="checkedItem.length>0"
               @click="DeleteLanguage">
            {{LAN.DeleteLanguage.toUpperCase()}}
          </div>
        </div>
        <div class='btns'
             v-if="checkedItem.length>0">
          <div class='_prem_btn_group_'
               @click="disableLanguage(false)">
            {{LAN.Disable.toUpperCase()}}
          </div>
          <div class='_prem_btn_group_'
               @click="disableLanguage(true)">
            {{LAN.Enable.toUpperCase()}}
          </div>
        </div>

        <div style="display:inline-block">
          <el-input class="search-input"
                    :placeholder="LAN.Search"
                    suffix-icon="el-icon-search"
                    v-model="searchValue"></el-input>
        </div>

        <div class='_prem_btn_group_'
             v-if="$route.query.superadmin"
             @click="addFiled">
          添加字段
        </div>
      </el-header>
      <el-container class='content'>
        <my-aside></my-aside>
        <el-main>
          <div class="lan-header">

            <div class="name">{{LAN.LanguageName}}</div>
            <div v-for="(lan,key) in languageList"
                 @click="checkedItem=[lan.id]"
                 style="cursor:pointer"
                 class='lan-head-name'>
              <div class="radio">
                <el-checkbox-group v-model="checkedItem"
                                   v-if="lan.preinstall===1"
                                   class='checkList'>
                  <el-checkbox class='SELF_CHECKBOX'
                               :label='lan.id'></el-checkbox>
                </el-checkbox-group>
              </div>
              {{lan.language}} ({{lan.status===1?LAN.Enabled:LAN.Disabled}})
            </div>
          </div>
          <el-scrollbar>
            <div class="lan-body">
              <div class='name'>
                <div v-for="(i,key) in languageList[0].fields"
                     v-show="searchValue===''||showList.indexOf(key)>-1">{{LAN[key]}}</div>
              </div>
              <div class='lan-head-name'
                   v-for="(lan,lanIndex) in languageList">

                <div v-for="(l,k) in lan.fields"
                     v-show="searchValue===''||showList.indexOf(k)>-1"
                     @click="updateLanguage(l,k,lanIndex)">
                  <input type="text"
                         v-model="tmpName"
                         v-focus
                         @keydown.enter="blurInput"
                         @blur="blurInput"
                         v-if="key === k && index === lanIndex && showInput">
                  <span v-else>{{l}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>

    <card :title.sync="title">
      <div class="buttons">
        <el-input v-model="tmpName"
                  v-if="type!=='delete'"
                  class='normal-input'
                  style='margin-bottom:20px;width:100%;display:block;'
                  placeholder=""></el-input>
        <div class='default'
             @click="cancel">{{LAN.Cancel.toUpperCase()}}</div>
        <div class="active"
             @click="confirmDelete"
             v-if="type==='delete'">{{LAN.OK.toUpperCase()}}</div>
        <div class='active'
             v-else
             @click='confirm'>{{LAN.OK.toUpperCase()}}</div>
      </div>
    </card>
  </div>
</template>

<script type='text/ecmascript-6'>
import myAside from "./myAside";
import { mapGetters } from "vuex";
export default {
  components: { myAside },
  data() {
    return {
      searchValue: "",
      // 浮层标题
      title: "",
      // 浮层类型
      type: "",
      // 选中
      checkedItem: [],
      // 当前选中的语言
      tmpName: "",
      key: "",
      index: "",
      // 显示的搜索列表
      showList: [],
      showInput: false
    };
  },
  computed: {
    ...mapGetters(["LAN", "languageList"])
  },
  watch: {
    searchValue(newVal) {
      let tmp = [];

      this.languageList.forEach(e => {
        for (let i in e.fields) {
          if (
            e.fields[i].toUpperCase().indexOf(newVal.toUpperCase()) > -1
            // newVal.split("").every(m => {
            //   return e.fields[i].toUpperCase().includes(m.toUpperCase());
            // })
          ) {
            tmp.push(i);
          }
        }
      });

      this.showList = tmp;
    }
  },
  created() {},
  methods: {
    async disableLanguage(isTrue) {
      let url = isTrue ? "enable" : "disable";
      let res = await this.$axios.post({
        url,
        data: {
          id: this.checkedItem[0]
        }
      });

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });

      this.$store.dispatch("language/trigglerLanguageStatus", {
        id: this.checkedItem[0],
        enable: isTrue
      });
    },
    addFiled() {
      this.type = "addFiled";
      this.title = "add Filed";
      this.$store.dispatch("app/trigglerMask");
    },
    async confirmDelete() {
      let res = await this.$axios.post({
        url: "languagedelete",
        data: {
          id: this.checkedItem[0]
        }
      });
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });

      this.$store.dispatch("language/dropLanguage", this.checkedItem[0]);

      this.$store.dispatch("app/trigglerMask");
    },
    async confirm() {
      if (!this.tmpName.trim()) {
        return;
      }

      if (this.type == "update") {
        if (this.languageList[this.index].fields[this.key] !== this.tmpName) {
          this.languageList[this.index].fields[this.key] = this.tmpName;
        }

        let data = {
          id: this.languageList[this.index].id
        };

        data[this.key] = this.tmpName;

        let res = await this.$axios.post({
          url: "languagesave",
          data
        });

        this.$notify.success({
          title: this.LAN.Success,
          message: this.LAN.Success
        });

        this.$forceUpdate();
      } else if (this.type === "changeLanguage") {
        let res = await this.$axios.post({
          url: "languageadd",
          data: {
            name: this.tmpName
          }
        });

        this.$store.dispatch("language/addLanguage", res.data.data);
      } else if (this.type === "addFiled") {
        let res = await this.$axios.post({
          url: "languagetable",
          data: {
            field: this.tmpName
          }
        });

        this.$store.dispatch("language/addFiled", this.tmpName);
        this.$forceUpdate();
      }
      this.$store.dispatch("app/trigglerMask");
    },
    cancel() {
      this.$store.dispatch("app/trigglerMask");
    },
    addLanguage() {
      this.title = this.LAN.InputLanguageName;
      this.tmpName = "";
      this.type = "changeLanguage";
      this.$store.dispatch("app/trigglerMask");
    },
    updateLanguage(l, k, index) {
      // this.title = this.LAN.EditLanguage;
      // this.type = "update";
      this.tmpName = l;
      this.key = k;
      this.index = index;

      this.showInput = true;

      // this.$store.dispatch("app/trigglerMask");
    },
    async blurInput() {
      this.showInput = false;
      if (this.languageList[this.index].fields[this.key] === this.tmpName) {
        return;
      }

      let data = {
        id: this.languageList[this.index].id
      };

      data[this.key] = this.tmpName;

      let res = await this.$axios.post({
        url: "languagesave",
        data
      });
      this.languageList[this.index].fields[this.key] = this.tmpName;

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });

      this.$forceUpdate();
    },
    DeleteLanguage() {
      this.title = this.LAN.ComfirmDelete;
      this.type = "delete";
      this.$store.dispatch("app/trigglerMask");
    }
  }
};
</script>
