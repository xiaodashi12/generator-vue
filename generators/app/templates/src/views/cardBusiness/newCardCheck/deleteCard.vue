<template>
    <div class="card-issue-container">
        <div class="card-issue-content">
            <div class="title">原卡用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehicleInfo.vehicle_color | getVehicleColorFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡号：</label>
                        <span class="rg">{{vehicleInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{vehicleInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片颜色：</label>
                        <span class="rg">{{vehicleInfo.only_cpu_card | getCardColorFilter}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">原卡卡内信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡片编号：</label>
                        <span class="rg">{{cardInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{cardInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片颜色：</label>
                        <span class="rg">{{cardInfo.agency_type | getCardColorFilter}}</span>
                    </el-col>

                </el-row>

                <el-row :span="24">
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{cardInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{cardInfo.vehicle_color | getVehicleColorFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片余额：</label>
                        <span class="rg">{{cardInfo.balance_money ? ((cardInfo.balance_money / 100).toFixed(2) + '元') : ''}}</span>
                    </el-col>

                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车型：</label>
                        <span class="rg">{{cardInfo.vehicle_class | getNewVehicleTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户类型：</label>
                        <span class="rg">{{cardInfo.vehicle_user_type | getVehicleUserTypeFilter}}</span>
                    </el-col>
                </el-row>


            </div>
        </div>
        <dlg-footer :btninfos="ftBtnArrays.deleteCard" @ftClick="ftClick"></dlg-footer>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {
        getCardColor,
        getCardType,
        getCustomerType,
        getObuIssue,
        getVehicleColor,
        getVehicleType,
        getNewVehicleType,
        getVehicleClassType,
        getVehicleUserType
    } from '@/utils/dictionaries'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import WsApi from "@/api/wsApi";
    import WsConsts from "@/utils/wsConsts";
    import api from '@/api'
    import fetch from '@/utils/fetch'
    import {mapActions, mapGetters} from 'vuex'

    // let ws;
    export default {
        name: "CardIssue",
        components: {
            DlgFooter
        },
        props: {

        },
        data() {
            return {
                ftBtnArrays: ftBtns,
                cardInfo: {}
            };
        },
        mounted(){

        },
        methods: {
            ...mapActions([
                'setVehicleInfo',
            ]),
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                let _this = this;
                switch (cmd) {
                    case cmds.BusinessOrderPrinting:
                        _this.$emit('changeIndex', 1, cmds.BusinessOrderPrinting)
                        break;
                    case cmds.noCard:
                        this.startLoading();
                        this.noCard()
                        break;
                    case cmds.readCard:
                        this.startLoading();
                        this.readCard()
                        break;
                    case cmds.hasCard:
                        this.startLoading();
                        this.hasCard()
                        break;
                    default:
                        break;
                }
            },
            //读卡
            readCard() {
                this.startLoading();
                //如果当前车辆存在CPU卡号，则传入
                let param = {}
                if (this.vehicleInfo.cpu_card_id !== undefined)
                    param['cpu_card_id'] = this.vehicleInfo.cpu_card_id
                //初始化卡信息
                this.cardInfo = {};
                WsApi.readCpuInfo(param, this.onMsg, this.onErr);
            },
            //无卡销卡
            noCard() {
                let baseParmas = {
                    customer_id: this.customerInfo.customer_id,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    orig_cpu_card_id: this.vehicleInfo.cpu_card_id,
                    new_cpu_card_id: this.changeCardInfo.newCardInfo.cpu_card_id,
                    operation: '2',
                    issue_code: this.changeCardInfo.issue_code,
                };
                this.deleteCard(baseParmas);

            },
            deleteCard (parmas) {
                this.startLoading();
                // 无卡销卡调用服务器端的销卡核验
                fetch({
                    url: api['changeCancelValid'].url ,
                    method: 'post',
                    data: {
                        method:api['changeCancelValid'].method,
                        ...parmas
                    }
                }).then((res)=>{
                    let _this = this;
                    // 注销完成，需要把vehicleInfo里的cpu_card_id字段置空
                    this.setVehicleInfo({...this.vehicleInfo, cpu_card_id: ''})
                    this.$msgbox({
                        title: '销卡成功',
                        message: '销卡成功',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                _this.$emit('changeIndex', 3, cmds.newCardissue)
                                done();
                            }
                        }
                    })
                    this.endLoading();
                }).catch((err)=>{
                    this.popBox(err.message)
                    this.endLoading();
                })
            },
            hasCard() {
                if (!this.cardInfo.cpu_card_id) {
                    let _this = this;
                    this.$msgbox({
                        title: '温馨提示',
                        message: '请先读卡~',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                _this.endLoading()
                                done();
                            }
                        }
                    })
                    return;

                }
                let baseParmas = {
                    customer_id: this.customerInfo.customer_id,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    orig_cpu_card_id: this.vehicleInfo.cpu_card_id,
                    new_cpu_card_id: this.changeCardInfo.newCardInfo.cpu_card_id,
                    issue_code: this.changeCardInfo.issue_code,
                }
               this.csDeleteCard(baseParmas)

            },
            csDeleteCard(parmas) {
                // 有卡销卡调用cs端的销卡流程
                this.startLoading();
                WsApi.cardReplaceCancel(parmas, this.onMsg, this.onErr);
            },
            //websocket消息处理回调
            onMsg: function (msg) {
                let _this = this;
                let rspData = JSON.parse(msg.data);
                _this.endLoading();
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读取新卡
                        case WsConsts.methods.readCpuInfo:
                            _this.cardInfo = bizContent;
                            _this.endLoading();
                            break;
                        case WsConsts.methods.cardReplaceCancel:
                        //补领换卡销卡
                            _this.$msgbox({
                                title: '销卡成功',
                                message: '销卡成功',
                                customClass: 'my_msgBox singelBtn',
                                // showCancelButton: true,
                                confirmButtonText: '确定',
                                beforeClose: (action, instance, done) => {
                                    if (action === 'confirm') {
                                        _this.$emit('changeIndex', 3, cmds.newCardissue)
                                        done();
                                    }
                                }
                            })
                            break;
                        default:
                            break;
                    }
                } else {
                    this.endLoading();
                    if (rspData.method === WsConsts.methods.cardReplaceCancel) {
                        _this.popBox(rspData.return_msg, 'hasCard')
                    } else {
                        this.$alert(rspData.return_msg, '提示', {
                            dangerouslyUseHTMLString: true,
                            showClose:false,
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    }
                }
                console.log("收到消息：" + msg.data);
            },
            //websocket异常处理回调
            onErr: function (err) {
                //隐藏进度条
                this.endLoading();
                this.$msgbox({
                    showClose: true,
                    type: 'error',
                    customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString:true,
                    message: "请求异常：" + err.message,
                });if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                }
                console.log("请求异常：" + err.message);
            },
            popBox(msg, type) {
                let  _this = this;
                if (type) {
                    this.$msgbox({
                        title: '销卡失败',
                        message: msg,
                        customClass: 'my_msgBox singelBtn',
                        showCancelButton: false,
                        confirmButtonText: '无卡销卡',
                        callback: (action, instance) => {
                            if (action === 'confirm') {
                                _this.noCard()
                            }
                        }
                    })
                } else {
                    this.$msgbox({
                        title: '销卡失败',
                        message: msg,
                        customClass: 'my_msgBox singelBtn',
                        showCancelButton: false,
                        confirmButtonText: '有卡销卡',
                        callback: (action, instance) => {
                            if (action === 'confirm') {
                                _this.hasCard()
                            }
                        }
                    })
                }

            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo',
                'changeCardInfo'
            ]),
        },
        filters: {
            getCustomerTypeFilter(val) {
                return getCustomerType(val);;
            },
            getVehicleTypeFilter(val) {
                return '[' + getVehicleType(val) + ']';
            },
            getNewVehicleTypeFilter(val) {
                return getNewVehicleType(val);
            },
            getVehicleClassTypeFilter(val) {
                return getVehicleClassType(val);
            },
            getVehicleUserTypeFilter(val) {
                return getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },
            getCardColorFilter(val) {
                return getCardColor(val);
            },
            getObuIssueFilter(val) {
                return getObuIssue(val);
            },
            getVehicleColorFilter(val) {
                return getVehicleColor(val);
            },
        }
    }
    ;
</script>

<style lang="scss" scoped>
    @import "../../../styles/common";


</style>