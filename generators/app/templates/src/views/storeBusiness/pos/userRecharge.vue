<template>
    <div class="userRecharge">
        <div class="card-issue-content">
            <div class="title">用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{customerInfo.customer_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>账户余额：</label>
                        <span class="rg">{{customerMoney | flMoney}}元</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">充值信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="12">
                        <dynamic-form
                        ref="dynamicForm"
                        :labelWidth="'78px'"
                        :formDomains="formDomains"
                        :formLabelAlign="formLabelAlign"
                        @input="handleInput">
                        </dynamic-form>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>商户编号：</label>
                        <span class="rg">{{rechargeInfo.terminal_no}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>商户名称：</label>
                        <span class="rg">{{rechargeInfo.biz_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>终端编号：</label>
                        <span class="rg">{{rechargeInfo.terminal_no}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>操作员号：</label>
                        <span class="rg">{{rechargeInfo.op_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>收单银行：</label>
                        <span class="rg">{{rechargeInfo.order_bank}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>发卡银行：</label>
                        <span class="rg">{{rechargeInfo.publish_bank}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡号：</label>
                        <span class="rg">{{rechargeInfo.bank_card}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>交易：</label>
                        <span class="rg">{{rechargeInfo.transaction}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡有效期：</label>
                        <span class="rg">{{rechargeInfo.card_valid}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>批次号：</label>
                        <span class="rg">{{rechargeInfo.batch_no}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>凭证号：</label>
                        <span class="rg">{{rechargeInfo.voucher_no}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>参考号：</label>
                        <span class="rg">{{rechargeInfo.reference_no}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>授权号：</label>
                        <span class="rg">{{rechargeInfo.auth_no}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>交易时间：</label>
                        <span class="rg">{{rechargeInfo.trans_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>交易金额：</label>
                        <span class="rg">{{rechargeInfo.recharge_money}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <el-form 
                        ref="remorkForm"
                        label-position="right" 
                        label-width="78px" 
                        :model="formLabelAlign">
                            <el-form-item
                            class="etcFormItem"
                            label="撤销备注"
                            prop="remark"
                            :error="remarkError">
                                <el-input
                                type="textarea"
                                rows="2"
                                resize="none"
                                v-model="formLabelAlign.remark"
                                placeholder="请输入备注">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </div>
        <dlg-footer :btninfos="btninfos" @ftClick="handleOnFtClick"></dlg-footer>
    </div>
</template>
<script>
import dynamicForm from '@/components/dynamic-form/form';
import DlgFooter from "@/components/Dialog/DlgFooter";
import {ftBtns} from "@/utils/ftBtnConsts";
import wsApi from '@/api/wsApi'

export default {
    components:{dynamicForm,DlgFooter},
    props:{
        rechargeInfo:{//充值信息
            type:Object,
            default:{}
        }
    },
    data () {
        return {
            customerMoney:0,
            formDomains:[],
            formLabelAlign:{},
            remarkError:''
        }
    },
    created () {
        this.forFunc();
    },
    computed:{
        btninfos () {
            return ftBtns.posRecharge
        }
    },
    methods:{
        forFunc(){

            let arr = this.getFormDomains();;
            let func = (idx) => {
            
              if(idx >= arr.length) {
                
                this.formDomains = arr;
                console.log(this.formDomains,"formDomains")
                return false;
              }

              const item = arr[idx];
              this.$set(this.formLabelAlign,item.field,item.defaultVal);

              func(idx + 1);
            }
            return func(0);

         
        },
        checkMoney(rule, value, callback){
            if (value === '') {
                callback(new Error('充值金额不能为空！'));
            } else {
                let target = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                if(target.test(value)){
                    if(value > 10000){
                        callback(new Error('充值金额单次不能大于1万！'));
                    }
                    callback();
                }else{
                   callback(new Error('充值金额必须大于零并保留两位小数点！')); 
                }
                callback();
            }
        },
        getFormDomains(){
            let arr = [{
                name:'充值金额',
                field:'money',
                fieldType:4,
                type:'text',
                slot:'append',
                slotText:'元',
                defaultVal:'',
                rules:[{
                    validator:this.checkMoney,trigger: 'blur'
                }],
                placeholder:'请填写充值金额'
            }]
            return arr;
        },
        handleInput(val){
            this.formLabelAlign = {...val}
            console.log(this.formLabelAlign,"this.formLabelAlign")
        },
        handleOnFtClick(cmd){

            this.remarkError = '';
            let params = {
                customer_id:this.customerInfo.customer_id
            }

            let dynamicForm = this.$refs['dynamicForm'];
            let _form = dynamicForm.$children[0];

            if(cmd == 'recharge'){//充值
                _form.validate(valid => {
                    if(valid){

                        let radiusLb6 = document.getElementsByClassName('radius-l-b-6');
                        params.money = this.formLabelAlign.money;

                        wsApi.posRecharge(params,(res) => {

                            let rspData = JSON.parse(msg.data);
                            if (rspData.return_code === '0') {

                                let bizContent = JSON.parse(rspData.biz_content);
                                this.rechargeInfo = {...bizContent};


                                if(radiusLb6.classList.includes('is-disabled')){
                                    radiusLb6.classList.remove("is-disabled");
                                }

                                Object.keys(this.formLabelAlign).forEach(el => {
                                    this.formLabelAlign[el] = '';
                                })

                                this.$msgbox("充值操作成功","成功",'success',{showCancelButton:false,confirmButtonText:'确定'})

                            }else{
                                this.$alert(rspData.return_msg, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });

                                
                                if(radiusLb6.length > 0 && !radiusLb6[0].classList.includes('is-disabled')){
                                    radiusLb6[0].classList.add("is-disabled");
                                }
                                
                            }
                        },(error) => {
                            this.$alert(error.message, '提示', {
                                dangerouslyUseHTMLString: true,
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: action => {}
                            });

                            
                            if(radiusLb6.length > 0 && !radiusLb6[0].classList.includes('is-disabled')){
                                radiusLb6[0].classList.add("is-disabled");
                            }
                        })
                    }
                    

                    
                }) 

            }

            if(cmd == 'revoke'){//撤销
                
                if(!this.rechargeInfo.batch_no || !this.rechargeInfo.reference_no){
                    return false;
                }

                if(this.formLabelAlign.money != this.rechargeInfo.recharge_money){
                    this.remarkError = "当前撤销金额不等于交易金额！";
                    return false;
                }
                
                if(!this.formLabelAlign.remark){
                    this.remarkError = "备注不能为空！";
                    return false;
                }


                
                _form.validate(valid => {
                    if(valid){
                        params = {
                            ...params,
                            correct_money:this.formLabelAlign.money,
                            batch_no:this.rechargeInfo.batch_no,
                            reference_no:this.rechargeInfo.reference_no,
                            remark:this.formLabelAlign.remark
                        }
                        wsApi.posCorrect(params,(res) => {
                            let rspData = JSON.parse(msg.data);
                            if (rspData.return_code === '0') {

                                let radiusLb6 = document.getElementsByClassName('radius-l-b-6');
                                if(radiusLb6.length > 0 && !radiusLb6[0].classList.includes('is-disabled')){
                                    radiusLb6[0].classList.add("is-disabled");
                                }

                                Object.keys(this.formLabelAlign).forEach(el => {
                                    this.formLabelAlign[el] = '';
                                })

                                this.$msgbox("撤销操作成功","成功",'success',{showCancelButton:false,confirmButtonText:'确定'})

                            }else{
                                this.$alert(rspData.return_msg, '提示', {
                                    dangerouslyUseHTMLString: true,
                                    showClose:false,
                                    confirmButtonText: '确定',
                                    callback: action => {}
                                });                             
                            }
                        },(error) => {
                            this.$alert(rspData.return_msg, '提示', {
                                dangerouslyUseHTMLString: true,
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: action => {}
                            });
                        })
                    }
                })
            }
        }
    },
    filters:{
        flMoney (val) {
            if(typeof val === 'number'){
                return val.toFixed(2);
            }else{
                var num = new Number(val);
                return num.toFixed(2)
            }
        }
    }
}
</script>
<style lang="scss">

</style>


