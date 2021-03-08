<template>
    <div class="card-issue-container">
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
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehicleInfoColorStr}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车辆类型：</label>
                        <span class="rg">{{vehicleType}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">卡片信息</div>
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
                        <label>发行方：</label>
                        <span class="rg">{{cardInfo.issue_id}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>启用时间：</label>
                        <span class="rg">{{cardInfo.start_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>到期时间：</label>
                        <span class="rg">{{cardInfo.end_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户类型：</label>
                        <span class="rg">{{vehicleUserTypeStr}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{cardInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehocleCardInfoColorStr}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车&nbsp;&nbsp;型：</label>
                        <span class="rg">{{vehicleClass}}</span>
                    </el-col>
                </el-row>
            </div>
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
        <dlg-footer :btninfos="ftBtnArrays.cardIssue" @ftClick="ftClick"></dlg-footer>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
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
            idx: {//当前步骤条
                type: Number,
                default: ''
            }
        },
        data() {
            return {
                isShowSpeDetail: false,
                ftBtnArrays: ftBtns,
                //默认加载提示消息
                //defaultLoadingStr: "加载中，请稍候...",
                //用户信息
                //customerInfo: {...store.getters.customerInfo},
                //顶部车辆信息
                //vehicleInfo: {...store.getters.vehicleInfo},
                //卡片信息
                cardInfo: {},
                /**公务卡信息*/
                officialInfo: {},
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
            toggleVissible: function () {
                this.isShowSpeDetail = !this.isShowSpeDetail
            },
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
                        //读卡校验
                        if (this.issueData.cpu_card_id === undefined || this.issueData.cpu_card_id === null) {
                            this.$msgbox({showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString:true, type: 'warning', message: '请先读卡'});
                            return;
                        }
                        //卡片发行客户参数校验
                        if (this.issueData.customer_id === undefined || this.issueData.customer_id === null) {
                            this.$msgbox({showClose: true,  customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString:true,type: 'warning', message: '请先新增或选择用户'});
                            return;
                        }
                        //卡片发行车辆校验
                        if (this.issueData.vehicle_code === undefined || this.issueData.vehicle_code === null
                            || this.issueData.vehicle_color === undefined || this.issueData.vehicle_color === null) {
                            this.$msgbox({showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString:true,type: 'warning', message: '请先新增或选择车辆'})
                            return;
                        }
                        this.startLoading();
                       this.ws = WsApi.cardIssue(this.issueData, this.onMsg, this.onErr, false);
                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        // if (cmd == cmds.next) {
                        //     if (this.vehicleInfo.only_cpu_card == '1') {
                        //         this.$emit('ftClick',cmds.next)
                        //         this.$emit('ftClick',cmds.next)
                        //         this.$message({showClose: true, type: 'warning', message: '黄卡不能发行OBU'})
                        //         return;
                        //     }
                        // }
                        //如果可以，才调用上层事件处理
                        this.$emit("ftClick", cmd);
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
            //websocket消息处理回调
            onMsg: function (msg) {
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readCpuInfo:
                            this.cardInfo = bizContent;
                            this.endLoading();
                            break;
                        //读到公务卡信息的处理
                        case WsConsts.methods.readOfficialCard:
                            this.officialInfo = bizContent;
                            this.endLoading();
                            break;
                        case WsConsts.methods.cpuIssue:
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
                                //重新加载当前车辆信息，存入store
                                fetch({
                                    url: api['getCarinfo'].url || '',
                                    method: 'post',
                                    data: {
                                        method: api['getCarinfo'].method,
                                        vehicle_code: this.vehicleInfo.vehicle_code,
                                        vehicle_color: this.vehicleInfo.vehicle_color
                                    }
                                }).then(res => {
                                    console.log(res)
                                    store.commit('SET_VEHICLEINFO', res[0])
                                    //this.setVehicleInfo(res[0])
                                }).catch(error => {
                                    this.$alert(error.message, '提示', {
                                        dangerouslyUseHTMLString: true,
                                        showClose:false,
                                        confirmButtonText: '确定',
                                        callback: action => {}
                                    });

                                })
                                //弹框提示发行成功，提示读卡
                                this.$msgbox({
                                    message: '发行成功',
                                    title: '提示',
                                    customClass: 'my_msgBox singelBtn',
                                    confirmButtonText: '读卡',
                                    type: 'success'
                                }).then(() => {
                                    //读卡内系统信息和车辆信息
                                    this.ftClick(cmds.readCard)
                                }).catch(() => {
                                    //读卡内系统信息和车辆信息
                                    this.ftClick(cmds.readCard)
                                });
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
                });
                if (this.ws) {
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
            // ...mapActions([
            //     'setVehicleInfo',
            // ]),
            vehicleClass: function () {

                if (this.cardInfo)
                    return dict.getNewVehicleType(this.cardInfo.vehicle_class)
                else return ''
            },
            vehicleType: function () {
                return this.vehicleInfo.vehicle_class === '7' ? '集卡车' : (dict.getVehicleClassType(this.vehicleInfo.vehicle_class) + '[' + dict.getVehicleType(this.vehicleInfo.vehicle_type) + ']');
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
            //卡片发行所需请求数据
            issueData: function () {
                return {
                    customer_id: this.customerInfo.customer_id || '',
                    //TODO 车辆信息获取
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    cpu_card_id: this.cardInfo.cpu_card_id,
                    civil_servant_id: this.officialInfo.official_card_id,
                    civil_servant_start_date: this.officialInfo.start_date,
                    civil_servant_end_date: this.officialInfo.end_date,
                    civil_servant_vehicle_code:this.officialInfo.vehicle_code,
                    civil_servant_vehicle_color:this.officialInfo.vehicle_color
                }
            }
        }
    }
    ;
</script>

<style lang="scss">
    @import "../../styles/common";

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