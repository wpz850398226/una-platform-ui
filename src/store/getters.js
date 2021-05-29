
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  tentId: state => state.user.tentId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  userinfo: state => state.user.userinfo,
  roles: state => state.user.roles,
  elements: state => state.user.elements,
  entitys: state => state.user.entitys,
  configurations: state => state.user.configurations,
  dictionary: state => state.user.dictionary,
  permission_routes: state => state.permission.routes,
  generated_routes: state => state.permission.hasRoutes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  workflow_selectedNode: state => state.workflow.selectedNode,
  workflow_template: state => state.workflow.template
}
export default getters
