
<template>
    <div class="content">
        <div class="my_list_row">
            <div class="title">标签信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>OBU状态：</label>
                        <span class="rg">{{vehicleInfo.obu_status | _getObuStatus}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>发行日期：</label>
                        <span class="rg">{{obuInfos.open_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>失效日期：</label>
                        <span class="rg">{{obuInfos.end_date}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>操作时间：</label>
                        <span class="rg">{{obuInfos.update_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作网点：</label>
                        <span class="rg">{{obuInfos.update_branch}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作员：</label>
                        <span class="rg">{{obuInfos.update_op}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>类别：</label>
                        <span class="rg">{{obuInfos.backup_type }}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>所属网点：</label>
                        <span class="rg">{{obuInfos.sell_branch}}</span>
                    </el-col>
                </el-row>
            </div>

        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import {getObuStatus,getBackupType} from '../../../utils/dictionaries'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import fetch from '@/utils/fetch'
    import PhotoDialog from '@/components/PhotoDialog'
    import api from '@/api'
    import electronicArchives from '../../electronicArchives';

    export default {
        name: "vehicleObuInfo",
        props: {
            showBtn: {
                type: Boolean,
                default: false
            },
            showForce: {
                type: Boolean,
                default: false
            },
            active: {
                type: String,
                default: '0'
            },
            btnType: {
                type: String,
                default: 'vehicleCancellation'
            },
        },
        components: {
            DlgFooter,
            PhotoDialog,
            electronicArchives,
        },
        data() {
            return {
                method: '',
                url: '',
                obuInfos: {},
                ftBtnArrays: ftBtns,

            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
        },
        mounted() {
            this.queryObuInfo()
        },
        created () {

        },
        methods: {
            // getObuInfo(params){
            //
            //     return new Promise((resolve, reject) => {
            //
            //         fetch({
            //             url: api['getObuInfo'].url || '',
            //             method: 'post',
            //             data: {
            //                 method:api['getObuInfo'].method,
            //                 ...params
            //             }
            //         }).then(res => {
            //             resolve(res)
            //         }).catch(error => {
            //             reject(error)
            //         })
            //     })
            // }
            queryObuInfo() {
                this.startLoading()
                let params = {
                    url: api['getObuInfo'].url,
                    method: 'post',
                    data: {
                        method: api['getObuInfo'].method,
                        customer_id: this.customerInfo.customer_id,
                        customer_name: this.customerInfo.customer_name,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                        obu_id: this.vehicleInfo.obu_id,
                    }
                }
                fetch(params).then(res => {
                    this.endLoading()
                    this.obuInfos = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取标签信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
        },
        filters: {
            _getObuStatus(val) {
                return getObuStatus(val);
            },
            _getBackupType(val){
                return getBackupType(val);
            },
        }
    }
</script>

<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";
    @import "../../../styles/common";

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: $dialog-height;

        .my_list_row {
            height: $dialog-height;
            overflow-y: auto;
        }

        .upLoadPicture {
            display: flex;
            flex-direction: row;
            align-items: center;

            .upLoadPictureItem {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 5px;

                .btnBox {
                    min-width: 80px;
                    padding: 3px 8px;
                    border: 1px solid #e5e5e5;
                    font-size: 12px;
                    text-align: center;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .complete {
                    color: $second-color;
                    border-color: $second-color;
                }
            }

            .previewPicture {
                margin-bottom: 15px;
                position: relative;
                width: 128px;
                height: 100px;

                .file-remove {
                    z-index: 1;
                    position: absolute;
                    right: 4px;
                    display: none;
                    top: 4px;
                    width: 22px;
                    height: 22px;
                    font-size: 21px;
                    text-align: center;
                    vertical-align: middle;
                    color: white;
                    cursor: pointer;
                    line-height: 20px;
                    border-radius: 100%;
                    transform: rotate(45deg);
                    background: rgba(0, 0, 0, 0.5);
                }

                &:hover .file-remove {
                    display: inline;
                }

                .previewPictureModel {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }

                .previewPictureClose {
                    /*background-image: ;*/
                }

                .previewPictureDiv {
                    width: 128px;
                    height: 100px;
                    border: 1px dashed #e5e5e5;
                }

                img {
                    width: 128px;
                    height: 100px;
                }
            }
        }

        .forceVehicle {
            .el-textarea {
                width: 70%;
            }
        }

    }

</style>