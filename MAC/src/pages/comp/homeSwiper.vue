<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.big-map {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  min-width: 1300px;
  backdrop-filter: blur(10px);
  .el-icon-close {
    z-index: 10;
    font-size: 40px;
    color: white;
    position: absolute;
    right: 140px;
    top: 40px;
    padding: 20px;
    cursor: pointer;
  }
  .content {
    flex: 1;
  }
  .swiper-container {
    height: 100%;
    .swiper-slide {
      padding: 0 20px;
      box-sizing: border-box;
      @include flexCenter;
      font-size: 20px;
      .img-warpper {
        width: 100%;
        height: calc(100vh - 400px);
        background: {
          repeat: no-repeat;
          size: contain;
          position: center;
        }
      }
      .info-warpper {
        width: 800px;
        margin: 0 auto;
        padding: {
          left: 80px;
        }
        margin-top: 50px;
        display: flex;
        .info-item {
          flex: 1;
          color: white;
          .label {
            font-size: 14px;
            line-height: 27px;
          }
          .value {
            font-size: 18px;
            line-height: 27px;
          }
        }
      }
    }
  }
  .button {
    flex: 0 0 200px;
    position: relative;
    font: {
      size: 40px;
      weight: bold;
    }
    line-height: calc(100vh);
    text-align: center;
    color: white;
    i {
      padding: 20px;
      cursor: pointer;
      border-radius: 50%;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>

<template>
  <div class='big-map'>
    <i class="el-icon-close close"
       @click='close'></i>
    <div class='button'>
      <i class="el-icon-arrow-left"
         @click='pre'></i>
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for='item in imgList'
             :key='item.id'>
          <div class='content'>
            <div class='img-warpper'
                 :style="'background-image:url('+item.file_url+')'"></div>
            <div class='info-warpper'>
              <div class='info-item'>
                <div class='label'>{{LAN.DateUploaded}}</div>
                <div class="value">{{(item.update_time||'')|formatTimeSplit}}</div>
              </div>
              <div class='info-item'>
                <div class='label'>{{LAN.FileSize}}</div>
                <div class="value">{{item.resolution||'-'}}</div>
              </div>
              <div class='info-item'>
                <div class='label'>{{LAN.TemplateNumber}}</div>
                <div class="value">{{item.templatenumber||'-'}}</div>
              </div>
              <!-- <div class='info-item'>
                <div class='label'>{{LAN.Language}}</div>
                <div class="value">English</div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='button'>
      <i class="el-icon-arrow-right"
         @click='next'></i>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import Swiper from "swiper";
import { mapGetters } from "vuex";
export default {
  props: ["activeImg", "list"],
  data() {
    return {
      mySwiper: null
    };
  },
  computed: {
    ...mapGetters(["LAN"]),
    imgList() {
      return this.list.filter(e => e.type === "pic");
    }
  },
  methods: {
    close() {
      this.$emit("update:activeImg", null);
    },
    next() {
      this.mySwiper.slideNext();
    },
    pre() {
      this.mySwiper.slidePrev();
    }
  },
  mounted() {
    this.mySwiper = new Swiper(".swiper-container", {
      // 如果需要分页器
      pagination: ".swiper-pagination",
      // 如果需要前进后退按钮
      nextButton: ".next",
      prevButton: ".prev"
    });
    let idx = "";
    this.imgList.find((e, index) => {
      if (e === this.activeImg) {
        return (idx = index);
      }
    });
    this.mySwiper.slideTo(idx);
  }
};
</script>
