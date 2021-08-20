<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card v-if="userInfo">
      <!-- 输入与搜索框 -->
      <el-row :gutter="25">
        <el-col :span="10">
          <el-input placeholder="请输入内容"
                    class="input-with-select"
                    v-model="userInfo.query"
                    clearable
                    @clear="_getUsetinfo">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="_getUsetinfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表表格 -->
      <el-table :data="userList"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="username"
                         label="姓名"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"></el-table-column>
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userUpState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row}} slot-scope="scope"-->
            <!-- 修改按钮 -->
            <el-tooltip effect="dark"
                        content="修改"
                        :enterable='false'
                        placement="top">
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle
                         size='small'
                         @click="UpdataUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark"
                        content="删除"
                        :enterable='false'
                        placement="top">
              <el-button type="danger"
                         icon="el-icon-delete"
                         circle
                         @click="Deluser(scope.row.id)"
                         size='small'></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark"
                        content="分配角色"
                        :enterable='false'
                        placement="top">
              <el-button type="warning"
                         icon="el-icon-setting"
                         circle
                         @click="addUserRight(scope.row)"
                         size='small'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页模块 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="userInfo.pagenum"
                     :page-sizes="[2, 4, 6, 8]"
                     :page-size="userInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户"
                 :visible.sync="showAddUserDialogVisible"
                 width="50%"
                 @close="addDialogClose">
        <!-- 内容主体区 -->
        <el-form :model="addUserList"
                 :rules="addUserRules"
                 ref="addUserRef"
                 label-width="70px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="addUserList.username"></el-input>
          </el-form-item>
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="addUserList.password"
                      type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="addUserList.email"></el-input>
          </el-form-item>
          <el-form-item label="手机名"
                        prop="mobile">
            <el-input v-model="addUserList.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="showAddUserDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addUserSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户"
                 :visible.sync="showUpdataUserDialogVisible"
                 width="50%"
                 @close="UpdataDialogClose">
        <!-- 内容主体区  -->
        <el-form ref="UpdataUserRef"
                 :model="UpdataUserList"
                 :rules="addUserRules"
                 label-width="70px">
          <el-form-item label="用户名">
            <el-input disabled
                      v-model="UpdataUserList.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="UpdataUserList.email"></el-input>
          </el-form-item>
          <el-form-item label="手机名"
                        prop="mobile">
            <el-input v-model="UpdataUserList.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="showUpdataUserDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updataUserSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色权限对话框 -->
      <el-dialog title="修改用户"
                 :visible.sync="showAddRoleDialogVisible"
                 @close="setRoleDialogClose"
                 width="50%">
        <div>
          <p>当前用户：{{userRolesInfo.username}}</p>
          <p>当前角色：{{userRolesInfo.role_name}}</p>
          <p>分配新角色：
            <!-- value : 记录到model里面的  label 我们直接看到的-->
            <el-select v-model="selectedRoleId"
                       placeholder="请选择">
              <el-option v-for="item in rolesLists"
                         :key="item.id"
                         :label="item.roleName"
                         :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="showAddRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="saveUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'User',
  created () {
    this._getUsetinfo()
  },
  data () {
    // 自定义邮箱和手机的校验规则
    var chackEmail = (rule, vaule, cd) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(vaule)) { // 如果通邮箱通过验证 则提示合法
        return cd() // 合法的邮箱
      }
      cd(new Error('请输入合法的邮箱'))
    }
    var chackMobile = (rule, vaule, cd) => {
      const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
      if (regMobile.test(vaule)) { // 如果通手机号通过验证 则提示合法
        return cd()
      }
      console.log(regMobile.test(vaule))
      cd(new Error('请输入合法的手机号'))
    }
    return {
      userList: [], // 用户列表数组
      userInfo: { // 获取用户列表的参数对象
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 2 // 获取总的页面数
      },
      total: 0, // 总用户列表页
      showAddUserDialogVisible: false, // 用来控制添加用户对话框的显示隐藏
      showUpdataUserDialogVisible: false, // 用来控制添加用户对话框的显示隐藏
      addUserList: { // 用户添加表单数据的收集
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      UpdataUserList: { // 用户添加表单数据的收集
      },
      addUserRules: { // 添加表单规则验证对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: chackEmail, trigger: 'blur' }

        ],
        mobile: [
          { required: true, message: '请输入手机名', trigger: 'blur' },
          { validator: chackMobile, trigger: 'blur' }
        ]
      },

      // 用来控制添加用户权限对话框的显示隐藏
      showAddRoleDialogVisible: false,
      userRolesInfo: {}, // 用户权限信息
      rolesLists: [], // 获取用户权限角色
      selectedRoleId: '' // 用来保存选择的用户角色
    }
  },
  methods: {
    // 初始化用户信息列表
    async _getUsetinfo () {
      const { data: res } = await this.$axios.get('users', { params: this.userInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 获取总的页面
    handleSizeChange (newPageSize) {
      this.userInfo.pagesize = newPageSize
      // 获取后重新获取数据
      this._getUsetinfo()
    },
    // 单前点击的页数
    handleCurrentChange (newPage) {
      this.userInfo.pagenum = newPage
      this._getUsetinfo()
    },
    // 用来修改添加用户对话框的显示隐藏
    addUser () {
      this.showAddUserDialogVisible = !this.showAddUserDialogVisible
    },
    // 修改用户状态
    async userUpState (userState) {
      const { data: res } = await this.$axios.put(`users/${userState.id}/state/${userState.mg_state}`)
      if (res.meta.status !== 200) { // 如果失败
        // 当前状态保存回来
        userState.mg_state = !userState.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 重置表单对话框
    addDialogClose () {
      this.$refs.addUserRef.resetFields()
    },
    // 重置修改表单对话框
    UpdataDialogClose () {
      this.$refs.UpdataUserRef.resetFields()
    },
    // 添加用户
    addUserSure () {
      this.$refs.addUserRef.validate(async (val) => {
        if (!val) { return } // 如果失败直接返回
        // 不走if 分支 说明成功了 可以执行添加操作
        const { data: res } = await this.$axios.post('users', this.addUserList)
        // 走这里说明添加用户不成功
        if (res.meta.status !== 201) { this.$message.error(res.meta.mes) }

        // 走这里说明添加用户成功 并给用户提示 并关闭对话框
        this.$message.success('添加用户成功')
        this.showAddUserDialogVisible = false
        this._getUsetinfo()
      })
    },
    // 修改用户
    async UpdataUser (id) {
      const { data: res } = await this.$axios.get('users/' + id)

      // 获取用户失败
      if (res.meta.status !== 200) { return this.$message.error(res.meta.mes) }

      // 获取用户成功
      this.UpdataUserList = res.data
      this.showUpdataUserDialogVisible = !this.showUpdataUserDialogVisible
    },
    // 修改用户
    updataUserSure () {
      this.$refs.UpdataUserRef.validate(async (val) => {
        if (!val) { return } // 如果失败直接返回
        // 不走if 分支 说明成功了 可以执行添加操作
        const { id, email, mobile } = this.UpdataUserList
        const { data: res } = await this.$axios.put('users/' + id, { email, mobile })
        // 走这里说明添加用户不成功
        if (res.meta.status !== 201) { return this.$message.error('更新用户信息失败') }

        // 走这里说明添加用户成功 并给用户提示 并关闭对话框
        this.$message.success('修改用户成功')
        // 关闭对话框
        this.showUpdataUserDialogVisible = false
        // 获取用户列表
        this._getUsetinfo()
      })
    },
    // 点击删除用户
    async Deluser (id) {
      const confirmId = await this.$confirm('是否真的删除用户？', '提示是否删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmId !== 'confirm') { return }
      const { data: res } = await this.$axios.delete('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除用户失败') }

      this.$message({ message: '删除用户成功', type: 'success' })
      // 获取用户列表
      this._getUsetinfo()
    },

    // 展开添加用户角色列表
    async addUserRight (userRolesInfo) {
      // 保存用户角色信息
      this.userRolesInfo = userRolesInfo

      // 在页面展开前获取用户全部角色
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesLists = res.data
      this.showAddRoleDialogVisible = !this.showAddRoleDialogVisible
    },
    // 保存用户新分配的角色
    async saveUserRole () {
      if (!this.selectedRoleId) { return this.$message.error('请选择要分配的角色') }
      // 在页面展开前获取用户全部角色
      const { data: res } = await this.$axios.put(`users/${this.userRolesInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('设置角色失败')
      }

      this.$message.success('更新角色成功')
      this._getUsetinfo()
      this.showAddRoleDialogVisible = !this.showAddRoleDialogVisible
    },
    // 保存后清空 selectedRoleId 防止下次再次打开有数据
    setRoleDialogClose () {
      this.selectedRoleId = ''
    }
  }
}
</script>
<style Lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-row {
  margin-bottom: 24px;
}
.el-table {
  margin-bottom: 23px;
}
</style>
