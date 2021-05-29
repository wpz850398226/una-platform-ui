cls<template>
  <div class="app-container">
    <el-dialog title="保存实体" :visible.sync="savePublicDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
        :model="publicForm"
        status-icon
        :rules="publicFormRules"
        label-width="120px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="publicForm.name" />
        </el-form-item>
        <el-form-item label="类名" prop="className">
          <el-input v-model="publicForm.className" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="publicForm.path" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savePublicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPublic('publicAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="margin-bottom-sm flex justify-between">
      <!--<div class="flex">
        <el-input v-model="searchKey" class="margin-right-xs" placeholder="请输入搜索内容" />
        <el-button v-if="!searchMode" icon="el-icon-search" plain type="primary" @click="goSearch">搜索</el-button>
        <el-button v-else plain type="primary" @click="backSearch">返回全部</el-button>
      </div>-->
      <el-button size="medium" type="primary" @click="showAddDialog">添加实体</el-button>
    </div>

    <ClientArea search-bar>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column v-for="(field, i) in fieldList" :key="field.id" :prop="field.displayCode" :label="field.name" width="150" />
          <!--          <el-table-column prop="name" label="名称" width="150" />-->
          <!--          <el-table-column prop="className" label="类名" width="150" />-->
          <!--          <el-table-column prop="path" label="路径" />-->
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top flex justify-center">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageTotal"
            @current-change="switchPage"
          />
        </div>
      </div>
    </ClientArea>
  </div>
</template>

<script>
import { chImg, chUpload, base642Blob, blob2File } from '@/api/index'
import avatarBox from 'vue-image-crop-upload'
import ClientArea from '../../layout/components/ClientArea'
import * as netData from '../../api/una/sys_entity'
import { findDictionary, findDictionaryList } from '@/utils/find-dictionary.js'
import { getEntity, getFieldList } from '@/utils/una/entity-util.js'
import { chGet, chPost, chPut, chDelete } from '../../api/index'
const publicFormDefault = {
  name: '',
  className: '',
  path: ''
}

export default {
  name: 'DeviceTypeManage',
  components: {
    ClientArea, avatarBox
  },
  data() {
    return {
      className: this.$route.meta.code,
      entity: null,
      fieldList: [],
      tableData: [],
      colourDicList: [],
      typeDicList: [],
      stateDicList: [],
      publicForm: publicFormDefault,
      savePublicDialogVisible: false,
      loading: false,
      publicFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        path: [{ required: true, message: '请输入路径', trigger: 'change' }],
        className: [{ required: true, message: '请输入类名', trigger: 'change' }]
      },
      pageTotal: 0,
      showAvatar: false,
      carFile: ''

    }
  },
  mounted() {
    this.entity = getEntity(this.className)
    this.getPublicList()
    // this.fieldList = getFieldList(this.className)
    // this.colourDicList = findDictionaryList(96)
    // this.typeDicList = findDictionaryList(99)
    // this.stateDicList = findDictionaryList(42)
  },
  methods: {
    chImg,
    // openAvatarBox() {
    //   this.showAvatar = true
    // },
    // cropSuccess(imageDataUrl, field) {
    //   this.defaultForm.imgUrl = imageDataUrl
    //   const f = blob2File(base642Blob(imageDataUrl), 'default.png')
    //   this.carFile = f
    // },
    openAvatarBox() {
      this.showAvatar = true
    },
    cropSuccess(imageDataUrl, field) {
      this.publicForm.imgUrl = imageDataUrl
      //
      const f = blob2File(base642Blob(imageDataUrl), 'default.png')
      this.carFile = f
    },
    getPublicList(page = 1, limit = 10) {
      console.log(this.entity.path)
      chGet(this.entity.path + '/page', {
        page, limit
      }).then((resolve) => {
        this.pageTotal = resolve.count
        this.tableData = resolve.data
      })

      // netData.entityList().then((resolve) => {
      //   this.pageTotal = resolve.count
      //   this.tableData = resolve.data
      //   this.tableData = resolve.rows.map(v => {
      //     v.colourDname = findDictionary(v.colourDcode)
      //     v.typeDname = findDictionary(v.typeDcode)
      //     v.stateDname = findDictionary(v.stateDcode)
      //     v.isLimitName = v.isLimit === 1 ? '是' : '否'
      //     return v
      //   })
      // })
    },
    switchPage(e) {
      netData.entityList(e).then((resolve) => {
        this.pageTotal = resolve.count
        this.tableData = resolve.data
      })
    },
    handleEdit(e) {
      this.publicForm = { ...e }
      this.savePublicDialogVisible = true
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deleteEntity(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getPublicList()
        })
      })
    },
    showAddDialog() {
      this.carFile = ''
      this.publicForm = { ...publicFormDefault }
      if (this.$refs.publicAddForm) {
        this.$refs.publicAddForm.clearValidate()
      }
      this.savePublicDialogVisible = true
    },
    async submitAddPublic(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // if (this.carFile) {
          //   await chUpload(this.carFile).then((res) => {
          //
          //     this.publicForm.imgUrl = res.data
          //   })
          // }
          this.loading = true
          netData.addEntity(this.publicForm).then((resolve) => {
            this.savePublicDialogVisible = false
            this.$message.success('保存成功')
            this.getPublicList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 100px;
  width: 100px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 4px;
   .img {
      display: block;
      height: 100%;
      width: 100%;
      border-radius: 4px;
    }
}
</style>
