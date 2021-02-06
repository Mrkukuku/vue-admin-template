<template>
  <div class="dashboard-editor-container">
    <div class="select">
      <el-date-picker
      v-model="temp.year"
      type="year"
      value-format="yyyy"
      placeholder="年份">
      </el-date-picker>
      <el-select v-model="temp.departmentId" clearable @change="getUsers" class="filter-item" placeholder="部门" v-if="departmenFlag">
        <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
        <el-select v-model="temp.uid"  clearable class="filter-item" placeholder="人员" v-if="userFlag">
        <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
       <el-button  class="filter-item" style="margin-left: 10px;" type="primary"  @click="getTotal" v-loading.fullscreen.lock="fullscreenLoading">
        搜索
      </el-button>
      <el-button  v-if="userFlag" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleRest">
        重置
      </el-button>
    </div>
    <panel-group :panel-data="panelData"/>
    <!-- <div class="title">收入统计</div> -->
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:300px">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <div class="title">合同统计</div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:300px">
        <bar-chart :chart-data="barChartData" />
    </el-row> -->
    
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
            <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
         <bar-chart :chart-data="barChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="{span: 24}"  :sm="{span: 24}" :md="{span: 24}" :lg="{span: 8}" :xl="{span: 8}" class="remind">
        <transaction-table :lables="'合同到期提醒'" :type="1"/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}" class="remind">
       <transaction-table  :lables="'项目完成提醒'" :type="2"/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 8}" class="remind">
        <transaction-table :lables="'收付款提醒'"  :type="3"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchTotal,fetchRevenue,fetchCount, } from '@/api/home'
import { fetchUser } from '@/api/contract'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    BarChart,
    TransactionTable
  },
   computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      lineChartData: {
        "countList":[0,0],"monthList":["1月","2月",'3月']
      },
      barChartData:{"countList":[0,0],"monthList":["1月","2月",'3月']},
      panelData:{
      },
      temp:{
        departmentId:'',
        uid:'',
        year:null,
        type:1,
        pageSize:1000,
        pageNum:1,
      },
       calendarTypeOptions:[//部门列表
        {
          id:2,
          name:'商务部'
        },
        {
          id:8,
          name:'投标部'
        },
      ],
      userOptions:[],//人员列表
      userFlag:true,
      departmenFlag:false,
      fullscreenLoading:false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      if(this.userInfo.position==3){
        this.userFlag = false
        this.temp.uid = this.userInfo.id
      }else if(this.userInfo.position==2){
        this.getUser(this.userInfo.departmentId,'')
      }else{
        this.departmenFlag = true
      }
      this.getTotal()
    },
     getTotal(){
      this.fullscreenLoading = true
      let p = fetchTotal(this.temp).then( res=>{
        this.panelData = res.data
      })
      let p1= fetchRevenue(this.temp).then( res=>{
        this.lineChartData = res.data
        this.lineChartData.title = '收入'
         this.fullscreenLoading = false
      })
      let p2= fetchCount(this.temp).then( res=>{
        this.barChartData = res.data
      })
      
      Promise.all([p,p1,p2]).then(res=>{
         this.fullscreenLoading = false
      }).catch(error =>{
         this.fullscreenLoading = false
      })
    },
    getUser(departmentId){//获取人员
      fetchUser({departmentId,position:3}).then( res =>{
        this.userOptions = res.data
      })
    },
    getUsers(departmentId){//获取人员
      this.temp.uid = ''
      if(departmentId){
        fetchUser({departmentId,position:''}).then( res =>{
          this.userOptions = res.data
        })
      }
    },
    handleRest(){
       Object.assign(this.$data.temp,this.$options.data().temp);
       this.getTotal()
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    height: 316px;
    box-sizing: border-box;
  }
  .title{
    margin-bottom: 10px;
    color: rgb(0,0,0,.6);
    font-size: 18px;
    font-weight: bolder;
  }
  .remind{
    margin-bottom:30px;height:350px
  }
}
</style>
