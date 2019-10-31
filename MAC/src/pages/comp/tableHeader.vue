<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.back {
  padding: 20px 30px;
  padding-bottom: 7px;
  display: flex;
  .back-btn {
    flex: 0 0 84px;
    cursor: pointer;
    display: inline-block;
    &:hover {
      opacity: 0.7;
    }
    .el-icon-back {
      @extend .font;
    }
    .text {
      @extend .font;
      font-size: 12px;
      padding-left: 10px;
      display: inline-block;
      &:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 10px;
        vertical-align: top;
        background: $main;
        margin: 0 10px;
        margin-top: 1px;
      }
    }
  }
  .bread {
    display: inline-block;
    span,
    i {
      @extend .font;
      display: inline-block;
    }

    i {
      margin: 0 10px;
    }
    span {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

.all-files {
  padding: 20px 30px;
  padding-bottom: 7px;
  @extend .font;
}

.header {
  // padding: 0 30px;
  padding-left: 30px;
  display: flex;
  .el-checkbox {
    height: 22px;
    width: 22px;
    flex: 0 0 22px;
    margin-top: 15px;
  }
  .check-all {
    flex: 1;
    font: {
      size: 12px;
    }
    line-height: 48px;
    color: $main;
    padding-left: 10px;
    display: inline-block;
    vertical-align: top;
  }
  .time,
  .size {
    flex: 0 0 150px;
    @extend .font;
    text-align: center;
    line-height: 48px;
  }
  .time {
    flex: 0 0 180px;
    padding-right: 30px;
    box-sizing: border-box;
  }
  .hover {
    cursor: pointer;
  }
}
</style>

<template>
  <div @click.stop='emptyCheckList'>
    <div class='back'
         v-if='breadList.length'>
      <div class='back-btn'
           @click='back'>
        <i class="el-icon-back"></i>
        <div class='text'>{{LAN.Back}}</div>
      </div>
      <div class='bread'>
        <span @click="goHome">{{LAN.AllFiles}}</span>
        <span v-for="(item,index) in breadList"
              :key='index'
              @click="goBack(item)">
          <i class="el-icon-arrow-right"></i>
          <span>{{item.id===userInfo.prorootid?LAN.MyProject:item.name}}</span>
        </span>
      </div>
    </div>
    <div v-else
         class='all-files'>{{LAN.AllFiles}}</div>
    <div class='header'
         @click.stop>
      <el-checkbox v-model="checked"
                   class='SELF_CHECKBOX'></el-checkbox>
      <div class='check-all'
           v-if="!isColumn">
        {{allList.length?
        (allList.length+' ' +LAN.HasBeenSelect)
        :LAN.SelectAll}}
      </div>
      <div class='check-all hover'
           v-if='isColumn'
           @click="sort('name')">
        {{allList.length?
        (allList.length+' file'+(allList.length===1?'':'s')+'/folder'+(allList.length===1?'':'s')+' have been checked')
        :LAN.FileName}}
        <i class="el-icon-bottom"
           v-if="sortBy==='name-0'"></i>
        <i class="el-icon-top"
           v-if="sortBy==='name-1'"></i>
      </div>
      <div class="size hover"
           v-if='isColumn'
           @click="sort('size')">
        {{LAN.FileSize}}
        <i class="el-icon-bottom"
           v-if="sortBy==='size-0'"></i>
        <i class="el-icon-top"
           v-if="sortBy==='size-1'"></i>
      </div>
      <div class='time hover'
           v-if='isColumn'
           @click="sort('time')">
        {{LAN.LastModify}}
        <i class="el-icon-bottom"
           v-if="sortBy==='time-0'"></i>
        <i class="el-icon-top"
           v-if="sortBy==='time-1'"></i>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  props: ["checkAll", "breadList", "allList", "isColumn", "sortBy"],
  computed: {
    ...mapGetters(["LAN", "userInfo"]),
    checked: {
      set(val) {
        if (val) {
          this.$emit("update:checkAll", true);
        } else {
          this.$emit("emptyCheckList");
        }
      },
      get() {
        return this.checkAll;
      }
    }
  },
  methods: {
    emptyCheckList() {
      this.$emit("emptyCheckList");
    },
    goHome() {
      this.$emit("goHome");
    },
    back() {
      this.$emit("back");
    },
    goBack(item) {
      this.$emit("back", item.id);
    },
    sort(method) {
      this.$emit("sort", method);
    }
  },

  data() {
    return {};
  }
};
</script>
