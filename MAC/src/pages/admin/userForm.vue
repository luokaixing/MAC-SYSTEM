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

.normal-input + .normal-input {
  margin-top: 20px;
  width: 100%;
}

.item {
  display: flex;
  margin-bottom: 10px;
  .label {
    // flex: 0 0 100px;
    font-size: 12px;
    flex: 0 0 70px;
    line-height: 44px !important;
    text-align: left;
    height: 44px;
  }
  .normal-input {
    flex: 1;
  }
}
</style>

<template>
  <div>
    <div class="item">
      <div class="label">{{LAN.Nickname}}:</div>
      <el-input v-model="form.nickName"
                class='normal-input'
                :placeholder="LAN.Nickname"></el-input>

    </div>
    <div class="item">
      <div class="label">{{LAN.Email}}:</div>
      <el-input v-model="form.email"
                class='normal-input'
                :placeholder="LAN.Email"></el-input>

    </div>
    <div class="item">
      <div class="label">{{LAN.Role}}:</div>
      <el-select v-model="form.role"
                 :placeholder="LAN.RoleName"
                 class="normal-input">
        <el-option v-for="item in roleList"
                   :value="item.id"
                   :key="item.id"
                   :label="item.role"></el-option>
      </el-select>
    </div>

    <div class='ok'
         @click="submit">{{LAN.OK.toUpperCase()}}</div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  props: ["form", "roleList"],
  data() {
    return {
      checkedItem: []
    };
  },
  computed: {
    ...mapGetters(["LAN"])
  },
  async created() {},
  methods: {
    submit() {
      if (!this.form.email || !this.form.nickName || !this.form.role) {
        this.$notify.warning({
          title: this.LAN.Warning,
          message: this.LAN.PleaseCompleteTheForm
        });
        return;
      }

      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (!reg.test(this.form.email)) {
        this.$notify.error({
          title: this.LAN.Error,
          message: this.LAN.EmailFormatError
        });
        return;
      }

      this.$emit("submit");
    }
  }
};
</script>
