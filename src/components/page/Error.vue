<template>
  <div class>
    <el-table
      :data="listData"
      :span-method="objectSpanMethod"
      border
      class="tableArea"
      style="width: 40%;"
    >
      <el-table-column label="商品类别" prop="productType" align="center" width="200"></el-table-column>
      <el-table-column label="商品数量" prop="amount" align="center"></el-table-column>
      <el-table-column label="商品价格" prop="price" align="center"></el-table-column>
      <el-table-column label="商品名称" prop="productName" width="200px" align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listData: [],
      testArr1: [],
      testArr2: [],
      testPosition1: 0,
      testPosition2: 0,
    };
  },
  methods: {
    // 获取数据
    queryData() {
      this.listData = [
        {
          id: "201808300001",
          productType: "纺织品",
          amount: 20,
          productName: "上衣",
          price: "80",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300002",
          productType: "纺织品",
          amount: 20,
          productName: "裤子",
          price: "76",
          updateTime: "2018-08-31",
        },
        {
          id: "201808300003",
          productType: "皮制品",
          amount: 100,
          productName: "挎包",
          price: "150",
          updateTime: "2018-08-31",
        },

        {
          id: "201808300004",
          productType: "皮制品",
          amount: 180,
          productName: "鞋子",
          price: "76",
          updateTime: "2018-08-29",
        },
        {
          id: "201808300005",
          productType: "绸缎",
          amount: 80,
          productName: "旗袍",
          price: "106",
          updateTime: "2018-08-31",
        },
        {
          id: "201808300006",
          productType: "纺织品",
          amount: 20,
          productName: "短裙",
          price: "36",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300007",
          productType: "纺织品",
          amount: 80,
          productName: "短袖",
          price: "36",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300008",
          productType: "纺织品",
          amount: 20,
          productName: "短袖",
          price: "36",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300009",
          productType: "皮制品",
          amount: 20,
          productName: "钱包",
          price: "60",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300011",
          productType: "纺织品",
          amount: 90,
          productName: "手套",
          price: "60",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300012",
          productType: "纺织品",
          amount: 90,
          productName: "袜子",
          price: "36",
          updateTime: "2018-08-30",
        },
        {
          id: "201808300013",
          productType: "饮料",
          amount: 100,
          productName: "雪碧",
          price: "5",
          updateTime: "2018-08-31",
        },
        {
          id: "201808300013",
          productType: "纺织品",
          amount: 100,
          productName: "风衣",
          price: "50",
          updateTime: "2018-08-31",
        },
      ];
      this.rowspan(this.testArr1, this.testPosition1, "productType");
      this.rowspan(this.testArr2, this.testPosition2, "amount");
    },
    rowspan(spanArr, position, spanName) {
      this.listData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1);
          position = 0;
        } else {
          if (
            this.listData[index][spanName] ===
            this.listData[index - 1][spanName]
          ) {
            spanArr[position] += 1;
            spanArr.push(0);
          } else {
            spanArr.push(1);
            position = index;
          }
        }
      });
      console.log(this.testArr1)
    },
    // 表格合并行
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.testArr1[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(_row, _col)
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      // if (columnIndex === 1) {
      //   const _row = this.testArr2[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col,
      //   };
      // }
    },
  },
  mounted() {
    this.queryData();
  },
};
</script>
