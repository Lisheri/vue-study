<template>
  <div>
      <twenty-test />
  </div>
</template>
<script>
import Vue from "vue";
// 为了不被map跳过，可以使用以下三种方法生成一定数量并且每一个值为undefined的数组
/*
    Array.apply(null, {length: 20})
    Array.apply(null, Array(20))
    Array.apply(null, new Array(20))
*/
Vue.component("twenty-test", {
  render: function(createElement) {
    return createElement(
      "ul",
    //   this.$slots.default
        Array.apply(null, { length: 20 }).map(function(item, index) {
          return createElement("li", `连续创建第${index+1}个`);
        }).concat([
            createElement(
                'span',
                this.$slots.default
            )
        ])
    );
  },
  props: {
    level: {
      type: Number,
      required: false
    }
  }
});
export default {};
</script>
<style lang="scss" scoped>
</style>