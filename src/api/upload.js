
import request from '@/utils/request'
export function Upload(data) {
  return request({
    url: '/api/admin/file/upload',
    method: 'post',
    data
  })
}