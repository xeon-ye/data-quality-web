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
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="值域字典" name="1">
        <div class="responsible-top mar-b-10">
          <div class="left">
            <el-input
              v-model="dictionaryKeyword"
              size="mini"
              placeholder="请输入关键字查询"
              clearable
            ></el-input>
            <el-button
              type="primary"
              @click="getDictionaryTableData()"
              class="chaxunshuju mar-left-10"
              icon="el-icon-search"
              size="mini"
            >
              查询
            </el-button>
          </div>
          <div class="right">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="dictionaryAdd"
              >新增</el-button
            >
          </div>
        </div>

        <el-table
          :data="dictionaryTableData"
          border
          style="width: 100%"
          @row-dblclick="handleDbClick"
          class="mar-b-10"
        >
          <el-table-column type="index" label="序" width="80"> </el-table-column>
          <el-table-column prop="dictCode" label="字典编码"></el-table-column>
          <el-table-column prop="dictName" label="字典名称"></el-table-column>
          <el-table-column prop="dictTypeName" label="字典类别"></el-table-column>
          <!-- <el-table-column prop="hospitalName" label="机构"></el-table-column> -->
          <el-table-column prop="state" label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-value="COM_ENABLE"
                inactive-value="COM_DISABLE"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="setState(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit xh-icon-btns-primary" @click="dictionaryEdit(scope.row)"></i>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm @confirm="dictionaryDel(scope.row)" title="确定删除吗？">
                  <i class="el-icon-delete xh-icon-btns-danger" slot="reference"></i>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div class="fenye">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="dictionaryTotal"
            :current-page="dictionaryCurrentPage"
            :page-size="dictionaryPageSize"
            @size-change="handleDictionarySizeChange"
            @current-change="handleDictionaryCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="明细数据" name="2">
        <div class="responsible-top mar-b-10">
          <div class="left">
            <el-input
              v-model="detailKeyword"
              size="mini"
              placeholder="请输入关键字查询"
              clearable
            ></el-input>
            <el-button
              type="primary"
              @click="getDetailTableData()"
              class="chaxunshuju mar-left-10"
              icon="el-icon-search"
              size="mini"
            >
              查询
            </el-button>
          </div>
          <div class="right">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="detailAdd"
              >新增</el-button
            >
            <el-button type="warning" icon="el-icon-download" size="mini" @click="openImport"
              >导入</el-button
            >
          </div>
        </div>

        <el-table :data="detailTableData" border style="width: 100%" class="mar-b-10">
          <el-table-column type="index" label="序" width="80"> </el-table-column>
          <el-table-column prop="detailCode" label="编码"></el-table-column>
          <el-table-column prop="detailName" label="名称"></el-table-column>
          <el-table-column prop="version" label="版本"></el-table-column>
          <el-table-column prop="validPeriod" label="有效期">
            <template slot-scope="scope">
              <div>{{ scope.row.validPeriod || '永久有效' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit xh-icon-btns-primary" @click="detailEdit(scope.row)"></i>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm @confirm="detailDel(scope.row)" title="确定删除吗？">
                  <i class="el-icon-delete xh-icon-btns-danger" slot="reference"></i>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div class="fenye">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="detailTotal"
            :current-page="detailCurrentPage"
            :page-size="detailPageSize"
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑值域字典 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="(dictionaryForm.id ? '编辑' : '新增') + '值域字典'"
      :visible.sync="isShowDictionaryDialog"
      width="30%"
      :before-close="handleDictionaryClose"
      top="10vh"
    >
      <el-form
        :model="dictionaryForm"
        :rules="dictionaryRules"
        ref="dictionaryRef"
        label-width="80px"
      >
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="dictionaryForm.dictCode" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="dictionaryForm.dictName" clearable></el-input>
        </el-form-item>

        <el-form-item label="字典类别" prop="dictType">
          <el-select
            v-model="dictionaryForm.dictType"
            placeholder="请选择字典类别"
            class="select-full"
          >
            <el-option
              v-for="item in dictTypeList"
              :key="item.typeDesc"
              :label="item.typeDesc"
              :value="item.typeName"
            />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="医疗机构" prop="hospitalCode">
          <el-select
            v-model="dictionaryForm.hospitalCode"
            placeholder="请选择医疗机构"
            class="select-full"
          >
            <el-option
              v-for="item in organList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="dictionaryForm.startTime"
            style="width:100%"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="dictionaryForm.endTime"
            style="width:100%"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <div class="flexBox">
        <el-button type="warning" @click="resetDictionaryForm">重置</el-button>
        <el-button type="primary" @click="dictionarySure">确认</el-button>
      </div>
    </el-dialog>

    <!-- 新增/编辑主数据 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="(detailForm.id ? '编辑' : '新增') + '主数据'"
      :visible="isShowDetailDialog"
      width="40%"
      :before-close="handleDetailClose"
    >
      <el-form :model="detailForm" :rules="detailRules" ref="detailRef" label-width="80px">
        <el-form-item label="名称：" prop="detailName">
          <el-input v-model="detailForm.detailName" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码：" prop="detailCode">
          <el-input v-model="detailForm.detailCode" clearable></el-input>
        </el-form-item>
      </el-form>

      <div class="stableBox">
        <div class="stableBoxRow">
          <div class="half">字典名称：{{ dictionaryRow.dictName }}</div>
          <div class="half">版本号：V 1.0</div>
        </div>
        <div class="stableBoxRow">
          <div class="half">开始时间：{{ dictionaryRow.startTime || '-' }}</div>
          <div class="half">结束时间：{{ dictionaryRow.endTime || '-' }}</div>
        </div>
      </div>

      <div class="detailBtns">
        <el-button type="primary" size="mini" @click="saveDetail">保存</el-button>
        <el-button type="primary" plain size="mini" @click="cancelDetail">取消</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入数据 -->
    <el-dialog
      :close-on-click-modal="false"
      class="import"
      title="批量导入数据"
      :visible.sync="isShowImportDialog"
      width="50%"
      :before-close="handleImportClose"
    >
      <el-tabs v-model="importType">
        <!-- <el-tab-pane label="数据库导入" name="3">
          <el-form :model="importForm" :rules="importRules" ref="importRef" label-width="100px">
            <el-form-item label="服务器类型" prop="serverType">
              <el-select v-model="importForm.serverType" placeholder="请选择服务器类型" class="select-full">
                <el-option label="SQL Server" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="服务器地址" prop="server" placeholder="请输入服务器地址">
              <el-input v-model="importForm.server"></el-input>
            </el-form-item>

            <el-form-item label="数据库" prop="db" placeholder="请输入数据库">
              <el-input v-model="importForm.db"></el-input>
            </el-form-item>

            <el-form-item label="用户名" prop="username" placeholder="请输入用户名">
              <el-input v-model="importForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password" placeholder="请输入密码">
              <el-input v-model="importForm.password" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div class="btn-box">
            <el-button type="primary" size="mini" @click="submitForm" disabled>连接</el-button>
            <el-button type="primary" size="mini" @click="resetForm">重置</el-button>
            <el-button type="primary" plain size="mini" @click="isShowImportDialog=false">取消</el-button>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="数据库导入" name="3"></el-tab-pane>
        <el-tab-pane label="XLS文档导入" name="4">
          <div class="fileBox">
            <input
              ref="file"
              type="file"
              id="file"
              @change="handleFileInputChange"
              accept=".xlsx"
            />
            <el-button type="primary" size="mini" @click="selectFile">选取文件</el-button>
            <div slot="tip" class="fileTip">只能上传.xlsx文件</div>

            <div
              class="fileName"
              v-if="fileName"
              @mouseenter="showCheckIcon = false"
              @mouseleave="showCheckIcon = true"
            >
              <span>
                <i class="el-icon-document" />
                {{ fileName }}
              </span>
              <span>
                <i v-if="showCheckIcon" class="el-icon-circle-check" />
                <i v-else class="el-icon-close" @click="removeFile" />
              </span>
            </div>
          </div>
          <div class="btn-box">
            <el-button type="primary" size="mini" @click="downloadFormwork">下载模板</el-button>
            <el-button type="primary" size="mini" @click="uploadFile">上传</el-button>
            <el-button type="primary" plain size="mini" @click="isShowImportDialog = false"
              >取消</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      showCheckIcon: true,
      isShowDictionaryDialog: false,
      isShowDetailDialog: false,
      isShowImportDialog: false,
      activeName: '1',
      importType: '3',

      dictionaryKeyword: '',
      dictionaryTableData: [],
      dictionaryTotal: 0,
      dictionaryCurrentPage: 1,
      dictionaryPageSize: 10,

      dictionaryForm: {
        id: '',
        dictCode: '',
        dictName: '',
        dictType: '',
        // hospitalCode: '',
        startTime: '',
        endTime: ''
      },
      dictionaryRules: {
        dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictType: [{ required: true, message: '请选择字典类别', trigger: 'change' }]
        // hospitalCode: [{ required: true, message: '请选择医疗机构', trigger: 'change' }]
      },
      dictTypeList: [], // 字典类别下拉选list
      organList: [], // 医疗机构下拉选list

      detailKeyword: '',
      detailTableData: [],
      detailTotal: 0,
      detailCurrentPage: 1,
      detailPageSize: 10,

      detailForm: {
        id: '',
        detailName: '',
        detailCode: ''
      },
      detailRules: {
        detailName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        detailCode: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      },

      importForm: {
        serverType: '',
        server: '',
        db: '',
        username: '',
        password: ''
      },
      importRules: {
        serverType: [{ required: true, message: '请选择服务器类型', trigger: 'change' }],
        server: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
        db: [{ required: true, message: '请输入数据库', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      dictionaryRow: {
        dictName: '',
        startTime: '',
        endTime: ''
      },
      dictId: '', // 	字典ID
      dictUuid: '', // 字典UUID
      file: {},
      fileName: ''
    };
  },

  mounted() {
    this.getDictionaryTableData();
  },

  methods: {
    handleTabClick(tab) {
      if (tab.name === '1') {
        // 值域字典tab
        this.getDictionaryTableData();
      } else {
        // 明细数据tab
        this.dictId = this.dictionaryTableData[0].id;
        this.dictUuid = this.dictionaryTableData[0].uuid;
        this.dictionaryRow = this.dictionaryTableData[0];
        this.getDetailTableData();
      }
    },

    /************************ 值域字典  ************************/
    // 值域字典table查询
    getDictionaryTableData() {
      let params = {
        keyword: this.dictionaryKeyword,
        page: this.dictionaryCurrentPage,
        size: this.dictionaryPageSize
      };
      this.$R.getMainData(params).then((res) => {
        this.dictionaryTableData = res.data;
        this.dictionaryTotal = (res.pagination && res.pagination.totalRow) || 0;

        // 明细tab页弹框赋值
        this.dictionaryRow = res.data && res.data.length ? res.data[0] : {};
      });
    },

    handleDbClick(row) {
      this.activeName = '2';
      this.dictId = row.id;
      this.dictUuid = row.uuid;
      this.getDetailTableData();
      this.dictionaryRow = row;
    },

    handleDictionarySizeChange(pageSize) {
      this.dictionaryPageSize = pageSize;
      this.getDictionaryTableData();
    },

    handleDictionaryCurrentChange(currentPage) {
      this.dictionaryCurrentPage = currentPage;
      this.getDictionaryTableData();
    },

    // 修改状态（启用/禁用）
    setState(row) {
      let params = {
        id: row.id,
        state: row.state
      };
      this.$R.updateState(params, `${row.id}?state=${row.state}`).then((res) => {
        this.$message.success('修改成功！');
        this.getDictionaryTableData();
      });
    },

    // 删除
    dictionaryDel(row) {
      this.$R
        .delDictionaryInfo({}, row.id)
        .then((res) => {
          this.$message.success('删除成功！');
          this.getDictionaryTableData();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },

    // 提交
    dictionarySure() {
      this.$refs.dictionaryRef.validate((valid) => {
        if (!valid) return;
        let params = {
          dictCode: this.dictionaryForm.dictCode,
          dictName: this.dictionaryForm.dictName,
          dictType: this.dictionaryForm.dictType,
          // hospitalCode: this.dictionaryForm.hospitalCode,
          startTime: this.dictionaryForm.startTime,
          endTime: this.dictionaryForm.endTime,
          id: this.dictionaryForm.id,
          state: this.dictionaryForm.state
        };
        // 新增
        if (!this.dictionaryForm.id) {
          this.$R.addDictionaryInfo(params).then((res) => {
            this.$message.success('新增成功！');
            this.getDictionaryTableData();
            this.isShowDictionaryDialog = false;
          });
        } else {
          // 修改
          this.$R.updateDictionaryInfo(params).then((res) => {
            this.$message.success('修改成功！');
            this.getDictionaryTableData();
            this.isShowDictionaryDialog = false;
          });
        }
      });
    },

    // 新增
    dictionaryAdd() {
      this.getDictionaryType();
      // this.getAllOrganList();
      this.dictionaryForm.id = '';
      this.isShowDictionaryDialog = true;
    },

    // 编辑
    dictionaryEdit(row) {
      this.getDictionaryType();
      // this.getAllOrganList();
      this.dictionaryForm.id = row.id;
      this.dictionaryForm.state = row.state;
      this.$nextTick(() => {
        this.dictionaryForm = JSON.parse(JSON.stringify(row));
      });
      this.isShowDictionaryDialog = true;
    },

    // 重置
    resetDictionaryForm() {
      this.$nextTick(() => {
        this.$refs.dictionaryRef.resetFields();
      });
    },

    handleDictionaryClose() {
      // 先清空form
      this.resetDictionaryForm();
      this.isShowDictionaryDialog = false;
    },

    // 查询字典类别（下拉选）
    getDictionaryType() {
      this.$R.getMainDataType().then((res) => {
        this.dictTypeList = res.data;
      });
    },

    // 查询医疗机构（下拉选）
    getAllOrganList() {
      let params = {
        type: 'hospital'
      };
      this.$R.getAllOrgan(params).then((res) => {
        this.organList = res.records;
      });
    },

    /************************ 明细数据  ************************/
    // 明细数据table查询
    getDetailTableData() {
      let params = {
        dictId: this.dictId, // 	字典ID
        dictUuid: this.dictUuid, // 字典UUID
        keyword: this.detailKeyword,
        page: this.detailCurrentPage,
        size: this.detailPageSize
      };
      this.$R.getDetailInfo(params).then((res) => {
        this.detailTableData = res.data;
        this.detailTotal = res.pagination?.totalRow || 0;
      });
    },

    handleDetailSizeChange(pageSize) {
      this.dictionaryPageSize = pageSize;
      this.getDetailTableData();
    },

    handleDetailCurrentChange(currentPage) {
      this.detailCurrentPage = currentPage;
      this.getDetailTableData();
    },

    handleDetailClose() {
      this.isShowDetailDialog = false;
      this.$refs.detailRef.resetFields();
    },

    detailAdd() {
      this.isShowDetailDialog = true;
      this.detailForm.id = '';
    },

    saveDetail() {
      this.$refs.detailRef.validate((valid) => {
        if (!valid) return;
        let params = {
          detailCode: this.detailForm.detailCode,
          detailName: this.detailForm.detailName,
          dictId: this.dictId,
          dictUuid: this.dictUuid,
          id: this.detailForm.id || ''
        };
        // 修改
        if (this.detailForm.id) {
          this.$R.updateDetail(params).then((res) => {
            this.$message.success('修改成功！');
            this.cancelDetail();
            this.getDetailTableData();
          });
        } else {
          // 新增
          this.$R.addDetail(params).then((res) => {
            this.$message.success('新增成功！');
            this.cancelDetail();
            this.getDetailTableData();
          });
        }
      });
    },

    cancelDetail() {
      this.$nextTick(() => {
        this.$refs.detailRef.resetFields();
        this.isShowDetailDialog = false;
      });
    },

    detailEdit(row) {
      this.isShowDetailDialog = true;
      this.detailForm.id = row.id;
      this.$nextTick(() => {
        this.detailForm = JSON.parse(JSON.stringify(row));
      });
    },

    detailDel(row) {
      let params = {
        dictUuid: row.dictUuid
      };
      this.$R.delDetail(params, row.id).then((res) => {
        this.$message.success('删除成功！');
        this.getDetailTableData();
      });
    },

    // 选取文件
    selectFile() {
      this.$refs.file.click();
    },

    handleFileInputChange(e) {
      let file = e.target.files[0];
      this.file = file;
      this.fileName = file.name;
      // 上传之后清空
      this.$refs.file.value = '';
    },

    removeFile() {
      this.file = '';
      this.fileName = '';
    },

    // 下载模板
    downloadFormwork() {
      this.$nextTick(() => {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = '/clinbrain/api/upload/mainData/detail/download';
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
      });
    },

    uploadFile() {
      if (!this.fileName) {
        this.$message.error('请选择文件！');
        return;
      }
      let formdata = new FormData();
      formdata.append('dictId', this.dictId);
      formdata.append('dictUuid', this.dictUuid);
      formdata.append('multipartFile', this.file);
      this.$R.uploadFile(formdata).then((res) => {
        if (res.state) {
          this.$message.success('上传成功！');
          this.isShowImportDialog = false;
          this.getDetailTableData();
        } else {
          this.$message.error(res.message || '上传失败');
        }
        this.file = '';
        this.fileName = '';
      });
    },

    handleImportClose() {
      this.isShowImportDialog = false;
    },

    openImport(row) {
      this.isShowImportDialog = true;
    },
    submitForm() {
      this.$refs.importRef.validate((valid) => {
        if (!valid) return;
      });
    },
    resetForm() {
      this.$refs.importRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.responsible {
  padding: 10px;
  background: #fff;
}
.responsible-top {
  display: flex;
  justify-content: space-between;
  .left {
    display: inherit;
  }
}
/deep/.import {
  .el-dialog__body {
    padding-top: 10px;
  }
}
.fileBox {
  margin-bottom: 30px;
  .fileTip {
    margin: 5px 0 8px 0;
  }
  #file {
    display: none;
  }
  .fileName {
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    height: 30px;
    width: 50%;
    i {
      font-size: 14px;
    }
    .el-icon-close {
      cursor: pointer;
    }
    .el-icon-circle-check {
      color: green;
      cursor: pointer;
    }
    .el-icon-document {
      margin-right: 5px;
    }
  }
}

.btn-box {
  flex: 1;
  text-align: right;
}
.flexBox {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.stableBox {
  padding: 0 20px;

  .stableBoxRow {
    display: flex;
    .half {
      width: 50%;
      font-size: 13px;
      line-height: 32px;
    }
  }
}
.detailBtns {
  text-align: right;
  margin-top: 10px;
}
</style>
