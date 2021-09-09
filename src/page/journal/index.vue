<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-09 18:41:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\Journal.vue
-->
<template>
  <div class="journal">
    <div class="right">
      <top class="mar-b-10"></top>
      <body-table></body-table>
    </div>
  </div>
</template>

<script>
import Top from './Top';
import BodyTable from './BodyTable';
import LeftMenu from './LeftMenu';
export default {
  components: {
    Top,
    BodyTable,
    LeftMenu
  }
};
</script>

<style lang="scss" scoped>
.journal {
  display: flex;
  .left {
    width: 200px;
    padding: 10px;
    height: calc(100vh - 120px);
    background: #39436a;
  }
  .right {
    width: 700px;
    flex-grow: 1;
    padding: 10px;
    background: #fff;
  }
}
</style>
