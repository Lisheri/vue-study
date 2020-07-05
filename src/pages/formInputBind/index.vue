<script>
import InputVModel from "./inputVmodel";
import alertBox from "./alertBox";
export default {
  data() {
    return {
      testKey: "测试",
      testTarea: "textarea",
      checkbox: false,
      checkedNames: [],
      checkedNames2: [],
      checkedNames3: [],
      optionsArr: ["jack", "tom", "fuck"],
      optionsArr2: ["jackx", "tomx", "fuckx"],
      radios: "one",
      radio2: "one",
      selectedVal1: "",
      selectOptionArr1: [
        { text: "One", value: "A" },
        { text: "Two", value: "B" },
        { text: "Three", value: "C" }
      ],
      modelVal: "测试v-model"
    };
  },
  methods: {
    // 先执行change再执行input
    keyInput(e) {
      // console.info(`input事件${e}`)
    },
    keyChange(e) {
      // console.info(`change事件${e}`)
    },
    handleCheckChange(e) {
      console.info(this.checkedNames2);
    }
  },
  components: { InputVModel, alertBox },
  render(h) {
    const Title = <h1 slot="title">我是title_slot</h1>
    return (
      <div>
        <h1>表单数据绑定</h1>
        {/*
                        v-model在内部为不同的元素使用不同的property
                        text 和 textarea 元素使用 value property 和 input 事件；
                        checkbox 和 radio 使用 checked property 和 change 事件；
                        select 字段将 value 作为 prop 并将 change 作为事件。

                        事件修饰符
                        .lazy: 默认情况下， v-model是在input事件触发后，就同步绑定数据，添加后，可以在change事件之后再进行同步
                        .number 可以将用户输入的值转换为数值类型
                        .trim 自动过滤用户输入在最后的空白字符串
                    */}
        <div style="display: flex; width: calc(100vw - 200px); margin: 0 auto; flexWrap: wrap;">
          <a-card hoverable style="width: 240px" class="divbox">
            <a-input
              onInput={this.keyInput}
              onChange={this.keyChange}
              style="width: 200px; margin: 0 auto;"
              v-model={this.testKey}
              class={{ block: true }}
            />
            &nbsp;&nbsp;&nbsp;
            <span class={{ block: true, left: true }}>
              the input's value is :{this.testKey}
            </span>
          </a-card>
          <br />
          <a-card hoverable style="width: 240px" class="divbox">
            <a-textarea
              v-model={this.testTarea}
              style="width: 200px; margin: 0 auto;"
              class={{ block: true }}
            />
            &nbsp;&nbsp;&nbsp;
            <span class={{ block: true, left: true }}>
              the textarea's value is: {this.testTarea}
            </span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // <input id="checkbox" v-model={this.checkbox} type="checkbox"/>
            }
            <a-checkbox id="checkbox" v-model={this.checkbox} />
            <label for="checkbox">{this.checkbox.toString()}</label>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 多选复选框
            }
            <input
              type="checkbox"
              id="jack"
              value="jack"
              v-model={this.checkedNames}
            />
            <label for="jack">Jack</label>
            &nbsp;&nbsp;&nbsp;
            <input
              type="checkbox"
              id="tom"
              value="tom"
              v-model={this.checkedNames}
            />
            <label for="tom">Tom</label>
            &nbsp;&nbsp;&nbsp;
            <input
              type="checkbox"
              id="fuck"
              value="fuck"
              v-model={this.checkedNames}
            />
            <label for="fuck">Fuck</label>
            <br />
            <span>{"Checked names:" + this.checkedNames.toString()}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 多选复选框使用a-checkbox-group
            }
            <a-checkbox-group
              v-model={this.checkedNames2}
              options={this.optionsArr}
              onChange={this.handleCheckChange}
            ></a-checkbox-group>
            <br />
            <span>{`Checked names:[${this.checkedNames2.join()}]`}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 多选复选框使用a-checkbox-group插槽
            }
            <a-checkbox-group
              v-model={this.checkedNames3}
              options={this.optionsArr2}
              onChange={this.handleCheckChange}
              {...{
                scopedSlots: {
                  label: scoped => {
                    return <span>卧槽</span>;
                  },
                  default: options => {
                    return [
                      <span>{options[0]}</span>,
                      <span>{options[1]}</span>
                    ];
                  }
                }
              }}
            ></a-checkbox-group>
            <br />
            <span>{`Checked names:[${this.checkedNames3.join()}]`}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 单选按钮
            }
            <input type="radio" id="one" value="one" v-model={this.radios} />
            <label for="one">One</label>
            <input type="radio" id="two" value="two" v-model={this.radios} />
            <label for="two">Two</label>
            <br />
            <span>{`Checked names:${this.radios}`}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 单选按钮
            }
            <a-radio-group v-model={this.radio2}>
              <a-radio id="one" value="one" />
              <label for="one">One</label>
              <a-radio id="two" value="two" />
              <label for="two">Two</label>
            </a-radio-group>
            <br />
            <span>{`Checked names:${this.radio2}`}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            {
              // 单选v-for渲染
            }
            <select v-model={this.selectedVal1}>
              <option value="" disabled>
                请选择...
              </option>
              {this.selectOptionArr1.map(item => (
                <option vlaue={item.value}>{item.text}</option>
              ))}
            </select>
            <br />
            <span>{`Checked names:${this.selectedVal1}`}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            <InputVModel v-model={this.modelVal} />
            <span>{this.modelVal}</span>
          </a-card>
          <a-card hoverable style="width: 240px" class="divbox">
            <alertBox
              titleSlot={Title}
              {...{
                scopedSlots: {
                  sub: ({injectProps}) => (
                    <div>
                      <h3>{injectProps.key}</h3>
                      <span>{injectProps.value}</span>
                    </div>
                  ),
                  testSlot: () => {
                    return (<span>我的天</span>)
                  },
                }
              }}
            >
              卧槽
            </alertBox>
          </a-card>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.divbox {
  max-height: 400px;
  overflow: auto;
  margin: 0 auto;
}
.block {
  display: block;
}
.left {
  text-align: left;
}
</style>