<template>
  <div id="app">
    <HelloWorld :msg="isOrNo" @click="isShow" />
    <Brother v-show="showCross" />
    <SmallBrother v-show="showCross" />
    <Actionone :showCross="showCross" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Actionone from "./components/1.vue";
import Brother from "./components/brother.vue";
import SmallBrother from "./components/smallBrother.vue";
import {isMatch} from './leetCode'
// import {lengthOfLongestSubstring} from './study.ts'
export default {
  name: "App",
  data() {
    return {
      showCross: false,
      isOrNo: "展示组件传参",
    };
  },
  created() {
  
  // * 用于判断回文子串
  
  console.info(isMatch("aaaaaaaaaaaaab", "a*a*a*a*a*a*a*a*a*a*a*a*b"));
  },
  components: {
    HelloWorld,
    Actionone,
    Brother,
    SmallBrother,
  },
  methods: {
    isShow() {
      // debugger
      this.showCross = !this.showCross;
      this.isOrNo =
        this.isOrNo === "展示组件传参" ? "隐藏组件传参" : "展示组件传参";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
