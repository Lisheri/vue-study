<script>
export default {
  data() {
    return {
      isActive: true,
      renderData: "jsx渲染",
      activeClass: "active",
      staticClass: "static",
      error: null,
      classObj: {
        active: true,
        static: true
      },
      red: 'red',
      thirty: '30',
      styleObj: {
        color: 'yellow',
        fontSize: "35px"
      },
      isUsername: true,
      inputVal: "点击切换为邮箱登录",
      // vue对被侦听的数组变更方法进行了包裹，所以会触发视图更新，变更方法就是指会改变原数组的方法
      // 变更方法有 push(), pop(), shift(), unshift(), splice(), sort(), reverse()
      // 非变更方法: filter(), concat(), slice()
      lists: ['我是', '你爸', '爸', '呀'],
      dataobj: {
        a: "wocao",
        b: "woqu"
      }
    };
  },
  computed: {
    classCpu: {
      get: function() {
        return {
          active: this.isActive && !this.error,
          "text-danger": this.error && this.error.type === "fatal"
        };
      }
    }
  },
  methods: {
    handleErrorChange() {
      if (this.isActive) {
        this.error = {
          type: "fatal"
        };
        this.isActive = false;
      } else {
        this.isActive = true;
        this.error = null;
      }
    },
    handleChangeInput() {
      if (this.isUsername) {
        this.inputVal = '点击切换为用户名登录'
        this.isUsername = false
      } else {
        this.inputVal = '点击切换为邮箱登录'
        this.isUsername = true
      }
    }
  },
  render() {
    return (
      <div>
        <p
          // ? 单纯的动态class
          // class={{'active': this.isActive, 'static': true}}
          // ? 可以使用data中的
          // class={this.classObj}
          // ? 使用计算属性
          //   class={this.classCpu}
          // ? 数组语法
          class={[`${this.isActive ? this.staticClass : ''}`, this.activeClass]}
          /**
           * TODO 绑定内敛样式
           * 标签第一个括号表示写内容，第二个括号表示是一个对象
           */
          // ? 一般写法+绑定data中的样式
          // style={{color: this.red, fontSize: `${this.thirty}px`}}
          // ? 对象写法
          // style={this.styleObj}
          // ? 数组写法可以绑定多个样式对象
          // style={[this.styleObj]}
          // ? 多重值
          style={{display: ['-webkit-box', '-ms-flexbox', 'flex']}}
        >
          {this.renderData}
        </p>
        <a-button onClick={this.handleErrorChange} type="primary">
          点击切换样式
        </a-button>
        {this.isUsername ? 
        <template style={{display: 'flex', margin: '0, auto', width: '400px'}}>
          <label>userName</label>
          <a-input placeholder={'请输入您的用户名'} class={'input'} key="username-input"/>
        </template>
         : 
        <template style={{display: 'flex', margin: '0, auto', width: '400px'}}>
          <label>email</label>
          <a-input placeholder={'请输入您的邮箱'} class={'input'} key="email-input"/>
        </template>
        }
        <a-button onClick={this.handleChangeInput}>{this.inputVal}</a-button>
        <div>
          <ul style={{display: 'flex'}}>
            {
              // v-for
              this.lists.map(item => <li style={{listStyle: 'none'}}>{item}</li>)
            }
          </ul>
        </div>
        <div>
          <ul style={{display: 'flex'}}>
            {
              // 使用array.prototype.map替代v-for
              Object.values(this.dataobj).map(item => <li style={{listStyle: 'none'}}>{item}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.static {
  width: 300px;
  margin: 10px auto;
}
.active {
  color: yellowgreen;
}
.text-danger {
  color: red;
  text-align: center;
}
.input {
  width: 200px;
  border-radius: 2px;
}
</style>