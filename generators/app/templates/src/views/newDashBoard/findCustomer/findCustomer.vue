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
                            @blur="handleEvent($event)"
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
        <div style="margin-top:60px;" v-if='userInfo.clientId && userInfo.clientId!=""'>
            <div>
                <div style="margin:20px 30px;">
                    用户编号：{{userInfo.clientId}}
                </div>
                <el-table :data="tableData"  border>
                    <el-table-column prop="licensePlate" label="车牌号" width="200">
                    </el-table-column>
                    <el-table-column prop="licenseColor" label="车牌颜色" width="100">
                        <template slot-scope="scope">
                             {{plateColorToColorMap.get(scope.row.licenseColor+'')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button  v-if="scope.row.licenseColor==userInfo.licenseColor && scope.row.licensePlate==userInfo.licensePlate" type="danger" size="small" icon="el-icon-circle-close" @click="deleterChanel(scope.row)">删除车辆</el-button>
                    </template>
                    </el-table-column>
                </el-table>
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
import {plateColorToColorMap,colorOptionsInfo} from "@utils/dictionaries"
export default {
    data(){
        return{
            plateColorToColorMap,
            optionsInfo: colorOptionsInfo,
            values:'',
            screenHeight: document.body.clientHeight-180,
            areaValue:'',
            currentPage:1,
            pageSized:10,
            pageIndexed:1,
            tableData: [],
            total:0,
            bankData:'',
            userInfo:{
                clientId:'',
                licenseColor:'',
                licensePlate:'',
            }
            
        }
    },
    created(){
    },
    methods: {
        deleterChanel(row){
            this.$confirm('此操作将删除车辆, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(() => {
                let params = {
                    url: api['removeCustomer'].url,
                    method: 'post',
                    data: {
                        clientId: this.userInfo.clientId,
                        licenseColor: this.userInfo.licenseColor,
                        licensePlate: this.userInfo.licensePlate
                    }
                }
                fetch(params).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除车辆成功!'
                    });
                    this.showDataList();
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
        handleEvent(event){
             this.userInfo.licensePlate=event.target.value;
            console.log(event.target.value)
        },
        selectChange(event){
            console.log(event)
            this.userInfo.licenseColor=event;
        },
        serachData(){
            this.showDataList();
        },
        showDataList(){
            let params = {
                url: api['findCustomer'].url,
                method: 'post',
                data: {
                    licenseColor: this.userInfo.licenseColor,
                    licensePlate: this.userInfo.licensePlate,
                }
            }
            fetch(params).then(res => {
                this.userInfo.clientId=res.data.clientId;
                this.tableData=res.data.list;
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