<template>
  <div class="hello">
    test的儿子
    <button @click="handleClick">点击儿子</button>
    <input type="text" v-model="grandSon" @input="handleInput">
    <div><span>我是儿子的儿子，我是孙子:{{foo}}</span></div>
  </div>
</template>

<script>
export default {
  name: 'test',
  // 后代组件使用inject注入
  inject: ["foo"],
  data() {
      return {
        me: "我是test的子组件",
        grandSon: "我是孙子"
      }
  },
  props: { "myData": {String}},
  inheritAttrs: true,
  created() {
    console.info(this.foo)
    this.gransSon = this.myData
  },
  methods: {
      handleClick() {
        // 爷爷给孙子传值中间不能被爸爸接收，若接收则传不下来
          console.info(this.myData)
      },
      handleInput() {
        this.$emit("parentAction", this.grandSon)
      }
  }

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