<template>
  <el-table :data="list"  height="350" style="width: 100%;padding-top:15px;height:100%;overflow:hidden">
    <el-table-column :label="lables" min-width="200">
      <template slot-scope="{row}">
        {{ row.order_no }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props:['lables'],
  data() {
    return {
      list: [
        {
          order_no:'合同到期'
        },
      ]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
