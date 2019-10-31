<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
.content {
  .el-aside {
    padding: 30px;
    background-color: #eee;
  }
  a {
    display: block;
    font-size: 14px;
    line-height: 2;
    color: black;
  }

  a + a {
    margin-top: 10px;
  }
}
</style>

<template>
  <el-aside style="margin-bottom:0;width:300px">
    <router-link to="/admin/perm">{{LAN.RolesPermissions}}</router-link>
    <router-link to="/admin/user">{{LAN.Users}}</router-link>
    <el-divider></el-divider>
    <router-link to="/admin/model">{{LAN.Templates}}</router-link>
    <el-divider></el-divider>
    <router-link to="/admin/language">{{LAN.Language}}</router-link>
  </el-aside>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["LAN"])
  }
};
</script>
