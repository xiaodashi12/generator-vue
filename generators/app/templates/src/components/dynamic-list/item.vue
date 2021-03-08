<template>
    <div class="list">
        <el-row :key="index + 'row'" v-for="(item,index) in listArr">
            <el-col :span="itemCol['span'] || 24" v-for="(itemCol,cIndex) in item" :key="cIndex +'col'">
                <div class="listRow">
                    <label class="listLabel">{{itemCol.label}}</label>
                    <div class="listVal" v-text="itemCol['record'] ? itemCol.record(valObj[itemCol.field]) : valObj[itemCol.field]"></div>
                    <div v-if='itemCol.field == "link_mobile"' style="font-size: 12px;position: absolute;right: 2px;color: #ADADAD;line-height: 13px;">绑定票<br>根平台</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name:'DynamicListItem',
        props:{
            valObj:{
                type:Object,
                default:{}
            },
            listArr:{
                type:Array,
                default:[]
            }
        },
        data () {
            return {

            }
        }
    }
</script>
<style type="text/scss"  lang="scss">
    @import "../../styles/mixin";
    .list{
        padding: 10px 0;
        .listRow{
            flex: 1;
            padding: .3rem 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: .35rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: row;
            .listLabel{
                width: 1.8rem;
                font-size: .35rem;
                color: #999;
                text-align: left;
            }
            .listVal{
                width: calc(100% - 1.8rem);
                white-space:normal;
                word-break:break-all;
                word-wrap:break-word;
            }
        }
        
    }
</style>