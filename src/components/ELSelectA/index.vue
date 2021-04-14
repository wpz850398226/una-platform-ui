<script>
import { Select, Option } from 'element-ui'

export default {
  name: 'ELSelectA',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    keys: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
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
      selValue: ''
    }
  },
  methods: {
    changeSel(value) {
      const row = this.options.filter(v => v[this.keys.value] === value)
      this.$emit('change', value, row[0])
    }
  },
  render(h, context) {
    this.selValue = this.value
    return (
      <Select v-model={this.selValue} multiple={this.multiple} on-change={this.changeSel} placeholder={this.placeholder} clearable={this.clearable} filterable={this.filterable} >
        { this.options.map((v, vi) => { return <Option label={v[this.keys.label]} value={v[this.keys.value]} key={vi}></Option> }) }
      </Select>
    )
  }
}
</script>
