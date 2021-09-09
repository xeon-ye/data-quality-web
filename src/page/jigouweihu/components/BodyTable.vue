<!--
 * @Author: your name
 * @Date: 2021-03-08 13:27:17
 * @LastEditTime: 2021-03-09 18:17:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\BodyTable.vue
-->
<template>
  <div>
    <el-table stripe size="mini" :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="序" width="180"> </el-table-column>
      <el-table-column prop="name" label="机构名称" width="180">
      </el-table-column>
      <el-table-column prop="address" label="说明"> </el-table-column>

      <el-table-column prop="address" label="创建时间"> </el-table-column>

      <el-table-column prop="address" label="是否引用核查模板">
      </el-table-column>

      <el-table-column prop="address" label="操作"> </el-table-column>
    </el-table>

    <div class="fenye mar-t-10">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :total="10"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped></style>
