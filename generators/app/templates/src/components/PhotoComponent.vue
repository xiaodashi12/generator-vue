<template>
        <el-dialog
                title=""
                :modal="false"
                class="my_main_dialog"
                :before-close="handleDialogClose"
                :visible.sync="photoVisible"
                width="50%">
            <div class="showBigPicture">
                <div class="leftArrow Arrow" @click="leftClick"></div>
                <img class="bigPictureImage" :src="imgSrc" alt="">
                <div class="rightArrow Arrow" @click="rightClick"></div>
            </div>
            <div class="name" v-if="name">{{name}}</div>
        </el-dialog>
</template>

<script>
    export default {
        name: 'PhotoComponent',
        props: {
            imgSrc: {
                type: String,
                required: true,
                default: ''
            },
            name: {
                type: String,
                required: false,
                default: ''
            },
            photoVisible: {
                type: Boolean,
                required: true,
                default: false
            },
        },
        computed: {},
        data() {
            return {
            };
        },
        created() {

        },
        methods: {
            handleDialogClose() {
                this.$emit('closeImageShow')
            },
            leftClick() {
                this.$emit('arrowClick', 'left', this.name)
            },
            rightClick() {
                this.$emit('arrowClick', 'right', this.name)
            },
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .showBigPicture{
        position: relative;
        height: 500px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .bigPictureImage{
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .Arrow{
            position: absolute;
            top: 50%;
            margin-top: -15px;
            cursor: pointer;
        }
        .leftArrow{
            left: 10px;
            width:0;
            height:0;
            border-top:20px solid transparent;
            border-bottom:20px solid transparent;
            border-right:20px solid #e5e5e5;
        }
        .rightArrow{
            right: 10px;
            width:0;
            height:0;
            border-top:20px solid transparent;
            border-bottom:20px solid transparent;
            border-left:20px solid #e5e5e5;
        }

    }
    .name{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

</style>
