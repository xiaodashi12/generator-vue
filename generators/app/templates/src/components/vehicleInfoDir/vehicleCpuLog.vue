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
                    label="用户编号"
                    width="100">
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
                    label="操作网点"
                    width="170">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_name"
                    label="操作员"
                    width="100">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="cpu_card_id"
                    label="cpu卡号"
                    width="200">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="civil_servant_id"
                    label="公务卡ID"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="civil_servant_start_date"
                    label="公务卡起始时间"
                    width="150">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="civil_servant_end_date"
                    label="公务卡结束时间"
                    width="150">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'

    export default {
        name: 'vehicleCpuLog',
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
                url: api['getVehicleCpuLog'].url || '',
                method: 'post',
                data: {
                    method:api['getVehicleCpuLog'].method,
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
        methods: {},
        filters: {
            getCardTypeFilter(val) {
                return getCardType(val);
            },

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

</style>
