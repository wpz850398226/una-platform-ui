cls<template>
  <div class="app-container">
    <el-dialog title="保存公车" :visible.sync="addPublicDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="publicAddForm"
        :model="publicForm"
        status-icon
        :rules="publicFormRules"
        label-width="120px">
        <el-form-item label="图片" prop="imgUrl">
          <div class="avatar avatar-uploader" @click="openAvatarBox">
            <img
              v-if="publicForm.imgUrl"
              class="img"
              :src="chImg(publicForm.imgUrl).url"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
          <avatarBox
            v-model="showAvatar"
            field="img"
            :width="300"
            :height="300"
            img-format="png"
            @crop-success="cropSuccess"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="publicForm.name" />
        </el-form-item>
        <el-form-item label="车牌号" prop="license">
          <el-input v-model="publicForm.license" />
        </el-form-item>
        <el-form-item label="颜色编码" prop="colourDcode">
          <el-select v-model="publicForm.colourDcode" placeholder="请选择颜色" style="width: 100%;">
            <el-option
              v-for="item in colourDicList"
              :key="item.id"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型编码" prop="typeDcode">
          <el-select v-model="publicForm.typeDcode" placeholder="请选择类型" style="width: 100%;">
            <el-option
              v-for="item in typeDicList"
              :key="item.id"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态编码" prop="stateDcode">
          <el-select v-model="publicForm.stateDcode" placeholder="请选择状态" style="width: 100%;">
            <el-option
              v-for="item in stateDicList"
              :key="item.id"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="IMEI" prop="imei">
          <el-input v-model="publicForm.imei" />
        </el-form-item>
        <el-form-item label="高德终端ID" prop="gaodeId">
          <el-input v-model="publicForm.gaodeId" />
        </el-form-item>
        <el-form-item label="出厂日期" prop="productionTime">
          <el-date-picker
            v-model="publicForm.productionTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="装备日期" prop="equipmentTime">
          <el-date-picker
            v-model="publicForm.equipmentTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="型号" prop="modelDcode">
          <el-input v-model="publicForm.modelDcode" />
        </el-form-item>
        <el-form-item label="发动机编号" prop="engineNumber">
          <el-input v-model="publicForm.engineNumber" />
        </el-form-item>
        <!-- <el-form-item label="行驶总里程" prop="distance">
          <el-input v-model="publicForm.distance" />
        </el-form-item> -->
        <el-form-item label="车架号" prop="frameNumber">
          <el-input v-model="publicForm.frameNumber" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPublicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPublic('publicAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="margin-bottom-sm flex justify-between">
      <div class="flex">
        <el-input v-model="searchKey" class="margin-right-xs" placeholder="请输入搜索内容" />
        <el-button v-if="!searchMode" icon="el-icon-search" plain type="primary" @click="goSearch">搜索</el-button>
        <el-button v-else plain type="primary" @click="backSearch">返回全部</el-button>
      </div>
      <el-button size="medium" type="success" @click="checkLimitRule">更新限行检测</el-button>
      <el-button size="medium" type="primary" @click="showAddDialog">添加公车</el-button>
    </div>

    <ClientArea search-bar>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column prop="imgUrl" label="图片" width="150">
            <template slot-scope="scope">
              <img class="image" :src="chImg(scope.row.imgUrl).url" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="150" />
          <el-table-column prop="license" label="车牌号" width="150" />
          <el-table-column prop="colourDname" label="颜色编码" width="150" />
          <el-table-column prop="typeDname" label="类型编码" width="150" />
          <el-table-column prop="stateDname" label="状态编码" width="150" />
          <el-table-column prop="imei" label="IMEI" width="150" />
          <el-table-column prop="locatorId" label="定位设备id" width="150" />
          <el-table-column prop="gaodeId" label="高德终端ID" width="150" />
          <el-table-column prop="productionTime" label="出厂日期" width="150" />
          <el-table-column prop="equipmentTime" label="装备日期" width="150" />
          <el-table-column prop="modelDcode" label="型号" width="150" />
          <el-table-column prop="engineNumber" label="发动机编号" width="150" />
          <el-table-column prop="distance" label="行驶总里程" width="150" />
          <el-table-column prop="frameNumber" label="车架号" width="150" />
          <el-table-column prop="isLimitName" label="是否限号" width="150" />
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
import * as netData from '../../api/public-vehicle'
import { findDictionary, findDictionaryList } from '@/utils/find-dictionary.js'
const publicFormDefault = {
  name: '',
  imgUrl: '',
  license: '',
  colourDcode: '',
  typeDcode: '',
  stateDcode: '',
  imei: '',
  locatorId: '',
  gaodeId: '',
  productionTime: '',
  equipmentTime: '',
  modelDcode: '',
  engineNumber: '',
  distance: '',
  frameNumber: '',
  isLimit: ''
}

export default {
  name: 'DeviceTypeManage',
  components: {
    ClientArea, avatarBox
  },
  data() {
    return {
      tableData: [],
      colourDicList: [],
      typeDicList: [],
      stateDicList: [],
      publicForm: publicFormDefault,
      addPublicDialogVisible: false,
      loading: false,
      publicFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        license: [{ required: true, message: '请输入车牌号', trigger: 'change' }],
        colourDcode: [{ required: true, message: '请输入颜色编码', trigger: 'change' }],
        typeDcode: [{ required: true, message: '请输入类型编码', trigger: 'change' }],
        stateDcode: [{ required: true, message: '请输入状态编码', trigger: 'change' }],
        isLimit: [{ required: true, message: '请输入是否限号', trigger: 'change' }]
      },
      pageTotal: 0,
      showAvatar: false,
      carFile: ''

    }
  },
  mounted() {
    this.getPublicList()
    this.colourDicList = findDictionaryList(96)
    this.typeDicList = findDictionaryList(99)
    this.stateDicList = findDictionaryList(42)
  },
  methods: {
    chImg,
    openAvatarBox() {
      this.showAvatar = true
    },
    cropSuccess(imageDataUrl, field) {
      this.publicForm.imgUrl = imageDataUrl
      // console.log('裁剪后', field, imageDataUrl)
      const f = blob2File(base642Blob(imageDataUrl), 'default.png')
      this.carFile = f
    },
    checkLimitRule() {
      netData.updatePublicCarLimit().then((resolve) => {
        this.$message.info(resolve)
      })
    },
    getPublicList() {
      netData.publicList().then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows.map(v => {
          v.colourDname = findDictionary(v.colourDcode)
          v.typeDname = findDictionary(v.typeDcode)
          v.stateDname = findDictionary(v.stateDcode)
          v.isLimitName = v.isLimit === 1 ? '是' : '否'
          return v
        })
      })
    },
    switchPage(e) {
      netData.publicList(e).then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    handleEdit(e) {
      this.carFile = ''
      this.publicForm = { ...e }
      this.addPublicDialogVisible = true
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deletePublic(e.id).then((resolve) => {
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
      this.addPublicDialogVisible = true
    },
    async submitAddPublic(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.carFile) {
            await chUpload(this.carFile).then((res) => {
              console.log(res)
              this.publicForm.imgUrl = res.data
            })
          }
          this.loading = true
          netData.addPublic(this.publicForm).then((resolve) => {
            this.addPublicDialogVisible = false
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
