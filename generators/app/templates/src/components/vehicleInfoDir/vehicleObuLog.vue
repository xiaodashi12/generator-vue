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
                    prop="customer_id"
                    min-width="10%"
                    label="用户编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="operation"
                    label="状态"
                    min-width="8%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="obu_id"
                    label="obu编号"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_time"
                    label="操作时间"
                    min-width="18%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_branch"
                    label="操作网点名称"
                    min-width="25%">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="op_name"
                    label="操作员"
                    min-width="10%">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'

    export default {
        name: 'vehicleObuLog',
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
                url: api['getVehicleObuLog'].url || '',
                method: 'post',
                data: {
                    method:api['getVehicleObuLog'].method,
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
