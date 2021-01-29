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
export function fetchIssue(data,type) {
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