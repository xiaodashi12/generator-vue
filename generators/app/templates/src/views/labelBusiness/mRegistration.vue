<template>
    <div class="mRegistration">
        <etc-DlgTopStep :idx="idx" :stepTitles="stepTitles"></etc-DlgTopStep>
        <div v-if="idx == 0">
            <div class="card-issue-content">
            <div class="title">用户信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>用户姓名：</label>
                        <span class="rg">{{customerInfo.customer_name}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>用户编号：</label>
                        <span class="rg">{{customerInfo.customer_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>车牌号码：</label>
                        <span class="rg">{{vehicleInfo.vehicle_color ? '['+_getVehicleColors(vehicleInfo.vehicle_color)+']' : ''}}{{vehicleInfo.vehicle_code}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">标签信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>操作员：</label>
                        <span class="rg">{{obuInfos.update_op}}</span>
                    </el-col>
                    <el-col :span="6">
                        <label>操作网点：</label>
                        <span class="rg">{{obuInfos.update_branch}}</span>
                    </el-col>
                    <el-col :span="10">
                        <label>操作时间：</label>
                        <span class="rg">{{obuInfos.update_time}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>类别：</label>
                        <span class="rg">{{obuInfos.backup_type}}</span>
                    </el-col>
                    <el-col :span="6">
                        <label>OBU状态：</label>
                        <span class="rg">{{obuInfos.obu_status | _getObuStatus}}</span>
                    </el-col>
                    <el-col :span="10">
                        <label>销售网点：</label>
                        <span class="rg">{{obuInfos.sell_branch}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>安装状态：</label>
                        <span class="rg">{{obuInfos.setup_state | _getSetupState}}</span>
                    </el-col>
                    <!-- <el-col :span="6">
                        <label>安装时间：</label>
                        <span class="rg">{{obuInfos.setup_date }}</span>
                    </el-col> -->
                    <el-col :span="10">
                        <label>一次发行时间：</label>
                        <span class="rg">{{obuInfos.issue_time}}</span>
                    </el-col>
                </el-row>
            </div>
            <div class="title">维修登记</div>
            <div class="info">
                <el-form
                ref="dynamicForm"
                label-position="right" 
                :label-width="'75px'" 
                :model="formLabelAlign">
                <el-row :span="24">
                        <el-col 
                        :span="8"
                        v-for="(domain,index) in formDomains"
                        :key="index">
                            <dynamic-form-item
                            :key="domain.field+'-'+index"
                            :domain="domain"
                            @input="handleInput($event, domain.field)"
                            :value="formLabelAlign[domain.field]">
                            </dynamic-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <etc-DlgFooter :btninfos="ftBtnArrays" @ftClick="handleOnFtClick"></etc-DlgFooter>
        </div>
        
        <issue v-if="idx == 1" :idx="idx" :btninfos="btninfos"></issue>
    </div>
</template>
<script>
import EtcDlgTopStep from '@/components/Dialog/DlgTopStep';
import EtcDlgFooter from "@/components/Dialog/DlgFooter";
import { mapGetters } from 'vuex'
import api from '@/api'
import fetch from '@/utils/fetch'
import _minx from './minxs'
import dynamicFormItem from '@/components/dynamic-form/item'
import issue from './issue'
import {cmds} from "@/utils/ftBtnConsts";

export default {
    components:{EtcDlgTopStep,dynamicFormItem,EtcDlgFooter,issue},
    mixins:[ _minx ],
    data () {
        return {
            ftBtnArrays: [{
                text: "维修登记",
                cls: "green-btn",
                cmd: "mRegistration"
            }],
            btninfos:[{
                text: "读 标 签",
                cls: "green-btn",
                cmd: cmds.readObu
            },{
                text: "标签发行",
                cls: "blue-btn",
                cmd: cmds.obuIssue
            }],
            idx:0,
            stepTitles:[{
                title: "维修登记",
            },{
                    title: "新标签发行"
            }],
            formLabelAlign:{},
            formDomains:[]
            
        }
    },
    computed:{
        ...mapGetters([
            'customerInfo',
            'vehicleInfo'
        ])
    },
    created () {
        let params = {
            customer_id:this.customerInfo.customer_id,
            customer_name:this.customerInfo.customer_name,
            vehicle_color:this.vehicleInfo.vehicle_color,
            vehicle_code:this.vehicleInfo.vehicle_code,
            obu_id:this.vehicleInfo.obu_id
        }
        this.getObuInfo(params).then((res) => {
            this.obuInfos = res;
        },(error) => {
            this.$message({
                showClose: true,
                type: 'error',
                message: "请求异常：" + error.message,
            });
        })

        this.forFunc();
    },
    methods:{
        forFunc(){

            let arr = this.getFormDomains();
            let func = (idx) => {
                
                if(idx >= arr.length) {
                    
                    this.formDomains = arr;
                    console.log(this.formLabelAlign,"66666")
                    
                    return false;
                }

                const item = arr[idx];
                this.$set(this.formLabelAlign,item.field,item.defaultVal);

                func(idx + 1);

                
            }
            return func(0);

            
        },
        handleInput(val,key) {
            this.formLabelAlign = {...{ ...this.formLabelAlign, [key]: val }}
        },
        handleOnBtnClick(val,field){
            if(this.formLabelAlign.hasOwnProperty(field)){
                this.formLabelAlign[field] = val;
            }
        },
        getFormDomains(){
            let arr = [{
                name:'损坏情况',
                field:'artificial',
                fieldType:3,
                defaultVal:'1',
                event:{
                    onBtnClick:this.handleOnBtnClick
                },
                allVal:[{
                    value:'1',
                    name:'人为损坏'
                },{
                    value:'0',
                    name:'非人为损坏'
                }],
                rules:[{
                    required: true, message: '请填写注销原因', trigger: 'change'
                }],
                placeholder:''
            },{
                name:'故障类型',
                field:'cause',
                fieldType:1,
                defaultVal:'',
                allVal:[{
                    name:'--请选择--',
                    value:''
                },{
                    name:'标签脱落',
                    value:'0'
                },{
                    name:'标签故障',
                    value:'1'
                },{
                    name:'通行卡故障',
                    value:'2'
                },{
                    name:'其他',
                    value:'3'
                }],
                rules:[{
                    required: true, message: '请选择故障类型', trigger: 'change'
                }],
                placeholder:'请选择故障类型'
            },{
                name:'维修方式',
                field:'repair',
                fieldType:1,
                defaultVal:'1',
                allVal:[{
                    name:'--请选择--',
                    value:''
                },{
                    name:'当场维修',
                    value:'0'
                },{
                    name:'设备更换',
                    value:'1'
                }],
                rules:[{
                    required: true, message: '请选择维修方式', trigger: 'change'
                }],
                placeholder:'请选择维修方式'
            }]
            return arr;
        },
        getObuRepair(params){
            
            return  new Promise((resolve, reject) => {
                this.startLoading();
                fetch({
                    url: api['obuRepair'].url || '',
                    method: 'post',
                    data: {
                        method:api['obuRepair'].method,
                        ...params
                    }
                }).then((response)=> {
                    this.endLoading();
                    this.$msgbox({
                        title: '用户操作成功',
                        message: '用户操作成功',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                                resolve();
                            }
                        }
                    }).catch(() => {
                       reject()
                    });
                }).catch((err)=>{
                    
                    this.endLoading();
                    reject(err)
                })
            })
        },
        handleOnFtClick(cmd){
            
            if(cmd == 'mRegistration'){//维修登记
                this.$refs['dynamicForm'].validate(valid => {
                    if(valid){
                        let params={
                            customer_id:this.customerInfo.customer_id || '',
                            vehicle_code:this.vehicleInfo.vehicle_code,
                            vehicle_color:this.vehicleInfo.vehicle_color,
                            obu_id:this.vehicleInfo.obu_id,
                            ...this.formLabelAlign
                        }
                        this.getObuRepair(params).then(() => {
                            if(params.repair == 1){
                                this.idx = 1;
                            }else{
                                this.$emit('onClose')
                            }
                        },(error) => {
                            this.$msgbox({
                                message: error.message,
                                title: '失败',
                                customClass: 'my_msgBox singelBtn',
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                            
                        })
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
    @import "../../styles/common";
 .mRegistration{
     .card-issue-content {
         height: $dialog-height;
     }
     .el-button--small{
         padding:9px 7px;
     }
 }

</style>




