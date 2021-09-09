<!--
 * @Author: your name
 * @Date: 2021-01-20 14:18:06
 * @LastEditTime: 2021-03-09 13:47:40
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\App.vue
-->
<template>
  <div id="app">
    <router-view></router-view>
    <div class="addGuiZePage">
      <router-view class="view three" name="guize"></router-view>
    </div>
  </div>
</template>
<style>
@import './assets/css/main.css';
@import './assets/css/animate.min.css';
@import './assets/css/theme-dark/color-dark.css'; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/

.addGuiZePage {
  position: fixed;
  width: 75%;
  min-width: 1000px;
  right: 0;
  top: 0;
}
</style>
