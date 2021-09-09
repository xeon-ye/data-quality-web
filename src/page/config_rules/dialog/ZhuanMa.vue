<!--
*名称:
*描述:
-->
<template>
    <div class="page-zhuanma">
        <div class="kaifazhong">
            <i class="icon iconfont iconkaifazhong"></i>
        <p>努力开发中...</p>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
        
            }
        },
        // 创建元素前
        created(){},
        // 创建元素后
        mounted(){},
        // 计算属性
        computed:{},
        // 方法
        methods:{},
        // 侦听属性
        watch:{}
    }
</script>

<style lang="scss" scoped>
.page-zhuanma{
    .kaifazhong{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #666;
        padding-top: 100px;
    }
    i.iconkaifazhong{
        color: #21aced !important; 
        font-size: 120px;
    }
}
</style>