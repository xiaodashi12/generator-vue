<template>
    <div class='ect-page'>
        <div style="margin:20px 30px;">
            <el-row style="display:flex;align-items:center;">
                <el-col :span="2" class="etc-col">
                    <label class="ect-input">redis key:</label>
                </el-col>
                <el-col :span="3">   
                    <div class="grid-content bg-purple-light">
                        <el-input
                            class="ect-input"
                            v-model="redisKey"
                            @blur="handleEvent($event)"
                        />
                    </div>
                </el-col>
                <el-col :span="3" style="margin:0 20px;"> 
                    <el-button type="primary" @click="showRedisData">一键获取redis数据</el-button>
                </el-col>  
            </el-row>
            
        </div>
        <div>
            {{bankData}}
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
            redisKey:'',
            plateColorToColorMap,
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
        handleEvent(event){
            this.redisKey=event.target.value;
        },
       showRedisData(){
           let params = {
            url: api['findRedis'].url,
            method: 'post',
            data: {
                token:getToken(),
                key:this.redisKey
            }
        }
        fetch(params).then(res => {
            console.log(res);
            this.bankData=res.data;
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