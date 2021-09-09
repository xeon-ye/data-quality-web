<!--
 * @Author: your name
 * @Date: 2020-09-21 15:56:57
 * @LastEditTime: 2020-10-14 16:33:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\page\index\sidebar\index.vue
-->
<template>
  <div class="sidebar xh-left-menu">

    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="setCollapse">
      <div v-if="!isCollapse" class="font-white">
        <i class="el-icon-s-fold"></i>全部菜单
      </div>
      <i v-else class="el-icon-s-unfold"></i>
    </div>

    <!-- <el-scrollbar style="width:200px,height:100%">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">没有发现菜单
      </div> -->
    <el-menu class="sidebar-el-menu kyle" background-color="#262f52" text-color="#FFFFFF" active-text-color="#1890FF" unique-opened :default-active="nowTagValue" mode="vertical"
      :show-timeout="200" :collapse="keyCollapse">
      <sidebar-item :menu="menu" :screen="screen" first :props="website.menu.props" :collapse="keyCollapse"></sidebar-item>
    </el-menu>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import bus from "../../common/bus";
import { mapGetters } from "vuex";
import sidebarItem from "./sidebarItem";
import { validatenull } from "@/util/validate";

export default {
  name: "sidebar",
  components: { sidebarItem },
  data() {
    return {
      keyCollapse: false
    };
  },
  created() {
    this.$store.dispatch("GetMenu", { type: true, id: -1 }).then(data => {
      if (data.length === 0) return;
      this.$router.$avueRouter.formatRoutes(data, true);
    });
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "isCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {
  },
  methods: {
    validatenull(val) {
      return validatenull(val);
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
      this.keyCollapse = this.screen > 1 ? this.isCollapse : false
    },
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  display: block;
  position: absolute;
  background-color: #262f52;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
  .collapse-btn {
    line-height: 50px;
    padding-left: 20px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
    .el-icon-s-fold {
      margin-right: 20px;
      font-size: 18px;
    }
    .el-icon-s-unfold {
      margin-right: 20px;
    }
    .font-white {
      font-size: 14px;
    }
  }
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 210px;
}
.sidebar > ul {
  height: calc(100% - 50px);
}
</style>

