<template>
    <div class="correct">
        <p>*仅可对当天的充值记录进行充值冲正操作</p>
        <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
            <el-table-column
            width="55">
                <template scope="scope">
                    <el-radio :label="scope.$index" v-model="templateRadio" @change.native="handlegetTemplateRow(scope.$index,scope.row)">&nbsp</el-radio>
                </template>
            </el-table-column>
            <el-table-column
            label="充值时间"
            width="">
                <template slot-scope="scope">{{ scope.row.trans_time }}</template>
            </el-table-column>
            <el-table-column
            prop="recharge_type"
            label="充值方式"
            width="">
            </el-table-column>
            <el-table-column
            prop="money"
            label="充值金额"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="bank_no"
            label="银行卡号"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="bank_name"
            label="发卡银行"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="batch_no"
            label="批次号"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="reference_no"
            label="参考号"
            show-overflow-tooltip>
            </el-table-column>
        </el-table>
        <div class="card-issue-content">
            <div class="title">冲正信息</div>
            <div class="info">
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
import DlgFooter from "@/components/Dialog/DlgFooter";
import {ftBtns} from "@/utils/ftBtnConsts";
import api from '@/api'
import fetch from '@/utils/fetch'

export default {
    components:{DlgFooter},
    data () {
        return {
            tableData3:[],
            rechargeInfo:{},
            formLabelAlign:{},
            remarkError:'',
            templateRadio:''
        }
    },
    computed:{
        btninfos () {
            return ftBtns.posCorrect
        }
    },
    created () {
        let params = {
            customer_id:this.customerInfo.customer_id
        }
        this._postCorrectSearch(params).then((res)=>{
            this.tableData3 = res;
        },(error) => {

            this.$alert(error.message, '提示', {
                dangerouslyUseHTMLString: true,
                showClose:false,
                confirmButtonText: '确定',
                callback: action => {}
            });
            this.tableData3 = [];
        })
    },
    methods:{
        _postCorrectSearch(params){
             this.startLoading();
             return  new Promise((resolve, reject) => {
                fetch({
                    url: api['postCorrectSearch'].url || '',
                    method: 'post',
                    data: {
                        method:api['postCorrectSearch'].method,
                        ...params
                    }
                }).then((response)=> {
                    this.endLoading();
                    resolve(response);
                }).catch((err)=>{
                    this.endLoading();
                    reject(err)
                })
            })
        },
        handleSelectionChange(val) {
            console.log(val,"rrrrr");
        },
        handleOnFtClick(cmd){

            if(!this.formLabelAlign.remark){
                this.remarkError = "备注不能为空！";
                return false;
            }

            this.remarkError = '';

           let params = {
                customer_id:this.customerInfo.customer_id,
                correct_money:this.formLabelAlign.money,
                batch_no:this.rechargeInfo.batch_no,
                reference_no:this.rechargeInfo.reference_no,
                remark:this.formLabelAlign.remark
            }

                wsApi.posCorrect(params,(res) => {
                    let rspData = JSON.parse(msg.data);
                    if (rspData.return_code === '0') {

                        let bizContent = JSON.parse(rspData.biz_content);
                        this.rechargeInfo = {...bizContent};

                        Object.keys(this.formLabelAlign).forEach(el => {
                            this.formLabelAlign[el] = '';
                        })
                        this.templateRadio = '';

                        this.$msgbox("冲正操作成功","成功",'success',{showCancelButton:false,confirmButtonText:'确定'})

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
        },
        handlegetTemplateRow(index, row){
            console.log(index,row,"rrrr")
        }
    }
}
</script>
<style lang="scss">
.correct{
    p{
        padding-left:14px;
        color: #01C1B2;
        font-size:14px;
    }
}
</style>


