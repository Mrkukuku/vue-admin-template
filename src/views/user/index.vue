<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username " placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.departmentId " placeholder="部门" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.position" placeholder="职位" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary"  @click="handleCreate">
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
      <el-table-column label="账号" prop="account"  align="center" width="160">
      </el-table-column>
      <el-table-column label="姓名" prop="username"  align="center" width="160">
      </el-table-column>
      <el-table-column label="部门"  align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.departmentId&&calendarTypeOptions[row.departmentId-1].name||'' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" prop="position"  align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.position==1&&'总经理'|| row.position==2&&'主管'|| row.position==3&&'普通员工'||'' }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="电话" prop="phone"  align="center" width="180">
      </el-table-column>
      
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" icon="el-icon-star-off" v-if="row.isFrozen" size="mini" @click="handlethaw(row)" :disabled="row.position==1">
           解冻
          </el-button>
          <el-button type="warning" icon="el-icon-star-off"  v-else size="mini" @click="handleFreeze(row.id)" :disabled="row.position==1">
            冻结
          </el-button>
          <el-button type="warning" icon="el-icon-star-off"  size="mini" @click="handleReset(row.id)" :disabled="row.position==1&&!checkPermission(['admin'])">
            重置密码
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)" :disabled="row.position==1">
           删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px" style="width: 400px; margin-left:50px;">
         <el-form-item label="部门" prop="departmentId" v-if="temp.position!=1">
          <el-select v-model="temp.departmentId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
         <el-form-item label="职位" prop="position" v-if="temp.position!=1">
          <el-select v-model="temp.position" class="filter-item" placeholder="请选择">
            <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
         <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
         <el-form-item  label="密码" prop="password" v-if="dialogStatus=='create'">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="temp.password"
            :type="passwordType"
            placeholder="6位至16位"
            name="password"
            tabindex="2"
            auto-complete="on"
            autoComplete="new-password"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
      </el-form-item>
         <el-form-item label="姓名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="temp.phone"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" type="textarea" />
        </el-form-item>
         <el-form-item label="头像">
           <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
             :http-request="handleSuccess"
            
            >
            <img v-if="temp.avatar" :src="temp.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
     <!-- 冻结弹框 -->
      <el-dialog
          title="冻结账号"
          :visible.sync="FrozenVisible"
          width="30%"
          :close-on-click-modal="false"
          :before-close="closeFrozen">
              <el-form :rules="rulesFrozen" :model="FrozenForm" :data="FrozenForm" status-icon  ref="FrozenForm" label-width="130px" class="demo-ruleForm FrozenForm">
                  <el-form-item label="冻结时间" prop="time">
                      <el-date-picker
                          v-model="FrozenForm.time"
                          type="datetimerange"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          :picker-options="expireTimeOption"
                          >
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="封号原因" prop="frozenDesc">
                      <el-input type="textarea" v-model="FrozenForm.frozenDesc"></el-input>
                  </el-form-item>
                  <el-form-item class="formfooter">
                      <el-button type="primary" @click="FrozenSubmit('FrozenForm')">冻结</el-button>
                      <el-button @click="closeFrozen">取 消</el-button>
                  </el-form-item>
              </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { fetchList,fetchPart,addUser,fetchDel,fetchFrozen,fetchUnFrozen,fetchReset} from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { timeFormat } from '@/utils'
import checkPermission from '@/utils/permission'

export default {
  name: 'user',
  components: { Pagination },
  directives: { waves },
  data() {
     var phone=(rule, value, callback)=>{
            if(value){
                var phone = /^0\d{2,3}-\d{7,8}$/;
                var mobile=/^1[3|5|8|4|6|7|9]\d{9}$/;
                if(phone.test(value)||mobile.test(value)){
                    callback();
                }else{
                    callback(new Error('手机号格式出错'));
                }
            }else{
                callback();
            }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length<6||value.length>16){
            callback(new Error('请输入6位至16位密码'));
        }
        else {
          callback();
        }
      };
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: true,//
      dialogFormVisible:false,
      passwordType: 'password',
      listQuery: {//
        pageNum: 1,
        pageSize: 10,
        departmentId: undefined,
        username: undefined,
        position : undefined,
      },
      importanceOptions:[],
      positionList:[
        {
          name:'主管',
          id:2
        },
        {
          name:'普通员工',
          id:3
        },
      ],
      calendarTypeOptions:[],
      temp: {
        departmentId:'',
        position:3,
        description: '',
        username: '',
        phone:'',
        account:'',
        password:'',
        email:'',
        avatar:''
      },
      rules: {
        account: [{ required: true, message: '请输入', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur',validator:validatePass}],
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择', trigger: 'blur' }],
        position: [{ required: true, message: '请选择', trigger: 'blur' }],
        phone: [{validator: phone, required: false, trigger: 'blur' },],
        email: [ {required: false,type:'email', message: '邮箱格式不正确', trigger: 'change' },],
      },
      FrozenVisible:false,
      FrozenForm:{    //冻结表单
          time:'',    //冻结时间
          frozenDesc:'',//冻结原因
          uid:null,  //冻结id
          frozenEndTime:'',
          frozenStartTime:''
      },
      rulesFrozen:{   //表格验证字段
          time: [
              {required: true, message: '冻结时间', trigger: 'blur' }
          ],
          frozenDesc: [
              {required: true, message: '冻结原因', trigger: 'blur' }
          ],
      },
      expireTimeOption: {//时间范围
          disabledDate(time) {
              return time.getTime() <Date.now() - 8.64e7;
          }
        },
      textMap: {
        update: '修改人员信息',
        create: '新增人员信息'
      },
      dialogStatus:'create'
    }
  },
  created() {
    this.getList()
    this.getPart()
  },
  methods: {
    checkPermission,
     showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getList(){//获取列表
      fetchList(this.listQuery).then(res=>{
        this.list = res.list
        this.total = res.total
        this.listLoading =false
      })
    },
    getPart(){//获取部门
      fetchPart().then(res =>{  
        this.calendarTypeOptions = res.data
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
          addUser(this.temp,this.dialogStatus).then( res =>{
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
    handleReset(uid){
      this.$confirm('你确定要重置密码吗').then(()=> {
        fetchReset({uid}).then( res=> {
           this.$message({
              message:'重置成功',
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
    handleFreeze(id){
      this.FrozenVisible=true;
      this.FrozenForm.uid = id
    },
     FrozenSubmit(name){ //封号冻结提交
        this.$refs[name].validate((valid)=>{
            if(valid){
                this.FrozenForm.frozenStartTime =  this.FrozenForm.time[0]
                this.FrozenForm.frozenEndTime =  this.FrozenForm.time[1]
                fetchFrozen(this.FrozenForm).then( res=>{
                  this.getList()
                   this.FrozenVisible=false;
                  this.$message({
                      message:'冻结成功',
                      type: 'success',
                      duration: 2 * 1000
                    })
                })
            }
        })
    },
    closeFrozen(){//关闭封号冻结框
        this.FrozenVisible=false;
        this.FrozenReset();
    },
    FrozenReset(){//重置封号冻结原因    
      Object.assign(this.$data.FrozenForm,this.$options.data().FrozenForm);
    },
    handlethaw(row){
      this.$confirm(`冻结时间为${timeFormat(row.frozenStartTime,'HH:mm:ss')}-${timeFormat(row.frozenEndTime,'HH:mm:ss')} 冻结理由为:${row.frozenDesc}`).then(()=> {
        fetchUnFrozen({
          frozenDesc :row.frozenDesc,
          frozenEndTime : row.frozenEndTime,
          frozenStartTime : row.frozenStartTime,
          uid:row.id,
        }).then( res=> {
           this.getList()
           this.$message({
              message:'解冻成功',
              type: 'success',
              duration: 2 * 1000
            })
        })
      })
    },
    handleSuccess (file) {
        let formdata = new FormData(); 
        formdata.append('file',file.file );
        formdata.append('fileType',2);
    },
  }
}
</script>

<style lang="scss" scoped>
  $dark_gray:#889aa4;
    .filter-container {
    padding-bottom: 10px;
  }
  .password{
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
