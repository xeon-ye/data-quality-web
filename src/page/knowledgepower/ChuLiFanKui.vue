<!--
 * @Author: your name
 * @Date: 2021-03-01 16:42:22
 * @LastEditTime: 2021-03-09 17:44:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionFeedback\fanKuan.vue
-->
<template>
  <div>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>处理反馈</span>
        </div>
        <div class="qa-body">
          <div class="box mb18">
            <div class="box-body">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="knowledge && knowledge.issueComment"
                readonly
              >
              </el-input>
            </div>
          </div>

          <el-upload
            :key="knowledge && knowledge.id"
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            class="preview"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
      </el-card>
      <!-- <div class="btn-box mar-t-10 mar-b-20">
      <el-button type="primary" icon="el-icon-upload2" size="mini"
        >提交</el-button
      >
    </div> -->
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  props: {
    knowledge: {
      type: Object,
      default: {}
    }
  },

  computed: {
    ...mapState({
      TYPELISTALL: (state) => state.wentifankui.TYPELISTALL
    }),
    fileList: function() {
      let fileList = [];
      if (this.knowledge && this.knowledge.images)
        fileList = this.knowledge.images.map(
          (element) => (element = { url: this.imgHost + element })
        );
      return fileList;
    }
  },

  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imgHost: location.origin + '/clinbrain/api/compare/image/'
      // fileList: []
    };
  },

  methods: {
    ...mapMutations(['SET_TYPELISTALL']),
    getGuiZheList() {
      getGuiZheList(this);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },

  mounted() {
    this.getGuiZheList();
  }
};
// 请求规则列表
function getGuiZheList(vm) {
  // vm.$R
  //   .queryDict({
  //     type: ['issue_stage', 'process_method']
  //   })
  //   .then((res) => {
  //     vm.SET_TYPELISTALL(res);
  //   });
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
.thumb {
  width: 100px;
}
/deep/.preview .el-upload--picture-card {
  display: none;
}
</style>
