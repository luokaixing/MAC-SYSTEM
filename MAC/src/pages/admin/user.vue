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
    .SELF_CHECKBOX {
      pointer-events: none;
    }
  }
  .name {
    flex: 0 0 200px;
  }
  .perm {
    flex: 1;
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
             @click="uploadExcel">
          {{LAN.uploadExcel.toUpperCase()}}
        </div>

        <div class='_prem_btn_'
             @click="showAddFrom">
          {{LAN.Add.toUpperCase()}}
        </div>

        <div class='_prem_btn_'
             v-if="checkedItem.length===1"
             @click="showEditForm">
          {{LAN.Edit.toUpperCase()}}
        </div>

        <div style="display:inline-block;margin-right:5px"
             v-if="checkedItem.length>0">
          <div class='_prem_btn_group_'
               @click="dis(0)">
            {{LAN.Disable.toUpperCase()}}
          </div>

          <div class='_prem_btn_group_'
               @click="dis(1)">
            {{LAN.Enable.toUpperCase()}}
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
                 @click="triggerCheckAll">
              <el-checkbox v-model="checkAll"
                           style="pointer-events:none"
                           class='SELF_CHECKBOX'></el-checkbox>
            </div>
            <div class="name">{{LAN.Nickname}}</div>
            <div class="perm">{{LAN.Email}}</div>
            <div class="perm">{{LAN.Role}}</div>
            <div class="perm">{{LAN.Status}}</div>
          </div>
          <el-scrollbar style=' height: calc(100vh - 178px);'>
            <div class="body"
                 @click="checkItem(item.id)"
                 v-if="item.isShow"
                 v-for="(item,index) in users">
              <div class="radio">
                <el-checkbox-group v-model="checkedItem"
                                   class='checkList'>
                  <el-checkbox class='SELF_CHECKBOX'
                               :label='item.id'></el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="name">{{item.nickName}}</div>
              <div class="perm">{{item.email}}</div>
              <div class="perm">{{item.role|filterRoles(roleList)}}</div>
              <div class="perm">{{item.status===1?LAN.Enabled:LAN.Disabled}}</div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>

    <card :title.sync="title">
      <div class="buttons"
           v-if="type==='dis'">
        <div class='default'
             @click="cancel">{{LAN.Cancel.toUpperCase()}}</div>
        <div class='active'
             @click='confirm'>{{LAN.OK.toUpperCase()}}</div>
      </div>

      <user-form v-if="type==='add'||type==='edit'"
                 :roleList="roleList"
                 :form="form"
                 @submit="submit"></user-form>

      <div class="uploadPSD"
           v-if="type==='uploadExcel'">
        <el-upload class="avatar-uploader"
                   action="http://localhost:5678/api/resolvePSD"
                   drag
                   :show-file-list="false"
                   :before-upload="beforeAvatarUpload">
          <i class="avatar-uploader-icon">{{LAN.DragExcel}}</i>
        </el-upload>
        <a :href="`${host}/tp5/public/excel/20190917/MAC.xls`"
           download="MAC-user.xls"
           class="download-link">{{LAN.DownloadTemplateFile}}</a>
      </div>
    </card>
  </div>
</template>

<script type='text/ecmascript-6'>
import myAside from "./myAside";
import userForm from "./userForm";
import { mapGetters } from "vuex";
import settings from "@/settings";
import { getToken } from "@/utils/auth";
import axios from "axios";
export default {
  components: { myAside, userForm },
  data() {
    return {
      searchValue: "",
      checkAll: false,
      // 浮层标题
      title: "",
      // 浮层类型
      type: "",
      checkedItem: [],
      // 表单
      form: {
        nickName: "",
        email: "",
        role: ""
      },
      // 角色列表
      roleList: [],
      // 用户列表
      users: [],
      // 记录状态值
      status: null,
      host: settings.host
    };
  },
  filters: {
    filterRoles(val, roleList) {
      let role = roleList.filter(e => {
        return +e.id === +val;
      });
      return role.length ? role[0].role : "";
    }
  },
  async created() {
    this.getUsers();
    this.roleList = await this.$store.dispatch("user/getRoles");
  },
  watch: {
    checkedItem(newVal) {
      if (newVal.length === this.users.length && newVal.length !== 0) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  },
  computed: {
    ...mapGetters(["LAN"])
  },
  methods: {
    search(e) {
      this.users.forEach(f => {
        f.isShow = f.email.indexOf(e) > -1 || f.nickName.indexOf(e) > -1;
      });
      // this.users.forEach(f => {
      //   f.isShow =
      //     e.split("").every(m => {
      //       return f.nickName.includes(m);
      //     }) ||
      //     e.split("").every(m => {
      //       return f.email.includes(m);
      //     });
      // });
    },
    // 切换全选
    triggerCheckAll() {
      this.checkAll = !this.checkAll;
      if (this.checkAll) {
        this.checkedItem = this.users.map(e => e.id);
      } else {
        this.checkedItem = [];
      }
    },
    // 上传表格
    beforeAvatarUpload(file) {
      console.log(file);
      const _this = this;
      let ext = file.name.split(".").pop();
      if (!/\.xlsx$|\.xls$/.test(file.name)) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.Error
        });
        return;
      }

      // 上传开始
      let param = new FormData();
      param.append("file", file);

      axios({
        method: "post",
        url: settings.baseUrl + "userexcel",
        headers: {
          "Content-Type": "multipart/form-data",
          token: getToken()
        },
        withCredentials: true,
        data: param
      })
        .then(function(response) {
          _this.$notify.success({
            title: _this.LAN.Success,
            message: _this.LAN.Success
          });

          _this.$store.dispatch("app/trigglerMask");

          _this.getUsers();
        })
        .catch(function(error) {
          _this.$notify.error({
            title: _this.LAN.Error,
            message: _this.LAN.Error
          });
        });

      // const isPSD = file.type === "image/vnd.adobe.photoshop";

      // if (!isPSD) {
      //   this.$notify.error({
      //     title: this.LAN.Error,
      //     message: this.LAN.AcceptPSD
      //   });
      // } else {
      //   // let psd = PSD.fromFile(file);
      //   // return true;
      // }
      return false;
    },
    // 上传 Excel
    uploadExcel() {
      this.title = this.LAN.uploadExcel;
      this.type = "uploadExcel";
      this.$store.dispatch("app/trigglerMask");
    },
    async getUsers() {
      let res = await this.$axios.post({
        url: "userlist"
      });

      this.users = res.data.data;
      this.users.forEach(e => {
        e.isShow = true;
      });
      this.$forceUpdate();
    },
    async dis(status) {
      // this.status = status;
      // this.title = (status === 1 ? this.LAN.Enable : this.LAN.Disable) + "?";
      // this.type = "dis";
      await this.$axios.post({
        url: "userstatus",
        data: {
          id: this.checkedItem.join(","),
          status
        }
      });
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      // this.$store.dispatch("app/trigglerMask");
      this.getUsers();
    },
    async submit() {
      if (this.type === "add") {
        await this.$axios.post({
          url: "/useradd",
          data: {
            email: this.form.email,
            userId: this.form.nickName,
            id: this.form.role
          }
        });
      } else {
        let res = await this.$axios.post({
          url: "usersave",
          data: {
            id: this.checkedItem[0],
            nickname: this.form.nickName,
            role_id: this.form.role,
            email: this.form.email
          }
        });

        if (!res) {
          this.$notify.error({
            title: this.LAN.Error,
            message: this.LAN.RepeatEmail
          });
          return;
        }
      }
      this.getUsers();
      this.form.nickName = "";
      this.form.role = "";
      this.form.email = "";
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
      this.$store.dispatch("app/trigglerMask");
    },
    cancel() {
      this.$store.dispatch("app/trigglerMask");
    },
    confirm(index) {
      this.checkedItem.forEach(e => {
        this.users[e].status = this.status;
      });
      this.$notify.success({
        title: this.LAN.Success,
        message: this.LAN.Success
      });
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
    showAddFrom() {
      this.title = this.LAN.AddUsers;
      this.type = "add";
      this.form = {
        roleName: "",
        roleValue: []
      };
      this.$store.dispatch("app/trigglerMask");
    },
    showEditForm() {
      this.title = this.LAN.EditUsers;
      this.type = "edit";

      let user = this.users.find(e => {
        return this.checkedItem[0] === e.id;
      });
      this.form = {
        nickName: user.nickName,
        email: user.email,
        role: user.role
      };
      this.$store.dispatch("app/trigglerMask");
    }
  }
};
</script>
