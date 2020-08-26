
// let bottle = 10;

// // console.info(bottle / 3)

// let test = (bottle, i = 0) => {
//     i = i + parseInt(bottle / 3);
//     if ((parseInt(bottle / 3) + (bottle % 3)) >= 3) {
//         return test((parseInt(bottle / 3) + (bottle % 3)), i)
//     } else if ((parseInt(bottle / 3) + (bottle % 3)) === 2) {
//         return ++i;
//     }
// }
// console.info(test(bottle, 0))

// function test(n) {
//     let arr = []
//     for (let i = 0; i < n; i++) {
//         arr.push(parseInt(Math.random() * 1000))
//     }
//     arr = Array.from(new Set([...arr]))
//     return arr.sort((a, b) => a - b)
// }

// console.info(test(40))

// let test1 = (x) => {
//     return parseInt(x.toString())
// }
// console.info(test1(0x1890FF))
let test = (x) => {
    if (typeof x === "string" && x.length < 5000) {
        let arr = x.split(" ")
        console.info(arr[arr.length - 1].length)
    } else {
        console.info("请输入正确数字")
    }
}
test("XSUWHQ")