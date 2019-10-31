<style lang='scss' type='stylesheet/scss' scoped>
@import "../../styles/MAC_SELF.scss";
.top {
  width: 100%;
  min-width: $minWidth;
  height: 48px;
  background: $main;
}
.other {
  width: 100%;
  height: calc(100vh - 48px);
  background: $bgColor;

  display: flex;
  align-items: center;
  justify-content: center;
  min-width: $minWidth;
  .form-warpper {
    width: 550px;
    background: white;
    box-sizing: border-box;
    &.login {
      padding: 60px 0 0 125px;
      height: 480px;
      .title {
        font-size: 16px;
        margin-bottom: 60px;
        color: $main;
        font-weight: bold;
      }
      .grey_input {
        display: block;
        margin-bottom: 16px;
        width: 300px;
        &:last-child {
          margin-bottom: 13px;
        }
      }
      .forget {
        width: 300px;
        text-align: right;
        text-decoration: underline;
        font-size: 12px;
        margin-bottom: 30px;
        color: $grey;
        cursor: pointer;
      }
      .submit {
        cursor: pointer;
        font-size: 14px;
        line-height: 42px;
        // font-weight: bold;
        color: white;
        background: black;
        width: 300px;
        text-align: center;
      }
    }
    &.forget {
      padding: 60px 0 80px 0;
      position: relative;
      i {
        position: absolute;
        padding: 20px;
        font-size: 30px;
        color: black;
        cursor: pointer;
        top: 0;
        left: 0;
      }
      .title {
        font-size: 16px;
        line-height: bold;
        text-align: center;
      }
      .desc {
        font-size: 12px;
        color: #707070;
        margin-top: 30px;
        text-align: center;
        margin-bottom: 100px;
      }
      .send {
        width: 150px;
        margin: 0 auto;
        line-height: 42px;
        font-size: 14px;
        color: white;
        background: black;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.logo {
  height: 14px;
  margin: {
    left: 20px;
    top: 17px;
  }
}

.avatar-wrapper {
  position: relative;
  margin-top: 12px;
  .user-avatar {
    cursor: pointer;
    width: 18px;
    height: 18px;
    border-radius: 40px;
    vertical-align: middle;
  }

  .arrow-down {
    vertical-align: middle;
    display: inline-block;
    width: 24px;
    height: 24px;
    // margin-top: 8px;
  }

  .text {
    font-size: 14px;
    line-height: 24px;
    color: white;
    display: inline-block;
    vertical-align: top;
    margin: 0 5px;
  }

  .el-icon-arrow-down {
    cursor: pointer;
    line-height: 40px;
    font-size: 16px;
    color: white;
    vertical-align: top;
  }
}
</style>

<template>
  <div class='container'
       v-loading="loading">
    <div class='top'>
      <img src="@/assets/icons/LOGO.png"
           draggable='false'
           class='logo'>

      <el-dropdown @command="hanlderLanguage"
                   style="float: right;margin-right:20px">
        <div class="avatar-wrapper">
          <img src="@/assets/icon/earth.png"
               draggable='false'
               class="user-avatar">
          <span class='text'>{{LAN.Language}}</span>
          <img src="@/assets/icon/arrow-down.png"
               draggable='false'
               class='arrow-down'>
          <!-- <i class="el-icon-arrow-down" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,key) in showLanguageList"
                            :command="item.id"
                            :key='key'>{{item.language}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class='other'>
      <div class='form-warpper login'
           v-if="showLogin">
        <div class='title'>{{LAN.Account}}</div>
        <input v-model="loginForm.username"
               ref='username'
               @keydown.13="submit"
               type='text'
               class='grey_input'
               placeholder="Email"></input>
        <input v-model="loginForm.password"
               ref='password'
               @keydown.13="submit"
               type='password'
               class='grey_input'
               placeholder="PASSWORD"></input>
        <div class='forget'
             @click='showLogin=false'>{{LAN.ForgotPassword}}</div>
        <div class='submit'
             @click='submit'>{{LAN.LogIn.toUpperCase()}}</div>
      </div>

      <div class='form-warpper forget'
           v-else>
        <i class="el-icon-back"
           @click='showLogin=true'></i>
        <div class='title'>{{LAN.ForgotPassword}}</div>
        <div class='desc'>{{LAN.ClickSend}}</div>
        <div class='send'
             @click='send'>{{LAN.Send.toUpperCase()}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      showLogin: true,
      loginForm: {
        username: "",
        password: ""
      }
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["LAN", "languageList"]),
    showLanguageList() {
      console.log(this.languageList);

      return this.languageList.filter(e => {
        return +e.status === 1;
      });
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    hanlderLanguage(id) {
      localStorage.setItem("language", id);
      this.$store.dispatch("language/trigglerLanguage", id);
    },
    send() {
      alert(this.LAN.OK);
    },
    submit() {
      if (
        this.loginForm.username.trim() === "" ||
        this.loginForm.password.trim() === ""
      ) {
        this.$fillForm();
        return;
      }
      this.loading = true;

      localStorage.setItem("username", this.loginForm.username.trim());
      localStorage.setItem("password", this.loginForm.password.trim());

      this.$store.dispatch("app/trigglerLoading", true);

      this.$store
        .dispatch("user/login", this.loginForm)
        .then(res => {
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery
          });
          this.$store.dispatch("app/trigglerLoading", false);
        })
        .catch(error => {
          // this.$notify.error({
          //   title: this.LAN.Error,
          //   message: error
          // });
          this.loading = false;
          this.$store.dispatch("app/trigglerLoading", false);
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>
