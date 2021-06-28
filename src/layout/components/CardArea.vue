<script>
export default {
  render(h, context) {
    return (
      <div class='card-area'>
        <div class='scroll-area'>
          {h('div', this.$slots.content)}
        </div>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
  .card-area {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .scroll-area {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      overflow-x: scroll;
      // div:not(.una-fix-height) {
      //   height: 100%;
      // }
    }
  }
</style>
