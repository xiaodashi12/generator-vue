<template>
    <div class="content">
        <div class="accountOption">
            <div class="upperOption">
                <el-row :span="24" >
                    <el-col :span="10">
                交易渠道：
                <template>
                    <el-select v-model="selChannel_name"
                               clearable
                               placeholder="请选择"
                               class="upperOpSelect"
                               size="medium"
                               style="width: 280px"
                               :filterable="true"
                               value-key="value"
                    >
                        <el-option
                                v-for="item in channel_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
                    </el-col>
                    <el-col :span="10">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                业务类型：
                <template>
                    <el-select v-model="selStatus"
                               clearable
                               placeholder="请选择"
                               class="upperOpSelect"
                               size="medium"
                               style="width: 280px"
                               :filterable="true"
                               value-key="value"
                    >
                        <el-option
                                v-for="item in status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </template>
                    </el-col>
                </el-row>
            </div>
            <el-row :span="24">
                <el-col :span="12">
                <div class="block">
                <span class="demonstration">交易日期：</span>
                <el-date-picker
                        v-model="dealDate"
                        size="medium"
                        unlink-panels
                        type="daterange"
                        range-separator="—"
                        start-placeholder="请选择开始日期"
                        end-placeholder="请选择结束日期">
                </el-date-picker>
            </div>
                </el-col>
                <el-col :span="12">
            <div class="upperBtn" style="text-align: left ;padding-left: 15px" >
                <el-button type="primary" size="medium" style="width: 80px" @click="querySearch">搜索</el-button>
                &nbsp;&nbsp;
                <el-button type="primary" size="medium" style="width: 80px" class="acResetBtn" @click="queryReset" >重置</el-button>
            </div>
                </el-col>
            </el-row>
        </div>

        <div class="accuntList">
            <table class="balanceStyle" style="color: #909399" >
                <tr>
                    <th><div class="my_list_row account_card_balance">
                        <div class="title">用户账户余额：</div>
                    </div>
                    </th>
                    <th > <div >{{(balanceInfo.customer_money/100).toFixed(2)}}</div></th>
                </tr>
            </table>
            <hr style="border:none;border-top:1px solid #DCDFE6;"/>
            <el-table
                    ref="filterTable"
                    :data="tableData"
                    height="calc(100% - 110px)"
                    style="width: 100% ">
                <el-table-column
                        fixed
                        align="center"
                        prop="deal_date_time"
                        label="交易时间"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="customer_id"
                        label="用户编号"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="status_name"
                        label="业务类型"
                        min-width="10%"
                        column-key="status_name"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        label="交易金额"
                        min-width="10%">
                        <template slot-scope="scope">
                             <span>{{(scope.row.deal_money / 100 ).toFixed(2)}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="channel_name"
                        label="交易渠道"
                        min-width="10%"
                >
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="vehicle_code"
                        label="车牌号"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="vehicle_color_name"
                        label="车牌颜色"
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="cpu_card_id"
                        label="卡号"
                        min-width="20%">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="recharge_num"
                        label="充值流水号"
                        min-width="25%">
                </el-table-column>
            </el-table>

            <div class="accountPagination">
                <div class="block" align="right">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page_index"
                            :page-sizes="[10,20,50,100]"
                            :page-size="page_size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="allCount"
                            >
                    </el-pagination>
                </div>
        </div>
    </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {getAcChannelName} from "../../utils/dictionaries";
    import fetch from '@/utils/fetch'
    import {format} from '@/utils/utils'
    import api from '@/api'


    export default {
        name: 'accountDetails',
        props: {
            showBtn: {
                type: Boolean,
                default: false
            },
            active: {
                type: String,
                default: '0'
            },
        },
        components: {
            DlgFooter
        },
        data() {
            return {
                status:[{
                    value: '0',
                    label: '充值'
                },{
                    value: '1',
                    label: '冲正'
                },{
                    value: '2',
                    label: '隔日冲正'
                },{
                    value: '3',
                    label: '退费'
                },{
                    value: '4',
                    label: '转存'
                },{
                    value: '5',
                    label: '调账'
                },{
                    value: '6',
                    label: '争议'
                }],

                channel_type:[{
                    value: '0',
                    label: '网站'
                },{
                    value: '1',
                    label: '网点'
                },{
                    value: '2',
                    label: '中信'
                },{
                    value: '3',
                    label: '工商'
                },{
                    value: '4',
                    label: '农信'
                },{
                    value: '5',
                    label: '邮储'
                },{
                    value: '6',
                    label: '农业'
                },{
                    value: '7',
                    label: '建设'
                },{
                    value: '8',
                    label: '中行'
                },{
                    value: '9',
                    label: '绍兴银行'
                },{
                    value: 'A',
                    label: '光大银行'
                },{
                    value: 'B',
                    label: '宁波银行'
                },{
                    value: 'F',
                    label: '浙商银行'
                },],
                start_date:'',//开始日期
                end_date: '',
                page_index:1,
                page_size: 10,
                allCount : 0,
                tableData: [],
                balanceInfo: '',//获取账户余额数据
                accountInfo:{},
                ftBtnArrays: ftBtns,
                dealDate: '',
               selChannel_name:'',//交易渠道
               selStatus:'',//状态
                value: '',
                accountBalance:'',//账户余额
            }
        },

        computed: {
            ...mapGetters([//获取store存储
                'customerInfo',
            ]),
        },

        mounted() {
            this.queryaccountInfo();//获取账户信息
            this.queryaccountbalance();//获取账户余额
        },

        methods: {
            queryaccountInfo() {
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getaccountDetails'].url,
                    method: 'post',
                    data: {
                        method: api['getaccountDetails'].method,
                        customer_id: _this.customerInfo.customer_id,
                        page_index:_this.page_index,
                        page_size:_this.page_size,
                    }
                }
                this.query(params)
            },
            queryaccountbalance() {//获取账户余额
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getaccountBalance'].url,
                    method: 'post',
                    data: {
                        method: api['getaccountBalance'].method,
                        customer_id: _this.customerInfo.customer_id,
                    }
                };
                fetch(params).then(res => {
                    this.endLoading()
                    this.balanceInfo = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取账户余额失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            queryReset(){//重置（将选项value置0后再刷新table）
                this.selChannel_name ='';
                this.selStatus = '';
                this.dealDate = '';
                this.queryaccountInfo();
            },
            handleSizeChange(val) {
                this.page_size = val;
                this.queryPage();
            },
            handleCurrentChange(val) {
                this.page_index = val;
                this.queryPage();
            },

            querySearch() {//选择（将选项value传给后端）
                let startTime =(this.dealDate[0] && format(new Date(this.dealDate[0]).getTime(), 'yyyyMMdd')) || ''
                let endTime = (this.dealDate[1] && format(new Date(this.dealDate[1]).getTime(), 'yyyyMMdd')) || ''
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getaccountDetails'].url,
                    method: 'post',
                    data: {
                        method: api['getaccountDetails'].method,
                        customer_id: _this.customerInfo.customer_id,
                        page_index:_this.page_index,
                        page_size:_this.page_size,
                        channel_type:_this.selChannel_name,
                        status:_this.selStatus,
                        start_date:startTime,
                        end_date:endTime,
                    }
                }
                this.query(params)
            },
            queryPage() {
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getaccountDetails'].url,
                    method: 'post',
                    data: {
                        method: api['getaccountDetails'].method,
                        customer_id: _this.customerInfo.customer_id,
                        page_index:_this.page_index,
                        page_size:_this.page_size,
                    }
                }
                this.query(params)
            },
            query(params) {
                fetch(params).then(res => {
                    this.endLoading()
                    this.tableData = res
                    this.allCount = Number((res[0] && res[0].total_count)) || this.allCount
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取账户信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
        },

        filters: {
            getAcChannelNameFilters(val){
                return getAcChannelName(val);
            }
        }
    }
</script>
<style type="text/scss" lang="scss" >
    @import "../../styles/mixin";
    @import "../../styles/common";

    .content{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: $dialog-height;

        .accountPagination{
            padding: 5px 20px;
        }
        .accountOption{
           height: 130px;
            margin: 0px 45px;
            .upperOption{
                margin: 15px auto;
            }
            .upperOpSelect{
                height: 40px;
            }

            .acResetBtn{
                border-color: #DCDFE6;
                background: #FFFFFF;
                color: #606266;
            }
        }
        .accuntList{
            height: calc(100% - 130px);
        }
        .account_card_balance{
            padding: 2px 10px 2px 0px;
        }
        .balanceStyle{
           // border:5px solid red;;
            color: #606266;
            padding: 7px ;
        }


    }


</style>
