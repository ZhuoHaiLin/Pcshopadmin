<template>
    <div> 
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
      <el-breadcrumb-item> 商品参数</el-breadcrumb-item>
    </el-breadcrumb>

   <!-- 内容信息 -->
   <el-card >

    <el-alert
    title="注意：只允许为第三级分类设置相关参数！"
    type="warning"
    show-icon
    :closable="false">
  </el-alert>

    <el-row class="rowopt">
        <el-col >
            <span>选择商品分类：</span>
            <el-cascader  
            style="width:25%"       
            v-model="selectkeys"
            :options="ParentCateList"
            :props="PropsPanent"
            clearable
            filterable
            @change="parmasCateChange"
           ></el-cascader>   
        </el-col>

    </el-row>
    
    <!-- tabs 标签页内容 -->
   <el-tabs type="border-card" v-model="activeName" @tab-click="handletabsClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button  style="margin-bottom: 15px;" type="primary" :disabled="isDisabled" size="mini" @click="addcatedialogVisible = true">添加参数</el-button>
            <!--动态属性的表格 -->
            <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand" >
                <template slot-scope="scope">
                     <!-- tag便签的循环的 方法 -->
                    <el-tag  v-for="(item,i) in scope.row.attr_vals" :key="i" closable  @close="handleClose(i,scope.row)">
                        {{item}}
                    </el-tag>
                    
                    <!-- 输入框的显示 -->
                    <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 按钮的点击 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    
                    
                </template>
            </el-table-column>       
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>         
            <el-table-column  label="操作">
                <template slot-scope="scope" >
                   <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeidtDialog(scope.row)">编辑</el-button>
                   <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                  
                </template>

            </el-table-column>
        </el-table>
        
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <el-button style="margin-bottom: 15px;"  type="primary" :disabled="isDisabled" size="mini" @click="addcatedialogVisible = true">添加属性</el-button>
         
           <!-- 静态属性的表格 -->
           <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand" >
                 <template slot-scope="scope">
                    <el-tag  v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
                        {{item}}
                    </el-tag>

                      <!-- 输入框的显示 -->
                    <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 按钮的点击 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                
                </template>

            </el-table-column>  
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>           
            <el-table-column  label="操作">
                <template  slot-scope="scope">
                   <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeidtDialog(scope.row)">编辑</el-button>
                   <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                  
                </template>

            </el-table-column>
        </el-table>
        </el-tab-pane>
  </el-tabs>

   </el-card>

        <!-- 添加商品参数的弹窗 -->
        <el-dialog
        :title="'添加'+textcontent"
        :visible.sync="addcatedialogVisible"
        width="50%"
        @close="addparamsClose"
        >
       <el-form :model="addruleForm" :rules="addrules" ref="addruleForm" label-width="100px" >
        <el-form-item :label="textcontent" prop="attr_name">
            <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcateClick">确 定</el-button>
        </span>
        </el-dialog>

         <!-- 编辑商品参数的弹窗 -->
        <el-dialog
        :title="'修改'+textcontent"
        :visible.sync="eidtcatedialogVisible"
        width="50%"
        @close="eidtparamsClose"
        >
       <el-form :model="eidtruleForm" :rules="eidtrules" ref="eidtruleForm" label-width="100px" >
        <el-form-item :label="textcontent" prop="attr_name">
            <el-input v-model="eidtruleForm.attr_name"></el-input>
        </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="eidtcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtcateClick">确 定</el-button>
        </span>
        </el-dialog>







    </div>
</template>

<script>
export default {
    data() {
        return {
            ParentCateList:[], //商品分类的信息
            PropsPanent:{       
                 expandTrigger:'hover',         
                 value:'cat_id',
                 label:'cat_name',
                 children:'children',
                // checkStrictly: true,               
             },  //级联选择的配置信息
             selectkeys:[], //选中的值
             activeName:"many" ,
             manyTableData:[],// 动态参数的数据
             onlyTableData:[], //静态属性的数据
             addruleForm:{}, //添加商品参数的数据对象
             addcatedialogVisible:false, //添加商品参数的弹窗值
             addrules:{
                 attr_name:[{ required: true, message: '请输入参数名称', trigger: 'blur' }]
             },
             eidtcatedialogVisible:false, //修改商品参数的弹窗值
             eidtruleForm:{} ,//修改商品参数的数据对象
             eidtrules:{
                 attr_name:[{ required: true, message: '请输入参数名称', trigger: 'blur' }]
             },
            
        }
    },
    created() {
        this.getParentCateList()
      
    },
    methods: {

         //获取商品分类的信息
        async getParentCateList(){
            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200)
            {
              return this.$message.error('获取父级分类失败')
            }
            this.ParentCateList=res.data
         },
         
        //  商品分类级联选择器的方法
       async  parmasCateChange(){
             if(this.selectkeys.length!==3){
                 this.selectkeys=[]
                 this.onlyTableData=[]
                 this.manyTableData=[]
                 return
             }

           this.getParamsData()

         },
        //  tabs标签页的方法
         handletabsClick(){
           this.getParamsData()
         
         },
          
          //获取分类的数据
        async getParamsData(){

              const {data:res} =await this.$http.get(`categories/${this.idcateId}/attributes`,{params:{sel:this.activeName}}) 
           if(res.meta.status!==200){
              return this.$message.error("获取分类信息失败")
           }
           
            res.data.forEach(item => {
               item.attr_vals= item.attr_vals? item.attr_vals.split(' '):[]
               item.inputVisible=false,
               item.inputValue=''          
            });

            console.log(res.data)
           if(this.activeName==='many'){
              this.manyTableData=res.data
           }else{
              this.onlyTableData=res.data
           }
             
         },
         
         //关闭清空文本框的数据
         addparamsClose(){
             this.$refs.addruleForm.resetFields()
         },
         eidtparamsClose(){
            this.$refs.eidtruleForm.resetFields()
         },
         
        //  新增的提交方法
         addcateClick(){

            this.$refs.addruleForm.validate(async valid=>{
                  if(!valid) return
            const {data:res}=await  this.$http.post(`categories/${this.idcateId}/attributes`,
             {attr_name:this.addruleForm.attr_name,
              attr_sel:this.activeName})
              if(res.meta.status!==201){
                  return this.$message.error('添加失败')
              }
              this.$message.success("添加成功")
              this.getParamsData()
              this.addcatedialogVisible=false

            })
           

         },
         
         //修改弹窗的方法
        async showeidtDialog(row){
            const {data:res}=await this.$http.get(`categories/${this.idcateId}/attributes/${row.attr_id}`,{params:{attr_sel:this.activeName}})
             if(res.meta.status!==200){
                 return this.$message.error("获取参数失败")
             }
             this.eidtruleForm=res.data
            
            this.eidtcatedialogVisible=true

         },
         
         //修改的提交方法
         eidtcateClick(){
             this.$refs.eidtruleForm.validate(async valid=>{
                 if(!valid) return
               const {data:res}=await  this.$http.put(`categories/${this.idcateId}/attributes/${this.eidtruleForm.attr_id}`,
                 {attr_name:this.eidtruleForm.attr_name,
                  attr_sel:this.activeName})
                  if(res.meta.status!==200){
                      return this.$message.error("修改失败")
                  }
                  this.$message.success('修改成功')
                  this.getParamsData()
                  this.eidtcatedialogVisible=false

             })
            
         },
         
         //删除提交的方法
       async  deleteParams(row){
             
        const confirmResult= await this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }

          const {data:res}=  await  this.$http.delete(`categories/${this.idcateId}/attributes/${row.attr_id}`)
            if(res.meta.status!==200)
            {
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getParamsData()
         },
         
        //  回车或者焦点离开事件
         handleInputConfirm(row){

            //  输入不正确的数据时
           if(row.inputValue.trim().length===0){
               row.inputValue=''
               row.inputVisible=false
               return
           }
          
           row.attr_vals.push(row.inputValue.trim())
           row.inputValue='',
           row.inputVisible=true

           this.eidtattr_valsClick(row)

         }, 

        async eidtattr_valsClick(row){
           const {data:res}= await this.$http.put(`categories/${this.idcateId}/attributes/${row.attr_id}`,
               {attr_name:row.attr_name,
               attr_sel:row.attr_sel,
               attr_vals:row.attr_vals.join(' ')}
           )
           if(res.meta.status!==200){
               return this.$message.error("失败")
           }
            this.$message.success('成功')
         },
        
        // 删除tag的方法
       async handleClose(i,row){
           

        const confirmResult= await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(confirmResult!=="confirm"){
           return  this.$message.info("取消删除")
        }

           row.attr_vals.splice(i,1)
           this.eidtcateClick(row)

        },
         //单击方法  
         showInput(row){
             row.inputVisible=true
             // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })

         }


        
    },

    computed:{
        isDisabled(){
            if(this.selectkeys.length!==3){
                return true
            }
            return false
        },

       // 获取分类的id
        idcateId(){
            if(this.selectkeys.length===3){
                return this.selectkeys[2]
            }
            return null
        },
        //动态参数和静态属性名称
        textcontent(){
            if(this.activeName==='many'){
               return '动态参数'
            }
            return '静态属性'
        }


    }

}
</script>

<style lang="scss" scoped>

.rowopt{
margin: 15px 0px;
}
.el-tag{
   margin: 10px 15px;

}
.input-new-tag{
    width:120px;
   
}
</style>