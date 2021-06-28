<template>
  <div class="Table">
    <el-card v-if="tableReady" class="box-content" shadow="never">
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
        height="75%"
        @selection-change="selectionChange"
      >
        <el-table-column
          v-if="selectable && multiply"
          type="selection"
          width="55"
        />

        <el-table-column
          v-if="selectable && !multiply"
          width="55"
        >
          <template slot-scope="scope">
            <el-radio v-model="singleSelectValue" :label="scope.$index" @change.native="selectionChange(scope.row)"><span /></el-radio>
          </template>

        </el-table-column>

        <el-table-column v-for="field in fieldList" :key="field.id" :prop="field.assignmentCode" :label="field.name">
          <template slot-scope="scope">
            {{ field.displayModeDcode }}
            <div v-if="field.displayModeDcode === 'field_display_area'">
              {{ code2Text(scope.row[field.assignmentCode]) }}
            </div>
            <div v-else>

              <div v-if="typeof scope.row[field.assignmentCode] === 'boolean'">
                <el-tag v-if="scope.row[field.assignmentCode]" type="primary">是</el-tag>
                <el-tag v-else type="danger">否</el-tag>
              </div>
              <div v-else>
                {{ scope.row[field.assignmentCode] }}
              </div>
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

export default {
  name: 'Table',
  components: {
  },
  props: {
    entity: {
      required: true,
      type: Object
    },
    selectable: { // 支持选择
      type: Boolean,
      default: false
    },
    multiply: { // 支持多选
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldList: [],
      tableData: [],
      tableReady: false, // 表格数据是否处理完成
      queryFields: {}, // 查询条件
      pageTotal: 0,
      pageSize: 10,
      singleSelectValue: '',
      selectedData: []
    }
  },
  computed: {
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

    this.getFieldList().then((result) => {
      console.log('字段列表', result)
      this.fieldList = result
      this.getPublicList()
    })
  },
  methods: {
    getFieldList() {
      return fieldPort.fieldList({ 'entityId': this.entity.id })
    },
    getPublicList(e) {
      chGet(this.entity.path + '/page', { 'pageNum': 1, 'pageSize': this.pageSize, ...e }).then((result) => {
        this.pageTotal = result.count
        this.tableData = result.data.map(record => {
          this.fieldList.forEach(field => {
            if (record[field.assignmentCode] && field.assignmentCode !== field.displayCode) {
              // 如果赋值编码不等于显示编码，则查询显示数据
              record[field.assignmentCode] = record['map'][field.displayCode]
            }
          })
          return record
        })
        this.tableReady = true
      })
    },
    switchPage(e) {
      this.getPublicList({})
    },
    handleSizeChange(e) {
      this.getPublicList({})
    },
    goQuery() {
      this.getPublicList(this.queryFields)
    },
    resetQuery() {
      this.getPublicList({ })
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

</style>
