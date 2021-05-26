<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 数据统计</el-breadcrumb-item>
      <el-breadcrumb-item> 数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
       <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    



    </div>
</template>

<script>
   import echars from 'echarts'
    export default {
        data() {
            return {
                
            }
        },
       async mounted() {
             var myChart = echars.init(document.getElementById('main'));
             const {data:res}= await this.$http.get('reports/type/1')
             if(res.meta.status!==200){
               return this.$message.error('获取数据失败')
             }

             myChart.setOption(res.data);
        },
    }
</script>

<style lang="scss" scoped>

</style>