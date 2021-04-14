<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  .input-with-select {
    .el-input-group__prepend {
      width: 100px;
      background-color: #ffffff;
    }
  }
  #app {
    background: url('assets/login/loginBack.jpg') no-repeat center;
    background-size: 100%;
  }
</style>
