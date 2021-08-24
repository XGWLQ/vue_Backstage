<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="_getOrderlist">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="_getOrderlist"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格渲染区 -->
      <el-table border
                :data="orderlist"
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"></el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"
                         width="80"></el-table-column>
        <el-table-column prop="pay_status"
                         label="是否付款"
                         width="80">
          <template slot-scope="scope">
            <el-tag type="danger"
                    v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success"
                    v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货"
                         width="80">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间"
                         width="160">
          <template slot-scope="scope">
            {{scope.row.create_time |data-Timer }}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120">
          <template slot-scope="">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="updataAddres"></el-button>
            <el-button size="mini"
                       type="success"
                       icon="el-icon-location-outline"
                       @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[5, 12, 18, 25]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话 -->
    <el-dialog title="修改地址"
               :visible.sync="showSitedialogVisible"
               width="50%"
               @close="resetAdderssFrom">
      <!-- 验证表单 -->
      <el-form :model="addressForm"
               :rules="addressRules"
               ref="addressRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader :options="citydata"
                       clearable
                       v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showSitedialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="showSitedialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话 -->
    <el-dialog title="物流进度"
               :visible.sync="progressVisible"
               width="50%">
    </el-dialog>
  </div>
</template>
<script>
import citydata from '../plugins/citydata'
export default {
  name: 'Orders',
  data () {
    return {
      // 查询需要的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 获取到的商品数据
      orderlist: [],
      // 获取到的总页数
      total: 0,

      //  修改地址对话的显示隐藏
      showSitedialogVisible: false,

      // 修改地址
      addressForm: {
        address1: '',
        address2: ''
      },
      // 地址验证规则
      addressRules: {
        address1: [{
          required: true,
          message: '请选择省市区/县',
          trigger: 'blur'
        }],
        address2: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }]
      },
      // 级联选择器城市数据
      citydata,

      // 物流进度对话的显示隐藏
      progressVisible: false,
      progerssInfo: []
    }
  },
  created () {
    this._getOrderlist()
  },
  methods: {
    // 获取订单数据
    async _getOrderlist () {
      const { data: res } = await this.$axios.get('orders'
        , { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.metamsg)
      }
      this.orderlist = res.data.goods
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    // 页码切换
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this._getOrderlist()
    },
    // 点击某一页的切换
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this._getOrderlist()
    },

    //  修改地址对话的显示
    updataAddres () {
      this.showSitedialogVisible = !this.showSitedialogVisible
    },
    //  物流进度对话的显示
    async showProgress () {
      // const { data: res } = await this.$axios.get('/kuaidi/804909574412544580')

      // if (res.meta.status !== 200) {
      //   this.$message.error('获取物流信息失败')
      // }
      // this.progerssInfo = res.data
      // console.log(res)
      this.progressVisible = !this.progressVisible
    },
    // 重置验证表单
    resetAdderssFrom () {
      this.$refs.addressRef.resetFields()
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
.el-cascader {
  width: 100%;
}
</style>
