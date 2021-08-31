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
  watch: {
    imgUrl() {
      this.initImages()
    }
  },
  mounted() {
    this.initImages()
  },
  methods: {
    initImages() {
      if (this.imgUrl) {
        this.images = this.imgUrl.split(',')
      }
    }
  }
}
</script>
