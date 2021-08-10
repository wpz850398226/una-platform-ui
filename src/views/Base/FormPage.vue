<template>
  <div class="app-container">
    <ClientArea v-if="entity">
      <div slot="content" style="height:100%; overflow-y:scroll;">
        <una-form ref="formController" validate-data-form :entity="entity" @saveSuccess="saveSuccess" />
      </div>
    </ClientArea>

    <div v-else>
      <ClientArea>
        <div slot="content" style="height:100%">
          页面未配置
        </div>
      </ClientArea>
    </div>

  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import { getEntity } from '@/utils/una/entity-util.js'
import { chGet } from '@/api/index'
import qs from 'query-string'

export default {
  name: 'FormPage',
  components: {
    ClientArea
  },
  data() {
    return {
      entity: ''
    }
  },
  mounted() {
    this.entity = getEntity(this.$route.meta.code)

    this.initData()
  },
  methods: {
    initData() {
      const query = this.$route.meta.query

      if (query) {
        const userInfo = this.$store.getters.userinfo
        const queryId = qs.parse(this.$route.meta.query).id
        let queryRealId = queryId
        if (queryId.indexOf('$u') !== -1) {
          const q = queryId.substring(3)
          if (Object.prototype.hasOwnProperty.call(userInfo, q)) {
            queryRealId = userInfo[q]
          }
        }

        chGet(`${this.entity.path}/${queryRealId}`
          // , {
          //   ...qs.parse(this.$route.meta.query),
          //   entityId: this.entity.id
          // }
        ).then(res => {
          this.$refs.formController.initForm({ ...res.data, id: queryRealId })
        })
      }
    },
    saveSuccess(e) {

    }
  }
}
</script>

<style lang="scss" scoped>
  .iframe-content {
    height: calc(100vh - 100px);
    width: 100%;
  }
</style>

