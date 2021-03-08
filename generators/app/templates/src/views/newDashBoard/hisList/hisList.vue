<template>
    <div class='ect-page'>
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;">
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">车牌号：</label>
                </el-col>
                <el-col :span="3">   
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.licensePlate"
                            @blur="handleEvent($event,1)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">银行卡号: </label>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.bankCardNumber"
                            @blur="handleEvent($event,2)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">签约人名称: </label>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                             v-model="userInfo.name"
                            @blur="handleEvent($event,3)"
                        />
                    </div>
                </el-col>
                <el-col :span="3" style="margin-left:10px;">
                    <el-select v-model="values" clearable  placeholder="签约渠道" @change="selectChange">
                        <el-option
                        v-for="item in optionsInfo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" style="margin-left:10px;">
                    <div class="grid-content bg-purple-light ect-input">
                        <el-button type="primary" icon="el-icon-search" @click="serachData()">搜索</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:60px;">
            <div>
                <el-table :data="tableData" stripe border style="width: 83%" :height="screenHeight">
                    <el-table-column prop="status" label="签约状态" width="100">
                        <template slot-scope="scope">
                             {{scope.row.status==0 ? "失效" : "正常"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="签约人名称" width="100">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号" width="150">
                    </el-table-column>
                    <el-table-column prop="bankCardNumber" label="银行卡号" width="250">
                    </el-table-column>
                    <el-table-column prop="channelName" label="签约渠道" width="150">
                    </el-table-column>
                    <el-table-column prop="licensePlate" label="车牌号" width="150" >
                    </el-table-column>
                    <el-table-column prop="licenseColor" label="车辆颜色" width="100">
                        <template slot-scope="scope">
                             {{plateColorToColorMap.get(scope.row.licenseColor+'')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="idType" label="证件类型" width="100" >
                    </el-table-column>
                    <el-table-column prop="identity" label="证件号" width="250">
                    </el-table-column>
                    <el-table-column prop="signStartTime" label="开始时间" width="200" >
                    </el-table-column>
                    <el-table-column prop="signEndTime" label="结束时间" width="200">
                    </el-table-column>
                    
                    <el-table-column fixed="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status==1" type="danger" size="small" icon="el-icon-circle-close" @click="removeData(scope.row)">解约</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50,100,200]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
import {plateColorToColorMap} from "@utils/dictionaries"
export default {
    data(){
        return{
            plateColorToColorMap,
            optionsInfo: [],
            values:'',
            screenHeight: 430,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            tableData: [],
            total:0,
            bankData:[],
            userInfo:{
                bankCardNumber:'',
                channelName:'',
                channelId:-1,
                idType:'',
                identity:'',
                licenseColor:'',
                licensePlate:'',
                name:'',
                phone:'',
                signEndTime:'',
                signStartTime:'',
                status:0
            }
            
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=520;
        }
        this.showDataList();
        this.showBankList();
    },
    methods: {
        removeData(row){
            this.$confirm('此操作将解约车辆，请慎用, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(() => {
                let params = {
                    url: api['cancleSign'].url,
                    method: 'post',
                    data: {
                        token: getToken(),
                        licenseColor: row.licenseColor,
                        licensePlate: row.licensePlate,
                    }
                }
                fetch(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '解约成功!'
                    });
                    this.showBankList();
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message:  error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });          
            });
        },
        selectChange(event){
            this.userInfo.channelId=event;
        },
        showBankList(){
            let params = {
                url: api['allChannel'].url,
                method: 'post',
                data: {
                    token:getToken()
                }
            }
             
            fetch(params).then(res => {
                console.log(res.data)
                res.data.forEach((item,idx) => {
                   let objBankInfo={};
                   objBankInfo['id']=item.id;
                   objBankInfo['name']=item.name;
                   this.optionsInfo.push(objBankInfo)
                });
            }).catch(error => {
                this.endLoading()
                this.$msgbox({
                    message:  error.message,
                    title: '失败',
                    customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    type: 'error'
                })
            })
        },
        handleSizeChange(val) {
            this.pageSized=val;
            this.showDataList();
            console.log(val);
        },
        handleCurrentChange(val) {
            this.pageIndexed=val;
            console.log(`当前页: ${val}`);
            this.showDataList();
        },
        handleEvent(event,idx){
            console.log(event)
            switch(idx){
                case 1:
                    this.userInfo.licensePlate=event.target.value
                    break;
                case 2:
                    this.userInfo.bankCardNumber=event.target.value
                    break;
                case 3:
                    this.userInfo.name=event.target.value
                    break;   
            }
        },
        handleClick(row) {
            console.log(row);
        },
        handlepwd(row){
            
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            let params = {
                url: api['findHisList'].url,
                method: 'post',
                data: {
                    channelId: this.userInfo.channelId,
                    bankCardNumber: this.userInfo.bankCardNumber,
                    idType: this.userInfo.idType,
                    identity: this.userInfo.identity,
                    bankCardNumber: this.userInfo.bankCardNumber,
                    licenseColor: this.userInfo.licenseColor,
                    licensePlate: this.userInfo.licensePlate,
                    name: this.userInfo.name,
                    phone: this.userInfo.phone,
                    pageIndex: this.pageIndexed,
                    pageSize: this.pageSized
                }
            }
            fetch(params).then(res => {

                this.tableData = res.data.data;
                this.total=res.data.total;
            }).catch(error => {
                this.endLoading()
                this.$msgbox({
                    message:  error.message,
                    title: '失败',
                    customClass: 'my_msgBox singelBtn',
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    type: 'error'
                })
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .etc-col{
        text-align: center;
    }
    .ect-page{
        height: 90%;
        position: absolute;
        width: 100%;
        overflow-y: scroll;
    }
    .ect-input{
        margin:10px 0;
    }
    .el-input__inner{
        padding:0px !important;
        margin:0px !important;
    }
    .el-pagination{
        margin-top:20px;
    }
</style>