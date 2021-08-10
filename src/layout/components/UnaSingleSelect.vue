<!-- my-component.vue -->
<template>
  <div class="una-single-select">
    <!-- ##{{ field.optionNameFieldCode }}##{{ field.optionValueFieldCode }}## -->
    <!-- {{ selVal }} -->
    <el-select
      v-model="selVal"
      :placeholder="field.annotation"
      filterable
      :multiple="multiple"
      style="width: 100%;"
      @change="updateVal"
    >
      <el-option
        v-for="item in optionList"
        :key="item.id"
        :label="field.optionNameFieldCode?item[field.optionNameFieldCode]: item['name']"
        :value="field.optionValueFieldCode?item[field.optionValueFieldCode]: item['id']"
      />
    </el-select>
  </div>
</template>
<script>
import { chGet } from '../../api/index'
export default {
  name: 'UnaSingleSelect',
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  props: {
    field: { required: true, type: Object },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    unionFieldValue: {
    },
    // eslint-disable-next-line vue/require-default-prop
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      optionList: [],
      selVal: ''
    }
  },
  watch: {
    unionFieldValue(o, n) {

      this.queryOptions(this.field)
      this.selVal = ''
    }
  },
  async mounted() {
    await this.queryOptions(this.field)



    if (this.value && !isNaN(parseInt(this.value, 10))) { // 尝试一次转换
      this.selVal = parseInt(this.value, 10)
    } else {
      this.selVal = this.value
    }



  },
  methods: {
    async queryOptions(field) {
      const optionName = field.optionParamName // 选项参数键
      const optionValue = this.unionFieldValue || field.optionParamValue // 选项参数值

      const obj = {}
      if (optionName && optionValue) {
        if (optionName.includes(',') && optionValue.includes(',')) { // 自定义数组了
          const optionNameArray = optionName.split(',')
          const optionValueArray = optionValue.split(',')
          optionNameArray.forEach((v, i) => {
            obj[v] = optionValueArray[i]
          })
        } else {
          obj[optionName] = optionValue
        }

      }
      if (field.optionEntityPath) {
        const userInfo = this.$store.getters.userinfo
        const dsdu = {}

        if (typeof optionValue === 'string' && optionValue.indexOf('$s') !== -1) {
          const k = optionValue.substring(3)

          if (Object.prototype.hasOwnProperty.call(this.rowData, k)) {
            dsdu[optionName] = this.rowData[k]
          }
        }

        if (typeof optionValue === 'string' && optionValue.indexOf('$u') !== -1) {
          const k = optionValue.substring(3)
          if (Object.prototype.hasOwnProperty.call(userInfo, k)) {
            dsdu[optionName] = userInfo[k]
          }
        }

        const result = await chGet(field.optionEntityPath + '/list', { ...obj, ...dsdu })
        this.optionList = result

      }
    },
    updateVal(e) {

      this.$emit('updateVal', e)
    }
  }
}
</script>
