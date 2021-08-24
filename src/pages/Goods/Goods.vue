<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="_getGoodsList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="_getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4"
                class="colButton">
          <el-button type="primary"
                     @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品表格区域 -->
      <el-table border
                :data="goodslist"
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称"></el-table-column>
        <el-table-column prop="goods_price"
                         label="商品价格(元)"
                         width="70"></el-table-column>
        <el-table-column prop="goods_weight"
                         label="商品重量"
                         width="60"></el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间"
                         width="165">
          <template slot-scope="scope">
            {{scope.row.add_time | data-Timer}}</template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit"></el-button>
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       @click="delgoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background>
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Goods',
  data () {
    return {
      // 查询需要的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },

      // 获取到的商品数据
      goodslist: [],
      // 获取到的总页数
      total: 0
    }
  },
  created () {
    this._getGoodsList()
  },
  methods: {
    // 初始化数据
    async _getGoodsList () {
      const { data: res } = await this.$axios.get('goods'
        , { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    // 每页条数变化
    handleSizeChange (newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this._getGoodsList()
    },
    // 当前页码值
    handleCurrentChange (newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this._getGoodsList()
    },

    // 删除商品
    async delgoods (id) {
      const confirmId = await this.$confirm('此操作将永久删除该商品信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmId !== 'confirm') { return }
      // 没有返回出去说明不是点击取消
      const { data: res } = await this.$axios.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.metamsg)
      }
      this._getGoodsList()
      this.$message.success(res.meta.msg)
    },

    // 点击转跳添加商品页面
    addGood () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-table {
  margin: 18px 0;
}
.colButton {
  margin-left: 18px;
}
</style>
