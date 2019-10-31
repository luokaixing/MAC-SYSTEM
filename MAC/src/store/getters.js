const getters = {
  sidebar: state => state.app.sidebar,
  fileList: state => state.app.fileList,
  showMask: state => state.app.showMask,
  staticList: state => state.app.staticList,
  historyList: state => state.app.historyList,
  showInput: state => state.app.showInput,
  showCreateInput: state => state.app.showCreateInput,
  languages: state => state.app.languages,
  breadList: state => state.app.breadList,
  parentId: state => state.app.parentId,
  parentName: state => state.app.parentName,
  isLoading: state => state.app.isLoading,
  isAllowUpload: state => state.app.isAllowUpload,

  LAN: state => state.language.LAN,
  language: state => state.language.language,
  languageList: state => state.language.languageList,

  isNotProject: state => state.file.isNotProject,

  isLeft: state => state.edit.isLeft,
  model: state => state.edit.model,
  activeItem: state => state.edit.activeItem,
  modelId: state => state.edit.modelId,
  modelList: state => state.edit.modelList,
  isSave: state => state.edit.isSave,

  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  userInfo: state => state.user.userInfo,

  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
};
export default getters;
