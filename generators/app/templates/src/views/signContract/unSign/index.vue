<template>
    <div class="container">
        <div class="un-sign">
            <div class="title">当前办理车辆</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="7">
                        <label>车牌号码：</label>
                        <span>{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span>{{getColor(vehicleInfo.vehicle_color)}}</span>
                    </el-col>
                    <el-col :span="9">

                    </el-col>
                </el-row>
            </div>
            <div class="title">用户资料信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="7">
                        <label>用户编号：</label>
                        <span>{{customerInfo.customer_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户名称：</label>
                        <span>{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>开户日期：</label>
                        <span>{{customerInfo.open_date.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="7">
                        <label>用户类型：</label>
                        <span>{{getCustomerType(customerInfo.customer_type)}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>证件类型：</label>
                        <span>{{getCertificatesType(customerInfo.certificates_type)}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>证件号码：</label>
                        <span>{{customerInfo.certificates_code}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="7">
                        <label>联系人：</label>
                        <span>{{customerInfo.link_man}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>邮政编码：</label>
                        <span>{{customerInfo.posttal_code}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>联系电话：</label>
                        <span>{{customerInfo.link_phone}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <label>邮寄地址：</label>
                        <span>{{vehicleInfo.link_address}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">用户签约信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="7">
                        <label>车牌号码：</label>
                        <span>{{signInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span>{{getColor(signInfo.vehicle_color)}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>委托日期：</label>
                        <span>{{signInfo.contract_date.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3')}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="7">
                        <label>开户行：</label>
                        <span>{{getBankCode(signInfo.bank_code)}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>银行卡号：</label>
                        <span>{{signInfo.bank_account}}</span>
                    </el-col>
                    <el-col :span="9">
                        <label>卡功能：</label>
                        <span>{{getBankCardType(signInfo.bank_account_type)}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>

        <dlg-footer :btninfos="ftBtnArrays.unSign" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {cmds, ftBtns} from "../../../utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter"
    import * as dict from "../../../utils/dictionaries";
    import fetch from "../../../utils/fetch";
    import api from '@/api'

    export default {
        name: 'UnSign',
        props: {},
        components: {
            DlgFooter
        },
        created() {
            this.querySign()
        },
        mounted() {

        },
        data() {
            return {
                defaultLoadingStr: '加载中，请稍候...',
                customerInfo: this.$store.getters.customerInfo,
                vehicleInfo: this.$store.getters.vehicleInfo,
                ftBtnArrays: ftBtns,
                signInfo: {
                    /* vehicle_code:'',
                     vehicle_color:'',
                     bank_account:'',
                     bank_account_type:'',
                     bank_code:'',
                     bank_code_name:'',
                     contract_date:'',*/
                },

            }
        },
        methods: {
            querySign: function () {
                this.startLoading()
                //重新加载当前车辆信息，存入store
                fetch({
                    url: api['getBankcontract'].url || '',
                    method: 'post',
                    data: {
                        method: api['getBankcontract'].method,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                        vehicle_color: this.vehicleInfo.vehicle_color
                    }
                }).then(res => {
                    this.endLoading()
                    if (res.length > 0)
                        this.signInfo = res[0]
                    console.log('signInfo', this.signInfo)
                }).catch(error => {
                    this.endLoading()
                    this.$message({
                        showClose: true,
                        type: 'success',
                        message: "当前车辆签约信息获取失败",
                    });
                })

            },
            ftClick: function (cmd) {
                switch (cmd) {
                    case cmds.unSign:
                        this.$msgbox({
                            message: '是否确定撤销该签约',
                            title: '提示',
                            customClass: 'my_msgBox',
                            showCancelButton:true
                        }).then(() => {
                            // debugger
                            this.startLoading()
                            fetch({
                                url: api['unSign'].url || '',
                                method: 'post',
                                data: {
                                    method: api['unSign'].method,
                                    vehicle_code: this.vehicleInfo.vehicle_code,
                                    vehicle_color: this.vehicleInfo.vehicle_color
                                }
                            }).then(res => {
                                // debugger
                                this.endLoading()
                                this.$msgbox({
                                    message: '撤销签约操作成功',
                                    title: '成功',
                                    customClass: 'my_msgBox singelBtn',
                                    confirmButtonText: '确定',
                                    type: 'success'
                                })
                            }).catch(error => {
                                // debugger
                                this.endLoading()
                                this.$msgbox({
                                    message: '撤销签约操作失败:' + error.message,
                                    title: '失败',
                                    customClass: 'my_msgBox singelBtn',
                                    confirmButtonText: '确定',
                                    type: 'error'
                                })
                            })
                        })
                        break;
                    default:

                        break;
                }
            },
            getColor: function (val) {
                return dict.getVehicleColor(val)
            },
            getCustomerType: function (val) {
                return dict.getCustomerType(val)
            },
            getBankCardType: function (val) {
                return dict.getBankCardType(val)
            },
            getCertificatesType: function (val) {
                return dict.getCertificatesType(val)
            },
            getBankCode: function (val) {
                return dict.getsignBankCode(val)
            },
        },

    };
</script>

<style lang="scss" scoped>
    .container {
        .un-sign {
            background: #ffffff;
            padding: 12px 36px 12px 79px;

            .title {
                letter-spacing: 2px;
                font-family: 'PingFangSC-Regular';
                text-align: left;
                height: 22px;
                line-height: 22px;
                color: #000000;
                border-left: 2px solid #5584ff;
                padding: 0px 0px 0px 12px;

                span {
                    color: #a0a2ad;
                    font-size: 12px;
                    display: inline-block;
                    margin-left: 36px;
                }
            }

            .info {
                margin: 12px 0px 12px 40px;

                .el-col {
                    text-align: left;
                    padding: 6px 0px 6px 0px;

                    label {
                        display: inline-block;
                        font-size: 12px;
                        color: #999999;
                        text-align: right;
                        min-width: 70px;
                        font-weight: normal;
                        padding-right: 8px;
                    }

                    span {
                        display: inline-block;
                        text-align: left;
                        font-size: 14px;
                        min-width: 60px;
                        color: #000000;
                    }

                    .official {
                        height: 28px;
                        width: 97px;
                        background-color: #01c1b2;
                        line-height: 28px;
                        padding: 0px;
                        border-radius: 6px;

                        span {
                            color: #ffffff;
                        }
                    }
                }
            }
        }
    }
</style>
