<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.uname" placeholder="经办人" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contractNum" placeholder="合同编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.firstPartyName" placeholder="甲方名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.secondPartyName" placeholder="乙方公司" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-select v-model="listQuery.status"  placeholder="合同状态" clearable style="width: 130px" class="filter-item">
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
      <el-button v-if="checkPermission(['admin',2])" class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleCreate">
        新增
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
      <el-table-column label="合同名称" prop="contractName"  align="center" width="160">
      </el-table-column>
      <el-table-column label="合同编号" prop="contractNum"  align="center" width="160">
      </el-table-column>
      <el-table-column label="合同类别"   align="center" width="120">
        <template slot-scope="{row}">
           {{contractOptions[row.contractType-1].name}}
        </template>
      </el-table-column>
      <el-table-column label="合同金额" prop="contractAmount"  align="center" width="120">
      </el-table-column>
       <el-table-column label="甲方名称" prop="firstPartyName"  align="center" width="140">
      </el-table-column>
      <el-table-column label="乙方名称" prop="secondPartyName"  align="center" width="140">
      </el-table-column>
      <el-table-column label="开始日期"  align="center" width="120">
        <template slot-scope="{row}">
            {{row.startTime|timeDate}}
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" width="120">
        <template slot-scope="{row}">
             {{row.endTime|timeDate}}
        </template>
      </el-table-column>
      <el-table-column label="经办人" prop="uname"  align="center" width="110">
      </el-table-column>
     
      <el-table-column label="合同状态"  align="center" width="100">
        <template slot-scope="{row}">
          {{statusOptions[row.status-1].name}}
        </template>
      </el-table-column>
      <el-table-column label="派发状态"  align="center" width="100">
        <template slot-scope="{row}">
          {{row.isDistribution==true&&'已派发'||row.isDistribution==false&&'未派发'||'' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="{row}" >
           <div v-if="checkPermission(['admin',2])">
            <el-button v-if="row.status!=2" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="warning" v-if="row.isDistribution==false&&row.status!=2" icon="el-icon-user-solid" size="mini" @click="handleIssued(row.id,0)">
              下发
            </el-button>
            <el-button type="warning" @click="showProgess(row.projectProgressDesc)" v-if="row.projectProgressDesc&&row.projectProgressDesc.length" icon="el-icon-edit" size="mini">
              查看进展
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)">
              删除
            </el-button>
            <el-button type="danger" v-if="row.status!=2" icon="el-icon-remove-outline" size="mini"  @click="handleTermination(row.id)">
              终止
            </el-button>
            <el-button type="primary"  size="mini"  @click="handleRecord(row.id)">
              变更记录
            </el-button>
           </div>
           <div v-else>
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row,1)">
                查看详情
              </el-button>
              <el-button type="warning" @click="showProgess(row.projectProgressDesc)" v-if="row.projectProgressDesc&&row.projectProgressDesc.length"  size="mini">
                查看进展
              </el-button>
              <el-button v-if="userInfo.position==2&&row.isDistribution==false&&row.status!=2"  @click="handleIssued(row.id,1)" type="warning" icon="el-icon-user-solid" size="mini"  >
                下发
              </el-button>
              <el-button v-if="userInfo.position==3&&row.status!=2"  @click="handleProgess(row.id)" type="warning" icon="el-icon-user-solid" size="mini"  >
                提交进展
              </el-button>
           </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
     
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:50px;" >
        <fieldset :disabled ='disabled'>
         <el-form-item label="合同名称" prop="contractName">
          <el-input v-model="temp.contractName" />
        </el-form-item>
         <el-form-item label="合同编号" prop="contractNum">
          <el-input v-model="temp.contractNum" />
        </el-form-item>
         <el-form-item label="合同类别" prop="contractType">
           <el-select v-model="temp.contractType"  filterable  clearable style="width: 265px" class="filter-item">
                <el-option v-for="item in contractOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
        </el-form-item>
         <el-form-item label="合同金额" prop="contractAmount">
          <el-input v-model="temp.contractAmount" />
        </el-form-item>
         <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="temp.projectName" />
        </el-form-item>
         <el-form-item label="甲方名称" prop="firstPartyName">
          <el-select v-model="temp.firstPartyName"  filterable  clearable style="width: 265px" class="filter-item">
                <el-option v-for="item in unitOptions" :key="item.id" :label="item.name" :value="item.name"/>
            </el-select>
        </el-form-item>
         <el-form-item label="乙方名称" prop="secondPartyName">
           <el-select v-model="temp.secondPartyName" filterable   clearable style="width: 265px" class="filter-item">
                <el-option v-for="item in unitOptions" :key="item.id" :label="item.name" :value="item.name"/>
            </el-select>
        </el-form-item>
         <el-form-item label="支付方式" prop="paymentType">
           <el-select v-model="temp.paymentType"  clearable style="width: 265px" class="filter-item">
                <el-option v-for="item in paymentOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item label="合同开始时间" prop="startTime">
             <el-date-picker
            v-model="temp.startTime"
            type="date"
            placeholder="开始日期"
            :picker-options="expireTimeOptionStart"
            value-format="yyyy-MM-dd"
           style="width: 265px">
            </el-date-picker>
        </el-form-item>
         <el-form-item label="合同结束时间" prop="endTime">
              <el-date-picker
            v-model="temp.endTime"
            type="date"
            :picker-options="expireTimeOptionEnd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
           style="width: 265px">
         </el-date-picker>
         </el-form-item>
          <el-form-item label="变更理由" prop="contractDesc" v-if="dialogStatus == 'update'">
          <el-input v-model="temp.contractDesc" type="textarea"/>
        </el-form-item>
         <el-form-item label="合同原件" prop="fileUrls" v-if="!disabled">
             <el-upload
                ref="upload"
                action=""
                :file-list="temp.fileUrls"
                :limit="3"
                :http-request="uploadsFile"
                :on-remove="handleRemoveFile"
                >
                <el-button type="primary" slot="trigger">上传</el-button>
            </el-upload>
        </el-form-item>
         <!-- <el-form-item label="合同原件"  v-else>
               <div class="down" v-for="(item, index) in temp.fileUrls" :key="index" @click="download(item.fileUrl,item.name)">
                    {{item.name}} <i class="el-icon-download"></i>
              </div>
        </el-form-item> -->
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button @click="dialogFormVisible = false">
         取消
        </el-button>
        <el-button type="primary" @click="createData">
         确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[issueStatus]" :visible.sync="userFormVisible" width="500px">
         <el-form ref="issuedForm" label-position="right" label-width="110px">
          <el-form-item label="部门" :rules="[{ required: true, message: '请选择', trigger: 'blur' },]" v-if="issueStatus=='issueTask'">
             <el-select v-model="temp1.departmentId" @change="getUser" class="filter-item" placeholder="请选择">
              <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="人员" :rules="[{ required: true, message: '请选择', trigger: 'blur' },]">
             <el-select v-model="temp1.uid"  class="filter-item" placeholder="请选择">
              <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
         </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="issuedTask">
              确定
            </el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目进展情况" :visible.sync="progressVisible" width="500px">
        <el-form ref="progressForm" label-position="right" label-width="110px">
        <el-form-item label="进展情况" prop="projectProgressDesc" v-if="progressFlag">
               <el-upload
                ref="upload"
                action=""
                :file-list="projectProgressDesc"
                :limit="3"
                :http-request="uploadsFile1"
                :on-remove="handleRemoveFile1"
                >
                <el-button type="primary" slot="trigger">上传</el-button>
            </el-upload>
        </el-form-item>
          <el-form-item label="进展情况" v-else>
              <div class="down" v-for="(item, index) in projectProgressDesc" :key="index" @click="download(item.fileUrl,item.name)">
                    {{item.name}} <i class="el-icon-download"></i>
              </div>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="progressVisible = false">
              取消
            </el-button>
            <el-button v-if="progressFlag" type="primary" @click="createProgess">
              确定
            </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList,addcontract,fetchDel,fetchIssue,fetchUser,addProgess,fetchTermination,fetchUnit,fetchType } from '@/api/contract'
import { Upload } from '@/api/upload'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkPermission from '@/utils/permission'
import { mapGetters } from 'vuex'

export default {
  name: 'contract',
  components: { Pagination },
  directives: { waves },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: true,//
      dialogFormVisible:false,//合同开关
      userFormVisible:false,//下发开关
      progressVisible:false,//进展开关
      progressFlag:true,
      disabled:false,
      listQuery: {//筛选条件
        pageNum: 1,
        pageSize: 10,
        contractNum: '',
        endTime:'',
        startTime:'',
        status:'',
        uname:'',
        projectName:'',
        firstPartyName:'',
        secondPartyName:'',
      },
      temp: {
        contractAmount :'',//(string, optional): 合同金额 ,
        contractName :'',//(string, optional): 合同名称 ,
        contractNum :'',//(string, optional): 合同编号 ,
        endTime :'',//(string, optional): 合同结束时间 ,
        fileUrls :[],//(Array[string], optional): 合同原件 ,
        firstPartyName :'',//(string, optional): 甲方名称 ,
        paymentType :'',//(integer, optional): 付款方式 ,
        projectName :'',//(string, optional): 项目名称 ,
        secondPartyName :'',//(string, optional): 乙方名称 ,
        startTime :'',//(string, optional): 合同开始时间
        contractDesc:'',//变更理由
        projectProgressDesc:[],//合同进展情况
        contractType:'',
      },
      temp1:{
        departmentId:'',
        uid:'',
        id:''
      },
      rules: {
        contractAmount: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractDesc: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractName: [{ required: true, message: '请输入', trigger: 'blur' }],
        contractNum: [{ required: true, message: '请输入', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        firstPartyName: [{ required: true, message: '请输入', trigger: 'blur' }],
        paymentType: [{ required: true, message: '请输入', trigger: 'blur' }],
        projectName: [{ required: true, message: '请输入', trigger: 'blur' }],
        secondPartyName: [{ required: true, message: '请输入', trigger: 'blur' }],
        secondPartyName: [{ required: true, message: '请输入', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileUrls: [{ required: true, message: '请上传', trigger: 'blur' }],
        contractType: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
      issueStatus:'',
      dialogStatus:'create',
      textMap: {
        update: '修改合同',
        create: '新增合同',
        issueTask:'下发合同',
        issueUser:'下发人员',
      },
      calendarTypeOptions:[//部门列表
        {
          id:4,
          name:'检测部'
        },
        {
          id:5,
          name:'维保部'
        },
        {
          id:6,
          name:'工程部'
        },
        {
          id:7,
          name:'网络部'
        },
      ],
      userOptions:[],//人员列表
      statusOptions:[
        {
          id:1,
          name:'履行中'
        },
        {
          id:2,
          name:'已终止'
        },
      ],
      paymentOptions:[//支付方式
         {
          id:1,
          name:'现金'
        },
        {
          id:2,
          name:'转账'
        },
      ],
    
      expireTimeOptionStart: {
          disabledDate: time => {
              let beginDateVal = this.temp.endTime;
              if (beginDateVal) {
                  return (
                      time.getTime() >=new Date(beginDateVal).getTime() - 8.64e7
                  )
              }
          },
      },
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
      expireTimeOptionEnd: {
            disabledDate: time => {
                let beginDateVal = this.temp.startTime;
                if (beginDateVal) {  
                    return (
                        time.getTime() <= new Date(beginDateVal).getTime()
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
        projectProgressDesc:[],//进展情况
        id:'',//合同id
        unitOptions:[],//单位列表
        contractOptions:[],//合同类型
    }
  },
  created() {
    this.getList()
    this.getOptions()
  },
  methods: {
    checkPermission,
    getOptions(){
      fetchUnit({
        pageNum: 1,
        pageSize: 1000,
        name:''
    }).then(res=>{
      this.unitOptions = res.list
    })
    fetchType({}).then( res=>{
     this.contractOptions = res.data
    })
    },
    handleRecord(id){
      this.$router.push({name:'Contractchange',params:{id}})
    },
    handleTermination(id){
       this.$confirm('你确定要终止吗').then(()=> {
         fetchTermination({id}).then( res=> {
           this.getList()
           this.$message({
                message:'已终止',
                type: 'success',
                duration: 2 * 1000
              })
        })
      })
    },
    showProgess(data){
      this.projectProgressDesc = data
      this.progressVisible = true
      this.progressFlag = false
    },
    handleProgess(id){
      this.progressVisible = true
      this.progressFlag = true
      this.projectProgressDesc = []
      this.id = id
    },
    createProgess(){
        if(this.projectProgressDesc.length){
             addProgess({
              id:this.id,
              projectProgressDesc:this.projectProgressDesc
            }).then( res=>{
              this.progressVisible = false
              this.getList()
            })
        }
     
    },
    issuedTask (){//下发任务
        if(this.temp1.uid){
          fetchIssue(this.temp1, this.issueStatus).then( res=>{
            this.userFormVisible = false
            this.getList()
            this.$message({
                message:'下发成功',
                type: 'success',
                duration: 2 * 1000
              })
          })
        }
    },
    handleIssued(id,type){//下发任务界面
     Object.assign(this.$data.temp1,this.$options.data().temp1);
      this.temp1.id = id
      this.userFormVisible = true
      if(type==0){
        this.issueStatus = 'issueTask'
      }else{
         this.issueStatus = 'issueUser'
         this.getUser(this.userInfo.departmentId,1)
      }
    },
    getUser(departmentId,type){//获取人员
      this.uid = ''
      let position = ''
      if(type==1){
        position = 3
      }else{
        position = 2
      }
      fetchUser({departmentId,position}).then( res =>{
        this.userOptions = res.data
      })
    },
    getList(){//获取列表
      fetchList(this.listQuery).then(res=>{
        this.list = res.list
        this.total = res.total
        this.listLoading =false
      })
    },
    handleFilter() {//搜索
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {//新增
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row,type) {//编辑
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      if(type==1){
         this.disabled = true
      }
    },
     createData() {//提交表单
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addcontract(this.temp,this.dialogStatus).then( res =>{
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
    handleRest(){
       Object.assign(this.$data.listQuery,this.$options.data().listQuery);
       this.getList()
    },
    resetTemp() {
       Object.assign(this.$data.temp,this.$options.data().temp);
    },
    uploadsFile(file){
        let formdata = new FormData(); 
        formdata.append('multis',file.file );
        formdata.append('fileType',14);
         Upload(formdata).then( res=>{
          this.temp.fileUrls.push(res.data[0])
        })
    },
    uploadsFile1(file){
        let formdata = new FormData(); 
        formdata.append('multis',file.file );
        formdata.append('fileType',14);
        Upload(formdata).then( res=>{
          this.projectProgressDesc.push(res.data[0])
        })
    },
    handleRemoveFile(file){//移除
        for(var i in this.temp.fileUrls ){
            if(this.temp.fileUrls[i].name==file.name){
                this.temp.fileUrls.splice(i,1);
            }
        }
    },
    handleRemoveFile1(file){//移除
        for(var i in this.projectProgressDesc ){
            if(this.projectProgressDesc[i].name==file.name){
                this.projectProgressDesc.splice(i,1);
            }
        }
    },
    download(url, filename) {
        var _this =this
        this.getBlob(url, function(blob) {
            _this.saveAs(blob, filename);
        });
    },
    getBlob(url,cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (xhr.status === 200) {
                cb(xhr.response);
            }
        };
        xhr.send();
    },
    saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
        } else {
                var link = document.createElement('a');
                var body = document.querySelector('body');

                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                // fix Firefox
                link.style.display = 'none';
                body.appendChild(link);
                
                link.click();
                body.removeChild(link);

                window.URL.revokeObjectURL(link.href);
        };
     },
       
  }
}
</script>

<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;
  }
  fieldset{
    border: none;
  }
  .down{
    color:  #606266;
    cursor: pointer;
    text-decoration: underline;
    display: flex;
    align-items: center;
    i{
      margin-left: 5px;
    }
  }
  
</style>
