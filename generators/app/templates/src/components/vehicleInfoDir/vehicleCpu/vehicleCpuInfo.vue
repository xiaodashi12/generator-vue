
<template>
    <div class="content">
        <div class="my_list_row">
            <div class="title">卡片信息</div>
            <div class="info">
                <el-row :span="24">
                    <el-col :span="8">
                        <label>ETC通行卡功能：</label>
                        <span class="rg">{{cardInfo.card_type | getCardTypeFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>CPU卡状态：</label>
                        <span class="rg">{{cardInfo.cpu_status | getCpuStatusFilter}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>通行卡颜色：</label>
                        <span class="rg">{{cardInfo.only_cpu_card | getCardColorFilter}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>发行时间：</label>
                        <span class="rg">{{cardInfo.open_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>失效日期：</label>
                        <span class="rg">{{cardInfo.end_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>所属网点：</label>
                        <span class="rg">{{cardInfo.sell_branch}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>操作时间：</label>
                        <span class="rg">{{cardInfo.update_time}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作网点：</label>
                        <span class="rg">{{cardInfo.update_branch}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>操作员：</label>
                        <span class="rg">{{cardInfo.update_op}}</span>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="8">
                        <label>公务卡ID：</label>
                        <span class="rg">{{cardInfo.civil_servant_id}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>公务卡起始时间：</label>
                        <span class="rg">{{cardInfo.civil_servant_start_date}}</span>
                    </el-col>
                    <el-col :span="8">
                        <label>公务卡结束时间：</label>
                        <span class="rg">{{cardInfo.civil_servant_end_date}}</span>
                    </el-col>
                </el-row>
            </div>

        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import {getCustomerType, getVehicleType, getVehicleUserType, getCardType,getCpuStatus,getCardColor} from '../../../utils/dictionaries'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import fetch from '@/utils/fetch'
    import PhotoDialog from '@/components/PhotoDialog'
    import api from '@/api'
    import electronicArchives from '../../electronicArchives';

    export default {
        name: "vehicleCpuInfo",
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
                cardInfo: {},
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
            this.queryCardInfo()
        },
        methods: {
            queryCardInfo() {
                this.startLoading()
                let params = {
                    url: api['cardInfo'].url,
                    method: 'post',
                    data: {
                        method: api['cardInfo'].method,
                        customer_id: this.customerInfo.customer_id,
                        customer_name: this.customerInfo.customer_name,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        vehicle_code: this.vehicleInfo.vehicle_code,
                        cpu_card_id: this.vehicleInfo.cpu_card_id
                    }
                }
                fetch(params).then(res => {
                    this.endLoading()
                    this.cardInfo = res
                }).catch(error => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取卡信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
        },
        filters: {
            getCustomerTypeFilter(val) {
                return getCustomerType(val);
            },
            getVehicleTypeFilter(val) {
                return getVehicleType(val);
            },
            getVehicleUserTypeFilter(val) {
                return getVehicleUserType(val);
            },
            getCardTypeFilter(val) {
                return getCardType(val);
            },
            getCpuStatusFilter(val) {
                return getCpuStatus(val);
            },
            getCardColorFilter(val) {
                return getCardColor(val);
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