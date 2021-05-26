<template>
    <div>
           <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
        <el-row >
            <el-col :span="8">
            <el-input
            placeholder="请输入内容"
            clearable
            @clear="GetOrderList"
            v-model="queryInfo.query"
            class="input-with-select"
            >
            <el-button
            slot="append"
            icon="el-icon-search"
            @click="GetOrderList"
            ></el-button>
            </el-input>

            </el-col>
            
        </el-row>

         <el-table :data="getOrderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number"  label="订单编号"></el-table-column>
        <el-table-column prop="order_price"  label="订单价格"></el-table-column>
         <el-table-column prop="pay_status"  label="是否付款">
            <template slot-scope="scope">
               <el-tag v-if="scope.row.pay_status==='1'">已付款</el-tag>
               <el-tag v-else type="danger">未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send"  label="是否发货">
           
        </el-table-column>
        <el-table-column prop="create_time"  label="下单时间">
            <template slot-scope="scope">
              {{scope.row.create_time | dataFormat}}
            </template>
        </el-table-column>
       
       
        <el-table-column  label="操作">
          <template >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              circle
              @click="showLogistics"
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

<el-dialog
  title="修改地址"
  :visible.sync="addressdialogVisible"
  width="50%"
  @close="addressClose"
  >

  <el-form :model="addressruleForm" :rules="addressrules" ref="addressruleFormref" label-width="100px" >
  <el-form-item label="省市区/县" prop="address">
    <el-cascader style="width:100%"
    v-model="addressruleForm.address"
    :options="cityData"
    
    @change="handleChange"></el-cascader>

  </el-form-item>

  <el-form-item label="详细地址" prop="address1">
    <el-input v-model="addressruleForm.address1"></el-input>
  </el-form-item>

</el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addressdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
    
    <!-- 物流展示 -->
    <el-dialog
  title="物流展示"
  :visible.sync="logisticsdialogVisible"
  width="50%"
  >
<el-timeline>
    <el-timeline-item
      v-for="(activity, index) in logisticsInfo"
      :timestamp="activity.ftime"
      :key="index">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

  <span slot="footer" class="dialog-footer">
    <el-button @click="logisticsdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="logisticsdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>


    </div>
</template>

<script>
import  cityData from '../Order/citydata.js'
import axios from 'axios'
    export default {
        data() {
            return {
                queryInfo: {
                query: "",
                pagenum: 1, //当前显示的页数
                pagesize: 10, //每页显示的多少条数据
                },
                total:0,
                getOrderList:[],
                addressdialogVisible:false,
                addressruleForm:{
                    address:[],
                    address1:''
                },
                addressrules:{
                    address:[{ required: true, message: '请选择城市', trigger: 'blur' }],
                    address1:[{ required: true, message: '请输入地址', trigger: 'blur' }]
                },
                cityData,
                logisticsdialogVisible:false,
                logisticsInfo:[]
                
                
            }
        },
        created() {
            this.GetOrderList()
        },
        methods: {
           async GetOrderList(){
               const {data:res}=await this.$http.get('/orders',{params:this.queryInfo})
               if(res.meta.status!==200){
                   return this.$message.error('获取订单数据失败')
               }
               this.getOrderList=res.data.goods
               this.total=res.data.total

            //    console.log(this.getOrderList)
            },
          
            //第几页
            handleSizeChange(val){
                this.queryInfo.pagesize=val
                this.GetOrderList()

            },
            //跳转第几页
            handleCurrentChange(val){
                this.queryInfo.pagenum=val
                this.GetOrderList()

            },
            showDialog(){
                this.addressdialogVisible=true

            },
            removegoodsById(){

            },
            handleChange(){

            },
            addressClose(){
                this.$refs.addressruleFormref.resetFields();

            },

          async  showLogistics(){
             
              //  const { data: res } = await this.$http.get('/kuaidi/1106975712662')
              // if (res.meta.status !== 200) {
              //   return this.$message.error('获取物流进度失败!')
              // }

              const instance =axios.create({
                    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
                    timeout: 1000,
                    headers:{'Authorization':window.sessionStorage.getItem('token')}
                  });

                  instance.get("/kuaidi/1106975712662").then((res)=>{
                    if(res.data.meta.status!==200){
                      return this.$message.error('获取物料信息失败')
                    }
                    this.$message.success('获取物料信息成功')
                    this.logisticsInfo=res.data.data
                    
                  })
              
              this.logisticsdialogVisible=true
              


            }
            
        },
        
    }
</script>

<style lang="scss" scoped>
.el-table{
    margin: 15px 15px;
}

</style>