<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.warpper {
  @include flexCenter;
  height: calc(100vh - 74px);
  .card-warpper {
    width: 500px;
    padding: 40px;
    box-sizing: border;
    background: white;
    .title {
      font-size: 16px;
      color: black;
      font-weight: bold;
      margin-bottom: 45px;
      text-align: center;
    }
    .content {
      display: block;
      text-align: center;
      .left,
      .right {
        display: inline-block;
        vertical-align: top;
      }
      .center {
        display: inline-block;
        width: 1px;
        height: 235px;
        vertical-align: top;
        margin: 0 40px;
        background: #999;
      }
      .input-item {
        display: block;
        font-size: 12px;
        width: 100%;
        height: 42px;
        padding: 20px 27px;
        border: solid 1px #999;
        box-sizing: border-box;
        margin-bottom: 20px;
        &::placeholder {
          color: #999;
        }
      }
    }
  }
}

.btn {
  width: 100%;
  font-size: 14px;
  line-height: 42px;
  text-align: center;
  color: white;
  background: black;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 20px;
  &:hover {
    opacity: 0.7;
  }
}
.item {
  display: flex;
  .item-label {
    text-align: left;
    font-size: 12px;
    flex: 0 0 120px;
    line-height: 42px !important;
    height: 42px;
    margin-right: 10px;
  }
  .input-item {
    flex: 1;
  }
}
</style>

<template>
  <div class='warpper'>
    <div class='card-warpper'>
      <div class='title'>{{LAN.Settings}}</div>
      <div class='content'>
        <!-- <div class="left"> -->
        <!-- <input v-model='form.email'
                 :placeholder="LAN.Email"
                 class="input-item"> -->

        <div class="item">
          <span class="item-label">{{LAN.DisplayName}}:</span>
          <input v-model='form.username'
                 :placeholder="LAN.DisplayName"
                 class="input-item">
        </div>
        <!-- </div> -->
        <!-- <div class="center"></div> -->
        <!-- <div class='right'> -->
        <div class="item">
          <div class="item-label">{{LAN.OldPassword}}:</div>
          <input v-model='form.oldPass'
                 type='password'
                 :placeholder="LAN.OldPassword"
                 class="input-item">
        </div>
        <div class="item">
          <div class="item-label">{{LAN.NewPassword}}:</div>

          <input v-model='form.newPass'
                 type='password'
                 :placeholder="LAN.NewPassword"
                 class="input-item">
        </div>
        <div class="item">
          <div class="item-label">{{LAN.ReEnterPassword}}:</div>

          <input v-model='form.queryPass'
                 type='password'
                 :placeholder="LAN.ReEnterPassword"
                 class="input-item">
        </div>

        <!-- </div> -->
      </div>

      <div class='btn'
           @click="submit">{{LAN.OK.toUpperCase()}}</div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["LAN", "userInfo"])
  },
  data() {
    return {
      form: {
        email: "",
        username: "",
        oldPass: "",
        newPass: "",
        queryPass: ""
      }
    };
  },
  created() {
    this.form.username = this.userInfo.name;
  },
  methods: {
    async submit() {
      this.form.username = this.form.username.replace(/^\s+|\s+$/g, "");
      this.form.oldPass = this.form.oldPass.replace(/^\s+|\s+$/g, "");
      this.form.newPass = this.form.newPass.replace(/^\s+|\s+$/g, "");
      this.form.queryPass = this.form.queryPass.replace(/^\s+|\s+$/g, "");
      if (
        this.form.username === "" ||
        this.form.oldPass === "" ||
        this.form.newPass === ""
      ) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.PleaseCompleteTheForm
        });
        return;
      }

      if (this.form.newPass !== this.form.queryPass) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.PasswordError
        });
        return;
      }

      let res = await this.$axios.post({
        url: "settings",
        data: {
          newname: this.form.username,
          password: this.form.oldPass,
          newpassword: this.form.newPass
        }
      });
      if (+res.data.code === 0) {
        this.$notify.success({
          title: this.LAN.Success,
          message: this.LAN.Success
        });

        this.$router.push("/");
      } else if (+res.data.code === -1) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.PasswordLength
        });
      } else if (+res.data.code === -2) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.PasswordError
        });
      }
    }
  }
};
</script>
