<template>
<!--    <div class="upLoadPictureItem">-->
<!--        <div class="previewPicture">-->
<!--            <div class="previewPictureContaint">-->
<!--                <div style="cursor:pointer;" @click="clickPicture">-->
<!--                    <img :src="imgBase64">-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="btnBox" :class="imgBase64? 'complete' : ''">{{name}}</div>-->
<!--    </div>-->
    <div class="archives-item">
        <div class="pic-box" @click="clickPicture">
            <div v-if="imgBase64" class="picture_img">
                <img class="picture_img"  id="picPreview" :src="imgBase64" height="100" width="128">
            </div>
        </div>

        <div class="bottom">
            <slot>{{name}}</slot>
        </div>

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
            name: {
                type: String,
                default: ''
            },
            file_code: {
                type: String,
                default: ''
            },
            ind: {
                type: Number,
                default: ''
            },

        },
        data() {
            return {
                imgBase64: '',
                imgSrc: '',
                chooseImage: '',
                list: [],
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo',
            ])
        },
        created() {
          this.imgBase64 = '/archives/display/S/' + this.file_code;
          // /archives/display/S/dDl2bUp0QkFlWTc3VE5rUEQ4emRrSzRQY0NpK2h3YURkRk4zV3ZaV0pFeUwvK2hTSXpoSStjV1Ezb3BQeG1jS2Y5Z3B0NzRBWDlPUkZBMlZ6cDdqdWxXRTFOOFdPakY5d29GSm90WDdjYkNNRXdWc3dheDM0b1BJSml2K1AxUUtHN2k5VWl3UEIxVThxblhxSDRHcmR1WUVza29nQ0pUSU4vZG9wKytESVI0K0JLVTBLd1NZb3ZQMTFWTXl3TnE2WmU4TVFFRUlra3I0SDA4UCsxMDE5QjN4QjMzbVRtUUhGOUZtd0s3MU83RDIvWG1xUjZnY3BzRHQ4RnQxZDdCaVpWQ1d2N2YwNi9xVXl3am1DakxzS0dkM2dCWXIzeXAyWExaVmF4OUtzYjN3ZGg1WVBCRGFZQUpKNDZSZjVFSXQ0d01wbmgyY290Uk1DdWhFVjUxRnJFWkN5UnpPbUVYc25KZjE5dzVsM2JwMVhDL2V2cGF1S2JxT3VWM2hoMXgxK0xCUGl0clZSeVd6eEFyRXQyNkIxYng0TDhHVHZtRzZMMUFlQ0V6ejBKMWFiSlhUODFwdWlvMXNhbEtsdkM0dWxxeFliOGE3RVFIUHk5emtVK0hsK0dwbHpiQzMydU0rTzUrZ1hOeVF6TU09
          // /archives/display/S/dDl2bUp0QkFlWTc3VE5rUEQ4emRrTmlMZjNZQ2s4UjREYkJBTGFPdVBjd0ljYjlWVDVTMVo3a3FOMkVaV0tBRDNtR1F1SW5FTTcyeVVtZHl2Wjl5Z2E4S1JaaEtyQkY5Vk1HcloyYWtFaVNZOVFrWnRxeDlYdHpPVmROQUxrUjlXSlQyNmpFeXNYdndMUUoyZHVMdjlmT2N2cVh3WDRjU25vTjdhQkp2M2NFcEFLS1FQV0xTTGp3aG5GVWR3ZE4xdUFRa25xaUN4OHlwTUt1Z1JJZjlPMCtvK1FZakc0VE5QVjhWemZIck1wNi9tc2JJWXhmWDRxQVRhY2xGaXE2clE3RW1XaGIwZzU0alhsTmlnaHF5VVIxZCs2ZXVycWV0ME5EWDhCZ3RkZnhvdWNNNmVHVHRNRktKYklxc3dLY2ZGR2hHU2w3VEpsVGVPTzJrYVRXUk5URnJsakJkWkVDOUpRT0ZRaHU0b1VZTXY5THNLK0ZiVTJ3VTlHWFVYRTAzTjdsNUp2WXNuYWx1VmdvUERwVksyUzRvS1lEaGVvUzl3bFFDcGZkaGRIWT0=
          // /archives/display/S/dDl2bUp0QkFlWTc3VE5rUEQ4emRrTmlMZjNZQ2s4UjREYkJBTGFPdVBjd0ljYjlWVDVTMVo3a3FOMkVaV0tBRDNtR1F1SW5FTTcyeVVtZHl2Wjl5Z2E4S1JaaEtyQkY5Vk1HcloyYWtFaVNZOVFrWnRxeDlYdHpPVmROQUxrUjlXSlQyNmpFeXNYdndMUUoyZHVMdjlmT2N2cVh3WDRjU25vTjdhQkp2M2NFcEFLS1FQV0xTTGp3aG5GVWR3ZE4xdUFRa25xaUN4OHlwTUt1Z1JJZjlPMCtvK1FZakc0VE5QVjhWemZIck1wNVU5QStPWHJBWk1QTXdPRS9HcDZzMlE3RW1XaGIwZzU0alhsTmlnaHF5VVIxZCs2ZXVycWV0ME5EWDhCZ3RkZnhvdWNNNmVHVHRNRktKYklxc3dLY2ZGR2hHU2w3VEpsVGVPTzJrYVRXUk5URnJsakJkWkVDOUpRT0ZRaHU0b1VZTXY5THNLK0ZiVTJ3VTlHWFVYRTAzTjdsNUp2WXNuYWx1VmdvUERwVksyUzRvS1lEaGVvUzl3bFFDcGZkaGRIWT0=
        },
        destroyed() {
        },
        methods: {
            ...mapActions([
            ]),


            onCloseDialog() {
                this.dialog.visible = false;
            },
            /**点击图片展示**/
            clickPicture(file_code) {
                this.$emit('toggleShowImage', this.file_code, this.ind, this.name)
            },
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../styles/mixin";
    @import "../styles/common";


    .archives-item {
        background: #f1f1f1;
        margin-right: 10px;
        border: 1px dashed #979797;
        width: 128px;
        height: 128px;
        border-radius: 6px;
        position: relative;
        overflow: hidden;

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
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            bottom: 0px;
            left: 0px;
        }

        .pic-box {
            height: 100px;
            width: 128px;
            cursor:pointer;
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
