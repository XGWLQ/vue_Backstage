<template>
  <div>
    <el-button type="info"
               round
               @click="exit">退 出</el-button>
  </div>
</template>
<script>
export default {
  name: 'Home',
  methods: {
    exit () {
      // 清除token
      window.sessionStorage.clear()
      // 重定向到 登录页 '/login/
      this.$router.push('/login')
      this.$message({ message: '退出成功', type: 'info' })
    }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'></style>
