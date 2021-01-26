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

export function fetchList(data) {
  return request({
    url: '/api/admin/user/list',
    method: 'post',
    data
  })
}
export function fetchPart(data) {
  return request({
    url: '/api/admin/dept/list',
    method: 'post',
    data
  })
}

