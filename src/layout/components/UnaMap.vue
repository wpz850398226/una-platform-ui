<template>
  <div>
    {{ lng }}{{ lat }}
    <el-button type="primary" @click="openMap">查看地点</el-button>

    <el-dialog title="地图选点" fullscreen :visible.sync="mapDialogVisible" :append-to-body="true">

      <div class="flex justify-between">
        <div class="flex margin-bottom-sm">
          <div class="margin-right-sm">经度:{{ lng }}</div>
          <div class="margin-right-sm">纬度:{{ lat }}</div>
          <!-- <div class="margin-right-sm">地址:{{ busCompanyForm.addr }}</div> -->
        </div>
      </div>
      <div id="amap-container" class="amap-container" />
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'UnaLocation',
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    }
  },
  data() {
    return {
      selVal: '',
      mapDialogVisible: false,
      amapObj: '',
      mapObj: '',
      amapSearchText: '',
      lng: '',
      lat: ''
    }
  },
  mounted() {
    if (this.value) {
      const sp = this.value.split(',')
      this.lng = sp[0]
      this.lat = sp[1]
    }
  },
  methods: {
    openMap() {
      this.mapDialogVisible = true
      this.$nextTick(() => {
        this.initAmap()
      })
    },
    initAmap() {
      AMapLoader.load({
        'key': '4fa71851c3be1746fe6c47ba7dd0a444', // 申请好的Web端开发者Key，首次调用 load 时必填
        'version': '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        'plugins': ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.AutoComplete'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        'AMapUI': { // 是否加载 AMapUI，缺省不加载
          'version': '1.1', // AMapUI 缺省 1.1
          'plugins': [] // 需要加载的 AMapUI ui插件
        }
      }).then((AMap) => {
        this.amapObj = AMap
        const map = new AMap.Map('amap-container', {
          center: [114.515452, 38.046634]
        })
        // const geocoder = new AMap.Geocoder({
        //   // city: "010", //城市设为北京，默认：“全国”
        //   // radius: 1000 //范围，默认：500
        // })
        if (this.lng && this.lat) {
          const marker = new AMap.Marker({
            position: new AMap.LngLat(this.lng, this.lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          })
          map.add(marker)
          map.setCenter([this.lng, this.lat])
        }

        this.mapObj = map
      }).catch(e => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .amap-container {
    height: 75vh;
    width: 100%;
  }
</style>
