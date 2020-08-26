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
