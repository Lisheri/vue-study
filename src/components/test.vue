<template>
  <div class="hello">
    测试标准
    <button @click="handleClick">点击儿子</button>
    <p>$attrs: {{$attrs}}</p>
    <p>$listeners: {{$listeners}}</p>
    <!-- 主要为了解决将1.vue中的方法，传递给testChild.vue，也就是爷爷向孙子传值 -->
    <!-- $attrs主要是存放没有被子组件继承的父组件数据对象，而$listeners将父组件放下继承下来传下去 -->
    <TestChild v-bind="$attrs" v-on="$listeners"/>
  </div>
</template>

<script>
import TestChild from './testChild.vue'
export default {
  name: 'test',
  props: {
    msg: {String}
  },
  data() {
      return {
        me: "我是子组件",
        father: "我是爸爸的儿子"
      }
  },
  // 配合$attrs使用，默认为true，如果没有被儿子组件接收的爷爷组件传递的参数，会绑定在儿子组件的根节点上显示出来，同时这些属性可以被孙子组件接收
  // 但如果为false，那么这样的默认行为，会被屏蔽，可以被孙子接收的数据，也不会现实在儿子组件的根节点上
  inheritAttrs: false,
  created() {
    // console.info(this.$attrs)
  },
  methods: {
      handleClick() {
          // 子组件通过props直接可以接收父组件通过v-bind(:)传递过来的参数
          console.info(this.msg)
          // this.$emit()中第一个参数为父组件通过v-on(@)传递的一个方法名，第二个参数，是这个方法的参数，通过this.$emit可以调用该方法
          this.$emit("parentAction", "儿子改变了爸爸")
          // this.$parent可以直接调用使用该子组件的父组件
          this.$parent.handleClickParent("儿子在喊爸爸做事")

          // 接收给孙子传的值
          // console.info(this.myData)
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