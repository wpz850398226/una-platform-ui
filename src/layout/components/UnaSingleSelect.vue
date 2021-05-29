<!-- my-component.vue -->
<template>
  <div class="una-single-select">
    <el-select
      v-model="selectedValue"
      :placeholder="field.annotation"
      filterable
      style="width: 100%;"
      @change="callFather"
    >
      <el-option
        v-for="item in optionList"
        :key="item.id"
        :label="item[field.optionNameFieldCode]"
        :value="item[field.optionValueFieldCode]"
      />
    </el-select>
  </div>
</template>
<script>
import { chGet } from '../../api/index'
export default {
  name: 'UnaSingleSelect',
  props: ['field', 'model'],
  data() {
    return {
      optionList: [],
      selectedValue: this.model
    }
  },
  mounted() {
    this.queryOptions(this.field)
  },
  methods: {
    async queryOptions(field) {
      console.log(field.optionNameFieldCode, field.optionValueFieldCode, 'selecttttttttttttt')
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
      }
      const result = await chGet(field.optionEntityPath + '/list', obj)
      this.optionList = result.data
    },
    callFather: function() {
      // 发射信号
      console.log(this.selectedValue)
      this.$emit('getCalled', this.selectedValue)
      // 其中 getCalled 是一个自定义的事件，功能类似于一个中转
    }
  }
}
</script>
