<template>
  <el-container class="home_container">
    <!-- 头部导航 -->
    <el-header class="home_header">
      <div>
        <img src="../assets/logo.png" alt />
        <span>PC电商管理系统</span>
      </div>
      <el-button class="btn" type="info" size="default" @click="loginout"
        >退出</el-button
      >
    </el-header>

    <!-- 左边导航 -->
    <el-container v-model="isCollapse">
      <el-aside :width="isCollapse?'64px':'200px'"  >
         <!-- 点击关闭侧边栏按钮 -->
         <div class="OpeNoClass" @click="OpenNoClikc">|||</div>


    <!-- :default-active="activePath" 方法有bug  路由编程式跳转无法高亮 :default-active="$route.path"  -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="blue"
          unique-opened
         :collapse="isCollapse"
         :collapse-transition="false"
         router
         :default-active="activePath"
        >
          <!-- 最外层数据 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 第二次数据 -->
            <el-menu-item
              :index="'/'+item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
              @click="ActiveClick('/'+item2.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 中间内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      activePath:""
    };
  },
  methods: {
    loginout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    //获取菜单栏的数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.menuList = res.data;
    },
    OpenNoClikc(){
      this.isCollapse=!this.isCollapse
    },
    ActiveClick(path){
     // console.log('路由',path,this.$route.path)
      sessionStorage.setItem("activePath",path)
      this.activePath=path

    }
  },
  created() {
    this.getMenuList();
  },
};
</script>

<style  lang="scss" scoped>
.el-header {
  width: 100%;
  height: 30px;
  background-color: #2b4b6b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-left: 0;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 50px;
    height: 100%;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #2b4b6b;
}

.el-main {
  background-color: #eee;
}

.home_container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.el-menu{
  border:none
}
.OpeNoClass{
  background-color: #ccc;
  text-align: center;
  line-height: 25px;
  color: #000;
  cursor: pointer;
  letter-spacing: 0.2em;

}
</style>