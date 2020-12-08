<script>
import { scrollData } from "./scroll";
export default {
  name: "scroll-tree",
  data() {
    return {
      loading: false,
      // tableColumn: [
      //   { type: "seq", title: "序号", width: 100, fixed: "left" },
      //   { type: "checkbox", title: "A", treeNode: true, width: 300 },
      //   { field: "b", title: "B", width: 100 },
      //   { field: "c", title: "C", width: 100 },
      //   { field: "d", title: "D", width: 100 },
      //   { field: "e", title: "E", width: 100 },
      //   { field: "f", title: "F", width: 100 },
      //   { field: "g", title: "G", width: 100 },
      //   { field: "h", title: "H", width: 100 },
      //   { field: "i", title: "I", width: 100 },
      //   { field: "j", title: "J", width: 100 },
      //   { field: "k", title: "K", width: 100 },
      //   { field: "x", title: "X", width: 100 },
      //   { field: "y", title: "Y", width: 100 },
      //   { field: "z", title: "Z", width: 100 },
      // ],
      tableColumn: [
        {
          field: "name",
          title: "地区",
          key: "name",
          width: 250,
          align: "left",
          fixed: "left",
          treeNode: true,
          // scopedSlots: { customRender: "name" },
        },
        {
          title: "机构代码",
          width: 200,
          align: "left",
          field: "originCode",
          key: "originCode",
        },
        {
          title: "户数",
          align: "left",
          key: "household",
          children: [
            {
              width: 200,
              align: "left",
              field: "extension.householdCount",
              key: "extension.householdCount",
            },
            {
              title: "已上报",
              align: "left",
              width: 200,
              field: "extension.householdReported",
              key: "extension.householdReported",
            },
            {
              title: "审核通过",
              align: "left",
              width: 200,
              field: "extension.householdLegal",
              key: "extension.householdLegal",
            },
            {
              title: "审核未通过",
              align: "left",
              width: 200,
              field: "extension.householdIlegal",
              key: "extension.householdIlegal",
            },
            {
              title: "未填报",
              align: "left",
              width: 200,
              field: "extension.householdNotFill",
              key: "extension.householdNotFill",
            },
          ],
        },
        {
          align: "left",
          field: "extension.reportedRatio",
          key: "extension.reportedRatio",
          width: 200,
          slots: { header: "reportedRatio" },
          // customRender: (text) => {
          //   return text.toFixed(2) + '%'
          // },
        },
      ],
      dataSource: scrollData.result.data,
    };
  },
  mounted() {
    // this.loadData(2000);
    this.dataSource.forEach((item) => {
      if (item.children.length) {
        item.hasChild = true;
        if (item.children.length) {
          item.children.forEach((child) => {
            child.children ? (child.hasChild = true) : "";
          });
        }
      }
    });
    // console.info(this.dataSource);
    this.$refs.xVTree.loadData(this.dataSource);
    this.$refs.xVTree.setTreeExpand([this.dataSource[0]], true);
    // this.getTreeList(10000).then((res) => {
    //   console.info(res);
    // });
  },
  methods: {
    loadData(size) {
      this.loading = true;
      this.getTreeList(size).then((data) => {
        console.info(data);
        const startTime = Date.now();
        this.loading = false;
        if (this.$refs.xVTree) {
          this.$refs.xVTree.loadData(data);
          this.$nextTick(() => {
            this.$XModal.message({
              message: `渲染 ${size} 行，用时 ${Date.now() - startTime}毫秒`,
              status: "info",
            });
          });
        }
      });
    },
    getTreeList(size) {
      return new Promise((resolve) => {
        // 模拟后台生成树结构
        setTimeout(() => {
          const len1 = size / 2;
          const len2 = 3;
          const len3 = 2;
          const len4 = 2;
          const len5 = 5;
          const result = [];
          const startIndex = 10000;
          let ketIndex = 0;
          for (let index1 = 0; index1 < len1; index1++) {
            if (ketIndex >= size) {
              break;
            }
            const children1 = [];
            for (let index2 = 0; index2 < len2; index2++) {
              if (ketIndex >= size) {
                break;
              }
              const children2 = [];
              for (let index3 = 0; index3 < len3; index3++) {
                if (ketIndex >= size) {
                  break;
                }
                const children3 = [];
                for (let index4 = 0; index4 < len4; index4++) {
                  if (ketIndex >= size) {
                    break;
                  }
                  const children4 = [];
                  for (let index5 = 0; index5 < len5; index5++) {
                    if (ketIndex >= size) {
                      break;
                    }
                    const item5 = {
                      id: startIndex + ketIndex++,
                      a: `a${index1}_${index2}_${index3}_${index4}_${index5}`,
                      b: `b${index1}_${index2}_${index3}_${index4}_${index5}`,
                      c: `c${index1}_${index2}_${index3}_${index4}_${index5}`,
                      d: `d${index1}_${index2}_${index3}_${index4}_${index5}`,
                      e: `e${index1}_${index2}_${index3}_${index4}_${index5}`,
                      f: `f${index1}_${index2}_${index3}_${index4}_${index5}`,
                      g: `g${index1}_${index2}_${index3}_${index4}_${index5}`,
                      h: `h${index1}_${index2}_${index3}_${index4}_${index5}`,
                      i: `i${index1}_${index2}_${index3}_${index4}_${index5}`,
                      j: `j${index1}_${index2}_${index3}_${index4}_${index5}`,
                      k: `k${index1}_${index2}_${index3}_${index4}_${index5}`,
                      x: `x${index1}_${index2}_${index3}_${index4}_${index5}`,
                      y: `y${index1}_${index2}_${index3}_${index4}_${index5}`,
                      z: `z${index1}_${index2}_${index3}_${index4}_${index5}`,
                      checked: false,
                      indeterminate: false,
                      children: [],
                    };
                    children4.push(item5);
                  }
                  const item4 = {
                    id: startIndex + ketIndex++,
                    a: `a${index1}_${index2}_${index3}_${index4}`,
                    b: `b${index1}_${index2}_${index3}_${index4}`,
                    c: `c${index1}_${index2}_${index3}_${index4}`,
                    d: `d${index1}_${index2}_${index3}_${index4}`,
                    e: `e${index1}_${index2}_${index3}_${index4}`,
                    f: `f${index1}_${index2}_${index3}_${index4}`,
                    g: `g${index1}_${index2}_${index3}_${index4}`,
                    h: `h${index1}_${index2}_${index3}_${index4}`,
                    i: `i${index1}_${index2}_${index3}_${index4}`,
                    j: `j${index1}_${index2}_${index3}_${index4}`,
                    k: `k${index1}_${index2}_${index3}_${index4}`,
                    x: `x${index1}_${index2}_${index3}_${index4}`,
                    y: `y${index1}_${index2}_${index3}_${index4}`,
                    z: `z${index1}_${index2}_${index3}_${index4}`,
                    checked: false,
                    indeterminate: false,
                    children: children4,
                  };
                  children3.push(item4);
                }
                const item3 = {
                  id: startIndex + ketIndex++,
                  a: `a${index1}_${index2}_${index3}`,
                  b: `b${index1}_${index2}_${index3}`,
                  c: `c${index1}_${index2}_${index3}`,
                  d: `d${index1}_${index2}_${index3}`,
                  e: `e${index1}_${index2}_${index3}`,
                  f: `f${index1}_${index2}_${index3}`,
                  g: `g${index1}_${index2}_${index3}`,
                  h: `h${index1}_${index2}_${index3}`,
                  i: `i${index1}_${index2}_${index3}`,
                  j: `j${index1}_${index2}_${index3}`,
                  k: `k${index1}_${index2}_${index3}`,
                  x: `x${index1}_${index2}_${index3}`,
                  y: `y${index1}_${index2}_${index3}`,
                  z: `z${index1}_${index2}_${index3}`,
                  checked: false,
                  indeterminate: false,
                  children: children3,
                };
                children2.push(item3);
              }
              const item2 = {
                id: startIndex + ketIndex++,
                a: `a${index1}_${index2}`,
                b: `b${index1}_${index2}`,
                c: `c${index1}_${index2}`,
                d: `d${index1}_${index2}`,
                e: `e${index1}_${index2}`,
                f: `f${index1}_${index2}`,
                g: `g${index1}_${index2}`,
                h: `h${index1}_${index2}`,
                i: `i${index1}_${index2}`,
                j: `j${index1}_${index2}`,
                k: `k${index1}_${index2}`,
                x: `x${index1}_${index2}`,
                y: `y${index1}_${index2}`,
                z: `z${index1}_${index2}`,
                checked: false,
                indeterminate: false,
                children: children2,
              };
              children1.push(item2);
            }
            const item1 = {
              id: startIndex + ketIndex++,
              a: `a${index1}`,
              b: `b${index1}`,
              c: `c${index1}`,
              d: `d${index1}`,
              e: `e${index1}`,
              f: `f${index1}`,
              g: `g${index1}`,
              h: `h${index1}`,
              i: `i${index1}`,
              j: `j${index1}`,
              k: `k${index1}`,
              x: `x${index1}`,
              y: `y${index1}`,
              z: `z${index1}`,
              checked: false,
              indeterminate: false,
              children: children1,
            };
            result.push(item1);
          }
          resolve(result);
        }, 300);
      });
    },
    getSelectionEvent() {
      const selectRecords = this.$refs.xVTree.getCheckboxRecords();
      this.$XModal.alert(selectRecords.length);
    },
  },
  render(h) {
    return (
      <a-card>
        <a-spin spinning={this.loading}>
          <div>
            <vxe-virtual-tree
              //   resizable
              show-overflow
              row-key
              ref="xVTree"
              max-height="500"
              loading={this.loading}
              // toolbar-config={{ slots: { buttons: "toolbar_buttons" } }}
              // checkbox-config={{
              //   labelField: "a",
              //   checkField: "checked",
              //   halfField: "indeterminate",
              // }}
              tree-config={{ children: "children", hasChild: "hasChild" }}
              columns={this.tableColumn}
              {...{
                scopedSlots: {
                  reportedRatio: () => <div>上报率(户)</div>,
                },
              }}
            ></vxe-virtual-tree>
          </div>
        </a-spin>
      </a-card>
    );
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vxe-virtual-tree {
  width: 1654px;
  margin: 0 auto;
}
::v-deep .vxe-table {
  .vxe-cell {
    height: 20px;
    line-height: 20px;
  }
  // .vxe-table--body-wrapper {
  //   max-height: calc(100vh - 420px);
  // }
  .vxe-table--header {
    .vxe-header--row {
      th {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        text-align: left;
        background: #f0f2f5;
        border-bottom: 1px solid #e8e8e8;
        -webkit-transition: background 0.3s ease;
        transition: background 0.3s ease;
        border-right: 1px solid #e8e8e8;
      }
      .vxe-header--column.col_5 {
        border-top: none;
      }
      .col--group {
        border-bottom: none;
      }
    }
    .vxe-header--row:nth-child(2) {
      .vxe-header--column:not(:first-child) {
        border-top: 1px solid #e8e8e8;
      }
    }
  }
}
::v-deep .vxe-cell--tree-node.is--active .vxe-tree--btn-wrapper {
  width: 1.5em;
  height: 1.5em;
  transform: translate(-18%, -39%);
  background-image: url(~@/assets/sub.png);
  background-repeat: no-repeat;
  i {
    display: none;
  }
}
::v-deep .vxe-cell--tree-node .vxe-tree--btn-wrapper {
  width: 1.5em;
  height: 1.5em;
  transform: translate(-18%, -39%);
  background-image: url(~@/assets/add.png);
  background-repeat: no-repeat;
  i {
    display: none;
  }
}
/deep/ .vxe-body--column {
  border-right: 1px solid #e8e8e8;
}
/deep/ .vxe-table .vxe-body--column.col--ellipsis, /deep/ .vxe-table.vxe-editable .vxe-body--column, /deep/ .vxe-table .vxe-footer--column.col--ellipsis, /deep/ .vxe-table .vxe-header--column.col--ellipsis {
  height: 40px;
}
/deep/ .vxe-table .vxe-body--column, /deep/ .vxe-table .vxe-footer--column, /deep/ .vxe-table .vxe-header--column {
  line-height: 40px;
}
/deep/ .ant-card .ant-card-body table tr td {
    padding: 0 !important;
}
</style>