<template>
    <div style="position: absolute;height: 100%;width:100%;">
        <etc-hdBar></etc-hdBar>
        <el-row class="tac">
        <el-col :span="4" style="height:100%;">
            <el-menu
                default-active=""
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                unique-opened
                router
                active-text-color="#fff"
                >
                <el-menu-item index="index" @click="clickMenu('index')">
                <i class="el-icon-star-on"></i>
                <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu
                v-for="item of menu"
                :index="item.id"
                :key="item.id"
                >
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group class="over-hide">
                    <el-menu-item
                        v-for="sub of item.sub"
                        :index="sub.componentName"
                        :key="sub.componentName"
                        @click="clickMenu(sub.componentName)"
                        >
                        {{sub.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-col>
        <el-col :span="20">
            <navMain></navMain>
            <keep-alive>
                <router-view/>
            </keep-alive>
        </el-col>
    </el-row>
    </div>
    
</template>
<script>
import navMain from '@/views/newDashBoard/navMain/navMain'
import menu from '@/api/menu-config.js'
import EtcHdBar from '@/components/HdBar';
  export default {
    components:{EtcHdBar,navMain},
    data () {
        return {
            menu: menu,
            openedTab: []
        }
    },
    mounted(){
        // this.$router.push('/userList');
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      gotoRoute(val){
          switch(val){
            case "user":
                this.$router.push('/userList');
                break;
             case "his":
                this.$router.push('/hisList');
                break;
            case "channel":
                this.$router.push('/channelList');
                break;
                
          }
      },
      clickMenu (componentName) {
            this.openedTab = this.$store.state.openedTab
            // tabNum 为当前点击的列表项在openedTab中的index，若不存在则为-1
            let tabNum = this.openedTab.indexOf(componentName)
            console.log(tabNum)
            console.log(this.openedTab)
            console.log(this.$store.state.openedTab)
            if (tabNum === -1) {
                // 该标签当前没有打开
                // 将componentName加入到已打开标签页state.openedTab数组中
                this.$store.commit('addTab', componentName)
            } else {
                // 该标签是已经打开过的，需要激活此标签页
                this.$store.commit('changeTab', componentName)
            }
      }
    }
  }
</script>
<style scoped lang="scss">
    .el-menu-item-group__title{
        padding:0px !important;
    }
    .el-menu-vertical-demo{
        height: 100%;
    }
    .tac{
        height: 100%;
    }
    // .el-row{
    //     position: static;
    // }
</style>