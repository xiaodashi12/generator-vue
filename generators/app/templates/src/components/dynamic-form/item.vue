<template>
    <el-form-item
    class="etcFormItem" 
    :label="domain.name"
    :prop="domain.field"
    :rules="domain.rules"
    :style="domain.styleObj"
    >
        <!--fieldType = 1 下拉单选-->
            <el-select
            size="small"
            v-if="domain.fieldType == 1"
            v-bind="$attrs" 
            v-on="$listeners"
            :disabled="domain['isDisabled']"
            :placeholder="domain.placeholder"
            @change="domain['event'] && domain.event['onSelectChange'] && domain.event.onSelectChange(domain,$event)">
                <el-option
                    v-if="domain['allVal']"
                    v-for="(item,index) in domain.allVal"
                    :key="item+'-'+index"
                    :label="item.name" 
                    :value="item.value">
                </el-option>
            </el-select>
        <!--fieldType = 2 输入框-->
                <el-input
                size="small"
                :name="domain.field"
                v-if=" domain.fieldType == 2 "
                v-bind="$attrs" 
                v-on="$listeners"
                :disabled="domain['isDisabled']"
                :placeholder="domain.placeholder"
                @blur="domain['event'] && domain.event['onTextBlur'] && domain.event.onTextBlur">
            </el-input>

        <!--fieldType = 3 切换按钮-->
        <div class="fieldType3" v-if="domain.fieldType == 3 " >
            <el-button
            :key="item+'-'+val"
            v-for="(item,val) in domain.allVal"
            size="small"
            @click="domain['event'] && domain.event['onBtnClick'] && domain.event.onBtnClick(item.value,domain.field)"
            :type="getBtnType($attrs,item.value)"
            :plain="getBtnType($attrs,item.value) == 'info' ? true : false">
                {{item.name}}
            </el-button>
        </div>
        <!--fieldType = 4 文本域-->
        <el-input
            v-if="domain.fieldType == 4"
            :type="domain.type || 'text'"
            :rows="2"
            resize="none"
            :placeholder="domain.placeholder"
            v-bind="$attrs" 
            v-on="$listeners"
            :disabled="domain['isDisabled']">
            <template :slot="domain.slot">{{domain.slotText}}</template>
        </el-input>
    </el-form-item>
</template>
<script>
export default {
    name:"dynamicFormItem",
    props: {
      domain: {
        type: Object,
        required: true
      }
    },
    methods:{
        getBtnType(event,val){
            
            if(event.value != val || !event || !val){
                return 'info'
            }else{
                return 'primary'
            }
        }
    }
}
</script>
<style lang="less">
    .etcFormItem{
        .fieldType3{
            .el-button{
                span{
                    font-size: 12px;
                }
                &:first-child{
                    border-top-right-radius:0;
                    border-bottom-right-radius: 0;
                }
            }
            .el-button + .el-button{
                margin-left:0;
                border-top-left-radius:0;
                border-bottom-left-radius: 0;
                border-left:none;
            }
        }
    }
</style>


