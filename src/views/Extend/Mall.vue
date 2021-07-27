<template>
  <div class="app-container">
    <el-dialog
      title="商品新增/修改"
      :visible.sync="defaultFormDialogVisible"
      width="550px"
      :append-to-body="true"
      fullscreen
    >

      <div class="btn-ctl">
        <el-button type="primary" size="medium" @click="saveData">保存</el-button>
      </div>
      <el-tabs
        v-model="activeName"
        class="el-tab-ctl"
        style="height: 100%;"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="基本" name="base">
          <el-form label-width="80px">
            <h3>基本信息</h3>
            <el-divider />
            <div class="flex">
              <el-form-item label="商品名称" prop="name" class="basis-lg">
                <el-input v-model="dataForm.name" placeholder="请输入商品名称" />
              </el-form-item>
              <el-form-item label="单位" prop="unitDcode">
                <UnaDicSelect v-model="dataForm.unitDcode" placeholder="请选择单位" parent-code="measureUnit" />
              </el-form-item>
            </div>
            <el-form-item label="商品全称" class="basis-lg" prop="fullName">
              <el-input v-model="dataForm.fullName" placeholder="请输入商品全称" />
            </el-form-item>

            <h3>商品信息</h3>
            <el-divider />
            <el-form-item label="行业" prop="industryDcode">
              <el-cascader
                v-model="dataForm.industryDcode"
                :options="industryList"
                :props="dicProps"
                @change="industryChange"
              />
            </el-form-item>
            <el-form-item label="状态" prop="statusDcode">
              <el-select v-model="dataForm.statusDcode" placeholder="请选择状态">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="商品图片" prop="fileId">

              <una-entity-select
                v-model="dataForm.fileId"
                multiple
                :field="{optionEntityId: '100020'}"
              />

            </el-form-item>

            <h3>价格</h3>
            <el-divider />
            <el-form-item label="运费" prop="freightPrice">
              <el-input v-model="dataForm.freightPrice" type="number" placeholder="请输入运费" />
            </el-form-item>
            <el-form-item label="免运费额" prop="freeFreightPrice">
              <el-input v-model="dataForm.freeFreightPrice" type="number" placeholder="订单总价超过多少可以免运费" />
            </el-form-item>
            <el-form-item label="平台价" prop="sellingPrice">
              <el-input v-model="dataForm.sellingPrice" type="number" placeholder="请输入平台价" />
            </el-form-item>
            <el-form-item label="批发价" prop="wholesalePrice">
              <el-input v-model="dataForm.wholesalePrice" type="number" placeholder="请输入批发价" />
            </el-form-item>
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="dataForm.costPrice" type="number" placeholder="请输入成本价" />
            </el-form-item>
            <el-form-item label="最低限价" prop="floorPrice">
              <el-input v-model="dataForm.floorPrice" type="number" placeholder="请输入最低限价" />
            </el-form-item>
            <el-form-item label="最高限价" prop="ceilingPrice">
              <el-input v-model="dataForm.ceilingPrice" type="number" placeholder="请输入最高限价" />
            </el-form-item>

            <h3>商品属性</h3>
            <el-divider />
            <el-form-item label="所在地">
              <!-- <el-cascader
                v-model="dataForm.fullName"
                :options="options"
              /> -->

              <el-cascader
                v-model="dataForm.areas"
                placeholder="请选择省市区(县)"
                style="width: 200px;"
                size="large"
                :options="areaOptions"
                @change="updateAreaData"
              />

            </el-form-item>
            <el-form-item label="其他">
              <el-checkbox v-model="dataForm.isPayOnDelivery" label="货到付款" :true-label="1" :false-label="0" />
              <el-checkbox v-model="dataForm.isAuthenticGuaranteed" label="正品保证" :true-label="1" :false-label="0" />
              <el-checkbox v-model="dataForm.isExchangeInSeven" label="7天无理由退还" :true-label="1" :false-label="0" />
              <el-checkbox v-model="dataForm.isInvoice" label="发票" :true-label="1" :false-label="0" />
              <el-checkbox v-model="dataForm.isRepair" label="保修" :true-label="1" :false-label="0" />
            </el-form-item>

            <el-form-item label="上架" prop="isAdded">
              <el-radio-group v-model="dataForm.isAdded">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <div v-permission="'CpGoods:audit'">
              <h3>审核</h3>
              <el-divider />
              <el-form-item label="审核" prop="isAudit">
                <el-radio-group v-model="dataForm.isAudit">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="0">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="规格" name="specs">
          <el-form label-width="80px">
            <h3>库存</h3>
            <el-divider />
            <el-form-item label="已出售数" prop="sales">
              <el-input v-model="dataForm.sales" placeholder="请输入已出售数" />
            </el-form-item>
            <el-form-item label="库存" prop="inventory">
              <div class="flex">
                <el-input v-model="dataForm.inventory" placeholder="请输入库存" />
                <div class="margin-left">
                  <el-checkbox v-model="dataForm.isShowInventory" :true-label="1" :false-label="0">显示库存</el-checkbox>
                </div>
              </div>
              <span style="font-size: 12px;color: #909399;">商品的剩余数量，如启用多规格，则此处设置无效</span>
            </el-form-item>

            <h3>规格</h3>
            <el-divider />
            <div class="margin-left-lg">
              <el-checkbox v-model="dataForm.isSpecification" :true-label="1" :false-label="0">启用商品规格</el-checkbox>
            </div>
            <div class="margin-left-lg padding-left">
              <span style="font-size: 12px;color: #909399;">启用商品规格后，商品的价格及库存以商品规格为准，库存设置为0则会到“已售罄”中，-1为不限制</span>
            </div>
            <el-alert
              class="margin-top"
              title="提示!"
              type="warning"
              show-icon
              :closable="false"
            >
              <div>
                <div>1.点击升序按钮可调整规格显示顺序，更改规格及规格项后请点击下方的【刷新规格项目表】来更新数据。</div>
                <div>2.每一种规格代表不同型号，例如颜色为一种规格，如果设置多规格，必须每一种规格都选择一个规格项，才能添加购物车购买。</div>
              </div>
            </el-alert>
            <div v-if="dataForm.isSpecification" class="margin-bottom margin-top">
              <div v-for="(item, index) in specificationList" :key="index">
                <div class="flex">
                  <el-input v-model="item.key" class="margin-right" placeholder="请输入规格类型" />
                  <el-button type="primary" @click="addAttr(index)">添加规格属性</el-button>
                  <el-button type="danger" @click="delSpecification(index)">删除规格</el-button>
                </div>
                <div class="flex margin-top-xs">
                  <div v-for="(attr, aid) in item.attrs" :key="'aid'+aid" class="margin-right-sm">
                    <el-input
                      v-model="specificationList[index].attrs[aid]"
                      placeholder="请输入规格属性"
                    >
                      <el-button slot="append" icon="el-icon-delete" @click="delAttr(index,aid)" />
                    </el-input>
                  </div>
                </div>
                <el-divider />
              </div>
              <div class="flex">
                <el-button type="primary" @click="addSpecification()">添加规格</el-button>
                <el-button type="warning" @click="refreshSpecification()">刷新商品规格列表</el-button>
              </div>

              <div class="margin-top-sm">
                <table>
                  <tr>
                    <td v-for="(item,index) in specificationList" :key="index">{{ item.key }}</td>
                    <td>
                      <div class="price-label">库存</div>
                    </td>
                    <td>
                      <div class="price-label">批发价</div>
                    </td>
                    <td>
                      <div class="price-label">成本价</div>
                    </td>
                    <td>
                      <div class="price-label">最低限价</div>
                    </td>
                    <td>
                      <div class="price-label">最高限价</div>
                    </td>
                    <td>
                      <div class="price-label">含税市场价</div>
                    </td>
                    <td>
                      <div class="price-label">不含税市场价</div>
                    </td>
                  </tr>

                  <!-- 快速填充 -->
                  <tr>
                    <td v-for="(item,index) in specificationList" :key="index" />
                    <td>
                      <el-input v-model="fastInput.inventory">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('inventory')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.wholesalePrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('wholesalePrice')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.costPrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('costPrice')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.floorPrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('floorPrice')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.ceilingPrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('ceilingPrice')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.taxInclusiveMarketPrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('taxInclusiveMarketPrice')" />
                      </el-input>
                    </td>
                    <td>
                      <el-input v-model="fastInput.taxExclusiveMarketPrice">
                        <el-button slot="append" icon="el-icon-bottom" @click="goFastInput('taxExclusiveMarketPrice')" />
                      </el-input>
                    </td>
                  </tr>

                  <tr v-for="(item,index) in specificationTableData" :key="index">
                    <td v-for="(attr,aid) in item.attrs" :key="'aid'+aid" class="attr-key">
                      <div>{{ attr }}</div>
                    </td>
                    <td>
                      <el-input v-model="item.inventory" placeholder="库存" />
                    </td>
                    <td>
                      <el-input v-model="item.wholesalePrice" placeholder="批发价" />
                    </td>
                    <td>
                      <el-input v-model="item.costPrice" placeholder="成本价" />
                    </td>
                    <td>
                      <el-input v-model="item.floorPrice" placeholder="最低限价" />
                    </td>
                    <td>
                      <el-input v-model="item.ceilingPrice" placeholder="最高限价" />
                    </td>
                    <td>
                      <el-input v-model="item.taxInclusiveMarketPrice" placeholder="含税市场价" />
                    </td>
                    <td>
                      <el-input v-model="item.taxExclusiveMarketPrice" placeholder="不含税市场价" />
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div style="height: 200px" />

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="参数" name="parameter">
          <el-form label-width="80px">
            <h3>参数</h3>
            <el-divider />
            <el-button type="primary" size="medium" @click="addParam">添加参数</el-button>
            <div class="flex  margin-top">
              <div class="basis-xs">参数名</div>
              <div class="basis-lg margin-left-sm">参数值</div>
            </div>
            <div
              v-for="(item,index) in keyParams"
              :key="index"
              class="flex margin-top-xs"
            >
              <div class="basis-xs">
                <el-input v-model="item.key" placeholder="请输入参数名" />
              </div>
              <div class="basis-lg margin-left-sm">
                <el-input v-model="item.value" placeholder="请输入参数值" />
              </div>
            </div>
          </el-form>
          <div style="height: 100px" />
        </el-tab-pane>
        <el-tab-pane label="描述" name="desc">
          <el-form label-width="80px">
            <h3>商品详情</h3>
            <el-divider />
            <el-form-item label="详情" prop="content">
              <CkEditor v-model="dataForm.content" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>

    <ClientArea>
      <div v-if="entity" slot="content" style="height:100%">
        <una-table
          ref="tableController"
          :entity="entity"
          selectable
          multiple
          @showAddDialog="showAddDialog"
          @tableRowEdit="handleEdit"
          @tableRowDelete="handleDelete"
          @tableRowSortUp="handleUp"
        />
      </div>
    </ClientArea>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
import UnaTable from '../Base/components/UnaTable.vue'
import UnaUpload from '@/layout/components/UnaUpload.vue'
import CkEditor from '@/components/CKEditor/index.vue'
import UnaDicSelect from '@/layout/components/UnaDicSelect.vue'
import UnaEntitySelect from '@/layout/components/UnaEntitySelect.vue'
import { entityList } from '@/api/una/sys_entity'
import { getEntity } from '@/utils/una/entity-util.js'
import { jsonPost } from '@/api/index'
import { findDictionaryList } from '@/utils/find-dictionary.js'
import { chPut, chDelete, chGet, chPost } from '../../api/index'
import { regionData } from 'element-china-area-data'
import permission from '@/directive/permission/index.js' // 权限判断指令

const defaultForm = {
  code: '', // 编号
  fullName: '', // 全称
  unitDcode: '', // 单位
  sales: '', // 已销售量
  shopId: '', // 所属店铺id
  industryDecode: [], // 行业数组
  primaryIndustryDcode: '', // 所属一级行业编码
  secondryIndustryDcode: '', // 所属二级行业编码
  thirdryIndustryDcode: '', // 所属三级行业编码
  typeDcode: '', // 类型id
  statusDcode: '', // 产品状态id
  keyword: '', // 关键字
  introduction: '', // 商品简介
  description: '', // 描述
  content: '', // 内容
  regionId: '', // 所属区域id
  areas: [],
  provinceRegionId: '', // 所属省份id
  cityRegionId: '', // 所属城市id
  areaRegionId: '', // 所属区域id
  isStick: '', // 是否置顶
  isHot: '', // 是否热门
  isAdded: 1, // 是否上架
  isAudit: '', // 是否已审核
  viewAmount: '', // 浏览次数
  collectAmount: '', // 收藏数量
  commentAmount: '', // 评论数量
  averageScore: '', // 平均评分
  adderId: '', // 上架人id
  // addedTime: '', // 上架时间
  inventory: '', // 库存
  isShowInventory: '', // 是否显示库存
  isSpecification: '', // 是否启用规格
  isInventoryReduce: '', // 减库存方式
  isPayOnDelivery: '', // 是否支持货到付款
  isAuthenticGuaranteed: '', // 是否正品保证
  isExchangeInSeven: '', // 是否支持7天无理由退换
  isInvoice: '', // 是否可开发票
  isRepair: '', // 是否可保修
  sellingPrice: '', // 销售价，标价
  costPrice: '', // 成本价
  ceilingPrice: '', // 最高限价
  floorPrice: '', // 最低限价
  wholesalePrice: '', // 批发售价
  taxInclusiveMarketPrice: '', // 含税市场价
  taxExclusiveMarketPrice: '', // 不含税市场价
  goodsParam: '',
  // refreshTime: '', // 刷新时间
  // stickDeadline: '', // 置顶截止时间
  fileId: '', // 商品图片
  companyId: '', // 所属组织id
  departmentId: '', // 所属部门id
  specificationList: [], // 规格列表
  goodsAttributeList: [], // 规格属性列表
  freightPrice: '', // 运费
  freeFreightPrice: '' // 免运费最小额
}

export default {
  name: 'Mall',
  components: {
    ClientArea, CkEditor, UnaUpload, UnaTable, UnaDicSelect,
    UnaEntitySelect
  },
  directives: { permission },
  data() {
    return {
      entity: '',
      activeName: 'base',
      dataForm: defaultForm,
      defaultFormDialogVisible: false,
      options: [],
      specificationList: [
        // {
        //   key: '颜色',
        //   attrs: ['白色', '绿色', '红色']
        // }
      ], // 规格配置
      specificationTableData: [],
      fastInput: {
        inventory: '', // 库存
        wholesalePrice: '', // 批发售价
        costPrice: '', // 成本价
        ceilingPrice: '', // 最高限价
        floorPrice: '', // 最低限价
        taxInclusiveMarketPrice: '', // 含税市场价
        taxExclusiveMarketPrice: '' // 不含税市场价
      },
      keyParams: [{
        key: '',
        value: ''
      }],
      loading: false,
      dicProps: {
        label: 'name',
        value: 'code',
        children: 'children'
      },
      industryList: [], // 行业类型

      // 表格业务
      dataQuery: {},
      // 表格业务
      areaOptions: regionData
    }
  },
  mounted() {
    this.entity = getEntity(this.$route.meta.code)
    // entityList(1, 1, { code: 'CpGoods' }).then((res) => {
    //   if (res.data.length > 0) {
    //     this.entity = res.data[0]
    //   }
    // })
    this.industryList = findDictionaryList('industry')
    this.industryList = this.cleanEmptyChildren(this.industryList)
    console.log(this.industryList, ';')
    // industry
  },
  methods: {

    // 表格业务操作
    showAddDialog() {
      this.defaultFormDialogVisible = true
      this.keyParams = []
      this.specificationList = []
      this.specificationTableData = []
      this.dataForm = { ...this.defaultForm }
      this.dataForm.isAdded = 1
    },
    handleEdit(e) {
      this.dataForm = e

      // 处理参数回显
      console.log(e, '参数')
      this.keyParams = []
      if (e.goodsParam) {
        Object.keys(e.goodsParam).forEach(k => {
          this.keyParams.push({
            key: k,
            value: e.goodsParam[k]
          })
        })
      }

      // 处理参数回显

      // 处理规格回显
      this.specificationList = []
      e.specificationList.forEach(item => {
        this.specificationList.push({
          key: item.name,
          attrs: item.attributeNames.split(',')
        })
      })
      // 处理规格回显

      // 处理规格表格回显
      this.specificationTableData = []
      e.goodsAttributeList.forEach(item => {
        this.specificationTableData.push(
          {
            attrs: item.name.split(','),
            // attributeNames: v.join(','),
            name: item.name,
            inventory: item.inventory, // 库存
            wholesalePrice: item.wholesalePrice, // 批发售价
            costPrice: item.costPrice, // 成本价
            ceilingPrice: item.ceilingPrice, // 最高限价
            floorPrice: item.floorPrice, // 最低限价
            taxInclusiveMarketPrice: item.taxInclusiveMarketPrice, // 含税市场价
            taxExclusiveMarketPrice: item.taxExclusiveMarketPrice // 不含税市场价
          }
        )
      })
      // 处理规格表格回显

      this.defaultFormDialogVisible = true
    },
    updateTableData() {
      this.$refs.tableController.getPublicList()
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        chDelete(this.entity.path + `/${e.id}`).then((resolve) => {
          this.$message.success('删除成功!')
          this.updateTableData()
        })
      })
    },
    handleUp(e) {},
    // 表格业务操作
    industryChange(e) {
      this.dataForm.primaryIndustryDcode = e[0] // 所属一级行业编码
      this.dataForm.secondryIndustryDcode = e[1]// 所属二级行业编码
      this.dataForm.thirdryIndustryDcode = e[2]// 所属三级行业编码
      console.log(e)
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
    },
    handleClick() {},
    addAttr(i) {
      this.specificationList[i].attrs.push('')
    },
    delAttr(pi, i) {
      this.specificationList[pi].attrs.splice(i, 1)
    },
    addSpecification() {
      this.specificationList.push({
        key: '治理',
        attrs: ['轻度', '中毒', '知名']
      })
    },
    delSpecification(e) {
      this.specificationList.splice(e, 1)
    },
    refreshSpecification() {
      // const sLength = 1
      // 空值清理

      this.specificationList.map(item => {
        for (let i = 0; i < item.attrs.length; i += 1) {
          if (item.attrs[i] === '') {
            item.attrs.splice(i, 1)
            i -= 1
          }
        }
        return item
      })

      const arr = []
      this.specificationList.forEach(k => {
        arr.push(k.attrs)
      })

      // const arr = [['a', 'b'], ['1', '2'], ['d']]
      let sarr = [[]]
      for (let i = 0; i < arr.length; i++) {
        const tarr = []
        for (let j = 0; j < sarr.length; j++) {
          for (let k = 0; k < arr[i].length; k++) { tarr.push(sarr[j].concat(arr[i][k])) }
        }
        sarr = tarr
      }
      console.log(sarr)
      this.specificationTableData = sarr.map((v, vi) => {
        console.log(this.specificationList, 'pppp')
        return {
          attrs: v,
          // attributeNames: v.join(','),
          name: v.join(','),
          inventory: '', // 库存
          wholesalePrice: '', // 批发售价
          costPrice: '', // 成本价
          ceilingPrice: '', // 最高限价
          floorPrice: '', // 最低限价
          taxInclusiveMarketPrice: '', // 含税市场价
          taxExclusiveMarketPrice: '' // 不含税市场价
        }
      })

      console.log(this.specificationTableData)
    },
    goFastInput(e) {
      this.specificationTableData.forEach((item, index) => {
        this.specificationTableData[index][e] = this.fastInput[e]
      })
    },
    saveData() {
      console.log(this.dataForm)
      // 处理参数goodsParam
      const map = {}
      this.keyParams.forEach(k => {
        map[k.key] = k.value
      })
      this.dataForm.goodsParam = map
      // 处理参数

      // 处理规格
      this.dataForm.specificationList = this.specificationList.map(v => {
        return {
          name: v.key,
          attributeNames: v.attrs.join(',')
        }
      })
      this.dataForm.goodsAttributeList = this.specificationTableData
      // 处理规格

      jsonPost(this.entity.path, this.dataForm).then((resolve) => {
        this.defaultFormDialogVisible = false
        this.$message.success('保存成功')
        this.$refs.tableController.getPublicList()
        // this.updateTableData(this.treeQuery)
        this.loading = false
      }, (e) => {
        this.loading = false
      })
    },
    addParam() {
      this.keyParams.push({
        key: '',
        value: ''
      })
    },
    updateAreaData(e) {
      this.dataForm.provinceRegionId = e[0]
      this.dataForm.cityRegionId = e[1]
      this.dataForm.areaRegionId = e[2]
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tab-ctl::v-deep .el-tabs__content {
    height: 100%;
    // overflow: scroll;
    padding-left: 20px;
    padding-right: 20px;
  }
  .attr-key {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price-label {
    font-size: 14px;
  }

   .btn-ctl {
     z-index: 2000;
     position: absolute;
     right: 20px;
  }
</style>
