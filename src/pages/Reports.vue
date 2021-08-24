<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 2、为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main"
           style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 1、导入
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () { },
  async mounted () {
    // 3、 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 后台获取数据
    const { data: res } = await this.$axios.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 准备数据的配置项 合并
    const result = _.merge(res.data, this.options)

    console.log(result)
    // 5、准备数据 绘制图表
    myChart.setOption(result)
  },
  methods: {}
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
</style>
