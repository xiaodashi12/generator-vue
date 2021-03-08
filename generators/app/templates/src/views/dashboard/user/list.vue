<template>
    <div class="userlist">
        <el-table
        align='center'
        :data="tableData"
        style="width: 100%"
        @row-click="handleOnRowClick">
        <el-table-column
        :key="index"
        :min-width="col['width']" 
        v-for="(col,index) in tableCol" 
        label="" 
        prop="">
            
            <template slot-scope="scope">
                    <span class="one" v-if="col.field == 'customer_type'">
                        {{scope.row.customer_type | getTypes}}
                    </span>
                    <span class="one" v-if="col.field == 'bank_type'">
                        {{scope.row.bank_code_name }}
                    </span>
                    
                    <div class="two" v-if="col.field == 'bank_info'">
                        <div class="lbone">{{scope.row.bank_account}}</div>
                        <div>
                            <span>签约日期:</span>
                            {{scope.row.contract_date}}
                        </div>

                    </div>
                    <div class="two" v-if="col.field == 'customer_info'">
                        <div class="lbone">{{scope.row.customer_name}}</div>
                        <div class="lbTwo">
                            <span>编号:</span>
                            {{scope.row.customer_id}}
                        </div>
                    </div>
                    
                    <div v-if="col.field == 'vehicle_info'">
                        <div>
                            <span>[ {{getColor(scope.row.vehicle_color)}} ]</span>
                            {{scope.row.vehicle_code}}
                        </div>
                        <div class="lbTwo">
                            <span>签约行:</span>
                            {{scope.row.bank_code | getCode}}
                        </div>
                        
                    </div>
                    <div class="two"  v-if="col.field == 'customer_time'">
                        <div class="lbTwo">
                            <span>联系电话:</span>
                            <span>{{scope.row.link_phone}}</span>
                        </div>
                        <div class="lbTwo">
                            <span>开户日期:</span>
                            <span>{{scope.row.open_date}}</span>
                        </div>
                    </div>
            </template>
        </el-table-column>
        </el-table>
        <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage1"
            :page-size="100"
            layout="total, prev, next"
            :total="1000">
        </el-pagination> -->
    </div>
</template>
<script>
    import { getCustomerType,getsignBankCode,getVehicleColor} from '@utils/dictionaries';
    export default {
        name:'EtcUserList',
        props:{
            type:{
                type:String,//[1-查询列表][2-搜索列表]
                default:''
            },
            tableData:{
                type:Array,
                default:() => {
                    return []
                }
            }
        },
        created(){
            
            if(this.type == 1){
                this.tableCol = [{
                    label:'用户类型',
                    field:'customer_type',
                    width:'35px'
                },{
                    label:'用户信息',
                    field:'customer_info',
                    width:'60px'
                },{
                    label:'用户时间',
                    field:'customer_time'
                }]
            }
            if(this.type == 2){
                this.tableCol = [{
                    label:'银行类别',
                    field:'bank_type',
                    width:'40px'
                },{
                    label:'银行信息',
                    field:'bank_info',
                    width:'110px'
                },{
                    label:'车牌信息',
                    field:'vehicle_info'
                }]
            }
        },
        watch:{
           type(val){
               if(val == 1){
                    this.tableCol = [{
                        label:'用户类型',
                        field:'customer_type',
                        width:'35px'
                    },{
                        label:'用户信息',
                        field:'customer_info'
                    },{
                        label:'用户时间',
                        field:'customer_time'
                    }]
                }
                if(val == 2){
                    this.tableCol = [{
                        label:'银行类别',
                        field:'bank_type',
                        width:'40px'
                    },{
                        label:'银行信息',
                        field:'bank_info',
                        width:'110px'
                    },{
                        label:'车牌信息',
                        field:'vehicle_info'
                    }]
                }
           }
        },
        data () {
            return {
                tableCol:[]
            }
        },
        methods:{
            handleOnRowClick(row, column, event){
                this.$emit('onRowClick',row.customer_id || '');
            },
            getName(type){
                
                let names = {
                    '1':'查询列表',
                    '2':'搜索列表'
                }
                return  names[type] || ''
            },
            getColor(val){
                let name = getVehicleColor(val);
                return name
            }
        },
        filters:{
            getTypes (val) {
                let name = getCustomerType(val);
                return name;
            },
            getCode (val) {
                let name = getsignBankCode(val);
                return name
            }
        }
    }
</script>
<style type="text/scss"  lang="scss">
@import "~styles/mixin";
.userlist{
    .el-table{
        margin: 0 auto;
    }
    .hd{
        display: flex;
        justify-content:space-between;
        border-bottom:1px solid #e3e5e8;
        h1{
            font-size:14px;
            font-weight:normal;
            height:41px;
            line-height:41px;
            span{
                display: inline-block;
                padding-left:10px;
            }
        }
        .el-icon-close{
            
            color:#666;
            text-align:left;
            margin-right:10px;
            cursor: pointer;
            padding:10px;
        }
    }
    .el-table{
        .el-table__header{
            display: none;
        }
        td{
            padding:5px 0;
        }
        .one{
            color: $second-color;
            font-size:20px;
        }
        .two{
            .lbone{
                color: #333333;
            }
            .lbTwo{
                color: #333333;
                font-size:12px;
                span{
                    font-size:10px;
                    color:#999999;
                }
            }
        }
    }
}
</style>