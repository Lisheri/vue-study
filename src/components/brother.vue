<template>
  <div>
    哥哥
    <input type="text" :value="myBigBrother" disabled />
    <button @click="handleClickBigBrother">点击哥哥</button>
  </div>
</template>

<script>
import bus from "../bus.js";
export default {
  data() {
    return {
      myBigBrother: "我是哥哥"
    };
  },
  created() {
    // $emit调用的同时，$on就会越过声明周期执行
    bus.$on("changeBigBrother", e => {
      this.myBigBrother = e;
    });
  },
  methods: {
    handleClickBigBrother() {
      bus.$emit("changeSmallBrother", "哥哥喊弟弟");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>