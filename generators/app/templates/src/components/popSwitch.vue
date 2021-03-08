<!--这是一个可以用于弹窗顶部样式随点击事件变换的封装-->
<template>
    <div>
        <div class="vehicleTab">
            <div @click="changeActive(item.key)" :class="active === item.key? 'popClass':''"
                 v-for="(item, index) in btnList">{{item.value}}
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name:'popSwitch',
        components:{},
        props: {
            btnList:{
                type:Array,
                default:[],
            }
        },
        data () {
            return {
                active: '0',
            }
        },
        computed:{
        },
        created(){
        },
        destroyed () {

        },
        methods:{
            changeActive(key){
                this.active = key;
                this.$emit('onChange', key )
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../styles/mixin";

</style>
