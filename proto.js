// // * 父类
// class People {
//     constructor(name) {
//         this.name = name
//     }
//     #testself = "wc"
//     eat() {
//         console.info(`${this.name} eat something and ${this.#testself}`)
//     }
// }

// class Student extends People {
//     #testself = "mzl"
//     constructor(name, number) {
//         super(name)
//         this.number = number
//     }
//     sayHi() {
//         console.info(`姓名: ${this.name}, 学号: ${this.number}`)
//     }
//     getSelf() {
//         return this.#testself
//     }
// }

// // * 子类
// class Teacher extends People {
//     #money
//     constructor(name, major) {
//         super(name)
//         this.major = major
//         this.#money = this.major === "语文" ? 9000 : ""
//     }
//     teach() {
//         console.info(`${this.name} teach ${this.major}`)
//     }
//     getMoney() {
//         console.info(this.#money)
//     }
// }

// let xialuo = new Student("夏洛", 201613160911)
// console.log(xialuo.name); // 夏洛
// console.info(xialuo.number); // 201613160911
// xialuo.sayHi() // 姓名：夏洛，学号： 201613160911
// xialuo.eat() // 夏洛eat something and wc
// console.info(xialuo.getSelf()) // wc

// let wang = new Teacher("王老师", "语文")
// console.info(wang.name) // 王老师
// console.info(wang.major) // 语文
// wang.teach() // 王老师 teach 语文
// wang.eat() // 王老师 eat something and wc
// wang.getMoney() // 9000

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

let user = new User("老王", "18")
console.info(user)
user.showAge();
user.showName();