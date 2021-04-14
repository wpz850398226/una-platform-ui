<template>
  <div class="dashboard-container">
    <img class="welcome" src="../../assets/welcome.png" alt="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name'
      // 'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    width: 100%;
    .welcome {
      display: block;
      width: 100%;
      height: auto;
    }
  }
</style>
