<!--
 * @Author: your name
 * @Date: 2021-03-02 15:29:19
 * @LastEditTime: 2021-03-05 18:39:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\responsible\Top.vue
-->
<template>
  <div class="responsible-top">
    <div class="left">
      <el-input @change='searchTable' clearable placeholder="请输入关键字检索" v-model="SEARCHVAL" size="mini"  @keyup.enter.native="searchTable">
        <el-button slot="append" icon="el-icon-search" size="mini" @click="searchTable"></el-button>
      </el-input>
    </div>
    <div class="right">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addUser">新增</el-button>
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
      addUser() {
          this.$emit('AddUser')
      },
      searchTable(){
          this.$emit('searchTable')
      }
  },

  computed: {

      SEARCHVAL:{
          get(){
              return this.$store.state.jiankongshuju.SEARCHVAL;
          },
          set(val){
              this.$store.commit("SET_SEARCHVAL", val);
          }
      }
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
