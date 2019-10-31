<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
$red: red;
.panel-box {
  position: relative;
  .item {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    @include flexCenter;
    .text {
      line-height: 1;
    }

    .pic {
      @include flexCenter;
      .image {
        position: relative;
      }
    }

    .leftline {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $red;
      z-index: 2;
    }

    .rightline {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: $red;
      z-index: 2;
    }

    .topline {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 2px;
      background: $red;
      z-index: 2;
    }

    .bottomline {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 2px;
      background: $red;
      z-index: 2;
    }

    &:hover {
      .hoverleftline {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: $active;
        z-index: 1;
      }

      .hoverrightline {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: $active;
        z-index: 1;
      }

      .hovertopline {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 2px;
        background: $active;
        z-index: 1;
      }

      .hoverbottomline {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 2px;
        background: $active;
        z-index: 1;
      }
    }
  }
}
.text {
  word-break: break-all;
  // text-align: left !important;
}
.project-name {
  position: absolute;
  top: -30px;
  left: 0;
  font-size: 20px;
  color: #999;
}
</style>

<template>
  <div class='panel-box'
       ref='printMe'
       @mousedown.stop
       @click.stop>
    <div class='project-name'>{{projectName}}</div>
    <div class='item'
         v-for="(item,index) in modelList"
         :style="{
            width:item.rect.width+'px',
            height:item.type==='text'?(item.style.fontSize*item.rect.height+'px'):(item.rect.height+'px'),
            left:item.rect.left+'px',
            top:item.rect.top+'px',
            backgroundColor:item.type==='pic'?item.rect.backgroundColor:'',
          }"
         @click="setActiveItem(item)"
         :key='item.id'>
      <div v-if="activeItem===item&&!isPrint"
           class='leftline'></div>
      <div v-if="activeItem===item&&!isPrint"
           class='rightline'></div>
      <div v-if="activeItem===item&&!isPrint"
           class='topline'></div>
      <div v-if="activeItem===item&&!isPrint"
           class='bottomline'></div>
      <div v-if="!item.disable"
           class='hoverleftline'></div>
      <div v-if="!item.disable"
           class='hoverrightline'></div>
      <div v-if="!item.disable"
           class='hovertopline'></div>
      <div v-if="!item.disable"
           class='hoverbottomline'></div>
      <el-input :class="'text-area '+item.type+' '+(activeItem===item?'active':'') + ' ' +(item.style.textAlign?item.style.textAlign:'')+' '+(item.style.fontStyle?item.style.fontStyle:'')"
                :style="{
                  minHeight:item.style.fontSize*item.rect.height+'px',
                  maxHeight:item.style.fontSize*item.rect.height+'px',
                  fontSize:item.style.fontSize+'px',
                  color:item.style.color,
                  overflowY:'hidden'
                }"
                :autosize="{minRows:item.rect.height,maxRows:item.rect.height}"
                :ref="'area-'+item.id"
                :id="'area-'+item.id"
                @blur="blurArea(item)"
                @focus="setActiveItem(item),focu(item)"
                placeholder=""
                v-if="item.type==='text'&&!isPrint"
                v-model="item.content"></el-input>
      <!-- resize='none'
                type='textarea'
                :rows="item.rect.height" -->
      <div v-if="item.type==='text'&&isPrint"
           class='textarea-print text'
           :class="(item.style.textAlign?item.style.textAlign:'')+' '+(item.style.fontStyle?item.style.fontStyle:'')"
           :style="{
              width:item.rect.width+'px',
              height:item.type==='text'?(item.style.fontSize*1.5*item.rect.height+'px'):(item.rect.height+'px'),
              minHeight:item.style.fontSize*1*item.rect.height+'px',
              maxHeight:item.style.fontSize*1*item.rect.height+'px',
              fontSize:item.style.fontSize+'px',
              color:item.style.color,
              lineHeight: 1
            }"
           v-html='filterEnter(item.content)'></div>
      <div :class="item.type+' '+(activeItem===item?'active':'')"
           v-if="item.type==='pic'">
        <img :src="item.style.bgSrc"
             v-if='item.style.bgSrc'
             v-hammer:pan='pan'
             v-hammer:panstart='panStart'
             v-hammer:panend='panEnd'
             :class="(activeItem===item?'active':'')"
             :style="{
               transform:`scale(${item.style.scale/100}) rotate(${item.style.rotate}deg)`,
               left:item.style.left+'px',
               top:item.style.top+'px',
               maxWidth:item.rect.width+'px',
               maxHeight:item.rect.height+'px'
             }"
             class="image">
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  props: ["isPrint", "projectName"],
  data() {
    return {
      tmpContent: "",
      // 存储起点坐标
      box: {
        left: 0,
        top: 0
      },
      // 存储当前盒子的位置
      tmpBox: {
        left: 0,
        top: 0
      }
    };
  },
  computed: {
    ...mapGetters(["model", "activeItem", "LAN"]),
    modelList() {
      return this.model.model;
    }
  },
  created() {
    document.body.ondragstart = () => {
      return false;
    };
  },
  methods: {
    blurArea(item) {
      let el = document.querySelector("#area-" + item.id);
      el.scrollTop = 0;
    },
    filterEnter: function(val) {
      return val.replace(/\n/g, "<br/>");
    },
    focu(item) {
      if (this.$refs["area-" + item.id]) {
        setTimeout(() => {
          this.$refs["area-" + item.id][0].select();
        }, 100);
      }
    },
    setActiveItem(item) {
      if (!item.disable) {
        this.$store.dispatch("edit/trigglerTab", false);
        this.$store.dispatch("edit/setActiveItem", item);
      }
    },
    // 拖拽事件
    // 拖拽开始
    panStart(e) {
      if (!this.activeItem) {
        return;
      }

      // 设置起始坐标
      this.box.left = e.center.x;
      this.box.top = e.center.y;
      this.tmpBox.left = this.activeItem.style.left;
      this.tmpBox.top = this.activeItem.style.top;
    },
    // 拖拽
    pan(e) {
      if (!this.activeItem) {
        return;
      }
      this.$store.dispatch("edit/setHasSave", false);

      let activeItem = this.activeItem.style;
      activeItem.left = e.center.x - this.box.left + this.tmpBox.left;
      activeItem.top = e.center.y - this.box.top + this.tmpBox.top;
    },
    // 拖拽结束
    panEnd(e) {
      if (!this.activeItem) {
        return;
      }
      this.box.left = 0;
      this.box.top = 0;
    }
  }
};
</script>
