<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <div class="wentizuobiao-box box">
        <el-form-item label="知识定位：">
          <el-radio-group v-model="ruleForm.knowledge">
            <el-radio label="01">规则优化</el-radio>
            <el-radio label="02">新增规则</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-divider></el-divider>

      <div class="box mar-b-20 mar-l-20">
        <div class="box-body" v-if="ruleForm.knowledge=='01'">
          <el-select size="mini" v-model="SELECTION.processMethod" placeholder="请选择处理方法" disabled>
            <el-option v-for="(item, index) in TYPELISTALL.process_method" :label="item.value" :value="item.code" :key="index">
            </el-option>
          </el-select>
        </div>

        <div v-else class="box-body">
          <el-input type="text" style="width:200px" placeholder="规则编号" v-model="ruleForm.ruleCode"></el-input>
          <el-input type="text" style="width:200px;margin-left:10px" placeholder="规则名称" v-model="ruleForm.ruleValue"></el-input>
        </div>
      </div>

      <div class="box mb18 mar-l-20">
        <div class="box-body">
          <el-input type="textarea" :rows="4" placeholder="请输入知识库总结" v-model="ruleForm.knowledgeDesc">
          </el-input>
        </div>
      </div>

      <div class="btn-box mar-t-20">
        <el-button type="primary" icon="el-icon-upload2" size="mini" @click="postknowledge">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import ChuLiFanKui from './ChuLiFanKui';
import { mapState } from 'vuex';
import axios from 'axios';
export default {
  components: {
    ChuLiFanKui
  },
  data() {
    return {
      reverse: true,
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ],
      isKnowledge: "01",
      ruleForm: {
        knowledge: '01',
        knowledgeDesc: '',
        ruleCode: "",
        ruleValue: ""
      }
    };
  },
  computed: {
    ...mapState({
      TYPELISTALL: (state) => state.wentifankui.TYPELISTALL,
      SELECTION: (state) => state.fankuishenghe.SELECTION,
    })
  },
  methods: {
    postknowledge() {
      postknowledge(this, this.ruleForm);
    },
  }
};
// 提交知识库
function postknowledge(vm, params) {
  if (vm.SELECTION) {
    var url = "/clinbrain/api/compare/issue/knowledge/commit";
    if (params.knowledge === "01") {
      url += "?knowledge=01";
    } else {
      if (params.ruleCode && params.ruleValue) {
        url += "?knowledge=02&ruleCode=" + params.ruleCode + "&ruleValue=" + params.ruleValue;
      } else {
        vm.msgWarning('请输入规则名称或编号');
        return false;
      }
    }
    var arr = []
    var obj = {
      id: vm.SELECTION.id,
      isKnowledge: 1,
      knowledgeDesc: params.knowledgeDesc,
    }
    arr.push(obj)
    axios.post(url, arr, {
      timeout: 1000,
    }).then(function (res) {
      console.log(res.data.code)
      if (res.data.code == 200) {
        vm.msgSuccess('提交成功');
        vm.$store.commit('SET_SHOWKNOWLEDGE', false);
        vm.ruleForm.knowledge = "01"
        vm.ruleForm.knowledgeDesc = ""
        vm.ruleForm.ruleCode = ""
        vm.ruleForm.ruleValue = ""
      } else {
        vm.msgError('提交失败');
      }
    }).catch(function (error) {
      console.log(error);
    });

  } else {
    vm.msgWarning('请选择数据');
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
  justify-content: flex-end;
}
.box {
  display: flex;
  line-height: 30px;
  .title {
    width: 100px;
  }
}

.mb18 {
  margin-bottom: 18px;
}

.wentizuobiao-ul {
  display: flex;
  width: 100%;
  justify-content: space-between;
  li {
    display: flex;
    align-items: center;
  }
  li:nth-last-child() {
    font-size: 22px;
    &::after {
      content: '111';
      width: 20px;
      height: 1px;
      background: #fff;
    }
  }
}

.el-radio-group li {
  display: inline-block;
}
.box-body {
  flex-grow: 1;
}

.wentizuobiao-box .el-form-item {
  margin-bottom: 0;
}
</style>
