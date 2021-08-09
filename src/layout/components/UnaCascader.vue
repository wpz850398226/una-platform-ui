<!-- my-component.vue -->
<template>
  <div class="una-single-select">
    <!-- ##{{ field.optionNameFieldCode }}##{{ field.optionValueFieldCode }}## -->
    <!-- {{ selVal }} -->
    <el-cascader
      v-model="selVal"
      :options="optionList"
      :props="dicProps"
      @change="updateVal"
    />

    <!-- <el-select
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
    </el-select> -->
  </div>
</template>
<script>
import { findDictionaryList } from '@/utils/find-dictionary.js'

export default {
  name: 'UnaCascader',
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
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dicProps: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      optionList: [],
      selVal: []
    }
  },
  mounted() {
    console.log('联动', this.field.optionParamValue)
    this.optionList = findDictionaryList(this.field.optionParamValue)
    this.optionList = this.cleanEmptyChildren(this.optionList)

    // await this.queryOptions(this.field)

    // console.log(this.field, '检查')
    // console.log(this.value, '传过来的值', parseInt(this.value, 10))
    // if (this.value && parseInt(this.value, 10) !== 'NaN') { // 尝试一次转换
    //   this.selVal = parseInt(this.value, 10)
    // } else {
    //   this.selVal = this.value
    // }

    // console.log('已经选中', this.selVal)
    // console.log('卡看默认', this.unionFieldValue)
  },
  methods: {
    cleanEmptyChildren(list) {
      list.forEach(k => {
        if (k.children && k.children.length > 0) {
          this.cleanEmptyChildren(k.children)
        } else {
          k.children = ''
        }
      })
      return list
    },
    updateVal(e) {
      this.$emit('updateVal', e.join(','))
    }
  }
}
</script>
