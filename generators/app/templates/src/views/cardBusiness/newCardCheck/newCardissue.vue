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
                        <span class="rg">{{vehicleInfoColorStr}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">新卡卡内信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>卡片编号：</label>
                        <span class="rg">{{cardInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{cardTypeStr}}</span>
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
                        <label>卡内余额：</label>
                        <span class="rg">{{cardInfo.balance_money ? (cardInfo.balance_money+ '元') : ''}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车型：</label>
                        <span class="rg">{{vehicleClass}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户类型：</label>
                        <span class="rg">{{vehicleUserTypeStr}}</span>
                    </el-col>

                </el-row>
            </div>
            <div class="title">
                公务卡信息
            </div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>公务卡号：</label>
                        <span class="rg">{{changeCardInfo.officialInfo.official_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{changeCardInfo.officialInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{changeCardInfo.officialInfo.vehicle_color_name}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>开始时间：</label>
                        <span class="rg">{{changeCardInfo.officialInfo.start_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>到期时间：</label>
                        <span class="rg">{{changeCardInfo.officialInfo.end_date}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <dlg-footer :btninfos="ftBtnArrays.newCardissue" @ftClick="ftClick"></dlg-footer>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import {getCustomerType, getVehicleType, getVehicleUserType, getCardType, getCardColor, getObuIssue, getVehicleColor} from '@/utils/dictionaries'
    import WsApi from "@/api/wsApi";
    import WsConsts from "@/utils/wsConsts";
    import {Loading} from 'element-ui';
    import store from '@/store';
    import * as dict from '@utils/dictionaries'
    import api from '@/api'
    import fetch from '@/utils/fetch'
    import {mapGetters, mapActions} from 'vuex'

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
                //默认加载提示消息
                //defaultLoadingStr: "加载中，请稍候...",
                //用户信息
                //customerInfo: {...store.getters.customerInfo},
                //顶部车辆信息
                //vehicleInfo: {...store.getters.vehicleInfo},
                //卡片信息
                cardInfo: {},
                //发卡进度返回数据
                cardIssue: {
                    issue_state: 0,
                    progress_num: 0,
                    progress_msg: '加载中，请稍候...'
                },
                ws:null
            };
        },
        methods: {

            //底部按钮点击事件处理
            ftClick: function (cmd) {
                switch (cmd) {
                    //读卡
                    case cmds.readCard:
                        this.startLoading();
                        //如果当前车辆存在CPU卡号，则传入
                        let param = {}
                        if (this.vehicleInfo.cpu_card_id !== undefined)
                            param['cpu_card_id'] = this.vehicleInfo.cpu_card_id
                        //初始化卡信息
                        this.cardInfo = {};
                        WsApi.readCpuInfo(param, this.onMsg, this.onErr);
                        break;
                    //发行
                    case cmds.cardIssue:
                        if (!this.cardInfo.cpu_card_id) {
                            this.$msgbox({showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString:true, type: 'warning', message: '请先读卡'});
                            return;
                        }
                        let params = {
                            customer_id: this.customerInfo.customer_id,
                            vehicle_code: this.vehicleInfo.vehicle_code,
                            vehicle_color: this.vehicleInfo.vehicle_color,
                            new_cpu_card_id: this.cardInfo.cpu_card_id,
                            card_type: this.vehicleInfo.card_type,
                            issue_code: this.changeCardInfo.issue_code,
                        }
                        this.ws = WsApi.cardReplaceIssue(params, this.onMsg, this.onErr, false);
                        break;
                    //其他（上一步、下一步）
                    default:
                        break;
                }
            },
            //websocket消息处理回调
            onMsg: function (msg) {
                let _this = this;
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readCpuInfo:
                            this.cardInfo = bizContent;
                            console.log(bizContent);
                            this.endLoading();
                            break;
                        case WsConsts.methods.cardReplaceIssue:
                            //获取业务数据
                            this.cardIssue = {...bizContent};
                            this.setLoadingText(this.getProgressStr())
                            //如果状态是已完成，则隐藏进度条
                            if (this.cardIssue.issue_state == '1') {
                                this.endLoading();
                                if (this.ws) {
                                    this.ws.close();
                                    this.ws = null;
                                }
                                //弹框提示发行成功，提示读卡
                                this.$msgbox({
                                    message: '发行成功',
                                    title: '提示',
                                    customClass: 'my_msgBox singelBtn',
                                    confirmButtonText: '读卡',
                                    type: 'success',
                                    beforeClose: (action, instance, done) => {
                                        if (action === 'confirm') {
                                            //重新加载当前车辆信息，存入store
                                            _this.ftClick(cmds.readCard)
                                            fetch({
                                                url: api['getCarinfo'].url || '',
                                                method: 'post',
                                                data: {
                                                    method: api['getCarinfo'].method,
                                                    vehicle_code: _this.vehicleInfo.vehicle_code,
                                                    vehicle_color: _this.vehicleInfo.vehicle_color
                                                }
                                            }).then(res => {
                                                store.commit('SET_VEHICLEINFO', res[0])
                                                //this.setVehicleInfo(res[0])
                                            }).catch(error => {
                                                _this.$message({
                                                    showClose: true,
                                                    type: 'error',
                                                    message: "车辆信息获取失败",
                                                });
                                            })
                                            done();
                                        } else {
                                            done();
                                        }

                                    }
                                })


                            }
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
            //进度条文本计算函数
            getProgressStr: function () {
                console.log(this.cardIssue.progress_msg)
                if (this.cardIssue.progress_msg === '' || this.cardIssue.progress_msg === undefined || this.cardIssue.progress_msg === null) {
                    return '加载中，请稍候...'
                }
                return '当前状态：' + this.cardIssue.progress_msg + '；发行进度： ' + this.cardIssue.progress_num + '%'
            },
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo',
                'changeCardInfo',
            ]),
            vehicleClass: function () {
                if (this.cardInfo)
                    return dict.getNewVehicleType(this.cardInfo.vehicle_class)
                else return ''
            },
            vehicleType: function () {
                return dict.getVehicleType(this.vehicleInfo.vehicle_type);
            },
            //卡片类型字符串
            cardTypeStr: function () {
                return dict.getCardType(this.cardInfo.card_type)
            },
            //车辆用户类型字符串
            vehicleUserTypeStr: function () {
                return dict.getVehicleUserType(this.cardInfo.vehicle_user_type);
            },
            vehocleCardInfoColorStr: function () {
                return dict.getVehicleColor(this.cardInfo.vehicle_color);
            },
            //车牌颜色字符串
            vehicleInfoColorStr: function () {
                return dict.getVehicleColor(this.vehicleInfo.vehicle_color);
            },
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
</script>

<style lang="scss">
    @import "../../../styles/common";

    .card-issue-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .card-issue-content {
            height: $dialog-height;
            overflow-y: auto;
        }
    }
</style>