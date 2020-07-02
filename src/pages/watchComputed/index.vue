<template>
    <div>
        <a-input v-model="text" style="width:200px;marginTop: 20px;" />
        <a-input v-model="full" style="width:200px;marginTop: 20px;" />
        <a-input v-model="go" style="width:200px;marginTop: 20px;" @change="change"/>
        <a-button type="primary" @click="full">点击改变text</a-button>
        <a-input v-model="question" style="width:200px;marginTop: 20px;"></a-input>
        <span>{{answer}}</span>
    </div>
</template>

<script>
// 防抖函数
import debounce from 'loadsh/debounce'
import capitalize from 'loadsh/capitalize'
import axios from 'axios'
export default {
    data() {
        return {
            text: "可以",
            go: "随便改",
            question: "",
            answer: '不太想回答你'
        }
    },
    computed: {
        // 计算属性的get方法内，不应该对值做变更
        // 计算属性的get方法实际上相当于一个可以动态更新的data，并且有缓存
        full: {
            get: function() {
                return `${this.text}很强`
            },
            set: function(newVal) {
                newVal.length && newVal.length > 4 ? this.text = newVal.slice(0, 4) : ''
            }
        }
    },
    watch: {
        text: {
            handler(n, o) {
                this.go = n
            }
        },
        question: {
            handler(n, o) {
                this.answer = 'Waiting for you to stop typing ...'
                this.debuoncedGetAnswer()
            }
        }
    },
    created() {
        // 防抖
        this.debuoncedGetAnswer = debounce(this.getAnswer, 5000)
    },
    methods: {
        change(e) {
            console.info(e.target.value)
            this.full = e.target.value
        },
        async getAnswer() {
            if (this.question.indexOf("?") === -1) {
                this.answer = "给老子提问"
                return
            }
            this.answer = "提了问也不回答你"
            let res = await axios.get("https://yesno.wtf/api")
            if (res.status === 200) {
                this.answer = capitalize(res.data.answer)
            } else {
                this.answer = 'Error! Could not reach the API. ' + res.statusText
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>