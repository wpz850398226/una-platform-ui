<template>
  <div class="app-container">
    <div class="flex justify-between padding-xs">
      <div class="flex align-center">
        <div style="width: 90px;">企业名称</div>
        <!-- <el-input v-model="queryForm.companyName" placeholder="请输入企业名称" /> -->

        <el-autocomplete
          v-model="queryForm.companyName"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入企业名称"
          :trigger-on-focus="false"
          value-key="name"
          @select="handleSelect"
        />

      </div>
      <div>
        <el-cascader
          v-model="queryForm.industryDcode"
          class="margin-right-xs"
          :options="industryList"
          :props="dicProps"
        />
        <el-button type="primary" @click="goSearch">搜索</el-button>
        <el-button @click="backSearch">重置</el-button>
      </div>
      <!-- <div class="flex align-center  margin-left margin-right-xs">
        <div style="width: 90px;">企业类型</div>
        <el-input v-model="queryForm.companyName" placeholder="请输入企业类型" />
      </div> -->

    </div>
    <ClientArea search-bar>
      <div slot="content" style="height:100%">

        <div id="amap-container" class="amap-container" />

      </div>
    </ClientArea>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import { findDictionaryList } from '@/utils/find-dictionary.js'
import AMapLoader from '@amap/amap-jsapi-loader'

import { companyList } from '@/api/una/sys_company'

export default {
  name: 'MapQuery',
  components: {
    ClientArea
  },
  data() {
    return {
      amapObj: '',
      mapObj: '',
      queryForm: {
        companyName: '',
        industryDcode: []
      },
      companyList: [],
      dicProps: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      industryList: []
    }
  },
  mounted() {
    this.initAmap()
    this.industryList = findDictionaryList('industry')
    this.industryList = this.cleanEmptyChildren(this.industryList)
  },
  methods: {
    querySearch(queryString, cb) {
      cb(this.companyList.filter(v => v.name.indexOf(queryString) !== -1))
    },
    handleSelect(e) {
      if (e.coord) {
        const sp = e.coord.split(',')
        if (sp.length === 2) {
          this.mapObj.setZoomAndCenter(18, [sp[0], sp[1]])
        }
      }
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
        this.getCompanyList()

        // map.on('click', (e) => {
        //   const { lnglat } = e
        //   this.lng = lnglat.getLng()
        //   this.lat = lnglat.getLat()
        //   this.selVal = `${this.lng},${this.lat}`
        //   this.updateVal(`${this.lng},${this.lat}`)
        //   // geocoder.getAddress(lnglat, (status, result) => {
        //   //   if (status === 'complete' && result.regeocode) {
        //   //     const address = result.regeocode.formattedAddress
        //   //     this.busCompanyForm.addr = address
        //   //   } else {
        //   //     this.busCompanyForm.addr = '根据经纬度查询地址失败'
        //   //   }
        //   // })
        // })
        this.mapObj = map
      }).catch(e => {

      })
    },
    getCompanyList() {
      companyList().then(res => {
        this.companyList = res
        res.forEach(v => {
          if (v.coord) {
            const sp = v.coord.split(',')
            if (sp.length === 2) {
              const marker = new this.amapObj.Marker({
                title: v.name,
                position: new this.amapObj.LngLat(sp[0], sp[1]) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              })
              const textMarker = new this.amapObj.Text({
                text: v.name,
                anchor: 'center', // 设置文本标记锚点
                position: new this.amapObj.LngLat(sp[0], sp[1]) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              })
              this.mapObj.add(textMarker)
              this.mapObj.add(marker)
            }
          }
        })
      })
    },
    goSearch() {
      this.mapObj.clearMap()
      this.companyList.filter(m => m.industryDcode === this.queryForm.industryDcode[2]).forEach(v => {
        if (v.coord) {
          const sp = v.coord.split(',')
          if (sp.length === 2) {
            const marker = new this.amapObj.Marker({
              title: v.name,
              position: new this.amapObj.LngLat(sp[0], sp[1]) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            })
            const textMarker = new this.amapObj.Text({
              text: v.name,
              anchor: 'center', // 设置文本标记锚点
              position: new this.amapObj.LngLat(sp[0], sp[1]) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            })
            this.mapObj.add(textMarker)
            this.mapObj.add(marker)
          }
        }
      })
    },
    backSearch() {
      this.mapObj.clearMap()
      this.getCompanyList()
    },
    cleanEmptyChildren(list) {
      list.forEach(k => {
        if (k.children && k.children.length > 0) {
          this.cleanEmptyChildren(k.children)
        } else {
          k.children = ''
        }
      })
      return list
    }

  }

}
</script>

<style>
  .amap-container {
    height: 100%;
    width: 100%;
  }
</style>
