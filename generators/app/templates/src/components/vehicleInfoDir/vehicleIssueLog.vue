<template>
    <div class="content">
        <el-table
                :data="tableData"
                height="350"
                style="width: 100%">
            <el-table-column
                    fixed
                    align="center"
                    prop="customer_name"
                    label="用户姓名"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="customer_id"
                    label="用户编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="operation"
                    label="状态"
                    width="50">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_time"
                    label="操作时间"
                    width="170">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_branch"
                    label="操作网点名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_name"
                    label="操作员"
                    width="100">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="车型"
                    width="100">
                <template>
                    <div class="userInfo_value">{{ vehicleInfo.vehicle_class === '7' ? ' 集卡车' : (vehicleClass)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="车辆用户类型"
                    width="120">
                 <template>
                     <div class="userInfo_value">{{vehicleInfo.vehicle_user_type | getVehicleUserTypeFilter}}</div>
                 </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_seat"
                    label="座位数">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_ton"
                    label="载重">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_engine"
                    label="发动机号"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_specificInfo"
                    label="车辆特征描述"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="vehicle_distinguish"
                    label="车辆识别代码"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="ETC通行卡功能"
                    width="150">
                <template>
                    <div class="userInfo_value">{{vehicleInfo.card_type | getCardTypeFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="通行卡颜色"
                    width="150">
                <template>
                    <div class="userInfo_value">{{vehicleInfo.only_cpu_card | getCardColorFilter}}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
    import {mapGetters} from 'vuex'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import {getCustomerType, getVehicleType, getVehicleUserType, getCardType  ,getCardColor ,getVehicleClassType} from '../../utils/dictionaries'
    import fetch from '@/utils/fetch'
    import api from '@/api'

    export default {
        name: 'vehicleIssueLog',
        props: {},
        data() {
            return {
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
                url: api['getVehicleIssueLog'].url || '',
                method: 'post',
                data: {
                    method:api['getVehicleIssueLog'].method,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                }
            }).then((res)=>{
                console.log(res, '+++res++++');
                this.tableData = [...res];
            }).catch((err)=>{
                console.log(err, '++++err+++');
            })
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            vehicleClass: function () {
                return getVehicleClassType(this.vehicleInfo.vehicle_class) + '[' + getVehicleType(this.vehicleInfo.vehicle_type) + ']'
            },
        },
        methods: {},
        filters: {
            getCustomerTypeFilter(val) {
                return getCustomerType(val);
            },
            getVehicleTypeFilter(val) {
                return '[' + getVehicleType(val) + ']';
            },
            getVehicleUserTypeFilter(val) {
                return  getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },
            getCardColorFilter(val) {
                return getCardColor(val);
            },
            getVehicleClassTypeFilter(val) {
                return getVehicleClassType(val);
            },

        },
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
</style>