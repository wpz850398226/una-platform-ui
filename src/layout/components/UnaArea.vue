<template>
  <div>
    <el-cascader
      v-model="selVal"
      placeholder="请选择省市区(县)"
      style="width: 200px;"
      size="large"
      :options="areaOptions"
      @change="updateVal"
    />

  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'

export default {
  name: 'UnaArea',
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    }

  },
  data() {
    return {
      selVal: '',
      areaOptions: regionData
    }
  },
  mounted() {
    console.log(this.value)
    if (this.value) {
      const sp = this.value.split(',')
      this.selVal = sp
    } else {
      this.selVal = []
    }
  },
  methods: {
    updateVal(e) {
      this.$emit('updateVal', e.join(','))
    }
  }
}
</script>
