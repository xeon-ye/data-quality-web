<!--
*名称:
*描述:
-->
<template>
  <div class="timeliness">
    <div class="title">及时性检测</div>
    <img src="../../../assets/timeliness.jpg" alt="">

    <footer class="meiju-footer">
      <el-button type="primary" size="mini">保存</el-button>
    </footer>
  </div>
</template>
<script>
import bus from '@/components/common/bus.js';
export default {
  data() {
    return {

    }
  },
  // 创建元素前
  created() {
     bus.$emit('menu', "timelinessxxx");
   },
  // 创建元素后
  mounted() { },
  // 计算属性
  computed: {},
  // 方法
  methods: {},
  // 侦听属性
  watch: {}
}
</script>

<style lang="scss" scoped>
.timeliness {
  padding-right: 10px;
  .title {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
}
.meiju-footer {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>