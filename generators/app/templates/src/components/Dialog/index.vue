<template>
    <div class="biz-dialog">
        <dlg-top-step  :stepTitles="stepTitles.userTitles" :idx="idx"></dlg-top-step>
<!--    <check-card></check-card>-->
<!--        <check-obu></check-obu>-->
        <dlg-content
        :idx="idx"
        :model="model"
        @ftClick="ftClick">
        </dlg-content>
    </div>
</template>
<script>
    import DlgHeader from "./DlgHeader";
    import DlgTopStep from "./DlgTopStep";
    import DlgContent from "./DlgContent";
    import DlgFooter from "./DlgFooter";
    import {stepTitles} from "../../utils/stepTitles";
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import {mapGetters} from 'vuex'
    import WsApi from "@/api/wsApi";
    import CheckCard from '@/views/cardBusiness/check'
    import CheckObu from '@/views/labelBusiness/checkObu'

    export default {
        props: {
            inate: {//当前步骤条
                type: Number,
                default: ''
            },
            model:{//功能模块 ['newuser'-新开户 ‘userbusiness’-用户业务 'vehicleinfo'-车辆信息 ]
                type:String,
                default:''
            }
        },
        name: "CardIssue",
        components: {
            DlgHeader,
            DlgTopStep,
            DlgContent,
            DlgFooter,
            CheckCard,
            CheckObu
        },
        data() {
            return {
                stepTitles:stepTitles,
                idx: -1,
                ftBtnArrs: ftBtns,
                titles: [
                    "用户信息",
                    "用户档案",
                    "车辆信息",
                    "车辆档案",
                    "卡片发行",
                    "标签发行",
                    "电子受理单",
                ]
            };
        },
        watch: {
            inate: {
                handler(val, oldVal) {
                    this.idx = this.inate;
                },
                deep: true
            },
        },
        created() {

        },
        mounted() {
            this.idx = this.inate;
        },
        computed: {
            ...mapGetters([
                'appointInfo'
            ]),
        },
        methods: {
            ftClick: function (event) {
                console.log(event, '1111');
                let tt = event;
                switch (event) {
                    case cmds.next:
                        this.idx++;
                        if(this.appointInfo.appoint_id && this.idx === 2){
                                this.$emit("idxtitle", this.titles[this.idx] + '（互联网预约通道）');
                        }
                        else{
                            this.$emit("idxtitle", this.titles[this.idx]);
                        }
                        break;
                    case cmds.prev:
                        this.idx--;
                        this.$emit("idxtitle", this.titles[this.idx]);
                        break;
                    case cmds.goBack:
                        this.$emit("closeDiadog",);
                        break;
                    default:
                        break;
                }
                // let arr = {
                //   bissnessType: "doSale",
                //   chargeWay: "03",
                //   data: JSON.stringify({ amount: 1 })
                // };
                // // WsApi.test(JSON.stringify(arr), this.onMsg, this.onError)
                // WsApi.heartbeat(this.onMsg, this.onError);
                // //_._apiBase(JSON.stringify(arr), this.onMsg, this.onError)
                // // }
                // console.log("按钮被点击：" + event);
            },
            /**webSocket消息回调 */
            onMsg: function (message) {
                console.log("onmessage:" + message.data);
            },
            /**webSocket内部异常 */
            onError: function (error) {
                console.log("onerror:" + error);
            },
            idxchange: function (idx) {
                let _this = this;
                _this.idx = idx;
                _this.title = _this.titles[idx];
                _this.$emit("idxtitle", _this.titles[idx]);
                switch (this.idx) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
