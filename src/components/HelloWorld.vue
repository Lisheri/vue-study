<template>
  <div class="hello">
    <button @click="handleClick">点击此处展开或隐藏</button>
    <h1>{{ msg }}</h1>
    <chart-bar cid="testbar" id="testbar" :newdata="gData"></chart-bar>
    <a-button @click="handleChangeGraph">点击换图</a-button>
  </div>
</template>

<script>
import ChartBar from './ChartBar'
import Bus from '@/bus.js'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      gData: [
        { type: 'Sports', amount: 275 },
        { type: 'Test', amount: 300 }
      ]
    }
  },
  mounted() {
    Bus.$emit("changeTypeData")
  },
  methods: {
    handleClick() {
      this.$emit("click")
    },
    handleChangeGraph() {
      this.gData = [
        { type: 'Nice', amount: 500 },
        { type: 'Test', amount: 323 },
        { type: '测试', amount: 300 }
      ]
      this.$forceUpdate()
      this.$nextTick(() => {
        Bus.$emit("changeTypeData")
      })
    }
  },
  components: {ChartBar}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
