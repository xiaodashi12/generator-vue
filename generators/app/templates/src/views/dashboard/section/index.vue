<template>
    <div class="etcSection">
        <etc-model @onEdit="handleOnEdit"></etc-model>
        <el-dialog
                :title="title"
                class="my_main_dialog"
                custom-class="etcDalog"
                :visible.sync="userInfoVisible"
                :close-on-click-modal="false"
                :before-close="handleOnStepClose">
            <card-issue
                    v-if="hackReset"
                    @closeDiadog="closeDiadog"
                    @idxtitle="idxtitle"
                    :model="model"
                    :inate="inate">
            </card-issue>
        </el-dialog>

        <main-dialog
                @onClose="handleOnMainClose"
                :title="title"
                class="my_main_dialog"
                :dialogVisible="dialogVisible">
            <div slot="child">
                <check-obu v-if="cmd===cmds.checkObu"></check-obu>
                <vehicleDetial @closeMainDiadog="closeMainDiadog" :showBtn="true" v-if="cmd===cmds.vehicleCancellation"></vehicleDetial>
                <vehicleDetial @closeMainDiadog="closeMainDiadog" :showBtn="true" :showForce="true" :btnType="'compulsoryCancellation'" v-if="cmd===cmds.compulsoryCancellation"></vehicleDetial>
                <check-cpu v-if="cmd===cmds.checkCpu"></check-cpu>
                <webIssue @clickItem="clickItem" v-if="cmd===cmds.webIssue"></webIssue>
                <un-sign v-if="cmd===cmds.unSign"></un-sign>
                <etc-storecapital v-if="cmd===cmds.storedValue"></etc-storecapital>
                <etc-labelCancellation v-if="cmd === cmds.labelCancellation"
                                       @onClose="handleOnMainClose"></etc-labelCancellation>
                <etc-labelMregistration
                v-if="cmd === cmds.mRegistration"
                @onClose="handleOnMainClose">
                </etc-labelMregistration>

                <special-sign v-if="cmd===cmds.specialSign"></special-sign>
                <Cancelation @closeMainDiadog="closeMainDiadog" v-if="cmd===cmds.cardCancellation"></Cancelation>
                <unlock @onClose="handleOnMainClose" v-if="cmd===cmds.unlock"></unlock>
                <frozen @onClose="handleOnMainClose" v-if="cmd===cmds.frozen"></frozen>
                <loss @onClose="handleOnMainClose" v-if="cmd===cmds.loss"></loss>
                <pos-Recharge v-if="cmd === cmds.posRecharge"></pos-Recharge>
                <accountInfo v-if="cmd === cmds.accountInfo"></accountInfo>
                <reCard v-if="cmd === cmds.reCard"></reCard>

            </div>
        </main-dialog>
<!--        // 补领换卡-->
        <el-dialog
                :title="cardTitle"
                class="my_main_dialog"
                custom-class="etcDalog"
                :visible.sync="cardVisible"
                :close-on-click-modal="false"
                :before-close="handleCardClose">
            <DlgTopStep :stepTitles="stepTitles.changeCardTitle" :idx="cardIndex"></DlgTopStep>
            <changeCard @changeIndex="changeIndex" v-if="cardType === cmds.newCardCheck"></changeCard>
            <BusinessOrderPrinting @changeIndex="changeIndex" v-if="cardType === cmds.BusinessOrderPrinting"></BusinessOrderPrinting>
            <deleteCard @changeIndex="changeIndex" v-if="cardType === cmds.originalCard"></deleteCard>
            <newCardissue @changeIndex="changeIndex" v-if="cardType === cmds.newCardissue"></newCardissue>
        </el-dialog>
    </div>
</template>
<script>
    import {stepTitles} from "@/utils/stepTitles";
    import DlgTopStep from "@/components/Dialog/DlgTopStep";
    import changeCard from "@/views/cardBusiness/newCardCheck";
    import BusinessOrderPrinting from "@/views/cardBusiness/newCardCheck/BusinessOrderPrinting";
    import deleteCard from "@/views/cardBusiness/newCardCheck/deleteCard";
    import newCardissue from "@/views/cardBusiness/newCardCheck/newCardissue";
    import CardIssue from "@/components/Dialog";
    import vehicleDetial from "@/components/vehicleInfoDir/vehicleDetial";
    import accountInfo from "@/components/accountInfoDir/accountInfo";
    import EtcModel from './model';
    import {mapActions , mapGetters} from 'vuex';
    import {cmds} from '@/utils/ftBtnConsts'
    import EtcStorecapital from '@/views/storeBusiness/capital';
    import MainDialog from '@/components/mainDialog'
    import CheckObu from '@/views/labelBusiness/checkObu'
    import CheckCpu from '@/views/cardBusiness/check'
    import webIssue from '@/views/labelBusiness/webIssue/webIssueIndex'
    import Cancelation from '@/views/cardBusiness/cancellation'
    import UnSign from '@/views/signContract/unSign'
    import EtcLabelCancellation from '@/views/labelBusiness/cancellation'
    import EtcLabelMregistration from '@/views/labelBusiness/mRegistration'
    import SpecialSign from '@/views/signContract/specialSign'
    import Unlock from "../../cardBusiness/unlock/index";
    import Frozen from "../../cardBusiness/frozen/index";
    import Loss from "../../cardBusiness/loss/index";
    import PosRecharge from '@/views/storeBusiness/pos/index';

    const titles = {
        'saveCustInfo': {
            name: '用户信息',
            index: 0
        },
        'uplCustArch': {
            name: '用户档案',
            index: 1
        },
        'saveVehicleInfo': {
            name: '车辆信息',
            index: 2
        },
        'uplVehicleArch': {
            name: '车辆档案',
            index: 3
        },
        'cardIssue': {
            name: '卡片发行',
            index: 4
        },
        'obuIssue': {
            name: '标签发行',
            index: 5
        },
        'createReceipts': {
            name: '电子受理单',
            index: 6
        },
    }
    export default {
        name: 'EtcSection',
        components: {
            PosRecharge,
            Loss,
            Frozen,
            Unlock,
            UnSign,
            CheckObu,
            webIssue,
            CardIssue,
            EtcModel,
            EtcStorecapital,
            MainDialog,
            CheckCpu,
            Cancelation,
            EtcLabelCancellation,
            EtcLabelMregistration,
            vehicleDetial,
            SpecialSign,
            accountInfo,
            DlgTopStep,
            changeCard,
            BusinessOrderPrinting,
            deleteCard,
            newCardissue,
        },
        data() {
            return {
                stepTitles:stepTitles,
                cmd: null,
                cmds: cmds,
                dialogVisible: false,
                titles: titles,
                title: "",
                cardTitle: "补领换卡",
                model: "",
                dialogTitle: "",
                inate: -1,
                hackReset: true,
                userInfoVisible: false,
                cardVisible: false,
                moneyVisible: false,
                active: '0',
                cardIndex: 0,
                cardType: null,
                titlesOther: {
                    'checkCpu': {
                        name: '卡片检测',
                    },
                    'checkObu': {
                        name: '标签检测',
                    },
                    'webIssue': {
                        name: '用户预约查询',
                    },
                    'unSign': {
                        name: '撤销签约',
                    },
                    'storedValue': {
                        name: '储值资金'
                    },
                    'labelCancellation': {
                        name: '标签注销'
                    },
                    'specialSign': {
                        name: '特殊签约'
                    },
                    'vehicleCancellation': {
                        name: '车辆注销'
                    },

                    'mRegistration': {
                        name: '维修登记'
                    },
                    'unlock': {
                        name: '卡片解锁'
                    },
                    'loss': {
                        name: '卡片挂失/解挂'
                    },
                    'frozen': {
                        name: '卡片冻结/解冻'
                    },
                    'reCard':{
                        name:'补领换卡',
                    },
                    'posRecharge': {
                        name: 'POS充值'
                    },
                    'accountInfo': {
                        name: '账户明细'
                    },
                    'compulsoryCancellation': {
                        name: '车辆强制注销'
                    },
                    'cardCancellation': {
                        name: '卡片注销'
                    },
                },
                cardList: {
                    'newCardCheck': {
                        name: '补领换卡',
                        idx: 0
                    },
                    'BusinessOrderPrinting': {
                        name: '业务单打印',
                        idx: 1
                    },
                    'originalCard': {
                        name: '原卡销卡',
                        idx: 2
                    },
                    'newCardIssue': {
                        name: '新卡发行',
                        idx: 3
                    },
                }
            }
        },
        created() {
        },
        mounted() {
        },
        computed: {
            ...mapGetters([
                'modelType',
                'appointInfo'
            ])
        },
        methods: {
            ...mapActions([
                'setModelType'
            ]),
            closeDiadog() {
                this.hackReset = false
                this.userInfoVisible = false
            },
            clickItem(status) {
                if(status==='0'){//从新增用户开始办理(未打开新增用户页面
                    this.handleOnMainClose();
                    this.hackReset = true;
                    this.handleOnEdit({title:cmds.saveCustInfo,model:'newuser', type:'new'});
                }
                else if(status==='1'){//从新增车辆开始办理（未打开新增车辆页面
                    this.handleOnMainClose();
                    this.hackReset = true;
                    this.handleOnEdit({title:cmds.saveVehicleInfo,model:'newuser'});
                }
                else{
                    this.handleOnMainClose();
                }
            },
            cancelSuccess(){
                this.cmd = undefined;
                this.dialogVisible = false
            },
            closeMainDiadog() {
                this.cmd = null
                this.title = null
                this.dialogVisible = false
            },
            handleOnMainClose() {

                this.cmd = null
                this.title = null
                this.dialogVisible = false
            },
            handleOnStepClose(done) {
                this.hackReset = false
                if (this.inate === '0') {
                    this.$store.getters.appointInfo.order_no= ''
                }
                done()
            },
            handleCardClose(done) {
                this.cardType = null
                this.cardTitle = null
                this.cardVisible = false
                done()
            },
            changeIndex(index, str) {
                this.cardIndex = index;
                this.cardType = str;
            },

            handleOnEdit(params) {
                let {title, model, type} = params;
                //obuIssue
                if (titles[title]) {
                    if (type) {
                        this.title = type === 'new' ? '用户信息' : '用户变更'
                    } else {
                        this.title = titles[title].name;
                    }
                    if(this.$store.getters.appointInfo.order_no){
                        if(this.title === '用户信息'|| type === 'new' ){
                            this.title = this.title + '（互联网预约通道）'
                        }
                    }
                    if(this.$store.getters.appointInfo.appoint_id){
                        if(this.title === '车辆信息'){
                            this.title = this.title + '（互联网预约通道）'
                        }
                    }
                    this.setModelType(model)
                    this.model = model || '';
                    this.inate = titles[title].index;
                    this.userInfoVisible = !this.userInfoVisible;
                    this.hackReset = true;
                }
                // console.error(this.titlesOther, this.titlesOther[title], title, this.cmd)
                if (this.titlesOther[title]) {

                    this.cmd = title

                    this.title = this.titlesOther[title].name
                    this.dialogVisible = !this.dialogVisible;
                }
                if (this.cardList[title]) {
                    this.cardIndex = this.cardList[title].idx;
                    this.cardType = title;
                    this.cardVisible = !this.cardVisible;
                }
            },
            idxtitle(idxtitle) {
                this.title = idxtitle;
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";


</style>
