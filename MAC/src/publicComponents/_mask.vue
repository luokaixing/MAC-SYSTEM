<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.__mask-warpper {
  position: fixed;
  top: 0;
  backdrop-filter: blur(10px);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  @include flexCenter;
  z-index: 10;
  .__mask-card {
    min-width: 500px;
    background: white;
    padding: 55px 44px 48px 44px;
    box-sizing: border-box;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
    position: relative;
    .el-icon-close {
      font-size: 24px;
      padding: 10px;
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .__mask-title {
      font-size: 16px;
      margin-bottom: 40px;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>

<template>
  <div class='__mask-warpper'
       v-if="showMask"
       @click.right.stop
       @click.stop='trigglerMask'>
    <div class="__mask-card"
         @click.stop>
      <i class="el-icon-close"
         @click.stop="cancelMask"></i>
      <h1 class="__mask-title">{{title}}</h1>
      <slot></slot>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  name: "card",
  props: {
    title: {
      type: String,
      default: "Title"
    }
  },
  methods: {
    cancelMask() {
      this.$store.dispatch("app/trigglerMask");
    },
    trigglerMask() {
      this.$store.dispatch("app/trigglerMask");
    }
  },
  computed: {
    ...mapGetters(["showMask"])
  },
  data() {
    return {};
  }
};
</script>
