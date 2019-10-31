<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";
</style>

<template>
  <div @click.stop>
    <!-- @mousemove="hoverItem"
            @mouseleave="leaveItem" -->
    <canvas id="myCanvas"
            @click='checkItem'
            width="600"
            height="620"></canvas>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["model", "activeItem"]),
    domList() {
      return this.model.sort((a, b) => {
        return a.rect.zIndex - b.rect.zIndex;
      });
    }
  },
  // watch: {
  //   activeItem: {
  //     immediate: true,
  //     deep: true,
  //     handler(newVal) {
  //       if (newVal) {
  //         this.drawRectImage();
  //       }
  //     }
  //   }
  // },
  methods: {
    // drawRect(ctx, el) {
    //   ctx.fillStyle = el.rect.backgroundColor;

    //   ctx.fillRect(el.rect.left, el.rect.top, el.rect.width, el.rect.height);
    // },
    // drawBorder(ctx, el) {
    //   if (this.hoverDom === el) {
    //     ctx.lineWidth = 4;
    //     ctx.strokeStyle = "rgba(51, 173, 51, 1)";
    //     ctx.strokeRect(
    //       el.rect.left + 2,
    //       el.rect.top + 2,
    //       el.rect.width - 4,
    //       el.rect.height - 4
    //     );
    //   }

    //   if (this.activeItem === el) {
    //     ctx.lineWidth = 4;
    //     ctx.strokeStyle = "red";
    //     ctx.strokeRect(
    //       el.rect.left + 2,
    //       el.rect.top + 2,
    //       el.rect.width - 4,
    //       el.rect.height - 4
    //     );
    //   }
    // },
    // drawCanvasRect() {
    //   var c = document.getElementById("myCanvas");
    //   if (c) {
    //     var ctx = c.getContext("2d");
    //     for (let index = 0; index < this.domList.length; index++) {
    //       const el = this.domList[index];
    //       this.drawRect(ctx, el);
    //       this.drawBorder(ctx, el);
    //     }
    //   }
    // },
    drawPic(ctx, el) {
      return new Promise((resolve, reject) => {
        // if (el.style.img) {
        //   ctx.drawImage(
        //     pic,
        //     0,
        //     0,
        //     el.rect.width,
        //     el.rect.height,
        //     el.rect.left,
        //     el.rect.top,
        //     el.rect.width,
        //     el.rect.height
        //   );
        // } else {
        let pic = new Image();
        pic.onload = function() {
          el.img = pic;
          ctx.drawImage(
            pic,
            0,
            0,
            el.rect.width,
            el.rect.height,
            el.rect.left,
            el.rect.top,
            el.rect.width,
            el.rect.height
          );
          resolve();
        };
        pic.src = el.style.bgSrc;
        // }
      });
    },
    async drawRectImage() {
      const _this = this;
      var c = document.getElementById("myCanvas");
      if (c) {
        var ctx = c.getContext("2d");
        for (let index = 0; index < this.domList.length; index++) {
          // 获取元素
          const el = this.domList[index];
          // 设置背景色
          ctx.fillStyle = el.rect.backgroundColor;
          // 画矩形
          ctx.fillRect(
            el.rect.left,
            el.rect.top,
            el.rect.width,
            el.rect.height
          );

          // 画图片
          if (el.style.bgSrc) {
            // if (!el.style.img) {
            await this.drawPic(ctx, el);
            // } else {
            //   ctx.drawImage(el.style.img, el.rect.left, el.rect.top);
            // }
          }
          if (_this.activeItem === el) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "red";
            ctx.strokeRect(
              el.rect.left + 2,
              el.rect.top + 2,
              el.rect.width - 4,
              el.rect.height - 4
            );
          }

          // // 画 hover 描边
          // if (this.hoverDom === el) {
          //   ctx.lineWidth = 4;
          //   ctx.strokeStyle = "rgba(51, 173, 51, 1)";
          //   ctx.strokeRect(
          //     el.rect.left + 2,
          //     el.rect.top + 2,
          //     el.rect.width - 4,
          //     el.rect.height - 4
          //   );
          // }
        }
      }
    }
    // leaveItem() {
    //   this.hoverDom = null;
    //   this.drawRectImage();
    // },
    // hoverItem(e) {
    //   let x = e.offsetX;
    //   let y = e.offsetY;
    //   let tmpDom = this.domList.sort((a, b) => {
    //     return -a.rect.zIndex + b.rect.zIndex;
    //   });

    //   for (let index = 0; index < tmpDom.length; index++) {
    //     const el = tmpDom[index].rect;
    //     if (
    //       x > el.left &&
    //       x < el.left + el.width &&
    //       y > el.top &&
    //       y < el.top + el.height
    //     ) {
    //       this.hoverDom = tmpDom[index];
    //       this.drawRectImage();
    //       break;
    //     }
    //   }
    // },
    // checkItem(e) {
    //   let x = e.offsetX;
    //   let y = e.offsetY;
    //   let tmpDom = this.domList.sort((a, b) => {
    //     return -a.rect.zIndex + b.rect.zIndex;
    //   });

    //   for (let index = 0; index < tmpDom.length; index++) {
    //     const el = tmpDom[index].rect;
    //     if (
    //       x > el.left &&
    //       x < el.left + el.width &&
    //       y > el.top &&
    //       y < el.top + el.height
    //     ) {
    //       this.$store.dispatch("edit/setActiveItem", tmpDom[index]);
    //       break;
    //     }
    //   }
    // }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.drawRectImage();
    // });
  },
  data() {
    return {
      hoverDom: null
    };
  }
};
</script>
