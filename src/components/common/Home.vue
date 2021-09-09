<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':isCollapse}">
            <v-tags></v-tags>
            <div class="content">
                 <!-- <transition name="move" mode="out-in"> -->
                
                    <keep-alive :include="tagsList" exclude='dashboard'>
                        <router-view></router-view>
                    </keep-alive>
               
                <el-backtop target=".content"></el-backtop>
            </div>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './sidebar/';
import vTags from './Tags.vue';
import Footer from './Footer.vue';
import bus from './bus';
import admin from '@/util/admin';
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            tagsList: [],
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
        Footer
    },
    computed: mapGetters(['userInfo', 'isLock', 'isCollapse', 'website', 'expires_in']),
    created() {
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    mounted(){
      this.init()
    },
    methods: {
        // 屏幕检测
      init() {
        this.$store.commit('SET_SCREEN', admin.getScreen())
        window.onresize = () => {
          setTimeout(() => {
            this.$store.commit('SET_SCREEN', admin.getScreen())
          }, 0);
        }
      },
    }
};
</script>
