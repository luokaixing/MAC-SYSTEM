<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.container {
  padding: 20px;
  .item {
    margin-bottom: 20px;
    .top {
      display: flex;
      .label {
        flex: 1;
        font-size: 12px;
        line-height: 32px;
      }
      .input-number {
        flex: 0 0 120px;
        width: 120px;
      }
    }
  }
}
.none {
  font-size: 20px;
  color: #999;
  line-height: 24px;
  text-align: center;
}

.reset {
  line-height: 40px;
  color: white;
  font-size: 16px;
  text-align: center;
  background: black;
  cursor: pointer;
}
</style>

<template>
  <div class='container'>
    <div class='text'
         v-if="type==='text'">
      <div class='item'>
        <div class='top'>
          <div class="label">{{LAN.Size}}(px)</div>
          <el-input-number v-model="activeItem&&activeItem.style.fontSize"
                           class='input-number'
                           @change="setPrototype"
                           :step="2"
                           :min="12"
                           :max="500"
                           :disabled="!activeItem">
          </el-input-number>
        </div>
        <el-slider v-model="activeItem&&activeItem.style.fontSize"
                   :disabled="!activeItem"
                   @change="setPrototype"
                   :step="2"
                   :min='12'
                   :max="500">
        </el-slider>
      </div>
      <div class='item'>
        <div class='top'>
          <div class="label">{{LAN.Color}}</div>
          <el-input v-model="activeItem.style.color"
                    @change="setPrototype"
                    class='input-number'
                    @blur='colorBlur'
                    placeholder="">
          </el-input>

        </div>
        <el-color-picker v-model="activeItem.style.color"
                         @change="setPrototype"
                         :predefine="colorList"></el-color-picker>
      </div>
    </div>

    <div class='pic'
         v-else-if="type==='pic'">
      <div class='item'>
        <div class='top'>
          <div class="label">{{LAN.Rotate}}(°)</div>
          <el-input-number v-model="activeItem.style.rotate"
                           @change="setPrototype"
                           class='input-number'
                           :min="0"
                           :max="359"
                           :disabled="!activeItem||activeItem.style.bgSrc===''">
          </el-input-number>
        </div>
        <el-slider v-model="activeItem.style.rotate"
                   @change="setPrototype"
                   :disabled="!activeItem||activeItem.style.bgSrc===''"
                   :min='0'
                   :max="359">
        </el-slider>
      </div>
      <div class='item'>
        <div class='top'>
          <div class="label">{{LAN.Zoom}}(%)</div>
          <el-input-number v-model="activeItem.style.scale"
                           @change="setPrototype"
                           class='input-number'
                           :min="50"
                           :max="500"
                           :disabled="!activeItem||activeItem.style.bgSrc===''">
          </el-input-number>
        </div>
        <el-slider v-model="activeItem.style.scale"
                   @change="setPrototype"
                   :disabled="!activeItem||activeItem.style.bgSrc===''"
                   :min='50'
                   :max="500">
        </el-slider>
      </div>
      <div class='item'>
        <div class='top'>
          <div class="label">{{LAN.BackgroundColor}}</div>
          <el-input v-model="activeItem.rect.backgroundColor"
                    @change="setPrototype"
                    class='input-number'
                    @blur='colorBlur'
                    placeholder="">
          </el-input>

        </div>
        <el-color-picker v-model="activeItem.rect.backgroundColor"
                         @change="setPrototype"
                         :predefine="colorList"></el-color-picker>
      </div>
    </div>

    <div v-else
         class='none'></div>

    <div class='reset'
         v-if="type!==''"
         @click='reset'>{{LAN.Reset.toUpperCase()}}</div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      type: "",
      rotate: 0,
      scale: 100,
      fontSize: 16,
      color: "#000000",
      colorList: [
        "#000000",
        "#ffffff",
        "#333333",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585"
      ]
    };
  },
  computed: {
    ...mapGetters(["activeItem", "LAN", "modelList", "model"])
  },
  watch: {
    activeItem: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal.type === "text") {
            this.type = "text";
          } else {
            this.type = "pic";
          }
        } else {
          this.type = "";
        }
      }
    }
  },
  methods: {
    setPrototype() {
      this.$store.dispatch("edit/setHasSave", false);
    },
    reset() {
      let findItem;

      this.modelList.find(f => {
        if (f.mid === this.model.mid) {
          f.model.find(e => {
            if (e.id === this.activeItem.id) {
              findItem = e;
            }
          });
        }
      });
      this.setPrototype();

      if (findItem.type !== "text") {
        this.activeItem.style.left = findItem.style.left / 4;
        this.activeItem.style.top = findItem.style.top / 4;
        this.activeItem.style.rotate = 0;
        this.activeItem.style.scale = 100;
        // this.activeItem.style.bgSrc = "";
      } else {
        this.activeItem.style.fontSize = findItem.style.fontSize / 4;
        this.activeItem.style.color = findItem.style.color;
      }
    },
    colorBlur() {
      let isColor = /^#?([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(
        this.color
      );

      if (!isColor) {
        this.color = "#000000";
      }
    }
  }
};
</script>
