<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    let permissionRoles = ['admin',2,8]
    const hasPermission = this.roles.some(role => {
      return permissionRoles.includes(role)
    })
    if(!hasPermission){
       this.currentRole = 'editorDashboard'
    }
  }
}
</script>

<style>
    .dashboard-container{
      height: 100%;
    }
</style>
