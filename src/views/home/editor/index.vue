<template>
  <div class="dashboard-editor-container">
   <div class="select">
      <el-date-picker
      v-model="temp.year"
      type="year"
      value-format="yyyy"
      placeholder="年份">
      </el-date-picker>
      <el-select v-model="temp.uid" clearable class="filter-item" placeholder="人员" v-if="userFlag">
        <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
        <el-button  class="filter-item" style="margin-left: 10px;" type="primary"  @click="getTotal">
        搜索
      </el-button>
      <el-button  v-if="userFlag" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleRest">
        重置
      </el-button>
    </div>
    <panel-group :panel-data="panelData"/>
    <div class="title">任务统计</div>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:60%;" :height="height">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchTotal,fetchTaskNum } from '@/api/home'
import { fetchUser } from '@/api/contract'
import PanelGroup from './components/PanelGroup'
import LineChart from '../admin/components/LineChart'


export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
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
      panelData:{
      },
      height:'500px',
      temp:{
        uid:'',
        year:null,
        type:2,
      },
      userOptions:[],//人员列表
      userFlag:true
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
      }
      this.getTotal()
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getTotal(){
      fetchTotal(this.temp).then( res=>{
        this.panelData = res.data
      })
      fetchTaskNum(this.temp).then( res=>{
         this.lineChartData = res.data
         this.lineChartData.title = '数量'
      })
    },
     getUser(departmentId){//获取人员
      fetchUser({departmentId,position:3}).then( res =>{
        this.userOptions = res.data
      })
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
  }
  .title{
    margin-bottom: 10px;
    color: rgb(0,0,0,.6);
    font-size: 18px;
    font-weight: bolder;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
