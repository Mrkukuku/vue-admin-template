import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/user',
    method: 'post',
    params: {  }
  })
}

export function fetchList(data) {//用户列表
  return request({
    url: '/api/admin/user/list',
    method: 'post',
    data
  })
}
export function fetchPart(data) {//部门列表
  return request({
    url: '/api/admin/dept/list',
    method: 'post',
    data
  })
}
export function addUser(data,type) {//新增和修改
  var url = ''
  if(type=='create'){
    url = '/api/admin/user/register'
  }else{
    url = '/api/admin/user/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
export function fetchDel(data) {//删除用户
  return request({
    url: '/api/admin/user/delete',
    method: 'post',
    data
  })
}
export function fetchFrozen(data) {//冻结用户
  return request({
    url: '/api/admin/user/frozen',
    method: 'post',
    data
  })
}
export function fetchUnFrozen(data) {//解冻用户
  return request({
    url: '/api/admin/user/frozen.un',
    method: 'post',
    data
  })
}
export function fetchReset(data) {//重置密码
  return request({
    url: '/api/admin/user/reset.password',
    method: 'post',
    data
  })
}
export function checkPsw(data) {
  return request({
    url: '/api/admin/user/password/valid',
    method: 'post',
    data
  })
}
export function updatePsw(data) {
  return request({
    url: '/api/admin/user/update.password',
    method: 'post',
    data
  })
}

