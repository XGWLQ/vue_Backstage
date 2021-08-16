<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/heima.png"
             alt="">
        <span>电商管理后台系统</span>
      </div>
      <el-button type="info"
                 round
                 @click="exit">退 出</el-button>
    </el-header>
    <!-- 内容区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'"
                v-if="MenuList">
        <!-- 折叠与展开 -->
        <div class="toggle-button"
             @click="toggleCollapse">| | |</div>
        <!-- 侧边栏菜单 router开启路由模式，每点击一个菜单就是一个路由-->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#75BEFF"
                 unique-opened
                 :collapse='isCollapse'
                 :collapse-transition='false'
                 router
                 :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path"
                      v-for="(item,index) in MenuList"
                      :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i :class="useriCon[index]"></i>
              <!-- 一级菜单文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+key.path"
                          v-for="key in item.children"
                          :key="key.id"
                          @click="saveActivePath('/'+key.path)">
              <!-- 二级菜单模板区 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 二级菜单文本 -->
                <span>{{key.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      // 异步获取到的左侧菜单数据
      MenuList: [],
      // 动态生成图标
      useriCon: ['el-icon-user', 'el-icon-coin', 'el-icon-s-goods', 'el-icon-s-order', 'el-icon-s-platform'],
      // 是否展开与折叠
      isCollapse: false,
      // 保存高亮路径
      activePath: ''
    }
  },
  created () {
    this._getMeunList()
    // 一创建就读取sessionStorage 中保存的激活状态
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    // 退出按钮
    exit () {
      this.$confirm('是否登出？', '提示是否退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token
        window.sessionStorage.clear()
        // 重定向到 登录页 '/login/
        this.$router.push('/login')
        this.$message({ message: '退出成功', type: 'success' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消登出'
        })
      })
    },
    // 异步获取左侧菜单栏数据
    async _getMeunList () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status === 200) {
        this.MenuList = res.data
      } else {
        this.$message({ message: res.meta.msg, type: 'info' })
      }
    },
    // 折叠与展开菜单栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 在 sessionStorage 中保存左侧菜单激活转态的路由
    saveActivePath (active) {
      this.activePath = active
      window.sessionStorage.setItem('active', active)
    }
  }
}
</script>
<style Lang='less' scoped>
.home-container {
  height: 100%;
}
/* 头部样式 */
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div > span {
  margin-left: 15px;
  color: #fff;
  font-size: 20px;
}
.el-menu {
  border-right: none;
}

.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #edeaf1;
}
.toggle-button {
  background-color: #485161;
  line-height: 20px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
</style>
