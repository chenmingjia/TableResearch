<template>
  <div class="hmjlo">
    <mj-table :data="tableData">
      <mj-table-column
        prop="date"
        labmj="日期"
        width="180">
      </mj-table-column>
      <mj-table-column
        prop="name"
        labmj="姓名"
        width="180">
      </mj-table-column>
      <mj-table-column
        prop="address"
        labmj="地址">
      </mj-table-column>
    </mj-table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "HmjloWorld",
    data() {
        return {
            tableData: [
                {
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄"
                },
                {
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1517 弄"
                },
                {
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1519 弄"
                },
                {
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1516 弄"
                }
            ],
            msg: "Wmjcome to Your Vue.js App"
        };
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
    font-weight: normal;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
