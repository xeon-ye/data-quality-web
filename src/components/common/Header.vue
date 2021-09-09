<!--
 * @Author: your name
 * @Date: 2020-08-06 09:58:34
 * @LastEditTime: 2021-03-19 15:13:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2\src\components\common\Header.vue
-->
<template>
  <div id="header" class="headerBg">
    <div class="logo-box">
      <img :src="config.logo" alt="" />
      <span class="header-title-color">{{config.title}}</span>
    </div>
    <div class="user-info">
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link header-user-name-color">
          {{ userInfo.username }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu>
          <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data: function () {
    return {
      config: window.config
    }
  },
  computed: {
    ...mapGetters([
      "userInfo",
    ])
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        // localStorage.removeItem('ms_username');
        // this.$router.push('/login');
        this.$confirm("是否退出系统, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                    this.$router.push({ path: "/login" });
                });
            });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user-name {
  cursor: pointer;
}
#header {
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  .logo-box {
    padding-left: 20px;
    display: flex;
    align-items: center;
    img {
      display: inline-block;
      margin-right: 20px;
      // width: 220px;
      max-height: 50px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
      padding-top: -5px;
    }
    .el-dropdown-link {
      outline: 0;
    }
  }

  .user-info {
    margin-right: 20px;
  }
}
</style>
