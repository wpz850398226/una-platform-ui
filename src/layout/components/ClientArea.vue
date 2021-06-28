<script>
export default {
  props: {
    searchBar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      customStyle: '',
      show: false
    }
  },
  mounted() {
    const that = this
    this.pageResize()
    window.onresize = () => {
      // 调用methods中的事件
      that.pageResize()
    }
  },
  methods: {
    pageResize() {
      this.show = false
      const hk = document.documentElement.clientHeight - 85 - (this.searchBar ? 60 : 0)
      this.customStyle = `height: ${hk}px; width: 100%`
      this.show = true
      //
    }
  },
  render(h, context) {
    return (
      <el-card class='box-card' shadow='never' style={this.customStyle} v-show={this.show}>
        {h('div', this.$slots.content)}
      </el-card>
    )
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    height: 100%;
    width: 100%;
    div {
      height: 100%;
    }
  }
</style>
