// 实际上指令就是一个对象

// 原生浏览器提供了api，但是只能copy选中的值
// 现在要使用代码实现选中的效果
// 动态创建input标签，把要复制的值赋给input.value
// 调用api选中input.value
// 最后调用api复制选中的值

import { Message } from 'ant-design-vue'

const vCopy = { // 定义指令名
    /**
     * bind: 狗子函数，第一次绑定的时候，做初始化的设置
     * el: 作用的dom对象
     * value: 指令钩子函数第二个参数，binding对象中的值，指令的绑定值，也就是要copy的值
     */
    bind(el, { value }) {
        el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数离还会用到
        // 定义了一个事件处理程序
        el.handler = () => {
            if (!el.$value) {
                // 如果值为空，那么给出一个提示
                Message.warning("没有复制的内容")
                return;
            }
            // 动态创建textarea标签
            const textarea = document.createElement("textarea")

            // 将该textarea设为readonly，防止ios下自动唤起键盘，同时将textarea移出可视区域
            textarea.readOnly = 'readonly';
            textarea.style.position = "absolute";
            textarea.style.left = '-9999px';
            // 将要copy的值赋给textarea 标签的value属性
            textarea.value = el.$value;
            // 将textarea插入到body中
            document.body.appendChild(textarea)
            // 选中值并复制
            textarea.select()
            // 也可以使用 textarea.setSelectionRange(0, textarea.value.length);
            // execCommand已经弃用
            const result = document.execCommand("copy")
            if (result) {
                Message.success('复制成功')
            }
            document.body.removeChild(textarea)
        }
        // 绑定点击事件, 也就是所谓的一键 copy
        el.addEventListener('click', el.handler);
    },
    // 当传入的值更新完毕的时候
    componentUpdated(el, { value }) {
        el.$value = value
    },
    unbind(el) {
        el.removeEventListener('click', el.handler);
    }
}

export default vCopy