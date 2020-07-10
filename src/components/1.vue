<template>
  <div class="hello">
    爷爷组件
    <!-- 第一种通信方式，采用props和$emit的父子组件通信 -->
    <Test :msg="child" :myData="child" @parentAction="parentAction" prop="data" v-show="showCross"/>
    <a-button @click="handleClick('/directive')">自定义指令</a-button>
    <a-button @click="handleClick('/jsx')">render函数</a-button>
    <a-button @click="handleClick('/slot')">vue插槽</a-button>
    <a-button @click="handleClick('/reduce')">数组reduce用法</a-button>
    <a-button @click="handleClick('/computed')">计算属性</a-button>
    <a-button @click="handleClick('/eventHanding')">事件处理</a-button>
    <a-button @click="handleClick('/formBind')">表单事件绑定</a-button>
    <a-button @click="handleClick('/props')">props传递汇总</a-button>
    <a-button @click="handleClick('./SlotJsx')">jsx的插槽写法</a-button>
    <div class="content" id="page-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Test from "./test.vue";
export default {
  name: "1",
  props: {
    msg: String,
    showCross: Boolean
  },
  data() {
    return {
      child: "我是儿子"
    };
  },
  components: {
    Test
  },
  created() {
    // 在created周期中还是空数组
    console.info(this.$children[0]);
  },
  mounted() {
    // 在mounted生命周期中已经渲染完成
    // 获取子组件data的数组以下两种方法均可以
    console.info(
      `儿子: ${this.$children[0].me} 爸爸:${this.$children[0].father}`
    );
    console.info(
      `儿子: ${this.$children[0].$data.me} 爸爸: ${this.$children[0].father}`
    );
  },
  // 顶级组件provide提供一些参数
  provide: {
    foo: "bar"
  },
  methods: {
    parentAction(e) {
      this.child = e;
      console.info(this.child);
    },
    handleClickParent(e) {
      console.info("我是父亲组件的内部方法");
      console.info(e);
    },
    handleClick(path) {
      // this.$children是一个数组，其中包含了所有的子组件的信息，可以通过这样的方式调用子组件的方法，但是在created生命周期还没有渲染this.$children
      this.$children[0].handleClickChild("爸爸在调用儿子");
      console.info(
        `儿子: ${this.$children[0].$data.me} 爸爸:${this.$children[0].$data.father}`
      );
      this.$router.push(path);
    }
  }
};
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
