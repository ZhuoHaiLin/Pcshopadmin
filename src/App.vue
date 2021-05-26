<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'App',
  
}
</script>

<style>
 /* #app { */
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
  
   /* height: 100%;
   margin: 0;
  padding: 0;
  min-width: 1366px; */
/* } */

/* 全局样式 */
html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
    min-width: 1366px;
}
.el-card {
  margin-top: 15px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>
