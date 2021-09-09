<!--
 * @Author: your name
 * @Date: 2021-03-02 13:22:36
 * @LastEditTime: 2021-03-09 18:46:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\journal\Body.vue
-->
<template>
  <div>
    <el-table
      size="mini"
      :data="tableData"
      class="mar-b-10"
      border
      style="width: 100%"
    >
      <el-table-column prop="caozuo" label="操作"> </el-table-column>
      <el-table-column prop="caozuoyonghu" label="操作用户"> </el-table-column>
      <el-table-column prop="xiangmumingcheng" label="项目名称">
      </el-table-column>
      <el-table-column prop="shujuyuan" label="数据源"> </el-table-column>
      <el-table-column prop="caozuoshijian" label="操作时间">
      </el-table-column> </el-table
    ><el-pagination background layout="prev, pager, next" :total="10">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          caozuo: '数据清洗-行处理',
          caozuoyonghu: 'admin/管理员',
          xiangmumingcheng: '前列腺恶性肿瘤',
          shujuyuan: 'xh_table',
          caozuoshijian: '2020-04-23 16:00:23'
        },
        {
          caozuo: '数据清洗-行处理',
          caozuoyonghu: 'admin/管理员',
          xiangmumingcheng: '前列腺恶性肿瘤',
          shujuyuan: 'xh_table',
          caozuoshijian: '2020-04-23 16:00:23'
        },
        {
          caozuo: '数据清洗-行处理',
          caozuoyonghu: 'admin/管理员',
          xiangmumingcheng: '前列腺恶性肿瘤',
          shujuyuan: 'xh_table',
          caozuoshijian: '2020-04-23 16:00:23'
        },
        {
          caozuo: '数据清洗-行处理',
          caozuoyonghu: 'admin/管理员',
          xiangmumingcheng: '前列腺恶性肿瘤',
          shujuyuan: 'xh_table',
          caozuoshijian: '2020-04-23 16:00:23'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
