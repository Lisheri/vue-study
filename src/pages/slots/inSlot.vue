<template>
  <div>
    插槽
    <Child :title="title" :books="books">
      <template v-slot:title>
        <span>
          <Icon type="read" />&nbsp;书籍列表
        </span>
      </template>
      <template v-slot:content="{row}">
        <!-- <div class="book-ul">
          <div v-for="(item, index) in books" :key="index" class="booklist"><Icon :type="item.icon"/>&nbsp;{{item.name}}</div>
        </div> -->
        <Icon :type="row.icon"/>&nbsp;{{row.name}}
      </template>
    </Child>
  </div>
</template>

<script>
import Child from "./child";
import { Icon } from "ant-design-vue";
export default {
  data() {
    return {
      title: "书籍列表",
      books: [
            {name: "Dom编程艺术", icon: "dingding"},
            {name: "你不知道的Javascript", icon: "apple"}, 
            {name: "CSS世界", icon: "windows"}, 
            {name: "HTML入门教程", icon: "chrome"}
        ]
    };
  },
  components: { Child, Icon }
};
</script>

<style lang="scss" scoped>
</style>