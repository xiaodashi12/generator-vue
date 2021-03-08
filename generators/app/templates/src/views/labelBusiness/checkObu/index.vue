<template>
    <div class="card-issue-container">
        <div class="card-issue-content">
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
                        <label>{{sysVehicleInfo.vehicle_category=="1"?"载&emsp;&emsp;重&nbsp;：":sysVehicleInfo.vehicle_category=="0"?"座&nbsp;位&nbsp;数&nbsp;：":""}}</label>
                        <span class="rg">{{sysVehicleInfo.vehicle_category=="1"?(sysVehicleInfo.seat/1000):sysVehicleInfo.vehicle_category=="0"?sysVehicleInfo.seat:""}}</span>
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
        <dlg-footer :btninfos="ftBtnArrays.checkObu" @ftClick="ftClick"></dlg-footer>
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
        name: "CheckObu",
        components: {
            DlgFooter
        },
        mixins: {},
        data() {
            return {
                rsuOpend: false,
                ftBtnArrays: ftBtns,
                defaultLoadingStr: "加载中，请稍候...",
                //系统信息和下部车辆信息
                sysVehicleInfo: {},
                readtype: '1'
            };
        },
        methods: {
            ...mapActions([
                'setVehicleInfo',
            ]),
            //底部按钮点击事件处理
            ftClick: function (cmd, byUser = true) {
                if (byUser) {
                    this.sysVehicleInfo = {};
                    this.readtype = '1'
                }
                switch (cmd) {
                    //读obu
                    case cmds.readObu:
                        let param = {}
                        //this.type = '2'
                        if (this.sysVehicleInfo.obu_id) {
                            param['obu_id'] = this.sysVehicleInfo.obu_id
                        }

                        param['read_type'] = this.readtype

                        this.startLoading(this.defaultLoadingStr);
                        WsApi.readObuInfo(param, this.onMsg, this.onErr);
                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        //如果可以，才调用上层事件处理
                        // this.$emit("ftClick", cmd);
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
                        default:
                            break;
                    }
                } else {
                    this.endLoading();
                    this.$message({
                        showClose: true,
                        type: 'error',
                        message: rspData.return_msg,
                    });
                }
                console.log("收到消息：" + msg.data);
            },
            onErr: function (err) {
                //隐藏进度条
                this.endLoading();
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: err,
                });

                console.log("请求异常：" + err);
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
        },
        created() {
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
                        confirmButtonText: "重试",
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
