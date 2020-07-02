<template>
    <div>
        <anchored-heading2 :level="level">render-test</anchored-heading2>
    </div>
</template>
<script>
import Vue from "vue";

let getChildrenTextContent = (children) => {
    // console.info(children)
    return children.map(child => {
        return child.children ? getChildrenTextContent(child.children) : child.text
    }).join('')
}

Vue.component("anchored-heading2", {
    render: function(createElement) {
        // 创建kebab-case风格(短横线连接式)的id
        let headingId = getChildrenTextContent(this.$slots.default)
        .toLowerCase()
        .replace(/\W+/g, "-")
        .replace(/(^-|-$)/, "")

        return createElement(
            'h' + this.level,
            [
                createElement(
                    'a',
                    {
                        attrs: {
                            name: headingId,
                            href: `#${headingId}`
                        }
                    },
                    this.$slots.default
                )
            ]
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
export default {
    props: ['level']
};
</script>

<style lang="scss" scoped>
</style>