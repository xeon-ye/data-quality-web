<!-- 配置规则弹窗 -->
<template>
    <div class="page">
        <div class="left">
            <dl class="leftMenu-dl">
                <template v-for="(item, index) in tree">
                    <dt class="dt" :key="index">{{ item.desc }}</dt>
                    <template v-for="rule in item.rules">
                        <dd class="dd"
                            :ref="rule.code+rule.id"
                            v-bind:class="{ act: rule.flag === selected }"
                            :data-title="rule.rule"
                            :value="rule.id" @click="router(rule.code,rule.id)">
                                <span class="i-box">
                                    <i class="icon el-icon-check"></i>
                                </span>
                            <!--                        todo 鼠标悬浮，显示全部-->
                            {{ rule.desc | ellipsis }}
                        </dd>
                    </template>
                </template>
            </dl>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>

import bus from '@/components/common/bus.js';

export default {
    data() {
        return {
            // 当前router路径
            url: '',
            // 规则类型
            type: '',
            // 模型
            model: '',
            // 表名
            table: '',
            // 医联体code
            hospital: '',
            // id
            id: '',
            // 被选中的项，例：source_target10000000000
            selected: '',
            // 菜单
            tree: []
        };
    },
    created() {
        this.url = this.$route.query.url;
        this.model = this.$route.query.model;
        this.table = this.$route.query.table;
        this.hospital = this.$route.query.hospital;
        this.type = this.$route.query.type;
        this.id = this.$route.query.id || '';
        this.selected = this.type + this.id;
        // 初始化加载菜单
        this.getTree();
    },
    mounted() {
        // 规则router
        this.router(this.type, this.id);
        // 监听，刷新菜单
        bus.$off('menu'); // 先解绑不然会多次调用
        bus.$on('menu', (selected) => {
            // 选中发生变化的数据
            this.selected = selected;
            // 刷新tree
            this.getTree();
        });
    },
    filters: {
        ellipsis: function(value) {
            if (!value) return '';
            if (value.length > 6) {
                return value.slice(0, 4) + '...' + value.slice(value.length-2, value.length);
            }
            return value;
        }
    },
    watch: {
        /**
         * 切换规则更改规则类型
         */
        $route: function() {
            let that = this;
            that.type = that.$route.query.type;
        }
    },
    methods: {
        /**
         * @description: 左侧导航树
         */
        async getTree() {
            let that = this;
            that.$R.ruleGroupTree({
                model: that.model,
                table: that.table,
                hospital: that.hospital
            }).then(data => {
                that.tree = data.sort();

                //增加及时性检测
                let timeliness = {
                    desc:"及时性",
                    rules:[{category: "及时性",
                    code: "timeliness",
                    desc: "及时性检测",
                    flag: "timelinessxxx",
                    id: "xxx",
                    isTemplate: 0,
                    order: null}]
                }
                that.tree.push(timeliness)

                console.log(that.tree)
            });
        },
        /**
         * 切换路由
         * @param type 核查规则类型，源目：source_target...
         * @param id 规则id，未配置为null
         */
        router(type, id) {
            let that = this;
            let param = {
                id: id,
                type: type,
                url: that.url,
                model: that.model,
                table: that.table,
                hospital: that.hospital
            };
            switch (type) {
                case 'abs':
                    this.$router.push({
                        path: '/dialog/Abs',
                        query: param
                    });
                    break;
                case 'main_detail':
                    this.$router.push({
                        path: '/dialog/MainDetail',
                        query: param
                    });
                    break;
                case 'source_target':
                    this.$router.push({
                        path: '/dialog/SourceTarget',
                        query: param
                    });
                    break;
                case 'row':
                    this.$router.push({
                        path: '/dialog/Row',
                        query: param
                    });
                    break;
                case 'non_empty':
                    this.$router.push({
                        path: '/dialog/NonEmpty',
                        query: param
                    });
                    break;
                case 'enum':
                    this.$router.push({
                        path: '/dialog/Enum',
                        query: param
                    });
                    break;
                case 'timeliness':
                    this.$router.push({
                        path: '/dialog/JiShiXing',
                        query: param
                    });
                    break;
            }
        }
    }

};
</script>

<style lang="scss" scoped>

.page {
    display: flex;
    height: calc(100% - 36px);
    top: 0;
    bottom: 0;
    overflow: auto;

    .left {
        width: 170px;

        .leftMenu-dl {
            box-sizing: border-box;
            width: 100%;
            padding: 10px;

            .dt {
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                background: $body_BG6;
                color: $box_font2;
                font-size: 12px;
                // color: $box_font2;
            }

            .dd {
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                padding-left: 34px;
                color: $box_font2;
                font-size: 12px;
                position: relative;

                span.i-box {
                    width: 12px;
                    height: 12px;
                    border: 1px solid #ccc;
                    background: #e6e6e6;
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    margin-top: -6px;

                    .el-icon-check {
                        position: absolute;
                        left: 0;
                        top: 0;
                        color: #fff;
                    }
                }

                &.act {
                    span.i-box {
                        border: 1px solid $box_bordr3;
                        background: $box_bg3;
                    }

                    color: $box_font4;
                }
            }
        }

    }

    .right {
        flex: 1;
        height: 100%;
        top: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>
