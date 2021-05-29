<template>
  <div class="cke">
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" @ready="onReady" />
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
// import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import MyUploadAdapter from './upload'

export default {
  name: 'CKEditor',
  components: {
    ckeditor: CKEditor.component
  },
  model: {
    prop: 'content', // 指向props的参数名
    event: 'change'// 事件名称
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: 'bbb',
      editorConfig: {
        removePlugins: ['MediaEmbed'], // 除去视频按钮
        language: 'zh-cn', // 中文包
        ckfinder: {
          uploaded: 1,
          url: '/api/jyteam/sysFile/upload'
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        },
        toolbar:
        [
          'heading', // 段落
          '|', // 分隔
          'bold', // 加粗
          'italic', // 倾斜
          'link', // 超链接
          'bulletedList', // 项目列表
          'numberedList', // 编号列表
          'blockQuote', // 块引用
          'undo', // 撤销
          'redo', // 重做
          'imageStyle:full', // 图片通栏显示
          'imageStyle:side', // 图片侧边显示
          'imageTextAlternative', // 更换图片替换文本
          'imageUpload' // 插入图像
        ] // 工具栏显示
      }
    }
  },
  watch: {
    content(value) {
      this.editorData = value
    },
    editorData(value) {
      this.$emit('change', value)
    }
  },
  mounted() {
    //
    // this.editorData = this.content
  },
  methods: {
    change() {

    },
    onReady(editor) {
      // 自定义上传图片插件
      this.editorData = this.content
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new MyUploadAdapter(loader)
      }
    }
  }
}
</script>

<style>
.ck-content { height:400px; }
</style>
