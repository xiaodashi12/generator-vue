<template>
    <div class="card-issue-container">
        <div class="card-issue-content">
            <div class="title">原卡信息</div>
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
            <div class="title">新卡信息</div>
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
                </el-row>
            </div>
            <div v-has="{'rights':[12]}">
                <div class="title" @click="toggleVissible">
                    公务卡信息<label style="color: #5584ff">▼</label>
                    <span>*需要绑定公务卡时请点击读公务卡</span>
                </div>
                <div class="info" v-show="isShowSpeDetail">
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>公务卡号：</label>
                            <span class="rg">{{officialInfo.official_card_id}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车牌号码：</label>
                            <span class="rg">{{officialInfo.vehicle_code}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>车牌颜色：</label>
                            <span class="rg">{{officialInfo.vehicle_color_name}}</span>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="8">
                            <label>启用时间：</label>
                            <span class="rg">{{officialInfo.start_date}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>到期时间：</label>
                            <span class="rg">{{officialInfo.end_date}}</span>
                        </el-col>
                        <el-col :span="8">
                            <el-button class="official"  v-has="{'rights':[12]}" @click="readOfficial">读公务卡</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div class="title">办理原因</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="24">
                        <el-input placeholder="填写办理原因" type="textarea" :cols="20"
                                  v-model="reason"></el-input>
                    </el-col>
                </el-row>
            </div>

        </div>
        <dlg-footer :btninfos="ftBtnArrays.newCardCheck" @ftClick="ftClick"></dlg-footer>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {getCustomerType, getVehicleType, getVehicleUserType, getCardType, getCardColor, getObuIssue, getVehicleColor} from '@/utils/dictionaries'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import WsApi from "@/api/wsApi";
    import WsConsts from "@/utils/wsConsts";
    import api from '@/api'
    import fetch from '@/utils/fetch'
    import {mapGetters, mapActions} from 'vuex'

    // let ws;
    export default {
        name: "cardComponent",
        components: {
            DlgFooter
        },
        props: {
            // idx: {//当前步骤条
            //     type: Number,
            //     default: ''
            // }
        },
        data() {
            return {
                isShowSpeDetail: true,
                ftBtnArrays: ftBtns,
                reason: '',
                //卡片信息
                cardInfo: {},
                /**公务卡信息*/
                officialInfo: {},
            };
        },
        mounted(){
            this.setChangeCardInfo({
                officialInfo: {},
                newCardInfo: {}
            })
        },
        methods: {
            ...mapActions([
                'setChangeCardInfo',
            ]),
            toggleVissible: function () {
                this.isShowSpeDetail = !this.isShowSpeDetail
            },
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                let _this = this;
                switch (cmd) {
                    //读卡
                    case cmds.readCard:
                        this.startLoading();
                        this.readCard();
                        break;
                    case cmds.newCardCheck:
                        if (!this.cardInfo.cpu_card_id) {
                            _this.$msgbox({
                                title: '提示',
                                message: '请先读取新卡',
                                customClass: 'my_msgBox singelBtn',
                                // showCancelButton: true,
                                confirmButtonText: '确定',
                                beforeClose: (action, instance, done) => {
                                    done();
                                }
                            })
                        } else {
                            this.startLoading();
                            let param = {
                                customer_id: _this.customerInfo.customer_id,
                                vehicle_code: _this.vehicleInfo.vehicle_code,
                                vehicle_color: _this.vehicleInfo.vehicle_color,
                                orig_cpu_card_id: _this.vehicleInfo.cpu_card_id,
                                new_cpu_card_id: _this.cardInfo.cpu_card_id,
                                civil_servant_vehicle_code: _this.officialInfo.vehicle_code,
                                civil_servant_vehicle_color: _this.officialInfo.vehicle_color,
                                civil_servant_id: _this.officialInfo.official_card_id,
                                civil_servant_start_date: _this.officialInfo.start_date,
                                civil_servant_end_date: _this.officialInfo.end_date,
                                reason: _this.reason,
                            }
                            WsApi.cardReplaceCheck(param, _this.onMsg, _this.onErr);
                        }

                        break;
                    default:
                        break;
                }
            },
            //读公务卡
            readOfficial: function () {
                this.startLoading();
                this.officialInfo = {};
                //发起读公务卡请求
                WsApi.readOfficialCard({}, this.onMsg, this.onErr);
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
            //websocket消息处理回调
            onMsg: function (msg) {
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读取新卡
                        case WsConsts.methods.readCpuInfo:
                            this.cardInfo = bizContent;
                            this.setChangeCardInfo({
                                officialInfo: this.changeCardInfo.officialInfo,
                                newCardInfo: {...bizContent},
                                reason: this.reason
                            })
                            this.endLoading();
                            break;
                        //读到公务卡信息的处理
                        case WsConsts.methods.readOfficialCard:
                            this.officialInfo = bizContent;
                            this.setChangeCardInfo({
                                officialInfo: {...bizContent},
                                newCardInfo: this.changeCardInfo.newCardInfo,
                                reason: this.reason
                            })
                            this.endLoading();
                            break;
                        case WsConsts.methods.newCardCheck:
                        // 新卡校验
                            console.log(this.reason, 'this.reason');
                            this.setChangeCardInfo({
                                officialInfo: this.changeCardInfo.officialInfo,
                                newCardInfo: this.changeCardInfo.newCardInfo,
                                reason: this.reason
                            })

                            console.log(bizContent, 'bizContent');
                            break;
                        default:
                            break;
                    }
                } else {
                    this.endLoading();
                    if(this.ws){
                        this.ws.close()
                        this.ws=null
                    }
                    this.$msgbox({
                        showClose: true,
                        type: 'error',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString:true,
                        message: rspData.return_msg,
                    });
                }
                console.log("收到消息：" + msg.data);
            },
            //websocket异常处理回调
            onErr: function (err) {
                //隐藏进度条
                this.endLoading();
                this.$msgbox({
                    showClose: true,
                    type: 'error', customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString:true,
                    message: "请求异常：" + err.message,
                });if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                }
                console.log("请求异常：" + err.message);
            },
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
                return getVehicleType(val);;
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