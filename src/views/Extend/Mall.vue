<template>
  <div class="app-container">
    <ClientArea>
      <div slot="content" style="height:100%">
        <el-tabs
          v-model="activeName"
          style="height: 100%;"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本" name="base">
            <el-form label-width="80px">
              <h3>基本信息</h3>
              <el-divider />
              <div class="flex">
                <el-form-item label="商品名称" class="basis-lg">
                  <el-input v-model="dataForm.name" placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="单位">
                  <el-input v-model="dataForm.unit" placeholder="请输入单位" />
                </el-form-item>
              </div>
              <el-form-item label="商品全称" class="basis-lg">
                <el-input v-model="dataForm.fullName" placeholder="请输入商品全称" />
              </el-form-item>

              <h3>商品信息</h3>
              <el-divider />
              <el-form-item label="行业">
                <el-cascader
                  v-model="dataForm.fullName"
                  :options="options"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="dataForm.value" placeholder="请选择状态">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="商品图片">
                实体选择器
              </el-form-item>

              <h3>价格</h3>
              <el-divider />
              <el-form-item label="平台价">
                <el-input v-model="dataForm.name" placeholder="请输入平台价" />
              </el-form-item>
              <el-form-item label="批发价">
                <el-input v-model="dataForm.name" placeholder="请输入平台价" />
              </el-form-item>
              <el-form-item label="成本价">
                <el-input v-model="dataForm.name" placeholder="请输入平台价" />
              </el-form-item>
              <el-form-item label="最低限价">
                <el-input v-model="dataForm.name" placeholder="请输入平台价" />
              </el-form-item>
              <el-form-item label="最高限价">
                <el-input v-model="dataForm.name" placeholder="请输入平台价" />
              </el-form-item>

              <h3>商品属性</h3>
              <el-divider />
              <el-form-item label="所在地">
                <el-cascader
                  v-model="dataForm.fullName"
                  :options="options"
                />
              </el-form-item>
              <el-form-item label="其他">
                <el-checkbox-group v-model="dataForm.checkList">
                  <el-checkbox label="货到付款" />
                  <el-checkbox label="正品保证" />
                  <el-checkbox label="7天无理由退还" />
                  <el-checkbox label="发票" />
                  <el-checkbox label="保修" />
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="上架">
                <el-radio-group v-model="dataForm.radio">
                  <el-radio :label="3">是</el-radio>
                  <el-radio :label="6">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <h3>审核</h3>
              <el-divider />
              <el-form-item label="审核">
                <el-radio-group v-model="dataForm.radio">
                  <el-radio :label="3">通过</el-radio>
                  <el-radio :label="6">不通过</el-radio>
                </el-radio-group>
              </el-form-item>

            </el-form>
          </el-tab-pane>
          <el-tab-pane label="规格" name="specs">
            <el-form label-width="80px">
              <h3>库存</h3>
              <el-divider />
              <el-form-item label="已出售数">
                <el-input v-model="dataForm.name" placeholder="请输入已出售数" />
              </el-form-item>
              <el-form-item label="库存">
                <div class="flex">
                  <el-input v-model="dataForm.name" placeholder="请输入库存" />
                  <div class="margin-left">
                    <el-checkbox v-model="dataForm.checked">显示库存</el-checkbox>
                  </div>
                </div>
                <span style="font-size: 12px;color: #909399;">商品的剩余数量，如启用多规格，则此处设置无效</span>
              </el-form-item>

              <h3>规格</h3>
              <el-divider />
              <div class="margin-left-lg">
                <el-checkbox v-model="dataForm.checked">启用商品规格</el-checkbox>
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
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="参数" name="parameter">
            <el-form label-width="80px">
              <h3>参数</h3>
              <el-divider />
              <el-button type="primary" size="medium">添加参数</el-button>
              <div class="flex  margin-top">
                <div class="basis-xs">参数名</div>
                <div class="basis-lg margin-left-sm">参数值</div>
              </div>
              <div class="flex margin-top">
                <div class="basis-xs">
                  <el-input v-model="dataForm.name" placeholder="请输入参数名" />
                </div>
                <div class="basis-lg margin-left-sm">
                  <el-input v-model="dataForm.name" placeholder="请输入参数值" />
                </div>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="描述" name="desc">
            <el-form label-width="80px">
              <h3>商品详情</h3>
              <el-divider />
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ClientArea>
  </div>
</template>

<script>
import ClientArea from '../../layout/components/ClientArea'
export default {
  name: 'DeviceTypeManage',
  components: {
    ClientArea
  },
  data() {
    return {
      activeName: '',
      dataForm: {},
      options: []
    }
  },
  mounted() {

  },
  methods: {
    handleClick() {}
  }

}
</script>

<style>
  .el-tabs__content {
    height: 100%;
    overflow: scroll;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
