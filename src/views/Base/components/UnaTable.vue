<template>
  <div class="Table">
    <el-card v-if="tableReady" class="box-content" shadow="never">
      <div class="flex margin-bottom-xs">
        <el-popover placement="left-start" title="列筛选" trigger="click">
          <el-checkbox-group v-model="checkList" @change="columnFilter">
            <el-checkbox v-for="(item, index) in fieldList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <el-button slot="reference" title="列筛选" size="mini"><i class="el-icon-menu" /></el-button>
        </el-popover>

      </div>
      <el-row :gutter="10">
        <el-col v-if="selectable" :span="3">
          <el-button
            icon="el-icon-finished"
            size="small"
            type="success"
            @click="submitSelect"
          >确认选中</el-button>
        </el-col>

        <el-col v-for="(item,index) in entity.queryList" :key="index" :span="8" class="flex">
          <div class="flex align-center">
            <div class="margin-right-xs" style="min-width: 50px;">{{ item.name }}</div>
            <el-input
              v-if="item.assignmentModeDcode === 'field_query_exactText' ||
                item.assignmentModeDcode === 'field_query_fuzzyText'"
              v-model="queryFields[item.fieldCode]"
            />
            <el-switch
              v-else-if="item.assignmentModeDcode === 'field_query_switch'"
              v-model="queryFields[item.fieldCode]"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
            <una-single-select
              v-else-if="item.assignmentModeDcode === 'field_query_singleselect'"
              v-model="queryFields[item.fieldCode]"
              :field="item"
            />
            <el-date-picker
              v-else-if="item.assignmentModeDcode === 'field_query_geDate'"
              v-model="queryFields[item.fieldCode]"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              format="yyyy-MM-dd"
              clearable
            />
            <el-date-picker
              v-else-if="item.assignmentModeDcode === 'field_query_leDate'"
              v-model="queryFields[item.fieldCode]"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
              format="yyyy-MM-dd"
              clearable
            />
          </div>

        </el-col>

        <el-col v-if="entity.queryList.length>0" :span="3">
          <el-button size="small" type="primary" @click="goQuery">搜索</el-button>
          <el-button size="small" type="primary" @click="resetQuery">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button size="small" type="primary" @click="showAddDialog">添加{{ entity.name }}</el-button>
        </el-col>
      </el-row>

      <el-table
        border
        :data="tableData"
        style="width: 100%; margin-top: 10px;"
        height="70%"
        @selection-change="selectionChange"
      >
        <el-table-column
          v-if="selectable && multiple"
          type="selection"
          width="55"
        />

        <el-table-column
          v-if="selectable && !multiple"
          width="55"
        >
          <template slot-scope="scope">
            <el-radio v-model="singleSelectValue" :label="scope.$index" @change.native="selectionChange(scope.row)"><span /></el-radio>
          </template>

        </el-table-column>

        <el-table-column
          v-for="field in visibleColumns"
          :key="field.id"
          sortable
          :prop="field.assignmentCode"
          :label="field.name"
        >
          <template slot-scope="scope">
            {{ field.displayModeDcode }}
            <div v-if="field.displayModeDcode === 'field_display_area'">
              {{ code2Text(scope.row[field.assignmentCode]) }}
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_whether'">
              <div v-if="typeof scope.row[field.assignmentCode] === 'boolean'">
                <el-tag v-if="scope.row[field.assignmentCode]" type="primary">是</el-tag>
                <el-tag v-else type="danger">否</el-tag>
              </div>
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_map'">
              <UnaMap :value="scope.row[field.assignmentCode]" />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_img'">
              <el-image
                style="width: 100px; height: 100px;"
                :src="scope.row[field.assignmentCode]"
                :fit="'cover'"
              />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_prograss'">
              <el-progress v-if="scope.row[field.assignmentCode]" :percentage="parseInt(scope.row[field.assignmentCode], 10)" />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_link'">
              <el-link v-if="scope.row[field.assignmentCode]" type="primary" :href="scope.row[field.assignmentCode]">点击跳转</el-link>
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_icon'">
              <i v-if="scope.row[field.assignmentCode]" :class="scope.row[field.assignmentCode]" />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_showInTemplate'">
              <una-document
                :id="scope.row.id"
                :entity-id="entity.id"
              />
            </div>

            <div v-else>
              {{ scope.row[field.assignmentCode] }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <el-button type="text" @click="handleUp(scope.row)">升序</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="una-fix-height margin-top flex justify-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="pageTotal"
          :pager-count="5"
          :page-size.sync="pageSize"
          @current-change="switchPage"
          @size-change="handleSizeChange"
        />
      </div>

    </el-card>
  </div>
</template>

<script>
import { CodeToText } from 'element-china-area-data'
import { chPut, chDelete, chGet, chPost } from '@/api/index'
import * as fieldPort from '@/api/una/sys_field'
// import qs from 'query-string'
import UnaDocument from '@/layout/components/UnaDocument.vue'

import UnaMap from '@/layout/components/UnaMap.vue'

export default {
  name: 'UnaTable',
  components: {
    UnaMap, UnaDocument
  },
  props: {
    entity: {
      required: true,
      type: Object
    },
    query: {
      required: false,
      type: String,
      default: ''
    },
    selectable: { // 支持选择
      type: Boolean,
      default: false
    },
    multiple: { // 支持多选
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldList: [],
      tableData: [],
      checkList: [], // 筛选列选中的数据列表
      tableReady: false, // 表格数据是否处理完成
      queryFields: {}, // 查询条件
      pageCurrent: 1,
      pageTotal: 0,
      pageSize: 10,
      singleSelectValue: '',
      selectedData: [],
      otherCondition: {},
      dataQueryCondition: {}
    }
  },
  computed: {
    visibleColumns() {
      return this.fieldList.filter((k) => this.checkList.includes(k.id))
    },
    code2Text() {
      return (e) => {
        if (e) {
          const sp = e.split(',')
          if (sp && Array.isArray(sp) && sp.length === 3) {
            return `${CodeToText[sp[0]]}${CodeToText[sp[1]]}${CodeToText[sp[2]]}`
          }
        }
        return ''
      }
    }
  },
  mounted() {
    console.log(this.entity, '接收到的')
    // 处理模糊查询条件
    this.entity.queryList.map((v) => {
      if (v.assignmentModeDcode === 'field_query_fuzzyText') {
        v.fieldCode = `:${v.fieldCode}`
      }
      if (v.assignmentModeDcode === 'field_query_geDate') {
        v.fieldCode = `ge:${v.fieldCode}`
      }
      if (v.assignmentModeDcode === 'field_query_leDate') {
        v.fieldCode = `le:${v.fieldCode}`
      }
      return v
    })

    // 处理模糊查询条件

    if (this.entity.id) {
      // const p = qs.parse(`?${this.query}`)
      this.dataQueryCondition = { entityId: this.entity.id }
    }

    this.getFieldList().then((result) => {
      console.log('字段列表', result)
      this.fieldList = result
      this.getPublicList()
      this.columnFilter()
    })
  },
  methods: {
    getFieldList() {
      return fieldPort.fieldList({ 'entityId': this.entity.id })
    },
    columnFilter(val) {
      if (!val) {
        this.fieldList.forEach(e => {
          this.checkList.push(e.id)
        })
      }
    },
    getPublicList(e, m) {
      if (e) {
        this.otherCondition = e
      } else {
        this.otherCondition = this.dataQueryCondition
      }
      chGet(this.entity.path + '/page', {
        'pageNum': this.pageCurrent,
        'pageSize': this.pageSize,
        ...this.otherCondition,
        ...m
        // ...this.dataQueryCondition
      }).then((result) => {
        this.pageTotal = result.count
        this.tableData = result.data.map(record => {
          this.fieldList.forEach(field => {
            if (record[field.assignmentCode] && field.assignmentCode !== field.displayCode) {
              // 如果赋值编码不等于显示编码，则查询显示数据
              record[field.assignmentCode] = record['map'][field.displayCode]
            }
          })
          record = { ...record, ...record.value }

          return record
        })
        this.tableReady = true
      })
    },
    switchPage(e) {
      this.pageCurrent = e
      this.getPublicList()
    },
    handleSizeChange() {
      this.getPublicList()
    },
    goQuery() {
      this.getPublicList('', this.queryFields)
    },
    resetQuery() {
      this.getPublicList()
    },
    handleEdit(e) {
      this.$emit('tableRowEdit', e)
    },
    handleDelete(e) {
      this.$emit('tableRowDelete', e)
    },
    handleUp(e) {
      this.$emit('tableRowSortUp', e)
    },
    showAddDialog() {
      this.$emit('showAddDialog')
    },
    selectionChange(e) {
      if (Array.isArray(e)) {
        this.selectedData = e
      } else {
        this.selectedData = [e]
      }
      console.log(e)
    },
    submitSelect() {
      this.$emit('submitSelect', this.selectedData.map(v => v.id).join(','))
    }
  }
}
</script>

<style lang="scss" scoped>
  .Table {
    width: 100%;
    height: 100%;
    .box-content {
      width: 100%;
      height: 100%;
    }
  }

  .el-popover .el-checkbox {
    display: block;
    margin-bottom: 5px;
  }

</style>
