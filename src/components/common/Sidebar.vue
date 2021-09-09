<template>
  <div class="sidebar xh-left-menu">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <div v-if="!collapse" class="font-white">
        <i class="el-icon-s-fold"></i>全部菜单
      </div>
      <i v-else class="el-icon-s-unfold"></i>
    </div>

    <el-menu
      class="sidebar-el-menu kyle"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#262f52"
      text-color="#FFFFFF"
      active-text-color="#1890FF"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" class="icon iconfont "></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }} </template>

                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>

              <el-menu-item v-else :index="subItem.index" :key="subItem.index"
                >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon" class="icon iconfont "></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "iconzhiliangfenxi",
          index: "1",
          title: "质量分析",
          subs: [
            {
              index: "/overviews",
              title: "首页预览",
            },
            {
              index: "/dashboard",
              title: "日审分析",
            },
            {
              index: "/qualityReport",
              title: "质量评估报告",
            },
            {
              index: "/reporting",
              title: "质量评估报表",
            },
          ],
        },
        {
          icon: "iconguizeguanli",
          index: "/qualityrule",
          title: "质量管理规则",
        },
        {
          icon: "iconpinggu",
          index: "/qualitystandard",
          title: "质量评估标准",
        },
        {
          icon: "iconzljcgl",
          index: "2",
          title: "问题稽查处理",
          subs: [
            {
              index: "/questionfeedback",
              title: "问题反馈",
            },
            {
              index: "/questionexamine",
              title: "反馈审核",
            },
            {
              index: "/knowledgepower",
              title: "知识库",
            },
          ],
        },
        {
          icon: "iconjurassic_log",
          index: "/journal",
          title: "日志",
        },
        {
          icon: "iconxitongshezhi",
          index: "3",
          title: "系统设置",
          subs:[
              {
                 index: "/jigouweihu",
              title: "机构维护", 
              },
              {
                 index: "/responsible",
                title: "责任人维护", 
              }
          ]
        },
      ],
    };
  },
  computed: {
    // 根据路由高亮显示对应的菜单
    onRoutes() {
      return this.$route.path;
    },
  },
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: block;
  position: absolute;
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
