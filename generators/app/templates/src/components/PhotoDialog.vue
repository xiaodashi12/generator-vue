<template>
    <div class="PhotoDialog">
        <el-dialog title="电子档案采集"
                   custom-class="etcDalog"
                   width="850px"
                   class="my_photoDialog"
                   height="540px"
                   :modal="false"
                   :lock-scroll="true"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :visible.sync="transfer.visible">
            <div class="my_title" slot="title">
                <div>电子档案采集</div>
                <div class="cancel_img" @click="closePhotoDialog"></div>
            </div>
            <el-form label-position="right" class="my_photoForm" label-width="100px" :model="dialogParam"
                     ref="dialogForm">
                <el-row :gutter="20">
                    <el-col :span="13" style="padding-left: 50px; padding-right: 10px;">
                        <el-form-item label="摄像头列表" prop="name">
                            <el-select size="small" v-model="dialogParam.camera_index" filterable
                                       placeholder="请选择">
                                <el-option v-for="(item,index)  in cameraCounts.camera_names" :key="item" :label="item"
                                           :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button @click="handleOnCameraOpen">打开摄像头</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <div class="main_picture">
                <div class="picture_Canvas">
                    <img v-if="imgBase64" id="picPreview" :src="imgBase64" width="695" height="400">
                </div>
                <div class="picture_Btn">
                    <img :src="require('@assets/photograph.png')" style="margin:8.1px;width: 60px;"
                         @click="handleOnPhotograph"/>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import WsApi from "@/api/wsApi";
    import WsConsts from "@/utils/wsConsts";

    export default {
        props: {
            transfer: Object
        },
        data() {
            return {
                dialogParam: {
                    camera_index: 0
                },
                cameraCounts: {
                    camera_count: 0,
                    camera_names: [],
                },
                cameraOpenData: {
                    width: 0,
                    height: 0,
                    frame_rate: 0
                },
                imgBase64: '',
                wsClient:null
            };
        },
        computed: {},
        watch: {
            'transfer.visible'(val) {
                console.log('val',val)
                if (val) {
                    console.log('transfer.visible', this.transfer.visible)
                    this.getCameraCounts();

                }
                if (!val) {
                    this.handleOnCameraClose();
                }
            }
        },
        mounted() {

        },
        destroyed() {
            //this.handleOnCameraClose()
        },
        methods: {
            closePhotoDialog() {
                this.transfer.visible = false;
                this.handleOnCameraClose()
                this.$emit('onCloseDialog')
            },
            /**获取拍照数据 */
            getCameraCounts() {
                WsApi.cameraCounts("", this.onMsg, this.onErr);
            },
            /**打开摄像头 */
            handleOnCameraOpen() {
               this.wsClient= WsApi.cameraOpen({camera_index: this.dialogParam.camera_index}, this.onMsg, this.onErr, false);
            },
            /**关闭摄像头 */
            handleOnCameraClose() {
                if(this.wsClient){
                    WsApi.cameraClose("", this.onMsg, this.onErr);
                    this.wsClient.close()
                    this.wsClient=null
                }
            },
            /**点击拍照按钮 */
            handleOnPhotograph() {
                this.handleOnCameraTakePicture();

                this.$emit('PhotoftClick', this.imgBase64);

                //关闭打开摄像头的长连接
                //WsApi.cameraOpen(this.dialogParam.camera_index, this.onMsg, this.onErr);
                this.handleOnCameraClose();
                this.transfer.visible = false;


            },
            /**执行拍照 */
            handleOnCameraTakePicture() {
                WsApi.cameraTakePicture("", this.onImgMsg, this.onErr);
            },
            //利用FileReader加载图片流
            loadImg(blob) {
                let _this = this;
                let reader = new FileReader();
                //转base64
                reader.onload = function (e) {
                    _this.imgBase64 = (e.target.result);

                }
                //调用FileReader的readAsDataURL的方法自动就会触发onload事件
                reader.readAsDataURL(blob);
            },

            //websocket消息处理回调
            onMsg: function (msg) {
                if (typeof (msg.data) === "string") {
                    let rspData = JSON.parse(msg.data);
                    if (rspData.return_code === '0') {
                        //获取业务数据
                        let bizContent = JSON.parse(rspData.biz_content);
                        switch (rspData.method) {
                            // 获取摄像头数量
                            case WsConsts.methods.cameraCounts:
                                this.cameraCounts = bizContent;
                                this.handleOnCameraOpen();
                                break;
                            //打开摄像头
                            case WsConsts.methods.cameraOpen:
                                this.cameraOpenData = bizContent;
                                break;
                            //关闭摄像头
                            case WsConsts.methods.cameraClose:
                                break;
                            //拍照
                            case WsConsts.methods.cameraTakePicture:
                                break;
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            type: 'error',
                            message: rspData.return_msg,
                        });
                    }
                    console.log("收到消息：" + msg.data);
                } else {
                    this.loadImg(msg.data);

                }
            },
            //websocket异常处理回调
            onErr: function (err) {
                console.log("获取信息失败：" + err.message);
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "../styles/common";

    .PhotoDialog {
        .my_title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            font-size: 18px;
            width: 100%;
            color: $second-color;

            .cancel_img:before {
                content: "";
                display: block;
                height: 30px;

                width: 30px;
                background-image: url('../assets/back.png');
                background-repeat: no-repeat;

            }
        }

        .el-dialog__header {
            font-size: 30px;
        }

        .my_photoDialog {
            display: flex;
            flex-direction: column;
            justify-content: center;
            .el-button {
                border: none;
            }

            .el-dialog__header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

            }

            .my_photoForm {
                padding-top: 15px;
                background: $main-color;

                .el-form-item__label {
                    color: #fff !important;
                }
            }
        }

        .el-dialog {
            height: 700px;
            width: 850px;
            border-radius: 6px;

            .el-dialog__body {
                background: $main-color;
                text-align: center;

                .main_picture {
                    background: $main-color;
                    display: flex;
                    height: 500px;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                }

                .picture_Canvas {
                    background-color: #f2f6fc;
                    width: 695px;
                    height: 400px;
                }

                .picture_Btn {
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .el-button {
                    background: #01C1B2;
                    color: #f2f6fc;
                }

                .el-form-item__label {
                    font-size: 14px;
                    color: #f2f6fc;
                }
            }

        }
    }
</style>