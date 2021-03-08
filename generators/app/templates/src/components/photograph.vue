<template>
    <div class="archives-item">
        <div class="dft-box">
            <input
                    type="file"
                    id="myInput"
                    class="imagebase"
                    style="display:none"
                    :accept="imgList"
                    @change="getImgBase"/>
        </div>

        <div class="pic-box">
            <div v-if="!imgBase64">
                <img :src="require('@assets/photograph1.png')" @click="openCamDialog"
                     style="margin:8.1px;cursor: pointer"/>
                <img :src="require('@assets/line.png')" style="margin:8.1px;cursor: pointer">
                <img :src="require('@assets/local.png')" style="margin:8.1px;cursor: pointer"
                     @click="openFDialog('imagebase')"/>
            </div>
            <div v-if="imgBase64" class="picture_img">
                <img class="picture_img" @click="clickPicture(iteminfo.file_code, iteminfoKey)" id="picPreview" :src="imgBase64" height="100" width="128">
                <span class="file-remove" @click="delPic">+</span>
            </div>
            <div v-if="iteminfo.changed" class="modal">未上传</div>
        </div>

        <div class="bottom">
            <slot>身份证（人像面）</slot>
        </div>

        <PhotoDialog :transfer="dialog" @PhotoftClick="photoftClick" @onCloseDialog="onCloseDialog"></PhotoDialog>
    </div>
</template>

<script>
    import PhotoDialog from '@/components/PhotoDialog'

    export default {
        props: {
            iteminfo: {
                type: Object,
                // default: this.defaultItemInfo(),
                // required: true
            },
            photoCode: {
                type: String,
                default: '9'
            },
            iteminfoKey: {
                type: Number,
                default: 0
            }
        },
        components: {
            PhotoDialog
        },
        computed: {
            imgBase64: {
                get: function () { //
                    // console.log(this.imgBase, this.iteminfo.file_code ? ('/archives/display/S/' + this.iteminfo.file_code) : null)
                    //this.imgBase=this.iteminfo.file_code ? ('/archives/display/S/' + this.iteminfo.file_code) : null
                    return this.imgBase ? this.imgBase : this.iteminfo.file_code ? ('/archives/display/S/' + this.iteminfo.file_code) : null//this.iteminfo.file_code ? ('/archives/display/S/' + this.iteminfo.file_code) : null
                },
                set: function (val) {
                    this.imgBase = val
                }
            }
        },
        data() {
            return {
                dialog: {
                    visible: false,
                },
                imgBase: '',//'/archives/display/S/' + this.iteminfo.file_code || '',
                imgList: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/bmp'],
                myInput: null
            };
        },
        watch: {
            // iteminfo(arr) {
            //     let obj = arr[this.iteminfoKey];
            //     if (obj && obj.file_code) {
            //
            //         let url = '/archives/display/S/' + obj.file_code;
            //         this.imgBase64 = url;
            //     } else {
            //         this.imgBase64 = ''
            //     }
            // }
        },
        created() {
        },
        mounted() {
            this.myInput = document.getElementById('myInput')
            // console.log(document.getElementById('myInput').setAttribute('type', 'text'));
        },
        methods: {
            /**点击图片展示**/
            clickPicture(file_code, iteminfoKey) {
                this.$emit('toggleShowImage', file_code, iteminfoKey)
            },
            /**打开拍照界面 */
            openCamDialog() {
                this.dialog.visible = true;
            },
            openFDialog(id) {
                console.log('this.iteminfoKey', this.iteminfoKey, typeof (this.iteminfoKey))
                // document.getElementsByClassName(id)[this.iteminfoKey].click();
                var username = document.createElement("input");
                username.type = "file";
                username.name = "username";
                username.id = "username";
                username.value = "";
                username.accept = this.imgList;
                username.onchange = this.getImgBase;
                var evt = new MouseEvent("click", {
                    bubbles: false,
                    cancelable: true,
                    view: window
                });
                username.dispatchEvent(evt);
            },
            //获取图片base64实现预览
            getImgBase() {
                let _this = this;
                let event = event || window.event;
                let file = event.target.files[0];
                let reader = new FileReader();
                //转base64
                reader.onload = function (e) {

                    _this.imgBase64 = (e.target.result);

                    _this.setImg();
                }
                if (parseInt(file.size / 1024 / 1024) >= 10) {
                    // 超过10M，提示无法上传
                    this.$msgbox({
                        title: '温馨提示',
                        message: '上传图片大小不得超过10M',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                            }
                        }
                    })
                } else if (this.imgList.indexOf(file.type) === -1) {
                    this.$msgbox({
                        title: '温馨提示',
                        message: '请上传图片格式的文件',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                            }
                        }
                    })
                } else {
                    reader.readAsDataURL(file);
                }


            },
            setImg() {
                const param = {
                    imgBase64: this.imgBase64,
                    type: 'setImg',
                    index: this.iteminfoKey,
                    photoCode: this.photoCode
                };
                this.$emit('onOperation', param);
                //this.iteminfo['changed']=true
            },
            /**删除图片 */
            delPic() {
                this.$msgbox({
                    message: '是否确定删除该档案图片？',
                    title: '提示',
                    customClass: 'my_msgBox',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.imgBase64 = null;
                    const param = {
                        imgBase64: null,
                        type: 'delete',
                        index: this.iteminfoKey,
                        photoCode: this.photoCode
                    }
                    this.$emit('onOperation', param);

                    this.changeType()
                })
            },
            photoftClick(val) {
                this.imgBase64 = val;
                this.setImg();
            },
            onCloseDialog() {
                this.dialog.visible = false;
            }

        }
    };
</script>

<style lang="scss">
    .archives-item {
        background: #f1f1f1;
        border: 1px dashed #979797;
        width: 128px;
        height: 128px;
        border-radius: 6px;
        position: relative;

        .picture_img{
            img{
                display: block;
                width: 100%;
                height: 3.65rem;
                object-fit: cover;
            }
        }
        .bottom {
            width: 128px;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            text-align: center;
            color: #ffffff;
            border-radius: 0px 0px 6px 6px;
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            bottom: 0px;
            left: 0px;
        }

        .pic-box {
            height: 100px;
            width: 128px;
            display: table-cell;
            text-align: center;
            vertical-align: middle;
            position: relative;

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

            .modal {
                position: absolute;
                top: 0;
                left: 0;
                width: 128px;
                height: 100px;
                background-color: rgba(0, 0, 0, .3);
                line-height: 100px;
                text-align: center;
                font-size: 20px;
                color: #01C1B2;;
            }
        }


    }

</style>
      
      