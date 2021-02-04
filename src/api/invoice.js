import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/admin/invoice/collection/list',
    method: 'post',
    data
  })
}
export function fetchUpdate(data) {
  return request({
    url: '/api/admin/invoice/collection/update',
    method: 'post',
    data
  })
}
export function fetchTitle(data) {
    return request({
      url: '/api/admin/invoice/collection/title',
      method: 'post',
      data
    })
  }
