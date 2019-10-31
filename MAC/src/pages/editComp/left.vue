<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
.container {
  .tab-bar {
    padding: 16px 20px 18px 20px;
    .item {
      font-size: 14px;
      line-height: 45px;
      width: 50%;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: #f2f2f2;
      }
      &.active {
        background: #f2f2f2;
      }
    }
  }
}

.buttons-back {
  padding-top: 26px;
  width: 260px;
  margin: 0 auto;
  .prev {
    width: 260px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
  }
  .save {
    background: black;
    color: white;
  }
  .prev {
    background: black;
    color: white;
  }
}
</style>

<template>
  <div class='container'
       @click.stop>

    <div class='buttons-back'>
      <!-- <div class='prev'
           @click="showSaveAsProject=true">{{LAN.Back.toUpperCase()}}</div> -->
      <div class='prev'
           @click='newProject'>{{LAN.NewProject.toUpperCase()}}</div>
    </div>

    <div class='tab-bar'>
      <div class="item"
           @click="trigglerTab(true)"
           :class="{active:isLeft}">{{LAN.Template.toUpperCase()}}</div>
      <div class="item"
           @click="trigglerTab(false)"
           :class="{active:!isLeft}">{{LAN.Tools.toUpperCase()}}</div>
    </div>

    <temp v-show='isLeft'></temp>
    <tools v-show='!isLeft'></tools>
  </div>
</template>

<script type='text/ecmascript-6'>
import temp from "./temp";
import tools from "./tools";
import { mapGetters } from "vuex";
export default {
  components: { temp, tools },
  data() {
    return {};
  },
  methods: {
    newProject() {
      this.$emit("newProject");
    },
    trigglerTab(isLeft) {
      this.$store.dispatch("edit/trigglerTab", isLeft);
    }
  },
  computed: {
    ...mapGetters(["isLeft", "LAN"])
  }
};
</script>
