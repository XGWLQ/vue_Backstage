<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary"
                     @click="showAddClassIfy">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 商品分类表格 -->
      <tree-table class="treeTable"
                  :data="goodsList"
                  :columns='columns'
                  show-index
                  border
                  stripe
                  index-text='#'
                  :expand-type='false'
                  :selection-type='false'>
        <!--  是否有效-->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-circle-check el-icon-i"
             v-if=" !scope.row.cat_deleted"
             style="color:lightgreen"></i>
          <i class="el-icon-circle-close el-icon-i"
             style="color:red"
             v-else></i>
        </template>
        <!-- 排序列 -->
        <template slot-scope="scope"
                  slot="order">
          <el-tag size="mini"
                  v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini"
                  type="success"
                  v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini"
                  type="warning"
                  v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot-scope="scope"
                  slot="opt">
          <!-- 修改按钮 -->
          <el-button type="primary"
                     icon="el-icon-edit"
                     size='mini'
                     @click="updataClassIfy(scope.row.cat_id)">修改</el-button>
          <!-- 删除按钮 -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     size='mini'
                     @click="delClassIfy(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页模板 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="querInfo.pagenum"
                     :page-sizes="[2, 4,5, 6, 8]"
                     :page-size="querInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类模块 @close="updataRolesDialogClose" -->
    <el-dialog title="添加分类"
               :visible.sync="addClassIfyDialogVisible"
               width="50%"
               @close="addClassIfyDialogClose">
      <!-- 内容主体区  -->
      <el-form ref="addClassIfyRolesRef"
               :model="addClassIfyList"
               :rules="addClassIfyRules"
               label-width="80px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addClassIfyList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类名称">
          <!--options 用来指定数据源 props 用来指定配置对象 multiple:true,checkStrictly:true-->
          <!-- value: 'cat_id', label: 'cat_name', children: 'children' -->
          <el-cascader v-model="selectId"
                       :options="parClassIfyList"
                       clearable
                       :props="{ value: 'cat_id', label: 'cat_name', children: 'children',checkStrictly:true,expandTrigger:'hover'}"
                       @change="parClassIfyChange"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addClassIfyDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addClassIfy">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的方法 -->
    <el-dialog title="修改分类"
               :visible.sync="updataClassIfyDialogVisible"
               width="50%">
      <el-form ref="updataClassIfyRolesRef"
               label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="classIfyNameList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="updataClassIfyDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveClassIfy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Categories',
  data () {
    return {
      goodsList: [], // 保存商品分类的数据
      querInfo: { // 请求的参数信息
        type: 3, // 获取层级
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条数据
      },
      total: 0, // 总页数

      columns: [ // 表格数据渲染格式
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        { // 自定义模板列
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板 solt 使用的名称
          template: 'isok'
        },
        { // 自定义模板列
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板 solt 使用的名称
          template: 'order'
        },
        { // 自定义模板列
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 模板 solt 使用的名称
          template: 'opt'
        }
      ],

      // 添加分类
      // 添加分类是否显示
      addClassIfyDialogVisible: false,
      // 用来存储要添加获取到的表单对象
      addClassIfyList: {
        // 添加分类的名称
        cat_name: '',
        // 添加分类父级的id
        cat_pid: 0,
        // 添加分类的登记
        cat_level: 0
      },
      // 添加分类的校验规则
      addClassIfyRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 获取到的数据源数据
      parClassIfyList: [],
      // 选择分类值的数据 id 值
      selectId: [],

      // 编辑分类的显示隐藏
      updataClassIfyDialogVisible: false,
      // 编辑的分类名称
      classIfyNameList: {}
    }
  },
  created () {
    this._getGoodsList()
  },
  methods: {
    // 获取分类商品数据
    async _getGoodsList () {
      const { data: res } = await this.$axios.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) { return }
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 获取总的页面
    handleSizeChange (newPageSize) {
      this.querInfo.pagesize = newPageSize
      // 获取后重新获取数据
      this._getGoodsList()
    },
    // 单前点击的页数
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this._getGoodsList()
    },
    // 显示添加分类对话框
    async showAddClassIfy () {
      const { data: res } = await this.$axios.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) { return this.$message.error('获取父级分类数据失败') }
      // 赋值 和显示对话框
      this.parClassIfyList = res.data
      this.addClassIfyDialogVisible = !this.addClassIfyDialogVisible
    },
    // 选择多级选择框是触发这个函数
    parClassIfyChange () {
      // 如果selectId 中有长度说明选中了父级分类
      if (this.selectId.length > 0) {
        // 父分类的id
        this.addClassIfyList.cat_pid = this.selectId[this.selectId.length - 1]
        this.addClassIfyList.cat_level = this.selectId.length
      } else {
        this.addClassIfyList.cat_pid = 0
        this.addClassIfyList.cat_level = 0
      }
    },
    // 确认按钮添加分类
    addClassIfy () {
      this.$refs.addClassIfyRolesRef.validate(async (val) => {
        if (!val) { return }
        const { data: res } = await this.$axios.post('categories', this.addClassIfyList)
        if (res.meta.status !== 201) { return this.$message.error('创建失败') }

        this.$message.success(res.meta.msg)
        this._getGoodsList()
        this.addClassIfyDialogVisible = !this.addClassIfyDialogVisible
      })
    },
    // 关闭对话框时清除表中的校验数据
    addClassIfyDialogClose () {
      this.$refs.addClassIfyRolesRef.resetFields()
      // 因为关闭他时里面的数据就用不到了 所以复原
      this.selectId = []
      this.addClassIfyList.cat_pid = 0
      this.addClassIfyList.cat_level = 0
    },
    // 删除分类
    async delClassIfy (id) {
      const confirmId = await this.$confirm('是否真的删除用户？', '提示是否删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmId !== 'confirm') { return }
      const { data: res } = await this.$axios.delete('categories/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除分类失败') }

      this.$message({ message: '删除分类成功', type: 'success' })
      // 获取用户列表
      this._getGoodsList()
    },
    // 在展开编辑某个分类 之前的获取数据
    async updataClassIfy (id) {
      const { data: res } = await this.$axios.get('categories/' + id)

      // 获取用户失败
      if (res.meta.status !== 200) { return this.$message.error('获取失败') }

      // 获取用户成功
      this.classIfyNameList = res.data
      this.updataClassIfyDialogVisible = !this.updataClassIfyDialogVisible
    },

    // 编辑并修改某个分类
    async saveClassIfy () {
      const { cat_id: id, cat_name: name } = this.classIfyNameList
      console.log(this.classIfyNameList.cat_name)
      const { data: res } = await this.$axios.put('categories/' + id,
        { cat_name: name })
      // 走这里说明添加用户不成功
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }

      // 走这里说明添加用户成功 并给用户提示 并关闭对话框
      this.$message.success('更新分类成功')
      // 关闭对话框
      this.updataClassIfyDialogVisible = !this.updataClassIfyDialogVisible
      // 获取用户列表
      this._getGoodsList()
    }
  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.treeTable {
  margin: 16px 0;
}
.el-icon-i {
  font-size: 14px;
}
.el-cascader {
  width: 100%;
}
</style>
