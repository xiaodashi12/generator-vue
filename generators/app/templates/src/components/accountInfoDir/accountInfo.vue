<template>
    <div>
        <popSwitch @onChange="transKey" :btnList="accountTabList"></popSwitch>

        <accountDetails v-if="active==='0'"></accountDetails>
        <cardDetails v-if="active==='1'"></cardDetails>
        <transRecord v-if="active==='2'"></transRecord>
        <consRecord v-if="active==='3'"></consRecord>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {accountTabList} from '@/utils/dictionaries'
    import popSwitch from '../popSwitch';
    import accountDetails from './accountDetails';
    import cardDetails from './cardDetails';
    import transRecord from './transRecord';
    import consRecord from './consRecord';

    export default {
        name: 'accountInfo',
        props: {
            showBtn: {
                type: Boolean,
                default: false
            },
        },
        components: {
            accountDetails,
            cardDetails,
            transRecord,
            consRecord,
            popSwitch,
        },
        data() {
            return {
                tableData: [],
                accountTabList: accountTabList,
                active: '0',
            }
        },
        computed: {
            ...mapGetters([
                'customerInfo',
                'vehicleInfo',
            ]),
        },
        mounted() {
        },
        methods: {
            transKey(key){
                this.active = key;
            },
        },
        filters: {
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    @import "../../styles/mixin";

    .list_row {
        padding: 30px;
        display: flex;
        flex-direction: column;

        .list_row_title {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            font-size: .5rem;

            .line {
                width: 2px;
                height: 20px;
                display: inline-block;
                background: $three-color;
                margin-right: 5px;
            }
        }

        .list_row_body {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: 30px;

            > div {
                width: 33%;
                display: flex;
                flex-direction: row;
                padding: 10px;
                box-sizing: border-box;
            }

            .userInfo_key {
                color: #999999;
            }
        }
    }
</style>
