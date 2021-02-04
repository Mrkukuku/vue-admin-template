<template>
  <div class="app-container">
    <div class="filter-container">
    <div class="statistics">
       <el-alert :closable="false" style="margin:0px" class="title"  effect="dark" :title="'累积开票数:'+statistics.accumulationInvoiceNum" type="success" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'已开票总金额:'+statistics.invoicedAmount" type="success" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'待同意开票数:'+statistics.toBeAgreedInvoiceNum" type="warning" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'未开票总金额:'+statistics.uninvoicedAmount" type="warning" />
    </div>
     <el-input v-model="listQuery.proposer" placeholder="申请人" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-select v-model="listQuery.invoiceType"  placeholder="发票类型" clearable style="width: 130px" class="filter-item">
                <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-date-picker
        v-model="listQuery.startTime"
        type="date"
        placeholder="开始日期"
        :picker-options="expireTimeOptionStart1"
        value-format="yyyy-MM-dd"
        style="width: 160px;"
        class="picker">
        </el-date-picker> - 
        <el-date-picker
        v-model="listQuery.endTime"
        type="date"
        :picker-options="expireTimeOptionEnd1"
        value-format="yyyy-MM-dd"
        style="width: 160px;"
        placeholder="结束日期"
        class="picker">
         </el-date-picker>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleRest">
        重置
      </el-button>
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
      <el-table-column label="合同编号" prop="contractNum"  align="center" width="160">
      </el-table-column>
      <el-table-column label="申请开票金额" prop="applicationInvoiceAmount"  align="center" width="140">
      </el-table-column>
       <el-table-column label="发票类型" prop="receivableAmount"  align="center" width="140">
          <template slot-scope="{row}">
            {{row.invoiceType==1&&'专票'||row.invoiceType==2&&'普票'||''}}
          </template>
      </el-table-column>
      <el-table-column label="收款金额" prop="receivableAmount"  align="center" width="140">
      </el-table-column>
       <el-table-column label="收款时间" align="center" width="160">
        <template slot-scope="{row}">
            {{row.collectionTime  |timeFormat}}
        </template>
      </el-table-column>
       <el-table-column label="开票时间" align="center" width="160">
        <template slot-scope="{row}">
            {{row.invoiceTime |timeFormat}}
        </template>
      </el-table-column>
       <el-table-column label="收款状态" align="center" width="120">
        <template slot-scope="{row}">
          {{row.isReceivedMoney==1&&'已收款'||row.isReceivedMoney==0&&'未收款'||''}}
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center" width="120">
        <template slot-scope="{row}">
          {{row.isInvoice==1&&'已开票'||row.isInvoice ==0&&'未开票'||''}}
        </template>
      </el-table-column>
       <el-table-column label="申请人" prop="proposer"  align="center" width="140">
      </el-table-column>
      
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.isInvoice ==0" type="primary"  size="mini" @click="handleDel(row.id,1)">
            开票
          </el-button>
          <el-button v-if="row.isReceivedMoney==0" type="primary"size="mini" @click="handleDel(row.id,2)">
           收款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList,fetchUpdate,fetchTitle, } from '@/api/invoice'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkPermission from '@/utils/permission'

export default {
  name: 'invoice',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: false,//
      listQuery: {//
        pageNum: 1,
        pageSize: 10,
        endTime :'',//(string, optional): 开票结束时间 ,
        invoiceType :'',//(integer, optional): 发票类型(1 专票 2 普票) ,
        proposer :'',//(string, optional): 申请人 ,
        startTime :'',//(string, optional): 开票开始时间
      },
      statusOptions:[
        {
          id:1,
          name:'专票'
        },
        {
          id:2,
          name:'普票'
        },
      ],
      expireTimeOptionStart1: {
          disabledDate: time => {
              let beginDateVal1 = this.listQuery.endTime;
              if (beginDateVal1) {
                  return (
                      time.getTime() >=new Date(beginDateVal1).getTime() - 8.64e7
                  )
              }
          },
      },
      expireTimeOptionEnd1: {
            disabledDate: time => {
                let beginDateVal1 = this.listQuery.startTime;
                if (beginDateVal1) {  
                    return (
                        time.getTime() <= new Date(beginDateVal1).getTime()
                    )
                }
            },
        },
        statistics:{
            accumulationInvoiceNum :'',//(string, optional): 累积开票数 ,
            invoicedAmount :'',//(string, optional): 已开票总金额 ,
            toBeAgreedInvoiceNum :'',//(string, optional): 待同意开票数 ,
            uninvoicedAmount :'',//(string, optional): 未开票总金额
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList(){//获取列表
      fetchList(this.listQuery).then(res=>{
        this.list = res.list
        this.total = res.total
        this.listLoading =false
      })
      fetchTitle().then( res=>{
          this.statistics = res.data
      })
    },
    handleFilter() {//搜索
      this.listQuery.page = 1
      this.getList()
    },
    handleDel(id,type){
     let content = ''
     let data = null
      if(type==1){
          content = '你确定要开票吗'
          data = {
              id,
              isInvoice:true
          }
      }else{
        content = '你确定已收款吗'
          data = {
              id,
              isReceivedMoney:true
          }
      }
      this.$confirm(content).then(()=> {
        fetchUpdate(data).then( res=> {
           this.getList()
           this.$message({
                message:'操作成功',
                type: 'success',
                duration: 2 * 1000
              })
        })
      })
    },
    handleRest(){
       Object.assign(this.$data.listQuery,this.$options.data().listQuery);
       this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;
  }
  .statistics{
      display: flex;
      margin-bottom: 10px;
      .title{
        width:194px;vertical-align: middle;margin-left:10px;
        min-width: 180px;
     }
  }
</style>
