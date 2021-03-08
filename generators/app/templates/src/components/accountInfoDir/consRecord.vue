<template>
    <div class="content">
        <el-table
                :data="tableData"
                height="400"
                style="width: 100%">
            <el-table-column
                    fixed
                    align="center"
                    prop="deal_date_time"
                    label="交易时间"
                    min-width="15%">
            </el-table-column>
            <el-table-column
                    fixed
                    align="center"
                    prop="card_counter"
                    label="卡计数器"
                    min-width="8%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_code"
                    label="车辆号码"
                    min-width="8%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_color_name"
                    label="车牌颜色"
                    min-width="8%">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="交易金额"
                    min-width="8%">
                <template slot-scope="scope">
                    <span>{{(scope.row.deal_money / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="交易前余额"
                    min-width="10%">
                <template slot-scope="scope">
                    <span>{{(scope.row.before_balance / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="交易后余额"
                    min-width="10%">
                <template slot-scope="scope">
                    <span>{{(scope.row.after_balance / 100 ).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="exit_province_name"
                    label="出口省份"
                    min-width="15%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="deal_remark"
                    label="交易描述"
                    min-width="20%">
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
</template>


<script>
    import { mapGetters } from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'

    export default {
        name: 'consRecord',
        props: {},
        data() {
            return {
                page_index:1,
                page_size: 10,
                allCount :0,
                tableData: []
            }
        },
        computed: {
            ...mapGetters([//获取store存储
                'vehicleInfo',
                'customerInfo',
            ]),
        },
        mounted() {
            fetch({
                url: api['getconsRecord'].url || '',
                method: 'post',
                data: {
                    method:api['getconsRecord'].method,
                    customer_id: this.customerInfo.customer_id || '',
                    cpu_card_id: this.vehicleInfo.cpu_card_id,
                    page_index: this.page_index,
                    page_size: this.page_size,
                }
            }).then((res)=>{
                console.log(res, '+++res++++');
                this.tableData = [...res];
                this.allCount = Number((res[0] && res[0].total_count)) || this.allCount
            }).catch((err)=>{
                console.log(err, '++++err+++');
            })
        },
        methods: {
            handleSizeChange(val) {
                this.page_size = val;
                this.queryPage();
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.page_index = val;
                this.queryPage();
                console.log(`当前页: ${val}`);
            },
            queryPage() {
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getconsRecord'].url,
                    method: 'post',
                    data: {
                        method: api['getconsRecord'].method,
                        customer_id: _this.customerInfo.customer_id,
                        cpu_card_id: _this.vehicleInfo.cpu_card_id,
                        page_index:_this.page_index,
                        page_size:_this.page_size,
                        // channel_type:_this.selChannel_name,
                        // status:_this.status,
                        // start_date:_this.start_date,
                        // end_date:this.end_date,
                    }
                }
                console.log(params.data);
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

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../styles/mixin";
    @import "../../styles/common";

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: $dialog-height;
    }
    .accountPagination{
        padding: 5px 10px;
    }

</style>