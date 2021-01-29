import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/admin/unit/list',
    method: 'post',
    data
  })
}
export function fetchDel(data) {
  return request({
    url: '/api/admin/unit/delete',
    method: 'post',
    data
  })
}
export function addUnit(data,type) {
  var url = ''
  if(type=='create'){
    url = '/api/admin/unit/register'
  }else{
    url = '/api/admin/unit/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}