<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col> <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button></el-col>
      </el-row>

      <el-table :data="RolesList" border>
          <!-- 添加一行展开列 -->
        <el-table-column type="expand" >
            <template slot-scope="scope">
                <el-row class="vcenter" :class="['rowbroderbottom',index===0?'rowbrodertop':'']" v-for="(itme,index) in scope.row.children" :key="itme.id">
                <el-col :span="5" >
                    <el-tag @close="remvoeRolesById(scope.row,itme.id)" closable>{{itme.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col  :span="19" >
                    <el-row class="vcenter" :class="[index2===0?'':'rowbrodertop']" v-for="(itme2,index2) in itme.children" :key="itme2.id">
                        <el-col :span="6" >
                             <el-tag @close="remvoeRolesById(scope.row,itme2.id)" closable type="success">{{itme2.authName}}</el-tag>
                             <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">

                            <el-tag type="warning" @close="remvoeRolesById(scope.row,itme3.id)" closable v-for="itme3 in itme2.children" :key="itme3.id">{{
                                itme3.authName}}</el-tag>
                            
                        </el-col>
                    </el-row>
                    
                </el-col>
            </el-row>
            </template>

        </el-table-column>
          
          <!-- 索引数据 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showeidtRoles(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-edit"
              @click="deleteRole(scope.row)"
            >删除</el-button>
             <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showRolesDialog(scope.row)"
            >分配权限</el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </el-card>

     <!-- 分配权限信息 -->
    <el-dialog
      title="分配权限"
      :visible.sync="RloesdialogVisible"
      width="60%"
      @close="CloseRolesClick"
    >
      <el-tree :data="rolesQxList" node-key="id" 
      :props="defaultProps" 
      :default-expand-all="true"
      show-checkbox
      :default-checked-keys="defKesy"
      ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RloesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的代码 -->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

      <!-- 编辑角色的代码 -->
    <el-dialog title="编辑角色" :visible.sync="eidtRoleDialogVisible" width="40%" @close="eidtRoleDialogClosed">
      <el-form
        :model="eidtRoleForm"
        ref="eidtRoleFormRef"
        :rules="eidtRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="eidtRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="eidtRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtRoles">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      RloesdialogVisible:false,// 分配权限弹窗的值
      AddRoleDialogVisible:false,// 添加角色弹窗的值
      eidtRoleDialogVisible:false,
      rolesQxList:[],
      //显示树形的名称
      defaultProps:{
        children:"children",
        label:"authName"
      },
      defKesy:[],
      roleId:'',  //角色的id
      addRoleForm:{
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules:{
        roleName:{required:true,message:"请输入角色名称",trigger:"blur"},
        roleDesc:{required:true,message:"请输入角色描述",trigger:"blur"}
      },

       eidtRoleForm:{},
       eidtRoleFormRules:{
        roleName:{required:true,message:"请输入角色名称",trigger:"blur"},
        roleDesc:{required:true,message:"请输入角色描述",trigger:"blur"}
      }
      

    };
  },

  created() {
    this.GetRolesList();
  },
  methods: {
    async GetRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.RolesList = res.data;
    },
    //删除ID
    async remvoeRolesById(row,id){
        const confirResult=await this.$confirm(
        "此操作将永久删除权限, 是否继续?",
        "提示",{
         confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch(err=>err);
        if(confirResult!=="confirm"){
            return this.$message.info("取消删除")
        }
       const {data:res} = await this.$http.delete(`roles/${row.id}/rights/${id}`)
        if(res.meta.status!==200){
            return this.$message.error("删除角色失败")
        }
        this.$message.success("删除角色成功")
        row.children=res.data
    },
    
    // 显示弹窗的功能
   async  showRolesDialog(rows){
      
      this.roleId=rows.id //获取id的数字
      const {data:res}=await this.$http.get("rights/tree")
      if(res.meta.status!==200){
        return this.$message.error("获取权限失败")
      }

      this.rolesQxList=res.data
     
      this.GetdefKesy(rows,this.defKesy)

      this.RloesdialogVisible=true
      
    },
    
    // 添加角色
    async addRoles(){
       this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
     const {data:res}=await this.$http.post('/roles',this.addRoleForm)
       if(res.meta.status!==201){
         return this.$message.error('添加角色失败')
       }
       this.$message.success("添加角色成功")
       this.GetRolesList()
       this.AddRoleDialogVisible=false
        })
    },






    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    GetdefKesy(node,arr){
     // console.log('node',node,arr)
      //如果当前node节点不包含children属性则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      //forEach 循环6次 每次执行方法GetdefKesy本身， 执行if(!node.children) 条件满足就return  
      //然后再执行foreach里的循环直到结束为止
      node.children.forEach(item => {  
      //   console.log('进入的',node.children,item.path)
        this.GetdefKesy(item,arr) 
       
      });

    },
   // 添加角色对话框的关闭
    addRoleDialogClosed(){
       this.$refs.addRoleFormRef.resetFields()
    },
     eidtRoleDialogClosed(){
       this.$refs.eidtRoleFormRef.resetFields()
     },
     
     //角色编辑的弹窗信息
    async showeidtRoles(row){
      const {data:res}=await this.$http.get(`roles/${row.id}`)
        if(res.meta.status!==200){
          return this.$message.error('查询角色信息失败')
        }
        this.eidtRoleForm=res.data
        this.eidtRoleDialogVisible=true
     },
     //角色编辑信息的提交
      eidtRoles(){
        this.$refs.eidtRoleFormRef.validate(async valid=>{
          if(!valid) return
        const {data:res}=await this.$http.put('roles/'+this.eidtRoleForm.roleId,{
            roleName:this.eidtRoleForm.roleName,
          roleDesc:this.eidtRoleForm.roleDesc})
          if(res.meta.status!==200){
            return this.$message.error("修改失败")
          }

          this.$message.success('修改成功')
          this.GetRolesList()
          this.eidtRoleDialogVisible=false

        })

      },

    async  deleteRole(row){
            
            const confirmResult=await this.$confirm("此操作将永久删除角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch(err=>err);
        if(confirmResult!=="confirm"){
         return  this.$message.info("取消删除")
        }
             const {data:res} =await this.$http.delete('roles/'+row.id)
           if(res.meta.status!==200) return this.$message.error("删除角色失败")
           
           this.$message.success('删除角色成功')
           this.GetRolesList()

      },


    
    //取消关闭事件情况节点的数组
    CloseRolesClick(){
      this.defKesy=[]

    },
    //点击角色分配权限
   async allotRights(){
      
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const kyeId=keys.join(',')
      
    // const {data:res}= await this.$http.post(`roles/${this.roleId}/rights`, { rids: kyeId })
    const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: kyeId })
     if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
     }

     
     this.$message.success('分配权限成功');
    this.GetRolesList();
    this.RloesdialogVisible=false
    

    }

  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}

.el-tag{
    margin: 10px
}

.rowbrodertop{
border-top: 1px solid #eee;
}

.rowbroderbottom{
border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items:center
}
</style>