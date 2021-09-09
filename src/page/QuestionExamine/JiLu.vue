<!--
 * @Author: your name
 * @Date: 2021-03-09 17:50:40
 * @LastEditTime: 2021-03-09 18:34:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\JiLu.vue
-->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>日志</span>
          </div>
          <div class="text item">
            <!-- <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline> -->
            <timeline :activities="activities" :years="years"></timeline>
            <!-- <timeline-diagram style="width:100%"></timeline-diagram> -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card mar-b-10" shadow="never">
          <div slot="header" class="clearfix">
            <span>问题详情</span>
          </div>
          <div>
            <div v-if="ROWDATA">
              <span class="row-td">目标数据源：{{ ROWDATA.model }}</span>
              <span class="row-td">触发规则：{{ ROWDATA.rule }}</span>
              <span class="row-td">责任人：{{ ROWDATA.user }}</span>
              <span class="row-td">触发时间：{{ ROWDATA.time }}</span>
            </div>
            <div v-else>无数据</div>
          </div>
        </el-card>
        <chu-li-fan-kui></chu-li-fan-kui>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChuLiFanKui from './ChuLiFanKui';
import Timeline from '../components/Timeline'
import TimelineDiagram from '../components/TimelineDiagram'
import { mapState } from 'vuex';
export default {
  components: {
    ChuLiFanKui,
    Timeline,
    TimelineDiagram
  },
  data() {
    return {
      reverse: true,
      activities: [
        {
          title: "新建数据",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-12 14:02:23'
        },
        {
          title: "修改数据",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-15 14:02:23'
        },
        {
          title: "修改数据",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-15 14:02:23'
        },
        {
          title: "修改数据",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-15 14:02:23'
        },
        {
          title: "修改数据修改数据修改数据",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-15 14:02:23'
        },
        {
          title: "修改数据类型",
          content: '修改表YY_KSDBMK中字段ysdm为varchar(64)修改表YY_KSDBMK中字段ysdm为varchar(64)修改表YY_KSDBMK中字段ysdm为varchar(64)',
          timestamp: '2018-04-18 14:02:23'
        },
      ],
      years: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"]
    };
  },
  computed: {
    ...mapState({
      ROWDATA: (state) => state.fankuishenghe.FANKUIROWDATA
    })
  }
};
</script>

<style lang="scss" scoped>
.row-td {
  display: inline-block;
  font-size: 12px;
  line-height: 30px;
  margin-right: 20px;
}
/deep/ .box-card .el-card__body {
  padding: 10px !important;
}
</style>
