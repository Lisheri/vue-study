# js基础知识
## 变量类型和计算
## 值类型和引用类型

### 题目
+ typeof能判断哪些类型？
typeof可以判断的类型是：undefined、 null、boolean、number、bigint、string、symbol、object、function
+ 何时使用 === 何时使用 ==
+ 值类型和引用类型的区别
+ 手写深拷贝

#### 值类型

```
let a = 100;
let b = a;
a = 200;
console.info(b); // 100
// 这两个并不会相互干涉
```

#### 引用类型

```
let a = {
    age: 20
}
let b = a;
b.age = 21;
console.info(a.age) // 21
// 因为是浅拷贝，b和a的地址是一致的，因此更新b的时候，a也同时更新
```
