<template>
    <div class="archives-container">
        <div class="archives-content">
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[0]" photoCode="3" class="item"
                        :iteminfoKey="0"
                        @onOperation="handleOperation">行驶证
            </photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[1]" photoCode="5" class="item"
                        :iteminfoKey="1"
                        @onOperation="handleOperation">委托书
            </photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[2]" photoCode="6" class="item"
                        :iteminfoKey="2"
                        @onOperation="handleOperation">车辆照片
            </photograph>
            <photograph @toggleShowImage="toggleShowImage" :iteminfo="pictureList[3]" photoCode="8" class="item"
                        :iteminfoKey="3"
                        @onOperation="handleOperation">车辆变更单
            </photograph>
            <!--            <photograph :iteminfo="pictureList" photoCode="7" class="item" :iteminfoKey="4" @onOperation="handleOperation"></photograph>-->
            <template v-for="(item,index) in  UOtherlength">
                <photograph @toggleShowImage="toggleShowImage" :iteminfo="getOther(4+index)" class="item" photoCode="10"
                            :key="item"
                            :iteminfoKey="4+index"
                            @onOperation="handleOperation">车辆其他
                </photograph>
            </template>
            <PhotoComponent @arrowClick="arrowClick" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                            :imgSrc="imgSrc"></PhotoComponent>
        </div>
        <dlg-footer :btninfos="ftBtnArrays.vehicleArch" @ftClick="ftClick"></dlg-footer>
    </div>
</template>

<script>
    import api from '@/api';
    import axios from 'axios'
    import {mapGetters} from 'vuex';
    import fetch from '@/utils/fetch';
    import {getToken} from '@/utils/auth';
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import photograph from "@/components/photograph";
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import PhotoComponent from "@/components/PhotoComponent";

    export default {
        components: {
            DlgFooter,
            photograph,
            PhotoComponent,
        },
        props: {
            idx: {//当前步骤条
                type: Number,
                default: ''
            }
        },
        data() {
            return {
                ftBtnArrays: ftBtns,
                UOtherlength: 1,
                list: [],
                imgSrc: '',
                chooseImage: 0,
                photoVisible: false,
                showAlbum: false,
                showPhoto: false,
                pictureList: [
                    {photo_code: '3', file_serial: null, file_name: null, file_code: null},//行驶证
                    {photo_code: '5', file_serial: null, file_name: null, file_code: null},//委托书
                    {photo_code: '6', file_serial: null, file_name: null, file_code: null},//车辆照片
                    {photo_code: '8', file_serial: null, file_name: null, file_code: null},//车辆变更单
                    // {photo_code: '10'},//车辆其他
                ],
            };
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo'
            ]),
            vehicleCode() {
                //let editVehicleInfo = _this.$store.getters.vehicleInfo
                this.init();
            }
        },
        created() {
            //this.getVihicleFiles()
        },
        mounted() {
            this.init();
        },
        methods: {
            getOther(idx) {
                if (!this.pictureList[idx]) {
                    this.$set(this.pictureList, idx, {
                        photo_code: '10',
                        file_serial: null,
                        file_name: null,
                        file_code: null
                    })
                }
                return this.pictureList[idx]
            },
            init() {
                this.UOtherlength = 1;
                this.pictureList = [
                    {photo_code: '3', file_serial: null, file_name: null, file_code: null},//行驶证
                    {photo_code: '5', file_serial: null, file_name: null, file_code: null},//委托书
                    {photo_code: '6', file_serial: null, file_name: null, file_code: null},//车辆照片
                    {photo_code: '8', file_serial: null, file_name: null, file_code: null},//车辆变更单
                    // {photo_code: '10'},//车辆其他
                ];
                this.getVihicleFiles();
            },
            //底部按钮点击事件处理
            ftClick: function (cmd) {

                switch (cmd) {
                    //上传
                    case cmds.uplVehicleArch:

                        this.uplVehicleArch();
                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        //如果可以，才调用上层事件处理
                        this.$emit("ftClick", cmd);
                        break;
                }
            },
            uplVehicleArch() {
                let unUploadList = this.pictureList.filter(obj => obj.changed)
                if (unUploadList && unUploadList.length > 0) {
                    for (let i = 0; i < unUploadList.length; i++) {
                        if (unUploadList[i].imgBase64 && unUploadList[i].photo_code) {
                            this.upload(unUploadList[i]);
                        }
                        if (unUploadList[i].photo_code && unUploadList[i].file_serial && unUploadList[i].delete) {
                            this.delPic(unUploadList[i]);
                        }
                    }
                } else {
                    this.$msgbox({
                        title: '温馨提示',
                        message: '无可上传图片',
                        customClass: 'my_msgBox singelBtn',
                        // showCancelButton: true,
                        confirmButtonText: '确定',
                        type:'info',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                done();
                            }
                        }
                    })
                }
            },
            handleOperation(param) {
                let type = param.type;
                let imgInfo = param.imgBase64;
                let index = param.index;
                let photoCode = param.photoCode;
                let obj = this.pictureList[index];
                //删除图片
                if (type === 'delete') {

                    if (!obj.changed) {
                        this.delPic(obj)
                    }
                    if (photoCode === '10' && index > 4) {
                        this.UOtherlength = this.UOtherlength - 1;
                    }
                    let param = {
                        imgBase64: null,
                        photo_code: photoCode,
                        file_serial: obj.file_serial,
                        delete: true
                    };
                    this.$set(this.pictureList, index, param);
                } else if (type === 'setImg') {
                    let param = {
                        ...obj,
                        imgBase64: imgInfo,
                        changed: true
                    };
                    this.$set(this.pictureList, index, param);
                    console.log(photoCode, (this.pictureList.length - 1), index)
                    if (photoCode === '10' && index === this.pictureList.length - 1) {
                        this.pictureList.push({photo_code: '10'});
                        this.UOtherlength = this.UOtherlength + 1;
                    }
                }
                //console.log(' this.pictureList', this.pictureList)

            },
            // //上传图片
            upload(obj) {

                let param = new FormData(); //创建form对象
                let biz_content = {
                    file_name: "file",
                    customer_id: this.customerInfo.customer_id || '',
                    vehicle_code: this.vehicleInfo.vehicle_code,
                    vehicle_color: this.vehicleInfo.vehicle_color,
                    photo_code: obj.photo_code,
                }
                param.append('method', api['upImg'].method);
                param.append('biz_content', JSON.stringify(biz_content))

                param.append('ticket', getToken());
                let blob = this.dataUrlToBlob(obj.imgBase64);

                param.append('file', blob, 'img.jpg');

                console.log('file', param.getAll('file'))

                let config = {
                    onUploadProgress: progressEvent => {
                        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'

                        console.log("上传进度：" + complete)
                    },
                    headers: {'Content-Type': 'multipart/form-data'},

                };  //添加请求头

                axios.post('/issue/do', param, config)
                    .then(response => {
                        obj.imgBase64 = null
                        obj.changed = false
                        console.log(response.data);
                    })
            },
            //dataURL to blob,
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

            delPic(obj) {
                fetch({
                    url: api['delPic'].url,
                    method: 'post',
                    data: {
                        method: api['delPic'].method,
                        customer_id: this.customerInfo.customer_id || '',
                        vehicle_code: this.vehicleInfo.vehicle_code,
                        vehicle_color: this.vehicleInfo.vehicle_color,
                        photo_code: obj.photo_code,
                        file_serial: obj.file_serial
                    }
                }).catch(error => {
                    console.log("获取信息失败：", error);
                })
            },
            //获取车辆档案
            getVihicleFiles() {
                let _this = this
                let storeVehicleInfo = _this.$store.getters.vehicleInfo
                new Promise((resolve, reject) => {
                    fetch({
                        url: api['getVehicleArchives'].url,
                        method: 'post',
                        data: {
                            method: api['getVehicleArchives'].method,
                            customer_id: _this.customerInfo.customer_id || '',
                            vehicle_color: storeVehicleInfo.vehicle_color,
                            vehicle_code: storeVehicleInfo.vehicle_code
                        }
                    }).then(res => {
                        // console.log("获取信息res1111：", res);
                        const bizContent = res || [];

                        bizContent.forEach((item) => {
                            switch (item.photo_code) {
                                case '3':
                                    _this.$set(_this.pictureList, 0, item);
                                    break;
                                case '5':
                                    _this.$set(_this.pictureList, 1, item);
                                    break;
                                case '6':
                                    _this.$set(_this.pictureList, 2, item);
                                    break;
                                case '8':
                                    _this.$set(_this.pictureList, 3, item);
                                    break
                            }
                        })
                        let other = bizContent.filter(m => m.photo_code === '10') || []
                        if (other.length > 0) {
                            _this.UOtherlength = other.length + 1
                            //let idx = _this.pictureList.length;
                            for (let i = 0; i < other.length; i++) {
                                let idx = 4 + i
                                _this.$set(_this.pictureList, idx, other[i])
                                //idx++
                            }
                        }
                        console.log("车辆档案：", _this.pictureList);


                    }).catch(error => {
                        console.log("获取信息失败：", error);
                    })
                })
            },
            // 点击展示大图
            toggleShowImage(file_code, index) {
                this.list = this.pictureList.filter((item) => {
                    return item.file_code;
                })
                this.photoVisible = true;
                this.chooseImage = index;
                this.imgSrc = '/archives/display/L/' + file_code;

            },
            closeImageShow() {
                this.photoVisible = false;
            },
            noMore() {
                this.$msgbox({
                    title: '温馨提示',
                    message: '没有更多啦',
                    customClass: 'my_msgBox singelBtn',
                    // showCancelButton: true,
                    confirmButtonText: '确定',
                    type:'info',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            done();
                        }
                    }
                })
            },
            arrowClick(direction) {
                if (direction === 'left') {
                    if (this.chooseImage >= 1) {
                        this.chooseImage = this.chooseImage - 1;
                        this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                    } else {
                        this.noMore()
                    }
                } else {
                    if (this.chooseImage < (this.list.length - 1)) {
                        this.chooseImage = this.chooseImage + 1;
                        this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                    } else {
                        this.noMore()
                    }
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../../styles/common";

    .archives-content {
        padding: 0 20px;
        height: $dialog-height;
        overflow-y: auto;
        /*width: 815px;*/
        /*height: 400px;*/
        /*overflow-y: auto;*/

        /*&::-webkit-scrollbar-corner {!*边角（位置6）*!*/
        /*    background:#82AFFF;*/
        /*}*/
        /*&::-webkit-scrollbar-resizer  {!*定义右下角拖动块的样式（位置7）*!*/
        /*    background:#FF0BEE;*/
        /*}*/
        .item {
            display: inline-block;
            margin: 20px 30px 20px 35px;
        }
    }

</style>
      