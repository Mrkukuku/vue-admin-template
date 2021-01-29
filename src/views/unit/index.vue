<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name " placeholder="单位名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="单位名称" prop="name"  align="center" width="260">
      </el-table-column>
      <el-table-column label="负责人" prop="unitLeader"  align="center" width="160">
      </el-table-column>
      <el-table-column label="电话" prop="phone"  align="center" width="180">
      </el-table-column>
      
      <el-table-column label="操作" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="{row}" v-if="checkPermission(['admin'])">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDel(row.id)">
           删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
     
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 400px; margin-left:50px;">
         <el-form-item label="单位名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
         <el-form-item label="负责人" prop="unitLeader">
          <el-input v-model="temp.unitLeader" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="temp.phone"></el-input>
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
import { fetchList,addUnit,fetchDel} from '@/api/unit'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import checkPermission from '@/utils/permission'

export default {
  name: 'unit',
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
        name: '',
      },
      temp: {
        name: '',
        phone:'',
        unitLeader:''
      },
      rules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        phone: [{ required: false, message: '请输入', trigger: 'blur' }],
        unitLeader: [{ required: false, message: '请输入', trigger: 'blur' }],
      },
      textMap: {
        update: '修改单位信息',
        create: '新增单位信息'
      },
      dialogStatus:'create'
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
          addUnit(this.temp,this.dialogStatus).then( res =>{
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
  }
}
</script>

<style lang="scss" scoped>
  $dark_gray:#889aa4;
  .filter-container {
    padding-bottom: 10px;
  }
</style>
