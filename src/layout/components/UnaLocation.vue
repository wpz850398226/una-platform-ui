<template>
  <div>
    <div>{{ selVal }}</div>
    <el-button type="primary" @click="openMap">打开地图选点</el-button>

    <el-dialog title="地图选点" fullscreen :visible.sync="mapDialogVisible" :append-to-body="true">

      <div class="flex justify-between">
        <div class="flex align-center margin-bottom-sm">
          <div class="margin-right-sm">经度:{{ lng }}</div>
          <div class="margin-right-sm">纬度:{{ lat }}</div>
          <el-button type="primary" size="medium" @click="mapDialogVisible = false">确认选择</el-button>
          <!-- <div class="margin-right-sm">地址:{{ busCompanyForm.addr }}</div> -->
        </div>
        <el-autocomplete
          v-model="amapSearchText"
          :fetch-suggestions="querySearchAsync"
          placeholder="输入关键字搜索"
          @select="handleAreaSelect"
        />
      </div>
      <div id="amap-container" class="amap-container" />
    </el-dialog>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default {
  name: 'UnaLocation',
  model: {
    prop: 'value',
    event: 'updateVal'
  },
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

    this.selVal = this.value
    if (this.selVal) {
      const sp = this.selVal.split(',')

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
        map.on('click', (e) => {
          const { lnglat } = e
          this.lng = lnglat.getLng()
          this.lat = lnglat.getLat()
          this.selVal = `${this.lng},${this.lat}`
          this.updateVal(`${this.lng},${this.lat}`)
          // geocoder.getAddress(lnglat, (status, result) => {
          //   if (status === 'complete' && result.regeocode) {
          //     const address = result.regeocode.formattedAddress
          //     this.busCompanyForm.addr = address
          //   } else {
          //     this.busCompanyForm.addr = '根据经纬度查询地址失败'
          //   }
          // })
        })
        this.mapObj = map
      }).catch(e => {

      })
    },
    querySearchAsync(keywords, cb) {
      this.amapObj.plugin(['AMap.PlaceSearch'], () => {
        const placeSearch = new this.amapObj.PlaceSearch({
          map: this.mapObj
        }) // 构造地点查询类
        placeSearch.search(keywords, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据

          if (result.info === 'OK') {
            cb(result.poiList.pois.map((d) => {
              return {
                value: d.name,
                location: d.location
              }
            }))
          } else {
            cb([])
          }
        })
      })
    },
    handleAreaSelect(e) {
      this.mapObj.setZoomAndCenter(16, [e.location.lng, e.location.lat])
    },
    updateVal(e) {

      this.$emit('updateVal', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .amap-container {
    height: 70vh;
    width: 100%;
  }
</style>
