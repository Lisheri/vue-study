# js基础知识
## 变量类型和计算
## 值类型和引用类型

#### 题目
+ typeof能判断哪些类型？
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

无论是值类型还是引用类型都是在栈里面存储的。

在值类型中，定义a的时候就在栈中开一个区域，将他的值100存入栈中，而定义b等于a的时候，又在栈中开一个新的区域，存入b的值100，因此改变值类型b的时候，并不会影响a。

而在引用类型中，定义a的时候，先在栈中开一个a的区域，键名为a，键值指向a的内存地址a，同时加入堆的概念。栈是一个从上往下的结构，堆是一个从下往上的结构，在内存足够的情况下，栈和堆并不会重合。而在栈中开辟a的同时，就会在堆中存放一个键名为内存地址a，键值为{age: 20}的结构。由于摸不清一个对象中究竟有多少数据，考虑到一个性能问题，因此js的引用类型都会采用这样的存储方式。而定义b，并且将a的值赋给b的时候，就直接将a在堆中的内存地址a赋值给了b，也就是说，在栈中，a和b指向了同一个堆的内存地址，因此，在修改b中age的时候，a的age，也发生同样的改变，因为他们从根本上说就是一个东西。这就是所谓的浅拷贝。

#### 常见值类型
undefined、 boolean、 number、 string、 symbol、 bigint

#### 常见引用类型
object、array、null、function
其中null是特殊引用类型，指向空地址
function也是特殊引用类型，但不用于存储数据，所以没有“拷贝、复制函数”这一说

#### js基本数据类型
undefined、boolean、number、string、symbol、null、bigint

#### typeof运算符
+ 识别所有值类型
    - typeof "123" // string
    - typeof 10 // number
    - typeof 10n // bigint
    - typeof undefined // undefinen
    - typeof Symbol("a") // symbol
    - typeof true // boolean
+ 识别函数
    - typeof function() {} // function
    - typeof console.info() // function
+ 判断是否是引用类型(不可再细分)
    - typeof null // object
    - typeof [] // object
    - typeof {} // object

#### 深拷贝
```
// 浅拷贝
const obj1 = {
    age: 20,
    name: 'xxx',
    address: {
        city: "shenzheng"
    },
    arr: ["a", "b", "c"]
}
const obj2 = obj1
obj2.address.city = "shanghai"
console.info(obj1.address.city) // shanghai

// 深拷贝
/**
* @param {Object} obj 要拷贝的对象
*/
function deepClone(obj = {}) {
    typeof obj !== 'object' || obj === null ? return obj : ""
    
    // 初始化一个返回结果
    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        // 保证key不是原型上的属性
        if (obj.hasOwnProperty(key)) {
            // 递归调用，主要是为了深层次遍历，因为obj完全可能是对象嵌套对象，对象嵌套数组再嵌套对象
            result[key] = deepClone(obj[key])
        }
    }

    // 返回结果
    return result
}
// 使用
const obj2 = deepClone(obj1)
obj2.address.city = "shanghai"
console.info(obj1.address.city) // beijing
```

#### 变量计算
+ 字符串拼接
+ == 运算符
+ if语句，三元表达式等逻辑运算

```
// 字符串拼接
const a = 100 + 10; // 110
const b = 100 + "10"; // "10010"
const c = true + "10"; // "true10"

// ==运算符
100 == "100" // true
0 == "" // true
0 == false // true
false == "" // true
null == undefined // true

// 除了判断是否为null或者undefined时，可以使用一个==之外，其他一律用 ===
// 其余==和===的规则，见望远镜书

// if语句和逻辑运算
// if判断实际上是判断的truly变量和falsely变量

//truly变量,两步true运算为true
!!a === true 
//falsely变量, 两步false运算为false
!!a === false

// 以下是falsely变量。除此之外都是truly变量
!!0 === false
!!NaN === false
!! '' === false
!! null === false
!! undefined === false
!! false === false

// 逻辑运算

// 逻辑与如果第一个值是truely变量则往后判断返回第二个值
console.info(10 && 0) // 0
// 逻辑或如果第一个值是一个truely变量则返回，如果是falsely变量则往后判断
console.info('' || 'abc') // 'abc'
console.info(!window.abc) // true
```

#### 题目解答
+ typeof能够判断哪些类型
    - 识别所有值类型 
    undefined number string symbol bigint boolean
    - 识别函数
    function
    - 判断是否是引用类型(不可在细分)
    object
+ 何时使用=== 何时使用==
    - 除了判断是null或者undefined之外，其他都用===
+ 值类型和引用类型的区别
    - 值类型赋值的时候，直接在栈中开辟内存，key为名，value就是他的值
    - 引用类型在栈中开辟内存，同时在堆中存储地址，栈中key为名，value存储的为内存地址名，该内存地址名对应堆中key，堆中value就是引用类型的值，因此引用类型直接赋值，就会将该引用类型在堆中的地址，赋值给新的引用类型变量
+ 手写深拷贝

