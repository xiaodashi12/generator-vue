<template>
    <div class="dlg-content">
        <div class="main_content">
            <div class="acceptance">
                <iframe v-if="showPdf" id='previewPdf' :src="fileUrl" height="99%"
                        width="100%">
                </iframe>
            </div>
            <dlg-footer :btninfos="ftBtnArrays.receipts" @ftClick="ftClick">
            </dlg-footer>
        </div>

        <el-dialog id="myDiolag" title="历史受理单" :close-on-click-modal="false" :visible.sync="dialogTableVisible" append-to-body width="368px" :lock-scroll="true" style="margin-top: 12vh;">
            <el-table :data="tableData" @row-click="openDetails" highlight-current-row height="371px"  style="padding:0px;width:368px;height:366px;border-bottom-right-radius: 6px;
            border-bottom-left-radius: 6px;" >
                <el-table-column prop="create_time" label="办理时间" width="123" >
                </el-table-column>
                <el-table-column prop="op_name" label="办理人" width="122">
                </el-table-column>
                <el-table-column prop="branch_name" label="办理网点" width="123">
                </el-table-column>
            </el-table>
        </el-dialog>
        <div>
            <ul class="showul" style="" v-show="checkul" id="box" >
                <li class="showli" @click="showReceipts('1')">新增</li>
                <hr class="hrLine">
                <li class="showli" @click="showReceipts('2')">变更</li>
            </ul>
        </div>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import { cmds, ftBtns } from "@/utils/ftBtnConsts";
    import fetch from '@/utils/fetch'
    import api from '@/api'
    import store from '@/store';
    import { mapGetters } from 'vuex';
    export default {
        name: "AcceptanceForm",
        components: {
            DlgFooter
        },
        props: {
            idx:{//当前步骤条
                type:Number,
                default:''
            }
        },
        data () {
            return {
                checkul:false,
                ftBtnArrays:ftBtns,
                showPdf:false,
                fileUrl:'',
                dialogTableVisible:false,
                tableData:[],
                receipts_id:"",
                //用户信息
                // customerInfo: {...store.getters.customerInfo},
                // //顶部车辆信息
                // vehicleInfo: {...store.getters.vehicleInfo},
            }
        },
        mounted(){},
        created(){

        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ])
        },
        methods: {
            openDetails(row){
                this.dialogTableVisible=false;
                this.fileUrl="";
                this.showPdf=false;
                this.download(row.receipts_id)

            },
            //底部按钮点击事件处理
            ftClick: function(cmd) {

                switch (cmd) {
                    //历史受理单
                    case cmds.historyReceipts:
                        this.dialogTableVisible=true;
                        this.historyReceipts();
                        break;
                    //生成受理单
                    case cmds.createReceipts:
                        this.checkul=!this.checkul;
                        break;
                    //上传受理单
                    case cmds.uploadReceipts:
                        if(this.fileUrl==""){
                            this.$message({
                                showClose: true,
                                message: '请生成受理单！',
                                type: 'warning'
                            });
                            return;
                        }
                        this.upReceipts();
                        break;
                    //打印
                    case cmds.prtReceipts:
                        if(this.fileUrl=="" || this.fileUrl==null){
                            this.$message({
                                showClose: true,
                                message: '暂无受理单可以被打印！',
                                type: 'warning'
                            });
                        }else{
                            document.getElementById("previewPdf").contentWindow.print();
                        }
                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        //如果可以，才调用上层事件处理
                        this.$emit("ftClick", cmd);
                        break;
                }
            },
            historyReceipts(){
                let params={
                    customer_id:this.customerInfo.customer_id || '',
                    vehicle_code:this.vehicleInfo.vehicle_code,
                    vehicle_color:this.vehicleInfo.vehicle_color,
                }
                params.biz_content = JSON.stringify(params.biz_content)
                new Promise((resolve, reject) => {
                    fetch({
                        url: api['hisRepeit'].url || '',
                        method: 'post',
                        data: {
                            method:api['hisRepeit'].method,...params
                        }
                    }).then((response)=> {
                        this.tableData=response;
                        console.log(response)
                    }).catch((err)=>{
                        reject(err)
                    })
                })
            },
            upReceipts(){
                let params={
                    customer_id:this.customerInfo.customer_id || '',
                    vehicle_code:this.vehicleInfo.vehicle_code,
                    vehicle_color:this.vehicleInfo.vehicle_color,
                }
                params.biz_content = JSON.stringify(params.biz_content);

                this.startLoading();
                new Promise((resolve, reject) => {
                    fetch({
                        url: api['upRepeit'].url || '',
                        method: 'post',
                        data: {
                            method:api['upRepeit'].method,...params
                        }
                    }).then((response)=>{

                        this.fileUrl="";
                        this.showPdf=false;
                        this.download(response.receipts_id).then(() => {
                            
                            this.endLoading();
                            this.$alert('操作成功', '提示', {
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: action => {}
                            });
                        });

                    }).catch((err)=>{
                        this.endLoading();
                        this.$alert(err.message, '提示', {
                            dangerouslyUseHTMLString: true,
                            showClose:false,
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    })
                })
            },
            download(receipts_id){
                // debugger
                let params={
                    customer_id:this.customerInfo.customer_id || '',
                    vehicle_code:this.vehicleInfo.vehicle_code,
                    vehicle_color:this.vehicleInfo.vehicle_color,
                    receipts_id:receipts_id
                }
                params.biz_content = JSON.stringify(params.biz_content)
              return  new Promise((resolve, reject) => {
                    fetch({
                        url: api['download'].url || '',
                        method: 'post',
                        data: {
                            method:api['download'].method,
                            ...params
                        },
                        responseType: 'blob'
                    }).then((response)=> {
                        var binaryData = [];
                        binaryData.push(response);

                        console.log(new Blob(binaryData, {type:"application/pdf"}));
                        let url=window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                        console.log(JSON.stringify(encodeURIComponent(url)), 'download');
                        this.showPdf=true;
                        this.fileUrl="./static/pdf/web/viewer.html?file="+encodeURIComponent(url) + '&myTime=' + new Date().getTime();

                        resolve()
                    }).catch((err)=>{
                        // debugger
                        this.$alert(err.message, '提示', {
                            dangerouslyUseHTMLString: true,
                            showClose:false,
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        reject(err)
                    })
                })
            },
            showReceipts(flag){
                let DEFAULT_URL = "";
                let params={
                    customer_id:this.customerInfo.customer_id || '',
                    vehicle_code:this.vehicleInfo.vehicle_code,
                    vehicle_color:this.vehicleInfo.vehicle_color,
                    receipts_type:flag
                }
                this.checkul=false;
                params.biz_content = JSON.stringify(params.biz_content)
                new Promise((resolve, reject) => {
                    fetch({
                        url: api['repeit'].url || '',
                        method: 'post',
                        data: {
                            method:api['repeit'].method,
                            ...params
                        },
                        responseType: 'blob'
                    }).then((response)=> {
                        var binaryData = [];
                        binaryData.push(response);
                        console.log(new Blob(binaryData, {type:"application/zip"}),  '------------------------+++');
                        console.log(binaryData,  '------------------------+++binaryData1111111111111111');
                        let url=window.URL.createObjectURL(new Blob(binaryData, {type:"application/pdf"}));
                        console.log(JSON.stringify(encodeURIComponent(url)), 'showReceipts');
                        this.showPdf=true;
                        this.fileUrl="./static/pdf/web/viewer.html?file="+encodeURIComponent(url) + '&myTime=' + new Date().getTime();
                    }).catch((err)=>{
                        reject(err)
                    })
                })

            },
        }
    };
</script>
<style lang="scss">
    @import "../../../styles/common";
    .showul{
        background-color:#fff;
        font-weight:600;
        color:#01C1B2;
        letter-spacing: 10px;
        position:absolute;
        margin-top:-112px;
        text-align: center;
        font-size: 16px;
        margin-left:25%;
        width:208px;
        border:1px solid #01C1B2;
        .hrLine{
            margin:0px;
            color:#01C1B2;
        }
        .showli{
            cursor: pointer;
            padding:5px 0px;
        }
    }
    .main_content{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .acceptance{
            height: $dialog-height;
            overflow-y: auto;
        }
    }
    .acceptance{
        iframe{
            border-width: 0px;
        }
        .el-table__body-wrapper::-webkit-scrollbar {/*滚动条整体样式*/
            width: 10px !important;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px !important;
        }
        .el-table__body-wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 10px !important;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2) !important;
            background: #B3B3B3 !important;
        }
        .el-table__body-wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2) !important;
            border-radius: 10px !important;
            background: #EDEDED !important;
        }
    }
    #myDiolag{
        .el-dialog {
            width: 368px !important;
            height: 406px;
            border-radius: 6px !important;
            .el-dialog__header{
                background-color:#3C4150;
                text-align: left;
                border-top-left-radius: 6px;
                border-top-right-radius:6px;
                height:35px !important;
                padding: 0px 10px !important;
                right:0px;
                .el-dialog__title{
                    line-height: 40px !important;
                    font-family: PingFangSC-Regular;
                    color: #01C1B2 !important;
                    letter-spacing: 0;
                    height: 40px;
                }
                .el-dialog__headerbtn{
                    font-size: 20px;
                    line-height: 40px;
                    top:0px !important;
                    right: 10px !important;
                    height:16px;
                }
            }
            .el-dialog__body{
                padding:0px !important;
                width:368px !important;
                .el-table{
                    thead,th{
                        background: #EBECF0 !important;
                        height: 39px !important;
                        font-size:12px !important;
                        padding:0px !important;
                    }
                    td{
                        padding: 4px 0px !important;
                    }
                    .el-table__row{
                        cursor: pointer;
                    }
                    .cell{
                        word-break: normal !important;
                        font-size:12px !important;
                        color:#333 !important;
                    }
                    .el-table  th>.cell{
                        font-size:12px !important;
                        color:#333 !important;
                    }
                }
            }
        }
    }

</style>

