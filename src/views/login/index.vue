<template>
  <div class="login-container">
    <div class="login-inner">
      <el-card>
        <div class="flex justify-center margin-bottom-sm">UNA后台交互设计系统</div>
        <form ref="form" class="login-form" :model="passForm">
          <div class="form-item">
            <el-input v-model="passForm.username" placeholder="用户名" type="text" />
          </div>
          <div class="form-item margin-top-xs">
            <el-input v-model="passForm.password" placeholder="密码" show-password @keyup.enter="passLogin" />
          </div>

          <div class="flex justify-between margin-top">
            <el-button
              type="success"
            >微信登录</el-button>

            <el-button
              :loading="loading"
              type="primary"
              @click.native.prevent="passLogin"
            >登 录</el-button>
          </div>
        </form>
      </el-card>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      passForm: {
        username: 'admin',
        password: '123456'
      },
      loading: false
    }
  },
  methods: {
    passLogin() {
      if (!this.passForm.username || !this.passForm.password) {
        this.$message.error('请输入用户名和密码')
        return
      } else {
        this.loading = true
        this.$store
          .dispatch('user/login', this.passForm)
          .then(() => {
            this.$router.push({ path: '/' })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('../../assets/login/loginBack.jpg');
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

</style>
