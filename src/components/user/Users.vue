<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 表格搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="GetUserInfo"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="GetUserInfo"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="adddialogVisible = true"
            >添加用户</el-button>
            <el-button type="primary" @click="onclick"
            >跳转页面</el-button>
        </el-col>
      </el-row>

      <el-table :data="userList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              :enterable="false"
              placement="top"

            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
                @click="showSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 添加用户信息 -->
    <el-dialog
      title="用户新增"
      :visible.sync="adddialogVisible"
      width="60%"
      @close="addClose"
    >
      <el-form
        :model="addUserForm"
        :rules="addrules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUserClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="60%"
      @close="editClose"
    >
      <el-form
        :model="editUserForm"
        :rules="editrules"
        ref="editruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="true" v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditClick">确 定</el-button>
      </span>
    </el-dialog>
   
   <!-- 分配权限的信息 -->
<el-dialog
  title="分配角色"
  :visible.sync="setRoledialogVisible"
  width="50%"
  @close="setRoledialogClose"
   >
   <div>
     <p>当前用户名称：{{userInfo.username}}</p>
     <p>当前角色名称：{{userInfo.role_name}}</p>
     <p>分配新角色：
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
      v-for="item in RoleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
     </p>
   </div>
   
   


  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveSetRoleinfo">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    var checKEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };

    var checkMobile = (rule, value, callback) => {
      const regEmail = /^1[34578]\d{9}$/;
      if (regEmail.test(value)) {
        // 合法手机
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1, //当前显示的页数
        pagesize: 2, //每页显示的多少条数据
      },
      total: 0,
      userList: [],
      adddialogVisible: false, //添加用户框的显示
      editdialogVisible: false, //修改用户信息的对话框
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editUserForm: {}, //修改用户信息的数据
      addrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checKEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checKEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      setRoledialogVisible:false, //分配角色的显示值
      userInfo:{}, //角色分配显示row里面的数据
      RoleList:[], //角色下拉框的数据填充
      selectRoleId:''
    };
  },
  created() {
    this.GetUserInfo();
  },
  methods: {
    async GetUserInfo() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //每页显示多少条数据
    handleSizeChange(value) {
      this.queryInfo.pagesize = value;
      this.GetUserInfo();
    },
    //监听页码值的改变事件
    handleCurrentChange(value) {
      this.queryInfo.pagenum = value;
      this.GetUserInfo();
    },
    //改变用户状态的方法
    async userStateChanged(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error("修改用户状态失败");
      }
      // this.GetUserInfo()
      this.$message.success("修改用户状态成功");
    },
    //打开编辑的弹窗
    async showEditDialog(id) {
      this.editdialogVisible = true;

      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败");
      }

      this.editUserForm = res.data;
      console.log(res);
    },
    //删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户, 是否继续?",
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

      const { data: res } = await this.$http.delete(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$.$message.error("删除用户失败");
      }

      this.$message.success("删除用户成功");

      this.GetUserInfo();
    },
   
    // 关闭弹窗重置内容
    addClose() {
      this.$refs.ruleForm.resetFields();
    },

    editClose() {
      this.$refs.editruleForm.resetFields();
    },

    //用户新增的方法
    AddUserClick() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("users", this.addUserForm);

        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.adddialogVisible = false;
        this.GetUserInfo();
      });
    },

    // 修改用户信息
    EditClick() {
      this.$refs.editruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const {
          data: res,
        } = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败");
        }
        this.$message.success("修改用户成功");
        this.editdialogVisible = false;
        this.GetUserInfo();
      });
    },
    //分配角色的方法
   async showSetRole(row){
        this.userInfo=row
          
      const {data:res}=await this.$http.get('roles')
      if (res.meta.status!==200){
        return this.$message.error("获取角色失败")
      }
      // this.$message.success("获取角色成功")
      this.RoleList=res.data
      this.setRoledialogVisible=true
    },
    //分配角色保存的方法
  async  saveSetRoleinfo(){
      if(this.selectRoleId==""){
        return this.$message.error("请选择角色")
      }

     const {data:res}= await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
      
      if(res.meta.status!==200){
        return this.$message.error("角色更新失败")
      }
      this.$message.success("角色更新成功")
      this.GetUserInfo()
      this.setRoledialogVisible=false

    },
    // 监听关闭事件的清空选项
    setRoledialogClose(){
      this.selectRoleId=''
      this.userInfo={}
    },

    onclick(){
      // window.open('/echar/index.html')data.avuejs.com/view.html?id=8
      window.open('/echar/index.html')
      // window.open("https://data.avuejs.com/view.html?id=8");
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>