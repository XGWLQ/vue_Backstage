<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert title="添加商品信息"
                show-icon
                center
                :closable="false"
                type="info">
      </el-alert>

      <!-- 进度条 步骤条 -->
      <el-steps :space="200"
                :active="activeIndex - 0"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 提交表单 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-position='top'
               label-width="80px">
        <!-- 标签页 -->
        <el-tabs :tab-position="'left'"
                 v-model="activeIndex"
                 :before-leave='beforeLeave'
                 @tab-click="tabClicked"
                 style="height: auto;">
          <el-tab-pane label="基本信息"
                       name='0'>
            <!-- 基本信息-->
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input type="number"
                        v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input type="number"
                        v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input type="number"
                        v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <!--options 用来指定数据源 props 用来指定配置对象 multiple:true,checkStrictly:true-->
              <!-- value: 选中的值, label: '所看到的值', children: '父子节点的下一级' v-model: 可以存储选中的Id 值-->
              <el-cascader v-model="addForm.goods_cat"
                           :options="goodsCateList"
                           show-all-levels
                           :props="cateProps"
                           @change="handleGoodChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name='1'>
            <!-- 渲染表单的item -->
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTableData"
                          :key="item.attr_id">
              <!-- 复选框项 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item"
                             border
                             v-for="(item,index) in item.attr_vals"
                             :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name='2'>
            <!-- 渲染表单的item -->
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTableData"
                          :key="item.attr_id">
              <!-- 复选框项 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item"
                             border
                             v-for="(item,index) in item.attr_vals"
                             :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name='3'>
            <!-- action 图片上传后台API的地址 -->
            <!-- on-preview 点击图片预览处理 on-remove 图片删除-->
            <!-- list-type 图片的展示方式 -->
            <el-upload :action="uploadURL"
                       :headers="headersObj"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       list-type="picture"
                       :on-success="handleSuccess">
              <el-button size="small"
                         type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name='4'>
            <!-- 富文本组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="addBtn"
                       type="primary"
                       @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览"
               :visible.sync="imgDialogVisible"
               width="50%">
      <img :src="imgagePath"
           class="PreViewImg">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'addGoods',
  data () {
    return {
      // 级联选择器的数据
      goodsCateList: [], // 保存商品分类的数据

      // 步骤条激活的 设置当前激活步骤
      activeIndex: '0',

      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的表单 验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'blur' }]
      },
      // 表单渲染数据Prop
      cateProps: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' },

      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      imgagePath: '',
      imgDialogVisible: false
    }
  },
  created () {
    this._getCateList()
  },
  methods: {
    // 获取分类商品数据  级联选择器
    async _getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) { return }
      this.goodsCateList = res.data
    },
    // 选择多级选择框是触发这个函数
    handleGoodChange () {
      // 选中选择框获取数据
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // 阻止标签页的切换
    // activeName 即将进入的页面 oldActiveName 即将离开的页面
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' &&
        this.addForm.goods_cat.length !== 3) {
        this.$message.warning('请先选择商品分类')
        return false
      }
    },
    // 点击页签进图tabs中
    tabClicked () {
      if (this.activeIndex === '1') {
        this.getParamsOrAttr('many', '动态参数', this.manyTableData)
      } else if (this.activeIndex === '2') {
        this.getParamsOrAttr('only', '静态属性', this.onlyTableData)
      }
    },

    // 获取动态参数还是静态属性分方法
    async getParamsOrAttr (param, text) {
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`,
        { params: { sel: param } })
      // 获取失败的走这里
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // attr_vals 拆分为每一个单独的个体，变成数组在赋值给参数列表
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      this.$message.success(text + '数据获取成功')
      if (param === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    // 图片预览处理
    handlePreview (file) {
      this.imgagePath = file.response.data.url
      this.imgDialogVisible = true
    },
    // 图片删除
    handleRemove (file) {
      // 1、获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2、从 pics 数组中找到这个图片对应索引值
      const pathIndex = this.addForm.pics.findIndex((x) => {
        return x.pic === filePath
      })
      // 3、调用 splice 方法，把图片信息从数组中移除
      this.addForm.pics.splice(pathIndex, 1)
      this.$message.success('图片移除成功')
    },
    // 图片上传成功的数组
    handleSuccess (response) {
      if (response.meta.status !== 200) {
        return this.$message.error(response.meta.msg)
      }
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      this.$message.success(response.meta.msg)
    },
    // 添加商品
    addGood () {
      this.$refs.addFormRef.validate(async (val) => {
        if (!val) {
          return this.$message.error('请填写对应的基本信息表单')
        }
        // 先深拷贝 from 拷贝提交对象
        const form = _.cloneDeep(this.addForm)
        // 层级选择器拆分
        form.goods_cat = form.goods_cat.join(',')

        //  拆分静态属性和动态参数
        this.manyTableData.forEach((item) => {
          const tempAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(tempAttr)
        })
        this.onlyTableData.forEach((item) => {
          const tempAttr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(tempAttr)
        })
        form.attrs = this.addForm.attrs
        // 调用接口添加商品
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('商品添加失败')
        }

        // 添加成功
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      return this.addForm.goods_cat[2]
    }
  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-tabs ::v-deep .el-form-item__label,
.el-tabs ::v-deep .el-tabs__content {
  font-size: 13px;
}
.el-form-item {
  margin-bottom: 14px;
}
.el-checkbox {
  margin: 0 7px 0 0 !important;
}
.PreViewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
