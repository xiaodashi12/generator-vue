<template>
    <div class="content">
        <div>
            <table class="balanceStyle" style="color: #909399" >
                <tr>
                    <th class="balance_table_cell"><div class="my_list_row  account_card_balance">
                        <div class="title">卡账户余额：</div>
                    </div>
                    </th>
                    <th > <div class="balance_table_cell">{{(cardbalanceInfo.card_money /100).toFixed(2)}}</div></th>
                    <th class="balance_table_cell"><div class="my_list_row  account_card_balance">
                        <div class="title">预存余额：</div>
                    </div>
                    </th>
                    <th > <div class="balance_table_cell" >{{(cardbalanceInfo.card_premoney /100).toFixed(2)}}</div></th>
                </tr>
            </table>
            <hr style="border:none;border-top:1px solid #DCDFE6;"/>
        </div>
        <el-table
                :data="tableData"
                height="380"
                style="width: 100%">
            <el-table-column
                    fixed
                    align="center"
                    prop="deal_date_time"
                    label="交易时间"
                    width="170">
            </el-table-column>
            <el-table-column
                    fixed
                    align="center"
                    prop="serial"
                    label="流水号"
                    width="90">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_code"
                    label="车辆号码"
                    width="90">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_color_name"
                    label="车牌颜色"
                    width="100">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="cpu卡号"
                    width="180">
                <template>
                    <div class="userInfo_value">{{vehicleInfo.cpu_card_id }}</div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="交易金额"
                    width="80">
                    <template slot-scope="scope">
                        <span>{{(scope.row.deal_money / 100 ).toFixed(2)}}</span>
                    </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="status_name"
                    label="业务类型"
                    width="100">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="channel_name"
                    label="交易渠道">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="load_state"
                    label="圈存状态"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="load_num"
                    label="圈存受理号"
                    width="250">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="send_status"
                    label="是否上传部里"
                    width="120">
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
                        :total="allCount">
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
        name: 'cardDetails',
        props: {},
        data() {
            return {
                cardbalanceInfo:'',
                page_index:1,
                page_size: 10,
                allCount :0,
                tableData: []
            }
        },
        computed: {
            ...mapGetters([
                'vehicleInfo'
            ]),
        },
        mounted() {
            fetch({
                url: api['getcardDetails'].url || '',
                method: 'post',
                data: {
                    method:api['getcardDetails'].method,
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
            });
            this.querycardbalance();
        },
        methods: {
            queryPage() {
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getcardDetails'].url,
                    method: 'post',
                    data: {
                        method: api['getcardDetails'].method,
                        customer_id: _this.customerInfo.customer_id,
                        cpu_card_id: _this.vehicleInfo.cpu_card_id,
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
            querycardbalance() {//获取卡余额
                this.startLoading()
                let _this = this;
                let params = {
                    url: api['getcardBalance'].url,
                    method: 'post',
                    data: {
                        method: api['getcardBalance'].method,
                        cpu_card_id: _this.vehicleInfo.cpu_card_id,
                    }
                };
                fetch(params).then(res => {
                    this.endLoading()
                    this.cardbalanceInfo = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取卡余额失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            handleSizeChange(val) {
                this.page_size = val;
                this.queryPage();
            },
            handleCurrentChange(val) {
                this.page_index = val;
                this.queryPage();
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
    .balanceStyle{
        width: 50%;
       //  border:5px solid red;
        color: #606266;
        padding: 7px ;
    }
    .account_card_balance{
        float: left;
       // border:5px solid blue;
        padding: 2px 10px 2px 0px;
    }
    .balance_table_cell{
        width: 25%;
    }
    .account_card_money{
      //  border:5px solid green;
        float: left;
    }
</style>