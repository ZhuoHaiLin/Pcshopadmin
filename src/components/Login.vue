<template>
  <div class="login_conter">
    <div class="login_box">
      <!-- 头像功能 -->
      <div class="login_img">
        <img src="../assets/logo.png" alt="" />
      </div>

      <div class="login_form">
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          label-width="0"
          :inline="false"
          size="normal"
        >
          <el-form-item prop="username">
            <el-input
              prefix-icon="iconfont icon-user"
              v-model="form.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-model="form.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_btn">
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button type="info" @click="RemoveClick">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入账户", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    RemoveClick() {
      // console.log(this)
      this.$refs.form.resetFields();
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.post("login", this.form);

        if (res.meta.status == 200) {
          this.$message.success("登录成功");

          //记录token的
          sessionStorage.setItem("token", res.data.token);

          this.$router.push("/home");
        } else {
          this.$message.error("登录失败");
        }
      });
    },
  },
};
</script>



<style lang="scss"  scoped>
.login_conter {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .login_img {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #fff;
      padding: 10px;
      box-shadow: 0px 0px 10px #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0px;
      padding: 0px 20px;
      box-sizing: border-box;
      width: 100%;
    }
  }
}

.login_btn {
  display: flex;
  justify-content: center;
}
</style>