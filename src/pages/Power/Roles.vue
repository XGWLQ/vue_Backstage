<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色列表内容 -->
    <el-card>
      <!-- 添加角色列表区 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 渲染角色列表 -->
      <el-table :data="rolesLists"
                border
                stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="bottomBorder vsCenter"
                    :class="index1 === 0 ? 'topBorder':''"
                    v-for="(item1,index1) in scope.row.children"
                    :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRolesId(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row :class="index2 === 0 ? '':'topBorder'"
                        class="vsCenter"
                        v-for="(item2,index2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRolesId(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning"
                            closable
                            @close="removeRolesId(scope.row,item3.id)"
                            v-for="item3 in item2.children"
                            :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#"
                         type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="UpdataRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="delRoles(scope.row.id)">删除</el-button>
            <el-button size="mini"
                       type="warning"
                       icon="el-icon-setting"
                       @click="showSetRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色模块 -->
      <el-dialog title="添加角色"
                 :visible.sync="addRolesDialogVisible"
                 width="50%"
                 @close="addRolesDialogClose">
        <!-- 内容主体区  -->
        <el-form ref="addRolesRef"
                 :model="addRolesList"
                 :rules="addRolesRules"
                 label-width="80px">
          <el-form-item label="角色名字"
                        prop="roleName">
            <el-input v-model="addRolesList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRolesList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addRolesSure">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色模块 -->
      <el-dialog title="编辑角色"
                 :visible.sync="updataRolesDialogVisible"
                 width="50%"
                 @close="updataRolesDialogClose">
        <!-- 内容主体区  -->
        <el-form ref="updataRolesRef"
                 :model="updateRolesList"
                 :rules="addRolesRules"
                 label-width="80px">
          <el-form-item label="角色名字"
                        prop="roleName">
            <el-input v-model="updateRolesList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="updateRolesList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="updataRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updataRolesSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog title="编辑角色"
                 :visible.sync="showSetRightsVisible"
                 @close="clearShowSetRightdialog">
        <!-- 内容主体区  default-expand-all 默认展开 show-checkbox 可选框
                 node-key="id" 使用id 唯一值 props 数渲染的节点对象-->
        <el-tree :data="showSetRightsList"
                 ref="treeRef"
                 show-checkbox
                 node-key="id"
                 default-expand-all
                 :default-checked-keys="rightIdArr"
                 :props="treeProps">
        </el-tree>
        <!-- 底部按钮区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="showSetRightsVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="alltoRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesLists: [], // 获取用户权限列表
      addRolesList: { // 添加角色列表
        roleName: '',
        roleDesc: ''
      },
      showSetRightsList: [], // 获取用户权限列表
      updateRolesList: {}, // 编辑角色列表
      updataRolesDialogVisible: false, // 编辑角色模块是否显示
      addRolesDialogVisible: false, // 添加角色模块是否显示
      showSetRightsVisible: false, // 添加分配权限是否显示
      addRolesRules: { // 添加角色输入框的校验规则
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' }
        ]
      },
      treeProps: { // 树形组件渲染 props 的规则
        children: 'children',
        label: 'authName'
      },
      // 获取所有以有的三级权限的id值 数组
      rightIdArr: [],
      roleId: '' // 每一个点开权限的id
    }
  },
  created () {
    this._getRolesLists()
  },
  methods: {
    // 获取用户列表数据
    async _getRolesLists () {
      const { data: res } = await this.$axios.get('roles')
      // 获取失败
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表数据失败') }
      // 获取成功
      this.rolesLists = res.data
      this.$message.success('获取角色列表数据成功')
    },
    // 删除用户角色
    async delRoles (id) {
      const confirmId = await this.$confirm('是否删除改角色', '提示删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmId !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // 异步获取数据
      const { data: res } = await this.$axios.delete('roles/' + id)
      // 删除失败
      if (res.meta.status !== 200) { return this.$message.error('删除角色失败') }
      // 提示用户
      this.$message({ message: '删除角色成功', type: 'success' })
      // 获取用户列表
      this._getRolesLists()
    },
    // 重置表单对话框
    addRolesDialogClose () {
      this.$refs.addRolesRef.resetFields()
    },
    // 重置表单对话框
    updataRolesDialogClose () {
      this.$refs.updataRolesRef.resetFields()
    },
    // 显示 添加角色对话框
    showDialog () {
      this.addRolesDialogVisible = !this.addRolesDialogVisible
    },
    // 添加角色
    addRolesSure () {
      this.$refs.addRolesRef.validate(async (val) => {
        if (!val) { return }// 如果失败直接返回
        // 不走if 分支 说明成功了 可以执行添加操作
        const { data: res } = await this.$axios.post('roles', this.addRolesList)
        // 走这里说明添加用户不成功
        if (res.meta.status !== 201) { this.$message.error(res.meta.msg) }

        // 走这里说明添加用户成功 并给用户提示 并关闭对话框
        this.$message.success('添加角色成功')
        this.addRolesDialogVisible = false
        this._getRolesLists()
      })
    },
    // 根据id获取角色列表
    async UpdataRoles (id) {
      const { data: res } = await this.$axios.get('roles/' + id)
      // 获取失败
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表数据失败') }
      // 获取成功
      this.updateRolesList = res.data
      this.updataRolesDialogVisible = !this.updataRolesDialogVisible
    },
    // 提交编辑角色
    updataRolesSure () {
      this.$refs.updataRolesRef.validate(async (val) => {
        // 如果失败直接返回
        if (!val) { return }
        // 不走if 分支 说明成功了 可以执行添加操作
        const { roleId, roleName, roleDesc } = this.updateRolesList
        const { data: res } = await this.$axios.put('roles/' + roleId, { roleName, roleDesc })
        // 走这里说明添加用户不成功
        if (res.meta.status !== 201) { return this.$message.error(res.meta.msg) }

        // 走这里说明添加用户成功 并给用户提示 并关闭对话框
        this.$message.success('编辑角色成功')
        this.updataRolesDialogVisible = !this.updataRolesDialogVisible
        this._getRolesLists()
      })
    },
    // 等级id删除三级权限
    async removeRolesId (role, rightId) {
      // console.log(id)
      const confirmId = await this.$confirm('是否删除改权限', '提示是否删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmId !== 'confirm') { return this.$message.info('取消了删除！') }
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      // 走这里说明添加用户不成功
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      // 提示
      this.$message.success(res.meta.msg)
      // 重新赋值数据 为了每次删除数据重新获取
      // 直接吧服务器返回的数据赋值给热的 children 属性上
      // 防止整个列表的刷新
      role.children = res.data
      // this._getRolesLists()
    },

    // 展开分配权限对话框
    async showSetRightsDialog (roles) {
      this.roleId = roles.id // 为每一个展开的id 赋值
      const { data: res } = await this.$axios.get('rights/tree')
      // 获取失败
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表数据失败') }
      // 获取成功
      this.showSetRightsList = res.data
      this.$message.success('获取用户列表数据成功')
      // 打开时获取所有权限id然后渲染到页面
      this.getrightId(roles, this.rightIdArr)
      this.showSetRightsVisible = !this.showSetRightsVisible
    },
    // 获取所有以有的三级权限的id值 数组 递归
    getrightId (node, arr) {
      // 没有children 节点的 说明他是三级结点 保存里面的ID
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getrightId(item, arr)
      })
    },
    // 关闭权限对话框 和 清空权限id 数组
    clearShowSetRightdialog () {
      this.rightIdArr = []
    },
    // 点击为所有角色分配权限
    async alltoRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 拼接 逗号
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      // 获取失败
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败') }
      // 获取成功
      this.$message.success('分配权限成功')
      this._getRolesLists()
      this.showSetRightsVisible = !this.showSetRightsVisible
    }

  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 22px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-button {
  font-size: 12px;
}
.el-tag {
  margin: 7px;
  font-size: 12px;
}
.topBorder {
  border-top: 1px #eae8e8 solid;
}
.bottomBorder {
  border-bottom: 1px #eae8e8 solid;
}
.vsCenter {
  display: flex;
  align-items: center;
}
</style>
