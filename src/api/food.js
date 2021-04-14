import { chGet, chGet2, chPostdata, chPostparams, chDelete } from './indexFood'

/* 菜类*/
// 查询菜类列表
export function foodDishesType(pageNum = 1, limit = 10) {
  return chGet('/foodDishesType/getList', {
    pageNum,
    limit
  })
}
// 查询菜类列表 (全部)
export function getAll() {
  return chGet('/foodDishesType/getAll', {})
}
// 添加菜品类型
export function addDishesType(data) {
  return chPostdata('/foodDishesType/addDishesType', data)
}
// 编辑菜品类型
export function editorDishesType(data) {
  return chPostparams('/foodDishesType/editorDishesType', data)
}
// 删除菜类
export function delDishById(data) {
  return chDelete('/foodDishesType/delDishById', data)
}

/* 菜品*/
// 分类获取所有菜品
export function getDishesByType() {
  return chGet('/foodDishes/getDishesByType', {})
}

// 分页查询菜品列表
export function queryList(pageNum = 1, limit = 10) {
  return chGet('/foodDishes/queryList', {
    pageNum,
    limit
  })
}

// 根据菜类id查询菜品列表
export function searchDishes(data) {
  return chGet('/foodDishes/searchDishes', data)
}

// 添加菜品
export function addDishes(data) {
  return chPostdata('/foodDishes/addDishes', data)
}
// 编辑菜品
export function editorDishes(data) {
  return chPostdata('/foodDishes/editorDishes', data)
}

// 图片上传
export function upload(data) {
  return chPostdata('/foodDishes/upload', data)
}

// 图片删除
export function deleteImage(data) {
  return chDelete('/foodDishes/deleteImage', data)
}

// 删除菜品
export function delDishes(data) {
  return chDelete('/foodDishes/delDishes', data)
}
// 上下架
export function putOnShelf(data) {
  return chPostparams('/foodDishes/putOnShelf', data)
}

/* 食谱管理*/
// 分页查询食谱
export function queryAllList(pageNum = 1, limit = 10) {
  return chGet('/foodRecipes/queryAllList', {
    pageNum,
    limit
  })
}
// 添加食谱
export function addRecipes(data) {
  return chPostdata('/foodRecipes/addRecipes', data)
}
// 编辑食谱回显数据
export function editorEcho(data) {
  return chGet('/foodRecipes/editorEcho', data)
}

// 删除菜谱
export function delRecipe(data) {
  return chPostparams('/foodRecipes/delRecipe', data)
}
// 导出食谱
export function exportDishes(data) {
  return chGet('/foodRecipes/exportDishes', data)
}
// 查询所在单位
export function queryByCompanyId(data) {
  return chGet2('/busCompany/queryByCompanyId/' + data)
}

/* 模板管理*/

// 模板全部
export function getList() {
  return chGet('/foodTemplate/getList')
}

// 分页查询模板
export function getListByPage(pageNum = 1, limit = 10) {
  return chGet('/foodTemplate/getListByPage', {
    pageNum,
    limit
  })
}
// 生成模板
export function generateTemplate(data) {
  return chPostdata('/foodTemplate/generateTemplate', data)
}

// 编辑末班
export function editorTemplate(data) {
  return chPostdata('/foodTemplate/editorTemplate', data)
}
// 删除模板
export function delTemplate(data) {
  return chPostparams('/foodTemplate/delTemplate', data)
}
// 根据模板选中菜品
export function selectTemplate(data) {
  return chGet('/foodTemplate/selectTemplate', data)
}
// 根据模板选中菜品
export function selectTemplateById(data) {
  return chGet('/foodTemplate/selectTemplateById', data)
}

/* 投票管理*/
// 分页查询食谱
export function getVoteList(data) {
  return chGet('/foodVote/getVoteList', data)
}
// 添加投票
export function addVote(data) {
  return chPostparams('/foodVote/addVote', data)
}
// 投票详情
export function getVoteInfoById(data) {
  return chGet('/foodVote/getVoteInfoById', data)
}

// 编辑投票
export function editorVote(data) {
  return chPostparams('/foodVote/editorVote', data)
}
// 删除投票
export function delVote(data) {
  return chDelete('/foodVote/delVote', data)
}
// 投票详情
export function getVoteInfo(data) {
  return chGet('/foodVoteItem/getVoteInfo', data)
}
