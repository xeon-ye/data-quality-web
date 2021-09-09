<!--
 * @Author: your name
 * @Date: 2021-03-08 13:26:26
 * @LastEditTime: 2021-03-08 16:17:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\TopHeader.vue
-->

<template>
  <div class="responsible-top">
    <div class="left">
      <el-input @change='searchTable' clearable placeholder="请输入关键字检索" v-model="input" size="mini"  @keyup.enter.native="searchTable">
        <el-button slot="append" icon="el-icon-search" size="mini" @click="searchTable"></el-button>
      </el-input>
    </div>
    <div class="right">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="newAdd">新增</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    };
  },

  methods: {
     searchTable(){
         
     },
     newAdd(){
         this.$store.commit("SET_DIALOGVISIBLE", true);
     }
  },

  computed: {

      
  },
};


</script>

<style lang="scss" scoped>
.responsible-top {
    display: flex;
    justify-content: space-between;
    .left{
        .input {
            width: 150px;
        }
    }
}
</style>
