<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table border
                :data="rightLists"
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column prop="authName"
                         label="权限名称"></el-table-column>
        <el-table-column prop="path"
                         label="路径"></el-table-column>
        <el-table-column prop="level"
                         label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success"
                    v-else-if="scope.row.level === '1'">二级权限</el-tag>
            <el-tag type="warning"
                    v-else>三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'Rights',
  data () {
    return {
      rightLists: [] // 获取用户权限列表
    }
  },
  created () {
    this._getRightLists()
  },
  methods: {
    // 获取用户列表数据
    async _getRightLists () {
      const { data: res } = await this.$axios.get('rights/list')
      // 获取失败
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表数据失败') }
      // 获取成功
      this.rightLists = res.data
      this.$message.success('获取用户列表数据成功')
    }
  }
}
</script>
<style Lang='less' scoped>
.el-card {
  margin-top: 22px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}
.el-card .el-table {
  font-size: 12px;
}
</style>
