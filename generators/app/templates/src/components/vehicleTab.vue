<template>
    <div>
        <div class="vehicleTab">
            <div 
            @click="changeActive(item.key)" 
            :class="active === item.key ? 'active':''"
            v-for="(item, index) in vehicleTabList"
            :key="index">
                    {{item.value}}
            </div>
        </div>
        <div class="content">
                <slot name="child"></slot>
            </div>
    </div>
</template>
<script>
export default {
    props:{
        vehicleTabList:{
            type:Array,
            default:[]
        }
    },
    data () {
        return {
            active:0
        }
    },
    methods:{
        changeActive(key){
            this.active = key;
            this.$emit('onChangeActive',key)
        }
    }
}
</script>
<style type="text/scss" lang="scss">
    @import "~styles/mixin";
    .vehicleTab {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex: 1;
        align-items: center;
        box-shadow: 0px 4px 5px #e5e5e5;
        > div {
        cursor: pointer;
        flex: 1;
        text-align: center;
        padding: 10px 0;
        border-bottom: 2px solid transparent;
        }

        .active {
        border-bottom-color: $second-color;
        color: $second-color;
        background: #eeeeee;
        }
    }
</style>


