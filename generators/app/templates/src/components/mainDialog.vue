<template>
    <el-dialog :before-close="onclose" class="my_main_dialog" :title="title" :close-on-click-modal="true"
               :visible.sync="dialogVisible">
            <div class="dialog_control">
                <slot name="child"></slot>
            </div>
    </el-dialog>
</template>
<script>
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import WsApi from "@/api/wsApi";


    export default {
        props: {
            title: {//标题
                type: String,
                default: ''
            },
            dialogVisible: {//标题
                type: Boolean,
                default: false
            },
            child: {//子元素
                type: String,
                default: ''
            }
        },
        name: "mainDiolag",
        components: {
        },
        data() {
            return {
            };
        },
        watch: {

        },
        created() {
        },
        mounted() {

        },
        methods: {
            onclose() {
                this.$emit('onClose',false)
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dialog_control{
    }
</style>
