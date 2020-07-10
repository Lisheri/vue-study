<script>
import Child from './child'
import Brother from './brother'
import CheckBox from './checkBox'
import BaseInput from './baseInput'
import TestSync from './testSync'
export default {
    data() {
        return {
            listname: 'wocao',
            lovingVue: false,
            inputVal: "卧槽",
            title: "标题旧:测试sync"
        }
    },
    methods: {
        getGrandFather(val) {
            console.info(this.val)
        },
        toChild(val) {
            console.info(val)
        },
        onFocus() {
            console.info("卧槽")
        },
        $_handleTitleChange(val) {
            this.title = val
        }
    },
    components: {Child, Brother, CheckBox, BaseInput, TestSync},
    render(h) {
        return (
            <div>
                <h1>props</h1>
                <Child
                testString={'string'}
                // 如果在子组件中props验证不通过，比如子组件需要一个number类型的props，而传递了一个String类型的，就会抛出一个类型检查错误
                // testNumber={'999'}
                testNumber={999}
                testBoolean={false}
                testArray={[1,2,3,4]}
                testObj={{a: "测试", b: "测试二"}}
                propsE={"success"}
                testCallback={(e) => {console.info(e)}}
                testPromise={new Promise(resolve => {
                    resolve(1)
                })}
                v-model={this.listname}
                onGrandFather={this.getGrandFather}
                // onToChild={this.toChild}
                on={{toChild: this.toChild}}
                />
                <Brother v-model={this.listname}/>
                <span>{this.lovingVue.toString()}</span>
                <check-box v-model={this.lovingVue}></check-box>
                <base-input onFocus={this.onFocus} v-model={this.inputVal}/>
                <span>{this.inputVal}</span>
                <test-sync
                title={this.title}
                // on={{'update:title': this.$_handleTitleChange}}
                onTitle={this.$_handleTitleChange}
                ></test-sync>
                <span>{this.title}</span>
            </div>
        )
    }
}
</script>