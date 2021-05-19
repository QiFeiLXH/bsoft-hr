import Mock from 'mockjs2'
import { builder } from '../util'

const info = (options) => {
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'personName': '天野远子',
    'username': 'admin',
    'password': '',
    'avatar': '/avatar2.jpg',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'merchantCode': 'TLif2btpzg079h15bk',
    'deleted': 0,
    'roleId': 'admin',
    'role': {}
  }
  // role
  const roleObj = {
    'id': 'admin',
    'name': '管理员',
    'describe': '拥有所有权限',
    'status': 1,
    'creatorId': 'system',
    'createTime': 1497160610259,
    'deleted': 0,
    'permissions': [{
      'roleId': 'admin',
      'permissionId': 'user',
      'permissionName': '用户管理',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'import',
        'describe': '导入',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }]
    }
    ]
  }
  roleObj.permissions.push()
  userInfo.role = roleObj
  const role = {
    'permissions': roleObj
  }
  const map = {
    'userInfo': userInfo,
    'role': role
  }
  return builder({}, map)
}

const userNav = (options) => {
  const nav = [
    {
      'id': 36,
      'title': 'testa',
      'parentId': 0,
      'sort': null,
      'icon': null,
      'path': '/testa',
      'component': 'testa',
      'name': 'testa'
    }, {
      'id': 37,
      'title': 'testb',
      'parentId': 0,
      'sort': null,
      'icon': null,
      'path': '/testb',
      'component': 'testb',
      'name': 'testb'
    }
  ]
  const json = builder(nav)
  return json
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
