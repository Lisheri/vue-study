<template>
  <div class="content">
    数组reduce
    <input type="text" placeholder="请输入字符串以逗号隔开" v-model="data" />
    <button @click="clickReduce" :disabled="data.length <= 0">点击执行</button>
    <a-select
    mode="default"
    placeholder="Inserted are removed"
    v-model="selectItem"
    style="width: 100%"
    @change="handleChange"
    @search="handleSearch"
    show-search
    @popupScroll="popupScroll"
  >
    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
      {{ item }}
    </a-select-option>
  </a-select>
  </div>
</template>

<script>
/**
 * * Array.prototype.reduce((t, v, i, a) => {}, initValue)
 * @param callback() 回调函数为必填参数
 * @param initValue 初始值为可选参数，若不填，则初始值为0
 *
 * ? callback(t, v, i, a)
 * @param t(total) 累加器完成计算的返回值(必选)
 * @param v(value) 当前元素(必选)
 * @param i(index) 当前元素的索引(可选)
 * @param a(index) 当前元素所属的数组对象(可选)(也就是当前执行reduce操作的数组)
 */
export default {
  data() {
    return {
      data: "",
      selectItem: '',
      filteredOptions: [1,2,3,4,5,6,7,8,9,0,0,0,0,0,0,0,0,0,]
    };
  },
  methods: {
    clickReduce() {
      // 累加运算
      // console.info("累加")
      // this.NewFilter()
      // console.info(this.NewFilter())
      // console.info(this.NewMap())
      console.info(this.NewReverse());
      console.info(this.Chunk());
      console.info(this.Difference([1, 2, 3, 4], [2, 3, 7]));
      console.info(this.Fill(this.data.split(','), "我的天", 2, 5))
      console.info("扁平化数组", this.Flat([1, [2, 3], [4, 5, 6], [1,2]]))
      console.info("数组去重", this.Uniq([1,2,2,2,3,4,4,5]))
      console.info("拆解", this.Unzip([[1,2, "abs", true], [3, "sad", false]]))
      console.info("数组中内容个数统计", this.Count([1,2,1,3,3,3,2,1,"a","a","a"]))
      const arr = [1,2,3,4,1,2,1]
      console.info("数组成员位置记录", this.Position(arr, 1))
    },
    handleChange(e) {
        console.info(e)
    },
    handleSearch(e) {
        // this.selectItem = e
        if (e.length > 6) {
            this.selectItem = e.slice(0, 6)
        }
    },
    popupScroll() {
        console.info("111")
    },
    // 累加器
    Accumulation() {
      let data = this.data.split(",");
      return data.reduce((t, v) => t + v, 0);
    },
    // 累乘器
    Multiplication() {
      let data = this.data.split(",");
      return data.reduce((t, v) => t * v, 0);
    },
    // 权重求和
    WeightAccumulation() {
      let data = [
        { score: 93, weight: 0.3 },
        { score: 85, weight: 0.4 },
        { score: 76, weight: 0.3 }
      ];
      return data.reduce((t, v) => t + v.score * v.weight, 0);
    },
    // 代替reverse，将数组以倒叙排列
    // 主要有一个reduceRight方法，和reduce基本一样，只是reduce是从左向右的执行顺序，而reduceRight是从右向左
    NewReverse() {
      let data = this.data.split(",");
      return data.reduceRight((t, v) => (t.push(v), t), []);
    },
    // 代替map
    NewMap() {
      let data = this.data.split(",");
      // reduce模拟map
      console.info(data.map(item => item * 2));
      return data.reduce((t, v) => [...t, v * 2], []);
    },
    // 代替filter
    NewFilter() {
      let data = ["123", "abc", "45621", "卧槽"];
      console.info(data.filter(item => item !== "卧槽"));
      // 如果不匹配，则继续将t(上一次的结果)这个数组传下去就可以了
      return data.reduce((t, v) => {
        return v !== "卧槽" ? [...t, v] : t;
      }, []);
    },
    // 代替some
    NewSome() {
      let data = this.data.split(",");
      return data.reduce((t, v) => t || v > 3, false);
    },
    // 代替erery
    NewEvery() {
      let data = this.data.split(",");
      return data.reduce((t, v) => t && v > 3, true);
    },
    // 数组分割
    Chunk() {
      let data = this.data.split(",");
      let size = 2;
      return data.length
        ? data.reduce(
            (t, v) => {
              // debugger
              // console.info((t[t.length - 1].length === size ? t.push([v]) : t[t.length - 1].push(v), t))
              // console.info(t[t.length - 1])
              // ? 逗号操作符: 对它的每个操作数求值（从左到右），并返回最后一个操作数的值。从左到右会依次执行一遍
              // 此处若不将最终的t传给下一次操作，那么就会在三元表达式选择第二个值的时候将t[t.length - 1]传给下一次操作
              // 使用一个逗号表达式，将最终的结果t一起传给下一次操作
              return (
                t[t.length - 1].length === size
                  ? t.push([v])
                  : t[t.length - 1].push(v),
                t
              );
            },
            [[]]
          )
        : [];
    },
    // 数组过滤，去掉第一个数组中和第二个数组重复的部分
    // Array.prototype.includes()
    Difference(arr1 = [], arr2 = []) {
      return arr1.reduce((t, v) => {
        // debugger
        return arr2.includes(v) ? t : t.push(v), t;
      }, []);
    },
    // 数组填充
    /**
     * @param: arr 原数组
     * @param: str 填充字符串
     * @param: start 填充开始位置
     * @param: end 填充结束位置
     */
    Fill(arr = [], str = "", start = 0, end = arr.length) {
      if (start < 0 || start >= end || end > arr.length) return arr;
      return [
          ...arr.slice(0, start),
          ...arr.slice(start, end + 1).reduce((t, v) => (t.push(str || v), t), []),
          ...arr.slice(start, end + 1),
          ...arr.slice(end, arr.length)
      ]
    },
    // 数组扁平
    // array.prototype.concat()不会改变原数组
    Flat(arr = []) {
      return arr.reduce((t, v) => t.concat(Array.isArray(v) ? this.Flat(v) : v), [])
    },
    // 数组去重
    Uniq(arr = []) {
      return arr.reduce((t, v) => (t.includes(v) ? t : t.push(v), t), [])
    },
    // 求数组最大值
    Max(arr = []) {
      return arr.reduce((t, v) => t > v ? t : v)
    },
    // 求最小值
    Min(arr = []) {
      return arr.reduce((t, v) => t < v ? t : v)
    },
    // 独立拆解
    Unzip(arr = [], strArr = [], numArr = [], booleanArr = []) {
      arr.forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(item2 => {
            typeof item2 === 'string' ? strArr.push(item2) : typeof item2 === 'number' ? numArr.push(item2) : booleanArr.push(item2)
          })
        } else {
          typeof item === 'string' ? strArr.push(item) : typeof item === 'number' ? numArr.push(item) : booleanArr.push(item)
        }
      })
      let newArr = []
      this.isEmpty(newArr, strArr)
      this.isEmpty(newArr, numArr)
      this.isEmpty(newArr, booleanArr)
      return newArr
      // return [].push(strArr).push(numArr).push(booleanArr)
    },
    isEmpty(newArr, arr) {
      if (arr.length > 0) {
        return newArr.push(arr)
      }
    },
    // reduce独立拆解
    Unzip2(arr = []) {
      return arr.reduce(
        (t, v) => (v.forEach((w, i) => t[i].push(w)), t),
        Array.from({ length: Math.max(...arr.map(v => v.length)) }).map(v => [])
      );
    },
    // 数组成员个数统计
    Count(arr = []) {
      return arr.reduce((t, v) => (t[v] = (t[v] || 0) + 1, t), {})
    },
    // 数组成员位置记录
    Position(arr = [], val) {
      return arr.reduce((t, v, i) => (v === val ? t.push(i) : t, t), [])
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 10px;
}
button {
  margin-left: 20px;
}
</style>