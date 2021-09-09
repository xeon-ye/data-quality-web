<!--
 * @Author: your name
 * @Date: 2021-03-05 10:19:41
 * @LastEditTime: 2021-03-05 16:23:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\SetJianKongShuJu.vue
-->
<template>
  <div class="jiankongshuju">
    <div class="mar-b-10">
      <span>机构：</span>
      <el-select v-model="dept" placeholder="请选择" size="mini" @change="queryReport">
        <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <span class="mar-l-20">业务模型：</span>
      <el-select v-model="model" placeholder="请选择" size="mini" @change="queryReport">
        <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
    </div>
    <div class="treebox">
      <el-tree
        ref="eltree"
        :data="treeData"
        show-checkbox
        node-key="_id"
        default-expand-all
        :default-checked-keys="checkedData"
        :props="defaultProps"
      >
      </el-tree>
    </div>

    <div class="xh-footer">
      <el-button type="primary" @click="saveJianTingShuJu">确认</el-button>
      <el-button type="primary" plain @click="handleClose">取消</el-button>
    </div>
  </div>
</template>

<script>
var tableRow = null; // 保存行的数据，编辑的时候需要用到id
export default {
  props: {
    deptList: {
      type: Array,
      default: []
    },
    modelList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      treeData: [],
      checkedData: [],
      defaultProps: {
        children: 'children',
        label: 'tableComment'
      },
      dept: '',
      model: ''
    };
  },

  methods: {
    saveJianTingShuJu() {
      saveJianTingShuJu(this);
    },

    handleClose() {
      this.$emit('clsoeJianTingShuJuBox');
    },

    getListendirModel(row) {
      tableRow = row;
      getListendirModel(this, row);
    },

    queryReport() {
      getListendirModel(this, tableRow);
    }
  },

  created() {},
  mounted() {
    if (this.deptList && this.deptList.length) this.dept = this.deptList[0].code;
    if (this.modelList && this.modelList.length) this.model = this.modelList[0].code;
  }
};

// 请求树的数据
function getListendirModel(vm, row) {
  vm.$R
    .getUserMonitor({
      dept: vm.dept,
      model: vm.model,
      id: row.userId
    })
    .then((res) => {
      let treeData = getTreeData(res);
      let checkedData = [];
      treeData.forEach((item, index) => {
        item._id = index;
        if (item.children) {
          item.children.forEach((jtem, jndex) => {
            jtem._id = index + '_' + jndex;
            if (jtem.status == 1) checkedData.push(jtem._id);
          });
        }
      });
      vm.treeData = treeData;
      vm.checkedData = checkedData;
    });
}

// 更改请求树的结果数据
function getTreeData(data) {
  var newArr = [];
  try {
    Object.keys(data).forEach((item, index) => {
      newArr[index] = {
        id: index,
        tableComment: item,
        children: data[item]
      };
    });
  } catch (error) {
    console.log('监控数据获取错误', error);
  }

  return newArr;
}

function saveJianTingShuJu(vm) {
  var arr = [];
  let checkData = vm.$refs.eltree.getCheckedNodes();
  if (checkData instanceof Array && checkData.length > 0) {
    checkData.forEach((item) => {
      // 点击父级全选的时候去除父级选框
      if (item.tableName) {
        arr.push({
          categoryName: item.categoryName,
          dept: item.dept,
          id: item.id,
          modelName: item.modelName,
          status: 1,
          tableComment: item.tableComment,
          tableName: item.tableName,
          userId: item.userId
        });
      }
    });
  }
  vm.$R.saveUserMonitor(arr).then((res) => {
    vm.msgSuccess('设置成功!');
    vm.handleClose();
  });
}
</script>

<style lang="scss" scoped>
.treebox {
  height: 330px;
  overflow: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
}
.xh-footer {
  display: flex;
  justify-content: flex-end;
}
.jiankongshuju {
  margin-top: -10px;
}
/deep/ .el-tree-node__label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
