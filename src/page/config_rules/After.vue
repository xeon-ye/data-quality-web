<!-- 事后规则配置页面 -->
<template>
  <div class="page">
    <!-- 功能菜单区：搜索和新增按钮 -->
    <div class="nav">
      <div class="left">
        <div class="in-left">
          <el-input
              v-model="keyword"
              placeholder="请输入内容"
              class="k-input"
              size="mini"
          ></el-input>
          <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getRuleList({ keyword: keyword })"
          >搜索
          </el-button>
        </div>
        <!-- 选择医院 -->
        <div class="hospitalWarp">
          <el-select v-model="hospital" placeholder="该模型未绑定机构" @change="getRuleList" size="mini">
            <el-option
                v-for="item in hospitalList"
                :key="item.name"
                :label="item.name"
                :value="item.code"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="right">
        <el-button
            type="primary"
            icon="el-icon-message-solid"
            size="mini"
            @click="gaoJingDingYue"
            v-if="Object.values(admin).length > 0"
        >告警订阅
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRule">新增</el-button>
      </div>
    </div>

    <!-- 表单数据 -->
    <div class="main-data">
      <div class="table-border--boxshow">
        <el-table
            :data="ruleList"
            @cell-mouse-enter="mouseenterTd"
            @cell-mouse-leave="mouseleaveTd"
        >
          <el-table-column type="index" label="序" width="60"></el-table-column>
          <el-table-column prop="rule" label="规则名称" width="120"></el-table-column>
          <el-table-column prop="desc" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hospital" label="机构" show-overflow-tooltip></el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="160"/>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <!-- 编辑当前规则 -->
              <el-button
                  size="mini"
                  type="primary"
                  icon="icon iconfont iconbianji"
                  @click="modifyRule(scope.row.type, scope.row.id)"
              ></el-button>
              <el-button
                  size="mini"
                  type="danger"
                  icon="icon iconfont iconshanchu"
                  @click="handleDelete(scope.row)"
              ></el-button>

              <!-- 发送提醒消息 -->
              <!-- <el-button
                                    size="mini"
                                    type="info"
                                    icon="icon iconfont iconxinxi"
                                    @click="dialogVisible = true"
                            ></el-button> -->
            </template>
          </el-table-column>

          <el-table-column prop="principal" label="状态" width="80" fixed="right">
            <template slot-scope="scope">
              <el-switch
                  v-model="ruleList[scope.$index].status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="modifyStatus(ruleList[scope.$index].id, $event)"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="data-fenye">
      <el-pagination
          hide-on-single-page
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page.sync="current"
          :page-size.sync="size"
          layout="prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </div>

    <!-- 新的-告警订阅 -->
    <el-dialog
        title="告警设置"
        :visible.sync="gaoJingDingYueDialog"
        width="770px"
        :before-close="closeGaoJing"
    >
      <div class="gaojingshezhi-body" @click="hideGaoJingFaZhi">
        <el-row :gutter="8">
          <el-col :span="4">业务模型：{{ admin.modelName }}</el-col>
          <el-col
              :span="7"
              class="text-overflow"
              :title="admin.tableName + '（' + admin.tableComment + '）'"
          >库表：{{ admin.tableName }}（{{ admin.tableComment }}）
          </el-col
          >
          <el-col :span="4">责任人：{{ admin.userName }}</el-col>
          <el-col :span="9" class="kl-checkbox-box">
            <span>告警方式：</span>
            <el-checkbox-group v-model="alertMethod">
              <el-checkbox label="短信"></el-checkbox>
              <el-checkbox label="邮件"></el-checkbox>
              <el-checkbox label="OA"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>

        <div class="gaojing-table mar-t-20 ">
          <el-table
              ref="gaojingtable"
              @cell-click="setGaoJingFaZhi"
              size="mini"
              :data="admin.norms"
              border
              style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="90"></el-table-column>
            <!-- <el-table-column type="selection" label="" width="50"> </el-table-column> -->
            <el-table-column prop="ruleComment" label="规则"></el-table-column>
            <el-table-column prop="" label="告警阀值">
              <template slot-scope="scope">
                <span>{{ 0 }} -- {{ scope.row.score }}</span>
                <div class="block" v-show="gaoJingIndex === scope.$index">
                  <el-slider v-model="scope.row.score" :max="100"></el-slider>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="级别">
              <template slot-scope="scope">
                <el-select v-model="scope.row.alertLevel" placeholder="请选择级别" size="mini">
                  <el-option
                      v-for="(item, index) in alert_level"
                      :key="index"
                      :label="item.name"
                      :value="parseInt(item.code)"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gaoJingDingYueDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAlert">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗配置规则 -->
    <div
        class="PeiZhiGuiZeWarp animate__animated"
        :class="showGuiZeBox.anims"
        v-show="showGuiZeBox.show"
    >
      <div class="header">
        <div class="title">新增配置规则</div>
        <!--                <div class="title">新增配置规则({{model}}-{{table}})</div>-->
        <div class="close el-icon-close" @click="closePeiZi"></div>
      </div>

      <!-- 弹窗的配置规则视图，点击新增渲染 -->
      <div v-if="showConfigurationRules">
        <router-view></router-view>
      </div>
    </div>

    <div
        class="PeiZhiGuiZeWarpBg animate__animated"
        :class="showGuiZeBox.bganims"
        @click="closePeiZi"
        v-show="showGuiZeBox.show"
    ></div>
  </div>
</template>
<script>
import {formatDate} from '../js/format.js';
import bus from '@/components/common/bus';

let isIncrementDayVal; // 保存滑入td之前的val值，滑离td时比较值是否修改，进行弹窗保存。
export default {
  // 注册组件
  components: {},
  data() {
    return {
      gaoJingDingYueDialog: false,
      gaoJingFanShi: [],
      gaoJingIndex: null,

      gaoJingTableData: [
        {name: '源目检测', fazhi: [0, 60], jibie: '', id: 0},
        {name: '非空检测', fazhi: [0, 60], jibie: '', id: 1},
        {name: '绝对值检测', fazhi: [0, 60], jibie: '', id: 2},
        {name: '枚举值检测', fazhi: [0, 60], jibie: '', id: 3},
        {name: '主子关联检测', fazhi: [0, 60], jibie: '', id: 4}
      ],
      // 医联体下拉默认选中的值
      hospital: '',
      // 医联体码表
      hospitalList: [],
      // 表对应的规则列表
      ruleList: [],
      // 默认选中的规则
      rule: '',
      // 当前的库
      model: '',
      // 当前表
      table: '',
      // 查询关键字
      keyword: '',
      // 当前页码
      current: 1,
      // 每页显示的条数
      size: 20,
      // 数据量
      total: 0,

      hoverIncrementid: '',

      showConfigurationRules: false,
      TotalDetectionDate: '',
      // 告警设置--弹窗
      showGuiZeBox: {
        show: false,
        anims: 'animate__bounceInRight',
        bganims: 'animate__fadeIn'
      },
      dialogVisible: false,
      formLabelWidth: '90px',
      xinzengform: {
        name: '',
        chufs: ''
      },

      tel_email: '',
      admin: {},
      zeRenRenList: [],
      alertMethod: [],
      alert_level: []
    };
  },
  async created() {
    // 设置默认值
    this.model = this.$route.params.model;
    this.table = this.$route.params.table;
  },
  async mounted() {
    await this.queryDict();
    // model 变化就更新机构
    await this.getDeptDict();
    // 查询数据
    await this.getRuleList({
      model: this.model,
      table: this.table,
      hospital: this.hospital
    });
    this.queryAlert();
  },
  // 计算属性
  computed: {},

  // 侦听属性，点击 left menu 触发查询
  watch: {
    $route: async function () {
      // 设置默认值
      this.model = this.$route.params.model;
      this.table = this.$route.params.table;
      // 更新机构
      await this.getDeptDict();
      // 查询
      this.getRuleList({
        model: this.model,
        table: this.table,
        hospital: this.hospital
      });
      if (this.model && this.table) this.queryAlert();
    }
  },
  // filters: {
  //     formatDate(value) {
  //         let date = new Date(value);
  //         return formatDate(date, 'yyyy-MM-dd');
  //     }
  // },
  methods: {
    setGaoJingFaZhi(row, column, cell, event) {
      // var selectionIds = this.$refs.gaojingtable.selection.map((item) => item.id);
      // if (column.label === '告警阀值' && selectionIds.indexOf(row.id) > -1) {
      if (column.label === '告警阀值') {
        this.gaoJingIndex = row._index;
      } else {
        this.gaoJingIndex = -1;
      }
    },
    hideGaoJingFaZhi(e) {
      // this.gaoJingIndex = -1; // 隐藏阀值
    },
    gaoJingDingYue() {
      this.gaoJingDingYueDialog = true;
    },
    closeGaoJing() {
      this.gaoJingDingYueDialog = false;
    },
    // /**
    //  * 格式化时间，毫秒数转换为日期格式
    //  */
    // formatDate(row, column, cellValue, index) {
    //     let data = new Date(cellValue);
    //     return formatDate(data, 'yyyy-MM-dd hh:mm:ss');
    // },

    /**
     * 医院码表
     */
    async queryDict() {
      await this.$R
          .queryDict({
            types: 'alert_level'
          })
          .then((res) => {
            this.alert_level = res.alert_level;
          });
    },

    async getDeptDict() {
      await this.$R
          .getDict({
            type: 'dept',
            option: this.model
          })
          .then((res) => {
            this.hospitalList = res;
            if (this.hospitalList && this.hospitalList.length) {
              this.hospital = this.hospitalList[0].code;
            } else {
              this.hospital = '';
            }
          });
    },


    /**
     * 查询配置规则列表
     */
    async getRuleList(param) {
      if(this.hospital===''){
        this.$message({
          message: '该模型未配置机构',
          type: 'success'
        });
        this.ruleList = [];
        return;
      }
      this.$R
          .rulelist({
            keyword: param.keyword,
            current: this.current,
            size: this.size,
            model: this.model,
            table: this.table,
            hospital: this.hospital
          })
          .then((res) => {
            this.ruleList = res.records;
            this.current = res.current;
            this.total = res.total;
          });
    },

    /**
     * 新增规则
     */
    addRule() {
      if(this.hospital===''){
        this.$message({
          message: '该模型未配置机构',
          type: 'success'
        });
        return;
      }
      // 默认弹窗组件不加载，新增时加载组件
      this.showConfigurationRules = true;

      // 未选中table新增，提示选表
      if (this.table === '') {
        this.$message({
          message: '请选择表',
          type: 'success'
        });
        return;
      }

      // 显示弹窗、执行动画
      this.showGuiZeBox.show = true;
      this.showGuiZeBox.bganims = 'animate__fadeIn';
      this.showGuiZeBox.anims = 'animate__bounceInRight';

      this.$router.push({
        path: '/dialog/Dialog',
        query: {
          url: encodeURIComponent(this.$route.path),
          model: this.$route.params.model,
          table: this.$route.params.table,
          hospital: this.hospital,
          type: 'source_target'
        }
      });
    },

    /**
     * 编辑规则
     * @param rule 规则类型
     * @param id 规则id
     */
    modifyRule(rule, id) {
      // 加载组件
      this.showConfigurationRules = true;
      this.showGuiZeBox.show = true;
      this.showGuiZeBox.bganims = 'animate__fadeIn';
      this.showGuiZeBox.anims = 'animate__bounceInRight';

      // 查询参数
      let param = {
        url: encodeURIComponent(this.$route.path),
        id: id,
        model: this.model,
        table: this.table,
        hospital: this.hospital,
        type: rule
      };

      this.$router.push({
        path: '/dialog/Dialog',
        query: param
      });
    },

    // 当单元格 hover 进入时会触发该事件
    mouseenterTd(row, column, cell, event) {
      // 鼠标滑入增量检测区间，改变id的值进行显示修改时间
      if (column.label === '增量检测区间' && !row.status) {
        this.hoverIncrementid = row.id;
        isIncrementDayVal = row.dateRange || 1;
      }
    },

    // 当单元格 hover 退出时会触发该事件
    mouseleaveTd(row, column, cell, event) {
      if (column.label === '增量检测区间' && !row.status) {
        this.hoverIncrementid = '-1';

        if (isIncrementDayVal !== row.dateRange) {
          // 如果只进行了修改，弹窗提示用户是否保存
          // 弹窗提示用户是否保存修改
          this.$confirm('是否提交增量检测区间的修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
              .then(() => {
                this.saveIncrementDay(row);

                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
              })
              .catch(() => {
                // 用户点击了取消，把之前的值赋值回来
                row.dateRange = isIncrementDayVal;
                // 用户点击了取消操作
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });
              });
        }
      }
    },

    // 保存配置规则里的增量检测区间
    async saveIncrementDay(row) {
      await this.$R.incrementdaterange({
        dateRange: row.dateRange,
        endTime: row.endTime,
        id: row.id,
        instance: that.$route.params.instance,
        rule: row.name,
        startTime: row.startTime,
        status: row.status,
        table: that.$route.params.table,
        type: that.$route.params.type
      });
    },

    // 验证路由是否显示配置规则弹窗
    isShowDialog() {
      let path = this.$route.path;
      // 如果是弹窗则显示弹窗-临时
      if (path.indexOf('dialog')) {
        this.showGuiZeBox.show = true;
      }
    },

    // rule表：删除
    handleDelete(row) {
      // this.removeRule(row.id)
      if (row.isTemplate == 1) {
        this.$message({
          message: '模板类型的规则禁止删除!',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            this.removeRule(row.id);
          })
          .catch(() => {
          });
    },
    // 分页：size 改变时会触发
    handleSizeChange(val) {
      // // // console.log(`每页 ${val} 条`);
    },
    // 分页：currentPage 改变时会触发
    handleCurrentChange(val) {
      // 请求数据，传递页面：val
      this.getRuleList({
        type: this.$route.params.type,
        table: this.$route.params.table,
        num: val
      });
    },
    // 用户点击上一页按钮改变当前页后触发
    // handlePrevChange(val) {
    //     // // // console.log(`handlePrevChange: ${val}`);
    // },

    // 用户点击下一页按钮改变当前页后触发
    // handleNextChange(val) {
    //     // // // console.log(`handleNextChange: ${val}`);
    // },

    // 关闭配置规则
    closePeiZi() {
      // 关闭弹窗时，删除dom，下次重新创建请求数据
      setTimeout(() => {
        this.showConfigurationRules = false;
        this.showGuiZeBox.show = false;
      }, 350);

      this.showGuiZeBox.anims = 'animate__fadeOutRightBig';
      this.showGuiZeBox.bganims = 'animate__fadeOut';
      console.log(this.$route);
      if (this.$route.query.url != '%2F')
        this.$router.push({path: decodeURIComponent(this.$route.query.url)});
      else this.$router.push({name: 'after', params: {}});
      //刷新左侧任务树
      bus.$emit('searchTree');
    },

    // 判断是否显示配置规则弹窗
    showPeiZhiBox(params) {
      if (params !== '') {
        this.showGuiZeBox.show = false;
        // 显示配置规则
        this.showGuiZeBox.anims = 'animate__bounceInRight';
      }
    },

    // 更新规则状态：启用、停用
    async modifyStatus(id, status) {
      console.log(this.hospital);
      let res = await this.$R.modifyStatus({
        id: id,
        status: status,
        hospital: this.hospital
      });
      // if(!res){return};
      this.$message({
        message: status ? '启用成功!' : '停用成功!',
        type: 'success'
      });
    },

    // 删除规则
    async removeRule(id) {
      let res = await this.$R.removeRule({
        id: id,
        hospital: this.hospital
      });
      // if(!res){return};
      this.getRuleList({keyword: this.keyword});
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    },

    // 请求责任人列表
    queryAlert() {
      if (!(this.model && this.table && this.hospital)) return;
      this.$R
          .queryAlert({
            dept: this.hospital,
            model: this.model,
            tableName: this.table
          })
          .then((data) => {
            this.alertMethod = [];
            this.admin = data || {};
            this.admin.norms?.forEach((element, index) => {
              element._index = index;
            });
            if (this.admin.email === 'Y') {
              this.alertMethod.push('邮件');
            }
            if (this.admin.message === 'Y') {
              this.alertMethod.push('短信');
            }
            if (this.admin.oa === 'Y') {
              this.alertMethod.push('OA');
            }
          });
    },
    async saveAlert() {
      let data = {
        id: this.admin.id,
        email: this.alertMethod.indexOf('邮件') > -1 ? 'Y' : 'N',
        message: this.alertMethod.indexOf('短信') > -1 ? 'Y' : 'N',
        oa: this.alertMethod.indexOf('OA') > -1 ? 'Y' : 'N',
        norms: this.admin.norms
      };
      let res = await this.$R.modifyAlert(data);
      this.$message({
        message: '保存成功',
        type: 'success'
      });
      this.queryAlert();
      this.gaoJingDingYueDialog = false;
      this.gaoJingIndex = -1;
    }
  }
};
</script>

<style lang="scss" scoped>
.gaojingshezhi-body {
  .kl-checkbox-box {
    display: flex;

    .el-checkbox {
      margin-right: 15px;
    }

    .el-checkbox:last-of-type {
      margin-right: 0;
    }
  }

  .text-overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.total-detection-date {
  width: 100%;
}

.header {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  background: $title_BG1;
  color: $title_font1;
  align-items: center;
  padding: 0 10px;
}

.PeiZhiGuiZeWarp {
  position: fixed;
  z-index: 1001;
  bottom: 0;
  right: 0;
  width: 75%;
  min-width: 1000px;
  height: calc(100vh - 50px);
  background: #fff;
  overflow: auto;
}

.PeiZhiGuiZeWarpBg {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

div {
  box-sizing: border-box;
}

.nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;

  .left {
    display: flex;

    .k-input {
      margin-right: 10px;
    }
  }

  .el-button--primary {
    background: #36c;
    border: none;
  }
}

.main-data {
  width: 100%;
  padding: 0 10px 10px 10px;

  ::v-deep .el-table--small td {
    padding: 0;
    height: 30px;
  }

  ::v-deep .el-table--small th {
    padding: 0;
    height: 40px;
  }

  // ::v-deep .el-table tbody tr:hover > td {
  //     background-color: #c5e3ff !important;
  // }
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

  .el-button--info {
    font-size: 16px;
    background: none;
    border: none;
    color: #fc8f37;
  }
}

.data-fenye {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;

  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #36c;
  }

  ::v-deep .el-pagination.is-background .btn-next,
  ::v-deep .el-pagination.is-background .btn-prev,
  ::v-deep .el-pagination.is-background .el-pager li {
    border-radius: 0;
  }
}

.k-top {
  display: flex;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
  color: #666;
  justify-content: space-between;

  .k-txt {
    color: #36c;
  }
}

.gaojing {
  ::v-deep .k-dialog .el-dialog__body {
    padding-top: 0;
  }

  ::v-deep .el-form-item--small .el-form-item__content,
  ::v-deep .el-form-item--small .el-form-item__label {
    width: 110px;
  }

  ::v-deep .el-form--inline .el-form-item {
    padding-right: 2px;
  }
}

.nav {
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

div.hospitalWarp {
  width: 200px;
  margin-left: 20px;
}

div.in-left {
  display: flex;
}

.increment-warp {
  display: flex;
}
</style>
