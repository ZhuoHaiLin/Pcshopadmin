<template>
    <div>
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card >

   <el-alert
    title="添加商品信息"
    type="info"
    center
    :closable='false'
    show-icon>
  </el-alert>

   <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
  </el-steps>

<el-form :model="addForm" :rules="addrules" ref="ruleForm" label-width="100px" label-position='top'>
 <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave='beforeLeave' @tab-click="TabClick">
    <el-tab-pane label="基本信息" name="0">
         <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
            v-model="addForm.goods_cat"
            :options="CateList"
            :props="CateProps"
            @change="handleChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
         <el-form-item label="商品价格" prop="goods_price">
            <el-input type="number" v-model="addForm.goods_price"></el-input>
        </el-form-item>
         <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
        </el-form-item>
         <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
        </el-form-item>
        
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
        <el-form-item v-for="item in manytableData" :key="item.attr_id" :label="item.attr_name">
    <el-checkbox-group v-model="item.attr_vals">

    <el-checkbox border v-for="(item1,index) in item.attr_vals" :key="index" :label="item1"></el-checkbox>
  
  </el-checkbox-group>

  </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
    <el-form-item v-for="item in onlytableData" :key="item.attr_id" :label="item.attr_name">
      <el-input v-model="item.attr_vals" ></el-input>
    </el-form-item>

    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
    <el-upload
  :action="uploadURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  :headers="headersObj"
  :file-list="addForm.pics"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <!-- <i class="el-icon-plus"></i> -->
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
         <quill-editor v-model="addForm.goods_introduce"></quill-editor>

         <el-button type="primary" class="btnAdd" @click="addorder">添加商品</el-button>
         
    </el-tab-pane>
  </el-tabs>

</el-form>
      
    </el-card>

<!-- 图片预览 -->
 <el-dialog title="图片预览"  width="50%" :visible.sync="previewVisible" >
  <img width="100%" :src="previewPath" alt="">
</el-dialog>



    </div>
</template>

<script>
import _ from 'lodash'
    export default {
        data() {
            return {
                activeIndex:'0',
                 addForm:{
                     goods_name:'',
                     goods_price:1,
                     goods_weight:1,
                     goods_number:1,
                     goods_cat:[],
                     pics:[],
                     goods_introduce:'', //商品详情
                     attrs:[]
                 },
                 addrules:{
                     goods_name:[
                          { required: true, message: '请输入商品名称', trigger: 'blur' }
                     ],
                     goods_price:[
                          { required: true, message: '请输入商品价格', trigger: 'blur' }
                     ],
                     goods_weight:[
                          { required: true, message: '请输入商品重量', trigger: 'blur' }
                     ],
                     goods_number:[
                          { required: true, message: '请输入商品数量', trigger: 'blur' }
                     ],
                     goods_cat:[
                          { required: true, message: '请选择商品分类', trigger: 'blur' }
                     ]
                 },
                 CateList:[], //商品分类的信息
                 CateProps:{
                     value: 'cat_id',
                     label: 'cat_name',
                     children:'children',
                     expandTrigger: 'hover'
                 },

                 manytableData:[],
                 onlytableData:[],
                 uploadURL:'https://www.liulongbin.top:8888/api/private/v1/upload',
                 headersObj:{
                     Authorization: window.sessionStorage.getItem('token')
                 },
                 previewPath:'',
                 previewVisible:false,
                 attrs:[]

            }
           
        },
        created() {
            this.getCateList()
         //   console.log(this.$route.query.id)
         this.eidtOrder()

        },
        methods: {
           async getCateList(){
                const {data:res}=await this.$http.get('categories')   
                  if(res.meta.status!==200){
                      return this.$message.error("获取商品分类失败")
                  }
                  this.CateList=res.data
                
            },
            // 级联的选中方法
            handleChange(){
                if(this.addForm.goods_cat.length!==3){
                    this.addForm.goods_cat=[]
                }

                console.log("级联数组",this.addForm.goods_cat)

            },
            //tag切换的事件
            beforeLeave(activeName, oldActiveName){
                if(oldActiveName==='0'&&this.addForm.goods_cat.length!==3){
                    this.$message.error("请选择商品分类")
                    return false
                }
            },
            // tag的点击方法
           async TabClick(){

                if(this.activeIndex==='1'){
                   const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                   if(res.meta.status!==200){
                       return this.$message.error('获取商品动态参数失败')
                   }
                   res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length>0?item.attr_vals.split(' '):[]
                   })
 
                   this.manytableData=res.data
                  // console.log(res.data)
                }
                else if(this.activeIndex==='2'){
                     const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                   if(res.meta.status!==200){
                       return this.$message.error('获取商品动态参数失败')
                   }
                 
                   //console.log(res.data)
                   this.onlytableData=res.data

                }
                
            },
            // 预览图片
            handlePreview(file){
                this.previewPath=file.response.data.url
                this.previewVisible=true

            },
            //删除图片
            handleRemove(file){
                //1、查找file里面的上传图片路径
                const filePath=file.response.data.tmp_path
                ///2、根据图片路径查找addFrom.pics 返回的索引值
                const i= this.addForm.pics.findIndex(item=>item.pic===filePath)
                //3、通过数组删除splice方法删除图片
                this.addForm.pics.splice(i,1)
               // console.log(this.addForm.pics)

            },
            //上传成功的世界
            handleSuccess(response){
                const picsobj={
                    pic:response.data.tmp_path
                }
                this.addForm.pics.push(picsobj)
               //console.log(this.addForm)

            },
            addorder(){
                this.$refs.ruleForm.validate(async valid => {
                    if(!valid){
                        return this.$message.error('请填写表单必要项！')
                    }
                    // 发送请求前：需对提交的表单进行处理goods_cat attrs
                    // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
                    // 以上写法不对：级联选择器绑定的对象goods_cat要求是数组对象
                    // 解决办法: 包：lodash 方法（深拷贝）：cloneDeep(boj)

                    // 将this.addForm进行深拷贝
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    this.manytableData.forEach(item=>{
                        const newinfo={
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newinfo)
                    })
                    this.onlytableData.forEach(item=>{
                        const newinfo={
                            attr_id:item.attr_id,
                            attr_value:item.attr_vals
                        }
                        this.addForm.attrs.push(newinfo)
                    })

                    form.attrs=this.addForm.attrs
                    
                  const {data:res}=await this.$http.post('goods',form)
                  if(res.meta.status!==201){
                      return this.$message.error("添加商品失败")
                  }
                  this.$message.success("添加商品成功")
                  this.$router.push("/goods")
                })

            },

           async eidtOrder(){
               if(!this.$route.query.id){
                  return
               }
               const {data:res}=await this.$http.get(`goods/${this.$route.query.id}`)
               if(res.meta.status!==200){
                  return this.$message.error("查询商品失败")
               }
               console.log(res.data)
                 const car=res.data.goods_cat.split(',');

                this.addForm.goods_cat=car.map(Number)
                this.addForm.goods_name=res.data.goods_name
                this.addForm.goods_price=res.data.goods_price
                this.addForm.goods_weight=res.data.goods_weight
                this.addForm.goods_number=res.data.goods_number
                this.addForm.goods_introduce=res.data.goods_introduce
                res.data.pics.forEach(item=>{
                    const obj={
                        url:item.pics_big_url,
                        name:item.pics_id

                    }
                    this.addForm.pics.push(obj)
                    
                    

                })

                console.log("form",this.addForm)
            
            }

           
            
        },
        computed:{
            cateId(){
                if(this.addForm.goods_cat.length===3){
                    return this.addForm.goods_cat[2]

                }
                return null
            }

        }
        
        
    }
</script>

<style lang="scss" scoped>
.el-steps{
    margin: 15px 0px;
   /deep/ .el-step__title{
    font-size: 13px;
}
}

.el-checkbox {
    margin: 0px 10px 0px 0px !important;
}

/deep/  .ql-editor{
  min-height: 300px ; 
}
.btnAdd{
    margin-top: 15px;
}


</style>
