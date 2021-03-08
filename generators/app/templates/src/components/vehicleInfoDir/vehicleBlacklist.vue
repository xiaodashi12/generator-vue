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
                    min-width="10%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="cpu_card_id"
                    label="cpu卡号"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="bank_card_no"
                    label="银行卡号"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="start_time"
                    label="开始时间"
                    min-width="20%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="end_time"
                    label="结束时间"
                    min-width="20%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="source"
                    label="信息来源"
                    min-width="15%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="reason"
                    label="入单原因"
                    min-width="15%">
            </el-table-column>
        </el-table>
    </div>
</template>


<script>
    import { mapGetters } from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'

    export default {
        name: 'vehicleBlacklist',
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
                url: api['getVehicleBlacklist'].url || '',
                method: 'post',
                data: {
                    method:api['getVehicleBlacklist'].method,
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
