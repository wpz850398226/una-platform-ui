<!--
 * @Author: Cui
 * @Date: 2020-09-08 16:44:16
 * @LastEditTime: 2020-09-23 10:41:51
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/components/AppCard/index.vue
-->
<script>
import * as netData from '../../api/application'

export default {
  name: 'AppCard',
  data() {
    return {
      appList: [],
      activeName: ''
    }
  },
  mounted() {
    this.getAuthedAppList()
  },
  methods: {
    getAuthedAppList() {
      netData.authedAppList().then((resolve) => {
        this.appList = resolve.rows
        if (resolve.rows && resolve.rows.length > 0) {
          this.activeName = resolve.rows[0].appKey
          this.$emit('appCardReady', resolve.rows[0].appKey)
          return
        }
        this.$emit('appCardReady')
      })
    },
    setActiveName(e) {

    },
    tabChange(e) {
      this.activeName = e.name
      this.$emit('tabChange', e.name)
    }
  },
  render(h, context) {
    return (
      <el-card class='box-card' shadow='never'>
        <el-tabs tab-position='top' on-tab-click={ this.tabChange } v-model={this.activeName}>
          { this.appList.map((v, vi) => { return <el-tab-pane label={v.name} name={v.appKey}></el-tab-pane> }) }
        </el-tabs>
        {h('div', this.$slots.content)}
      </el-card>
    )
  }
}
</script>
