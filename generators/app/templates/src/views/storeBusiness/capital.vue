<template>
    <div class="StoreValueFund">
        <div style="overflow-y: auto;">
            <div class="cardMess">
                <div class="cardTitle">
                    <div class="title card_capital_style">卡片信息</div>
                </div>
                <div class="cardContent">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8">
                            <div class="text-ask">
                                用户姓名:
                            </div>
                            <div class="text-data">
                                {{vehicleInfo.customer_name}}
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8">
                            <div class="text-ask">
                                卡片编号:
                            </div>
                            <div class="text-data">
                                {{vehicleInfo.cpu_card_id}}
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8">
                            <div class="text-ask">
                                用户编码:
                            </div>
                            <div class="text-data">
                                {{vehicleInfo.customer_id}}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8-1">
                            <div class="text-ask">
                                车牌号码:
                            </div>
                            <div class="text-data">
                                {{vehicleInfo.vehicle_code}}
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-1">
                            <div class="text-ask">
                                车牌颜色:
                            </div>
                            <div class="text-data">
                                {{vehicleColorStr}}
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-1">
                            <div class="text-ask">
                                车辆类型:
                            </div>
                            <div class="text-data">
                                {{vehicleType}}
                            </div>
                        </el-col>
                    </el-row>
                    <hr class="hrLine">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8-2">
                            <div class="text-money">
                                用户账户可分配余额:
                            </div>

                        </el-col>
                        <el-col :span="8" class="row-bg8-3">
                            <div class="bigMoney">
                                <div class="bigMoney-A">
                                    {{(difMoney.customer_money/100).toFixed(2) || 0}}
                                </div>
                            </div>
                            <div class="text-money-1">元</div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-4">
                            <div class="showCard" @click="preDistri">
                                <div class="showCard-Z">
                                    <div class="textFig" style="display: inline-block;">
                                        <img :src="require('@assets/hand_b.png')" style="width:15px;height:18px;">
                                    </div>
                                    <div class="textBtn">预分配到卡</div>
                                </div>
                            </div>
                            <div class="wenhao">
                                <el-tooltip class="item" placement="top" :hide-after="0" popper-class="whBgcolor">
                                    <div slot="content">
                                        预分配：充值到用户账户的余额需预分配到卡片中才可以圈存，<br/>
                                        请点击左侧"预分配"按钮进行预分配。 可自定义单次预分配金额
                                    </div>
                                    <img :src="require('@assets/help2.png')" style="width:16px;height:16px;">
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <hr class="hrLine">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8-2">
                            <div class="card-money">
                                卡内未圈存金额:
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-3">
                            <div class="bigMoney">
                                <div class="bigMoney-B">
                                    {{(difMoney.card_money /100).toFixed(2)|| 0}}
                                </div>
                            </div>
                            <div class="text-money-1">元</div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-4">
                            <div class="showCard">
                                <div class="showCard_A" @click="disPre">
                                    <div class="textFig" style="display: inline-block;">
                                        <img :src="require('@assets/hand_r.png')" style="width:15px;height:18px;">
                                    </div>
                                    <div class="textBtn_A">余额转存</div>
                                </div>
                                <div class="showCard_B" @click="trapMoney">
                                    <div class="textFig" style="display: inline-block;">
                                        <img :src="require('@assets/hand_b.png')" style="width:15px;height:18px;">
                                    </div>
                                    <div class="textBtn_B">圈存</div>
                                </div>
                            </div>

                            <div class="wenhao">
                                <el-tooltip class="item" effect="dark" placement="top" popper-class="whBgcolor">
                                    <div slot="content">
                                        圈存：点击左侧"圈存"按钮将卡内未圈存金额圈存到卡中<br/>
                                        余额转存：将预分配到卡账户，且未圈存的金额转存至用户账户。余额转存后将开具充值红票。
                                    </div>
                                    <img :src="require('@assets/help2.png')" style="width:16px;height:16px;">
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <hr class="hrLine">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8-2">
                            <div class="text-money">
                                圈存异常被锁定金额:
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-3">
                            <div class="bigMoney">
                                <div class="bigMoney-C">
                                    {{(difMoney.abnormal_money/100).toFixed(2) || 0}}
                                </div>
                            </div>
                            <div class="text-money-1">元</div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-4">
                            <div class="showCard">
                                <div class="showCard-Z" @click="errHandle">
                                    <div class="textFig" style="display: inline-block;">
                                        <img :src="require('@assets/hand_b.png')" style="width:15px;height:18px;">
                                    </div>
                                    <div class="textBtn">异常处理</div>
                                </div>
                            </div>
                            <div class="wenhao">
                                <el-tooltip class="item" effect="dark" placement="top" popper-class="whBgcolor">
                                    <div slot="content">
                                        异常处理：当圈存出现异常情况，圈存的金额被锁定了不能圈存时，<br/>
                                        进行圈存异常处理，把锁定的金额进行解锁
                                    </div>
                                    <img :src="require('@assets/help2.png')" style="width:16px;height:16px;">
                                </el-tooltip>
                            </div>
                        </el-col>
                    </el-row>
                    <hr class="hrLine">
                    <el-row type="flex" class="row-bg" justify="space-around">
                        <el-col :span="8" class="row-bg8-2">
                            <div class="text-money">
                                卡内余额:
                            </div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-3">
                            <div class="bigMoney">
                                <div class="bigMoney-D">
                                    {{(readCardInfo.balance_money/100).toFixed(2) || 0}}
                                </div>
                            </div>
                            <div class="text-money-1">元</div>
                        </el-col>
                        <el-col :span="8" class="row-bg8-5">
                            <div class="showCard_E">
                                <div class="textBtn_E">卡内余额为最终用户可在车道消费的金额</div>
                            </div>
                        </el-col>
                    </el-row>
                    <hr class="hrLine">
                </div>
            </div>
            <div class="cardRecord">
                <div class="cardTitle_A">
                    <div class="title">卡内近期流水记录</div>
                </div>
                <div id="monetable">
                    <el-table :data="tableData" highlight-current-row center style="min-height: 114px;">
                        <el-table-column prop="trans_time" label="交易时间">
                        </el-table-column>
                        <el-table-column prop="trans_type" label="交易类型" :formatter="formatTransType">
                        </el-table-column>
                        <el-table-column prop="trans_money" label="交易金额">
                            <template slot-scope="scope">
                                <span>{{(scope.row.trans_money / 100 ).toFixed(2)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="trans_serial" label="交易序号">
                        </el-table-column>
                        <el-table-column prop="terminal_no" label="终端机编号">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <div style="">
            <button style="" class="duBtn" @click="readCard">读卡</button>
        </div>
        <el-dialog title="预分配" id="preDistri" :visible.sync="dialogDistriVisible" append-to-body width="417px"
                   :lock-scroll="true" style="margin-top: 15vh;" :close-on-click-modal="false">
            <div v-if="dialogDistriVisible">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="8" class="row-bg-Pre6">
                        <div class="preText">
                            卡号:
                        </div>
                    </el-col>
                    <el-col :span="16" class="row-bg-Pre18">
                        <div class="preData">
                            {{readCardInfo.cpu_card_id}}
                        </div>
                    </el-col>
                </el-row>
                <hr class="hrLine">
                <el-row type="flex" class="row-bg" justify="space-around" style="height:38px;">
                    <el-col :span="8" class="row-bg-Pre6">
                        <div class="preText">
                            可分配余额:
                        </div>
                    </el-col>
                    <el-col :span="16" class="row-bg-Pre18-1">
                        <div class="preData_A">
                            {{(difMoney.customer_money/100).toFixed(2) || 0}}
                        </div>
                        <div class="text-money-2">元</div>
                    </el-col>
                </el-row>
                <hr class="hrLine">
                <el-row type="flex" class="row-bg" justify="space-around">
                    <el-col :span="8" class="row-bg-Pre6">
                        <div class="preText">
                            预分配金额:
                        </div>
                    </el-col>
                    <el-col :span="16" class="row-bg-Pre18-1">
                        <el-input placeholder="请输入金额" type="number" v-model="moneyInput" style="">

                            <template slot="append" style="">元</template>
                        </el-input>
                        <div class="smalltext" @click="allMoneyInput">
                            <a>全额预分配</a>
                        </div>
                    </el-col>
                </el-row>
                <hr class="hrLine">
                <div class="lastText">
                <span>
                    *金额预分配后需要进行圈存才可正常使用
                </span>
                </div>
                <el-row :gutter="0" class="preBtn">
                    <el-col :span="12">
                        <div class="grid-content bg-purple" @click="cancel">
                            <label class="dantext">取消</label>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple1" @click="predisAll">
                            <label class="dantext-1">预分配</label>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

        <el-dialog
                @onClose="handleOnMainClose"
                width="835px"
                height="540px"
                class="my_main_dialog"
                title="圈存异常人工处理"
                append-to-body
                :visible.sync="manualHandleDlgVisible">

            <manual-handle @onClose="handleOnMainClose" :visible="manualHandleDlgVisible"></manual-handle>
        </el-dialog>
    </div>
</template>
<script>
    import popSwitch from '../../components/popSwitch';
    import fetch from '@/utils/fetch'
    import api from '@/api'
    import WsApi from "@/api/wsApi";
    import WsConsts from "@/utils/wsConsts";
    import {Loading} from 'element-ui';
    import store from '@/store';
    import * as dict from '@utils/dictionaries'
    import {mapGetters} from 'vuex';
    import ManualHandle from './manualHandle'
    import MainDialog from '../../components/mainDialog'

    export default {
        name: 'StoreValueFund',
        components: {ManualHandle, MainDialog},

        data() {
            return {

                clickStatus: false,  //按钮默认可点击状态为false
                moneyInput: "",
                dialogDistriVisible: false,
                manualHandleDlgVisible: false,
                //用户信息
                cardInfo: {},
                //读卡接收到的信息
                readCardInfo: {
                    balance_money: 0
                },
                difMoney: {
                    customer_money: 0,
                    card_money: 0,
                    abnormal_money: 0,
                },
                tableData: [],
                //默认加载提示消息
                defaultLoadingStr: "加载中，请稍候...",
                //用户信息
                // customerInfo: {...store.getters.customerInfo},
                // //顶部车辆信息
                // vehicleInfo: {...store.getters.vehicleInfo},
                balance_money: ""
            }
        },
        mounted() {
            console.log(this.vehicleInfo)
        },
        created() {


        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            //车辆类型字符串
            vehicleType: function () {
                return dict.getVehicleType(this.vehicleInfo.vehicle_type)
            },
            //车牌颜色字符串
            vehicleColorStr: function () {
                return dict.getVehicleColor(this.vehicleInfo.vehicle_color);
            },
        },
        methods: {
            handleOnMainClose() {
                this.manualHandleDlgVisible = false
                this.readCard()
            },
            formatTransType: function (row, col) {
                return dict.getTransType(row.trans_type)
            },
            check() {
                if (!this.clickStatus) {
                    this.$message({
                        type: 'warning',
                        message: "请先读卡",
                    });
                    return false;
                }
                return true;
            },
            //储值资金金额显示
            showMoneyData() {
                let params = {
                    cpu_card_id: this.readCardInfo.cpu_card_id,
                    vehicle_code: this.readCardInfo.vehicle_code,
                    vehicle_color: this.readCardInfo.vehicle_color,
                }
                params.biz_content = JSON.stringify(params.biz_content)
                return new Promise((resolve, reject) => {
                    fetch({
                        url: api['initMoney'].url || '',
                        method: 'post',
                        data: {
                            method: api['initMoney'].method, ...params
                        }
                    }).then((response) => {
                        this.difMoney = response
                        resolve()
                    }).catch((err) => {
                        this.$msgbox({
                            message: '获取储值资金账户信息失败:' + err.message,
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                        reject()
                    })
                })
            },
            //读卡
            readCard() {
                //初始化卡信息
                let params = {
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                };
                WsApi.readCpuInfo(params, this.onMsg, this.onErr);
            },
            //全额预分配点击
            allMoneyInput() {
                this.moneyInput = (this.difMoney.customer_money / 100).toFixed(2)
            },
            //卡内近期流水记录
            showHistoryData() {
                let params = {
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    jour_num: 10
                };
                //卡内近期流水数据
                WsApi.readCardJour(params, this.onMsg, this.onErr);
            },
            //圈存按钮
            trapMoney() {
                if (!this.check()) {
                    return;
                }
                if (!this.readCardInfo.cpu_card_id) {
                    this.$msgbox({
                        message: '暂无卡片信息，请预先读卡！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'error'
                    })
                    return;
                }
                console.log(this.difMoney.card_money)
                if (this.difMoney.card_money == '0') {
                    this.$msgbox({
                        message: '卡内未圈存余额为0，请先预分配！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'warning'
                    })

                    return;
                }
                const h = this.$createElement;
                this.$msgbox({
                    message: h('div', null, [
                        h('p', '请确认是否继续进行【圈存】操作？'),
                        h('p', '用户姓名：' + this.customerInfo.customer_name),
                        h('p', '卡号：' + this.vehicleInfo.cpu_card_id),
                        h('p', '圈存金额：' + (this.difMoney.card_money / 100).toFixed(2) + '元'),
                    ]),
                    title: '提示',
                    showCancelButton: true,
                    customClass: 'my_msgBox',
                    type: 'info'
                }).then(res => {
                    this.startLoading()
                    this.showMoneyData().then(res => {
                        let params = {
                            customer_id: this.customerInfo.customer_id,
                            cpu_card_id: this.readCardInfo.cpu_card_id,
                            vehicle_code: this.readCardInfo.vehicle_code,
                            vehicle_color: this.readCardInfo.vehicle_color,
                            money: this.difMoney.card_money,
                        };
                        //圈存
                        WsApi.cpuLoad(params, this.onMsg, this.onErr);
                    }).catch(err => {
                        this.endLoading()
                    });
                })

            },
            //异常处理
            errHandle() {
                // this.manualHandleDlgVisible = true
                // return;
                if (!this.check()) {
                    return;
                }
                if (!this.readCardInfo.cpu_card_id) {
                    this.$msgbox({
                        message: '暂无卡片信息，请预先读卡！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'warning'
                    })
                    return;
                }
                if (this.difMoney.abnormal_money <= 0) {
                    this.$msgbox({
                        message: '没有圈存异常记录，不需要进行异常圈存处理！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'warning'
                    })
                    return;
                }
                let params = {
                    customer_id: this.customerInfo.customer_id,
                    cpu_card_id: this.readCardInfo.cpu_card_id,
                    vehicle_code: this.readCardInfo.vehicle_code,
                    vehicle_color: this.readCardInfo.vehicle_color,
                };
                this.startLoading()
                //圈存异常处理
                WsApi.cpuLoadAbnormal(params, this.onMsg, this.onErr);
            },
            //websocket消息处理回调
            onMsg: function (msg) {
                this.endLoading()
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readCpuInfo:
                            this.readCardInfo = bizContent;
                            if (this.readCardInfo.cpu_card_id != this.vehicleInfo.cpu_card_id) {
                                this.$msgbox({
                                    message: '与请求卡号不符，请重试！',
                                    title: '提示',
                                    customClass: 'my_msgBox singelBtn',
                                    type: 'warning'
                                })
                                return;
                            }
                            // 将可点击状态置为true
                            this.clickStatus = true;
                            this.showMoneyData();
                            this.showHistoryData();
                            break;
                        //卡内近期流水数据
                        case WsConsts.methods.readCardJour:
                            this.tableData = bizContent.jour_list.slice(0, 3);
                            break;
                        //圈存
                        case WsConsts.methods.cpuLoad:
                            this.balance_money = (bizContent.balance_money / 100).toFixed(2);
                            const h = this.$createElement;
                            this.$msgbox({
                                message: h('div', null, [
                                    h('p', '圈存成功'),
                                    h('p', '圈存金额：' + (this.difMoney.card_money / 100).toFixed(2)),
                                    h('p', '卡内余额：' + this.balance_money)
                                ]),

                                title: '提示',
                                customClass: 'my_msgBox singelBtn',
                                type: 'success'
                            })
                            this.readCard();
                            break;
                        //圈存异常处理
                        case WsConsts.methods.cpuLoadAbnormal:
                            //测试
                            //this.manualHandleDlgVisible = true
                            this.balance_money = (bizContent.balance_money / 100).toFixed(2);
                            let deal_result = bizContent.deal_result;
                            if (deal_result != '0' && deal_result != '1') {
                                this.$msgbox({
                                    message: "圈存异常自动处理失败，点击确定进行圈存异常人工处理！",
                                    title: "失败", type: "error",
                                    customClass: 'my_msgBox singelBtn'
                                }).then(() => {
                                    this.manualHandleDlgVisible = true
                                }).catch((err) => {
                                    this.manualHandleDlgVisible = true
                                })
                            } else {
                                this.$msgbox({
                                    message: "圈存异常自动处理成功！",
                                    title: "成功", type: "success",
                                    customClass: 'my_msgBox singelBtn'
                                })
                                this.showMoneyData();
                            }
                            //this.showMoneyData();
                            break;
                        default:
                            break;
                    }
                } else {
                    this.$msgbox({
                        message: rspData.return_msg,
                        dangerouslyUseHTMLString: true,
                        title: "失败",
                        type: "error",
                        customClass: 'my_msgBox singelBtn'
                    })
                    this.showMoneyData();
                }
                console.log("收到消息：" + msg.data);
            },
            //websocket异常处理回调
            onErr: function (err) {
                this.endLoading()
                this.$msgbox({
                    title: "失败",
                    type: 'error',
                    customClass: 'my_msgBox singelBtn',
                    message: err.message,
                    dangerouslyUseHTMLString: true,
                });
                console.log("请求异常：" + err.message);
            },
            //预分配
            predisAll() {
                if (!this.readCardInfo.cpu_card_id) {
                    this.$msgbox({
                        message: '暂无卡片信息，请预先读卡！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'error'
                    })
                    return;
                }
                console.log(parseInt(this.moneyInput * 100 ),parseInt(this.difMoney.customer_money))
                if ((this.moneyInput * 100 )> (this.difMoney.customer_money)) {
                    this.$msgbox({
                        message: '请检查：预分配金额必须小于等于可分配余额！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'error'
                    })
                    return;
                }
                if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(this.moneyInput)) {
                    this.$msgbox({
                        message: '请输入合法金额，最多保留2位小数！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'error'
                    })
                    return;
                }
                let params = {
                    customer_id: this.customerInfo.customer_id,
                    cpu_card_id: this.readCardInfo.cpu_card_id,
                    vehicle_code: this.readCardInfo.vehicle_code,
                    vehicle_color: this.readCardInfo.vehicle_color,
                    money: this.moneyInput * 100,
                };
                const h = this.$createElement;
                this.$msgbox({
                    message: h('div', null, [
                        h('p', '请确认是否继续进行预分配操作？'),
                        h('p', '用户姓名：' + this.customerInfo.customer_name),
                        h('p', '卡号：' + this.vehicleInfo.cpu_card_id),
                        h('p', '预分配金额：' + this.moneyInput + '元'),
                    ]),
                    title: '提示',
                    showCancelButton: true,
                    customClass: 'my_msgBox',
                    type: 'info'
                }).then(res => {
                    this.startLoading()
                    fetch({
                        url: api['preAll'].url || '',
                        method: 'post',
                        data: {
                            method: api['preAll'].method, ...params
                        }
                    }).then((response) => {
                        this.endLoading()
                        console.log(response, '-------');
                        this.$msgbox({
                            message: '预分配成功，请进行圈存操作！',
                            title: '提示',
                            customClass: 'my_msgBox singelBtn',
                            type: 'success'
                        })
                        this.moneyInput = '';
                        this.showMoneyData();
                        this.dialogDistriVisible = false;
                    }).catch((err) => {
                        this.endLoading()
                        this.$msgbox({
                            message: '预分配失败：' + err.message,
                            title: '提示',
                            customClass: 'my_msgBox singelBtn',
                            dangerouslyUseHTMLString: true,
                            type: 'error'
                        })
                    })
                }).catch(err => {
                })

            },
            //余额转存
            disPre() {
                if (!this.check()) {
                    return;
                }
                if (!this.readCardInfo.cpu_card_id) {
                    this.$msgbox({
                        message: '暂无卡片信息，请预先读卡！',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        type: 'error'
                    })
                    return;
                }
                const h = this.$createElement;
                this.$msgbox({
                    message: h('div', null, [
                        h('p', '请确认是否继续进行余额转存操作？'),
                        h('p', '用户姓名：' + this.customerInfo.customer_name),
                        h('p', '卡号：' + this.vehicleInfo.cpu_card_id),
                        h('p', '转存金额：' + (this.difMoney.card_money / 100).toFixed(2) + '元'),
                    ]),
                    title: '提示',
                    showCancelButton: true,
                    customClass: 'my_msgBox',
                    type: 'warning'
                }).then(res => {
                    let params = {
                        customer_id: this.customerInfo.customer_id,
                        cpu_card_id: this.readCardInfo.cpu_card_id,
                        vehicle_code: this.readCardInfo.vehicle_code,
                        vehicle_color: this.readCardInfo.vehicle_color,
                        money: this.difMoney.card_money,
                    };
                    params.biz_content = JSON.stringify(params.biz_content)
                    this.startLoading()
                    fetch({
                        url: api['disPre'].url || '',
                        method: 'post',
                        data: {
                            method: api['disPre'].method, ...params
                        }
                    }).then((response) => {
                        this.endLoading()
                        this.$msgbox({
                            message: '余额转存成功',
                            title: '提示',
                            customClass: 'my_msgBox singelBtn',
                            type: 'success'
                        })
                        this.showMoneyData();
                    }).catch((err) => {
                        this.endLoading()
                        this.$msgbox({
                            message: '余额转存失败：' + err.message,
                            title: '提示',
                            customClass: 'my_msgBox singelBtn',
                            dangerouslyUseHTMLString: true,
                            type: 'error'
                        })
                    })
                }).catch(err => {

                })
            },
            //储值资金预分配到卡按钮
            preDistri() {
                if (this.check()) {
                    this.dialogDistriVisible = true;
                }
            },
            //预分配弹框取消按钮
            cancel() {
                this.dialogDistriVisible = false;
            },
        }
    }
</script>
<style lang="scss">
    .preBtn {
        .el-col {
            padding: 0px;
        }
    }
    .card_capital_style{
        margin: 5px 0;
    }

    .whBgcolor {
        background: #1ab394 !important;
    }

    .el-tooltip__popper[x-placement^=top] .popper__arrow {
        border-top-color: #1ab394;
    }

    .el-tooltip__popper[x-placement^=top] .popper__arrow:after {
        border-top-color: #1ab394;
    }

    #preDistri {
        .el-dialog {
            width: 417px !important;
            /*height: 255px;*/
            border-radius: 6px !important;

            .el-dialog__header {
                background-color: #3C4150;
                text-align: left;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                height: 35px !important;
                padding: 0px 35px !important;
                right: 0px;

                .el-dialog__title {
                    line-height: 40px !important;
                    font-family: PingFangSC-Regular;
                    color: #01C1B2 !important;
                    letter-spacing: 0;
                    height: 40px;
                }

                .el-dialog__headerbtn {
                    font-size: 20px;
                    line-height: 40px;
                    top: 0px !important;
                    right: 10px !important;
                }
            }

            .el-dialog__body {
                padding: 0px;
            }
        }

        .el-input__inner {
            height: 28px;
            padding: 0px;
        }

        .el-input-group__append {
            width: 26px;
            text-align: center;
            padding: 0px;
        }
    }

    #monetable {
        .el-table {
            th {
                padding: 5px 0px;
                background-color: #EBECF0;

                .cell {
                    text-align: left;
                    line-height: 20px;
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #615e5e;
                    text-align: left;
                    height: 20px;
                }
            }

            td {
                padding: 5px 0px;

                .cell {
                    text-align: left;
                    line-height: 16px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #000000;
                    text-align: left;
                    height: 16px;
                }
            }
        }
    }

</style>
<style lang="scss" scoped>
    @import "../../styles/common";
    .StoreValueFund{
        height: $dialog-height;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }
    .cardTitle_A {
        position: relative;
        margin: 10px 0px 10px 33px;
        padding-left: 12px;
        border-left: #5584FF 2px solid;

        .title {
            text-align: left;
            line-height: 22px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #000000;
            height: 22px;
        }
    }

    .cardTitle {
        position: relative;
        margin-left: 33px;
        padding-left: 12px;
        border-left: #5584FF 2px solid;

        .title {
            text-align: left;
            line-height: 22px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #000000;
            height: 22px;
        }
    }

    .hrLine {
        background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%);
        border: 1px solid #DCDEE3;
        margin: 0px;
    }

    .row-bg8 {

        padding: 6px 0px 6px 70px;
    }

    .row-bg8-1 {
        padding: 0px 0px 6px 70px;
    }

    .row-bg8-2 {
        padding: 0px 0px 0px 70px;
        text-align: right;
    }

    .row-bg8-3 {
        padding: 0px 70px 0px 0px;
        text-align: right;
        height: 50px;
        position: relative;
    }

    .row-bg8-4 {
        padding: 0px 20px 0px 0px;
        text-align: right;
    }

    .row-bg8-5 {
        padding: 0px 56px 0px 0px;
        text-align: right;
    }

    .text-ask {
        color: #999 !important;
        text-align: right;
        line-height: 17px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        width: 60px;
        height: 17px;
        display: inline-block;
    }

    .text-data {
        display: inline-block;
        color: #333 !important;
        text-align: left;
        line-height: 20px;
        padding-left: 10px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        width: 128px;
        height: 20px;
    }

    .text-money {
        text-align: right;
        line-height: 50px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        width: 160px;
        height: 50px;
    }

    .card-money {
        line-height: 50px;
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        width: 160px;
        height: 50px;
        text-align: right;
        font-weight: bold;
    }

    .text-money-1 {
        display: inline-block;
        line-height: 50px;
        height: 50px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        width: 16px;
        /*margin-top:-20px;*/
        padding-left: 10px;
        vertical-align: middle;
        position: absolute;
    }

    .bigMoney {
        text-align: center;
        line-height: 50px;
        font-family: PingFangSC-Semibold;
        font-size: 36px;
        letter-spacing: 0;
        height: 50px;
        display: inline-block;

        .bigMoney-A {
            color: #3E71F7;
        }

        .bigMoney-B {
            color: #FF9300;;
        }

        .bigMoney-C {
            color: #E72B00;
        }

        .bigMoney-D {
            color: #01A79A;
        }
    }

    .showCard {
        /*height: 36px;*/
        /*line-height: 36px;*/
        cursor: pointer;
        text-align: center;
        display: inline-block;
        border-radius: 6px;
        font-size: 16px;

        .showCard-Z {
            margin: 7px 0px;
            border: 1px solid #01C1B2;
            width: 120px;
            border-radius: 6px;
        }

        .showCard_A {
            border: 1px solid #FF3000;
            width: 98px;
            display: inline-block;
            border-radius: 6px;
        }

        .showCard_B {
            border: 1px solid #01C1B2;
            width: 80px;
            margin: 7px 0px;
            display: inline-block;
            margin-left: 5px;
            border-radius: 6px;
        }

    }

    .showCard_E {
        border: 1px dashed #C4C6CF;
        width: 119px;
        margin: 7px 0px;
        font-size: 12px;
        cursor: pointer;
        text-align: center;
        display: inline-block;
        color: #C4C6CF;
        border-radius: 6px;
    }

    .textBtn {
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #01C1B2;
        width: 86px;
        height: 36px;
        display: inline-block;

    }

    .textBtn_A {
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FF3000;
        width: 70px;
        height: 36px;
        display: inline-block;
    }

    .textBtn_B {
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #01C1B2;
        width: 50px;
        height: 36px;
        display: inline-block;
        letter-spacing: 6px;
    }

    .duBtn {
        cursor: pointer;
        width: 100%;
        /*position: absolute;*/
        /*bottom:0px;*/
        height: 45px;
        background-color: #01C1B2;
        border-radius: 0 0 6px 6px;
        border-color: #01C1B2;
        font-size: 20px;
        color: #fff;
        letter-spacing: 30px;
    }

    .wenhao {
        display: inline-block;
        margin-left: 20px;
        cursor: pointer;


    }

    .preText {
        text-align: right;
        line-height: 20px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        width: 84px;
        height: 20px;
    }

    .row-bg-Pre6 {
        padding: 9px 0px 9px 25px;
        text-align: right;
    }

    .row-bg-Pre18 {
        padding: 9px 40px 9px 90px;
        text-align: right;
    }

    .preData {
        line-height: 22px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        text-align: right;
        width: 147px;
        height: 22px;
    }

    .preData_A {
        text-align: right;
        line-height: 28px;
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #3E71F7;
        letter-spacing: 0;
        width: 117px;
        height: 28px;
        display: inline-block;
    }

    .text-money-2 {
        display: inline-block;
        line-height: 17px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        width: 12px;
        height: 17px;
        padding-left: 5px;
        vertical-align: middle;
    }

    .row-bg-Pre18-1 {
        padding: 5px 40px 5px 80px;
        text-align: right;
    }

    .lastText {
        text-align: left;
        line-height: 12px;
        font-family: Helvetica;
        font-size: 14px;
        -webkit-transform: scale(0.8);
        -webkit-transform-origin-x: 0;
        color: #999999;
        height: 14px;
        margin: 12px 0px 0px 35px;
    }

    .preBtn {
        border-radius: 0px 0px 6px 6px;
        margin-top: 15px;
        height: 40px;
    }

    .dantext {
        text-align: center;
        line-height: 24px;
        font-family: PingFangSC-Regular;
        font-size: 17px;
        color: #01C1B2;
        letter-spacing: 8.5px;
        width: 157px;
        height: 24px;
        cursor: pointer;
    }

    .dantext-1 {
        text-align: center;
        line-height: 24px;
        font-family: PingFangSC-Regular;
        font-size: 17px;
        color: #fff;
        letter-spacing: 8.5px;
        width: 157px;
        height: 24px;
        cursor: pointer;
    }

    .grid-content {
        padding: 7px 0px;
        border-top: 1px solid #01C1B2;
        cursor: pointer;
        text-align: center;
    }

    .bg-purple1 {
        border-bottom-right-radius: 6px;
        background-color: #01C1B2;
    }

    .bg-purple {
        border-bottom-left-radius: 6px;
    }

    .smalltext {
        cursor: pointer;
        font-size: 13px;
        -webkit-transform: scale(1);
        /*-webkit-transform-origin-x: 0;*/
        /*display: inline-block;*/
        /*width: 90px;*/
        /*position: relative;*/
        a {
            color: #4494F9 !important;
            text-decoration: underline !important;
        }
    }

</style>
