<style lang='scss' type='stylesheet/scss' scoped>
.link {
  font-size: 14px;
  color: white;
  display: inline-block;
  line-height: 48px;
  vertical-align: top;
  a {
    padding: 0 10px;
    vertical-align: top;
  }
}

.ok {
  background: black;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
  display: inline-block;
}

.default-btn {
  display: inline-block;
  background: #999;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
}
</style>

<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <img src="@/assets/icons/LOGO.png"
         draggable='false'
         @click.stop="dumpItem"
         class='logo'>
    <div class="right-menu">
      <!-- <template v-if="device!=='mobile'"> -->
      <!-- <search id="header-search" class="right-menu-item" /> -->

      <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

      <!-- <screenfull id="screenfull" class="right-menu-item hover-effect"/> -->

      <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      <!-- </template> -->

      <!-- <div class='link'> -->
      <div class="avatar-container right-menu-item"
           v-if="!$route.path.includes('admin')"
           @click="clearBread">
        <div @click="dumpItem"
             style="cursor:pointer">
          {{LAN.HomePage}}
        </div>
        <!-- <router-link to='/home/file'>{{LAN.HomePage}}</router-link> -->
        <!-- <router-link to='/home/edit'>{{LAN.Editor}}</router-link> -->
      </div>

      <div class="avatar-container right-menu-item hover-effect">
        <el-dropdown @command="hanlderLanguage">
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
      <div class="avatar-container right-menu-item hover-effect">
        <el-dropdown @command="handleCommand">
          <div class="avatar-wrapper">
            <img src="@/assets/icon/avatar.png"
                 draggable='false'
                 class="user-avatar">
            <span class='text'>{{LAN.UserCenter}}</span>
            <img src="@/assets/icon/arrow-down.png"
                 draggable='false'
                 class='arrow-down'>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='setting'
                              v-if="!$route.path.includes('admin')"> <i class="el-icon-setting tab-icon"></i>{{LAN.Settings.toUpperCase()}}</el-dropdown-item>
            <el-dropdown-item command='logout'> <i class="el-icon-back tab-icon"></i>{{LAN.LogOut.toUpperCase()}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <create-pro :title.sync='LAN.ConfirmLeave'
                @cancel="showCreateProject=false"
                v-if="showCreateProject">
      <div class='default-btn'
           @click="showCreateProject = false">{{LAN.Cancel.toUpperCase()}}</div>
      <div class='ok'
           style="float:right"
           @click="ok">{{LAN.OK.toUpperCase()}}</div>
    </create-pro>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import createPro from "../../pages/home/create";
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from "@/components/Screenfull";
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  data() {
    return {
      showCreateProject: false
    };
  },
  components: {
    createPro
    // Breadcrumb,
    // Hamburger,
    // ErrorLog,
    // Screenfull
    // SizeSelect,
    // Search
  },
  computed: {
    ...mapGetters([
      // "sidebar",
      "avatar",
      "device",
      "languageList",
      "LAN",
      "isSave"
    ]),
    showLanguageList() {
      return this.languageList.filter(e => {
        return +e.status === 1;
      });
    }
  },
  created() {
    // if (!localStorage.getItem("isNotFrist")) {
    //   this.logout();
    //   localStorage.setItem("isNotFirst", true);
    // }
  },
  methods: {
    ok() {
      this.showCreateProject = false;
      this.$router.push("/home/file");
    },
    dumpItem() {
      if (this.$route.path.includes("edit") && !this.isSave) {
        this.showCreateProject = true;
        return;
      }
      this.clearBread();
      this.$router.push("/home/file");
    },
    clearBread() {
      for (; this.$store.state.app.breadList.length; ) {
        this.$store.state.app.breadList.pop();
      }
      this.$store.dispatch("app/setBreadList", this.$store.state.app.breadList);

      this.$forceUpdate();
    },
    hanlderLanguage(id) {
      localStorage.setItem("language", id);
      this.$store.dispatch("language/trigglerLanguage", id);
    },
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "dumpFile":
          this.$router.push("/home/file");
          break;
        case "setting":
          this.$router.push("/setting");
          break;
      }
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/MAC_SELF.scss";

.tab-icon {
  font-size: 24px;
  line-height: 50px;
  vertical-align: top;
}
.logo {
  cursor: pointer;
  height: 14px;
  margin: {
    left: 20px;
    top: 17px;
  }
}
.navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #000;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // min-width: $minWidth;
  display: flex;
  justify-content: space-between;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 48px;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      &:first-child {
        &:before {
          content: none;
        }
      }
      &:before {
        content: "";
        display: inline-block;
        width: 1px;
        height: 18px;
        background: #999;
        vertical-align: middle;
        margin: {
          // top: 14px;
          right: 10px;
        }
      }

      .avatar-wrapper {
        // margin-top: 17px;
        position: relative;
        // display: inline-block;

        .user-avatar {
          // margin-top: 15px;
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
          line-height: 48px;
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
    }
  }
}
</style>
