<template>
    <div class="upLoadPictureItem">
        <div class="previewPicture">
            <div class="previewPictureModel" v-show="!imgBase64"></div>
            <div class="previewPictureDiv" v-show="!imgBase64"></div>
            <div v-show="imgBase64" class="previewPictureContaint">
                <div class="previewPictureClose file-remove"
                     @click="clearPicture">+
                </div>
                <div style="cursor:pointer;" @click="clickPicture">
                    <img :src="imgBase64">
                </div>
            </div>

        </div>
        <div class="btnBox" :class="imgBase64? 'complete' : ''"
             @click="takePhoto">{{name}}
        </div>
        <PhotoDialog :transfer="dialog" @PhotoftClick="photoftClick" @onCloseDialog="onCloseDialog"></PhotoDialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import {mapGetters, mapActions} from 'vuex'
    import PhotoDialog from '@/components/PhotoDialog'
    import PhotoComponent from '@/components/PhotoComponent'
    import api from '@/api'
    import {getToken} from '@/utils/auth';
    export default {
        name: 'electronicArchives',
        components: {PhotoDialog,PhotoComponent},
        props: {
            code: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            special_code: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                dialog: {
                    visible: false,
                },
                imgBase64: '',
                imgSrc: '',
                chooseImage: '',
                list: [],
                photoVisible: false,
                file_code: ''
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo',
            ])
        },
        created() {
        },
        destroyed() {
        },
        methods: {
            ...mapActions([
            ]),
            takePhoto() {
                this.dialog.visible = true;
            },
            clearPicture() {
                this.imgBase64 = '';
                this.$emit('deletePicture', this.code)
            },
            photoftClick(val) {
                this.startLoading();
                const param = {
                    imgBase64: val,
                    photo_code: this.code,
                };
                this.upload(param, (res) => {
                    let biz_content =   JSON.parse(res.biz_content);
                    this.file_code= biz_content.file_code;
                    this.imgBase64 = val;
                    this.$emit('takePhotoSuccess', {
                        code: this.code,
                        base64: val,
                        file_code: this.file_code
                    })
                    this.endLoading();
                }, (err) => {
                    this.endLoading();
                    // this.$emit('takePhotoSuccess', {
                    //     code: this.code,
                    //     base64: '',
                    // })
                    this.imgBase64 = '';
                    this.$alert(error.message, '提示', {
                        dangerouslyUseHTMLString: true,
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                })
            },
            onCloseDialog() {
                this.dialog.visible = false;
            },
            /**点击图片展示**/
            clickPicture(file_code) {
                this.$emit('toggleShowImage', this.file_code, this.code)
            },

            //上传图片
            upload(obj, cb, errCb) {
                let param = new FormData(); //创建form对象
                let biz_content = {
                    file_name: "file",
                    customer_id: this.customerInfo.customer_id || '',
                    photo_code: obj.photo_code,
                    special_code: this.special_code,
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                }

                // todo 注意： 此处接口是特勤业务电子档案上传接口，
                param.append('method', api['specialImageUpload'].method);
                param.append('biz_content', JSON.stringify(biz_content))

                param.append('ticket', getToken());
                let blob = this.dataUrlToBlob(obj.imgBase64);

                param.append('file', blob, 'img.jpg');


                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };  //添加请求头
                axios.post('/issue/do', param, config)
                    .then(response => {
                        cb && cb(response.data)
                    }).catch((err) => {
                    errCb && errCb(err)
                })
            },
            dataUrlToBlob(dataURI) {
                let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
                let byteString = atob(dataURI.split(',')[1]); //base64 解码

                let arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
                let intArray = new Uint8Array(arrayBuffer); //创建视图

                for (let i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                return new Blob([intArray], {type: mimeString});
            },
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../styles/mixin";
    @import "../styles/common";


    .upLoadPictureItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        margin-bottom: 10px;

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


</style>
