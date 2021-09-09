script<!--
 * @Author: your name
 * @Date: 2021-01-20 15:57:41
 * @LastEditTime: 2021-01-22 13:47:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\components\dialogZiDingYiQuJianJianChe.vue
-->
<template>
  <div>
    <div class="header mar-b-10">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-select
              v-model="model"
              placeholder="未配置数据源"
              class="select-full"
              @change="getTableData"
          >
            <el-option
                v-for="item in modelList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            >
            </el-option>
          </el-select
          >
        </el-col>

        <el-col :span="8">
          <el-select v-model="dept" multiple placeholder="该数据源未配置机构" class="select-full">
            <el-option
                v-for="item in deptList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
            </el-option>
          </el-select>
        </el-col>

<!--        <el-col :span="8">-->
<!--          <el-select v-model="dept" placeholder="该数据源未配置机构" @change="getTableData">-->
<!--            <el-option-->
<!--                v-for="item in deptList"-->
<!--                :key="item.code"-->
<!--                :label="item.name"-->
<!--                :value="item.code"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select-->
<!--          >-->
<!--        </el-col>-->

        <el-col :span="8">
          <el-date-picker
              v-if="jobType === 'month'"
              value-format="yyyy-MM"
              v-model="daterange"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
          >
          </el-date-picker>
          <el-date-picker
              v-else
              value-format="yyyy-MM-dd"
              v-model="daterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
      </el-row>
    </div>
    <el-row class="mar-b-10">
      <el-col :span="12"
      >
        <el-select v-model="rule" multiple placeholder="请选择规则检测" class="select-full">
          <el-option
              v-for="item in ruleList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
          >
          </el-option>
        </el-select
        >
      </el-col>
    </el-row>
    <div class="body mar-b-10">
      <el-table ref="refTable" :data="tableData" border stripe style="width: 100%">
        <el-table-column label="执行" width="50" type="selection"></el-table-column>
        <el-table-column type="index" label="序" width="50"></el-table-column>
        <el-table-column prop="tableComment" label="目标表"></el-table-column>
        <el-table-column prop="modelName" label="所属源"></el-table-column>
        <el-table-column prop="hospital" label="机构名称"></el-table-column>
        <el-table-column prop="rowCount" label="记录数"></el-table-column>
      </el-table>
    </div>

    <div class="k-footer">
      <el-pagination
          class="fenye-box"
          background
          :current-page.sync="current"
          :page-size.sync="size"
          :total="tableDataTotal"
          @current-change="changePage"
      >
      </el-pagination>

      <div class="btn-box mar-t-20 pad-b-20">
        <el-button type="primary" plain @click="closeDialog">取消</el-button>

        <el-button type="primary" @click="zhiXing">执行</el-button>
      </div>
    </div>
  </div>
</template>

<script>
var tableDataAll = [], // 保存选择的全部数据
    oldPageNum = 1; // 保存旧的页面数，用来更新tableDataAll中的数据

export default {
  name: 'ZhiDingYiQuJianJianCeDialog',
  props: {
    ruleList: {
      type: Array,
      default: []
    },
    modelList: {
      type: Array,
      default: []
    },
    deptList: {
      type: Array,
      default: []
    },
    jobType: {
      type: String,
      default: ''
    }
  },
  computed: {},

  data() {
    return {
      daterange: null,
      model: null,
      dept: [],
      tableDataTotal: 0,
      tableData: [],
      size: 1000,
      current: 1,
      rule: []
    };
  },

  methods: {
    async queryModel() {
      await this.$R
          .getDict({
            type: 'model',
            keyword: 1
          })
          .then((res) => {
            this.modelList = res;
            if (this.modelList && this.modelList.length) {
              this.model = this.modelList[0].code;
            } else {
              this.model = null;
            }
          });
    },

    async queryDept() {
      await this.$R
          .getDict({
            type: 'dept',
            option: this.model
          })
          .then((res) => {
            this.deptList = res;
            // if (this.deptList && this.deptList.length) {
            //   this.dept = this.deptList[0].code;
            // } else {
            //   this.dept = null;
            // }
          });
    },

    async getTableData() {
      await this.queryDept();
      await this.getJobTable();
    },

    changePage(val) {
      // 切换分页更新全部数据的状态，并返回分页的100条数据
      // this.tableData = tableDataMethods.updateTableDataAll(val, this.tableData);
    },

    // bnt-执行-
    zhiXing() {
      // 更新当前页的数据到大的对象中
      // tableDataMethods.updateTableDataAll(oldPageNum, this.tableData);

      // 获取全部选择的table的表名，执行使用
      // var tableDataAllNameList = [];
      // tableDataAll.forEach((item) => {
      //   if (item.isEnable) {
      //     tableDataAllNameList.push(item.table);
      //   }
      // });

      let selection = this.$refs.refTable.selection;
      let tableDataAllNameList = selection.map((item) => item.tableName);

      let startTime = '';
      let endTime = '';
      if (this.daterange && this.daterange.length) {
        startTime = this.daterange[0];
        endTime = this.daterange[1];
        if (this.jobType === 'month') {
          startTime += '-01';
          endTime += '-01';
        }
      }

      if (
          selection.length == 0 ||
          this.rule.length == 0 ||
          this.daterange == null || this.daterange.length == 0
      ) {
        this.msgError('请选择执行区间、规则和目标表');
        return;
      }

      // 执行操作
      try {
        this.zhiXingQuJian({
          endTime: endTime,
          model: this.model,
          depts: this.dept,
          rules: this.rule,
          startTime: startTime,
          tables: tableDataAllNameList,
          jobType: this.jobType
        });
      } catch (error) {
        this.msgBox('请选择执行区间和规则。');
        console.log('请选择规则检测和时间区间 :>> ', error);
      }
    },

    async getJobTable() {
      let that = this;
      await this.$R
          .getJobTable({
            model: this.model,
            size: this.size,
            current: this.current
          })
          .then((data) => {
            that.tableDataTotal = data.total;
            //   保留全部的数据，添加isEnable是否选中
            that.tableData = data.records;

            if (this.jobType === 'day' || this.jobType === 'month') {
              this.$nextTick(() => {
                that.tableData?.forEach((row) => {
                  this.$refs.refTable.toggleRowSelection(row);
                });
              });
            }

            // 默认显示前100条
            // that.tableData = tableDataAll.slice(0, 100);
          });
    },
    // 执行
    zhiXingQuJian(obj) {
      let that = this;
      this.$R.addJob(obj).then((data) => {
        that.msgSuccess('执行成功');
        this.$emit('zhi-xing', true); // 传值父组件，关闭
      });
    },

    closeDialog() {
      this.$emit('zhi-xing', false);
    },

    setRule(rule) {
      this.rule = rule;
    }
  },

  async mounted() {
    // if (this.deptList && this.deptList.length) this.dept = this.deptList[0].code;
    // if (this.modelList && this.modelList.length) this.model = this.modelList[0].code;
    // // if (this.ruleList && this.ruleList.length) this.rule = [this.ruleList[0].code];
    // this.getJobTable();

    await this.queryModel();
    await this.queryDept();
    await this.getJobTable();
  },

  watch: {}
};

// table数据的操作
var tableDataMethods = {
  /**
   * @description: 获取当前100条数据更新到全部数据的状态
   * @param {*} nums 页码
   * @param {*} tableData 当前100条数据
   * @return {*}
   */
  updateTableDataAll(nums, tableData) {
    tableDataAll.splice((oldPageNum - 1) * 100, 100, ...tableData);
    oldPageNum = nums;
    return tableDataAll.slice((nums - 1) * 100, nums * 100);
  }
};
</script>

<style lang="scss" scoped>
.header {
  // display: flex;
  // justify-content: space-between;
  // .left-btns {
  //   width: 50%;
  // }
}

::v-deep .el-input__inner {
  background: none;
  border: 1px solid #e4e7ea;
}

.k-footer {
  display: flex;
  flex-direction: column;

  .btn-box,
  .fenye-box {
    display: flex;
    justify-content: flex-end;
  }
}

.body {
  height: 400px;
  overflow: auto;
}
</style>
