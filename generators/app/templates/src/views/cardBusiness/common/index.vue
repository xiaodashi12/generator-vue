<template>
    <div class="card-issue-container">
        <div class="pdf-view" v-show="false" style="z-index: 100">
            <iframe id='previewPdf1' :src="fileUrl" height="99%"
                    width="100%">
            </iframe>
        </div>
        <div class="card-common-content">
            <div class="title">用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{customerInfo.customer_id}}</span>
                    </el-col>
                    <el-col :span="16">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
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
                        <span class="rg">{{vehicleInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{cardTypeStr}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>发行方：</label>
                        <span class="rg">{{cardInfo.sell_branch}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>发行时间：</label>
                        <span class="rg">{{cardInfo.open_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>失效日期：</label>
                        <span class="rg">{{cardInfo.end_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>CPU卡状态：</label>
                        <span class="rg">{{cardStatus}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>操作时间：</label>
                        <span class="rg">{{cardInfo.update_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作网点：</label>
                        <span class="rg">{{cardInfo.update_branch}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作员：</label>
                        <span class="rg">{{cardInfo.update_op}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>销卡时间：</label>
                        <span class="rg">{{cardInfo.cancel_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>销卡类型：</label>
                        <span class="rg">{{cancelType}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>通行卡颜色：</label>
                        <span class="rg">{{onlyCpu}}</span>
                    </el-col>
                </el-row>
            </div>
            <div v-if="showrason" class="title">
                <p>原&emsp;&emsp;因</p>
                <el-input type="text" style="width: 100%" placeholder="请输入原因（必填项）" v-model="reason"></el-input>
            </div>
        </div>
    </div>
</template>

<script>
    import * as dict from '../../../utils/dictionaries'
    import fetch from '../../../utils/fetch'
    import api from '../../../api'
    import {mapGetters, mapState} from "vuex";
    import {cmds} from '../../../utils/ftBtnConsts'

    export default {
        name: "Common",
        props: {
            showrason: {
                default: false
            }
        },
        data() {
            return {
                method: '',
                url: '',
                //操作类型
                opType: '',
                isPrinted: false,
                cardInfo: {},
                reason: '',
                fileUrl: '',
            }
        },
        methods: {
            queryCardInfo() {
                this.startLoading()
                let params = {
                    url: api['cardInfo'].url,
                    method: 'post',
                    data: {
                        method: api['cardInfo'].method,
                        customer_id: this.customerInfo.customer_id,
                        customer_name: this.customerInfo.customer_name,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                        cpu_card_id: this.vehicleInfo.cpu_card_id
                    }
                }
                fetch(params).then(res => {
                    this.endLoading()
                    this.cardInfo = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取卡信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            doBusiness(cmd, opType = '') {
                //debugger
                switch (cmd) {
                    case cmds.prtFrozen:
                    case cmds.prtLoss:
                        if (!this.reason) {
                            this.$msgbox({
                                message: '原因必填，请输入原因',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                            return;
                        }
                        let params = {
                            customer_id: this.customerInfo.customer_id,
                            customer_name: this.customerInfo.customer_name,
                            link_mobile: this.customerInfo.link_mobile,
                            link_address: this.customerInfo.link_address,
                            vehicle_color: this.vehicleInfo.vehicle_color,
                            vehicle_code: this.vehicleInfo.vehicle_code,
                            cpu_card_id: this.vehicleInfo.cpu_card_id,
                            reason: this.reason,
                            operation: opType
                        }
                        this.startLoading()
                        fetch({
                            url: api['specialPrint'].url || '',
                            method: 'post',
                            data: {
                                method: api['specialPrint'].method,
                                ...params
                            },
                            responseType: 'blob'
                        }).then((response) => {
                            this.endLoading()
                            this.isPrinted = true
                            let binaryData = [];
                            binaryData.push(response);
                            this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                            document.getElementById('previewPdf1').onload = () => {//等待iframe加载完成后再执行doPrint.每次iframe设置src之后都会重新执行这部分代码。
                                if(this.fileUrl){
                                    this.endLoading();
                                    document.getElementById('previewPdf1').contentWindow.print();
                                }

                            };
                        }).catch((err) => {
                            this.endLoading()
                            this.isPrinted = false
                            this.$msgbox({
                                message: '获取业务单失败:' + err.message,
                                title: '失败',
                                dangerouslyUseHTMLString: true,
                                customClass: 'my_msgBox singelBtn',
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                        })
                        return
                    case cmds.unLoss:
                        this.method = api['cardLoss'].method
                        this.url = api['cardLoss'].url
                        this.opType = '2'
                        break
                    case cmds.loss:
                        this.method = api['cardLoss'].method
                        this.url = api['cardLoss'].url
                        this.opType = '1'
                        break
                    case cmds.frozen:
                        this.method = api['cardFrozen'].method
                        this.url = api['cardFrozen'].url
                        this.opType = '1'
                        break
                    case cmds.unFrozen:
                        this.method = api['cardFrozen'].method
                        this.url = api['cardFrozen'].url
                        this.opType = '2'
                        break
                }
                console.log(cmd, this.method, this.url)
                if (this.method && this.url && this.opType) {
                    if (this.isPrinted) {
                        if (this.reason) {
                            this.startLoading()
                            let params = {
                                url: this.url,
                                method: 'post',
                                data: {
                                    method: this.method,
                                    customer_id: this.customerInfo.customer_id,
                                    vehicle_color: this.vehicleInfo.vehicle_color,
                                    vehicle_code: this.vehicleInfo.vehicle_code,
                                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                                    operation: this.opType,
                                    reason: this.reason
                                }
                            }
                            fetch(params).then(res => {
                                this.endLoading()
                                this.$msgbox({
                                    message: '处理成功',
                                    title: '成功',
                                    type: 'success',
                                    customClass: 'my_msgBox singelBtn',
                                })
                                this.$emit("onClose", cmds.goBack);
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
                                    this.$store.commit('SET_VEHICLEINFO', res[0])
                                    //this.setVehicleInfo(res[0])
                                }).catch(error => {
                                    console.log(error)
                                    this.$message({
                                        showClose: true,
                                        type: 'error',
                                        dangerouslyUseHTMLString: true,
                                        message: "车辆信息获取失败:" + error.message,
                                    });
                                })
                            }).catch(error => {
                                this.endLoading()
                                this.$msgbox({
                                    message: '处理失败:' + error.message,
                                    title: '失败',
                                    customClass: 'my_msgBox singelBtn',
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: '确定',
                                    type: 'error'
                                })
                            })
                        } else {
                            this.$msgbox({
                                message: '原因必填，请输入原因',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                        }
                    } else {
                        this.$msgbox({
                            message: '打印业务单后才能执行后续操作，请先打印业务单',
                            title: '提示',
                            type: 'warning',
                            customClass: 'my_msgBox singelBtn',
                        })
                    }
                }
            }
        },
        mounted() {
            this.queryCardInfo()
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            vehicleClass: function () {
                if (this.cardInfo)
                    return dict.getVehicleCatgoryType(this.cardInfo.vehicle_class) + '[' + dict.getVehicleType(this.cardInfo.vehicle_category) + ']'
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
            //车牌颜色字符串
            vehicleInfoColorStr: function () {
                return dict.getVehicleColor(this.vehicleInfo.vehicle_color);
            },
            cardStatus: function () {
                return dict.getCpuStatus(this.cardInfo.cpu_status)
            },
            onlyCpu: function () {
                return dict.getObuIssue(this.cardInfo.only_cpu_card === '1' ? '0' : '1')
            },
            cancelType: function () {
                return dict.getCancelType(this.cardInfo.cancel_type)
            }
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

        .pdf-view {
            height: $dialog-height;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .card-common-content {
            height: $dialog-height;
            overflow-y: auto;
            overflow-x: hidden;
            background: #ffffff;
            /*padding: 12px 36px 12px 49px;*/

            .title {
                margin: 10px auto 0px 8%;
                letter-spacing: 2px;
                font-family: 'PingFangSC-Regular';
                text-align: left;
                height: 22px;
                line-height: 22px;
                color: #000000;
                border-left: 2px solid #5584ff;
                padding: 0px 0px 0px 12px;

                &:first-child {
                    margin-top: 20px;
                }

                span {
                    color: #a0a2ad;
                    font-size: 12px;
                    display: inline-block;
                    /*margin-left: 36px;*/
                }
            }

            .info {
                /*margin: 12px 0px 12px 0px;*/
                /*width: 92%;*/
                margin: 0px auto 0px 12%;

                .el-col {
                    text-align: left;
                    padding: 6px 0px 6px 0px;

                    label {
                        display: inline-block;
                        font-size: 12px;
                        color: #999999;
                        text-align: right;
                        min-width: 74px;
                        font-weight: normal;
                        padding-right: 8px;

                        &.center {
                            text-align: center;
                        }
                    }

                    span {
                        display: inline-block;
                        text-align: left;
                        font-size: 14px;
                        min-width: 60px;
                        color: #000000;
                    }
                }
            }
        }
    }

    .card-common-content {

    }
</style>