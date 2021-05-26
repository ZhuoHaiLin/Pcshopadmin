<template>
    <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card >
          <!-- 表格搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="GoodsList"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="GoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getaddpage"
            >添加商品</el-button>
        </el-col>
      </el-row>

        <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name"  label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" width="95px" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" width="95px" label="商品总量"></el-table-column>
        <el-table-column prop="add_time" width="170px" label="创建时间">
            <template slot-scope="scope">
                {{scope.row.add_time | dataFormat}}
            </template>
        </el-table-column>
       
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removegoodsById(scope.row.goods_id)"
            ></el-button>
           
          </template>
        </el-table-column>
      </el-table>

        <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>


        
    </el-card>
    
      
    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryInfo: {
                query: "",
                pagenum: 1, //当前显示的页数
                pagesize: 10, //每页显示的多少条数据
                },
                total:0,
                goodslist:[]
            }
        },
        created() {
            this.GoodsList()
        },
        methods: {
            //第几页的方法
            handleSizeChange(val){
                this.queryInfo.pagesize=val
                this.GoodsList()

            },
            //跳转第几页
            handleCurrentChange(val){
                this.queryInfo.pagenum=val
                this.GoodsList()
            },


            async GoodsList(){
               const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
               if(res.meta.status!==200){
                   return this.$message.error("获取商品数据失败")
               }
               this.goodslist=res.data.goods
               this.total=res.data.total

            },
            //删除商品的方法
          async  removegoodsById(id){
                 const confirmResult = await this.$confirm(
                    "此操作将永久删除数据, 是否继续?",
                    "提示",
                    {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    }
                ).catch(err=>err);
                if (confirmResult !== "confirm") {
                    return this.$message.info("取消删除");
                }

                const { data: res } = await this.$http.delete(`goods/${id}`);
                if (res.meta.status !== 200) {
                    return this.$.$message.error("删除商品失败");
                }

                this.$message.success("删除商品成功");

                this.GoodsList();

            },
            //路由跳转
            getaddpage(){
                this.$router.push("/goods/add")
            },

            showEditDialog(goods_id){
             this.$router.push({
                  path: '/goods/add',
                  query: {
                    id: goods_id
                  }
               })

            }

          
            
        },
        
    }
</script>

<style lang="scss" scoped>
.el-table{
    margin-top: 15px;
}

</style>