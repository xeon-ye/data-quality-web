<!--
 * @Author: your name
 * @Date: 2020-12-18 15:51:34
 * @LastEditTime: 2021-03-19 15:09:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clin-ui\src\views\quality\LeftMenu.vue
-->
<template>
  <div class="quality-leftmenu">
    <h1 class="k-h1 xh-little-circle">选择报告</h1>

    <div class="search-warp mar-bottom-10">
      <el-input clearable placeholder="请输入内容" v-model="filterText" class="xh-dark-input xh-input-btn">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>

    <div class="xh-tree baogao-tree">
      <el-tree :data="data" :props="defaultProps" highlight-current default-expand-all :current-node-key="1" ref="baoGaotree" node-key="tablename" :filter-node-method="filterNode"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
  </div>
</template>

<script>
import { msgSuccess, msgWarning, msgError } from '@/util/message.js';
import bus from '@/util/bus.js';
var hospitalCode = null;
export default {
  name: 'qualityLeftMenu',
  data() {
    return {
      filterText: '',
      hospitalCode: null,
      jobType: null,
      data: [],
      defaultProps: {
        children: 'tableList',
        label: 'model'
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.baoGaotree.filter(val);
    },
    // "$route.query"() {
    //   this.setCurrentMenu()
    // },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.model.indexOf(value) !== -1;
    },

    compare(key){
      return function(a,b) {
        return new Date(b[key]).getTime() - new Date(a[key]).getTime()
      }
    },

    handleNodeClick(data, node, self) {
      if (data.tablename) {
        var that = this;
        this.$R
          .gettimeaxis({
            model: data.modelid,
            table: data.tablename,
            hospital: that.hospitalCode,
            jobType: this.jobType
          })
          .then((res) => {
            res.data = res.sort(this.compare('businessTime'));
            res.data.tablename = data.tablename;
            res.data.desc = data.desc;
            res.data.model = data.model;
            res.data.table = data.table;
            that.$emit('timeLineData', res.data);
          });
        this.$router.push({ path: '/qualityReport', query: { model: data.modelid, table: data.tablename } });
      }
    },

    getcomparemodel(hospitalCode,jobType) {
      let that = this;
      this.hospitalCode = hospitalCode;
      this.jobType = jobType

      this.$R.getmodel().then((res) => {
        that.data = getEmTreeData(res);
        try {
          // that.handleNodeClick({
          //   modelid: res[0].model,
          //   tablename: res[0].tableList[0].tablename,
          //   desc: res[0].tableList[0].desc,
          //   hospital: hospitalCode
          // });
          that.setCurrentMenu()

        } catch (error) {
          console.log(error);
        }
      });
    },

    //根据路由设置菜单高亮
    setCurrentMenu() {
      let that = this
      let res = this.data
      if (this.$route.query.model && this.$route.query.table) {
        //默认选中
        let model_index = -1;
        let table_index = -1;
        that.data.forEach((n, index1) => {
          if (this.$route.query.model === n.model) {
            model_index = index1;
          }
          if (model_index !== undefined) {
            n.tableList.forEach((m, index2) => {
              if (m.tablename === this.$route.query.table) {
                table_index = index2;
                return;
              }
            });
          }
        });
        if (model_index < 0 || table_index < 0) {
          alert('质量报告导航没找到要高亮的菜单');
        } else {
          that.handleNodeClick({
            modelid: res[model_index].model,
            tablename: res[model_index].tableList[table_index].tablename,
            desc: res[model_index].tableList[table_index].desc,
            hospital: hospitalCode
          });

          //高亮显示第一个
          that.$nextTick(() => {
            that.$refs.baoGaotree.setCurrentKey(res[model_index].tableList[table_index].tablename);
          });
        }
      } else {
        that.handleNodeClick({
          modelid: res[0].model,
          tablename: res[0].tableList[0].tablename,
          desc: res[0].tableList[0].desc,
          hospital: hospitalCode
        });

        //高亮显示第一个
        that.$nextTick(() => {
          that.$refs.baoGaotree.setCurrentKey(res[0].tableList[0].tablename);
        });
      }
    }
  },

  mounted() {
    // this.getcomparemodel();
    bus.$off('qualityRule'); // 先解绑不然会多次调用
    bus.$on('qualityRule', (data) => {
      this.setCurrentMenu()
    });
  }
};

// 请求的数据格式转换为element-ui 树需要的格式
function getEmTreeData(data) {
  data.forEach((item) => {
    item.tableList.forEach((item2) => {
      item2.model = item2.desc;
      item2.modelid = item.model;
    });
  });
  return data;
}
</script>

<style lang="scss" scoped>
.k-tree {
  padding: 0 10px;
}
.search-warp {
  padding: 0 10px;
}
.quality-leftmenu {
  width: 100%;
  height: 100%;
  background: #39436a;
}

.k-h1 {
  height: 34px;
  line-height: 34px;
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #fff;
}
.xh-tree {
  height: calc(100vh - 190px);
  overflow: auto;
}

::v-deep {
  .el-tree {
    overflow: auto;
  }
  .el-tree-node__content {
    align-self: baseline;
  }
}
</style>
