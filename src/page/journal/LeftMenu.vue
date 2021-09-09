<!--
 * @Author: your name
 * @Date: 2021-03-01 17:52:38
 * @LastEditTime: 2021-03-02 11:09:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\QuestionExamine\leftMenu.vue
-->
<template>
    <div class="xh-from-drak xh-tree-drak">
    <el-input v-model="chaXunVal" placeholder="请输入关键字查询">
         <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>

    </div>
</template>
<script>
  export default {
    data() {
      return {
          chaXunVal:'',
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>