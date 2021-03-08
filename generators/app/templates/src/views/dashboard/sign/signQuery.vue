<template>
    <div class="signQuery query">
            <div class="item">
                <el-select size="small" v-model="formObj.vehicle_color" placeholder="车牌颜色">
                    <el-option label="蓝" value="0"></el-option>
                    <el-option label="黄" value="1"></el-option>
                    <el-option label="黑" value="2"></el-option>
                    <el-option label="白" value="3"></el-option>
                    <el-option label="渐变绿" value="4"></el-option>
                    <el-option label="黄绿双拼" value="5"></el-option>
                    <el-option label="蓝白渐变" value="6"></el-option>
                </el-select>
                <el-input 
                size="small" 
                v-model="formObj.vehicle_code" placeholder="车牌号码" 
                @keyup.enter.native="handleOnSearch">
                </el-input>
            </div>
            <el-input 
            size="small" 
            v-model="formObj.bank_account" placeholder="银行卡号"
            @keyup.enter.native="handleOnSearch">
            </el-input>
            <div class="btn">
                <el-button class="search" @click="handleOnSearch">查询</el-button>
            </div>
    </div>
</template>
<script>
    import api from '@/api';
    import fetch from '@/utils/fetch';

    export default {
        name:'SignQuery',
        data () {
            return {
                formObj:{
                    vehicle_color:'0',
                    vehicle_code:'',
                    bank_account:''
                }
            }
        },
        watch:{
            'formObj.vehicle_code' (newval) {
                this.formObj.vehicle_code = newval.toUpperCase();
            }
        },
        methods:{
            handleOnSearch(){
                // debugger
                let params = {};
                Object.keys(this.formObj).forEach(el => {
                    if(this.formObj[el]){
                        params[el] = this.formObj[el]
                    }
                })
                this.getBankcontract(params).then(res => {
                    this.$emit('onSearch',{type:'2',res})
                },(error) => {

                    this.$alert(error.message, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {}
                    });

                    this.$emit('onSearch',{type:'2',res:[]})
                })
                
            },
            getBankcontract(Info){
                return new Promise((resolve, reject) => {
                    fetch({
                        url: api['getBankcontract'].url || '',
                        method: 'post',
                        data: {
                            method:api['getBankcontract'].method,
                            ...Info
                        }
                    }).then(res => {
                        resolve(res)
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }
    }
</script>
<style type="text/scss"  lang="scss">
    @import "../../../styles/mixin";
    .signQuery{
        .item{
            margin-bottom:10px;
        }
        .btn{
            text-align: right;
            margin-top:10px;
            .search{
                background-color: $second-color;
                padding:5px 12px;
            }
        }
        
    }
</style>