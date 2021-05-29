<template>
  <div class="base-setup" @click="showIconSelect = false">
    <el-form label-width="80px">
      <el-form-item label="表单图标">
        <i :class="setup.icon" :style="'background:' + setup.background" />
        <span class="change-icon">
          <span>
            <span>选择背景色</span>
            <el-color-picker
              v-model="setup.background"
              show-alpha
              size="small"
              :predefine="colors"
            />
          </span>
          <span>
            <span>选择图标</span>
            <el-popover placement="bottom-start" width="200" trigger="click">
              <div class="icon-select">
                <i
                  v-for="(i, id) in icons"
                  :key="id"
                  :class="i"
                  @click="setup.icon = i"
                />
              </div>
              <i slot="reference" :class="setup.icon" />
            </el-popover>
            <!--<i :class="setup.icon" @click.stop="showIconSelect = true"></i>-->
          </span>
        </span>
      </el-form-item>
      <el-form-item label="流程名称">
        <el-input v-model="setup.name" size="medium" />
      </el-form-item>
      <el-form-item label="流程编码">
        <el-select v-model="setup.code" size="medium" placeholder="请选择流程编码" style="width: 100%;">
          <el-option
            v-for="item in codeList"
            :key="item.id"
            :label="item.name"
            :value="item.val"
          />
        </el-select>
        <!-- <el-input v-model="setup.code" size="medium" /> -->
      </el-form-item>
      <el-form-item label="所在分组" class="group">
        <el-select v-model="setup.group" placeholder="请选择分组" size="medium">
          <el-option
            v-for="(op, index) in fromGroup"
            :key="index"
            :label="op.groupName"
            :value="op.id"
          />
        </el-select>
        <el-popover
          placement="bottom-end"
          title="新建流程分组"
          width="300"
          trigger="click"
        >
          <el-input
            v-model="newGroup"
            size="medium"
            placeholder="请输入新的分组名"
          >
            <el-button
              slot="append"
              @click="addGroup"
            >提交</el-button>
          </el-input>
          <el-button
            slot="reference"
            icon="el-icon-plus"
            size="medium"
            type="primary"
          >新建分组</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="流程说明">
        <el-input
          v-model="setup.remark"
          placeholder="请输入流程说明"
          type="textarea"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="500"
        />
      </el-form-item>
      <el-form-item label="流程回调">
        <el-switch
          v-model="setup.callback"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="setup.callback == 1" label="回调主题">
        <el-input
          v-model="setup.topic"
          placeholder="请输入回调主题"
        />
      </el-form-item>
      <el-form-item v-show="setup.callback == 1" label="回调标签">
        <el-input
          v-model="setup.tag"
          placeholder="请输入回调标签"
        />
      </el-form-item>

    </el-form>
    <org-picker
      :show="showUserSelect"
      :selected="select"
      @close="closeSelect"
      @selectOver="selected"
    />
  </div>
</template>

<script>
import * as netData from '../../../api/workflow'
import orgPicker from './organizationPicker.vue'
import { findDictionaryList } from '@/utils/find-dictionary.js'

export default {
  name: 'BaseSetup',
  components: { orgPicker },
  data() {
    return {
      nowUserSelect: null,
      showUserSelect: false,
      showIconSelect: false,
      select: [],
      codeList: [],
      newGroup: '',
      fromGroup: [],
      notifyTypes: [
        { type: 'app', name: '应用内通知' },
        { type: 'email', name: '邮件通知' },
        { type: 'sms', name: '短信通知' },
        { type: 'wx', name: '微信通知' },
        { type: 'dd', name: '钉钉通知' }
      ],
      colors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      icons: [
        'el-icon-eleme',
        'el-icon-delete-solid',
        'el-icon-s-tools',
        'el-icon-phone',
        'el-icon-s-goods',
        'el-icon-warning',
        'el-icon-circle-plus',
        'el-icon-s-help',
        'el-icon-camera-solid',
        'el-icon-s-promotion',
        'el-icon-s-cooperation',
        'el-icon-s-platform',
        'el-icon-s-custom',
        'el-icon-s-data',
        'el-icon-s-check',
        'el-icon-s-claim',
        'el-icon-location'
      ]
    }
  },
  computed: {
    setup() {
      return this.$store.state.workflow.template.baseSetup
    }
  },
  mounted() {
    this.codeList = findDictionaryList(58)
    this.getGroups()
  },
  methods: {
    getGroups() {
      netData.gruopAllList().then((resolve) => {
        this.fromGroup = resolve.rows
      })
    },
    addGroup() {
      if (this.newGroup.trim() !== '') {
        netData.addGruop({ groupName: this.newGroup.trim() }).then((resolve) => {
          this.$message.success('添加分组成功')
          this.getGroups()
        })
      } else {
        this.$message.error('请输入分组名称')
      }
    },
    closeSelect() {
      this.showUserSelect = false
    },
    selected(select) {
      this.showUserSelect = false
      this.$store.commit(`set${this.nowUserSelect}`, select)
    },
    selectUser(key) {
      this.select = this.setup[key]
      this.nowUserSelect = key
      this.showUserSelect = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select-dropdown {
    display: none;
  }
  .icon-select {
  i {
    cursor: pointer;
    font-size: large;
    padding: 10px;

    &:hover {
      box-shadow: 0 0 10px 2px #c2c2c2;
    }
  }
}

.select-u {
  width: 100%;
}

.base-setup {
  overflow: auto;
  margin: 0 auto;
  width: 600px;
  height: calc(100vh - 170px);
  background: #ffffff;
  margin-top: 10px;
  padding: 15px 20px;

  i:first-child {
    position: relative;
    cursor: pointer;
    font-size: xx-large;
    color: #ffffff;
    border-radius: 10px;
    padding: 10px;
  }

  .change-icon {
    margin-left: 20px;

    span {
      font-size: small;
      color: #7a7a7a;
      margin-right: 15px;
    }

    i {
      cursor: pointer;
      color: #7a7a7a;
      font-size: x-large;
    }
  }

  .el-form-item__label {
    padding: 0;
    font-weight: bold;
  }

}

.group {
  .el-select {
    width: calc(100% - 130px);
  }

  .el-button {
    margin-left: 10px;
    width: 120px;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #f8f8f8;
}

::-webkit-scrollbar-thumb {
  border-radius: 16px;
  background-color: #e8e8e8;
}
</style>
