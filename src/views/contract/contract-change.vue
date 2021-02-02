<template>
  <div class="app-container">
    <div class="filter-container">
           <el-page-header @back="goBack" content=""> </el-page-header>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
     <el-table-column
      label="序号"
      align="center"
      type="index"
      width="50">
    </el-table-column>
     
      <el-table-column label="变更时间"   width="230">
        <template slot-scope="{row}">
            {{row.updatedTime|timeFormat}}
        </template>
      </el-table-column>
      <el-table-column label="变更事项"  width="560">
        <template slot-scope="{row}">
          <div v-html="row.changeDesc"></div>
        </template>
      </el-table-column>
      <el-table-column label="变更理由" prop="changeReason"   >
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
     
  </div>
</template>

<script>
import { fetchrecord } from '@/api/contract'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'contractChange',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: true,//
       listQuery: {//
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    console.log(this.$route)
    this.listQuery.id = this.$route.params.id
    if(this.listQuery.id){
       this.getList()
    }
  },
  methods: {
      goBack(){
          this.$router.go(-1)
      },
    getList(){//获取列表
      fetchrecord(this.listQuery).then(res=>{
        this.list = res.list
        this.total = res.total
        this.listLoading =false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  $dark_gray:#889aa4;
  .filter-container {
    padding-bottom: 10px;
  }
  fieldset{
    border: none;
  }
  .down{
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
