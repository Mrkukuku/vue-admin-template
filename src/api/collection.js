import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/admin/payment/plan/list',
    method: 'post',
    data
  })
}
export function fetchDel(data) {
  return request({
    url: '/api/admin/payment/plan/delete',
    method: 'post',
    data
  })
}
export function addList(data,type) {
  var url = ''
  if(type=='create'){
    url = '/api/admin/payment/plan/register'
  }else{
    url = '/api/admin/payment/plan/update'
  }
  return request({
    url,
    method: 'post',
    data
  })
}
export function fetchTitle(data) {
  return request({
    url: '/api/admin/payment/plan/title',
    method: 'post',
    data
  })
}