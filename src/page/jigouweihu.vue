<!--
 * @Author: your name
 * @Date: 2021-03-08 13:23:00
 * @LastEditTime: 2021-03-09 18:25:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihui\index.vue
-->
<template>
  <div class="jigouweihui pad-10">
    <div class="responsible-top mar-b-10">
      <div class="left">
        <el-input
          @change="querySearch"
          clearable
          placeholder="请输入关键字检索"
          v-model="keyword"
          size="mini"
          @keyup.enter.native="querySearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            size="mini"
            @click="querySearch"
          ></el-button>
        </el-input>
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="newAdd">新增</el-button>
      </div>
    </div>

    <div class="mar-b-10 mytable">
      <el-table stripe size="mini" :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序"> </el-table-column>
        <el-table-column prop="code" label="机构code"> </el-table-column>
        <el-table-column prop="name" label="机构名称"> </el-table-column>

        <el-table-column prop="template" label="是否引用核查模板">
          <template slot-scope="scope">
            <span>{{ scope.row.template === '1' ? '是' : '否' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="principal" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="modifyStatus(scope.row, $event)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="icon iconfont iconbianji"
              @click="edit(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="icon iconfont iconshanchu"
              @click="remove(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="fenye mar-t-10">
        <el-pagination
          @current-change="changeFenYe"
          class="qa-pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="current"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 新增 -->
    <el-dialog
      :title="ruleForm.id ? '编辑机构' : '新增机构'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>

        <el-form-item label="机构名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="" prop="template">
          <el-checkbox-group v-model="ruleForm.template">
            <el-checkbox label="是否引用该模板" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="resetForm()" type="warning" v-if="!ruleForm.id">重置</el-button>
        <el-button type="primary" @click="submitForm()">{{
          ruleForm.id ? '保存' : '立即创建'
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      dialogVisible: false,
      tableData: [],
      total: 0,
      current: 1,
      ruleForm: {
        id: '',
        code: '',
        name: '',
        template: ''
      },
      rules: {
        code: [{ required: true, message: '请输入机构编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getTableData(1);
  },
  methods: {
    newAdd() {
      if (this.ruleForm.id) this.resetForm();
      this.ruleForm.id = '';
      this.dialogVisible = true;
    },
    edit(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.ruleForm.id = row.id;
        this.ruleForm.code = row.code;
        this.ruleForm.name = row.name;
        this.ruleForm.template = row.template === '1' ? true : false;
      });
    },
    changeFenYe(current) {
      this.getTableData(current);
    },
    querySearch() {
      this.getTableData(1);
    },
    getTableData(page) {
      let that = this;
      let data = {
        current: page,
        size: 10,
        keyword: this.keyword
      };
      try {
        this.$R.getDepartment(data).then((res) => {
          this.total = res.total;
          that.tableData = res.records;
        });
      } catch (error) {
        console.log(error);
      }
    },
    async modifyDepartment(row, status) {
      let res = await this.$R.saveDepartment({
        id: row.id,
        status: status
      });
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    },
    async modifyStatus(row, status) {
      let res = await this.$R.saveDepartment({
        id: row.id,
        status: status
      });
      this.$message({
        message: '修改成功',
        type: 'success'
      });
    },
    remove(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.removeDepartment(row.id);
        })
        .catch(() => {});
    },

    // 删除机构
    async removeDepartment(id) {
      let res = await this.$R.removeDepartment({
        id: id
      });
      this.getTableData(1);
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            id: this.ruleForm.id,
            code: this.ruleForm.code,
            name: this.ruleForm.name,
            template: this.ruleForm.template ? '1' : '0'
          };

          this.$R.saveDepartment(data).then((res) => {
            this.$message({
              message: data.id?'编辑成功':'添加成功',
              type: 'success'
            });
            this.getTableData(1);
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.responsible-top {
  display: flex;
  justify-content: space-between;
  .left {
    .input {
      width: 150px;
    }
  }
}
.mytable {
  .el-button + .el-button {
    margin-left: 0;
  }

  .el-button--mini,
  .el-button--mini.is-round {
    padding: 0 5px;
  }

  .el-button--primary {
    font-size: 16px;
    background: none;
    border: none;
    color: #1890ff;
  }

  .el-button--danger {
    font-size: 16px;
    background: none;
    border: none;
    color: #eb6363;
  }

  ::v-deep .iconfont {
    padding-right: 0px !important;
    margin-right: 0px !important;
  }

  ::v-deep .iconbianji {
    color: #1890ff !important;
  }

  ::v-deep .iconshanchu {
    color: #eb6363 !important;
  }

  ::v-deep .iconxinxi {
    color: #fc8f37 !important;
  }
}
</style>
