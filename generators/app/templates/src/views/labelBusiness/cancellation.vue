<template>
    <div class="labelCancellation">
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
            <div class="title">注销信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="12">
                        <dynamic-form
                        ref="dynamicForm"
                        :labelWidth="'78px'"
                        :formDomains="formDomains"
                        :formLabelAlign="formLabelAlign"
                        @input="handleInput">
                        </dynamic-form>
                    </el-col>
                </el-row>
            </div>
         </div>
        <dlg-footer :btninfos="ftBtnArrays.labelCancellation" @ftClick="handleOnFtClick"></dlg-footer>
        <iframe v-show="false" id='cancellationPreviewPdf' :src="fileUrl" height="406px"
                width="100%">
        </iframe>
    </div>
</template>
<script>

import DlgFooter from "@/components/Dialog/DlgFooter";
import api from '@/api'
import fetch from '@/utils/fetch'
import {ftBtns} from "@/utils/ftBtnConsts";
import dynamicForm from '@/components/dynamic-form/form'
import _minx from './minxs'


export default {
    name:'etcLabelCancellation',
    components: { DlgFooter,dynamicForm },
    mixins:[ _minx ],
    data () {
        return {
            formLabelAlign:{},
            formDomains:[],
            ftBtnArrays: ftBtns,
            fileUrl:''
        }
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

        this.forFunc()
    },
    methods:{
        
        getSpecialPrint(params){
            
            this.startLoading();

           return  new Promise((resolve, reject) => {
                this.startLoading();
                fetch({
                    url: api['specialPrint'].url || '',
                    method: 'post',
                    data: {
                        method:api['specialPrint'].method,
                        ...params
                    },
                    responseType: 'blob'
                }).then((response)=> {
                    
                    resolve(response);
                }).catch((err)=>{
                    
                    this.endLoading();
                    reject(err)
                })
            })
        },
        getObuCancle(params){

         return new Promise((resolve, reject) => {
                this.startLoading();
                fetch({
                    url: api['obuCancle'].url || '',
                    method: 'post',
                    data: {
                        method:api['obuCancle'].method,
                        ...params
                    },
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
        forFunc(){

            let arr = this.getFormDomains();;
            let func = (idx) => {
            
              if(idx >= arr.length) {
                
                this.formDomains = arr;
                return false;
              }

              const item = arr[idx];
              this.$set(this.formLabelAlign,item.field,item.defaultVal);

              func(idx + 1);
            }
            return func(0);

         
        },
        getFormDomains(){
            let arr = [{
                name:'注销原因',
                field:'reason',
                fieldType:4,
                type:'textarea',
                defaultVal:'',
                rules:[{
                    required: true, message: '请填写注销原因', trigger: 'blur'
                }],
                placeholder:'请填写注销原因'
            }]
            return arr;
        },
        handleInput(val){
            this.formLabelAlign = {...val}
            console.log(this.formLabelAlign,"this.formLabelAlign")
        },
        handleOnFtClick (cmd) {
            
            this.$refs['dynamicForm'].$children[0].validate(valid => {
                if (valid) {
                        let params={
                            customer_id:this.customerInfo.customer_id || '',
                            vehicle_code:this.vehicleInfo.vehicle_code,
                            vehicle_color:this.vehicleInfo.vehicle_color,
                            obu_id:this.vehicleInfo.obu_id,
                            reason:this.formLabelAlign.reason,
                            operation:7
                        }
                        if(cmd == 'labelPrint'){//打印
                        
                            this.fileUrl = "";
                            params = {
                                ...params,
                                customer_name:this.customerInfo.customer_name,
                                link_mobile:this.customerInfo.link_mobile,
                                link_address:this.customerInfo.link_address
                            }
                            this.getSpecialPrint(params).then((response) => {
                                
                                var binaryData = [];
                                binaryData.push(response);

                                this.fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                                document.getElementById('cancellationPreviewPdf').onload = () => {//等待iframe加载完成后再执行doPrint.每次iframe设置src之后都会重新执行这部分代码。
                                    if(this.fileUrl){
                                        this.endLoading();
                                        document.getElementById('cancellationPreviewPdf').contentWindow.print();
                                    }
                                    
                                };
                                
                            },(err) => {

                            });
                        }

                        if(cmd == 'labelCancellation'){//标签注销
                            this.$confirm('是否确定要注销该标签?', '提示', {
                                showClose:false,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {
                                    this.getObuCancle(params).then((res) => {
                                        let obj = {
                                            vehicle_code:this.vehicleInfo.vehicle_code,
                                            vehicle_color:this.vehicleInfo.vehicle_color,
                                        }
                                        this.setPublicInfo(obj)
                                        this.$emit('onClose');
                                    },(error) => {

                                    })
                                }).catch(() => {});
                            
                        }
                }
            })
            
        }
    }
}
</script>
<style lang="scss">
    @import "../../styles/common";
    .labelCancellation{
        .card-issue-content{
            height: $dialog-height;
        }
    }
</style>


