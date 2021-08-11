<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <div class="right-menu-item hover-effect"> {{ name }} ({{ username }})</div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar shape="square" :size="40" :src="chImg(avatar).url">
            <img src="../../assets/default.png">
          </el-avatar>

          <!-- <img v-if="avatar" :src="chImg(avatar).url" class="user-avatar">
          <img v-else src="../../assets/default.png" class="user-avatar"> -->
          <!-- +'?imageView2/1/w/80/h/80' -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="editInfo">资料修改</el-dropdown-item>
          <el-dropdown-item @click.native="changePwd">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      append-to-body
      title="编辑账户"
      :visible.sync="editUserDialogVisible"
      width="500px"
    >
      <el-form
        ref="userEditForm"
        :model="userForm"
        status-icon
        :rules="userFormRules"
        label-width="150px"
      >
        <el-form-item label="用户名" prop="username">
          <span>{{ userForm.username }}</span>
        </el-form-item>
        <el-form-item label="头像" prop="attr1">
          <div class="avatar avatar-uploader" @click="openAvatarBox">
            <img
              v-if="userForm.attr1"
              class="img"
              :src="chImg(userForm.attr1).url"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
          <avatarBox
            v-model="showAvatar"
            field="img"
            :width="300"
            :height="300"
            img-format="png"
            @crop-success="cropSuccess"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="telPhone">
          <el-input v-model="userForm.telPhone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="userForm.type" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="userForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUser('userEditForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码" append-to-body :show-close="false" :visible.sync="changePwdDialogVisible" width="400px">
      <el-alert class="margin-bottom" title="为保障账户安全，请保持最小6位最大10位及包含数字、大小写字母、特殊符号规则!" type="warning" />
      <el-form
        ref="pwdChangeForm"
        :model="pwdForm"
        status-icon
        :rules="userPwdRules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdForm.password" show-password maxlength="16" />
        </el-form-item>
        <el-form-item label="确认密码" prop="surepwd">
          <el-input v-model="pwdForm.surepwd" show-password maxlength="16" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeChangePwd">取 消</el-button>
        <el-button type="primary" @click="submitChangePwd('pwdChangeForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chImg } from '@/api/index'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import * as netData from '@/api/user'
import avatarBox from 'vue-image-crop-upload'
import { changePwd } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    avatarBox
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.isCellPhone(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!this.isEmail(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      changePwdDialogVisible: false,
      editUserDialogVisible: false,
      showAvatar: false,
      userForm: {
        id: '',
        name: '',
        attr1: '',
        password: '',
        telPhone: '',
        email: '',
        sex: '',
        type: '',
        status: '',
        description: ''
      },
      userFormRules: {
        attr1: [{ required: true, message: '请上传头像', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        telPhone: [{ required: true, validator: checkPhone, trigger: 'change' }],
        email: [{ required: true, validator: checkEmail, trigger: 'change' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }]
      },
      pwdForm: {
        id: '',
        password: '',
        surepwd: ''
      },
      userPwdRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'change' }],
        surepwd: [{ required: true, message: '请确认新密码', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'username',
      'userinfo'
    ])
  },
  mounted() {
    // this.isfirstLogin()
    this.pwdForm.id = this.userinfo.id
  },
  methods: {
    chImg,
    // isfirstLogin() {
    //   if (this.userinfo.firstLogin === '1') {
    //     this.$alert('首次登陆请修改密码', { close: () => {
    //       this.changePwd()
    //     }, showClose: false })
    //   }
    // },
    isCellPhone(val) {
      if (!/^1\d{10}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    isEmail(val) {
      if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('permission/resetPermission')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePwd() {
      this.changePwdDialogVisible = true
    },
    closeChangePwd() {
      this.changePwdDialogVisible = false
    },
    editInfo() {
      const userInfo = this.userinfo
      this.userForm = {
        id: userInfo.id,
        name: userInfo.name,
        username: userInfo.username,
        attr1: userInfo.attr1,
        password: userInfo.password,
        telPhone: userInfo.telPhone,
        email: userInfo.email,
        sex: userInfo.sex,
        type: userInfo.type,
        status: userInfo.status,
        description: userInfo.description
      }

      this.editUserDialogVisible = true
    },
    openAvatarBox() {
      this.showAvatar = true
    },
    cropSuccess(imageDataUrl, field) {
      this.userForm.attr1 = imageDataUrl
    },
    async submitEditUser(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          netData.editUser(this.userForm).then(async(resolve) => {
            this.editUserDialogVisible = false
            this.$message.success('修改成功')
            await this.$store.dispatch('user/getInfo')
          })
        }
      })
    },
    submitChangePwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.pwdForm.password === this.pwdForm.surepwd) {
            changePwd(this.pwdForm).then(res => {
              this.$message.success('修改成功')
              this.logout()
            })
          } else {
            this.$message.error('两次密码输入不一致')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      margin-left: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 4px;
   .img {
      display: block;
      height: 100%;
      width: 100%;
      border-radius: 4px;
    }
}

</style>
