<!-- my-component.vue -->
<template>
  <div class="una-single-select">
    ##{{ field.optionNameFieldCode }}##{{ field.optionValueFieldCode }}##
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
      console.log('相连变了', o, n)
    }
  },
  mounted() {
    console.log(this.field, '检查')
    this.selVal = this.value
    this.queryOptions(this.field)
    console.log('卡看默认', this.unionFieldValue)
  },
  methods: {
    async queryOptions(field) {
      const optionName = field.optionParamName // 选项参数键
      const optionValue = this.unionFieldValue || field.optionParamValue
      const obj = {}
      if (optionName && optionValue) {
        if (optionName.includes(',') && optionValue.includes(',')) {
          const optionNameArray = optionName.split(',')
          const optionValueArray = optionValue.split(',')
          optionNameArray.forEach((v, i) => {
            obj[v] = optionValueArray[i]
          })
        } else {
          obj[optionName] = optionValue
        }
        console.log(obj, 'obj')
      }
      if (field.optionEntityPath) {
        const result = await chGet(field.optionEntityPath + '/list', obj)
        this.optionList = result
        console.log(this.optionList, 'asp')
      }
    },
    updateVal(e) {
      console.log(e)
      this.$emit('updateVal', e)
    }
  }
}
</script>
