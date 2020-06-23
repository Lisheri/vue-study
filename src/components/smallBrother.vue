<template>
  <div>
    弟弟
    <input type="text" :value="mySmallBrother" disabled />
    <button @click="hanldeChangeBigBrother">点击弟弟</button>
  </div>
</template>

<script>
import bus from "../bus.js";
export default {
  // 组件间传值方式一: bus
  data() {
    return {
      mySmallBrother: "我是弟弟"
    };
  },
  created() {
    bus.$on("changeSmallBrother", e => {
      this.mySmallBrother = e;
    });
  },
  methods: {
    hanldeChangeBigBrother() {
      bus.$emit("changeBigBrother", "弟弟喊哥哥");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>