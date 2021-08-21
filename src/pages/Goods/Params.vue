<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                show-icon
                :closable='false'
                type="warning">
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row>
        <el-col>
          <!--options 用来指定数据源 props 用来指定配置对象 multiple:true,checkStrictly:true-->
          <!-- value: 选中的值, label: '所看到的值', children: '父子节点的下一级' v-model: 可以存储选中的Id 值-->
          <span>选择商品分类: </span>&nbsp;
          <el-cascader v-model="selectdParamsId"
                       :options="goodsParamsList"
                       :clearable='true'
                       :filterable='true'
                       show-all-levels
                       :props="{ expandTrigger: 'hover',value: 'cat_id', label: 'cat_name', children: 'children' }"
                       @change="handleParamsChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <!-- v-model 绑定值，选中选项卡的 name  tab-click：tab 被选中时触发 -->
      <el-tabs v-model="tabParmaName"
               @tab-click="tabParmahandleClick">
        <!-- 动态参数区域 -->
        <el-tab-pane label="动态参数"
                     class="tabPane"
                     name="many">
          <el-button type="primary"
                     size="small "
                     :disabled="isBtnBisabled"
                     @click="addParams">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="categoryParams"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 Tags 标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close='handleClose(index,scope.row)'
                        closable>{{item}}</el-tag>
                <!-- 渲染输入框和 tag标签 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showUpadataDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="delParamOrAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <!-- 静态属性区域 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     size="small "
                     :disabled="isBtnBisabled"
                     @click="addAttr">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="categoryParams"
                    border
                    stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 Tags 标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close='handleClose(index,scope.row)'
                        closable>{{item}}</el-tag>
                <!-- 渲染输入框和 tag标签 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"
                             label="#"></el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="showUpadataDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="delParamOrAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态参数和静态属性对话框 -->
    <el-dialog :title="dialogTitle"
               :visible.sync="addParamsDialogVisible"
               width="50%"
               @close="addParamsDialogClose">
      <!-- 输入框 -->
      <el-form ref="addParamsRef"
               :model="addFrom"
               label-width="auto"
               :rules="addParamsRules">
        <el-form-item :label="fromLabel"
                      prop='attr_name'>
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveParamOrAttr">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="dialogTitle"
               :visible.sync="updataParamsDialogVisible"
               width="50%"
               @close="updataParamsDialogClose">
      <!-- 输入框 -->
      <el-form ref="updataParamsRef"
               :model="addFrom"
               label-width="auto"
               :rules="addParamsRules">
        <el-form-item :label="fromLabel"
                      prop='attr_name'>
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="updataParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updataParamOrAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Params',
  data () {
    return {
      // 级联选择器的数据
      goodsParamsList: [], // 保存商品分类的数据
      selectdParamsId: [], // 层级选择框选中的值id

      // 选中选择框后获取到参数表格的数据
      categoryParams: [],

      // tab 页签区域
      tabParmaName: 'many',

      // 动态参数和静态属性对话框

      dialogTitle: '添加动态参数', // 动态对话框标题
      addParamsDialogVisible: false, // 添加参数属性对话框的显示隐藏
      fromLabel: '动态参数',
      addParamsRules: {
        attr_name: [
          { required: true, message: '此项不能为空', trigger: 'blur' }
        ]
      },
      // 添加参数的表单数据对象
      addFrom: {
        attr_name: ''
      },

      // 修改参数对话框
      updataParamsDialogVisible: false, // 修改参数属性对话框的显示隐藏
      attrId: null // 用户保存当前修改属性或参数的id值

    }
  },
  mounted () {
    this._getCateList()
  },

  methods: {
    // 获取分类商品数据  级联选择器
    async _getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) { return }
      this.goodsParamsList = res.data
    },
    // // 选择多级选择框是触发这个函数
    async handleParamsChange () {
      // 选中选择框获取数据
      this._getParamsData()
    },

    // tab 被点击时触发
    tabParmahandleClick () {
      // 点击面板后还能获取数据
      this._getParamsData()
    },

    // 获取参数表格
    async _getParamsData () {
      // 选中的不是第三级
      if (this.selectdParamsId.length !== 3) {
        this.selectdParamsId = []
        this.categoryParams = []
        return
      }
      // 选中的是第三级的数据
      // 根据所选中的id和选择的面板，获取对应的数据
      const { cateId, tabParmaName } = this
      const { data: res } = await this.$axios.get(`categories/${cateId}/attributes`, { params: { sel: tabParmaName } })
      if (res.meta.status !== 200) { return }

      // attr_vals 拆分为每一个单独的个体，变成数组在赋值给参数列表
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      this.categoryParams = res.data
    },
    // 展开添加属性对话框
    addAttr () {
      this.fromLabel = '静态属性'
      this.dialogTitle = '添加静态属性'
      this.addParamsDialogVisible = !this.addParamsDialogVisible
    },
    // 展开动态参数对话框
    addParams () {
      this.fromLabel = '动态参数'
      this.dialogTitle = '添加动态参数'
      this.addParamsDialogVisible = !this.addParamsDialogVisible
    },
    // 关闭对话框时清除表中的校验数据
    addParamsDialogClose () {
      this.$refs.addParamsRef.resetFields()
    },
    updataParamsDialogClose () {
      this.attrId = null
      this.$refs.updataParamsRef.resetFields()
    },
    // 动态参数和静态属性的提交
    saveParamOrAttr () {
      this.$refs.addParamsRef.validate(async (val) => {
        if (!val) { return }
        const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`,
          { attr_name: this.addFrom.attr_name, attr_sel: this.tabParmaName })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.addParamsDialogVisible = !this.addParamsDialogVisible
        this._getParamsData()
      })
    },
    // 点击按钮，展示修改对话框
    async showUpadataDialog (attrId) {
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.tabParmaName } })

      this.addFrom.attr_name = res.data.attr_name
      this.attrId = res.data.attr_id

      this.fromLabel = this.tabParmaName === 'many' ? '动态参数' : '静态属性'
      this.dialogTitle = this.tabParmaName === 'many' ? '修改动态参数' : '修改静态属性'
      this.updataParamsDialogVisible = !this.updataParamsDialogVisible
    },
    // 提交修改的参数或属性
    updataParamOrAttr () {
      this.$refs.updataParamsRef.validate(async (val) => {
        if (!val) { return }
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.attrId}`,
          { attr_name: this.addFrom.attr_name, attr_sel: this.tabParmaName })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.updataParamsDialogVisible = !this.updataParamsDialogVisible
        this._getParamsData()
      })
    },

    // 点击删除属性或分类
    async delParamOrAttr (attrId) {
      const confirmId = await this.$confirm('此操作将永久删除该参数/属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消了删除
      if (confirmId !== 'confirm') { return }

      //  走这里说明确认删除了
      const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this._getParamsData()
    },

    // tag 输入框输入完成后调用的函数
    handleInputConfirm (scope) {
      // 走这里说明没有值，不做提交
      if (scope.inputValue.trim().length === 0) {
        scope.inputValue = ''
        scope.inputVisible = false
        return
      }
      // 没有return 出去 说明有值要做数据添加操作

      //  新添加的参数
      scope.attr_vals.push(scope.inputValue.trim())
      // 重置数据
      scope.inputValue = ''
      scope.inputVisible = false

      // 发起请求添加到数据库中
      this.saveAttrsVal(scope)
    },

    // 参数属性添加到数据库中
    async saveAttrsVal (scope) {
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${scope.attr_id}`,
        { attr_name: scope.attr_name, attr_sel: scope.attr_sel, attr_vals: scope.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('修改参数项成功')
    },
    // 点击tag按钮
    showInput (scope) {
      scope.inputVisible = true
      /*
      $nextTick 的作用
        就是当页面上的元素重新渲染之后，
        才会调用指定回调函数中的代码
       */
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除Tag参数
    handleClose (i, scope) {
      // 在数组中删除然后更新数据库就行
      scope.attr_vals.splice(i, 1)
      // 更新数据
      this.saveAttrsVal(scope)
    }
  },
  computed: {
    // 计算添加按钮是否启用
    isBtnBisabled () {
      return this.selectdParamsId.length !== 3
    },
    // 返回分类id
    cateId () {
      return this.selectdParamsId.length === 3 ? this.selectdParamsId[2] : 'null'
    }
  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-row {
  margin: 20px 0;
  font-size: 14px;
  font-weight: bold;
}
.el-tag {
  margin: 5px 10px;
}
.tabPane {
  font-size: 12px;
  font-weight: bold;
}
.el-button {
  margin-bottom: 18px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
</style>
