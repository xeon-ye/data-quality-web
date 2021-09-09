<template>
  <div class="page-content">
    <header class="page-header">
      <el-form :inline="true" :model="search" label-width="90px">
        <el-form-item>
          <span>机构：</span>
          <el-select v-model="search.dept" placeholder="请选择" size="mini" @change="queryReport">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>业务模型：</span>
          <el-select v-model="search.model" placeholder="请选择" size="mini" @change="queryReport">
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>年份：</span>
          <el-date-picker
            v-model="search.year"
            size="mini"
            type="year"
            value-format="yyyy"
            :clearable="false"
            placeholder="选择年份"
            @change="queryReport"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <span>月份：</span>
          <el-select
            v-model="search.month"
            placeholder="请选择"
            size="mini"
            @change="queryReport"
            clearable
          >
            <el-option label="1月" value="1"></el-option>
            <el-option label="2月" value="2"></el-option>
            <el-option label="3月" value="3"></el-option>
            <el-option label="4月" value="4"></el-option>
            <el-option label="5月" value="5"></el-option>
            <el-option label="6月" value="6"></el-option>
            <el-option label="7月" value="7"></el-option>
            <el-option label="8月" value="8"></el-option>
            <el-option label="9月" value="9"></el-option>
            <el-option label="10月" value="10"></el-option>
            <el-option label="11月" value="11"></el-option>
            <el-option label="12月" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="queryReport"
            type="primary"
            class="chaxunshuju"
            icon="el-icon-search"
            size="mini"
          >
            查询
          </el-button>
          <!-- <el-button type="primary" size="mini" icon="el-icon-upload2" @click="daoChuTableData">
            导出
          </el-button> -->
        </el-form-item>
      </el-form>
    </header>

    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50" label="序号" fixed="left"> </el-table-column>
        <el-table-column
          prop="tableComment"
          show-overflow-tooltip
          width="199"
          label="表名"
          fixed="left"
        ></el-table-column>
        <template v-if="records.length">
          <el-table-column
            v-for="item in records"
            width="110"
            :key="item"
            :label="getLable(item)"
            :prop="item"
          />
        </template>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              :width="charts ? 600 : 200"
              trigger="click"
              @show="showPopover(scope.row)"
            >
              <div class="mychart" v-if="curTableName == scope.row.tableName && charts"></div>
              <div v-else>暂时数据</div>
              <a class="el-icon-s-data echart-a" slot="reference"></a>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="mar-t-20">
      <el-pagination
        @current-change="changePageTableData"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :current-page="current"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatDate } from './js/format.js';
var myChart;
export default {
  name: 'monthReport',
  data() {
    return {
      search: {
        dept: '',
        model: '',
        year: formatDate(new Date(), 'yyyy'),
        month: ''
      },
      deptList: [],
      modelList: [],
      total: 0,
      current: 1,
      tableData: [],

      curTableName: '',
      records: [],
      charts: []
    };
  },
  created() {
    this.queryDept();
  },
  mounted() {
    // window.addEventListener('resize', function() {
    //   setTimeout(() => {
    //     myChart.resize();
    //   }, 500);
    // });
  },
  methods: {
    showPopover(row) {
      this.curTableName = row.tableName;
      let that = this;
      this.$nextTick(() => {
        that.showEcharts(row);
      });
    },
    changePageTableData(page) {
      this.getTableData(page);
    },
    //导出
    daoChuTableData() {
      // var that = this;
      // axios({
      //   method: 'post',
      //   url: `/clinbrain/api/compare/analysis/export?businessTime=${this.riQiVal}&model=${this.db}&dept=${this.dept}&tb=${this.shuJuBiaoVal}&type=${this.leiXingVal}`,
      //   data: {},
      //   responseType: 'blob' // 加上这个是重点
      // }).then((res) => {
      //   downloadFile(res);
      // });
      // function downloadFile(res) {
      //   try {
      //     let url = window.URL.createObjectURL(new Blob([res.data]));
      //     let link = document.createElement('a');
      //     let fileName = decodeURIComponent(
      //       res.headers['content-disposition'].split('filename=')[1]
      //     );
      //     link.style.display = 'none';
      //     link.href = url;
      //     link.setAttribute('download', fileName);
      //     document.body.appendChild(link);
      //     link.click();
      //     URL.revokeObjectURL(link.href);
      //     document.body.removeChild(link);
      //     that.msgSuccess('导出成功');
      //   } catch (error) {
      //     alert('导出失败');
      //     console.log(error);
      //   }
      // }
    },
    getTableData(page) {
      this.current = page;
      let data = {
        size: 10,
        current: page,
        dept: this.search.dept,
        year: this.search.year,
        month: this.search.month,
        model: this.search.model
      };
      let that = this;
      this.$R.countReport(data).then((res) => {
        that.tableData = res.records;
        that.total = res.total;

        this.records = [];
        if (res.records && res.records.length) {
          let obj = JSON.parse(JSON.stringify(res.records[0]));
          delete obj.tableName;
          delete obj.tableComment;
          this.records = Object.keys(obj);
        }
      });
    },
    //医院列表
    async queryDept() {
      await this.$R
        .queryDict({
          types: 'dept,model'
        })
        .then((res) => {
          this.deptList = res.dept;
          this.modelList = res.model;
          if (res.dept && res.dept.length > 0) this.search.dept = res.dept[0].code;
          if (res.model && res.model.length > 0) this.search.model = res.model[0].code;
          this.getTableData(1);
        });
    },
    queryReport() {
      this.getTableData(1);
    },
    // 创建ETL质量评估图表
    showEcharts(res) {
      let obj = JSON.parse(JSON.stringify(res));
      delete obj.tableName;
      delete obj.tableComment;
      let keys = Object.keys(obj);
      let dateTimes = keys.map((item) => this.getLable(item));
      let currentTotals = keys.map((item) => obj[item]);
      let dom = document.getElementsByClassName('mychart');
      myChart = this.$echarts.init(dom[2]);
      let option = {
        backgroundColor: '#fff',
        title: {
          text: '上报数据情况',
          textStyle: {
            align: 'left',
            color: '#666',
            fontSize: 14
          },
          top: '0',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: '12%',
          left: '12%',
          right: '6%',
          bottom: '8%'
          // containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: true
            },
            splitArea: {
              // show: true,
              color: '#666',
              lineStyle: {
                color: '#666'
              }
            },
            axisLabel: {
              color: '#666'
            },
            splitLine: {
              show: false
            },
            boundaryGap: false,
            data: dateTimes
          }
        ],

        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: 70000,
            splitNumber: 5,
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(0,0,0,0.1)'
              }
            },
            axisLine: {
              show: true
            },
            axisLabel: {
              show: true,
              margin: 10,
              textStyle: {
                color: '#666'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: '#1890FF'
              }
            },
            itemStyle: {
              color: '#1890FF'
            },
            tooltip: {
              show: true
            },
            areaStyle: {
              normal: {
                color: '#A3D3FF'
              }
            },
            data: currentTotals
          }
        ]
      };

      myChart.setOption(option);
    },
    getTotal(records, dateTime) {
      let record = records && records.find((jtem) => jtem.dateTime == dateTime);
      return record ? record.total : '0';
    },
    getLable(item) {
      let month = {
        jan: '1月',
        feb: '2月',
        mar: '3月',
        apr: '4月',
        may: '5月',
        jun: '6月',
        jul: '7月',
        aug: '8月',
        sep: '9月',
        oct: '10月',
        nov: '11月',
        dec: '12月'
      };
      return month[item] || item;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-content {
  background: #fff;
  color: #555;
  padding: 10px 10px 30px;

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    width: 8px;
  }
}

.page-header {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.echart-a {
  font-size: 16px;
  cursor: pointer;
}

.mychart {
  width: 100%;
  height: 400px;
}
</style>
