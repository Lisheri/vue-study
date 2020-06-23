<template>
  <div class="hello">
    test的儿子
    <button @click="handleClick">点击儿子</button>
  </div>
</template>

<script>
export default {
  name: 'test',
  data() {
      return {
        me: "我是test的子组件"
      }
  },
  created() {
    
  },
  methods: {
      handleClick() {
          console.info(this.msg)
      }
  },

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