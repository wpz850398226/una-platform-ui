<template>
  <div class="login-container">
    <div class="login-inner">

      <form ref="form" class="login-form" :model="passForm">
        <div class="form-item">
          <input v-model="passForm.username" placeholder="用户名" type="text">
          <div v-if="errors['passForm.username']" class="error">{{ errors['passForm.username'] }}</div>
        </div>
        <div class="form-item" style="margin-top: 5px;">
          <input v-model="passForm.password" placeholder="密码" type="password" @keyup.enter="passLogin">
          <div v-if="errors['passForm.password']" class="error">{{ errors['passForm.password'] }}</div>
        </div>

        <el-button
          class="subBtn"
          :loading="loading"
          type="primary"
          @click.native.prevent="passLogin"
        >登 录</el-button>
      </form>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuerify from 'vuerify'
Vue.use(Vuerify)

export default {
  name: 'Login',
  data() {
    return {
      passForm: {
        username: 'admin',
        password: '123456'
      },
      fastClick: true,
      loading: false,
      scaleStyle: ''
    }
  },
  vuerify: {
    'passForm.username': {
      test: /\w{1,}/,
      message: '请输入用户名'
    },
    'passForm.password': {
      test: /\w{1,}/,
      message: '请输入密码'
    }
  },
  computed: {
    // 计算属性，获取校验不通过的对象
    // 如 { "form.name": "至少 4 位字符", "form.desc": "至少 10 位字符" }
    errors() {
      return this.$vuerify.$errors
    }
  },
  mounted() {
  },
  methods: {
    passLogin() {
      const verifyList = ['passForm.username', 'passForm.password']
      // check() 校验所有规则，参数可以设置需要校验的数组
      if (!this.$vuerify.check(verifyList)) {
        return
      } else {
        this.loading = true
        this.$store
          .dispatch('user/login', this.passForm)
          .then(() => {
            console.log('密码校验成功')
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
  /*height: 1080px;
  width: 1920px;
  background: url('../../assets/login/loginBack.jpg') no-repeat center;
  background-size: 100%;*/

  .login-inner {
    position: absolute;
    left: 339px;
    height: 846px;
    top: 117px;
    width: 1242px;
    background-size: 100%;
    background-repeat: no-repeat;

    .login-form {
      margin-left:  730px;
      margin-top: 290px;
    }

    .form-item {
      input {
        width: calc(100% - 50px);
        border: 1px;
        font-size: 20px;
        height: 40px;
        margin-top: 35px;
        text-indent: 10px;
        outline: none;
      }
      input::-webkit-input-placeholder {
        color: #666;
      }
      .error {
        margin-left: 15px;
        color: #ee0000;
        font-size: 14px;
      }

    }

    .forgetPass {
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      color: #999;
    }

    .subBtn {
      margin-top: 50px;
      margin-left: 130px;
      background: linear-gradient(90deg, #2d90dd, #2160d5);
      width: 140px;
      height: 50px;
      border-radius: 30px;
      display: block;
      border: none;
      color: #fff;
      font-size: 20px;
      outline: none;
      cursor: pointer;
    }
  }
}

</style>
