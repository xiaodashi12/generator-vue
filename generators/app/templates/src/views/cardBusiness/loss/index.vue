<template>
    <div class="card-issue-container">
        <common @onClose="onClose" :showrason="true" ref="common"></common>
        <!--        <iframe v-if="showPdf" id='previewPdf' style="z-index: 100" :src="fileUrl" height="406px"-->
        <!--                width="100%">-->
        <!--        </iframe>-->
        <dlg-footer :btninfos="ftBtnArrays.cardLoss" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import DlgFooter from '../../../components/Dialog/DlgFooter';
    import {ftBtns, cmds} from "../../../utils/ftBtnConsts";
    import Common from '../common'
    import {mapGetters} from "vuex";

    export default {
        name: "Loss",
        components: {DlgFooter, Common},
        data() {
            return {
                ftBtnArrays: ftBtns,
                showPdf: false,
                opType:''
            }
        },
        computed: {
            ...mapGetters([
                'vehicleInfo'
            ])
        },
        methods: {
            onClose(){
                this.$emit('onClose',cmds.goBack)
            },
            ftClick(cmd) {
                switch (cmd) {
                    case cmds.unLoss:
                        if (this.vehicleInfo.cpu_status != 2) {
                            this.$msgbox({
                                message: '该卡处于非挂失状态，不能解挂',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                            return
                        }
                        break
                    case cmds.loss:
                        if (this.vehicleInfo.cpu_status != 1) {
                            this.$msgbox({
                                message: '该卡处于非正常状态，不能挂失',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                            return
                        }
                        break
                    case cmds.prtLoss:
                        if (this.vehicleInfo.cpu_status === '1') {
                            this.opType = '1'
                        } else if (this.vehicleInfo.cpu_status === '2') {
                            this.opType = '2'
                        } else {
                            this.$msgbox({
                                message: '该卡当前状态无法进行此操作',
                                title: '提示',
                                customClass: 'my_msgBox singelBtn',
                                confirmButtonText: '确定',
                                type: 'error'
                            })
                            return;
                        }
                        break

                }
                this.$refs.common.doBusiness(cmd,this.opType)
            },
            //子组件加载完成事件
            cardInfoLoaded: function () {

            }
        }
    }
</script>

<style scoped>

</style>