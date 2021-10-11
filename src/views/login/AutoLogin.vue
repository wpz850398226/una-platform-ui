<template>
  <div>
    自动登录中...
  </div>
</template>

<script>
export default {
  name: 'AutoLogin',
  mounted() {
    const { token } = this.$route.query
    if (token) {
      this.$store
        .dispatch('user/autoLogin', token)
        .then(() => {
          this.$router.push({ path: '/' })
        })
        .catch(() => {
        })
    } else {
      this.$router.push({ path: '/login' })
    }
    console.log(token)
  }
}
</script>
