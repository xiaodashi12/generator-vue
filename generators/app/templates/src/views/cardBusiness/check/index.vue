<template>
    <div class="container">
        <div class="main_content">
            <div class="checkCard">
                <div class="title">卡片信息</div>
                <div class="info">
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>卡片编号：</label>
                            <span>{{sysVehicleInfo.cpu_card_id}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>卡片类型：</label>
                            <span>{{cardTypeStr}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>发行方：</label>
                            <span>{{sysVehicleInfo.issue_id}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>启用时间：</label>
                            <span>{{sysVehicleInfo.start_date}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>到期时间：</label>
                            <span>{{sysVehicleInfo.end_date}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>用户类型：</label>
                            <span>{{vehicleUserTypeStr}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>车牌号码：</label>
                            <span>{{sysVehicleInfo.vehicle_code}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车牌颜色：</label>
                            <span>{{vehocleCardInfoColorStr}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车&nbsp;&nbsp;型：</label>
                            <span>{{vehicleClass}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>卡片颜色：</label>
                            <span>{{sysVehicleInfo.agency_type=='0'?'蓝卡':sysVehicleInfo.agency_type=='1'?'黄卡':''}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>卡内余额：</label>
                            <span>{{sysVehicleInfo.balance_money?(sysVehicleInfo.balance_money/100).toFixed(2):''}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车辆自重：</label>
                            <span>{{sysVehicleInfo.vehicle_weight}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="title">卡内流水</div>
            </div>
            <el-table :data="tableData" stripe style="width: 100%;max-height: 450px;overflow-y: auto;margin-top: 5px"
                      :header-cell-style="{textAlign:'center',height:40,background:'#eef1f6',color:'#606266'}">
                <el-table-column prop="trans_time" label="交易时间"></el-table-column>
                <el-table-column prop="trans_type" label="交易类型" :formatter="formatTransType">
                </el-table-column>
                <el-table-column prop="trans_money" label="交易金额">
                    <template slot-scope="scope">
                        <span>{{(scope.row.trans_money / 100 ).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="trans_serial" label="交易序号"></el-table-column>
                <el-table-column prop="terminal_no" label="终端机编号"></el-table-column>
            </el-table>
        </div>


        <dlg-footer :btninfos="ftBtnArrays.checkCard" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import * as dict from '@/utils/dictionaries'
    import WsApi from '@/api/wsApi'
    import WsConsts from '@/utils/wsConsts'
    import {cmds, ftBtns} from '@/utils/ftBtnConsts'
    import DlgFooter from '@/components/Dialog/DlgFooter'

    export default {
        mounted() {
            // this.ftClick(cmds.readCard)
        },
        components: {
            DlgFooter,
        },
        props: {

        },
        methods: {
            formatTransType: function (row, col) {
                return dict.getTransType(row.trans_type)
            },
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                switch (cmd) {
                    //读卡
                    case cmds.readCard:
                        this.sysVehicleInfo = {}
                        this.tableData = []
                        //如果当前车辆存在CPU卡号，则传入
                        let param = {}
                        if (this.vehicleInfo && this.vehicleInfo.cpu_card_id)
                            param['cpu_card_id'] = this.vehicleInfo.cpu_card_id
                        //初始化卡信息
                        this.cardInfo = {};
                        this.startLoading(this.defaultLoadingStr);
                        WsApi.readCpuInfo(param, this.onMsg, this.onErr);
                        break;
                    //其他（上一步、下一步）
                    default:
                        return;
                }
            },
            //websocket消息处理回调
            onMsg: function (msg) {
                this.endLoading();
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readCpuInfo:
                            this.sysVehicleInfo = bizContent;
                            
                            //卡内近期流水记录
                            let params = {
                                cpu_card_id: this.sysVehicleInfo.cpu_card_id,
                                jour_num: 10
                            };
                            console.log('params', params)
                            //卡内近期流水数据
                            WsApi.readCardJour(params, this.onMsg, this.onErr);
                            break;
                        case WsConsts.methods.readCardJour:
                            this.tableData = bizContent.jour_list;
                            break;
                        default:
                            break;
                    }
                } else {
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: rspData.return_msg,
                    });
                }
                console.log("收到消息：" + msg.data);
            },
            //websocket异常处理回调
            onErr: function (err) {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: "请求异常：" + err.message,
                });
                //隐藏进度条
                this.endLoading();
                console.log("请求异常：" + err.message);
            },
        },
        data() {
            return {
                defaultLoadingStr:'加载中，请稍候...',
                ftBtnArrays: ftBtns,
                sysVehicleInfo: {},
                tableData: []
            }
        },
        computed: {
            vehicleClass: function () {
                return dict.getNewVehicleType(this.sysVehicleInfo.vehicle_class)
            },
            //卡片类型字符串
            cardTypeStr: function () {
                return dict.getCardType(this.sysVehicleInfo.card_type)
            },
            //车辆用户类型字符串
            vehicleUserTypeStr: function () {
                return dict.getVehicleUserType(this.sysVehicleInfo.vehicle_user_type);
            },
            vehocleCardInfoColorStr: function () {
                return dict.getVehicleColor(this.sysVehicleInfo.vehicle_color);
            },
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../../styles/common";
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .main_content{
            height: $dialog-height;
            overflow-y: auto;
        }
        /deep/ .el-table {
            .cell {
                text-align: center !important;
            }

            &:before {
                display: none;
            }
        }

        .checkCard {
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
