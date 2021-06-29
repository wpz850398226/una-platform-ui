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
    field: { required: true },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      optionList: [],
      selVal: ''
    }
  },
  mounted() {
    console.log(this.field, '检查')
    this.selVal = this.value
    this.queryOptions(this.field)
  },
  methods: {
    async queryOptions(field) {
      const optionName = field.optionParamName
      const optionValue = field.optionParamValue
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
