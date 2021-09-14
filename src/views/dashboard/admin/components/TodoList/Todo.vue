<template>
  <li class="todo">
    <div class="view flex align-center justify-between padding-xs">
      <div>
        <span style="font-size: 14px;color: #409eff" v-text="todo.map.nodeName" />-<span style="font-size: 14px;" v-text="todo.map.instanceName" />
      </div>

      <el-button type="primary" size="mini" plain @click="toggleTodo(todo)">处理</el-button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Todo',
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  props: {
    todo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    toggleTodo(todo) {
      this.$emit('toggleTodo', todo)
    }
  }
}
</script>
