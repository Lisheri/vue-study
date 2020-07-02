<template>
  <div class="content">
    <!-- <div class="title">{{title}}</div> -->
    <!-- 使用普通插槽 -->
    <!-- <slot></slot> -->
    <!-- 使用具名插槽 -->
    <slot name="title"></slot>
    <hr />
    <!-- 作用域插槽 -->
    <div class="book-ul">
        <div v-for="(item, index) in books" :key="index" class="booklist">
            <slot name="content" :row="item"></slot>
        </div>
    </div>
    <!-- 使用具名插槽 -->
    <!-- <slot name="content"></slot> -->
  </div>
</template>

<script>
// import {Icon} from 'ant-design-vue'
export default {
  props: ["title", "books"]
};
</script>

<style lang="scss" scoped>
.content {
  width: 300px;
  // height: 400px;
  border: 1px solid;
  padding: 20px;
  text-align: left;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin: 0 auto;
  .title {
    text-align: center;
  }
  .book-ul {
    padding-left: 20px;
  }
  .booklist {
    margin-bottom: 10px;
  }
}
</style>