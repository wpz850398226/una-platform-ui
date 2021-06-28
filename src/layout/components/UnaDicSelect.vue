<template>
  <div>
    @{{ selVal }}@
    <el-select
      v-model="selVal"
      :placeholder="placeholder"
      :filterable="filterable"
      :clearable="clearable"
      @change="updateVal"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.title"
        :value="item.code"
      />
    </el-select>
  </div>
</template>

<script>
import { findDictionaryList } from '@/utils/find-dictionary.js'

export default {
  name: 'UnaDicSelect',
  model: {
    prop: 'value',
    event: 'updateVal'
  },
  props: {
    parentCode: { type: String, required: true },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    }
  },
  data() {
    return {
      selVal: '',
      options: []
    }
  },
  mounted() {
    this.selVal = this.value
    this.options = findDictionaryList(this.parentCode)
  },
  methods: {
    updateVal(e) {
      this.$emit('updateVal', e)
    }
  }
}
</script>
