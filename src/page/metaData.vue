<template>
  <div class="responsible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="服务地址配置" name="1">
        <div class="responsible-top mar-b-10">
          <div class="left">
            <el-select
              v-model="searchDb.status"
              placeholder="状态"
              clearable
              size="mini"
              class="select-full"
            >
              <el-option
                v-for="item in statusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            <el-input
              v-model="searchDb.keyword"
              class="mar-l-10"
              clearable
              size="mini"
              placeholder="请输入关键字查询"
            ></el-input>
            <el-button
              type="primary"
              class="chaxunshuju mar-left-10"
              icon="el-icon-search"
              size="mini"
              @click="getSystemDbList(1)"
            >
              查询
            </el-button>
          </div>
          <div class="right">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="showAddDb"
              >新增</el-button
            >
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button> -->
          </div>
        </div>

        <el-table
          :data="dbTableData"
          border
          style="width: 100%"
          class="mar-b-10"
          @row-dblclick="handleDbClick"
        >
          <el-table-column type="index" label="序" width="80"> </el-table-column>
          <el-table-column prop="ip" label="数据库IP地址"></el-table-column>
          <el-table-column prop="port" label="数据库端口"></el-table-column>
          <el-table-column prop="schema" label="数据库名"></el-table-column>
          <el-table-column prop="type" label="数据库类型"></el-table-column>
          <!-- <el-table-column label="调度计划">
            <template slot-scope="scope">
              <el-link type="primary" @click="dialogSchedule = true">{{
                scope.row.cron || '设置计划'
              }}</el-link>
            </template>
          </el-table-column> -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateStatus(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit xh-icon-btns-primary" @click="showEditDb(scope.row)"></i>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm @confirm="deleteDb(scope.row)" title="确定删除吗？">
                  <i class="el-icon-delete xh-icon-btns-danger" slot="reference"></i>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @current-change="handleDbCurrentChange"
          :page-size="searchDb.size"
          background
          layout="total, prev, pager, next, jumper"
          :total="dbTotal"
          :current-page="searchDb.current"
        />
      </el-tab-pane>
      <el-tab-pane label="元数据配置" name="2">
        <div class="responsible-top mar-b-10">
          <div class="left">
            <el-select
              v-model="searchMeta.schemaId"
              placeholder="服务地址"
              @change="getSystemMetaList"
              size="mini"
              class="select-full mar-r-10"
            >
              <el-option
                v-for="item in dbTableData"
                :key="item.id"
                :label="item.schema"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              v-model="searchMeta.keyword"
              clearable
              size="mini"
              placeholder="请输入关键字查询"
            ></el-input>
            <el-button
              type="primary"
              class="chaxunshuju mar-left-10"
              icon="el-icon-search"
              size="mini"
              @click="getSystemMetaList"
            >
              查询
            </el-button>
            <!-- <el-select
              v-model="model"
              placeholder="上报类型"
              size="mini"
              class="select-full mar-left-10"
            >
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.value"
                :value="item.code"
              >
              </el-option>
            </el-select> -->
          </div>
          <div class="right">
            <!-- <el-button
              type="primary"
              plain
              icon="el-icon-setting"
              size="mini"
              @click="showBusiness"
              >模型分类</el-button
            > -->
            <el-button type="primary" icon="el-icon-download" size="mini" @click="showImport"
              >导入</el-button
            >
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="showJianKongShuJu"
              >更新表字段</el-button
            >
          </div>
        </div>

        <el-table :data="metaTableData" border style="width: 100%" class="mar-b-10">
          <el-table-column type="index" label="序" width="50"> </el-table-column>
          <el-table-column prop="tableName" label="表名称"></el-table-column>
          <!-- <el-table-column prop="categoryId" label="模型分类">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.categoryId"
                @change="changeBusiness(scope.row)"
                placeholder="请选择模型分类"
                clearable
                @clear="clearBusiness(scope.row)"
                size="mini"
                class="select-full"
              >
                <el-option
                  v-for="item in businessAllList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="businessTimeField" label="统计时间">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.businessTimeField"
                @change="(val) => changebusinessTime(val, scope.row)"
                placeholder="请选择统计时间"
                size="mini"
                class="select-full"
              >
                <el-option
                  v-for="item in scope.row.statisticTimeFields"
                  :key="item.field"
                  :label="item.fieldComment"
                  :value="item.field"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column prop="tableComment" label="表中文名">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.tableComment"
                size="mini"
                placeholder="请输入表中文名"
                @change="handleTableNameChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit xh-icon-btns-primary" @click="showEditDb(scope.row)"></i>
              </el-tooltip> -->

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-popconfirm @confirm="deleteMeta(scope.row)" title="确定删除吗？">
                  <i class="el-icon-delete xh-icon-btns-danger" slot="reference"></i>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="value3" label="核查模型">
            <template>
              <el-link type="primary" @click="visibleJianKongShuJu = true">模型结构</el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="timeCreated" label="创建时间"></el-table-column>
          <el-table-column label="调度计划">
            <template slot-scope="scope">
              <el-link type="primary" @click="dialogSchedule = true">{{
                scope.row.cron || '设置计划'
              }}</el-link>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @current-change="handleMetaCurrentChange"
          :current-page="metaCurrentPage"
          :page-size="metaPageSize"
          background
          :total="metaTotal"
          layout="total, prev, pager, next, jumper"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 新增写入服务 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="(addDbForm.id ? '编辑' : '新增') + '写入服务'"
      :visible.sync="dialogDb"
      width="30%"
    >
      <el-form :model="addDbForm" :rules="addDbRules" ref="addDbForm" label-width="100px">
        <el-form-item label="数据库类型" prop="type">
          <el-select v-model="addDbForm.type" placeholder="请选择" class="select-full">
            <el-option
              v-for="item in dbtypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务器地址" prop="ip">
          <el-input v-model="addDbForm.ip"></el-input>
        </el-form-item>

        <el-form-item label="端口" prop="port">
          <el-input v-model="addDbForm.port"></el-input>
        </el-form-item>

        <el-form-item label="数据库" prop="schema">
          <el-input v-model="addDbForm.schema"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="user">
          <el-input v-model="addDbForm.user"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input v-model="addDbForm.pwd" type="password"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="comment">
          <el-input v-model="addDbForm.comment"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addDbForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button type="primary" plain @click="dbTest">测试连接</el-button>
        <el-button type="warning" @click="resetDbForm">重置</el-button>
        <el-button @click="dialogDb = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSchema">确认</el-button>
      </div>
    </el-dialog>

    <!-- 调度计划 -->
    <el-dialog
      :close-on-click-modal="false"
      title="调度计划"
      :visible.sync="dialogSchedule"
      width="30%"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="类型" prop="phone">
          <el-select v-model="ruleForm.value" placeholder="请选择" class="select-full">
            <el-option label="重复执行" value="1"></el-option>
            <el-option label="执行一次" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="执行频率" prop="phone">
          <el-select
            v-model="ruleForm.value"
            placeholder="请选择"
            class="select-full"
            style="width:150px"
          >
            <el-option label="每小时" value="2"></el-option>
            <el-option label="每天" value="1"></el-option>
            <el-option label="每周" value="3"></el-option>
            <el-option label="每月" value="4"></el-option>
          </el-select>
          <el-time-select
            v-model="ruleForm.userName"
            class="mar-l-10"
            style="width:200px"
            placeholder="选择时间"
          ></el-time-select>
          <el-link type="primary" class="mar-l-10">执行</el-link>
        </el-form-item>

        <el-form-item label="开始日期" prop="hospitalVal">
          <el-date-picker
            v-model="ruleForm.userName"
            style="width:200px"
            type="date"
            placeholder="开始日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-time-select
            v-model="ruleForm.userName"
            class="mar-l-10"
            placeholder="选择时间"
          ></el-time-select>
        </el-form-item>

        <el-form-item label="结束类型" prop="userName">
          <el-select v-model="ruleForm.hasEnd" placeholder="请选择" class="select-full">
            <el-option label="有结束日期" value="2"></el-option>
            <el-option label="无结束日期" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="结束日期" prop="hospitalVal" v-if="ruleForm.hasEnd == '2'">
          <el-date-picker
            v-model="ruleForm.userName"
            style="width:100%"
            type="date"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="状态" prop="email">
          <el-radio v-model="ruleForm.value" label="1">启用</el-radio>
          <el-radio v-model="ruleForm.userName" label="2">停用</el-radio>
        </el-form-item>
      </el-form>
      <div class="tips">
        <b>提示：</b>
        各数据源执行计划固定在一天内的不同时间段执行，否正文档生成不齐；
      </div>
      <div class="footer-btn">
        <el-button>清空</el-button>
        <el-button @click="dialogSchedule = false">取消</el-button>
        <el-button type="primary" @click="confirmSchedule">确定</el-button>
      </div>
    </el-dialog>

    <!-- 更新表字段 -->
    <el-dialog
      :close-on-click-modal="false"
      class="import"
      title="更新表字段"
      :visible.sync="visibleJianKongShuJu"
      width="50%"
      :before-close="closeJianKongShuJu"
    >
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="left">
            <div class="header">
              <span class="txt"></span>
              <el-input
                v-model="updateKeyword"
                style="width:200px"
                placeholder="输入表名查询"
                clearable
                ><i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="handleUpdateSearch"
                ></i
              ></el-input>
            </div>
            <div>
              <ul class="ullist" v-if="metaTableList && metaTableList.length">
                <li
                  v-for="item in metaTableList"
                  :key="item.id"
                  :class="item.id === currentTable ? 'active' : ''"
                  @click="switchTable(item)"
                >
                  <i class="el-icon-document"></i>{{ item.tableName }}
                </li>
              </ul>
              <div v-else class="ullist nodata">暂无数据</div>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <el-table :data="metaColumnList" border style="width: 100%" class="mar-b-10" height="370">
            <el-table-column prop="columnName" label="源字段"></el-table-column>
            <el-table-column prop="dataType" label="字段类型"></el-table-column>
            <!-- <el-table-column prop="value3" label="字段长度"></el-table-column> -->
            <el-table-column prop="columnComment" label="列中文名">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.columnComment"
                  size="mini"
                  placeholder="请输入列中文名"
                  @change="handleColumnChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="部门" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isDept"
                  @change="changeCheck(scope.row, 'isDept')"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="业务时间" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isBusinessTime"
                  @change="changeCheck(scope.row, 'isBusinessTime')"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="上报时间" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isUploadTime"
                  @change="changeCheck(scope.row, 'isUploadTime')"
                ></el-checkbox>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="value5" label="所属值域（元数据提供）"></el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <div class="footer-btn">
        <!-- <el-button type="primary" @click="visibleJianKongShuJu = false">导入结构</el-button> -->
        <el-button type="default" @click="visibleJianKongShuJu = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 导入目标表 -->
    <el-dialog
      :close-on-click-modal="false"
      class="import"
      title="导入目标表"
      :visible.sync="visibleImport"
      width="50%"
      top="3vh"
    >
      <div class="dialog-search mar-b-10">
        <el-input
          v-model="importSearch.keyword"
          clearable
          size="mini"
          placeholder="请输入关键字查询"
        ></el-input>
        <el-button
          type="primary"
          class="chaxunshuju mar-left-10"
          icon="el-icon-search"
          size="mini"
          @click="getRemoteTableList"
        >
          查询
        </el-button>
      </div>
      <el-table
        ref="remoteTable"
        :data="remoteTableList"
        border
        style="width: 100%"
        class="mar-b-10"
        height="400"
      >
        <el-table-column type="selection" label="序"></el-table-column>
        <el-table-column prop="tableName" label="表名"></el-table-column>
        <el-table-column prop="tableComment" label="中文名"></el-table-column>
      </el-table>
      <div class="footer-btn">
        <el-button @click="visibleImport = false">取消</el-button>
        <el-button type="primary" @click="handleImport">导入</el-button>
      </div>
    </el-dialog>

    <!-- 模型分类维护 -->
    <el-dialog
      :close-on-click-modal="false"
      class="business"
      title="模型分类维护"
      :visible.sync="visibleBusiness"
      width="50%"
      top="3vh"
    >
      <div class="topBtn mar-b-10">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="showAddBusiness"
          >新增</el-button
        >
        <el-button type="warning" size="mini" @click="visibleBusiness = false">关闭</el-button>
      </div>
      <el-table :data="businessList" border style="width: 100%" class="mar-b-10">
        <el-table-column type="index" label="序"></el-table-column>
        <el-table-column prop="model" label="上报类型"></el-table-column>
        <el-table-column prop="name" label="模型分类"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i class="el-icon-edit xh-icon-btns-primary" @click="showEditBusiness(scope.row)"></i>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-popconfirm @confirm="deleteBusiness(scope.row)" title="确定删除吗？">
                <i class="el-icon-delete xh-icon-btns-danger" slot="reference"></i>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background=""
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-dialog>

    <!-- 新增、编辑模型分类 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="(addBusinessForm.id ? '编辑' : '新增') + '模型分类'"
      :visible.sync="dialogBusiness"
      @close="handleBusinessClose"
      width="30%"
    >
      <el-form
        :model="addBusinessForm"
        :rules="addBusinessRules"
        ref="addBusinessForm"
        label-width="100px"
      >
        <el-form-item label="上报类型" prop="model">
          <el-input v-model="model" disabled></el-input>
        </el-form-item>

        <el-form-item label="模型分类" prop="name">
          <el-input v-model="addBusinessForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button @click="dialogBusiness = false">取消</el-button>
        <el-button type="primary" @click="confirmBusiness">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      searchDb: {
        status: '',
        keyword: '',
        current: 1,
        size: 10
      },
      dbTotal: 0,
      searchMeta: {
        schemaId: '',
        keyword: ''
      },
      activeName: '1',
      dbTableData: [],
      metaTableData: [],
      metaTableList: [],
      metaColumnList: [],
      addDbForm: {
        id: '',
        type: '',
        ip: '',
        port: '',
        schema: '',
        user: '',
        pwd: '',
        status: 1,
        comment: ''
      },
      addDbRules: {
        type: [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
        ip: [{ required: true, message: '请输入数据库IP地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入数据端口', trigger: 'blur' }],
        schema: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
        user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
      },
      dbtypeList: [],
      statusList: [],
      visibleImport: false,
      dialogSchedule: false,
      dialogDb: false,
      visibleJianKongShuJu: false,
      remoteTableList: [],
      ruleForm: {
        id: '',
        userName: '',
        hospitalVal: '',
        value: '1',
        phone: '',
        email: '',
        hasEnd: '1'
      },
      rules: {},
      metaTotal: 0,
      metaCurrentPage: 1,
      metaPageSize: 10,
      importSearch: {
        keyword: ''
      },
      currentTable: '',
      updateKeyword: '',
      businessList: [],
      businessAllList: [],
      model: '',
      modelList: [],
      visibleBusiness: false,
      dialogBusiness: false,
      addBusinessForm: {
        id: '',
        model: '',
        name: ''
      },
      addBusinessRules: {
        name: [{ required: true, message: '请输入业务名称', trigger: 'change' }]
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      businessRowId: ''
    };
  },

  methods: {
    handleTableNameChange(row) {
      if (!row.tableComment) {
        this.$message.error('表中文名不能为空!');
        return false;
      }
      this.$R
        .putMetaTable([row])
        .then((res) => {
          this.$message.success(res || '保存成功');
          this.getSystemMetaList();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },

    closeJianKongShuJu() {
      this.visibleJianKongShuJu = false;
    },

    showAddDb() {
      if (this.addDbForm.id) this.resetDbForm();
      this.addDbForm.id = '';
      this.dialogDb = true;
    },

    showEditDb(row) {
      this.dialogDb = true;
      this.$nextTick(() => {
        for (const key in this.addDbForm) {
          if (row.hasOwnProperty(key) === true) this.addDbForm[key] = row[key];
        }
      });
    },

    handleDbCurrentChange(currentPage) {
      this.getSystemDbList(currentPage);
    },

    //服务地址列表
    getSystemDbList(page) {
      this.searchDb.current = page;
      this.$R.getSchema(this.searchDb).then((res) => {
        this.dbTableData = res.records;
        this.dbTotal = res.total;
        if (this.dbTableData?.length) {
          this.searchMeta.schemaId = this.dbTableData[0].id;
          this.getSystemMetaList();
        }
      });
    },

    //元数据配置列表
    getSystemMetaList() {
      let data = {
        keyword: this.searchMeta.keyword,
        schemaId: this.searchMeta.schemaId,
        current: this.metaCurrentPage,
        size: this.metaPageSize
      };
      this.$R.getMetaTable(data).then((res) => {
        this.metaTableData = res.records;
        this.metaTotal = res.total || 0;
      });
    },

    handleMetaCurrentChange(currentPage) {
      this.metaCurrentPage = currentPage;
      this.getSystemMetaList();
    },

    //更新状态
    updateStatus(row) {
      let data = {
        id: row.id,
        status: row.status
      };
      this.$R.postSchema(data).then((res) => {
        this.getSystemDbList(1);
        this.$message({
          message: row.status === 1 ? '启用成功' : '停用成功',
          type: 'success'
        });
      });
    },

    getDictList() {
      this.$R
        .metadataDict({
          type: 'dbtype'
        })
        .then((res) => {
          this.dbtypeList = res;
        });
      this.$R
        .metadataDict({
          type: 'status'
        })
        .then((res) => {
          this.statusList = res;
        });
    },
    resetDbForm() {
      this.$refs.addDbForm.resetFields();
    },
    dbTest() {
      this.$refs.addDbForm.validate((valid) => {
        if (valid) {
          this.$R.putSchema(this.addDbForm).then((res) => {
            if (res.data) {
              this.$message({
                message: '连接成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: res.message || '连接失败',
                type: 'error'
              });
            }
          });
        }
      });
    },
    handleSaveSchema() {
      this.$refs.addDbForm.validate((valid) => {
        if (valid) {
          this.$R.postSchema(this.addDbForm).then((res) => {
            this.dialogDb = false;
            this.getSystemDbList(1);
            this.$message({
              message: res || '保存成功',
              type: 'success'
            });
          });
        }
      });
    },
    //删除服务地址
    deleteDb(row) {
      this.$R.deleteSchema({ id: row.id }).then((res) => {
        this.getSystemDbList(1);
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      });
    },
    showImport() {
      this.getRemoteTableList();
      this.visibleImport = true;
    },

    //目标库：表查询
    getRemoteTableList() {
      let params = {
        keyword: this.importSearch.keyword,
        schemaId: this.searchMeta.schemaId
      };
      this.$R.metaRemoteTable(params).then((res) => {
        this.remoteTableList = res;
      });
    },

    //删除元数据配置
    deleteMeta(row) {
      this.$R.deleteMetaTable({ ids: row.id }).then((res) => {
        this.getSystemMetaList();
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      });
    },
    handleImport() {
      let selections = this.$refs.remoteTable.selection;
      if (!selections?.length) {
        this.$message.warning('请选择要导入的表');
        return;
      }
      let data = {
        schemaId: this.searchMeta.schemaId,
        tableNames: selections.map((item) => item.tableName)
      };
      this.$R.metaRemoteLoad(data).then((res) => {
        this.visibleImport = false;
        this.getSystemMetaList();
        this.$message({
          message: '导入成功',
          type: 'success'
        });
      });
    },
    showJianKongShuJu() {
      this.getMetaTableList();
      this.visibleJianKongShuJu = true;
    },
    switchTable(item) {
      this.currentTable = item.id;
      this.getMetaColumnList();
    },
    handleUpdateSearch() {
      this.getMetaTableList();
    },
    getMetaTableList() {
      let data = {
        keyword: this.updateKeyword,
        schemaId: this.searchMeta.schemaId
      };
      this.$R.metaTableList(data).then((res) => {
        this.metaTableList = res;
        if (res?.length) {
          this.currentTable = res[0].id;
          this.getMetaColumnList();
        } else {
          this.currentTable = '';
          this.metaColumnList = [];
        }
      });
    },
    getMetaColumnList() {
      let data = {
        metaTableId: this.currentTable
      };
      this.$R.metaColumnList(data).then((res) => {
        res.forEach((element) => {
          element.dept === 'Y' ? (element.isDept = true) : (element.isDept = false);
          element.businessTime === 'Y'
            ? (element.isBusinessTime = true)
            : (element.isBusinessTime = false);
          element.uploadTime === 'Y'
            ? (element.isUploadTime = true)
            : (element.isUploadTime = false);
        });
        this.metaColumnList = res;
      });
    },
    handleColumnChange(row) {
      if (!row.columnComment) {
        this.$message.error('列中文名不能为空!');
        return false;
      }
      this.updateMetaColumn([row]);
    },
    updateMetaColumn(rows) {
      this.$R
        .postMetaColumn(rows)
        .then((res) => {
          this.$message.success('保存成功');
          this.getMetaColumnList();
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
    },
    confirmSchedule() {},

    //获取模型分类列表
    getBusinessAllList() {
      let params = {
        model: this.model
      };
      this.$R.getBusinessTypeAll(params).then((res) => {
        this.businessAllList = res;
      });
    },
    getModelList() {
      this.$R
        .queryDict({
          type: ['model']
        })
        .then((res) => {
          this.modelList = res.model;
          if (res?.model?.length) {
            this.model = res.model[0].code;
            this.getBusinessAllList();
          }
        });
    },
    changebusinessTime(val, row) {
      let params = {
        businessTimeField: val,
        model: this.model,
        table: row.table
      };
      this.$R.updateBusinessTimefield(params).then((res) => {
        this.$message.success(res.msg);
        this.getSystemMetaList();
      });
    },
    changeBusiness(row) {
      if (row.categoryId) {
        let params = {
          categoryId: row.categoryId,
          model: this.model,
          table: row.tableName
        };
        this.$R.bindBusinessType(params).then((res) => {
          if (res.data) {
            this.$message.success(res.msg);
            this.getSystemMetaList();
          }
        });
      }
    },
    clearBusiness(row) {
      this.$confirm('是否确定删除绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$R.delBindBusinessType({}, row.bindId).then((res) => {
          if (res) {
            this.$message.success('成功删除绑定！');
            this.getSystemMetaList();
          }
        });
      });
    },
    showBusiness() {
      this.visibleBusiness = true;
      this.getBusinessList();
    },

    //获取模型分类列表
    getBusinessList() {
      let params = {
        model: this.model,
        page: this.currentPage,
        size: this.pageSize
      };
      this.$R.getBusinessType(params).then((res) => {
        this.businessList = res.data;
        this.total = res.pagination.totalRow;
      });
    },

    handleBusinessClose() {
      this.$refs.addBusinessForm.resetFields();
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getBusinessList();
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getBusinessList();
    },

    showAddBusiness() {
      this.businessRowId = '';
      if (this.addBusinessForm.id) this.$refs.addBusinessForm.resetFields();
      this.addBusinessForm.id = '';
      this.dialogBusiness = true;
    },
    showEditBusiness(row) {
      this.businessRowId = row.id;
      this.dialogBusiness = true;
      this.$nextTick(() => {
        this.addBusinessForm.id = row.id;
        this.addBusinessForm.name = row.name;
      });
    },
    //删除模型分类
    deleteBusiness(row) {
      this.$R.delBusinessType({}, row.id).then((res) => {
        this.getBusinessList();
        this.getBusinessAllList();
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      });
    },
    confirmBusiness() {
      this.$refs.addBusinessForm.validate((valid) => {
        if (!valid) return;
        let params = {
          id: '',
          model: this.model,
          name: this.addBusinessForm.name
        };
        if (!this.businessRowId) {
          // 新增
          this.$R.addBusinessType(params).then((res) => {
            this.$message.success('添加成功！');
            this.getBusinessList();
            this.getBusinessAllList();
            this.dialogBusiness = false;
          });
        } else {
          // 修改
          params.id = this.businessRowId;
          this.$R.updateBusinessType(params).then((res) => {
            this.$message.success('修改成功！');
            this.getBusinessList();
            this.getBusinessAllList();
            this.dialogBusiness = false;
          });
        }
      });
    },
    handleDbClick(row) {
      this.activeName = '2';
      this.searchMeta.schemaId = row.id;
      this.getSystemMetaList();
    },
    changeCheck(row, type) {
      let column = {
        isDept: 'dept',
        isBusinessTime: 'businessTime',
        isUploadTime: 'uploadTime'
      };
      let rows = [];
      if (row[type]) {
        row[column[type]] = 'Y';
        rows.push(row);
        let onrow = this.metaColumnList.find((item) => item[type] && item.id !== row.id);
        if (onrow) {
          onrow[column[type]] = 'N';
          rows.push(onrow);
        }
      } else {
        row[column[type]] = 'N';
        rows.push(row);
      }

      //部门和时间不能在同一行
      if (row[type]) {
        let deptIndex = this.metaColumnList.findIndex((item) => item.dept === 'Y');
        let bussinessIndex = this.metaColumnList.findIndex((item) => item.businessTime === 'Y');
        let uploadIndex = this.metaColumnList.findIndex((item) => item.uploadTime === 'Y');
        if (deptIndex == bussinessIndex || deptIndex == uploadIndex) {
          this.$message.error('同一个字段不能同时为部门和时间');
          this.getMetaColumnList();
          return false;
        }
      }

      this.updateMetaColumn(rows);
    }
  },

  mounted() {
    this.getDictList();
    this.getSystemDbList(1);
    // this.getModelList();
  }
};
</script>

<style lang="scss" scoped>
.responsible {
  padding: 10px;
  background: #fff;
  ::-webkit-scrollbar-track {
    background-color: #fff;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #0000001a;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.responsible-top {
  display: flex;
  justify-content: space-between;
  .left {
    display: inherit;
  }
}
.footer-btn {
  flex: 1;
  text-align: right;
}
.tips {
  padding: 15px 0;
  margin: 15px 0;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

/deep/.import {
  .el-dialog__body {
    padding-top: 10px;
  }
  .left {
    border: 1px solid #ddd;
    .header {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #ccc;
      .txt {
        padding: 8px;
      }
      .el-input__inner {
        border-radius: 30px;
      }
      .el-input .el-input__icon:hover {
        color: #333;
        cursor: pointer;
      }
    }
    .ullist {
      height: 320px;
      overflow-y: auto;
      li {
        cursor: pointer;
        height: 20px;
        line-height: 20px;
        padding: 6px 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        i {
          padding: 0 5px;
          color: #409eff;
        }
      }
      li.active {
        background-color: #ddd;
      }
    }
    .nodata {
      padding: 10px;
    }
  }
  .right {
    flex: 1;
    text-align: right;
  }
  .dialog-search {
    display: flex;
  }
}
/deep/.business {
  .topBtn {
    display: flex;
    justify-content: space-between;
  }
  .el-dialog__body {
    padding-top: 15px;
  }
}
</style>
