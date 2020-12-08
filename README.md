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
```
function deepClone(obj = {}) {
    let result = obj instanceof Array ? [] : {}
    if (typeof obj === "object") {
        Object.keys(obj).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = deepClone(obj[key])
            }
        })
    } else {
        return obj
    }
    return result
}
```

## 原型和原型链
在ES2019中，用了一句短短的话，介绍了一下原型链--prototype chain
a prototype may have a non-null implicit reference to its prototype, and so on; this is called the prototype chain

### 题目
+ 如何准确判断一个变量是不是数组?
+ 手写一个简易的Jquer，考虑插件和扩展性
+ class的原型本质，怎么理解

### class和继承

#### class
class可以看作一个模板，内部有constructor、属性和方法

比如写一个学生类
```
// 类
class Student {
    constructor(name, number) {
        // 这里的this指向当前构建的实例
        this.name = name;
        this.number = number;
    }
    sayHi() {
        console.info(`姓名: ${this.name}, 学号: ${this.number}`)
    }
}

// 通过类声明一个实例
let xialuo = new Student("夏洛", 201613160911)
console.info(xialuo.name);
console.info(xialuo.number);
xialuo.sayHi()

```

#### ES2020新增使用#定义类的私有成员
#### 比如 
```
class People {
    #money
    constructor(name, major) {
        this.name = name
        this.major = major
        this.#money = major !== "学生" ? "screet" : "no money"
    }
    getMoney() {
        return this.#money
    }
    hasMoney() {
        console.info(`${this.name} has ${this.#money}`)
    }
}
```

#### 继承
+ extends关键字
+ super执行父类的构造函数
+ 扩展和重写父类的一些方法

```
// * 父类
class People {
    constructor(name) {
        this.name = name
    }
    #testself = "wc"
    eat() {
        console.info(`${this.name} eat something and ${this.#testself}`)
    }
}

// * 子类
class Student extends People {
    #testself = "mzl"
    constructor(name, number) {
        super(name)
        this.number = number
    }
    sayHi() {
        console.info(`姓名: ${this.name}, 学号: ${this.number}`)
    }
    getSelf() {
        return this.#testself
    }
}

// * 子类
class Teacher extends People {
    #money
    constructor(name, major) {
        super(name)
        this.major = major
        this.#money = this.major === "语文" ? 9000 : ""
    }
    teach() {
        console.info(`${this.name} teach ${this.major}`)
    }
    getMoney() {
        console.info(this.#money)
    }
}

let xialuo = new Student("夏洛", 201613160911)
console.log(xialuo.name); // 夏洛
console.info(xialuo.number); // 201613160911
xialuo.sayHi() // 姓名：夏洛，学号： 201613160911
xialuo.eat() // 夏洛eat something and wc
console.info(xialuo.getSelf()) // wc

let wang = new Teacher("王老师", "语文")
console.info(wang.name) // 王老师
console.info(wang.major) // 语文
wang.teach() // 王老师 teach 语文
wang.eat() // 王老师 eat something and wc
wang.getMoney() // 9000
```

#### 类型判断 instanceof

##### 如上三个类的一些判断
+ xialuo instanceof Student
// true
+ xialuo instanceof People
// true
+ xialuo instanceof Object
// true

+ [] instanceof Array
// true
+ [] instanceof Object
// true
+ {} instanceof Object
// true

A instanceof B // 只要A是B构建出来的，就是true

所有的引用类型instanceof一个Object都是true
Object也是所有class的父类

typeof Student // function
typeof People // function

class本质只是一个语法糖，本质上还是通过function来实现的

以上面继承的为例子
```
xialuo.__proto__; // 这个东西里面有一个constructor和一个sayHi()

// 此时可以使用
xialuo.__proto__.sayHi() //得到的结果是
// 姓名: undefined, 学号: undefined
Student.prototype; // 也是一个sayHi和constructor

// 实际上Prototype是一个隐式原型，而__proto__是一个显式原型

// 并且xialuo.__proto__ = Student.prototype
// 也就是说实例的__proto__和类的prototype指向的是同一处

```

#### 原型关系
 + 每个class都有一个隐式引用prototype
 + 每一个实例都可以通过一个显式引用__proto__去访问class的隐式引用prototype
 + 实例的__proto__指向对应class的prototype

#### 基于原型的执行规则
+ 获取属性xialuo.name或执行方法xialuo.sayHi()时
+ 先在自身的属性和方法中寻找
+ 如果找不到，就去显示引用__proto__中寻找，而这个__proto__恰好就指向了class的隐式引用prototype

#### 原型链
说起这个原型链，又要回到ES2019
在ES2019中，用了一句短短的话，介绍了一下原型链--prototype chain
a prototype may have a non-null implicit reference to its prototype, and so on; this is called the prototype chain(原型可能具有对其原型的非空隐式引用，依此类推；这称为原型链)

本身__proto__出现就是为了解决在实例中无法直接访问隐式引用prototype，需要使用Object.getPrototypeOf(实例)来访问，于是很多浏览器私自开了一个口直接访问类(构造函数)的原型，这个口，就是__proto__，直到ES2015规范只好向事实低头，将__proto__属性纳入了规范的一部分。

实际上__proto__的实现很简单
就是在Object的隐式引用prototype上定义了一个叫做__proto__的属性，并且将它挂载到了每一个Object的派生类上，作为一个类似于不可枚举属性的属性，实际上看起来像一个不可枚举属性，但__proto__并不是不可枚举属性，当然，也不是可枚举属性，因为使用Object.getOwnPropertyNames()访问不到该属性
所以是，表面上看在对象里存在一个__proto__属性，实际上，它只是开发者工具为了方便让开发者查看原型，故意渲染出来的虚拟节点。虽然跟对象的其他属性并列，看起来像一个不可枚举属性，但实际上它并不在该对象中
访问对象的__proto__触发了Object.prototype上的__proto__的get方法

__proto__实现如下
```
let test = {
    get __proto__() {
        return Object.getPrototypeOf(this)
    },
    set __proto__() {
        return Object.setPrototypeOf(this, value)
    }
}
```

一条带有子类继承父类的原型链，主要就是子类的隐式引用prototype的显式引用__proto__指向父类的prototype
同时，在js中，所有的引用类型，都继承自Object，而Object没有父类了，因此Object.__proto__指向空值。

比如在之前的例子中，就有如下一条原型链
xialuo.__proto__ === Student.prototype
xialuo.__proto__.__proto__ === Student.prototype.__proto__ === People.prototype
xialuo.__proto__.__proto__.__proto__ === Student.prototype.__proto__.__proto__ === People.prototype.__proto__ === Objcet.prototype

Object.prototype.__proto__ === null

##### 重要提示
+ class是Es6语法规范，由ECMA委员会发布
+ ECMA只规定语法规则，即我们代码的书写规范，不规定如何实现
+ 以上实现方式都是V8引擎的实现方式，也是主流的

#### JS原型链继承

在js中，有两类原型继承的方式: 显式原型继承和隐式原型继承
区别：是否由开发者亲自操作
##### 显式原型继承
所谓显式原型继承就是亲自将某一个对象设置为另一个对象的原型
```
const obj_a = {a: 1};
const obj_b = {b: 1};
Object.setPrototypeOf(obj_b, obj_a); // 将obj_a设置为obj_b的原型
```

##### 隐式原型继承
将某些函数称之为constructor, 专门用来做属性初始化
function User(firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
}
同时约定，constructor函数有一个特殊属性叫做prototype
User.prototype = Object.create(Object.prototype)

使用new关键字去创建新对象
然后再内部偷偷的做一个创建对象，关联原型和属性初始化等一系列过程
function User(firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
}

User.prototype = Object.create(Object.prototype)
const user = new User("Jade", "GU")

实际上这种操作比较繁琐，因此出现了一个叫做字面量的东西，将原来的多个步骤融合成了一步进行操作
比如说新建一个对象
let obj = {
    firstname: "JADE",
    lastname: "GU"
}

这个操作实际上是两个步骤融合的
第一步是使用new Object()去创建一个对象
第二步是进行原型继承，由于这种继承看不到，因此就是隐式原型继承同时设置属性

##### 两个构造函数之间继承
```
// 不需要中间对象版本
function Human(age, ...args) {
    this.age = age
}
Human.prototype.showAge = function() {
    console.info(this.age)
}
function User(name, ...args) {
    Human.call(this, ...args)
    this.name = name
}
User.prototype.showName = function() {
    console.info(this.name)
}
User.prototype.constructor = User
Object.setPrototypeOf(User.prototype, Human.prototype)

// 使用中间对象版
function Student(name, ...args) {
    this.name = name || "none"
}
Student.prototype.hello = () => {
    console.info(this.name)
}

function PrimaryStudent(grade, ...args) {
    Student.call(this, ...args)
    this.grade = grade || 1
}
// 空函数
function F() {}
F.prototype = Student.prototype
PrimaryStudent.prototype = new F()
PrimaryStudent.prototype.constructor = PrimaryStudent
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
}

// 可以封装一个继承的函数
const inherit = (SuperConstructor, properites) => {
    let {constructor} = properites
    let SubConstructor = function(...args) {
        SuperConstructor.call(this, ...args)
        constructor.call(this, ...args)
    }

    SubConstructor.prototypes = {
        ...properites,
        constructor: SubConstructor
    }
    Object.setPrototypeOf(SubConstructor.prototype, SuperConstructor.prototype)

    return SubConstructor
}
```

## 作用域和闭包

### 题目
+ this的不同应用场景如何取值?
+ 手写bind函数
```
// bind-demo
Function.prototype.bind1 = function(self, ...args) {
    // 将参数拆解为数组
    // arguments 可以获取一个函数所有的参数，是一个列表不是一个数组
    const args = Array.prototype.slice.call(arguments) // 将一个列表变为数组

    // 获取this (数组第一项)
    const t = args.shift() // 将第一个值取出来，改变原数组

    // 由于这是一个class中一个成员方法的this，指向类的实例，也就是fn1
    // 所以这里的this就是fn1.bind()中的fn1
    const self = this

    // 返回一个函数
    return function() {
        return self.apply(t, args)
    }
}
```
+ 实际开发中闭包的应用场景，举例说明

```
// 1.隐藏数据，只提供API
function createCache() {
    const data = [] // 闭包中的数据，被隐藏，不被外界访问
    return {
        set: function(key, val) {
            data[key] = val
        },
        get: function(key) {
            return data[key]
        }
    }
}

// 2.
```

### 作用域
```
let a = 0; // 全局变量
function fn1() {
    let a1 = 100; // 函数&&块级变量
    function fn2() {
        let a2 = 200; // 函数&&块级变量
        function fn3() {
            let a3 = 300; // 函数&&块级变量
            // 在这个块中，只有a3不是自由变量
            return a + a1 + a2 + a3
        }
        fn3()
    }
    fn2()
}
console.info(fn1())
```

+ 全局作用域
    - 在全局申明的变量，任何位置都可以访问
+ 函数作用域
    - 在函数内部申明的变量，只能在当前函数内部使用
+ 块级作用域
    - 一个大括号就是一个块，超出这个大括号使用就报错
+ 自由变量
    - 一个变量在当前作用域没有定义，但就被使用了
    - 向上级作用域，一层一层依次寻找，直到找到为止
    - 如果全局作用域都没有找到，就报错 xxx is not defined

+ 闭包(作用域应用的特殊情况，有两种表现)
    - 函数作为参数被传递
    - 函数作为返回值被返回

+ 闭包有三个特效:
    + 1.函数嵌套函数;
    + 2.函数内部可以引用外部的参数和变量;
    + 3.参数和变量不会被垃圾回收机制回收。

```
// 函数作为返回值
function create() {
    let a = 100;
    return function() {
        console.info(a)
    }
}
let fn = create()
let a = 200
fn() // 100

// 函数作为参数
function print(fn) {
    let a = 200;
    fn()
}
let a = 100
function fn() {
    console.info(a)
}
print(fn) // 100

// 主要是由于函数寻找自由变量会从定义他自己的作用域开始去寻找
// 而不是在函数执行的时候
```

### this
应用场景
+ 作为普通函数调用
+ 使用call apply bind调用
+ 作为对象方法被调用
+ class方法中被调用
+ 箭头函数中调用

#### this取什么值是在函数执行的时候确认的，而不是函数定义的时候

```
function fn1() {
    console.info(this)
}

fn1() // window

fn1.call({x: 100}) // {x: 100}
const fn2 = fn1.bind({x: 200})
fn2() // {x: 200}

const zhangsan1 = {
    name: '张三',
    sayHi() {
        // this就是当前对象
        console.info(this)
    },
    wait() {
        setTimeout(function() {
            // this指向window
            console.info(this)
        }, 100)
    }
}

const zhangsan2 = {
    name: '张三',
    sayHi() {
        // 普通函数的this，指向调用的位置
        // this就是当前对象
        console.info(this)
    },
    wait() {
        setTimeout(() => {
            // 箭头函数的this永远取它上级作用域的this
            // 因此这里的this指向wait这个函数，所以this指向当前对象
            console.info(this)
        }, 100)
    }
}

class People {
    constructor(name) {
        this.name = name
        this.age = 20
    }
    sayHi() {
        console.info(this)
    }
}
// class中constructor的this代表正在创建的实例，class内部的函数this指向创建的实例
const zhangsan = new People("张三")
zhangsan.sayHi() // zhangsan对象
```

#### Object.is 和 === 的区别?
=== 作为判断时, 会将 NaN === NaN 判断为false, 并且 +0 和 -0 判断为true, 但实际上这样的方式是错误的, 会造成很多问题
Object.is做判断, 以上都是相反的, 因此更加规范
```
funciton is(x, y) {
    if (x === y) {
        // 使用 1/x === 1/y 做判断主要是因为 1/+0 为 +infinity; 1/-0 为 -infinity
        return x !== 0 || y !== 0 || 1/x === 1/y
    } else {
        return x !== x && y !== y
    }
}
```

#### Symbol.toPrimitive
对象的Symbol.toPrimitive属性。指向一个方法。该对象被转化为原始类型的值时，会调用这个办法，返回该对象对应的原始类型值。
Symbol.toPrimitive被调用时,会接受一个字符串参数，表示当前运算的模式，一个有三种模式:
+ Number:该场合需要转成数值
+ String:该场合需要转成字符串
+ Default:该场合可以转成数值，也可以转成字符串。

在Object执行类型转换时若存在Symbol.toPrimitive则优先级最高, 其次是valueOf, 最后是toString

### 四种扁平化方法
#### 直接遍历
```
function flatten(arr, result) {
arr.forEach(item => {
    if (item instanceof Array) {
        flatten(item, result)
    } else {
        result.push(item)
    }
})
return result
}
```
#### 累加器
```
function flatten(arr) {
    return arr.reduce((accumulator, cur) => {
        return accumulator.concat(Array.isArray(cur) ? flatten(cur) : cur)
    })
}
```
#### 使用扩展运算符
```
function flatten(arr) {
    whilt(arr.some(item => item instanceof Array)) {
        arr = [].concat(...item)
    }
    return arr
}
```
#### 使用ES6中flat方法
```
function flatten(arr) {
    return arr.flat(Infinity)
}
```
### 手写一系列数组方法
#### 手写map方法
```
Array.prototype.map = function(callbackFn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError("cannot read property 'map' of null or undefined");
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + "is not a function");
    }

    let O = Object(this);
    let T = thisArg || this;
    
    let len = O.length >>> 0; // 防止出现非整数, 如果是undefined将变成0
    let A = new Array(len); // 创建一个新的原数组长的空数组

    for (let k = 0; k < len; k++) {
        if (k in O) {
            let kValue = O[k];
            let mappedValue = callbackFn.call(T, kValue, k, O);
            A[k] = mappedValue;
        }
    }
    return A;
}
```
#### 手写reduce累加器
```
Array.prototype.reduce = function(callbackFn, initValue) {
    if (this === null || this === undefined) {
        throw new TypeError("cannot read property 'map' of null or undefined");
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + 'is not a function!');
    }

    let O = Objecat(this);
    let len = O.length >>> 0;
    let k = 0;
    let accumulator = initValue;
    if (accumulator === undefined) {
        for (; k < len; k++) {
            if (k in O) {
                accumulator = O[k]; // * 如果没有默认的初试累加值默认采用第一个作为累加值, 同时退出循环并且完成第一次遍历
                k++;
                break;
            }
        }
    }
    if (k === len && accumulator === undefined) {
        throw new TypeError('each element of the array is empty');
    }
    for (; k < len; k++) {
        if (k in O) {
            accumulator = callbackFn.call(undefined, accumulator, O[k], k, O); // * 每一次遍历触发传入的回调函数, 参数依次是 累加值 当前值 序列号和当前数组
        }
    }
    return accumulator;
}
```
#### 手写数组push方法
```
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = O.length >>> 0;
  let argCount = items.length >>> 0;
  // * 2 ** 53 - 1 为JS能表示的最大整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value retricted!");
  }
  for (let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}
```
#### 手写数组pop方法
```
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  } else {
    len--;
    let value = O[len]
    delete O[len];
    O.length = len;
    return value;
  }
}
```
#### 手写数组filter方法
```
Array.prototype.filter = function(callbackFn, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError("cannot read property 'filter' of null or undefined!");
  }
  if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
    throw new TypeError(callbackFn + "is not a function");
  }
  let O = Object(this);
  let len = O.length >>> 0;
  // let T = thisArg || this
  let resLen = 0
  let res = []
  for (let i = 0; i < len; i++) {
    if (i in O) {
      if (callbackFn.call(thisArg, O[i], i, O)) {
        res[resLen++] = O[i]
      }
    }
  }
  return res
}
```

#### 手写数组splice方法
+ 主要要解决的问题就是删除元素大于增加元素, 需要向前移动剩余元素,同时减小数组长度, 删除元素小于增加元素, 需要将新增元素位置后面的元素向后移动为新增元素空出位置
+ 需要对开始下标小于0的参数进行处理, splice方法当他的开始下标小于0的时候会用 长度 - 开始下标的绝对值 判断是否小于0, 如果小于0则使用0, 如果不是则直接使用该结果, 如果下标大于数组长度则直接使用数组长度
+ 对删除数目进行处理, 如果删除数目过小则直接为0, 过大则从开始下标直接删完, 不传也是删完
+ 对Object.freeze和Object.seal后的数组进行判断, 如果是冻结数组则判断是否有删除和新增值, 只要存在则报错, 如果是封闭对象, 则判断删除数目和新增数目是否一致, 一致则可以, 不一致则报错
```
const sliceDeleteElements = function(array, startIndex, deleteCount, deleteArr) {
  for (let i = 0; i < deleteCount; i++) {
    if (startIndex + i in array) {
      deleteArr[i] = array[startIndex + i]
    }
  }
}
const movePostElements = function(array, startIndex, len, deleteCount, addElements) {
  if (deleteCount > addElements.length) {
    // * 删除元素等于插入元素, 不需要移动
    if (deleteCount === addElements.length) {
      return
    } else if (deleteCount > addElements.length) {
      // * 删除元素大于插入元素
      for (let i = startIndex + deleteCount; i < len; i++) {
        let fromIndex = i;
        let toIndex = i - (deleteCount - addElements.length);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex]
        } else {
          delete array[toIndex]
        }
      }
      // * 将目标数组长度后面的都删除
      for (let i = len - 1; i >= len + addElements.length - deleteCount; i--) {
        if (i in array) {
          delete array[i]
        }
      }
    } else if (deleteCount < addElements.length) {
      // * 删除元素小于插入元素
      // * 从后往前遍历, 给中间留出新增数据的位置即可
      for (let i = len - 1; i >= startIndex + deleteCount; i--) {
        let fromIndex = i;
        let toIndex = i + (addElements.length - deleteCount);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex]
        } else {
          delete array[toIndex]
        }
      }
    }
    
  }
}
// * 处理负数startIndex
const computedStartIndex = function(startIndex, len) {
  if (startIndex < 0) {
    // * splice为负索引时, 会使用长度减去索引的绝对值来作为开始索引，如果该值还是小于0, 那么就会直接使用0
    return startIndex + len > 0 ? startIndex + len : 0
  }
  return startIndex > len ? len : startIndex
}
// * 处理删除数目deleteCount
const computedDeleteCount = function(startIndex, deleteCount, len, arguementsLen) {
  if (argumentsLen === 1) {
    // * 删除数没有传, 默然将整个数组从开始下标直接删除
    return len - startIndex
  }
  // * 删除数过小
  if (deleteCount < 0) {
    return 0
  }
  // * 删除数过大
  if (deleteCount > len - startIndex) {
    return len - startIndex
  }
  return deleteCount
}
Array.prototype.splice = function(startIndex, deleteCount, ...addElements) {
  // * 处理密闭对象和冻结对象
  if (Object.isSealed(array) && deleteCount !== addElements.length) {
    throw new TypeError("the object is a sealed object!")
  } else if (Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
    throw new TypeError("the object is a frozen object")
  }
  
  // * 获取参数长度
  let arguementsLen = arguments.length;
  // * 获取当前数组
  let array = Object(this);
  // * 获取当前数组长度
  let len = array.length >>> 0;
  // * 定义需要删除的数组长度的空数组
  let deleteArr = new Array(deleteCount);
  
  let startIndex = computedStartIndex(startIndex, len);
  let deleteCount = computedDeleteCount(startIndex, deleteCount, len, arguementsLen);
  // * 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // * 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);
  // * 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
}
```
