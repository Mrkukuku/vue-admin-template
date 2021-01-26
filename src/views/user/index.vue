<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username " placeholder="名字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.departmentId " placeholder="部门" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.position" placeholder="职位" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in positionList" :key="item.key" :label="item.name" :value="item.key" />
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
      <el-table-column label="账号" prop="account"  align="center" width="160">
      </el-table-column>
      <el-table-column label="姓名" prop="username"  align="center" width="160">
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
          <el-button type="warning" icon="el-icon-star-off"  size="mini" @click="handleFreeze(row)">
            冻结
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row)">
          删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        
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
         <el-form-item  label="密码" prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="temp.password"
            :type="passwordType"
            placeholder=""
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
                            <!-- <el-button @click="FrozenReset('FrozenForm')">重置</el-button> -->
                            <el-button @click="closeFrozen">取 消</el-button>
                        </el-form-item>
                    </el-form>
            </el-dialog>
  </div>
</template>

<script>
import { fetchList,fetchPart } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { parseTime } from '@/utils'
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
    return {
      tableKey: 0,
      list: [],//列表
      total: 0,
      listLoading: false,//
      dialogFormVisible:false,
      passwordType: 'password',
      listQuery: {//
        pageNum: 1,
        pageSize: 20,
        departmentId: undefined,
        username: undefined,
        position : undefined,
      },
      importanceOptions: [],
      positionList:[
        {
          name:'主管',
          key:2
        },
        {
          name:'普通员工',
          key:3
        },
      ],
      calendarTypeOptions:[],
      temp: {
        departmentId:'',
        position:2,
        description: '',
        username: '',
        type: '',
        phone: '',
        part:'',
        account:'',
        password:'',
        email:''
      },
      rules: {
        account: [{ required: true, message: '请输入', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
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
          unitId:null   //冻结id
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
          disabledDate(date) {
              return date.getTime()+24*60*60*1000 < Date.now();
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
         
        }
      })
    },
    handleDel(){

      this.$confirm('你确定要删除吗').then(()=> {

      })
    },
    handleRest(){
       Object.assign(this.$data.listQuery,this.$options.data().listQuery);
       this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        remark: '',
        title: '',
        type: '',
        email:''
      }
    },
    handleFreeze(){
      this.FrozenVisible=true;
    },
     FrozenSubmit(name){ //封号冻结提交
        this.$refs[name].validate((valid)=>{
            if(valid){
                
            }
        })
    },
    closeFrozen(){  //关闭封号冻结框
        this.FrozenVisible=false;
        this.FrozenReset();
    },
    FrozenReset(){      //重置封号冻结原因    
      Object.assign(this.$data.FrozenForm,this.$options.data().FrozenForm);
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
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
</style>
