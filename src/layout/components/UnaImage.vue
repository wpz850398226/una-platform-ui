<template>
  <div class="flex">
    <el-image
      v-for="(url,index) in images"
      :key="index"
      style="width: 100px; height: 100px"
      :src="url"
      fit="fill"
      :preview-src-list="images"
    />
  </div>
</template>

<script>

export default {
  name: 'UnaImage',

  props: {
    imgUrl: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      images: []
    }
  },
  mounted() {
    this.images = this.imgUrl.split(',')
  },
  methods: {

  }
}
</script>
