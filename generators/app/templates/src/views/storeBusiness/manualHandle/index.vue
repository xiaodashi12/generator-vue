<template>
    <div class="load-err-deal-container">
        <div class="load-err-deal-content">
            <div class="title">卡片信息</div>
            <div class="infos">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{$store.getters.customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>卡片编号：</label>
                        <span class="rg">{{$store.getters.vehicleInfo.cpu_card_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">[{{vehocleCardInfoColorStr}}]{{$store.getters.vehicleInfo.vehicle_code}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">圈存异常记录</div>
            <div class="load-err-list">
                <el-table :data="loadErrList" stripe style="width: 100%"
                          highlight-current-row
                          @current-change="handleCurrentChange"
                          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column width="30">
                        <template slot-scope="scope">
                            <span aria-checked="mixed"
                                  :class="scope.row.cur?'el-checkbox__input is-checked':'el-checkbox__input'"><span
                                    class="el-checkbox__inner"></span>
                                <!--                                <input type="checkbox" aria-hidden="true"-->
                                <!--                                       class="el-checkbox__original"-->
                                <!--                                       v-model="scope.row.cur">-->
                            </span>
                            <!--                            <el-checkbox v-model="scope.row.cur"/>-->
                        </template>
                    </el-table-column>
                    <el-table-column width="280" align='center' prop="load_acceptid"
                                     label="圈存受理号"></el-table-column>
                    <el-table-column align='center' prop="load_money" label="圈存金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.load_money / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' prop="load_statusname" label="圈存状态"></el-table-column>
                    <el-table-column align='center' width="260" prop="load_date" label="圈存时间"></el-table-column>
                </el-table>
            </div>
            <div class="title">处理结果</div>
            <div class="infos">
                <el-form ref="manualHandleModel"
                         size="small"
                         :model="manualHandleModel"
                         :rules="rules"
                         label-position="right">
                    <el-input type="password" style="display: none;"/>
                    <el-row :span="24">
                        <el-col :span="8">
                            <el-form-item label="异常处理：" class="item" prop="load_complete">
                                <el-radio-group size="small" class="label" v-model="manualHandleModel.load_complete">
                                    <el-radio-button :label="1" :key="1">钱已写到卡上
                                    </el-radio-button>
                                    <el-radio-button :label="0" :key="0">钱未写到卡上
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="授权人账户：" class="item" prop="account">
                                <el-input size="small" placeholder="请输入授权人账户" class="input"
                                          auto-complete="off"
                                          v-model="manualHandleModel.account"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="授权人密码：" class="item" prop="pwd">
                                <el-input size="small" placeholder="请输入授权人密码" class="input"
                                          onfocus="this.type='password'" autocomplete="off"
                                          v-model="manualHandleModel.pwd"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="title">
                人工核对信息
                <!--                <span>如何核对</span>-->
            </div>

            <div class="info">
                <pop-switch @onChange="transKey" :btnList="capTabList"></pop-switch>
                <el-table v-show="active==0" :data="loadPassLists" highlight-current-row center
                          style="min-height: 114px;">
                    <el-table-column prop="card_counter" label="卡计数器">
                    </el-table-column>
                    <el-table-column prop="vehicle_code" label="车牌号">
                    </el-table-column>
                    <el-table-column prop="vehicle_color_name" label="车牌颜色">
                    </el-table-column>
                    <el-table-column prop="deal_money" label="交易金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.deal_money / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deal_date_time" label="交易时间">
                    </el-table-column>
                    <el-table-column prop="before_balance" label="交易前金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.before_balance / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="after_balance" label="交易后金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.after_balance / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="exit_province_name" label="出口省份">
                    </el-table-column>
                    <el-table-column prop="deal_remark" label="交易描述">
                    </el-table-column>
                </el-table>
                <el-table v-show="active==1" :data="loadLists" highlight-current-row center style="min-height: 114px;">
                    <el-table-column prop="vehicle_code" label="车牌号">
                    </el-table-column>
                    <el-table-column prop="vehicle_color_name" label="车牌颜色">
                    </el-table-column>
                    <el-table-column prop="load_money" label="圈存金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.load_money / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="load_date_time" label="圈存时间">
                    </el-table-column>
                    <el-table-column prop="card_counter" label="卡计数器">
                    </el-table-column>
                </el-table>
                <el-table v-show="active==2" :data="loadCardSerials" highlight-current-row center
                          style="min-height: 114px;">
                    <el-table-column prop="trans_time" label="交易时间">
                    </el-table-column>
                    <el-table-column prop="trans_type" label="交易类型" :formatter="formatTransType">
                    </el-table-column>
                    <el-table-column prop="trans_money" label="交易金额">
                        <template slot-scope="scope">
                            <span>{{(scope.row.trans_money / 100 ).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="trans_serial" label="交易序号">
                    </el-table-column>
                    <el-table-column prop="terminal_no" label="终端机编号">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <dlg-footer :btninfos="ftBtnArrays.manualHandle" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import PopSwitch from '../../../components/popSwitch';
    import fetch from '../../../utils/fetch'
    import api from '../../../api'
    import WsApi from "../../../api/wsApi";
    import WsConsts from "../../../utils/wsConsts";
    import store from '../../../store';
    import * as dict from '../../../utils/dictionaries'
    import {mapGetters} from 'vuex';
    import DlgFooter from '../../../components/Dialog/DlgFooter'
    import {ftBtns, cmds} from "../../../utils/ftBtnConsts"
    import {getSecuCode} from "../../../utils/dialogUtils";

    export default {
        name: "ManualHandle",
        components: {
            PopSwitch,
            DlgFooter
        },
        props: {
            visible: {
                type: Boolean,
            }
        },
        data() {
            return {
                active: 0,
                loadPassLists: [],
                loadLists: [],
                loadCardSerials: [],

                capTabList: dict.capTabList,
                manualHandleModel: {},
                loadErrList: [],
                ftBtnArrays: ftBtns,
                currentRow: {
                    cur: false
                },
                rules: {
                    load_complete: [
                        {required: true, message: '请选择处理结果', trigger: 'blur'},
                    ],
                    pwd: [
                        {required: true, message: '请输入授权人密码', trigger: 'blur'},
                    ],
                    account: [
                        {required: true, message: '请输入授权人账户', trigger: 'blur'},
                    ],
                }
                //visible:visible
            }
        },
        watch: {
            visible(newval, oldval) {
                if (newval) {
                    this.queryLoadErrList()
                } else {
                    this.manualHandleModel = {}
                    this.currentRow = {cur: false}
                    this.loadErrList = []
                    this.$emit('onClose', {})
                }
            }
        },
        // destroyed() {
        //
        // },
        mounted() {
            this.queryLoadErrList()
            this.loadPassList()
        },
        methods: {
            queryLoadErrList() {
                //debugger
                this.startLoading()
                let params = {
                    url: api['loadErrManualList'].url,
                    method: 'post',
                    data: {
                        method: api['loadErrManualList'].method,
                        cpu_card_id: this.vehicleInfo.cpu_card_id
                    }
                }
                fetch(params).then(res => {
                    this.endLoading()
                    this.loadErrList = []

                    for (let i = 0; i < res.length; i++) {
                        this.loadErrList.push({...res[i], cur: false})
                    }
                    console.log('loadErrList', this.loadErrList)
                    //this.loadErrList = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取异常圈存记录失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            transKey(active) {
                this.active = active
                console.log('active：' + active)
                // debugger
                switch (active) {
                    case '0':
                        //加载通行消费记录
                        this.loadPassList()
                        break
                    case '1':
                        //加载圈存记录
                        this.loadList()
                        break
                    case '2':
                        //加载卡内流水
                        this.loadCardSerial()
                        break
                }
            },
            handleselect(selection, row) {
                console.log(selection, row)
            },
            handleCurrentChange(row, old) {
                if (row)
                    row.cur = true
                if (old)
                    old.cur = false
                console.log(row, old)
                this.currentRow = {...row}
            },

            ftClick(cmd) {
                switch (cmd) {
                    case cmds.manualHandle:
                        this.$refs.manualHandleModel.validate(valid => {
                            if (valid) {
                                console.log('this.currentRow', this.currentRow)
                                if (!this.currentRow || !this.currentRow.cur) {

                                    this.$msgbox({
                                        message: '请先选择一条圈存异常记录',
                                        title: '提示',
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定',
                                        type: 'error'
                                    })
                                    return
                                }
                                let params = {
                                    url: api['loadErrManualHandle'].url,
                                    method: 'post',
                                    data: {
                                        method: api['loadErrManualHandle'].method,
                                        customer_id: this.customerInfo.customer_id,
                                        cpu_card_id: this.vehicleInfo.cpu_card_id,
                                        vehicle_code: this.vehicleInfo.vehicle_code,
                                        vehicle_color: this.vehicleInfo.vehicle_color,
                                        authorized_op_code: this.manualHandleModel.account,
                                        authorized_op_pwd: this.manualHandleModel.pwd,
                                        load_acceptid: this.currentRow.load_acceptid,
                                        load_money: this.currentRow.load_money,
                                        load_complete: this.manualHandleModel.load_complete
                                    }
                                }
                                this.startLoading()
                                fetch(params).then(res => {
                                    this.endLoading()
                                    this.$msgbox({
                                        message: '圈存异常人工处理成功',
                                        title: '成功',
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定',
                                        type: 'success'
                                    })
                                    this.queryLoadErrList()
                                }).catch(error => {
                                    this.endLoading()
                                    this.$msgbox({
                                        message: '圈存异常人工处理失败:' + error.message,
                                        title: '失败',
                                        customClass: 'my_msgBox singelBtn',
                                        confirmButtonText: '确定',
                                        type: 'error'
                                    })
                                })
                            }
                        })
                        break
                }
            },
            loadPassList() {
                this.startLoading()
                fetch({
                    url: api['getconsRecord'].url || '',
                    method: 'post',
                    data: {
                        method: api['getconsRecord'].method,
                        cpu_card_id: this.vehicleInfo.cpu_card_id,
                        // start_date: this.accountInfo.start_date,
                        // end_date: this.accountInfo.end_date,
                        // page_index: this.accountInfo.page_index,
                        // page_size: this.accountInfo.page_size,
                        page_index: 1,
                        page_size: 15,
                    }
                }).then((res) => {
                    this.endLoading()
                    console.log(res, '+++res：：：：：loadPassList++++');
                    this.loadPassLists = [...res];
                }).catch((err) => {
                    this.endLoading()
                    this.$msgbox({
                        message: '获取通行消费流水失败:' + err.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                    console.log(err, '++++err：：：：：loadPassList+++');
                })
            },
            loadList() {
                this.startLoading()
                fetch({
                    url: api['gettransRecord'].url || '',
                    method: 'post',
                    data: {
                        method: api['gettransRecord'].method,
                        //customer_id: this.customerInfo.customer_id || '',
                        //cpu_card_id: this.cardInfo.cpu_card_id,
                        cpu_card_id: this.vehicleInfo.cpu_card_id,
                        // start_date: this.accountInfo.start_date,
                        // end_date: this.accountInfo.end_date,
                        // page_index: this.accountInfo.page_index,
                        // page_size: this.accountInfo.page_size,
                        page_index: 1,
                        page_size: 15,
                    }
                }).then((res) => {
                    this.endLoading()
                    console.log(res, '+++res：：：：：loadList++++');
                    this.loadLists = [...res];
                }).catch((err) => {
                    this.endLoading()
                    this.$msgbox({
                        message: '获取圈存记录失败:' + err.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                    console.log(err, '++++err：：：：：loadList+++');
                })
            },
            loadCardSerial() {
                this.startLoading()
                let params = {
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    jour_num: 10
                };
                //卡内近期流水数据
                WsApi.readCardJour(params, this.onMsg, this.onErr);
            },
            onMsg(msg) {
                this.endLoading()
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    //获取业务数据
                    let bizContent = JSON.parse(rspData.biz_content);
                    this.loadCardSerials = bizContent.jour_list;
                } else {
                    this.$msgbox({
                        message: '获取圈存记录失败:' + rspData.return_msg,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                }
            },
            onErr(err) {
                this.endLoading()
                this.$msgbox({
                    message: '获取圈存记录失败:' + err.message,
                    title: '失败',
                    customClass: 'my_msgBox singelBtn',
                    confirmButtonText: '确定',
                    type: 'error'
                })
            },
            formatTransType: function (row, col) {
                if (row && row.trans_type)
                    return dict.getTransType(row.trans_type)
                else
                    return ''
            }, test(scope) {
                // debugger
            }
        },
        computed: {
            vehocleCardInfoColorStr() {
                return dict.getVehicleColor(this.vehicleInfo.vehicle_color)
            },
            ...mapGetters([
                'accountInfo'
            ]),

        }
    }
</script>

<style lang="scss" scoped>
    .load-err-deal-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        .load-err-deal-content {
            height: 452px;
            overflow-y: auto;
            overflow-x: hidden;

            background: #ffffff;

            .input {
                width: 136px !important;
            }

            .el-row {
                margin-left: 30px;
            }

            .title {
                letter-spacing: 2px;
                font-family: 'PingFangSC-Regular';
                text-align: left;
                height: 22px;
                line-height: 22px;
                color: #000000;
                border-left: 2px solid #5584ff;
                padding: 0px 0px 0px 12px;
                margin: 12px 0px 12px 52px;

                span {
                    color: #a0a2ad;
                    font-size: 12px;
                    display: inline-block;
                    margin-left: 36px;
                }
            }

            .infos {
                margin: 0px 0px 12px 60px;

                .el-col {
                    text-align: left;
                    padding: 6px 0px 6px 0px;

                    label {
                        display: inline-block;
                        font-size: 12px;
                        color: #999999;
                        text-align: right;
                        min-width: 70px;
                        font-weight: normal;
                        padding-right: 8px;
                    }

                    .rg {
                        display: inline-block;
                        text-align: left;
                        font-size: 14px;
                        min-width: 60px;
                        color: #000000;
                    }
                }

                .label label {
                    padding: 0px;
                    margin: 0;
                    min-width: 50px;
                }
            }
        }
    }

</style>