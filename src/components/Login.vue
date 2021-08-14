<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录头像区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png"
             alt="">
      </div>
      <!-- 登录框模块 -->
      <el-form :model="loginFrom"
               :rules="loginFromRules"
               ref="loginFromRef"
               class="login_from">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名"
                    v-model="loginFrom.username"
                    prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码"
                    v-model="loginFrom.password"
                    type="password"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="el_btns">
          <el-button type="primary"
                     @click="login">登 录</el-button>
          <el-button type="warning"
                     @click="reset">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      // 用户登录数据
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 用户数据校验
      loginFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 重置用户名和密码框
    reset () {
      this.$refs.loginFromRef.resetFields()
    },
    // 表单域验证
    login () {
      this.$refs.loginFromRef.validate(async (isValid) => {
        // 如果为假直接放返回
        if (!isValid) return
        // 真的就直接发请求
        const { data } = await this.$axios.post('login', this.loginFrom)
        console.log(data)
        if (data.meta.status !== 200) {
          this.$message.error({ message: '用户名或密码错误' })
        } else {
          this.$message({ message: data.meta.msg, type: 'success' })
          /*
          1、登录成功后 token 保存到 客户端的 sessionStorage 中
           1.1 只有登录才能访问别的Api 接口
           1.2 token 只应该在页面打开是才有用，所以应该保存到 sessionStorage 中
          2、页面转态到后台主业 /home
           */
          window.sessionStorage.setItem('token', data.data.token)
          this.$router.push('/home')
        }
      })
    }

  }
}
</script>
<style Lang="less" scoped>
.login_container {
  background-color: #2b4d6d;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  margin: auto;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* 一下方法也可以是他居中 */
  /* left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); */
}
.avater_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 8px #ddd;
  position: absolute;
  right: 34%;
  top: -25%;
  background-color: #fff;
}
.avater_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.el_btns {
  display: flex;
  justify-content: flex-end;
}
</style>
