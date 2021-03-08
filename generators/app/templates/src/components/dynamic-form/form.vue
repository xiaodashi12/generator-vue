<template>
    <el-form 
    label-position="right" 
    :label-width="labelWidth" 
    :model="formLabelAlign">
        <slot name="header"></slot>
        <dynamic-form-item
        v-if="isShow(domain)"
        v-for="(domain,index) in formDomains" 
        :key="domain.field+'-'+index"
        :domain="domain"
        @input="handleInput($event, domain.field)"
        :value="formLabelAlign[domain.field]">
        </dynamic-form-item>
        <slot name="footer"></slot>
    </el-form>
</template>
<script>
import dynamicFormItem from './item'
export default {
    name:"dynamicForm",
    components:{dynamicFormItem},
    props:{
        formLabelAlign:{
            type:Object,
            default:() => {
                return {};
            }
        },
        formDomains:{
            type:Array,
            default:() => {
                return [];
            }
        },
        labelWidth:{
            type:String,
            default:'180px'
        }
    },
    data () {
        return {

        }
    },
    methods:{
        isShow(domain){
            if(domain.hasOwnProperty('parentValue') && domain.hasOwnProperty('parentFiled')){
                return this.formLabelAlign[domain.parentFiled] == domain['parentValue']
            }
            return true
        },
        handleInput(val,key) {
            this.$emit('input', { ...this.formLabelAlign, [key]: val })
        }
    }
}
</script>

