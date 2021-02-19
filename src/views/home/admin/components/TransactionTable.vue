<template>
  <el-table :data="list"  height="350" style="width: 100%;padding-top:15px;height:100%;overflow:hidden">
    <el-table-column :label="lables" min-width="200">
      <template slot-scope="{row}">
        {{ row.content }}
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="30" align="center">
      <template slot-scope="{row}">
        <el-tag   v-if="!row.isRead" type="warning"  @click="changeStatus(row.id)" >未读</el-tag>
        <el-tag v-if="row.isRead" type="success">已读</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchNotice,updateNotice } from '@/api/home'
export default {
  props: {
    lables: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: ''
    },
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchNotice({
        noticeType:this.type,
        pageSize:1000,
        pageNum:1
      }).then(response => {
        this.list = response.list
      })
    },
    changeStatus(id){
      updateNotice({id,isRead:true}).then(res =>{
        this.fetchData()
      })
    },
  }
}
</script>
