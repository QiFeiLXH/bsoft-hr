// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  'Exception403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  'testa': () => import('@/views/testA'),
  'testb': () => import('@/views/testB'),

  // 首页
  'IndexView': () => import('@/views/IndexView'),

  // 招聘管理
  // 入司信息管理
  'EmployeeManagement': () => import('@/views/humanResources/EmployeeManagement'),

  // 绩效管理
  // 年度绩效
  'PerformanceView': () => import('@/views/performance/PerformanceView'),

  // 培训管理
  // 学习与分享
  'LearnShareView': () => import('@/views/train/LearnShareView'),
  // 培训情况统计图表
  'TrainReportView': () => import('@/views/train/TrainReportView'),
  // 个人培训情况统计
  'PersonalTrainView': () => import('@/views/train/PersonalTrainView'),

  // 职级管理
  // 专家库
  'ExpertView': () => import('@/views/rank/ExpertView'),
  // 职级情况
  'RankView': () => import('@/views/rank/RankView'),

  // 证书管理
  // 工作证书
  'WorkCertificateView': () => import('@/views/certificate/WorkCertificateView'),
  // 证书原件管理
  'CertificateOriginalScriptView': () => import('@/views/certificate/CertificateOriginalScriptView'),

  // 知识管理
  // 知识贡献
  'KnowledgeView': () => import('@/views/knowledge/KnowledgeView'),

  // 假期管理
  // 员工加班信息
  'WorkVacationView': () => import('@/views/vacation/WorkVacationView'),
  // 我的加班
  'WorkVacationMineView': () => import('@/views/vacation/WorkVacationMineView'),
  // 员工假期记录
  'WorkLeaveVacationView': () => import('@/views/vacation/WorkLeaveVacationView'),
  // 个人假期记录
  'PersonalLeaveVacationView': () => import('@/views/vacation/PersonalLeaveVacationView'),
  // 年假管理
  'AnnualVacationManagerView': () => import('@/views/vacation/AnnualVacationManagerView'),
  // 年假统一扣除
  'VacationReduceView': () => import('@/views/vacation/VacationReduceView'),
  // 考勤维护
  'ClockInModeMaintainView': () => import('@/views/vacation/ClockInModeMaintainView'),
  // 哺乳假期维护
  'LactationView': () => import('@/views/lactation/LactationView'),

  // 人员管理
  // 员工信息
  'NewEntryPersonInfoView': () => import('@/views/person/NewEntryPersonInfoView'),
  // 人员社保缴纳地调整
  'SocialPlaceAdjustmentView': () => import('@/views/person/SocialPlaceAdjustmentView'),
  // 员工股份
  'PersonStockView': () => import('@/views/person/PersonStockView'),
//人员财务类别管理维护汇总页签
  'PersonFinancialTotal':()=>import('@/views/personType/PersonFinancialTotal'),

  // 劳动合同
  // 劳动合同续签审核
  'LaborContractAuditListView': () => import('@/views/laborContract/LaborContractAuditListView'),
  // 劳动合同流程查询
  'LaborContractProcessView': () => import('@/views/laborContract/LaborContractProcessView'),
  // 劳动合同管理
  'LaborContractView': () => import('@/views/laborContract/LaborContractView'),
  
  // 工牌管理
  // 工牌核实、领取
  'WorkCardVerifyAndReceiveView': () => import('@/views/workCard/WorkCardVerifyAndReceiveView'),
  // 工牌制作
  'WorkCardMakeView': () => import('@/views/workCard/WorkCardMakeView'),
  // 工牌门禁开通
  'WorkCardAccessOpenView': () => import('@/views/workCard/WorkCardAccessOpenView'),
  // 人员调用
  'PersonTrainView': () => import('@/views/person/PersonTrainView'),
  'AttendanceStatisticsView':()=>import('@/views/person/AttendanceStatisticsView'),
  //人员调动情况
  'PersonTransferCondition':()=> import('@/views/transfer/PersonTransferCondition'),
  //员工转正
  'PersonToFormalView': ()=> import('@/views/person/PersonToFormalView')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

const indexRouter = {
  // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
  path: '/indexview',
  name: '首页',
  // 路由名称，建议唯一
  // 该路由对应页面的
  component: () => import('@/views/IndexView'),
  // 该路由对应页面的 组件 :方案2 (动态加载)
  meta: {
    title: '首页',
    closable: false
  },
  hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/indexview',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const params = { 'system': 15 }
    loginService.getCurrentUserNav(params).then(res => {
      const result = res.body
      const permissions = []
      const permissionList = []
      if (result && result.length > 0) {
        result.map(menu => {
          if (menu.auth != null && menu.auth.length > 0) {
            permissionList.push(menu.id.toString())
            const actionList = []
            menu.auth.map(perAuth => {
              actionList.push(perAuth.key.toString())
            })
            const per = {
              'permissionId': menu.id.toString(),
              'actionList': actionList
            }
            permissions.push(per)
          }
        })
      }
      const role = {
        'permissionList': permissionList,
        'permissions': permissions
      }
      commit('SET_ROLES', role)
      const menuNav = []
      const childrenNav = []
      // 后端数据, 根级树数组,  根级 PID
      listToTree(result, childrenNav, 0, null)
      rootRouter.children = childrenNav
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      console.log(routers)
      routers[0].children.push(indexRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { name, show, hideChildren, hiddenHeaderContent, target, icon, id, help } = item || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.object || `${parent && parent.object || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.id || item.key || '',
      // 该路由对应页面的
      component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: name,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: id + '',
        id: id,
        closable: true,
        help: help
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId, parentHelp) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      if (item.help == null && parentHelp != null) {
        item.help = parentHelp
      }
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id, item.help)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
