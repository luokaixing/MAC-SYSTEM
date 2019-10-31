<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.perm {
  margin: 20px 0;
  display: inline-block;
  font-size: 16px;
  color: #333;
}
.ok {
  background: black;
  color: white;
  font-size: 14px;
  line-height: 48px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
}
</style>

<template>
  <div>
    <el-input v-model="form.roleName"
              class='normal-input'
              :placeholder="LAN.RoleName"></el-input>
    <div>
      <span class="perm">{{LAN.Permissions}}:</span>
      <el-checkbox-group v-model="form.roleValue"
                         class='checkList'>
        <el-checkbox class='SELF_CHECKBOX _HAS_LABEL'
                     v-for="(item,index) in roleList"
                     :key="index"
                     :label="item.id">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class='ok'
         @click="submit">{{LAN.OK.toUpperCase()}}</div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  props: ["form"],
  data() {
    return {
      checkedItem: [],
      roleList: []
    };
  },
  computed: {
    ...mapGetters(["LAN"])
  },
  created() {
    console.log(1);
    console.log(this.roleList);

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
    console.log(this.roleList);
  },
  methods: {
    submit() {
      if (!this.form.roleName || !this.form.roleValue.length) {
        this.$notify.warning({
          title: this.LAN.Warning,
          message: this.LAN.PleaseCompleteTheForm
        });
        return;
      }
      this.$emit("submit");
    }
  }
};
</script>
