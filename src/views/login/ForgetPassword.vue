<template>
  <div class="forget-container">
    <div class="forget-inner">
      <span class="back" @click="historyBack">返回</span>
      <img src="@/assets/other_images/logo_forget.png" class="logo">
      <div class="half">
        <div class="form-main">
          <form ref="form" :model="form">
            <div class="form-item mar-b-30">
              <label>手机号</label>
              <div class="form-item-r">
                <input v-model="form.telPhone" type="text">
                <span v-if="errors['form.telPhone']" class="error">{{ errors['form.telPhone'] }}</span>
              </div>
            </div>
            <div class="form-item mar-b-30">
              <label>验证码</label>
              <div class="form-item-r">
                <input v-model="form.code" type="text" class="s-input">
                <button v-show="countdown" type="button" class="yzm" @click="getCode">获取验证码</button>
                <button v-show="!countdown" type="button" class="yzm">{{ count }}秒重新获取</button>
                <span v-if="errors['form.code']" class="error">{{ errors['form.code'] }}</span>
              </div>
            </div>
            <div class="form-item mar-b-30">
              <label>新密码</label>
              <div class="form-item-r">
                <input v-model="form.writepwd" type="password">
                <span v-if="errors['form.writepwd']" class="error" style="bottom: -38px;">{{ errors['form.writepwd'] }}</span>
              </div>
            </div>
            <div class="form-item mar-b-30">
              <label>确认密码</label>
              <div class="form-item-r">
                <input v-model="form.pwdAgain" type="password">
                <span v-if="errors['form.pwdAgain']" class="error" style="bottom: -38px;">{{ errors['form.pwdAgain'] }}</span>
              </div>
            </div>
            <el-button
              class="subBtn"
              :loading="loading"
              type="primary"
              @click.native.prevent="onSubmit"
            >提 交</el-button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cryptoJs from 'crypto-js'
import Vue from 'vue'
import Vuerify from 'vuerify'
import * as userData from '../../api/user'
Vue.use(Vuerify)

export default {
  name: 'ForgetPassword',
  data() {
    return {
      countdown: true,
      count: '',
      timer: null,
      fastClick: true,

      form: {
        telPhone: '',
        writepwd: '',
        pwd: '',
        pwdAgain: '',
        userKey: '',
        code: ''
      },
      sendPhone: '',
      loading: false
    }
  },

  vuerify: {
    'form.telPhone': {
      test: /^1\d{10}$/,
      message: '请输入正确手机号'
    },
    'form.writepwd': {
      test: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,10}$/,
      message: '密码规则不符合，请保持最小6位最大10位及包含数字、大小写字母、特殊符号规则!'
    },
    'form.pwdAgain': {
      test: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,10}$/,
      message: '密码规则不符合，请保持最小6位最大10位及包含数字、大小写字母、特殊符号规则!'
    },

    'form.code': {
      test: /^\d{4}$/,
      message: '请输入4位数短信验证码'
    }
  },

  computed: {
    // 计算属性，获取校验不通过的对象
    // 如 { "form.name": "至少 4 位字符", "form.desc": "至少 10 位字符" }
    errors() {
      return this.$vuerify.$errors
    }
  },

  methods: {
    getCode() {
      const verifyList = ['form.telPhone']
      if (!this.$vuerify.check(verifyList)) {
        return
      }
      if (this.fastClick) {
        this.fastClick = false
        var phone = this.form.telPhone
        userData.addSendMsg(phone).then((res) => {
          this.sendPhone = phone
          this.$message.success('发送成功请注意查收')
          this.countdownDo()
        }).catch(() => {
          this.fastClick = true
        })
      }
    },

    countdownDo() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.countdown = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.countdown = true
            this.fastClick = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },

    onSubmit() {
      var that = this
      const verifyList = [
        'form.telPhone',
        'form.writepwd',
        'form.pwdAgain',
        'form.code'
      ]
      // check() 校验所有规则，参数可以设置需要校验的数组
      if (!this.$vuerify.check(verifyList)) {
        return
      } else if (this.form.telPhone !== this.sendPhone) {
        this.$message.error('请输入发送短信的手机号')
        return
      } else if (this.form.writepwd !== this.form.pwdAgain) {
        this.$message.error('密码不一致')
        return
      }

      userData.accessKey().then(response => {
        const { userkey } = response.data

        let passwordS = cryptoJs.enc.Utf8.parse(this.form.writepwd)
        const tokenKey = cryptoJs.enc.Utf8.parse(response.data.tokenkey)
        passwordS = cryptoJs.AES.encrypt(passwordS, tokenKey, {
          iv: tokenKey,
          mode: cryptoJs.mode.CBC,
          padding: cryptoJs.pad.Pkcs7
        }).toString()

        this.form.userKey = userkey
        this.form.pwd = passwordS
        this.loading = true
        userData.updatePwd(this.form).then((res) => {
          if (res.rel === true) {
            this.$message.success('修改密码成功')
            this.loading = false
            setTimeout(function() {
              that.historyBack()
            }, 1000)
          } else {
            this.$message.error(res.message)
          }
        }, (e) => {
          this.loading = false
        })
      })
    },

    historyBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.forget-container {
  box-sizing: border-box;
  height: 100vh;
  width: 100%;
  padding: 100px 130px;
  transition: 0.3s;
  background: url(../../assets/other_images/containerBg.png) no-repeat center;
  background-size: 100% 100%;
  .forget-inner {
    position: relative;
    background: url(../../assets/other_images/forgetBg.png) no-repeat center;
    background-size: cover;
    height: 100%;
    width: 100%;
    position: relative;
    min-width: 600px;
    min-height: 600px;
    overflow: auto;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.3);

    .back {
      position: absolute;
      right: 5%;
      font-size: 26px;
      top: 30px;
      background: url(../../assets/other_images/back.png) no-repeat left center;
      background-size: 17px;
      padding-left: 25px;
      cursor: pointer;
    }
    .logo {
      width: 45%;
      min-width: 400px;
    }
    .half {
      width: 60%;
      margin-left: 40%;
    }
    .form-main {
      width: 500px;
      margin: 100px auto 0;
      padding: 20px;

      h4 {
        font-size: 22px;
        text-align: center;
        margin: 0 0 40px;
        font-weight: normal;
      }
    }
    .mar-b-30 {
      margin-bottom: 30px;
    }

    .form-item {
      display: flex;
      position: relative;
      .form-item-r {
        border-bottom: 1px solid #666;
        width: calc(100% - 120px);
        display: flex;
      }

      .s-input {
        width: calc(100% - 120px);
      }
      .yzm {
        width: 120px;
        height: 36px;
        border: 1px solid #2160d5;
        background: #fff;
        color: #2160d5;
        outline: none;
        cursor: pointer;
      }

      label {
        width: 110px;
        text-align: right;
        height: 40px;
        color: #999;
        font-weight: normal;
        margin-right: 10px;
        line-height: 40px;
        font-size: 20px;
      }

      input {
        border: none;
        font-size: 20px;
        height: 40px;
        margin-bottom: 5px;
        text-indent: 10px;
        outline: none;
        background: transparent;
        width: 100%;
      }
      input::-webkit-input-placeholder {
        color: #666;
      }

      .error {
        position: absolute;
        left: 120px;
        bottom: -20px;
        color: #ee0000;
      }
    }

    .forgetPass {
      line-height: 40px;
    }

    .subBtn {
      background: linear-gradient(90deg, #2d90dd, #2160d5);
      width: 140px;
      margin: 60px auto 0;
      height: 60px;
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

@media screen and (max-width: 1024px) {
  .forget-container {
    padding: 50px 60px;

    .forget-inner {
      background: #fff;
      background-image: none;

      .half {
        width: 100%;
        margin-left: 0;
        margin-top: 50px;
      }
    }
  }
}
</style>
