import request from '@/utils/request'

export function fetchTotal(data) {//统计数量
  return request({
    url: '/api/admin/home/page/title',
    method: 'post',
    data
  })
}
export function fetchRevenue(data) {//收入统计
  return request({
    url: '/api/admin/home/page/statistics/annual/revenue',
    method: 'post',
    data
  })
}
export function fetchCount(data) {//合同数量统计
  return request({
    url: '/api/admin/home/page/statistics/contract/count',
    method: 'post',
    data
  })
}
export function fetchTaskNum(data) {//派发任务数量统计
  return request({
    url: '/api/admin/home/page/statistics/distribute/count',
    method: 'post',
    data
  })
}
export function fetchNotice(data) {//通知
  return request({
    url: '/api/admin/home/page/notice/list',
    method: 'post',
    data
  })
}
export function updateNotice(data) {//更新通知
  return request({
    url: '/api/admin/home/page/notice/update',
    method: 'post',
    data
  })
}
