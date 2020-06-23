<template>
  <div class="hello">
    测试标准
    <button @click="handleClick">点击儿子</button>
    <p>$attrs: {{$attrs}}</p>
    <!-- 主要为了解决将1.vue中的方法，传递给testChild.vue，也就是爷爷向孙子传值 -->
    <TestChild v-bind="$attrs" v-on="$listeners"/>
  </div>
</template>

<script>
import TestChild from './testChild.vue'
export default {
  name: 'test',
  props: {
    msg: String
  },
  data() {
      return {
        me: "我是子组件",
        father: "我是爸爸的儿子"
      }
  },
  created() {
    console.info(this.$attrs)
  },
  methods: {
      handleClick() {
          // 子组件通过props直接可以接收父组件通过v-bind(:)传递过来的参数
          console.info(this.msg)
          // this.$emit()中第一个参数为父组件通过v-on(@)传递的一个方法名，第二个参数，是这个方法的参数，通过this.$emit可以调用该方法
          this.$emit("parentAction", "儿子改变了爸爸")
          // this.$parent可以直接调用使用该子组件的父组件
          this.$parent.handleClickParent("儿子在喊爸爸做事")
      },
      handleClickChild(e) {
          console.info("我是儿子组件的内部方法")
          console.info(e)
      }
  },
  components: {TestChild}

}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>