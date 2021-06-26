<template>
  <div />
</template>

<script>

export default {
  name: 'UnaDicSelect',
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  props: {
    defaultValue: {
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    }
  },
  mounted() {
    const userInfo = this.$store.getters.userinfo
    console.log('用户信息', userInfo)
    if (this.defaultValue) {
      if (this.defaultValue.indexOf('$u') !== -1) {
        this.updateVal(userInfo[this.defaultValue.substring(3)])
      } else {
        this.updateVal(this.defaultValue)
      }
    } else {
      this.updateVal('')
    }
  },
  methods: {
    updateVal(e) {
      console.log(e)
      this.$emit('updateVal', e)
    }
  }
}
</script>
