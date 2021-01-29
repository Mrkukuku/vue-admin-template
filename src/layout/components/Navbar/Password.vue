<template>
    <div>
       <el-dialog 
              title="修改密码" 
              :visible.sync="isOpen"
              width="25%"
              class='updateuserbox'>
                <el-form :model="ruleForm2" :rules="rules2" status-icon ref="ruleForm2" label-width="120px" class="demo-ruleForm">
                  <el-form-item label="原密码" prop="oldPassword">
                    <el-input type="password" v-model="ruleForm2.oldPassword" placeholder="请输入" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="ruleForm2.password" placeholder="6位至16位" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" placeholder="请输入" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitFormuser('ruleForm2')">保存</el-button>
                  </el-form-item>
                </el-form>
            </el-dialog>
    </div>
</template>

<script>
import { checkPsw,updatePsw } from '@/api/user'
export default {
    data() {
        var check = async (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
            await checkPsw({
                oldPassword:value,
                password:''
            }).then( res=>{
                if(res.data){
                    callback()
                }else{
                    callback(new Error('密码错误'));
                }
            })
        }
      };
        var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length<6||value.length>16){
            callback(new Error('请输入6位至16位密码'));
        }
        else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再一次输入密码'));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次密码不一致，请重新输入!'));
        } else {
          callback();
        }
      };
        return {
            ruleForm2:{
                oldPassword:'',//原密码
                password:'', //新密码
                checkPass:''//验证密码
            },
            rules2: {
                oldPassword:{required: true, validator: check, trigger: 'blur' },
                password: [{ required: true,validator: validatePass, trigger: 'blur' }],
                checkPass: [{ required: true,validator: validatePass2, trigger: 'blur'}],
            },
            isOpen:false
        }
    },
    methods: {
        submitFormuser(formName){
             this.$refs[formName].validate((valid) => {
              if (valid) {
                  updatePsw(this.ruleForm2).then(res =>{
                       this.isOpen = false
                       this.logout()
                       this.$message({
                        message:'修改成功',
                        type: 'success',
                        duration: 2 * 1000
                      })
                  })
              }
             })
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        },
        open(){
            this.isOpen = true
             Object.assign(this.$data.ruleForm2,this.$options.data().ruleForm2);
              this.$refs['ruleForm2'].clearValidate()
        }
    },
}
</script>

<style lang="scss" scoped>
    
</style>