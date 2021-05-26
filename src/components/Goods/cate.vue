<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 表格搜索栏 -->
      <el-row >
          <el-col >
               <el-button type="primary" @click="showaddcateClick"
            >添加分类</el-button>
          </el-col>
      </el-row>

      <tree-table 
      style="margin-top:15px"
      :selection-type="false"
      :expand-type="false"
       show-index
       index-text="#"
      :data="goodsList" 
       border
      :columns="columns">

       <template slot="isok" slot-scope="scope">
           <i style="color: lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
           <i style="color: red" v-else class="el-icon-error"></i>
       </template>

        <template slot="order" slot-scope="scope">
           <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
           <el-tag size="mini" v-if="scope.row.cat_level===1" type="success">二级</el-tag>
           <el-tag size="mini" v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
       </template>

       <template slot="opt" slot-scope="scope">
           <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeidtcate(scope.row)">编辑</el-button>
           <el-button type="danger" size="mini" icon="el-icon-delete" @click="delectcate(scope.row)">删除</el-button>
       </template>

      </tree-table>

     

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    
    <!-- 添加分类信息 -->
    <el-dialog
  title="添加分类"
  :visible.sync="addcatedialogVisible"
  width="50%"
  @close="addcateClose"
  >
  <el-form :model="addcateruleForm" :rules="addcaterules" ref="addcateruleForm" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addcateruleForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" >

    <el-cascader
      style="width:100%"
    v-model="selectkeys"
    :options="ParentCateList"
    :props="PropsPanent"
    clearable
    filterable
    @change="ParentCateChange"></el-cascader>
    
  </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addcatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>


  <!-- 编辑分类信息 -->
    <el-dialog
  title="编辑分类"
  :visible.sync="eidtcatedialogVisible"
  width="50%"
  @close="eidtcateClose"
  >
  <el-form :model="eidtcateruleForm" :rules="eidtcaterules" ref="eidtcateruleForm" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="eidtcateruleForm.cat_name"></el-input>
  </el-form-item>
  
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="eidtcatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="eidtCate">确 定</el-button>
  </span>
</el-dialog>




    </div>
</template>

<script>
export default {
     data() {
         return {
             goodsList:[],
             queryInfo:{
                 type:3,
                 pagenum:1,//当前页码
                 pagesize:5 //一页多少条
             },
             columns:[
                 {
                    label: '商品分类',
                    prop: 'cat_name',         
                 },{
                     label:'是否有效',
                     type:'template', //将当前的列定义为模板列
                     template:'isok' //模板列的名称

                 },{
                     label:'排序',
                     type:'template', //将当前的列定义为模板列
                     template:'order' //模板列的名称

                 },{
                     label:'操作',
                     type:'template', //将当前的列定义为模板列
                     template:'opt' //模板列的名称

                 }
             ],

             total:0,//当前页码总数
             addcatedialogVisible:false,  //分类新增显示的值
             eidtcatedialogVisible:false,
             addcateruleForm:{
                 cat_name:"", //添加分类名称
                 cat_pid:0,
                 cat_level:0  //等级分类0默认为1级
             },
             addcaterules:{
                cat_name:[{ required: true, message: "请输入分类名称", trigger: "blur" }] 
             },
             ParentCateList:[], //父级分类的信息
             PropsPanent:{
                 expandTrigger: 'hover',
                 value:'cat_id',
                 label:'cat_name',
                 children:'children',
                 checkStrictly: true,               
             },  //级联选择的配置信息
             selectkeys:[], //选中的值

             eidtcaterules:{
                 cat_name:[{ required: true, message: "请输入分类名称", trigger: "blur" }] 
             },
             eidtcateruleForm:'' //编辑添加分类的对象



         }
     },
     created(){
         this.getGoodsList()

     },
     methods: {

        async getGoodsList(){

           const {data:res}= await this.$http.get("categories",{params:this.queryInfo})
           
           if(res.meta.status!==200){
               return this.$message.error('获取分类失败');
           }
         //  this.$message.success("获取分类成功")
           this.goodsList=res.data.result
           this.total=res.data.total
         },
         
        //  翻页的方法
         handleSizeChange(value){
             this.queryInfo.pagesize=value
             this.getGoodsList()

         },
         //当前第几页
         handleCurrentChange(value){
             this.queryInfo.pagenum=value
             this.getGoodsList()
         },
         
         //显示新增弹窗的信息
         showaddcateClick(){
             this.getParentCateList()

             this.addcatedialogVisible=true

         },
         //获取父级分类的信息
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200)
            {
              return this.$message.error('获取父级分类失败')
            }

            this.ParentCateList=res.data
         },

         //选中父级分类触发的方法
         ParentCateChange(){
            if(this.selectkeys.length>0){ //获取父级分类的id最后一个的id值
               this.addcateruleForm.cat_pid= this.selectkeys[this.selectkeys.length-1]
               this.addcateruleForm.cat_level=this.selectkeys.length
               return
            }else{ //没有选择的时候
               this.addcateruleForm.cat_pid=0
               this.addcateruleForm.cat_level=0
            }

         },
         //添加分类新增提交的方法
         addCate(){
            console.log(this.selectkeys)
            this.$refs.addcateruleForm.validate(async valid=>{
                 if(!valid) return
              const {data:res}=await  this.$http.post("categories",this.addcateruleForm)
                 if(res.meta.status!==201){
                     return this.$message.error('添加分类失败')
                 }
                 this.$message.success("添加分类成功")
                 this.getGoodsList()
                 this.addcatedialogVisible=false
                

            })


         },
         
        //  关闭清空的方法
         addcateClose(){ 
             this.$refs.addcateruleForm.resetFields()
             this.selectkeys=[],
             this.addcateruleForm.cat_pid=0,
             this.addcateruleForm.cat_level=0
         },

         eidtcateClose(){
              this.$refs.eidtcateruleForm.resetFields()
         },
          
         //编辑显示
       async  showeidtcate(row){

            const {data:res} =await this.$http.get(`categories/${row.cat_id}`)
             if(res.meta.status!==200){
                 return this.$message.error('查询分类失败')
             }

             this.eidtcateruleForm=res.data
             this.eidtcatedialogVisible=true
         },
         
        //  分类编辑提交的方法
         eidtCate(){
             this.$refs.eidtcateruleForm.validate(async valid=>{
                if(!valid) return
               const {data:res}= await this.$http.put('categories/'+this.eidtcateruleForm.cat_id,{cat_name:this.eidtcateruleForm.cat_name})
                  if(res.meta.status!==200){
                      return this.$message.error('修改失败')
                  }
                  this.$message.success("修改成功")
                  this.getGoodsList()
                  this.eidtcatedialogVisible=false
             })

         },
         //分类删除的方法
        async delectcate(row){

            const confirmResult=await this.$confirm( "此操作将永久删除分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch(err=>err);
        if(confirmResult!=="confirm"){
            return this.$message.info('取消删除')
        }

            const {data:res} =await this.$http.delete('categories/'+row.cat_id)
           if(res.meta.status!==200) return this.$message.error("删除分类失败")
           
           this.$message.success('删除分类成功')
           this.getGoodsList()


         
         }


     },
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>