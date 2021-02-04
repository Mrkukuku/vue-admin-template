import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/admin/contract/list',
    method: 'post',
    data
  })
}
export function fetchDel(data) {
  return request({
    url: '/api/admin/contract/delete',
    method: 'post',
    data
  })
}
export function addcontract(data,type) {
  var url = ''
  if(type=='create'){
    url = '/api/admin/contract/register'
  }else{
    url = '/api/admin/contract/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
export function fetchIssue(data,type) {//下发任务
  var url = ''
  if(type=='issueTask'){
    url = '/api/admin/contract/distribute/task'
  }else{
    url = '/api/admin/contract/distribute/person'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
export function fetchUser(data) {//获取用户
  return request({
    url: '/api/admin/user/dept/list',
    method: 'post',
    data
  })
}
export function addProgess(data) {//提交进度
  return request({
    url: '/api/admin/contract/feedback/projectProgress',
    method: 'post',
    data
  })
}
export function fetchTermination(data) {//终止合同
  return request({
    url: '/api/admin/contract/termination',
    method: 'post',
    data
  })
}
export function fetchrecord(data) {//获取变更记录
  return request({
    url: '/api/admin/contract/change/record',
    method: 'post',
    data
  })
}

export function fetchUnit(data) {
  return request({
    url: '/api/admin/unit/list',
    method: 'post',
    data
  })
}