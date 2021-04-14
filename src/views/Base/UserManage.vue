<template>
  <div class="app-container">
    <div class="margin-bottom-sm flex justify-between">
      <div class="flex">
        <!-- <ElSelectA v-model="aaa" :options="asb" :keys="keys" @change="selAChange" /> -->
        <div style="width:150px;">
          <el-select
            slot="prepend"
            v-model="queryField"
            class="margin-right-xs"
            placeholder="查询条件"
            @change="backSearch"
          >
            <el-option label="姓名" value="1" />
            <el-option label="手机号" value="2" />
          </el-select>
        </div>
        <div v-if="queryField >0" class="margin-right-xs" style="width: 200px">
          <el-input v-if="queryField == 1" v-model="searchKey.name" class="margin-right-xs" placeholder="请输入搜索姓名" />
          <el-input v-if="queryField == 2" v-model="searchKey.mobile" class="margin-right-xs" placeholder="请输入搜索手机号" />
        </div>
        <el-button v-if="!searchMode" icon="el-icon-search" plain type="primary" @click="goSearch">搜索</el-button>
        <el-button v-else plain type="primary" @click="backSearch">返回全部</el-button>
      </div>

      <el-button size="medium" type="primary" @click="showAddDialog">添加用户</el-button>
    </div>

    <ClientArea search-bar>
      <div slot="content" style="height:100%">
        <el-table :data="tableData" style="width: 100%;" height="85%">
          <el-table-column label="头像" width="120">
            <template slot-scope="scope">
              <el-avatar shape="square" :size="50" :src="chImg(scope.row.accountImg).url">
                <img src="../../assets/default.png">
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="150" />
          <el-table-column prop="nickname" label="昵称" width="150" />
          <el-table-column prop="sex" label="性别" width="80" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="mobile" label="手机号" width="150" />
          <el-table-column prop="cardId" label="身份证号" width="180" />
          <el-table-column prop="enabled" label="账号状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.enabled === 1" type="success">启用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-dropdown trigger="click" class="margin-left-xs margin-right-xs" @command="handleExtCommand($event,scope.row)">
                <el-button type="text">档案</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edu">教育经历</el-dropdown-item>
                  <el-dropdown-item command="person">工作经历</el-dropdown-item>
                  <el-dropdown-item command="work">特殊行动经历</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

    <el-dialog class="user-dialog" title="添加用户" fullscreen :show-close="false" :visible.sync="addBusUserDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserAddForm"
        :model="busUserForm"
        status-icon
        :rules="busUserFormRules"
        label-width="160px"
      >
        <!-- <div class="flex justify-between"> -->
        <div class="flex flex-wrap flex-direction body">

          <el-form-item label="头像" prop="imgFile">
            <div class="avatar avatar-uploader" @click="showAvatar = true">
              <img
                v-if="busUserForm.accountImg"
                class="img"
                :src="busUserForm.accountImg"
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="busUserForm.name" />
          </el-form-item>
          <el-form-item label="租户验证码" prop="tentCode">
            <el-input v-model="busUserForm.tentCode" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="busUserForm.nickname" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="busUserForm.sex" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="busUserForm.age" maxlength="2" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="busUserForm.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="busUserForm.mobile" />
          </el-form-item>
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="busUserForm.cardId" />
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="busUserForm.deptId" filterable placeholder="请选择所属部门" style="width: 100%;">
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="companyId">
            <el-select v-model="busUserForm.companyId" filterable placeholder="请选择所属单位" style="width: 100%;">
              <el-option
                v-for="item in companiesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="直接上级" prop="leaderId">
            <el-select v-model="busUserForm.leaderId" filterable placeholder="请选择直接上级" style="width: 100%;">
              <el-option
                v-for="item in orgUserList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态" prop="enabled">
            <el-switch
              v-model="busUserForm.enabled"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>

          <div v-for="(fields, index) in extList" :key="index">
            <!-- {{ fields.val }} -->
            <el-form-item
              v-if="fields.val.indexOf('time')!=-1"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-date-picker
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
              <!-- {{ JSON.stringify(dicOptions(fields.id)) }} {{ fields.id }} -->
              <!-- <el-input v-model="extList[index].value" /> -->
            </el-form-item>

            <el-form-item
              v-else-if="fields.val.indexOf('date')!=-1"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-date-picker
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
              <!-- {{ JSON.stringify(dicOptions(fields.id)) }} {{ fields.id }} -->
              <!-- <el-input v-model="extList[index].value" /> -->
            </el-form-item>
            <el-form-item
              v-else-if="dicOptions(fields.id).length===0"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-input v-model="busUserForm.extFields[dicFields(fields.id).val]" />
            </el-form-item>
            <el-form-item
              v-else
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-select
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                filterable
                :placeholder="'请选择'+dicFields(fields.id).name"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in dicOptions(fields.id)"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val"
                />
              </el-select>
            </el-form-item>
          </div>

        </div>

      </el-form>
      <span slot="title" class="header dialog-footer flex justify-between align-end">
        <h3>添加用户</h3>
        <span>
          <el-button @click="addBusUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddBusUser('busUserAddForm')">确 定</el-button>
        </span>
      </span>
    </el-dialog>

    <el-dialog class="user-dialog" title="编辑用户" fullscreen :show-close="false" :visible.sync="editBusUserDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserEditForm"
        :model="busUserForm"
        status-icon
        :rules="busUserFormRules"
        label-width="160px"
      >
        <div class="flex flex-wrap flex-direction body">
          <el-form-item label="头像" prop="imgFile">
            <div class="avatar avatar-uploader" @click="showAvatar = true">
              <img
                v-if="busUserForm.accountImg"
                class="img"
                :src="chImg(busUserForm.accountImg).url"
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
          <el-form-item label="人脸识别" prop="faceImg">
            <div class="avatar avatar-uploader" @click="showFace = true">
              <img
                v-if="busUserForm.faceImg"
                class="img"
                :src="chImg(busUserForm.faceImg).url"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
            <avatarBox
              v-model="showFace"
              field="img"
              :width="300"
              :height="300"
              img-format="png"
              @crop-success="cropFaceSuccess"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="busUserForm.name" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="busUserForm.nickname" />
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="busUserForm.sex" />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="busUserForm.age" maxlength="2" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="busUserForm.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="busUserForm.mobile" />
          </el-form-item>
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="busUserForm.cardId" />
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="busUserForm.deptId" filterable placeholder="请选择所属部门" style="width: 100%;">
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属单位" prop="companyId">
            <el-select v-model="busUserForm.companyId" filterable placeholder="请选择所属单位" style="width: 100%;">
              <el-option
                v-for="item in companiesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="直接上级" prop="leaderId">
            <el-select v-model="busUserForm.leaderId" filterable placeholder="请选择直接上级" style="width: 100%;">
              <el-option
                v-for="item in orgUserList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态" prop="enabled">
            <el-switch
              v-model="busUserForm.enabled"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <div v-for="(fields, index) in extList" :key="index">
            <!-- {{ fields.val }} -->
            <el-form-item
              v-if="fields.val.indexOf('time')!=-1"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-date-picker
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
              <!-- {{ JSON.stringify(dicOptions(fields.id)) }} {{ fields.id }} -->
              <!-- <el-input v-model="extList[index].value" /> -->
            </el-form-item>

            <el-form-item
              v-else-if="fields.val.indexOf('date')!=-1"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-date-picker
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
              <!-- {{ JSON.stringify(dicOptions(fields.id)) }} {{ fields.id }} -->
              <!-- <el-input v-model="extList[index].value" /> -->
            </el-form-item>
            <el-form-item
              v-else-if="dicOptions(fields.id).length===0"
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-input v-model="busUserForm.extFields[dicFields(fields.id).val]" />
            </el-form-item>
            <el-form-item
              v-else
              :label="dicFields(fields.id).name"
              :prop="'extFields.'+dicFields(fields.id).val"
            >
              <el-select
                v-model="busUserForm.extFields[dicFields(fields.id).val]"
                filterable
                :placeholder="'请选择'+dicFields(fields.id).name"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in dicOptions(fields.id)"
                  :key="item.val"
                  :label="item.name"
                  :value="item.val"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <span slot="title" class="header dialog-footer flex justify-between align-end">
        <h3>编辑用户</h3>
        <span>
          <el-button @click="editBusUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditBusUser('busUserEditForm')">确 定</el-button>
        </span>
      </span>
    </el-dialog>

    <el-dialog title="行动经历" fullscreen :visible.sync="busUserActionHiDialogVisible" width="550px" :append-to-body="true">
      <div class="margin-bottom-sm flex justify-end">
        <el-button size="medium" type="primary" @click="showUserActionAddDialog">添加行动经历</el-button>
      </div>

      <ClientArea search-bar>
        <div slot="content" style="height:100%">
          <el-table :data="userActionTableData" style="width: 100%;" height="85%">
            <el-table-column prop="name" label="行动名称" width="150" />
            <el-table-column prop="actionType" label="行动类型" width="150" />
            <el-table-column prop="address" label="行动地址" width="150" />
            <el-table-column prop="content" label="具体行动内容" width="150" />
            <el-table-column prop="startTime" label="开始行动时间" width="150" />
            <el-table-column prop="endTime" label="结束行动时间" width="150" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleUserActionEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleUserActionDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="margin-top flex justify-center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="userActionPageTotal"
              @current-change="switchUserActionPage"
            />
          </div>

        </div>
      </ClientArea>
    </el-dialog>

    <el-dialog title="教育经历" fullscreen :visible.sync="busUserEduHiDialogVisible" width="550px" :append-to-body="true">
      <div class="margin-bottom-sm flex justify-end">
        <el-button size="medium" type="primary" @click="showEduHiAddDialog">添加教育经历</el-button>
      </div>

      <ClientArea search-bar>
        <div slot="content" style="height:100%">
          <el-table :data="eduHiTableData" style="width: 100%;" height="85%">
            <el-table-column prop="name" label="学校名称" width="150" />
            <el-table-column prop="schoolType" label="学校类型" width="150" />
            <el-table-column prop="degree" label="学位" width="150" />
            <el-table-column prop="startTime" label="入学时间" width="150" />
            <el-table-column prop="endTime" label="毕业时间" width="150" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleEduHiEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleEduHiDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="margin-top flex justify-center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="eduHiPageTotal"
              @current-change="switchEduHiPage"
            />
          </div>

        </div>
      </ClientArea>
    </el-dialog>

    <el-dialog title="工作经历" fullscreen :visible.sync="busUserWorkHiDialogVisible" width="550px" :append-to-body="true">
      <div class="margin-bottom-sm flex justify-end">
        <el-button size="medium" type="primary" @click="showWorkHiAddDialog">添加工作经历</el-button>
      </div>

      <ClientArea search-bar>
        <div slot="content" style="height:100%">
          <el-table :data="workHiTableData" style="width: 100%;" height="85%">
            <el-table-column prop="name" label="公司名称" width="150" />
            <el-table-column prop="address" label="公司地址" width="150" />
            <el-table-column prop="position" label="工作地点" width="150" />
            <el-table-column prop="startTime" label="入职时间" width="150" />
            <el-table-column prop="endTime" label="离职时间" width="150" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="handleWorkHiEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="handleWorkHiDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="margin-top flex justify-center">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="workHiPageTotal"
              @current-change="switchWorkHiPage"
            />
          </div>

        </div>
      </ClientArea>
    </el-dialog>

    <el-dialog title="添加行动经历" :visible.sync="addBusUserActionHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserActionHiAddForm"
        :model="busUserActionHiForm"
        status-icon
        :rules="busUserActionHiFormRules"
        label-width="120px"
      >
        <el-form-item label="行动名称" prop="name">
          <el-input v-model="busUserActionHiForm.name" />
        </el-form-item>
        <el-form-item label="行动类型" prop="actionType">
          <el-input v-model="busUserActionHiForm.actionType" />
        </el-form-item>
        <el-form-item label="行动地址" prop="address">
          <el-input v-model="busUserActionHiForm.address" />
        </el-form-item>
        <el-form-item label="具体行动内容" prop="content">
          <el-input v-model="busUserActionHiForm.content" type="textarea" />
        </el-form-item>
        <el-form-item label="开始行动时间" prop="startTime">
          <!-- <el-input v-model="busUserActionHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserActionHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始行动时间"
          />
        </el-form-item>
        <el-form-item label="结束行动时间" prop="endTime">
          <!-- <el-input v-model="busUserActionHiForm.endTime" /> -->
          <el-date-picker
            v-model="busUserActionHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束行动时间"
          />
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="userId">
          <el-input v-model="busUserActionHiForm.userId" />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBusUserActionHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBusUserActionHi('busUserActionHiAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑行动经历" :visible.sync="editBusUserActionHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserActionHiEditForm"
        :model="busUserActionHiForm"
        status-icon
        :rules="busUserActionHiFormRules"
        label-width="120px"
      >
        <el-form-item label="行动名称" prop="name">
          <el-input v-model="busUserActionHiForm.name" />
        </el-form-item>
        <el-form-item label="行动类型" prop="actionType">
          <el-input v-model="busUserActionHiForm.actionType" />
        </el-form-item>
        <el-form-item label="行动地址" prop="address">
          <el-input v-model="busUserActionHiForm.address" />
        </el-form-item>
        <el-form-item label="具体行动内容" prop="content">
          <el-input v-model="busUserActionHiForm.content" type="textarea" />
        </el-form-item>
        <el-form-item label="开始行动时间" prop="startTime">
          <!-- <el-input v-model="busUserActionHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserActionHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始行动时间"
          />
        </el-form-item>
        <el-form-item label="结束行动时间" prop="endTime">
          <!-- <el-input v-model="busUserActionHiForm.endTime" /> -->
          <el-date-picker
            v-model="busUserActionHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束行动时间"
          />
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="userId">
          <el-input v-model="busUserActionHiForm.userId" />
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBusUserActionHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBusUserActionHi('busUserActionHiEditForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加教育经历" :visible.sync="addBusUserEduHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserEduHiAddForm"
        :model="busUserEduHiForm"
        status-icon
        :rules="busUserEduHiFormRules"
        label-width="120px"
      >
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="busUserEduHiForm.name" />
        </el-form-item>
        <el-form-item label="学校类型" prop="schoolType">
          <el-input v-model="busUserEduHiForm.schoolType" />
        </el-form-item>
        <el-form-item label="学位" prop="degree">
          <el-input v-model="busUserEduHiForm.degree" />
        </el-form-item>
        <el-form-item label="入学时间" prop="startTime">
          <!-- <el-input v-model="busUserEduHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserEduHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择入学时间"
          />
        </el-form-item>
        <el-form-item label="毕业时间" prop="endTime">
          <el-date-picker
            v-model="busUserEduHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择毕业时间"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBusUserEduHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBusUserEduHi('busUserEduHiAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑教育经历" :visible.sync="editBusUserEduHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserEduHiEditForm"
        :model="busUserEduHiForm"
        status-icon
        :rules="busUserEduHiFormRules"
        label-width="120px"
      >
        <el-form-item label="学校名称" prop="name">
          <el-input v-model="busUserEduHiForm.name" />
        </el-form-item>
        <el-form-item label="学校类型" prop="schoolType">
          <el-input v-model="busUserEduHiForm.schoolType" />
        </el-form-item>
        <el-form-item label="学位" prop="degree">
          <el-input v-model="busUserEduHiForm.degree" />
        </el-form-item>
        <el-form-item label="入学时间" prop="startTime">
          <!-- <el-input v-model="busUserEduHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserEduHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择入学时间"
          />
        </el-form-item>
        <el-form-item label="毕业时间" prop="endTime">
          <el-date-picker
            v-model="busUserEduHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择毕业时间"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBusUserEduHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBusUserEduHi('busUserEduHiEditForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加工作经历" :visible.sync="addBusUserWorkHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserWorkHiAddForm"
        :model="busUserWorkHiForm"
        status-icon
        :rules="busUserWorkHiFormRules"
        label-width="120px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="busUserWorkHiForm.name" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="busUserWorkHiForm.address" />
        </el-form-item>
        <el-form-item label="工作地点" prop="position">
          <el-input v-model="busUserWorkHiForm.position" />
        </el-form-item>
        <el-form-item label="入职时间" prop="startTime">
          <!-- <el-input v-model="busUserWorkHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserWorkHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择入职时间"
          />
        </el-form-item>
        <el-form-item label="离职时间" prop="endTime">
          <!-- <el-input v-model="busUserWorkHiForm.endTime" /> -->
          <el-date-picker
            v-model="busUserWorkHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择离职时间"
          />
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="userId">
			<el-input v-model="busUserWorkHiForm.userId" />
		</el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBusUserWorkHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBusUserWorkHi('busUserWorkHiAddForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑工作经历" :visible.sync="editBusUserWorkHiDialogVisible" width="550px" :append-to-body="true">
      <el-form
        ref="busUserWorkHiEditForm"
        :model="busUserWorkHiForm"
        status-icon
        :rules="busUserWorkHiFormRules"
        label-width="120px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="busUserWorkHiForm.name" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="busUserWorkHiForm.address" />
        </el-form-item>
        <el-form-item label="工作地点" prop="position">
          <el-input v-model="busUserWorkHiForm.position" />
        </el-form-item>
        <el-form-item label="入职时间" prop="startTime">
          <!-- <el-input v-model="busUserWorkHiForm.startTime" /> -->
          <el-date-picker
            v-model="busUserWorkHiForm.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择入职时间"
          />
        </el-form-item>
        <el-form-item label="离职时间" prop="endTime">
          <!-- <el-input v-model="busUserWorkHiForm.endTime" /> -->
          <el-date-picker
            v-model="busUserWorkHiForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择离职时间"
          />
        </el-form-item>
        <!-- <el-form-item label="用户ID" prop="userId">
			<el-input v-model="busUserWorkHiForm.userId" />
		</el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBusUserWorkHiDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBusUserWorkHi('busUserWorkHiEditForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import ClientArea from '../../layout/components/ClientArea'
import avatarBox from 'vue-image-crop-upload'
// import ElSelectA from '../../components/ELSelectA'
import * as netData from '../../api/bus-user'
import * as deptData from '../../api/bus-dept'
import * as orgData from '../../api/organize'
import * as userActionData from '../../api/bus-user-action-hi'
import * as eduData from '../../api/bus-user-edu-hi'
import * as workData from '../../api/bus-user-work-hi'
import { dictionaryInfo, findDictionaryList } from '@/utils/find-dictionary.js'
import { chImg } from '@/api/index'

const busUserFormDefault = {
  name: '',
  imgFile: '',
  faceImg: '',
  accountImg: '',
  tentCode: '',
  nickname: '',
  sex: '',
  age: '',
  email: '',
  mobile: '',
  cardId: '',
  deptId: '',
  leaderId: '',
  enabled: '',
  extFields: ''
}

const busUserActionHiFormDefault = {
  name: '',
  actionType: '',
  address: '',
  content: '',
  startTime: '',
  endTime: '',
  userId: ''
}

const busUserEduHiFormDefault = {
  name: '',
  schoolType: '',
  degree: '',
  startTime: '',
  endTime: '',
  userId: ''
}

const busUserWorkHiFormDefault = {
  name: '',
  address: '',
  position: '',
  startTime: '',
  endTime: '',
  userId: ''
}

const busUserFormRulesDefault = {
  // extFields: {
  //   aaa: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  // },
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
  tentCode: [{ required: true, message: '请输入租户验证码', trigger: 'change' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'change' }],
  sex: [{ required: true, message: '请输入性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
  cardId: [{ required: true, message: '请输入身份证号', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  companyId: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
  leaderId: [{ required: true, message: '请选择直接上级', trigger: 'change' }],
  enabled: [{ required: true, message: '请输入账号状态', trigger: 'change' }]
  // extFields: {}
}

export default {
  name: 'UserManage',
  components: {
    ClientArea, avatarBox
  },
  data() {
    return {
      aaa: 1,
      asb: [{ id: '123', name: 'ccc' }],
      keys: {
        label: 'name',
        value: 'id'
      },
      tableData: [],
      pageTotal: 0,
      extList: [],
      deptList: [],
      companiesList: [],
      orgUserList: [],
      busUserForm: busUserFormDefault,
      addBusUserDialogVisible: false,
      editBusUserDialogVisible: false,
      loading: false,
      showAvatar: false,
      showFace: false,
      busUserFormRules: busUserFormRulesDefault,
      queryField: '1',
      searchKey: {
        name: '',
        mobile: ''
      },
      searchMode: false,
      busUserActionHiForm: busUserActionHiFormDefault,
      userActionTableData: [],
      userActionPageTotal: 0,
      busUserActionHiDialogVisible: false,
      addBusUserActionHiDialogVisible: false,
      editBusUserActionHiDialogVisible: false,
      busUserActionHiFormRules: {
        name: [{ required: true, message: '请输入行动名称', trigger: 'change' }],
        actionType: [{ required: true, message: '请输入行动类型', trigger: 'change' }],
        address: [{ required: true, message: '请输入行动地址', trigger: 'change' }],
        content: [{ required: true, message: '请输入具体行动内容', trigger: 'change' }],
        startTime: [{ required: true, message: '请输入开始行动时间', trigger: 'change' }]
        // endTime: [{ required: true, message: '请输入结束行动时间', trigger: 'change' }]
      },
      eduHiTableData: [],
      eduHiPageTotal: 0,
      busUserEduHiForm: busUserEduHiFormDefault,
      busUserEduHiDialogVisible: false,
      addBusUserEduHiDialogVisible: false,
      editBusUserEduHiDialogVisible: false,
      busUserEduHiFormRules: {
        name: [{ required: true, message: '请输入学校名称', trigger: 'change' }],
        schoolType: [{ required: true, message: '请输入学校类型', trigger: 'change' }],
        degree: [{ required: true, message: '请输入学位', trigger: 'change' }],
        startTime: [{ required: true, message: '请输入入学时间', trigger: 'change' }]
        // endTime: [{ required: true, message: '请输入毕业时间', trigger: 'change' }]
      },
      workHiTableData: [],
      workHiPageTotal: 0,
      busUserWorkHiForm: busUserWorkHiFormDefault,
      busUserWorkHiDialogVisible: false,
      addBusUserWorkHiDialogVisible: false,
      editBusUserWorkHiDialogVisible: false,
      busUserWorkHiFormRules: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'change' }],
        address: [{ required: true, message: '请输入公司地址', trigger: 'change' }],
        position: [{ required: true, message: '请输入工作地点', trigger: 'change' }],
        startTime: [{ required: true, message: '请输入入职时间', trigger: 'change' }]
        // endTime: [{ required: true, message: '请输入离职时间', trigger: 'change' }]
      }

    }
  },
  computed: {
    dicFields() {
      return (id) => {
        return dictionaryInfo(id)
      }
    },
    dicOptions() {
      return (pid) => {
        return findDictionaryList(pid)
      }
    },
    userInfo() {
      return this.$store.getters.userinfo
    }
  },
  mounted() {
    this.getBusUserList()
    this.getExtList()
    this.getDeptList()
    this.getOrgUserList()
    this.getCompaniesList()
  },
  methods: {
    chImg,
    cropSuccess(imageDataUrl, field) {
      this.busUserForm.imgFile = imageDataUrl
      this.busUserForm.accountImg = imageDataUrl

      console.log(imageDataUrl)
    },
    cropFaceSuccess(imageDataUrl, field) {
      // this.busUserForm.faceImg = imageDataUrl
      // this.busUserForm.accountImg = imageDataUrl
      this.uploadFaceImg(imageDataUrl)
      // console.log(imageDataUrl)
    },
    uploadFaceImg(img) {
      netData.setUserFaceImg(this.busUserForm.id, img).then((resolve) => {
        console.log(resolve)
        if (resolve) {
          this.busUserForm.faceImg = resolve
        }
        // this.pageTotal = resolve.total
        // this.tableData = resolve.rows
      })
    },
    selAChange(e, m) {
      console.log(this.aaa, '9999')
      console.warn(e, m)
    },
    getDeptList() {
      deptData.busDeptListAll().then((resolve) => {
        this.deptList = resolve.rows
      })
    },
    getCompaniesList() {
      orgData.companiesList().then((resolve) => {
        this.companiesList = resolve.rows.map(company => {
          return {
            name: company.orgName,
            id: company.companyId
          }
        })
      })
    },
    getOrgUserList() {
      this.orgUserList = []
      this.userInfo.organizationList.forEach((item) => {
        orgData.orgUserList(item.id).then(resolve => {
          this.orgUserList = this.orgUserList.concat(resolve.rows)
          console.log('人', this.orgUserList)
        })
      })
    },
    getExtList(data = '') {
      const extDic = findDictionaryList(69)
      const extFields = []

      try {
        this.busUserFormRules = { ...busUserFormRulesDefault }

        const ext = {}
        extDic.forEach(t => {
          ext[t.val] = ''
          extFields.push({
            id: t.id,
            value: '',
            val: t.val
          })
          if (t.val && t.val.indexOf('required') !== -1) {
            this.busUserFormRules[`extFields.${t.val}`] = [{ required: true, message: '请输入或选择必填项', trigger: 'change' }]
          }
        })
        console.log('bbb', this.busUserFormRules)
        this.busUserForm.extFields = ext
      } catch (e) {
        console.error(e)
        this.$message.error('扩展字段解析失败')
      }

      if (data) {
        // 旧数据
        const oldData = data
        const oldDataMap = new Map(Object.entries(oldData))
        oldDataMap.forEach((value, key) => {
          this.busUserForm.extFields[key] = value
        })
        // 旧数据
      }

      this.extList = extFields
      console.log('转换结果', extFields)
    },
    getBusUserList() {
      netData.busUserList(1, 10, this.searchMode ? this.searchKey : {}).then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    switchPage(e) {
      netData.busUserList(e, 10, this.searchMode ? this.searchKey : {}).then((resolve) => {
        this.pageTotal = resolve.total
        this.tableData = resolve.rows
      })
    },
    handleEdit(e) {
      this.busUserForm = { ...e }
      this.getExtList(e.extFields)
      this.editBusUserDialogVisible = true
    },
    handleDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        netData.deleteBusUser(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getBusUserList()
        })
      })
    },
    showAddDialog() {
      this.addBusUserDialogVisible = true
      console.log(this.busUserFormRules)
      this.$nextTick(() => {
        this.busUserForm = { ...busUserFormDefault }
        this.$refs.busUserAddForm.resetFields()
      })
    },
    submitAddBusUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          // this.busUserForm.extFields = JSON.stringify(this.extList)

          // const extMap = Object.create(null)

          // this.extList.forEach((item) => {
          //   const dic = dictionaryInfo(item.id)
          //   extMap[dic.val] = item.value
          // })
          // this.busUserForm.extFields = extMap
          this.busUserForm.accountImg = ''

          netData.addBusUser(this.busUserForm).then((resolve) => {
            this.addBusUserDialogVisible = false
            this.$message.success('添加成功')
            this.getBusUserList()
            this.loading = false
          }, (e) => {
            this.loading = false
            if (e.data && Array.isArray(e.data)) {
              e.data.forEach((m) => {
                setTimeout(() => {
                  this.$message.error(m.errorMsg)
                }, 200)
              })
            }
          })
        }
      })
    },
    submitEditBusUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          // this.busUserForm.extFields = JSON.stringify(this.extList)

          // const extMap = Object.create(null)

          // this.extList.forEach((item) => {
          //   const dic = dictionaryInfo(item.id)
          //   extMap[dic.val] = item.value
          // })
          // this.busUserForm.extFields = extMap
          this.busUserForm.accountImg = ''
          netData.editBusUser(this.busUserForm).then((resolve) => {
            this.editBusUserDialogVisible = false
            this.$message.success('修改成功')
            this.getBusUserList()
            this.loading = false
          }, (e) => {
            this.loading = false
            if (e.data && Array.isArray(e.data)) {
              e.data.forEach((m) => {
                setTimeout(() => {
                  this.$message.error(m.errorMsg)
                }, 200)
              })
            }
          })
        }
      })
    },
    goSearch() {
      this.searchMode = true
      this.getBusUserList()
    },
    backSearch() {
      console.warn('kkkkkk')
      this.searchMode = false
      this.searchKey = {
        name: '',
        mobile: ''
      }
      this.getBusUserList()
    },
    handleExtCommand(e, u) {
      console.log(e)
      console.log(u)
      this.busUserActionHiForm.userId = u.id
      this.busUserEduHiForm.userId = u.id
      this.busUserWorkHiForm.userId = u.id

      if (e === 'work') {
        this.getBusUserActionHiList()
        this.busUserActionHiDialogVisible = true
      }

      if (e === 'person') {
        this.getBusUserWorkHiList()
        this.busUserWorkHiDialogVisible = true
      }

      if (e === 'edu') {
        this.getBusUserEduHiList()
        this.busUserEduHiDialogVisible = true
      }
    },
    getBusUserActionHiList() {
      userActionData.busUserActionHiList(this.busUserActionHiForm.userId).then((resolve) => {
        this.userActionPageTotal = resolve.total
        this.userActionTableData = resolve.rows
      })
    },
    switchUserActionPage(e) {
      userActionData.busUserActionHiList(this.busUserActionHiForm.userId, e).then((resolve) => {
        this.userActionPageTotal = resolve.total
        this.userActionTableData = resolve.rows
      })
    },
    handleUserActionEdit(e) {
      this.busUserActionHiForm = { ...e }
      this.editBusUserActionHiDialogVisible = true
    },
    handleUserActionDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        userActionData.deleteBusUserActionHi(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getBusUserActionHiList()
        })
      })
    },
    showUserActionAddDialog() {
      this.addBusUserActionHiDialogVisible = true
      this.$nextTick(() => {
        this.busUserActionHiForm = { ...busUserActionHiFormDefault }
        this.$refs.busUserActionHiAddForm.resetFields()
      })
    },
    submitAddBusUserActionHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserActionHiForm.startTime)
          const endTime = moment(this.busUserActionHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          userActionData.addBusUserActionHi(this.busUserActionHiForm).then((resolve) => {
            this.addBusUserActionHiDialogVisible = false
            this.$message.success('添加成功')
            this.getBusUserActionHiList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    submitEditBusUserActionHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserActionHiForm.startTime)
          const endTime = moment(this.busUserActionHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          userActionData.editBusUserActionHi(this.busUserActionHiForm).then((resolve) => {
            this.editBusUserActionHiDialogVisible = false
            this.$message.success('修改成功')
            this.getBusUserActionHiList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    getBusUserEduHiList() {
      eduData.busUserEduHiList(this.busUserEduHiForm.userId).then((resolve) => {
        this.eduHiPageTotal = resolve.total
        this.eduHiTableData = resolve.rows
      })
    },
    switchEduHiPage(e) {
      eduData.busUserEduHiList(this.busUserEduHiForm.userId, e).then((resolve) => {
        this.eduHiPageTotal = resolve.total
        this.eduHiTableData = resolve.rows
      })
    },
    handleEduHiEdit(e) {
      this.busUserEduHiForm = { ...e }
      this.editBusUserEduHiDialogVisible = true
    },
    handleEduHiDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        eduData.deleteBusUserEduHi(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getBusUserEduHiList()
        })
      })
    },
    showEduHiAddDialog() {
      this.addBusUserEduHiDialogVisible = true
      this.$nextTick(() => {
        this.busUserEduHiForm = { ...busUserEduHiFormDefault }
        this.$refs.busUserEduHiAddForm.resetFields()
      })
    },
    submitAddBusUserEduHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserEduHiForm.startTime)
          const endTime = moment(this.busUserEduHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          eduData.addBusUserEduHi(this.busUserEduHiForm).then((resolve) => {
            this.addBusUserEduHiDialogVisible = false
            this.$message.success('添加成功')
            this.getBusUserEduHiList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    submitEditBusUserEduHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserEduHiForm.startTime)
          const endTime = moment(this.busUserEduHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          eduData.editBusUserEduHi(this.busUserEduHiForm).then((resolve) => {
            this.editBusUserEduHiDialogVisible = false
            this.$message.success('修改成功')
            this.getBusUserEduHiList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    getBusUserWorkHiList() {
      workData.busUserWorkHiList(this.busUserWorkHiForm.userId).then((resolve) => {
        this.workHiPageTotal = resolve.total
        this.workHiTableData = resolve.rows
      })
    },
    switchWorkHiPage(e) {
      workData.busUserWorkHiList(this.busUserWorkHiForm.userId, e).then((resolve) => {
        this.workHiPageTotal = resolve.total
        this.workHiTableData = resolve.rows
      })
    },
    handleWorkHiEdit(e) {
      this.busUserWorkHiForm = { ...e }
      this.editBusUserWorkHiDialogVisible = true
    },
    handleWorkHiDelete(e) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {
        workData.deleteBusUserWorkHi(e.id).then((resolve) => {
          this.$message.success('删除成功!')
          this.getBusUserWorkHiList()
        })
      })
    },
    showWorkHiAddDialog() {
      this.addBusUserWorkHiDialogVisible = true
      this.$nextTick(() => {
        this.busUserWorkHiForm = { ...busUserWorkHiFormDefault }
        this.$refs.busUserWorkHiAddForm.resetFields()
      })
    },
    submitAddBusUserWorkHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserWorkHiForm.startTime)
          const endTime = moment(this.busUserWorkHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          workData.addBusUserWorkHi(this.busUserWorkHiForm).then((resolve) => {
            this.addBusUserWorkHiDialogVisible = false
            this.$message.success('添加成功')
            this.getBusUserWorkHiList()
            this.loading = false
          }, (e) => {
            this.loading = false
          })
        }
      })
    },
    submitEditBusUserWorkHi(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const startTime = moment(this.busUserWorkHiForm.startTime)
          const endTime = moment(this.busUserWorkHiForm.endTime)
          if (endTime.unix() < startTime.unix()) {
            this.$message.error('结束时间必须大于开始时间')
            return
          }

          this.loading = true
          workData.editBusUserWorkHi(this.busUserWorkHiForm).then((resolve) => {
            this.editBusUserWorkHiDialogVisible = false
            this.$message.success('修改成功')
            this.getBusUserWorkHiList()
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
.user-dialog {
  .header {
    position: fixed;
    padding-left: 20px;
    padding-right: 60px;
    width: 100%;
    top: 0;
    left: 0;
  }

  .body {
    width: 100%;
    height: 80vh;
    overflow-x: scroll;
    margin-top: 30px;
  }
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
