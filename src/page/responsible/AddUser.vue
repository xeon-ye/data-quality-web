<!--
 * @Author: your name
 * @Date: 2021-03-02 16:34:08
 * @LastEditTime: 2021-03-05 10:07:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\AddUser.vue
-->
<template>
  <div>
    <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
    >

      <el-form-item label="责任人" prop="userName">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item label="权限" prop="hospitalVal">
        <el-select v-model="ruleForm.roleId" class="select-full">
          <el-option
              v-for="item in roleList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="联系手机" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>

      <el-form-item label="电子邮件" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>

     <el-form-item label="密码" prop="password">
       <el-input
           v-model.trim="ruleForm.password"
           placeholder="请输入密码"
           show-password
           clearable
       >
         <!-- &lt;!&ndash; input中加图标必须要有slot="suffix"属性，不然无法显示图标 &ndash;&gt; -->
         <!-- <i slot="suffix" class="icon" @click="showPass"></i> -->
       </el-input>
     </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
        >确认
        </el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rowId: '',
      roleList: [],
      ruleForm: {
        username: "",
        role: '',
        phone: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    submitForm() {
      saveUserInfo(this)
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields();
    },

    closeParentDialog() {
      this.$emit('closeParentDialog', () => {
      })
    },
    xiuGaiZeRenRenXinXi(row) {
      xiuGaiZeRenRenXinXi(this, row)
    }
  },

  mounted() {

  },
  created() {
    queryDict(this);
  },
};

// 查询字典表
function queryDict(vm) {
  vm.$R.queryDict({
    types: 'role',
  })
  .then((res) => {
    vm.roleList = res.role;
  });
};

// 保存责任人信息
function saveUserInfo(vm) {
  vm.$R.userModify({
    userId: vm.rowId,
    username: vm.ruleForm.username,
    phone: vm.ruleForm.phone,
    email: vm.ruleForm.email,
    role: [vm.ruleForm.roleId],
    password: vm.ruleForm.password || null
  }).then(res => {
    // console.log(res)
    // console.log(res.status)
    // if (res.status === 1) {
    //   vm.msgSuccess('保存成功！')
    //
    // } else {
    //   vm.msgError('保存失败，请联系管理员！')
    //   console.log(res.message);
    // }
    vm.msgSuccess('保存成功！')
    vm.closeParentDialog()
  })
}

// 修改责任人信息
function xiuGaiZeRenRenXinXi(vm, row) {
  vm.rowId = row.userId
  vm.ruleForm.username = row.username
  vm.ruleForm.email = row.email
  vm.ruleForm.phone = row.phone
  vm.ruleForm.roleId = row.roleId+""
  vm.ruleForm.password = row.password
}
</script>

<style lang="scss" scoped></style>
