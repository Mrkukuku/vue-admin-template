<template>
  <div class="app-container">
    <div class="filter-container">
       <el-alert :closable="false" class="title"  effect="dark" :title="'预计收款金额:'+statistics.estimatedReceivablesTotalAmount" type="success" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'已收款金额:'+statistics.receivedTotalAmount" type="success" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'未收款金额:'+statistics.outstandingTotalAmount" type="warning" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'已开票金额:'+statistics.invoicedAmount" type="success" />
       <el-alert :closable="false" class="title"  effect="dark" :title="'未开票金额:'+statistics.uninvoicedAmount " type="warning" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleCreate">
        新增
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
      <el-table-column label="修改时间" prop="name"  align="center" width="160">
           <template slot-scope="{row}">
            {{row.updatedTime|timeDate}}
        </template>
      </el-table-column>
      <el-table-column label="预计收款时间" align="center" width="160">
        <template slot-scope="{row}">
            {{row.estimatedReceivablesTime |timeDate}}
        </template>
      </el-table-column>
      <el-table-column label="预计收款金额" prop="estimatedReceivablesAmount"  align="center" width="140">
      </el-table-column>
      <el-table-column label="申请开票金额" prop="applicationInvoiceAmount"  align="center" width="140">
      </el-table-column>
      <el-table-column label="发票类型" align="center" width="120">
        <template slot-scope="{row}">
          {{row.invoiceType==1&&'专票'||row.invoiceType==2&&'普票'||''}}
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
      <el-table-column label="收款条件" prop="collectionTerms" align="center" width="140">
      </el-table-column>
      <el-table-column label="操作人员" prop="uname" align="center" width="120">
      </el-table-column>
      
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)">
           删除
          </el-button>
           <el-button  v-if="row.isApplicationInvoice==false" type="primary"  size="mini" @click="handleinvoice(row.id)">
            开票
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
     
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="收款合同" prop="contractId">
            <el-select v-model="temp.contractId"  clearable style="width: 280px" class="filter-item">
                <el-option v-for="item in contractOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
        </el-form-item>
         <el-form-item label="申请开票金额" prop="applicationInvoiceAmount">
          <el-input v-model="temp.applicationInvoiceAmount" />
        </el-form-item>
         <el-form-item label="预计收款金额" prop="estimatedReceivablesAmount">
          <el-input v-model="temp.estimatedReceivablesAmount" />
        </el-form-item>
        <el-form-item label="销售方银行账号" prop="invoiceAccountNumber">
            <el-input v-model="temp.invoiceAccountNumber"></el-input>
        </el-form-item>
        <el-form-item label="销售方地址" prop="invoiceAddress">
            <el-input v-model="temp.invoiceAddress"></el-input>
        </el-form-item>
        <el-form-item label="销售方开户行" prop="invoiceBank">
            <el-input v-model="temp.invoiceBank"></el-input>
        </el-form-item>
        <el-form-item label="销售方电话" prop="invoicePhone">
            <el-input v-model="temp.invoicePhone"></el-input>
        </el-form-item>
        <el-form-item label="销售方抬头" prop="invoiceTitle">
            <el-input v-model="temp.invoiceTitle"></el-input>
        </el-form-item>
         <el-form-item label="预计收款时间" prop="estimatedReceivablesTime">
             <el-date-picker
            v-model="temp.estimatedReceivablesTime"
            type="date"
            placeholder="预计收款时间"
            value-format="yyyy-MM-dd"
            style="width: 280px"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceType">
            <el-select v-model="temp.invoiceType"  clearable style="width: 280px" class="filter-item">
                <el-option v-for="item in invoiceOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
        </el-form-item>
         <el-form-item label="收款条件" prop="collectionTerms">
          <el-input v-model="temp.collectionTerms" type='textarea'/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
         取消
        </el-button>
        <el-button type="primary" @click="createData">
         确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,addList,fetchDel,fetchTitle,fetchInvoice,fetchContract } from '@/api/collection'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkPermission from '@/utils/permission'

export default {
  name: 'collection',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: true,//
      dialogFormVisible:false,
      listQuery: {//
        pageNum: 1,
        pageSize: 10,
      },
      temp: {
        contractId:'',//合同id
        applicationInvoiceAmount :'',//(string, optional): 申请开票金额 ,
        collectionTerms :'',//(string, optional): 收款条件 ,
        estimatedReceivablesAmount :'',//(string, optional): 预计收款金额 ,
        estimatedReceivablesTime :'',//(string, optional): 预计收款时间 ,
        invoiceAccountNumber :'',//(string, optional): 销售方银行账号 ,
        invoiceAddress :'',//(string, optional): 销售方地址 ,
        invoiceBank :'',//(string, optional): 销售方开户行 ,
        invoicePhone :'',//(string, optional): 销售方电话 ,
        invoiceTitle :'',//(string, optional): 销售方抬头 ,
        invoiceType :'',//(integer, optional): 发票类型(1 专票 2 普票)
      },
      rules: {
        contractId: [{ required: true, message: '请选择', trigger: 'blur' }],
        applicationInvoiceAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoicePhone: [{ required: true, message: '请输入', trigger: 'blur' }],
        estimatedReceivablesAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoiceAccountNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        estimatedReceivablesTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoiceAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoiceBank: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoiceTitle: [{ required: true, message: '请输入', trigger: 'blur' }],
        invoiceType: [{ required: true, message: '请输入', trigger: 'blur' }],
       
      },
      textMap: {
        update: '修改计划',
        create: '新增计划'
      },
      dialogStatus:'create',
      invoiceOptions:[
        {
          name:'专票',
          id:1
        },
        {
          name:'普票',
          id:2
        },
      ],
      contractOptions:[],
      statistics:{
        estimatedReceivablesTotalAmount: "0.0",
        invoicedAmount: "0.0",
        outstandingTotalAmount: "0.0",
        receivedTotalAmount: "0.0",
        uninvoicedAmount: "0.0",
      },
    }
  },
  created() {
    this.getList()
    fetchContract().then(res =>{
      this.contractOptions = res.data
    })
  },
  methods: {
    checkPermission,
    handleinvoice(id){
      this.$confirm('财务会收到开票提醒').then(()=> {
        fetchInvoice({id}).then( res=>{
           this.getList()
           this.$message({
                message:'开票成功',
                type: 'success',
                duration: 2 * 1000
            })
        })
      })
    },
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
    handleCreate() {//新增
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {//编辑
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
     createData() {//提交表单
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addList(this.temp,this.dialogStatus).then( res =>{
             this.dialogFormVisible = false
             this.getList()
             let message = ''
             if(this.dialogStatus=='create'){
                message = '添加成功'
               }else{
                  message = '修改成功'
               }
               this.$message({
                message,
                type: 'success',
                duration: 2 * 1000
              })
          })
        }
      })
    },
    handleDel(id){
      this.$confirm('你确定要删除吗').then(()=> {
        fetchDel({id}).then( res=> {
           this.getList()
           this.$message({
                message:'删除成功',
                type: 'success',
                duration: 2 * 1000
              })
        })
      })
    },
    resetTemp() {
       Object.assign(this.$data.temp,this.$options.data().temp);
    },
  }
}
</script>

<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;
    display: flex;
  }
  .title{
      width:185px;vertical-align: middle;margin-left:10px;
      min-width: 180px;
  }
</style>
