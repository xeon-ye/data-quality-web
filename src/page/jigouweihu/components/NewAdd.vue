<!--
 * @Author: your name
 * @Date: 2021-03-08 13:27:33
 * @LastEditTime: 2021-03-08 16:16:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \clibrain-data-quality-v2.5\src\page\jigouweihu\components\newAdd.vue
-->
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      
    >
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="说明" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      
      <el-form-item label="" prop="name">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="是否引用该模板" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            ruleForm: {
                name:'',
                type:''
            },
            
            rules:{}
        }
    },

    methods: {
        submitForm() {
            
        },
        resetForm(){
            
        }

    },
};
</script>

<style lang="scss" scoped></style>
