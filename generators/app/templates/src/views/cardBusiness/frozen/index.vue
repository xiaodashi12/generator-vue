<template>
    <div class="card-issue-container">
        <common @onClose="onClose"  :showrason="true" ref="common"></common>
        <dlg-footer :btninfos="ftBtnArrays.cardFrozen" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import DlgFooter from '../../../components/Dialog/DlgFooter';
    import {ftBtns, cmds} from "../../../utils/ftBtnConsts";
    import Common from '../common'
    import {mapGetters} from "vuex";

    export default {
        name: "Frozen",
        components: {DlgFooter, Common},
        data() {
            return {
                ftBtnArrays: ftBtns,
                opType: ''
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
                    case cmds.frozen:
                        if (this.vehicleInfo.cpu_status != 1) {
                            this.$msgbox({
                                message: '该卡处于非正常状态，不能冻结',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                            return
                        }
                        break
                    case cmds.unFrozen:
                        if (this.vehicleInfo.cpu_status != 5) {
                            this.$msgbox({
                                message: '该卡处于非冻结状态，不能解冻',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                            return
                        }
                        break
                    case cmds.prtFrozen:
                        if (this.vehicleInfo.cpu_status === '1') {
                            this.opType = '3'
                        } else if (this.vehicleInfo.cpu_status === '5') {
                            this.opType = '4'
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
            }
        }
    }
</script>

<style scoped>

</style>