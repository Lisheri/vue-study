/* 
给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：

输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
*/
// * 题解
class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.next = (next === undefined ? null : next)
    }
}
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    let root: ListNode = new ListNode(0);
    let cusor: ListNode = root;
    let carry: number = 0; // * 进位
    while ((l1 && !(l1.val == undefined)) || (l2 && !(l2.val == undefined)) || carry) {
        // * 如果最后一次加起来为10, 需要在进来加一个carry
        let l1Val = (l1 && l1.val !== undefined && l1.val !== null) ? l1.val : 0;
        let l2Val = (l2 && l2.val !== undefined && l2.val !== null) ? l2.val : 0;
        let sumVal: number = l1Val + l2Val + carry
        carry = Math.floor(sumVal / 10)
        cusor.next = new ListNode(sumVal % 10)
        cusor = cusor.next
        l1 !== null && l1 !== undefined ? l1 = l1.next : ""
        l2 !== null && l2 !== undefined ? l2 = l2.next : ""
    }
    return root.next
};

/* 
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

 

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
示例 4:

输入: s = ""
输出: 0
 

提示：

0 <= s.length <= 5 * 104
s 由英文字母、数字、符号和空格组成
 */
// * 题解
function lengthOfLongestSubstring(s: string): number {
    // let sArr :Array<string> = s.split('')
    if (s.length === 0) {
        return 0
    }
    let cacheArr: Array<string> = [];
    let accumulator: number = 0;
    let sObj = {}; // * 用于存储上一次出现的位置
    let max: number = 0
    for (let i: number = 0; i < s.length; i++) {
        if (cacheArr.indexOf(s[i]) === -1) {
            sObj[s[i]] = i
            cacheArr.push(s[i])
            if (s[i + 1] == null) {
                (accumulator + 1) >= max ? (max = accumulator + 1) : ""
            }
            accumulator = accumulator + 1
        } else {
            accumulator >= max ? max = accumulator : ""
            cacheArr.splice(0)
            if (s[i + 1] == null) {
                1 >= max ? max = 1 : ""
            }
            i = sObj[s[i]]
            accumulator = 0
        }
    }
    return max;
};

// * 题解2 窗口滑动, 记录最大窗口值, 凡是出现已经出现过的值就更新窗口左边的开始位置
var lengthOfLongestSubstring2 = function (s: string): number {
    let last: Array<number> = [];
    // * 初始化一定长度的数组
    for (let i = 0; i < 128; i++) {
        last[i] = -1
    }
    let n: number = s.length;

    let res: number = 0;
    let start: number = 0; // 窗口开始位置
    for (let i: number = 0; i < n; i++) {
        let index: number = s.indexOf(s[i]);
        start = Math.max(start, last[index] + 1);
        res = Math.max(res, i - start + 1);
        last[index] = i;
    }
    return res;
};

/* 
给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的中位数。

进阶：你能设计一个时间复杂度为 O(log (m+n)) 的算法解决此问题吗？
*/

// * 题解, 时间复杂度较高
var findMedianSortedArrays = function(nums1: Array<number>, nums2: Array<number>) {
    let numArr: Array<number> = nums1.concat(nums2).sort((a, b) => {return a - b < 0 ?  -1 : 1})
    let len: number = numArr.length
    if (len % 2 === 0) {
        let end: number = len / 2
        let res: number = (numArr[end - 1] + numArr[end]) / 2
        return res.toFixed(5)
    } else {
        let end: number = Math.floor(len / 2)
        return numArr[end].toFixed(5)
    }
};

/* 
    给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
*/