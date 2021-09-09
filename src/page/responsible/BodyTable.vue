<!--
 * @Author: your name
 * @Date: 2021-03-02 15:34:50
 * @LastEditTime: 2021-03-05 18:27:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\BodyTable.vue
-->
<!--
 * @Author: your name
 * @Date: 2021-03-02 15:34:50
 * @LastEditTime: 2021-03-04 16:58:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\BodyTable.vue
-->
<template>
  <div class="zerenrentablewarp">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="编号" width="80"> </el-table-column>

      <el-table-column prop="username" label="责任人" width="180">
      </el-table-column>

      <el-table-column prop="roleName" label="权限" width="180">
      </el-table-column>

      <el-table-column prop="phone" label="联系手机"> </el-table-column>

      <el-table-column prop="email" label="电子邮件"> </el-table-column>

      <el-table-column prop="createTime" label="创建时间"> </el-table-column>

<!--      <el-table-column prop="status" label="是否启用">-->
<!--        <template slot-scope="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.status"-->
<!--            active-value="1"-->
<!--            inactive-value="0"-->
<!--            active-color="#13ce66"-->
<!--            inactive-color="#ff4949"-->
<!--            @change="setQiYong(scope.row)"-->
<!--          >-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <i
              class="el-icon-edit xh-icon-btns-primary"
              @click="bianJi(scope.row)"
            ></i>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="设置监控数据"
            placement="top">
            <i
              class="el-icon-s-operation xh-icon-btns-success"
              @click="setJianKongShuJu(scope.row)"
            ></i>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-popconfirm @confirm="shanChu(scope.row)" title="确定删除吗？">
              <i
                class="el-icon-delete xh-icon-btns-danger"
                slot="reference"
              ></i>
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <div class="fenye">
      <el-pagination
        @current-change="changePageNum"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterval: "",
      total: 0,
      tableData: [],
    };
  },

  created() {
    this.getTableData(this);
  },

  methods: {
    changePageNum(num) {
      getTableData(this, {
        size: 10,
        current: num,
        keyword: this.$store.state.jiankongshuju.SEARCHVAL,
      });
    },
    setQiYong(row) {
      setQiYong(this, row);
    },

    getTableData() {
      getTableData(this, {
        size: 10,
        current: 1,
        keyword: this.$store.state.jiankongshuju.SEARCHVAL
      });
    },

    bianJi(row) {
      this.$emit("bianJiZheRenRenXinXi", row);
    },

    setJianKongShuJu(row) {
      this.$emit("showJianKongShuJu", row);
    },

    shanChu(row) {
      shanchu(this, row);
    },
  },
};

function shanchu(vm, row) {
  vm.$R.userDelete({}, "/"+row.userId).then((res) => {
    vm.msgSuccess("删除成功");
    vm.getTableData(vm);
  });
}
//   请求table数据
function getTableData(vm, obj = {}) {
  vm.$R.userPage(obj).then((res) => {
    vm.tableData = res.records || [];
    vm.total = res.total;
    if(vm.tableData){
      vm.tableData.forEach(item=>{
        if(item.roleList[0]){
          item.roleId = item.roleList[0].roleId;
          item.roleCode = item.roleList[0].roleCode;
          item.roleName = item.roleList[0].roleName;
        }
      })
    }
  });
}

// 更新启用状态
function setQiYong(vm, row) {
  vm.$R
    .postmodify({
      email: row.email,
      name: row.name,
      phone: row.phone,
      unit: row.unit,
      id: row.id,
      status: row.status,
    })
    .then((res) => {
      if (res === 1) {
        vm.msgSuccess("保存成功！");
      } else {
        vm.msgError("保存失败，请联系管理员！");
        console.log(res);
      }

      // 更新table数据
      getTableData(vm);
    });
}
</script>

<style lang="scss" scoped>
.fenye {
  margin-top: 10px;
  padding-bottom: 10px;
}
</style>
