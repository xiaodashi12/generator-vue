<template>
    <div class="card-issue-container">
        <common @onClose="onClose" :showrason="false" ref="common"></common>
        <dlg-footer :btninfos="ftBtnArrays.cardUnlock" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import DlgFooter from '../../../components/Dialog/DlgFooter';
    import {ftBtns, cmds} from "../../../utils/ftBtnConsts";
    import Common from '../common'
    import WsApi from '../../../api/wsApi'

    export default {
        name: "Unlock",
        components: {DlgFooter, Common},
        data() {
            return {
                ftBtnArrays: ftBtns,
                unlockReq: {
                    customer_id: this.$store.getters.customerInfo.customer_id,
                    vehicle_code: this.$store.getters.vehicleInfo.vehicle_code,
                    vehicle_color: this.$store.getters.vehicleInfo.vehicle_color,
                    cpu_card_id: this.$store.getters.vehicleInfo.cpu_card_id
                }
            }
        },
        methods: {
            onClose(){
                this.$emit('onClose',cmds.goBack)
            },
            ftClick(cmd) {
                switch (cmd) {

                    default:
                        if (this.unlockReq.cpu_card_id) {
                            this.startLoading()
                            WsApi.cpuUnlock(this.unlockReq, this.onMsg, this.onErr)
                        } else {
                            this.$msgbox({
                                message: '当前车辆未绑定卡片',
                                title: '提示',
                                type: 'warning',
                                customClass: 'my_msgBox singelBtn',
                            })
                        }
                        break;
                }

            },
            onMsg(msg) {
                this.endLoading()
                let rspData = JSON.parse(msg.data);
                if (rspData.return_code === '0') {
                    this.$msgbox({
                        message: '卡解锁成功',
                        title: '成功',
                        type: 'success',
                        customClass: 'my_msgBox singelBtn',
                    })
                } else {
                    this.$msgbox({
                        message: '卡解锁失败：' + rspData.return_msg,
                        title: '失败',
                        type: 'error',
                        dangerouslyUseHTMLString:true,
                        customClass: 'my_msgBox singelBtn',
                    })
                }
            },
            onErr (err) {
                this.endLoading()
                this.$msgbox({
                    message: err.message,
                    title: '失败',
                    dangerouslyUseHTMLString:true,
                    type: 'error',
                    customClass: 'my_msgBox singelBtn',
                })
            }
        }
    }
</script>

<style scoped>

</style>