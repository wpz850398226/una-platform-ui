<template>
  <div class="Table">
    <el-card v-if="tableReady" class="box-content" shadow="never">
      <div class="flex justify-between" :gutter="10">
        <div class="flex">
          <div v-if="selectSureBtn" class="margin-right-xs">
            <el-button
              icon="el-icon-finished"
              size="small"
              type="success"
              @click="submitSelect"
            >确认选中</el-button>
          </div>

          <div v-if="entity.filterList && entity.filterList.length>0" class="flex margin-right-xs">
            <div
              v-for="filter in entity.filterList"
              :key="filter.id"
            >
              <el-link
                type="primary"
                @click="setFilterCond(filter.fieldCode, filter.value)"
              >{{ filter.name }}</el-link>
              <el-divider direction="vertical" />

            </div>

          </div>

          <div v-permission="entity.code+':create'" class="margin-right-xs">
            <el-button size="small" type="primary" @click="showAddDialog">添加{{ entity.name }}</el-button>
          </div>

          <div v-if="checkPermission(entity.code +':delete')" :span="3">
            <el-button
              icon="el-icon-finished"
              size="small"
              type="danger"
              @click="submitSelectDel"
            >批量删除</el-button>
          </div>

          <div v-for="btn in tableAboveButton" :key="btn.id" class="margin-left-xs" :span="3">
            <el-button size="small" :icon="btn.iconDcode" @click="reflectFun(btn.event)">{{ btn.name }}</el-button>
          </div>
        </div>

        <div>
          <div class="flex justify-end clr-btn">
            <el-popover placement="left-start" title="列筛选" trigger="click">
              <el-checkbox-group v-model="checkList" @change="columnFilter">
                <el-checkbox v-for="(item, index) in fieldList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <el-button slot="reference" title="列筛选" size="mini"><i class="el-icon-menu" /></el-button>
            </el-popover>

            <el-button
              title="数据导入"
              size="mini"
              @click="dataImportDialogVisible = true"
            >
              <i class="el-icon-upload2" />
            </el-button>

            <el-dropdown>
              <el-button title="数据导出" size="mini"><i class="el-icon-download" /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>导出到CSV文件</el-dropdown-item>
                <el-dropdown-item>导出到Excel文件</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </div>
        </div>

      </div>

      <el-row :gutter="10">

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
            <!-- {{ field.displayModeDcode }} -->
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
              <UnaImage
                v-if="scope.row[field.assignmentCode]"
                :img-url="scope.row[field.assignmentCode]"
              />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_prograss'">
              <el-progress v-if="scope.row[field.assignmentCode]" :percentage="parseInt(scope.row[field.assignmentCode], 10)" />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_assignment_score'">
              <el-rate v-if="scope.row[field.assignmentCode]" v-model="scope.row[field.assignmentCode]" disabled show-score />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_link'">
              <el-link v-if="scope.row[field.assignmentCode]" type="primary" :href="scope.row[field.assignmentCode]">点击跳转</el-link>
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_download'">
              <el-link v-if="scope.row[field.assignmentCode]" type="primary" :href="scope.row[field.assignmentCode]">点击下载</el-link>
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_icon'">
              <i v-if="scope.row[field.assignmentCode]" :class="scope.row[field.assignmentCode]" />
            </div>
            <div v-else-if="field.displayModeDcode === 'field_display_entityRecord'">
              <una-entity-view :field="field" :row="scope.row" />
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

        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button v-if="checkPermission(entity.code +':update')" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="checkPermission(entity.code +':delete')" type="text" @click="handleDelete(scope.row)">删除</el-button>
            <el-button v-if="checkPermission(entity.code +':update')" type="text" @click="handleUp(scope.row)">升序</el-button>

            <el-button
              v-for="btn in tableInlineButton"
              :key="btn.id"
              type="text"
              :icon="btn.iconDcode"
              @click="reflectFun(btn.event, scope.row, btn)"
            >{{ btn.name }}</el-button>

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

    <el-dialog
      title="数据导入"
      :visible.sync="dataImportDialogVisible"
      width="550px"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        :file-list="uploadFileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

      <div class="margin-top-sm flex justify-end">
        <el-button type="text" @click="downloadTemplate">下载模板</el-button>
      </div>

    </el-dialog>

    <el-dialog
      :title="'角色授权 - '+grantTitle"
      :visible.sync="grantRoleDialogVisible"
      width="550px"
      fullscreen
      :append-to-body="true"
    >

      <template slot="title">
        <div class="flex justify-between">
          <div>角色授权 - {{ grantTitle }}</div>
          <div class="margin-right">
            <el-button size="medium" type="primary" @click="savePermission">保存</el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="30">
        <el-col v-for="item in entityList" :key="item.id" :span="8">
          <el-collapse v-if="item.permissionList.length>0">
            <el-collapse-item :title="item.name" :name="item.name">
              <template slot="title">
                <div class="flex justify-between" style="width: 100%;">
                  <div>{{ item.name }} }</div>
                  <div class="flex align-center">
                    <div v-for="p in item.permissionList" :key="p.id">
                      <div v-if="p.level == 0" class="square black" />
                      <div v-if="p.level == 1" class="square green" />
                      <div v-if="p.level == 2" class="square blue" />
                      <div v-if="p.level == 3" class="square purple" />
                      <div v-if="p.level == 4" class="square orange" />
                    </div>
                  </div>
                </div>
              </template>
              <div class="padding-sm">
                <div v-for="p in item.permissionList" :key="p.id">
                  <div class="flex justify-between">
                    <div>{{ p.name }} {{ p.level }} </div>
                    <div>
                      <el-tag type="primary">
                        {{ formatTooltip(p.level) }}
                      </el-tag>
                    </div>
                  </div>
                  <el-slider
                    v-model="p.level"
                    show-stops
                    :min="0"
                    :max="grantLevel.length - 1"
                    :format-tooltip="formatTooltip"
                    @change="grantJoinIds(p.pid)"
                  />
                </div>
              </div>

            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

    </el-dialog>

    <el-dialog
      :title="extendEntity.name"
      :visible.sync="extendFormDialogVisible"
      width="1000px"
      :append-to-body="true"
    >
      <una-form ref="formController" :entity="extendEntity" @saveSuccess="saveSuccess" />
    </el-dialog>

  </div>
</template>

<script>
import { CodeToText } from 'element-china-area-data'
import { chPut, chDelete, chGet, chPost } from '@/api/index'
import { findDictionaryList } from '@/utils/find-dictionary'

import * as fieldPort from '@/api/una/sys_field'
// import qs from 'query-string'
import UnaDocument from '@/layout/components/UnaDocument.vue'
import UnaImage from '@/layout/components/UnaImage.vue'
import UnaForm from './UnaForm.vue'

import UnaMap from '@/layout/components/UnaMap.vue'
import UnaEntityView from '@/layout/components/UnaEntityView.vue'

import {
  buttonList, flushRedis,
  stickGoods, refreshGoods, stickShop, refreshShop

} from '@/api/una/sys_button'
import {
  entityList,
  rolePermission, grantPermission,
  importTemplateDownload
} from '@/api/una/sys_entity'

// 角色授权
import { entityListAll } from '@/api/una/sys_entity'
// 角色授权
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission.js'

export default {
  name: 'UnaTable',
  components: {
    UnaForm, UnaMap, UnaDocument, UnaImage, UnaEntityView
  },
  directives: { permission },
  props: {
    entity: {
      required: true,
      type: Object
    },
    query: {
      required: false,
      type: Object,
      default: () => {}
    },
    selectSureBtn: {
      type: Boolean,
      default: false
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
      dataQueryCondition: {},
      filterQueryCondition: {},
      // 数据导入
      dataImportDialogVisible: false,
      uploadFileList: [],
      // 通用按钮
      generalButtonList: [],
      // 角色授权
      grantRoleDialogVisible: false,
      grantLevel: [],
      grantTitle: '',
      entityList: [],
      grantChangedIds: [],
      // 角色授权
      extendEntity: '',
      extendFormDialogVisible: false
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
    },
    tableInlineButton() {
      return this.generalButtonList.filter(v => v.positionDcode === 'entity_buttonPosition_inLine')
    },
    tableAboveButton() {
      return this.generalButtonList.filter(v => v.positionDcode === 'entity_buttonPosition_tableheadLeft')
    },
    permissionLevel() {
      return (code) => {
        let find = this.grantLevel.map(v => v.code).indexOf(code)
        if (find === -1) {
          find = 0
        }
        return find
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

    if (this.entity.id && this.entity.isVirtual) {
      // const p = qs.parse(`?${this.query}`)
      this.dataQueryCondition = { entityId: this.entity.id }
    }
    this.dataQueryCondition = { ...this.dataQueryCondition, ...this.query }

    this.getFieldList().then((result) => {
      console.log('字段列表', result)
      this.fieldList = result
      this.getPublicList()
      this.columnFilter()
    })

    this.getButtonList()

    // 角色授权

    // 角色授权
  },
  methods: {
    checkPermission,
    initRoleManage(e) {
      this.grantTitle = e.name
      this.grantLevel = [...findDictionaryList('permission_scope')].reverse()
      console.log(this.grantLevel, '等级')

      rolePermission({ 'roleId': e.id }).then(roleData => {
        console.log('角色', roleData)
        entityListAll().then(res => {
          this.entityList = res.map(entity => {
            entity.permissionList.map(p => {
              const find = roleData.filter(m => m.permissionId === p.id)
              if (find.length > 0) {
                console.log(find[0], 'sssssskkkk')
                p['pid'] = find[0].id
                p['scopeDcode'] = find[0].scopeDcode
                p['level'] = this.permissionLevel(find[0].scopeDcode)
              }
              return p
            })
            return entity
          })
          console.log('全部实体', this.entityList)
        })
      })
    },
    grantJoinIds(pid) {
      if (this.grantChangedIds.indexOf(pid) === -1) {
        this.grantChangedIds.push(pid)
      }
    },
    savePermission() {
      const submitData = []
      console.log(this.grantChangedIds)
      this.entityList.forEach(e => {
        e.permissionList.forEach(k => {
          if (this.grantChangedIds.includes(k.pid)) {
            submitData.push({ id: k.pid, scopeDcode: this.grantLevel[k.level].code })
          }
        })
      })
      console.log('提交数据', submitData)
      grantPermission(submitData).then(() => {
        this.grantRoleDialogVisible = false
        this.$message.success('保存成功')
      })
    },
    formatTooltip(val) {
      const q = val || 0
      if (q >= 0 && q < this.grantLevel.length && this.grantLevel.length > 0) {
        return this.grantLevel[q].name
      }
      return ''
    },
    downloadTemplate() {
      importTemplateDownload(this.entity.code).then(res => {
        console.log(res, '模板')
      })
    },
    getButtonList() {
      buttonList({ 'entityId': this.entity.id }).then(res => {
        this.generalButtonList = res.data.filter(v => v.positionDcode === 'entity_buttonPosition_tableheadLeft' || v.positionDcode === 'entity_buttonPosition_inLine')
        console.log('按钮列表', this.generalButtonList)
      })
    },

    getFieldList() {
      return fieldPort.fieldList({ 'entityId': this.entity.id, 'isEffect': 1 })
    },
    columnFilter(val) {
      if (!val) {
        console.log(this.fieldList)
        this.fieldList.forEach(e => {
          this.checkList.push(e.id)
        })
      }
    },
    setFilterCond(key, value) {
      const c = {}
      c[key] = value
      this.filterQueryCondition = c
      this.getPublicList()
    },
    getPublicList(e, m = {}) {
      if (e) {
        this.otherCondition = e
      } else {
        this.otherCondition = this.dataQueryCondition
        console.log('s1')
      }
      console.log(this.otherCondition, 'm')
      chGet(this.entity.path + '/page', {
        'pageNum': this.pageCurrent,
        'pageSize': this.pageSize,
        ...this.otherCondition,
        ...m,
        ...this.filterQueryCondition
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
      this.getPublicList(this.otherCondition)
    },
    handleSizeChange() {
      this.getPublicList(this.otherCondition)
    },
    goQuery() {
      this.getPublicList('', this.queryFields)
    },
    resetQuery() {
      this.getPublicList()
    },
    handleEdit(e) {
      chGet(this.entity.path + `/${e.id}`).then((resolve) => {
        this.$emit('tableRowEdit', { ...resolve.data })
      })
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
      this.$emit('submitSelect', this.selectedData.map(v => v.id).join(','), this.selectedData.map(v => v.name).join(','), this.selectedData)
    },
    submitSelectDel() {
      const ids = this.selectedData.map(v => v.id)
      if (ids.length > 0) {
        this.$confirm(`此操作将删除${ids.length}记录, 是否继续?`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          chDelete(`${this.entity.path}/${ids}`).then(() => {
            this.getPublicList()
            this.$message.success('批量删除完成')
          })
        })
      } else {
        this.$message.warning('未选中任何记录')
      }

      // this.$emit('submitSelectDel', this.selectedData.map(v => v.id).join(','))
    },
    // 通用按钮事件处理器
    reflectFun(handler, extra, btn) {
      console.log(handler, extra, btn)
      const methodCenter = {
        'refreshResource': () => {
          this.$message.success('刷新资源成功')
        },
        'flushCache': (extra) => {
          flushRedis().then(() => {
            this.$message.success('清空缓存完成')
          })
        },
        'authorization': (extra) => {
          this.grantRoleDialogVisible = true
          this.initRoleManage(extra)
          // this.$message.success(`给${extra.name}发放金卡成功`)
        },
        'stickGoods': (extra) => {
          this.$confirm(btn.warning, '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            stickGoods(extra.id).then(res => {
              this.resetQuery()
              this.$message.success('置顶完成')
            })
          })
        },
        'refreshGoods': (extra) => {
          this.$confirm(btn.warning, '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            refreshGoods(extra.id).then(res => {
              this.resetQuery()
              this.$message.success('刷新完成')
            })
          })
        },
        'stickShop': (extra) => {
          this.$confirm(btn.warning, '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            stickShop(extra.id).then(res => {
              this.resetQuery()
              this.$message.success('置顶完成')
            })
          })
        },
        'refreshShop': (extra) => {
          this.$confirm(btn.warning, '提示', {
            confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
          }).then(() => {
            refreshShop(extra.id).then(res => {
              this.resetQuery()
              this.$message.success('刷新完成')
            })
          })
        },
        'comment': (extra) => {
          if (Object.prototype.hasOwnProperty.call(btn, 'formEntityId')) {
            const extMap = {}

            if (Object.prototype.hasOwnProperty.call(btn, 'formFieldCode')) {
              extMap[btn.formFieldCode] = extra.id
            }

            this.convertId2EntityAndOpenForm(btn.formEntityId, extMap)
          }
        }
      }
      if (Object.prototype.hasOwnProperty.call(methodCenter, handler)) {
        return methodCenter[handler](extra)
      } else {
        this.$message.error('指定事件未绑定')
      }
    },
    convertId2EntityAndOpenForm(entityId, extData = {}) {
      entityList(1, 1, { id: entityId }).then((res) => {
        if (res.data.length > 0) {
          this.extendEntity = res.data[0]
          console.log('反查实体', this.extendEntity)
          this.extendFormDialogVisible = true
          this.$nextTick(() => {
            this.$refs.formController.initForm('', { ...extData })
          })
        }
      })
    },
    saveSuccess() {
      this.$message.success('保存成功')
      this.extendFormDialogVisible = false
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

  .clr-btn {
    .el-button+.el-button {
      margin-left: 0;
    }
  }

  .square {
    height: 15px;
    width: 15px;
    border-radius: 4px;

      margin-right: 5px;
    &.black {
      background-color: black;
    }
    &.green {
      background-color: green;
    }
    &.blue {
      background-color: blue;
    }
    &.purple {
      background-color: purple;
    }
    &.orange {
      background-color: orange;
    }
  }

</style>
