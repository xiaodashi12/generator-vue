<template>
    <div class="card-issue-container">
        <div class="card-issue-content">
            <div class="title">用户信息</div>
            <div class="cust-info">
                <el-row :span="24">
                    <el-col :span="24">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{customerInfo.customer_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehicleTopColorStr}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">系统信息</div>
            <div class="sys-info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>发行方：</label>
                        <span class="rg">{{sysVehicleInfo.issue_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>协约类型：</label>
                        <span class="rg">{{sysVehicleInfo.protocol_ver}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>合同版本：</label>
                        <span class="rg">{{sysVehicleInfo.obu_ver}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>合同序列号：</label>
                        <span class="rg">{{sysVehicleInfo.obu_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>签署时间：</label>
                        <span class="rg">{{sysVehicleInfo.start_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>过期日期：</label>
                        <span class="rg">{{sysVehicleInfo.end_date}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">车辆信息</div>
            <div class="sys-info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{sysVehicleInfo.vehicle_code}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌颜色：</label>
                        <span class="rg">{{vehicleBottomColorStr}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</label>
                        <span class="rg">{{vehicleClass}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>车辆用户类型：</label>
                        <span class="rg">{{vehicleUserType}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>座&nbsp;位&nbsp;数&nbsp;：</label>
                        <span class="rg">{{sysVehicleInfo.seat}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车辆特征：</label>
                        <span class="rg">{{sysVehicleInfo.vehicle_features}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <label>发动机号：</label>
                        <span class="rg">{{sysVehicleInfo.engine_no}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <dlg-footer :btninfos="btninfos.length > 0 ? btninfos : ftBtnArrays.obuIssue" @ftClick="ftClick"></dlg-footer>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import WsApi from "@/api/wsApi";
    import api from '@/api'
    import WsConsts from "@/utils/wsConsts"
    import store from "@/store"
    import {Loading} from 'element-ui';
    import * as dict from '@utils/dictionaries'
    import {ignoreNull} from '@utils/arrayUtils'
    import {mapGetters, mapActions} from 'vuex'
    import fetch from "@/utils/fetch"

    let ws;
    export default {
        name: "ObuIssue",
        components: {
            DlgFooter
        },
        mixins: {},
        props: {
            idx: {//当前步骤条
                type: Number,
                default: -1
            },
            btninfos: {//按钮
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data() {
            return {
                rsuOpend: false,
                isObuIssue: false,
                ftBtnArrays: ftBtns,
                // defaultLoadingStr: "加载中，请稍候...",
                //用户信息
                // customerInfo: {...store.getters.customerInfo},
                // //顶部车辆信息
                // vehicleInfo: {...store.getters.vehicleInfo},
                //系统信息和下部车辆信息
                sysVehicleInfo: {},
                //obu发行返回值
                obuIssue: {
                    issue_state: 0,
                    progress_num: 0,
                    progress_msg: '加载中，请稍候...'
                },

                type: '2'
            };
        },
        methods: {
            ...mapActions([
                'setVehicleInfo',
            ]),
            // ...mapGetters([
            //     'vehicleInfo'
            // ]),
            // checkPermision:function(){
            //     let rights=this.customerInfo.rights
            //
            // },
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                switch (cmd) {
                    //读obu
                    case cmds.readObu:
                        if (!this.rsuOpend) {
                            this.$msgbox("打开读写器失败，请重试！", "警告", "warning")
                            return;
                        }
                        this.sysVehicleInfo = {};
                        let param = {}
                        if (this.vehicleInfo.obu_id || this.isObuIssue) {
                            param['obu_id'] = this.vehicleInfo.obu_id
                            this.type = '1'
                        }

                        param['read_type'] = this.type

                        this.startLoading();
                        WsApi.readObuInfo(param, this.onMsg, this.onErr);
                        break;
                    //发行
                    case cmds.obuIssue:
                        if (!this.rsuOpend) {
                            this.$msgbox("打开读写器失败，请重试！", "警告", "warning")
                            return;
                        }
                        //读OBU校验
                        if (this.issueData.obu_id === undefined || this.issueData.obu_id === null) {
                            this.$msgbox({
                                showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true, type: 'warning', message: '请先读标签'
                            });
                            return;
                        }
                        //卡片发行参数校验
                        if (this.issueData.customer_id === undefined || this.issueData.customer_id === null) {
                            this.$msgbox({
                                showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true, type: 'warning', message: '请先新增或选择用户'
                            });
                            return;
                        }
                        if (this.issueData.vehicle_code === undefined || this.issueData.vehicle_code === null
                            || this.issueData.vehicle_color === undefined || this.issueData.vehicle_color === null) {
                            this.$msgbox({
                                showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true, type: 'warning', message: '请先新增或选择车辆'
                            });
                            return;
                        }
                        if (this.vehicleInfo.only_cpu_card == '1') {
                            this.$msgbox({
                                showClose: true, customClass: 'my_msgBox singelBtn',
                                dangerouslyUseHTMLString: true, type: 'warning', message: '货车支付卡不需要发OBU'
                            });
                            return;
                        }
                        this.startLoading();
                        ws = WsApi.obuIssue(this.issueData, this.onMsg, this.onErr, false);
                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        //如果可以，才调用上层事件处理
                        this.$emit("ftClick", cmd);
                        break;
                }
            },
            onMsg: function (msg) {
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    switch (rspData.method) {
                        //读到卡信息的处理
                        case WsConsts.methods.readObuInfo:
                            //合并返回值供显示用
                            this.sysVehicleInfo = {
                                ...this.sysVehicleInfo,
                                ...ignoreNull(bizContent)
                            };
                            this.endLoading();
                            break;
                        case WsConsts.methods.obuIssue:
                            //获取业务数据
                            this.obuIssue = {...bizContent};
                            this.setLoadingText(this.getProgressStr())
                            console.log(this.obuIssue, bizContent)
                            //如果状态是已完成，则隐藏进度条
                            if (this.obuIssue.issue_state === '1') {
                                this.isObuIssue = true
                                this.endLoading();
                                if (ws !== undefined && ws !== null) {
                                    ws.close();
                                    ws = null;
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
                                    store.commit('SET_VEHICLEINFO', res[0])
                                    console.log(res)
                                    //this.setVehicleInfo(res[0])
                                }).catch(error => {
                                    this.$message({
                                        showClose: true,
                                        type: 'success',
                                        message: "车辆信息获取失败",
                                    });
                                })
                                //弹框提示发行成功，提示读卡
                                this.$msgbox({
                                    message: '发行成功',
                                    title: '提示',
                                    customClass: 'my_msgBox singelBtn',
                                    confirmButtonText: '读标签',
                                    type: 'success'
                                }).then(() => {
                                    this.type = '1'
                                    //读标签内系统信息和车辆信息
                                    this.ftClick(cmds.readObu)
                                }).catch(() => {
                                    this.type = '2'
                                    //读标签内系统信息和车辆信息
                                    this.ftClick(cmds.readObu)
                                });
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    this.endLoading();
                    if (this.ws) {
                        this.ws.close();
                        this.ws = null;
                    }
                    this.$msgbox({
                        showClose: true,
                        type: 'error',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        message: rspData.return_msg,
                    });
                }
                console.log("收到消息：" + msg.data);
            },
            onErr: function (err) {
                //隐藏进度条
                this.endLoading();
                this.$msgbox({
                    showClose: true,
                    type: 'error',
                    customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString: true,
                    message: err.message,
                });
                if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                }
                console.log("请求异常：" + err.message);
            },
            //进度条文本计算函数
            getProgressStr: function () {
                if (this.obuIssue.progress_msg === '' || this.obuIssue.progress_msg === undefined || this.obuIssue.progress_msg === null) {
                    return '加载中，请稍候...'
                }
                return this.obuIssue.progress_msg + '；发行进度： ' + this.obuIssue.progress_num + '%'
            },
        },
        computed: {
            vehicleClass: function () {
                return dict.getVehicleCatgoryType(this.sysVehicleInfo.vehicle_class) + '[' + dict.getVehicleType(this.sysVehicleInfo.vehicle_category) + ']'
            },
            vehicleUserType: function () {
                return dict.getVehicleUserType(this.sysVehicleInfo.vehicle_user_type)
            },
            vehicleTopColorStr: function () {
                return dict.getVehicleColor(this.vehicleInfo.vehicle_color);
            },
            vehicleBottomColorStr: function () {
                return dict.getVehicleColor(this.sysVehicleInfo.vehicle_color);
            },

            //卡片发行所需请求数据
            issueData: function () {
                return {
                    customer_id: this.customerInfo.customer_id || '',
                    //TODO 车辆信息获取
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    obu_id: this.sysVehicleInfo.obu_id || this.vehicleInfo.obu_id,
                }
            }
        },
        created() {
            if (this.vehicleInfo.only_cpu_card == '1') {
                this.$msgbox({
                    customClass: 'my_msgBox',
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                    title: '提示',
                    message: '货车支付卡不需要发OBU',
                    cancelButtonText: '卡片发行',
                    showCancelButton: true,
                    showClose: false,
                    confirmButtonText: '受理单',
                }).then(res => {
                    this.$emit('ftClick', cmds.next)
                }).catch(err => {
                    this.$emit("ftClick", cmds.goBack);
                });
                return;
            }
            let _this = this
            let onMsg = function (msg) {
                let data = JSON.parse(msg.data)
                if (data.return_code == '0') {
                    _this.rsuOpend = true
                } else {
                    _this.rsuOpend = false
                    _this.$msgbox({
                        message: data.return_msg,
                        title: "失败",
                        type: "error",
                        confirmButtonText: "重试"
                    }).then(() => {
                        WsApi.opeRsu({type: 1}, onMsg, onErr)
                    }).catch((err) => {
                    })
                }
            };
            let onErr = function (err) {
                _this.rsuOpend = false
                _this.$msgbox("打开设备失败，请重试！", "失败", "error").then(() => {
                }).catch((err) => {
                })
            }
            WsApi.opeRsu({type: 1}, onMsg, onErr)
        },
        destroyed() {
            WsApi.closeRsu({type: 1}, null, null)
        }
    };
</script>

<style lang="scss">

</style>