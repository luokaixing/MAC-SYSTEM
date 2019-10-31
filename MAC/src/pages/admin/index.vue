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
  // padding-left: 0;
  // padding-right: 0;
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
    &:nth-child(2n-1) {
      background-color: #f2f2f2;
    }
  }
  .radio {
    flex: 0 0 100px;
    pointer-events: none;
    cursor: pointer;
  }
  .name {
    flex: 0 0 200px;
  }
  .perm {
    flex: 1;
  }
}
</style>

<template>
  <div class='_container_'>
    <el-container>
      <el-header>
        <div class='_prem_btn_ upload-btn'
             @click="showAddFrom">
          {{LAN.Add.toUpperCase()}}
        </div>

        <div class='_prem_btn_ upload-btn'
             @click="edit"
             v-if="checkedItem.length===1">
          {{LAN.Edit.toUpperCase()}}
        </div>

        <div style="display:inline-block"
             v-if="checkedItem.length>0">
          <div class='_prem_btn_group_'
               style="margin-right:5px"
               @click="queryDelete">
            {{LAN.Delete.toUpperCase()}}
          </div>
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
          <div class='header'>
            <div class="radio"
                 style="pointer-events:auto"
                 @click="triggerCheckAll">
              <el-checkbox v-model="checkAll"
                           style="pointer-events:none"
                           class='SELF_CHECKBOX'></el-checkbox>
            </div>
            <div class="name">{{LAN.Role}}</div>
            <div class="perm">{{LAN.Permissions}}</div>
          </div>
          <el-scrollbar style=' height: calc(100vh - 178px);'>
            <div class="body"
                 v-show="item.isShow"
                 @click="checkItem(item.id)"
                 v-for="(item,index) in roles">
              <div class="radio">
                <el-checkbox-group v-model="checkedItem"
                                   class='checkList'>
                  <el-checkbox class='SELF_CHECKBOX'
                               :label='item.id'></el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="name">{{item.role}}</div>
              <div class="perm">{{item.perm|filterPerm(roleList)}}</div>
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

      <add-form v-if="type==='add'||type==='edit'"
                :form="form"
                @submit="submit"></add-form>
    </card>
  </div>
</template>

<script type='text/ecmascript-6'>
import myAside from "./myAside";
import addForm from "./addForm";
import { mapGetters } from "vuex";
export default {
  components: { myAside, addForm },
  filters: {
    filterPerm: (val, list) => {
      let tmp = [];

      val.forEach(e => {
        list.forEach(f => {
          if (f.perm === e) {
            tmp.push(f.label);
          }
        });
      });
      return tmp.join(", ");
    }
  },
  data() {
    return {
      checkAll: false,
      title: "",
      type: "",
      searchValue: "",
      checkedItem: [],
      form: {
        roleName: "",
        roleValue: []
      },
      roles: [],
      roleList: []
    };
  },
  watch: {
    checkedItem(newVal) {
      if (newVal.length === this.roles.length && newVal.length !== 0) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    LAN(newVal) {
      this.roleList = [
        {
          id: 1,
          perm: "m:home",
          label: this.LAN.ShareFiles
        },
        {
          id: 2,
          perm: "m:edit",
          label: this.LAN.CreateProject
        },
        {
          id: 3,
          perm: "m:share",
          label: this.LAN.WatchShare
        }
      ];
    }
  },
  created() {
    this.roleList = [
      {
        id: 1,
        perm: "m:home",
        label: this.LAN.ShareFiles
      },
      {
        id: 2,
        perm: "m:edit",
        label: this.LAN.CreateProject
      },
      {
        id: 3,
        perm: "m:share",
        label: this.LAN.WatchShare
      }
    ];
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    ...mapGetters(["LAN"])
  },
  methods: {
    search(e) {
      // this.roles.forEach(f => {
      //   f.isShow = e.split("").every(m => {
      //     return f.role.includes(m);
      //   });
      // });
      this.roles.forEach(f => {
        f.isShow = f.role.indexOf(e) > -1;
      });
    },
    triggerCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.checkedItem = this.roles.map(e => e.id);
      } else {
        this.checkedItem = [];
      }
    },
    async getInfo() {
      this.roles = await this.$store.dispatch("user/getRoles");
      this.roles.forEach(e => {
        e.isShow = true;
      });
    },
    async submit(form) {
      if (this.type === "add") {
        await this.$axios.post({
          url: "roleadd",
          data: {
            name: this.form.roleName,
            id: this.form.roleValue.join(",")
          }
        });
      } else {
        let res = await this.$axios.post({
          url: "rolesave",
          data: {
            id: this.roles.find(e => {
              return +e.id === +this.checkedItem[0];
            }).id,
            role: this.form.roleName,
            perm_id: this.form.roleValue.join(",")
          }
        });

        if (!res) {
          return;
        }

        // this.roles[this.checkedItem[0]] = { ...this.form };

        this.$forceUpdate();
      }
      this.getInfo();
      this.form.roleName = "";
      this.form.roleValue = [];
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.$store.dispatch("app/trigglerMask");
    },
    edit() {
      if (this.checkedItem.length !== 1) {
        this.$notify.warning({
          title: this.LAN.Warning,
          message: this.LAN.PleaseSelectARole
        });
        return;
      }
      this.title = this.LAN.EditRoles;
      this.type = "edit";
      let form = this.roles.find(e => {
        return +e.id === +this.checkedItem[0];
      });

      let perm = [];

      form.perm.filter(e => {
        this.roleList.filter(f => {
          if (f.perm === e) {
            perm.push(f.id);
          }
        });
      });

      this.form.roleValue = perm;
      this.form.roleName = form.role;

      this.$store.dispatch("app/trigglerMask");
    },
    cancel() {
      this.$store.dispatch("app/trigglerMask");
    },
    async confirm() {
      await this.$axios.post({
        url: "roledelete",
        data: {
          id: this.checkedItem.join(",")
        }
      });

      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.getInfo();
      this.checkedItem = [];
      this.$store.dispatch("app/trigglerMask");
    },
    checkItem(index) {
      let idx = this.checkedItem.indexOf(index);
      if (idx > -1) {
        this.checkedItem.splice(idx, 1);
      } else {
        this.checkedItem.push(index);
      }
    },
    queryDelete() {
      if (!this.checkedItem.length) {
        this.$notify.warning({
          title: this.LAN.Warning,
          message: this.LAN.PleaseSelectARole
        });
        return;
      }
      this.type = "delete";
      this.title = this.LAN.ComfirmDelete;
      this.$store.dispatch("app/trigglerMask");
    },
    showAddFrom() {
      this.title = this.LAN.AddRole;
      this.type = "add";
      this.form = {
        roleName: "",
        roleValue: []
      };
      this.$store.dispatch("app/trigglerMask");
    }
  }
};
</script>
