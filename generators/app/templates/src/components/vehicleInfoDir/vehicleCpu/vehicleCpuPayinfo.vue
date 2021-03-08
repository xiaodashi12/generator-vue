<template>
    <div class="content">
        <table>
            <tr>
                <td style="text-align:center ">
        <div class="block">
            <span class="demonstration">请选择通行日期：</span>
            <el-date-picker
                    v-model="dealDate"
                    size="medium"
                    :clearable="false"
                    unlink-panels
                    type="daterange"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="—"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div></td>
                <td>
        <div class="upperBtn" style="text-align: left;padding-right: 20%" >
            <el-button type="primary" size="medium" style="width: 100px" @click="querySearch">搜 索</el-button>
        </div></td></tr></table>
        <el-table
                :data="tableData"
                height="350"
                style="width: 100%">
            <el-table-column
                    fixed
                    align="center"
                    prop="pay_time"
                    label="通行时间"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="customer_name"
                    label="用户名称"
                    min-width="10%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_code"
                    label="车辆号码"
                    min-width="15%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="cpu_card_id"
                    label="ETC通行卡号"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="pay_way"
                    label="付费方式"
                    min-width="10%">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="通行金额"
                    min-width="10%">
                <template slot-scope="scope">
                    <span>{{(scope.row.pay_toll / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="通行费"
                    min-width="8%">
                <template slot-scope="scope">
                    <span>{{(scope.row.pay_fare / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="代收费"
                    min-width="8%">
                <template slot-scope="scope">
                    <span>{{(scope.row.pay_agency / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="en_station"
                    label="入口站点"
                    min-width="10%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="ex_station"
                    label="出口站点"
                    min-width="10%">
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
    import { mapGetters } from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'
    import {format} from '@/utils/utils'

    export default {
        name: 'vehicleCpuPayinfo',
        props: {},
        data() {
            return {
                tableData: [],
                dealDate: [],
                pay_start_date:'',
                pay_end_date:'',
            }
        },
        computed: {
            ...mapGetters([//获取store存储
                'vehicleInfo',
                'customerInfo',
            ]),
        },
        mounted() {
            let startTime =(this.dealDate[0] && format(new Date(this.dealDate[0]).getTime(), 'yyyyMMdd')) || format((new Date()).getTime(),'yyyyMMdd');
            let endTime = (this.dealDate[1] && format(new Date(this.dealDate[1]).getTime(), 'yyyyMMdd')) || format((new Date()).getTime(),'yyyyMMdd');
            this.startLoading()
            let _this = this;
            let params = {
                url: api['getCardPayinfo'].url,
                method: 'post',
                data: {
                    method: api['getCardPayinfo'].method,
                    cpu_card_id:_this.vehicleInfo.cpu_card_id,
                    pay_start_date:startTime,
                    pay_end_date:endTime,
                }
            }
            fetch(params).then(res => {
                this.endLoading()
                this.tableData = res
                // this.$msgbox({
                //     message: '当前显示今日流水，请选择所需通行流水日期。',
                //     title: '提示',
                //     customClass: 'my_msgBox singelBtn',
                //     confirmButtonText: '确定',
                //     type: 'info'
                // })
                this.$message({
                    showClose: true,
                    message: '当前显示今日流水，请选择所需通行流水日期',
                    type:'warning'
                });
            }).catch(error => {
                this.endLoading()
                this.$msgbox({
                    message: '读取卡片流水信息失败:' + error.message,
                    title: '失败',
                    customClass: 'my_msgBox singelBtn',
                    confirmButtonText: '确定',
                    type: 'error'
                })
            })
        },

        methods: {
            querySearch() {//选择（将选项value传给后端）
                let startTime =(this.dealDate[0] && format(new Date(this.dealDate[0]).getTime(), 'yyyyMMdd')) || format((new Date()).getTime(),'yyyyMMdd');
                let endTime = (this.dealDate[1] && format(new Date(this.dealDate[1]).getTime(), 'yyyyMMdd')) || format((new Date()).getTime(),'yyyyMMdd');
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getCardPayinfo'].url,
                    method: 'post',
                    data: {
                        method: api['getCardPayinfo'].method,
                        cpu_card_id:_this.vehicleInfo.cpu_card_id,
                        pay_start_date:startTime,
                        pay_end_date:endTime,
                    }
                }
                this.query(params)
            },
            query(params) {
                fetch(params).then(res => {
                    this.endLoading()
                    this.tableData = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取卡片流水信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },

        },
        filters: {

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";
    @import "../../../styles/common";

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: $dialog-height;
    }

</style>

