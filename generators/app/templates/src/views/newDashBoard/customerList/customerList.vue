<template>
    <div class='ect-page'>
        <div style="position:fixed;z-index:999;width:100%;background-color:#eee;">
            <el-row style="display:flex;align-items:center;">
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">苏通卡号：</label>
                </el-col>
                <el-col :span="3">   
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.cardid"
                            @blur="handleEvent($event,1)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">车牌号: </label>
                </el-col>
                <el-col :span="3">
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="userInfo.carlicense"
                            @blur="handleEvent($event,2)"
                        />
                    </div>
                </el-col>
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">车牌颜色: </label>
                </el-col>
                <el-col :span="3" style="margin-left:10px;">
                    <el-select v-model="values" clearable  placeholder="请选择" @change="selectChange">
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
                    <el-table-column prop="pubid" label="业务流水号" v-if="false">
                    </el-table-column>
                    <el-table-column prop="accountno" label="客户账号" width="250">
                    </el-table-column>
                    <el-table-column prop="cardid" label="卡号" width="200">
                    </el-table-column>
                    <el-table-column prop="carlicense" label="车牌号" width="150">
                    </el-table-column>
                    <el-table-column prop="licensecolor" label="车辆颜色" width="100">
                        <template slot-scope="scope">
                             {{plateColorToColorMap.get(scope.row.licensecolor+'')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="账户状态" width="100" >
                        <template slot-scope="scope">
                             {{plateAccountToStateMap.get(scope.row.status+'')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='1'" type="danger" size="small" icon="el-icon-error" @click="getLoseCard(scope.row)">挂失</el-button>
                        <el-button v-if="scope.row.status=='6'" type="primary" size="small" icon="el-icon-success" @click="getUnloseCard(scope.row)">解挂</el-button>
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
        <div>
            <el-dialog title="提示" :visible.sync="dialogFormVisible">
                <el-row style="display:flex;align-items:center;">
                    <el-col :span="6" class="etc-col">
                        <label class="ect-input">备注：</label>
                    </el-col>
                    <el-col :span="18">   
                        <div class="grid-content bg-purple-light">
                            <el-input v-model="messages" autocomplete="off" @blur="handleEvent($event,3)"></el-input>
                        </div>
                        <div v-if='beizhuData'>
                            <label style='color:red;'>备注不能为空</label>
                        </div>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="ensureData">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import api from '@/api'
import fetch from '@utils/fetch'
import {getToken} from '@/utils/auth';
import axios from 'axios'
import {mapGetters , mapActions} from "vuex";
import {plateColorToColorMap,plateAccountToTypeMap,plateAccountToStateMap,colorOptionsInfo} from "@utils/dictionaries"
export default {
    data(){
        return{
            beizhuData:false,
            rowData:{},
            messages:'',
            dialogFormVisible:false,
            formLabelWidth: '120px',
            plateColorToColorMap,
            plateAccountToTypeMap,
            plateAccountToStateMap,
            optionsInfo: colorOptionsInfo,
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
                accountno:'',
                cardid:'',
                cardnetwork:'',
                carlicense:'',
                licensecolor:-1,
                status:0,
            }
            
        }
    },
    created(){
        if(document.body.clientHeight>700){
            this.screenHeight=520;
        }
        this.showDataList();
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      }
    },
    methods: {
        ensureData(){
            if(this.messages==''){
                this.beizhuData=true;
                return;
            }
        },
        selectChange(event){
            this.userInfo.carcolor=event;
        },
        getUnloseCard(row){
            console.log(row);
        },
        getLoseCard(row){
            console.log(row)
            this.dialogFormVisible=true;
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
                    this.userInfo.obuid=event.target.value
                    break;
                case 2:
                    this.userInfo.carlicense=event.target.value
                    break;  
                case 3:
                    this.messages=event.target.value;
                    this.beizhuData=false;
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
                url: api['findCardPub'].url,
                method: 'post',
                data: {
                    cardId: this.userInfo.cardid,
                    licenseColor: this.userInfo.licensecolor,
                    licensePlate: this.userInfo.carlicense,
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