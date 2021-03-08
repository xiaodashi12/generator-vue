<template>
    <div class="card-issue-container">
        <div class="pdf-view" v-show="false" style="z-index: 100">
            <iframe id='previewPdf' :src="fileUrl" height="99%"
                    width="100%">
            </iframe>
        </div>
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
                        <span class="rg">{{changeCardInfo.newCardInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片类型：</label>
                        <span class="rg">{{changeCardInfo.newCardInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                </el-row>
            </div>
            <div v-has="{'rights':[12]}">
                <div class="title" @click="toggleVissible">
                    公务卡信息
                </div>
                <div class="info" v-show="isShowSpeDetail">
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
                            <label>启用时间：</label>
                            <span class="rg">{{changeCardInfo.officialInfo.start_date}}</span>
                        </el-col>
                        <el-col :span="8">
                            <label>到期时间：</label>
                            <span class="rg">{{changeCardInfo.officialInfo.end_date}}</span>
                        </el-col>

                    </el-row>
                </div>
            </div>

            <div class="title">办理原因</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="24">
                        {{changeCardInfo.reason}}
                    </el-col>
                </el-row>
            </div>

        </div>
        <dlg-footer :btninfos="ftBtnArrays.businessOrderPrinting" @ftClick="ftClick"></dlg-footer>
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
        name: "CardIssue",
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
                fileUrl: '',
                //卡片信息
                cardInfo: {},
                /**公务卡信息*/
                officialInfo: {},
            };
        },
        mounted(){
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
                    case cmds.newCardCheck:
                        //返回新卡校验
                        this.$emit('changeIndex', 0, cmds.newCardCheck)
                        break;
                    case cmds.BusinessOrderPrinting:
                        //业务单打印
                        this.startLoading();
                        let params = {
                            customer_id: this.customerInfo.customer_id,
                            customer_name: this.customerInfo.customer_name,
                            link_mobile: this.customerInfo.link_mobile,
                            link_address: this.customerInfo.link_address,
                            vehicle_color: this.vehicleInfo.vehicle_color,
                            vehicle_code: this.vehicleInfo.vehicle_code,
                            orig_cpu_card_id: this.vehicleInfo.cpu_card_id,
                            obu_id: this.vehicleInfo.obu_id,
                            new_cpu_card_id: this.changeCardInfo.newCardInfo.cpu_card_id,
                            reason: this.reason,
                            operation: '5'
                        }
                        fetch({
                            url: api['specialPrint'].url || '',
                            method: 'post',
                            data: {
                                method: api['specialPrint'].method,
                                ...params
                            },
                            responseType: 'blob'
                        }).then((response) => {
                            this.endLoading();
                            let binaryData = [];
                            binaryData.push(response);
                            this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                            document.getElementById('previewPdf').onload = () => {//等待iframe加载完成后再执行doPrint.每次iframe设置src之后都会重新执行这部分代码。
                                if(this.fileUrl){
                                    this.endLoading();
                                    document.getElementById('previewPdf').contentWindow.print();
                                }

                            };
                        }).catch((err) => {
                            this.endLoading();
                            this.$msgbox({
                                message: '获取业务单失败:' + err.message,
                                title: '失败',
                                customClass: 'my_msgBox singelBtn',
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                        })
                        break;
                    case cmds.originalCard:
                        //原卡销卡
                        this.$emit('changeIndex', 2, cmds.originalCard)
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