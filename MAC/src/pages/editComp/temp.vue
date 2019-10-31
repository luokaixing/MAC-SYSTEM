<!--  -->

<style lang='scss' type='stylesheet/scss' scoped>
@import "@/styles/MAC_SELF.scss";

.model-list-warpper {
  padding: 20px 36px 0 36px;
  .list-item {
    // margin-bottom: 20px;
    /* margin-bottom: 20px; */
    width: 100px;
    margin: 0 auto 20px auto;
    &.active {
      box-shadow: 0 0 0 3px black;
    }
    img {
      width: 100%;
    }
  }
}

.scroll {
  height: calc(100vh - 193px);
}

img {
  pointer-events: none;
}

.ok {
  background: black;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
  display: inline-block;
}

.default-btn {
  display: inline-block;
  background: #999;
  color: white;
  font-size: 14px;
  line-height: 42px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
  cursor: pointer;
}
</style>

<template>
  <div>
    <el-scrollbar class='scroll black'>
      <ul class='model-list-warpper'>
        <li class='list-item'
            @click='chooseItem(item)'
            :class="{active:modelId===item.mid}"
            v-for='(item,index) in modelList'
            :key='item.thumb'>
          <img :src="item.thumb"
               draggable='false'>
        </li>
      </ul>
    </el-scrollbar>

    <create-pro :title.sync='LAN.ConfirmLeave'
                @cancel="showCreateProject=false"
                v-if="showCreateProject">
      <div class='default-btn'
           @click="showCreateProject = false">{{LAN.Cancel.toUpperCase()}}</div>
      <div class='ok'
           style="float:right"
           @click="ok">{{LAN.OK.toUpperCase()}}</div>
    </create-pro>
  </div>
</template>

<script type='text/ecmascript-6'>
import createPro from "../home/create";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["modelList", "modelId", "LAN", "isSave", "model"])
  },
  components: { createPro },
  data() {
    return {
      activeIndex: "",
      showCreateProject: false,
      item: null
    };
  },
  async created() {
    if (!this.modelList.length) {
      let res = await this.$axios.post({
        url: "modelshow"
      });

      let models = res.data.data;

      models.forEach(async e => {
        e.thumb = await this.$store.dispatch("file/perfixUrl", {
          item: e.thumb
        });

        e.model = JSON.parse(
          e.model
            .replace(/ /g, "")
            .replace(/\n/g, "")
            .replace(/\r/g, "")
        );

        e.model.forEach((f, index) => {
          f.id = index;
        });
      });

      this.$store.dispatch("edit/setModelList", models);
    }
  },
  methods: {
    ok() {
      this.showCreateProject = false;

      this.$store.dispatch("edit/setModelId", this.item.mid);
      this.$store.dispatch("edit/setModel", this.item);
    },
    chooseItem(item) {
      if (this.modelId === item.mid) {
        return;
      }

      this.item = item;

      console.log(this.model.mid);

      let findModel = {
        ...this.modelList.find(e => {
          return +e.mid === +this.model.mid;
        })
      };
      console.log(findModel);

      let model = {};

      const SIZE = 4;
      // 勿动 - -!
      if (this.model.model) {
        model = JSON.parse(JSON.stringify(this.model));
        this.model.model.filter((e, index) => {
          if (e.type !== "text") {
            model.model[index].rect.height = e.rect.height * 4;
            model.model[index].style.left = e.style.left * 4;
            model.model[index].style.top = e.style.top * 4;
          } else {
            model.model[index].style.fontSize = e.style.fontSize * 4;
          }
          model.model[index].rect.width = e.rect.width * 4;
          model.model[index].rect.left = e.rect.left * 4;
          model.model[index].rect.top = e.rect.top * 4;
        });
      }
      // if (this.model.model) {
      //   model = JSON.parse(JSON.stringify(this.model));
      //   this.model.model.filter((e, index) => {
      //     if (e.type !== "text") {
      //       model.model[index].rect.height = e.rect.height / SIZE / SIZE / SIZE;
      //       model.model[index].style.left = e.style.left / SIZE / SIZE / SIZE;
      //       model.model[index].style.top = e.style.top / SIZE / SIZE / SIZE;
      //     } else {
      //       model.model[index].style.fontSize = e.style.fontSize / SIZE / SIZE;
      //     }
      //     model.model[index].rect.width = e.rect.width / SIZE / SIZE / SIZE;
      //     model.model[index].rect.left = e.rect.left / SIZE / SIZE / SIZE;
      //     model.model[index].rect.top = e.rect.top / SIZE / SIZE / SIZE;
      //   });
      // }

      console.log(model);

      // if (findModel.model) {
      //   findModel.width = findModel.width / SIZE;
      //   findModel.height = findModel.height / SIZE;
      //   findModel.model.filter((e, index) => {
      //     if (e.type !== "text") {
      //       e.rect.height = e.rect.height / SIZE;
      //       e.style.left = e.style.left / SIZE;
      //       e.style.top = e.style.top / SIZE;
      //     } else {
      //       e.style.fontSize = e.style.fontSize / SIZE;
      //     }
      //     e.rect.width = e.rect.width / SIZE;
      //     e.rect.left = e.rect.left / SIZE;
      //     e.rect.top = e.rect.top / SIZE;
      //   });
      // }

      if (model) {
        console.log(JSON.stringify(findModel.model));
        console.log(JSON.stringify(model.model));

        console.log(
          JSON.stringify(findModel.model) === JSON.stringify(model.model)
        );
      }

      if (JSON.stringify(findModel.model) !== JSON.stringify(model.model)) {
        this.showCreateProject = true;
      } else {
        this.ok();
      }
    }
  }
};
</script>
