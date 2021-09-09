<!--
 * @Author: your name
 * @Date: 2021-03-02 15:23:51
 * @LastEditTime: 2021-03-05 16:21:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\index.vue
-->
<template>
  <div class="responsible">
    <top class="mar-b-10"
         @searchTable='searchTable'
         @AddUser="showAddUser"></top>

    <body-table ref="bodyTable"
                @showJianKongShuJu='showJianKongShuJu'
                @bianJiZheRenRenXinXi='bianJiZheRenRenXinXi'></body-table>

    <!-- 新增责任人 -->
    <el-dialog
        :close-on-click-modal='false'
        title="新增责任人"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
    >
      <add-user
          v-if="dialogVisible"
          ref="adduser"
          @closeParentDialog='hideAddUser'
      ></add-user>

    </el-dialog>

    <!-- 设置监控数据 -->
    <el-dialog
        :close-on-click-modal='false'
        title="监听目录"
        :visible.sync="visibleJianKongShuJu"
        width="50%"
        :before-close="closeJianKongShuJu">

      <xh-setjiankongshuju
          @clsoeJianTingShuJuBox='closeJianKongShuJu'
          ref="jiankongshuju"
          :deptList="deptList"
          :modelList="modelList"
          v-if="visibleJianKongShuJu"></xh-setjiankongshuju>
    </el-dialog>

  </div>
</template>

<script>
import top from "./responsible/Top";
import bodyTable from "./responsible/BodyTable";
import addUser from "./responsible/AddUser";
import xhSetjiankongshuju from './responsible/SetJianKongShuJu';

export default {
  components: {
    top,
    bodyTable,
    addUser,
    xhSetjiankongshuju
  },

  data() {
    return {
      dialogVisible: false,
      visibleJianKongShuJu: false,
      deptList: [],
      modelList: []
    };
  },

  methods: {
    searchTable() {
      this.$refs.bodyTable.getTableData()
    },
    closeJianKongShuJu() {
      this.visibleJianKongShuJu = false;
    },
    showJianKongShuJu(row) {

      let that = this;
      this.visibleJianKongShuJu = true;

      this.$nextTick(() => {
        that.$refs.jiankongshuju.getListendirModel(row)
      })
    },

    handleClose() {
      this.dialogVisible = false
    },

    showAddUser() {
      this.dialogVisible = true
    },

    hideAddUser() {
      this.dialogVisible = false
      this.$refs.bodyTable.getTableData()
    },

    bianJiZheRenRenXinXi(row) {
      this.dialogVisible = true
      let that = this;
      this.$nextTick(() => {
        that.$refs.adduser.xiuGaiZeRenRenXinXi(row)
      })

    },

    async queryDept() {
      await this.$R
        .queryDict({
          types: 'dept,model'
        })
        .then((res) => {
          this.deptList = res.dept;
          this.modelList = res.model;
        });
    }
  },

  mounted() {
    this.queryDept();

  },
  created() {

  },
};


</script>

<style lang="scss" scoped>
.responsible {
  padding: 10px;
  background: #fff;
}


</style>
