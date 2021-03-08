<template>
    <div class="content">
        <el-row :span="24" class="appointInput appointInputUpper">
            <el-col :span="6">
                <div class="search_box">
                    <div class="search_label">用户姓名：</div>
                    <el-input placeholder="请输入用户姓名" size="medium" width="100" v-model="user_name" @keyup.enter.native="reserveSearch">
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="search_box">
                    <div class="search_label">手机号码：</div>
                    <el-input placeholder="请输入手机号码" size="medium" width="100" v-model="link_mobile" @keyup.enter.native="reserveSearch">
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="search_box">
                    <div class="search_label">车牌号码：</div>
                    <el-input placeholder="请输入车牌号码" size="medium" width="100" v-model="vehicle_code" @keyup.enter.native="reserveSearch">
                    </el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="search_box" style="padding: 10px 3px">
                    <div class="search_label">证件号码：</div>
                    <el-input placeholder="请输入证件号码" size="small" width="100" v-model="id_code">
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row :span="24" class="appointInput appointInputUpper">
            <el-col :span="5">
                <div class="search_box" style="padding: 10px 3px">
                    <div class="search_label">申请平台：</div>
                    <template>
                        <el-select v-model="apply_channel"
                                   placeholder="请选择"
                                   size="medium"
                                   :filterable="true"
                                   value-key="value"
                        >
                            <el-option
                                    v-for="item in selapply_channel"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </el-col>
            <el-col :span="5">
                <div class="search_box" style="padding: 10px 3px">
                    <div class="search_label">签约渠道：</div>
                    <template>
                        <el-select v-model="sign_channel"
                                   placeholder="请选择"
                                   size="medium"
                                   :filterable="true"
                                   value-key="value"
                        >
                            <el-option
                                    v-for="item in selsign_channel"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </el-col>

            <el-col :span="5">
                <div class="search_box" style="padding: 10px 3px">
                    <div class="search_label">地区编码：</div>
                    <template>
                        <el-select v-model="city_code"
                                   placeholder="请选择"
                                   size="medium"
                                   :filterable="true"
                                   value-key="value"
                        >
                            <el-option
                                    v-for="item in cities"
                                    :key="item.city_code"
                                    :label="item.city_name"
                                    :value="item.city_code">
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </el-col>

            <el-col :span="5">
                <div class="search_box" style="padding: 10px 3px">
                    <div class="search_label">邮寄状态：</div>
                    <template>
                        <el-select v-model="shipping_method"
                                   placeholder="请选择"
                                   size="medium"
                                   :filterable="true"
                                   value-key="value"
                        >
                            <el-option
                                    v-for="item in selshipping_method"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </el-col>

            <el-col :span="4">
                <div class="search_box test" >
                    <div ><el-button type="primary" size="medium" style="width:70px" @click="reserveSearch">搜  索</el-button></div>
                    <div><el-button type="primary" size="medium" class="acResetBtn" style="width:70px" @click="reserveReset">重  置</el-button></div>
                </div>
            </el-col>
        </el-row>

        <el-table :data="reserveList"
                  stripe
                  height="350"
                  style="width: 100%"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column align='center' min-width="100" label="操作">
                <template slot-scope="scope">
                    <div><el-button type="text" size="mini" style="align-items: center;"
                                    :disabled="( scope.row.shipping_method !== '1' )"
                                    @click="showReviewDlg(scope.row)" >审核
                    </el-button>
                    <el-button type="text" size="mini" style="align-items: center;"
                                    :disabled="( scope.row.shipping_method === '1' )"
                                    @click="selectReserve(scope.row)" >发行
                    </el-button></div>
                </template>
            </el-table-column>
            <el-table-column align='center' min-width="80" prop="customer_name" label="用户名称"></el-table-column>
            <el-table-column align='center' min-width="120" prop="link_mobile" label="手机号"></el-table-column>
            <el-table-column align='center' min-width="250" prop="link_address" label="联系地址"></el-table-column>
            <el-table-column align='center' min-width="150" label="车牌号码">
                <template slot-scope="scope">
                    <div class="userInfo_value">[{{scope.row.vehicle_color | getVehicleColorFilter}}]{{scope.row.vehicle_code}}</div>
                </template>
            </el-table-column>
            <el-table-column align='center' min-width="120" label="车辆用户类型">
                <template slot-scope="scope">
                    <div class="userInfo_value">{{scope.row.vehicle_user_type | getVehicleUserTypeFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column align='center' min-width="150" label="签约渠道">
                <template slot-scope="scope">
                    <div class="userInfo_value" v-if="scope.row.sign_channel === 'G'">{{scope.row.sign_channel | getsignBankCodeFilter}}（{{scope.row.sign_bank_code |  getsignBankCodeFilter}}）</div>
                    <div class="userInfo_value" v-if="scope.row.sign_channel !== 'G'">{{scope.row.sign_channel | getsignBankCodeFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column align='center' min-width="240" prop="sign_card_no" label="签约银行卡号">
                <template slot-scope="scope">
                    <div class="userInfo_value" v-if="scope.row.sign_channel === 'G'">{{scope.row.sign_card_no}}</div>
                    <div class="userInfo_value" v-if="scope.row.sign_channel !== 'G'">{{scope.row.sign_no}}</div>
                </template>
            </el-table-column>
            <el-table-column align='center' min-width="230" prop="order_no" label="预约订单号"></el-table-column>
        </el-table>
        <div class="accountPagination">
            <div class="block" align="right">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page_index"
                        :page-sizes="[10,20,50,100]"
                        :page-size="page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="allCount"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog class="reserve-web-dialog" height="100%" :modal="false" id="reserve-user-review" title="互联网发行审核" :visible.sync="reviewDlgVisible">
            <div class="reserve-container">

            <div class="new-user-container">
                <div class="title">用户信息</div>
                <el-form size="small" :model="appointInfo" label-width="80px">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户类型：" prop="customer_type">
                                <el-radio-group v-model="appointInfo.customer_type"
                                                :disabled="ItemIsEdit || isNewAdd"
                                                label="1">
                                    <el-radio-button
                                            :class="( appointInfo.customer_type == item.value )? 'disabledButtonWeb' : '' "
                                            v-for="(item,key) in customerTypeListARR"  :key="key">
                                        {{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件类型：" prop="certificates_type">
                                <el-select size="small"  :disabled="ItemIsEdit || isNewAdd" v-model="appointInfo.id_type" placeholder="请选择">
                                    <el-option
                                            v-for="(item, index) in personalOCRType"
                                            :key="index"
                                            :label="item"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户名称：" prop="customer_name">
                                <el-radio-group label="1">
                                    <el-input placeholder="请填写用户名称"
                                              :disabled= "ItemIsEdit || isNewAdd"
                                              v-model="appointInfo.customer_name "></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件号码：" prop="certificates_code">
                                <el-radio-group label="1">
                                    <el-input maxlength="18"
                                              placeholder="用于绑定电子发票平台"
                                              :disabled="ItemIsEdit || isNewAdd"
                                              v-model="appointInfo.id_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="手机号码：" prop="link_mobile">
                                <el-radio-group label="1">
                                    <el-input placeholder="用于绑定电子发票平台"
                                              :disabled="ItemIsEdit || isNewAdd"
                                              v-model="appointInfo.link_mobile"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系地址：" prop="link_address">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系地址"
                                              :disabled="isNewAdd"
                                              v-model="appointInfo.link_address"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系人：" prop="link_man">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系人/经办人" :disabled="isNewAdd" v-model="appointInfo.link_man"></el-input>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                        <!--经办人&&联系电话-->
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系电话：" prop="link_phone">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系电话" :disabled="isNewAdd" v-model="appointInfo.link_phone"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="邮政编码：" prop="posttal_code">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入邮政编码" :disabled="isNewAdd" v-model="personalUserInfo.posttal_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="EMail：" prop="email">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入电子邮件地址" :disabled="isNewAdd" v-model="personalUserInfo.email"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--备注-->
                    <el-form-item class="my_form_label" label="备注：" prop="remark">
                        <el-radio-group label="1">
                            <el-input placeholder="请输入备注信息" type="textarea" :cols="20"
                                      :disabled="isNewAdd"
                                      v-model="personalUserInfo.remark"></el-input>
                        </el-radio-group>
                    </el-form-item>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="申领证件：" prop="customer_type">
                                <div class="ArchivesPhoto">
                                    <checkArchives v-for="(item, index) in customer_list" @toggleShowImage="toggleShowCustomerImage" :ind="index" :file_code="item.file_code" :name="getArchivesNameFilter(item.photo_code)"></checkArchives>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="vehicle-info-container">
                <div class="vehicle-info-dialogContent">
                    <el-form style="width: 100%" size="small" :model="appointInfo" label-suffix=""
                             label-width="118px"
                             label-position="right">
                        <div class="title">车辆信息</div>
                        <el-row :span="24">
                            <el-col :span="24">
                                <el-form-item label="车牌颜色：" class="vehicle-color" prop="vehicle_color">
                                    <el-radio-group :disabled="ItemIsEdit" v-model="appointInfo.vehicle_color"
                                                    label="1">
                                        <el-radio-button
                                                :class="( appointInfo.vehicle_color == item.value )? 'disabledButtonWeb' : '' "
                                                v-for="(item,value) in vehicleColorsWeb" :key="value">
                                            {{item.label}}
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item class="item" prop="vehicle_code">
                                    <label slot="label">车&ensp;牌&ensp;号：</label>
                                    <el-radio-group label="1">
                                        <el-input placeholder="请输入车牌号" maxLength="11"
                                                  :disabled="ItemIsEdit"
                                                  v-model="vehicleProvinceEnd"
                                                  class="input-with-select">
                                            <el-select  v-model="vehicleProvincePre"
                                                        :disabled="ItemIsEdit"
                                                        class="web-el-select"
                                                        slot="prepend" placeholder="请选择" >
                                                <el-option v-for="(value,key) in provinces" :key="key" :label="key"
                                                           :value="value"></el-option>
                                            </el-select>
                                        </el-input>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="卡片类型：" class="cart-type" prop="only_cpu_card">
                                    <el-radio-group :disabled="ItemIsEdit" v-model="getObuIssueOfWeb">
                                        <el-radio-button  :key="1"
                                                          :class="( getObuIssueOfWeb == '1' )? 'disabledButtonWeb' : '' ">
                                            {{obuIssue['1']}}</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item class="vehicle-type" prop="vehicle_type">
                                    <label slot="label">车&emsp;&emsp;型：</label>
                                    <el-radio-group :disabled="ItemIsEdit"  v-model="appointInfo.vehicle_type">
                                        <el-radio-button v-for="(item,key) in vehicleType"
                                                         :class="( appointInfo.vehicle_type == item.value )? 'disabledButtonWeb' : '' "
                                                         :key="key">{{item.label}}
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="车辆用户类型：" class="vehicle-user-type" prop="vehicle_user_type">
                                    <el-select v-model="appointInfo.vehicle_user_type" :disabled="ItemIsEdit" placeholder="请选择">
                                        <el-option v-for="item in vehicleUserType" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item class="item" prop="vehicle_seat">
                                    <label slot="label">座&ensp;位&ensp;数：</label>
                                    <el-input v-model="appointInfo.vehicle_seat" class="input-with-select">
                                        <template slot="append">座</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="发动机号：" class="item" prop="vehicle_engine">
                                    <el-input maxLength="20" placeholder="车辆发动机号（最长20位）" v-model="appointInfo.vehicle_engine"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item class="vehicle-cities" prop="vehicle_city">
                                    <label slot="label">车&ensp;籍&ensp;地：</label>
                                    <el-select v-model="parentCodeWeb"
                                               class="web-sel-item"
                                               @change="cityChange" placeholder="请选择">
                                        <el-option v-for="city in parentCities" :key="city.city_code"
                                                   :label="city.city_name"
                                                   :value="city.city_code"></el-option>
                                    </el-select>
                                    <el-select v-model="vehicle_city_Web"
                                               class="web-sel-item"
                                               placeholder="请选择">
                                        <el-option v-for="city in childCitiesWeb"
                                                   :value="city.city_code" :key="city.city_code" :label="city.city_name"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="识别代码：" class="item" prop="vehicle_distinguish">
                                    <el-input maxLength="32" placeholder="车辆识别代码、车辆VIN码"
                                              v-model="appointInfo.vehicle_distinguish"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item label="ETC卡功能：" prop="card_type">
                                    <el-radio-group v-model="appointInfo.card_type" :disabled="ItemIsEdit">
                                        <el-radio-button
                                                :class="( appointInfo.card_type == item.value )? 'disabledButtonWeb' : '' "
                                                v-for="(item,key) in cardType"  :key="key">{{item.label}}
                                        </el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="车辆特征："  class="item" prop="vehicle_specificInfo">
                                    <el-input placeholder="车辆特征描述" v-model="appointInfo.vehicle_specificInfo">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="12">
                                <el-form-item class="my_form_label"
                                              label="申领证件：" prop="customer_type">
                                    <div class="ArchivesPhoto">
                                        <checkArchives v-for="(item, index) in vehicle_list" @toggleShowImage="toggleShowVehicleImage" :ind="index" :file_code="item.file_code" :name="getArchivesNameFilter(item.photo_code)"></checkArchives>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24">
                            <el-col :span="24">
                                <div class="webtext">注意：该车辆为<strong>邮寄配送蓝牙OBU</strong>，审核通过后设备将通过快递发给用户，请勿线下重复发行设备。</div>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <el-row :span="24">
                <div class="search_box" >
                    <el-col :span="8"></el-col>
                    <el-col :span="4"><div><el-button type="primary" size="medium" style="width:110px" @click="confirmReview">确 认 审 核</el-button></div></el-col>
                    <el-col :span="4"><div><el-button type="primary" size="medium" class="acResetBtn" style="width:110px" @click="returnReserve">取 消</el-button></div></el-col>
                    <el-col :span="8"></el-col>
                </div>
            </el-row>

            </div>
            <PhotoComponent @arrowClick="arrowClick" :name="imgName" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                            :imgSrc="imgSrc" ></PhotoComponent>
        </el-dialog>

    </div>
</template>


<script>
    import {mapActions , mapGetters} from 'vuex'
    import fetch from '@/utils/fetch'
    import api from '@/api'
    import {getVehicleUserType, getVehicleColor ,getsignBankCode , getshippingMethods} from '@/utils/dictionaries'
    import * as dict from "@utils/dictionaries"
    import defaultVars from '@/utils/defaultVars'
    import {getArchivesName} from "@/utils/utils";
    import {ignoreNull} from "../../../utils/arrayUtils";
    import checkArchives from '@/components/checkArchives';
    import PhotoComponent from '@/components/PhotoComponent'

    export default {
        name: "webIssueIndex",
        components: {
            checkArchives,
            PhotoComponent,
        },
        data() {
            return {
                photoVisible: false,
                chooseImage: 0,
                imgSrc: '',
                imgName: '',
                customerVisible:false,
                vehicleVisible:false,
                ItemIsEdit: true,
                customer_type: '1',
                page_index:1,
                page_size: 10,
                allCount : 0,
                //地区编码
                cities : [
                    {city_code: "01", city_name: "杭州市"},
                    {city_code: "05", city_name: "湖州市"},
                    {city_code: "04", city_name: "嘉兴市"},
                    {city_code: "07", city_name: "金华市"},
                    {city_code: "11", city_name: "丽水市"},
                    {city_code: "02", city_name: "宁波市"},
                    {city_code: "08", city_name: "衢州市"},
                    {city_code: "06", city_name: "绍兴市"},
                    {city_code: "10", city_name: "台州市"},
                    {city_code: "03", city_name: "温州市"},
                    {city_code: "09", city_name: "舟山市"},
                    {city_code: "33", city_name: "浙江省"},
                    {city_code: "0", city_name: "外省市"},
                ],
                selapply_channel:[
                    { value: '1', label: '中信银行'},
                    { value: '2', label: '工商银行'},
                    { value: '3', label: '农信银行'},
                    { value: '4', label: '邮储银行'},
                    { value: '5', label: '农业银行'},
                    { value: '6', label: '建设银行'},
                    { value: '7', label: '中国银行'},
                    { value: '8', label: '绍兴银行'},
                    { value: '9', label: '光大银行'},
                    { value: 'B', label: '宁波银行'},
                    { value: 'E', label: '浦发银行'},
                    { value: 'F', label: '浙商银行'},
                    { value: 'G', label: '银联'},
                    { value: 'H', label: '支付宝'},
                    { value: 'I', label: '微信'},
                    { value: 'J', label: '浙商互联'}
                ],
                selsign_channel:[
                    { value: '1', label: '中信银行'},
                    { value: '2', label: '工商银行'},
                    { value: '3', label: '农信银行'},
                    { value: '4', label: '邮储银行'},
                    { value: '5', label: '农业银行'},
                    { value: '6', label: '建设银行'},
                    { value: '7', label: '中国银行'},
                    { value: '8', label: '绍兴银行'},
                    { value: '9', label: '光大银行'},
                    { value: 'B', label: '宁波银行'},
                    { value: 'E', label: '浦发银行'},
                    { value: 'F', label: '浙商银行'},
                    { value: 'G', label: '银联'},
                    { value: 'H', label: '支付宝'},
                    { value: 'I', label: '微信'},
                    { value: 'J', label: '浙商互联'}
                ],
                selshipping_method:[
                    { value:'1',label:'快递' },
                    { value:'2',label:'自提' },
                ],
                personalOCRType: dict.personalOCRType,
                //用户类型字典
                customerTypeList: dict.customerType,
                customerTypeListARR: dict.customerTypeList,
                userCardTypeList: dict.certificatesType,
                //车牌颜色字典
                vehicleColorsWeb: [
                    { value: '0', label: '蓝'},
                    { value: '1', label: '黄'},
                    { value: '2', label: '黑'},
                    { value: '3', label: '白'},
                    { value: '4', label: '渐变绿'},
                    { value: '5', label: '黄绿双拼'},
                    { value: '6', label: '蓝白渐变'},
                ],
                //车牌省份字典
                provinces: dict.provinces,
                //是否发行OBU
                obuIssue: dict.obuIssue,
                //卡片类型
                cardType: [
                { value: '1', label: '记账卡'},
                ],
                //车型
                vehicleType:[
                    { value: '0', label: '客'},
                    { value: '1', label: '货'},
                ],
                //车辆用户类型
                vehicleUserType: [
                    { value: '0', label: '普通车'},
                    { value: '1', label: '集卡车'},
                    { value: '26', label: '应急车'}
                ],
                isNewAdd:false,//用户是否已新增
                reviewDlgVisible: false,
                vehicle_city_Web:'0100',
                childCitiesWeb: [
                    {city_code: "0100", parent_code: "01", city_name: "杭州市区"},
                    {city_code: "0182", parent_code: "01", city_name: "建德"},
                    {city_code: "0127", parent_code: "01", city_name: "淳安"},
                    {city_code: "0183", parent_code: "01", city_name: "富阳"},
                    {city_code: "0185", parent_code: "01", city_name: "临安"},
                    {city_code: "0122", parent_code: "01", city_name: "桐庐"},
                    {city_code: "0110", parent_code: "01", city_name: "余杭"},
                    {city_code: "0109", parent_code: "01", city_name: "萧山"},
                ],
                parentCodeWeb: '01',
                reserveList: [],
                customer_list:[],
                vehicle_list:[],
                user_name:'',
                id_code:'',
                link_mobile:'',
                vehicle_code:'',
                checkInfo:'',
                check_status:'',
                appoint_id:'',
                UserInfo:'',
                city_code:'',
                vehicleInfoWeb:{...defaultVars.vehicleInfo()},
                apply_channel:'',
                sign_channel:'',
                shipping_method:'',
                customer_id:'',
                personalUserInfo: {
                    customer_name: '',         // 用户名称
                    customer_id:'',           //用户编号
                    open_date:'',             //开户日期
                    certificates_type: '1',    // 证件类型
                    certificates_code: '',   // 证件号码
                    unit_level:'',            //单位级别
                    unit_attribute:'',        //单位属性
                    posttal_code:'',           //邮政编码
                    email:'',                 //Email
                    agent_id_type:'',         //经办人证件类型,
                    agent_id_num:'',          //经办人证件
                    remark:'',            //备注
                    branch_no:'',          //网点编号
                    branch_name:'',         //网点名称
                    archives_no:'',        //用户档案号
                    link_mobile: '',       // 手机号码
                    link_address: '',      // 联系地址
                    link_phone: '',       // 联系电话：
                    link_man: '',          // 经办人
                    vehicles:'',          //车辆
                },
                appointInfo: {
                    order_no: '',          // 预约订单号
                    customer_type: '1',     // 用户类型
                    customer_name: '',   // 用户名称
                    id_type: '1',        // 证件类型
                    id_code: '',          // 身份证号
                    link_mobile: '',       // 手机号
                    link_address: '',    // 联系地址
                    link_phone: '',     // 联系电话
                    link_man: '',           // 联系人
                    vehicle_code:'',         //车牌号码
                    vehicle_color:'',         //车牌颜色
                    only_cpu_card:'0',         //通行卡颜色
                    vehicle_type:'0',         //车型
                    vehicle_user_type:'0',    //车辆用户类型
                    vehicle_seat:'',       //座位数
                    vehicle_engine:'',     //发动机号
                    vehicle_distinguish:'', //车辆识别代码
                    vehicle_specificInfo:'', //车辆特征描述
                    card_type:'',            //ETC通行卡功能
                    area_code:'0100',           //车籍地
                    sign_channel:'',        //签约渠道
                    sign_no:'',            //签约编号
                    sign_card_no:'',      //签约银行卡号
                    sign_bank_code:'',     //签约银行
                    appoint_id:'',        //预约编码
                },
            };
        },

        mounted() {
            //点开页面后先进行一次查询，返回账号归属地的预约信息
            this.reserveSearch();
        },
        computed: {
        ...mapGetters([
                'vehicleInfo',
                'customerInfo',
            ]),
            //obuIssue与only_cpu_card值相反，为此做出的一点努力
            getObuIssueOfWeb: {
                get: function () {
                    if (this.appointInfo.only_cpu_card === '0')  return 1;
                    else return 0;

                },
            },
            //车牌省份
            vehicleProvincePre: {
                get: function () {
                    if (this.appointInfo.vehicle_code !== undefined) {
                        let prefix = this.appointInfo.vehicle_code.substr(0, 1);
                        if (dict.getProvince(prefix) === '')
                            return null;
                        return prefix;
                    }
                },
                set: function (value) {
                    if (this.appointInfo.vehicle_code !== undefined)
                        this.appointInfo.vehicle_code = value + this.appointInfo.vehicle_code.substr(1)
                }
            },
            //车牌除省份之外的部分
            vehicleProvinceEnd: {
                get: function () {
                    if (this.appointInfo.vehicle_code !== undefined)
                        return this.appointInfo.vehicle_code.substr(1)
                },
                set: function (value) {
                    if (this.appointInfo.vehicle_code !== undefined)
                        this.appointInfo.vehicle_code = (this.appointInfo.vehicle_code.substr(0, 1) + value).toUpperCase()
                }
            },
            //省份
            parentCities: {
                get: function () {
                    return dict.cities.filter((item) => {
                        if (item.parent_code === '0') return item
                    })
                }
            },

        },

        methods: {
            ...mapActions([
                'setAppointInfo',
                'setApplicationOrderNo',
                'setCustomerInfo',
                'setVehicleInfo',
            ]),
            //查询方法
            reserveSearch() {
                if (!(this.user_name || this.id_code || this.link_mobile || this.vehicle_code || this.apply_channel || this.sign_channel ||this.city_code || this.shipping_method) && this.allCount===0) {
                    this.$message({
                        showClose: true,
                        message: '当前显示归属地预约信息，若需要精确查找，请至少输入一项查询条件',
                        type:'warning'
                    });
                }
                fetch({
                    url: api['getAppointSelect'].url || '',
                    method: 'post',
                    data: {
                        method: api['getAppointSelect'].method,
                        page_index:this.page_index,
                        page_size:this.page_size,
                        user_name: this.user_name ,
                        id_code: this.id_code ,
                        link_mobile: this.link_mobile ,
                        vehicle_code: this.vehicle_code ,
                        apply_channel: this.apply_channel,
                        sign_channel:this.sign_channel,
                        city_code:this.city_code,
                        shipping_method:this.shipping_method,
                    }
                }).then((res) => {
                    this.reserveList = res && res.list;
                    this.allCount = Number((res && res.total_count!=='0' && res.total_count)) || this.allCount
                }).catch((err) => {
                    this.endLoading()
                    this.$msgbox({
                        message: '读取预约信息失败:' + error.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            //重置方法
            reserveReset(){
                this.user_name = '';
                this.id_code = '';
                this.link_mobile = '';
                this.vehicle_code = '';
                this.apply_channel = '';
                this.sign_channel = '';
                this.shipping_method = '';
                this.city_code = '';
                this.reserveList = [];
                this.isNewAdd = false;
                this.page_index = 1;
                this.page_size = 10;
                this.allCount = 0;
            },
            //获取校验状态
            async queryAppointCheck() {
                this.startLoading()
                    let params = {
                        url: api['getAppointCheck'].url,
                        method: 'post',
                        data: {
                            method: api['getAppointCheck'].method,
                            id_code: this.id_code,
                            id_type: this.appointInfo.id_type ,
                            vehicle_code: this.vehicle_code,
                            vehicle_color: this.vehicle_color,
                            appoint_id: this.appoint_id,
                        }
                    };
                    await fetch(params).then(res => {
                        this.endLoading()
                        this.checkInfo = res
                    }).catch(error => {
                        this.endLoading()
                        this.$msgbox({
                            message: '读取校验信息失败:' + error.message,
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            confirmButtonText: '确定',
                            type: 'error'
                        })
                    })
                },
            handleSizeChange(val) {
                this.page_size = val;
                this.reserveSearch();
            },
            handleCurrentChange(val) {
                this.page_index = val;
                this.reserveSearch();
            },
            showReviewDlg: function (row) {//点击审核后
                this.reviewDlgVisible = true;
                this.setCustomerInfo({ });//清理数据
                this.setVehicleInfo({ });//清理数据
                let parmas1 = {
                    order_no: row.order_no,
                    type: '1'
                }
                fetch({
                    url: api['internetArchives'].url ,
                    method: 'post',
                    data: {
                        method:api['internetArchives'].method,
                        ...parmas1
                    }
                }).then(res=>{
                    this.customer_list = res;//图片链接
                }).catch(err=>{
                    console.log(err, 'err');
                })
                let parmas2 = {
                    order_no: row.order_no,
                    type: '2'
                }
                fetch({
                    url: api['internetArchives'].url ,
                    method: 'post',
                    data: {
                        method:api['internetArchives'].method,
                        ...parmas2
                    }
                }).then(res=>{
                    this.vehicle_list = res;
                    console.log(res, 'res');
                }).catch(err=>{
                    console.log(err, 'err');
                })
                this.selectReserve(row);
            },
            //根据区设置车籍地
            setCities: function (val) {
                let _this = this
                //获取并设置市
                _this.parentCode = dict.cities.find((item) => {
                    if (item.city_code === val) return item
                }).parent_code
                //获取并设置区
                _this.childCitiesWeb = dict.cities.filter((item) => {
                        if (item.parent_code === _this.parentCode) {
                            return item
                        }
                    });
                this.vehicle_city_Web = val
            },
            //市下拉框改变事件
            cityChange: function (value) {
                this.childCitiesWeb =
                    dict.cities.filter((item) => {
                        if (item.parent_code === value) {
                            return item
                        }
                    });
                this.vehicle_city_Web = this.childCitiesWeb[0].city_code
            },
            //行点击事件
            async selectReserve(row) {
                this.id_code = row.id_code;
                this.vehicle_code = row.vehicle_code;
                this.vehicle_color = row.vehicle_color;
                this.appoint_id = row.appoint_id;
                await this.queryAppointCheck();
                this.check_status=this.checkInfo.check_status;
                let obj = this.appointInfo;
                if(this.check_status==='0' && !this.reviewDlgVisible){//用户不存在且车辆不存在
                    obj.order_no = row.order_no;//预约订单号
                    obj.appoint_id = row.appoint_id;//预约编号
                    obj.customer_type = row.customer_type;//用户类型
                    obj.customer_name = row.customer_name;//用户名称
                    obj.id_type = row.id_type;//证件类型
                    obj.id_code = row.id_code;//身份证号
                    obj.link_man = row.link_man;//联系地址
                    obj.link_address = row.link_address;//联系地址
                    obj.link_mobile = row.link_mobile;//手机号
                    obj.link_phone = row.link_phone;  //联系电话
                    obj.vehicle_code = row.vehicle_code;         //车牌号码
                    obj.vehicle_color = row.vehicle_color;         //车牌颜色
                    obj.only_cpu_card = row.only_cpu_card;         //通行卡颜色
                    obj.vehicle_type = row.vehicle_type;         //车型
                    obj.vehicle_user_type = row.vehicle_user_type;    //车辆用户类型
                    obj.vehicle_seat = row.vehicle_seat;       //座位数
                    obj.vehicle_engine = row.vehicle_engine;     //发动机号
                    obj.vehicle_distinguish = row.vehicle_distinguish;  //车辆识别代码
                    obj.vehicle_specificInfo = row.vehicle_specificInfo; //车辆特征描述
                    obj.card_type = row.card_type;           //ETC通行卡功能
                    obj.area_code = row.area_code;          //车籍地
                    obj.sign_channel = row.sign_channel;//签约渠道
                    obj.sign_no = row.sign_no;           //签约编号
                    obj.sign_card_no = row.sign_card_no;     //签约银行卡号
                    obj.sign_bank_code = row.sign_bank_code;     //签约银行
                    this.setAppointInfo({...this.appointInfo})//将行信息点击后存入store的appointInfo
                    this.setApplicationOrderNo(this.appointInfo.order_no)//将行信息点击后存入store的appointInfo
                     this.$msgbox({
                        message: '该预约用户为新用户，需要新办用户及新办车辆，办理过程中请仔细核对真实车辆信息。',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'info',
                         beforeClose: (action, instance, done) => {
                             if (action==='confirm'){
                                 this.$emit('clickItem',this.check_status)
                             }
                             done();
                         }
                    })

                }
                else if(this.check_status==='1' && !this.reviewDlgVisible){//用户已办理但车辆未办理
                    obj.order_no = row.order_no;                   //预约订单号
                    obj.appoint_id = row.appoint_id;               //预约编号
                    obj.vehicle_code = row.vehicle_code;             //车牌号码
                    obj.vehicle_color = row.vehicle_color;           //车牌颜色
                    obj.only_cpu_card = row.only_cpu_card;            //通行卡颜色
                    obj.vehicle_type = row.vehicle_type;              //车型
                    obj.vehicle_user_type = row.vehicle_user_type;     //车辆用户类型
                    obj.vehicle_seat = row.vehicle_seat;               //座位数
                    obj.vehicle_engine = row.vehicle_engine;            //发动机号
                    obj.vehicle_distinguish = row.vehicle_distinguish;  //车辆识别代码
                    obj.vehicle_specificInfo = row.vehicle_specificInfo; //车辆特征描述
                    obj.card_type = row.card_type;          //ETC通行卡功能
                    obj.area_code = row.area_code;          //车籍地
                    obj.sign_channel = row.sign_channel;     //签约渠道
                    obj.sign_no = row.sign_no;               //签约编号
                    obj.sign_card_no = row.sign_card_no;     //签约银行卡号
                    obj.sign_bank_code = row.sign_bank_code; //签约银行
                    let _this = this;
                    fetch({
                        url: api['getUserInfo'].url || '',
                        method: 'post',
                        data: {
                            method: api['getUserInfo'].method,
                            certificates_code: row.id_code,
                        }
                    }).then((res) => {
                        _this.UserInfo = res;
                        this.personalUserInfo = {...this.UserInfo[0]}
                        this.setCustomerInfo({...this.personalUserInfo});
                    }).catch((error) => {
                        _this.endLoading()
                        _this.$msgbox({
                            message: '读取用户信息失败:' + error.message,
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            confirmButtonText: '确定',
                            type: 'error',
                        })
                    })
                    this.setAppointInfo({...this.appointInfo});
                    this.setApplicationOrderNo(this.appointInfo.order_no)//将行信息点击后存入store的appointInfo
                    this.$msgbox({
                        message: '该预约用户已开户，可直接在该用户下新增车辆，办理过程中请仔细核对真实车辆信息。',
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'info',
                        beforeClose: (action, instance, done) => {
                            if (action==='confirm'){
                                this.$emit('clickItem',this.check_status)
                            }
                            done();
                        }
                    })
                }
                else if(this.check_status==='0' && this.reviewDlgVisible){//审核页面且用户信息尚未存在
                        obj.order_no = row.order_no;
                        obj.appoint_id = row.appoint_id;// 预约订单号
                        obj.customer_type = row.customer_type;     // 用户类型
                        obj.customer_name = row.customer_name;//用户名称
                        obj.id_type = row.id_type;//证件类型
                        obj.id_code = row.id_code;//身份证号
                        obj.link_man = row.link_man;//联系地址
                        obj.link_address = row.link_address;//联系地址
                        obj.link_mobile = row.link_mobile;//手机号
                        obj.link_phone = row.link_phone;  //联系电话
                        obj.vehicle_code = row.vehicle_code;         //车牌号码
                        obj.vehicle_color = row.vehicle_color;         //车牌颜色
                        obj.only_cpu_card = row.only_cpu_card;         //通行卡颜色
                        obj.vehicle_type = row.vehicle_type;         //车型
                        obj.vehicle_user_type = row.vehicle_user_type;    //车辆用户类型
                        obj.vehicle_seat = row.vehicle_seat;       //座位数
                        obj.vehicle_engine = row.vehicle_engine;     //发动机号
                        obj.vehicle_distinguish = row.vehicle_distinguish;  //车辆识别代码
                        obj.vehicle_specificInfo = row.vehicle_specificInfo; //车辆特征描述
                        obj.card_type = row.card_type;           //ETC通行卡功能
                        obj.area_code = row.area_code;          //车籍地
                        obj.sign_channel = row.sign_channel;//签约渠道
                        obj.sign_no = row.sign_no;           //签约编号
                        obj.sign_card_no = row.sign_card_no;     //签约银行卡号
                        obj.sign_bank_code = row.sign_bank_code;     //签约银行
                }
                else{//审核页面且用户信息已存在
                    this.isNewAdd = true;
                    obj.order_no = row.order_no;          // 预约订单号
                    obj.appoint_id = row.appoint_id;
                    obj.customer_type = row.customer_type;     // 用户类型
                    obj.customer_name = row.customer_name;//用户名称
                    obj.id_type = row.id_type;//证件类型
                    obj.id_code = row.id_code;//身份证号
                    obj.link_man = row.link_man;//联系地址
                    obj.link_address = row.link_address;//联系地址
                    obj.link_mobile = row.link_mobile;//手机号
                    obj.link_phone = row.link_phone;  //联系电话
                    obj.vehicle_code = row.vehicle_code;         //车牌号码
                    obj.vehicle_color = row.vehicle_color;         //车牌颜色
                    obj.only_cpu_card = row.only_cpu_card;         //通行卡颜色
                    obj.vehicle_type = row.vehicle_type;         //车型
                    obj.vehicle_user_type = row.vehicle_user_type;    //车辆用户类型
                    obj.vehicle_seat = row.vehicle_seat;       //座位数
                    obj.vehicle_engine = row.vehicle_engine;     //发动机号
                    obj.vehicle_distinguish = row.vehicle_distinguish;  //车辆识别代码
                    obj.vehicle_specificInfo = row.vehicle_specificInfo; //车辆特征描述
                    obj.card_type = row.card_type;           //ETC通行卡功能
                    obj.area_code = row.area_code;          //车籍地
                    obj.sign_channel = row.sign_channel;//签约渠道
                    obj.sign_no = row.sign_no;           //签约编号
                    obj.sign_card_no = row.sign_card_no;     //签约银行卡号
                    obj.sign_bank_code = row.sign_bank_code;     //签约银行
                    let _this = this;
                    _this.$message({
                        showClose: true,
                        message: '当前用户信息已存在，您可为其车辆信息进行审核。',
                        type:'warning'
                    });
                    fetch({
                        url: api['getUserInfo'].url || '',
                        method: 'post',
                        data: {
                            method: api['getUserInfo'].method,
                            certificates_code: row.id_code,
                        }
                    }).then((res) => {
                        _this.UserInfo = res;
                        _this.personalUserInfo = {..._this.UserInfo[0]}
                        _this.setCustomerInfo({..._this.personalUserInfo});
                    }).catch((error) => {
                        _this.endLoading()
                        _this.$msgbox({
                            message: '读取用户信息失败:' + error.message,
                            title: '失败',
                            customClass: 'my_msgBox singelBtn',
                            confirmButtonText: '确定',
                            type: 'error',
                        })
                    })
                }
            },
            //确认审核
            async confirmReview(){
                if(this.check_status==='0'){//先新增用户再新增车辆
                    await this.saveInfo()
                    this.saveVehicleInfo()
                }
                else{//this.check_status==='1'用户已载入，只需新增车辆
                    this.saveVehicleInfo()

                }
            },
           //新增用户
            saveInfo() {
                let _this = this;
                _this.personalUserInfo.customer_name = _this.appointInfo.customer_name;//用户姓名
                _this.personalUserInfo.customer_type = _this.appointInfo.customer_type;//用户类型（默认为个人身份
                _this.personalUserInfo.certificates_type = _this.appointInfo.id_type;//证件类型（默认为身份证
                _this.personalUserInfo.certificates_code = _this.appointInfo.id_code;//证件号码
                _this.personalUserInfo.link_man = _this.appointInfo.link_man;//联系人
                _this.personalUserInfo.link_mobile = _this.appointInfo.link_mobile;//联系号码
                _this.personalUserInfo.link_phone = _this.appointInfo.link_phone;//联系电话
                _this.personalUserInfo.link_address = _this.appointInfo.link_address;//联系地址
                _this.personalUserInfo.reservation_id = _this.appointInfo.appoint_id;//预约编号
                _this.startLoading();
                return new Promise(((resolve, reject) => {
                    _this.UserInfo = _this.personalUserInfo
                    fetch({
                        url: api['regUser'].url || '',
                        method: 'post',
                        data: {
                            method: api['regUser'].method,
                            ...ignoreNull(_this.UserInfo),
                            customer_type: _this.customer_type
                        }
                    }).then(function (response) {
                        _this.endLoading()
                        //若为新建用户,将新建的用户信息set进store中
                        _this.setCustomerInfo({
                            ...ignoreNull(_this.UserInfo),
                            archives_no: response.archives_no,
                            customer_type: _this.customer_type,
                            open_date: response.open_date,
                            customer_id: response.customer_id,
                        });
                            resolve()
                    }).catch(function (err) {
                        _this.endLoading()
                        _this.$msgbox({
                            title: '警告',
                            message: '新增用户失败'+err.message,
                            customClass: 'my_msgBox singelBtn',
                            confirmButtonText: '确定',
                        })
                    })
                }))
            },
            //新增车辆
            saveVehicleInfo(){
                let _this = this
                _this.vehicleInfoWeb.vehicle_code = _this.appointInfo.vehicle_code;//车牌号码
                _this.vehicleInfoWeb.vehicle_color = _this.appointInfo.vehicle_color;//车牌颜色
                _this.vehicleInfoWeb.vehicle_type = _this.appointInfo.vehicle_type;//车型
                _this.vehicleInfoWeb.vehicle_user_type = _this.appointInfo.vehicle_user_type;//车辆用户类型
                _this.vehicleInfoWeb.vehicle_seat = _this.appointInfo.vehicle_seat;//座位数
                _this.vehicleInfoWeb.vehicle_city = _this.vehicle_city_Web;//车籍地
                _this.vehicleInfoWeb.vehicle_engine = _this.appointInfo.vehicle_engine;//发动机号
                _this.vehicleInfoWeb.vehicle_specificInfo = _this.appointInfo.vehicle_specificInfo;//车辆特征描述
                _this.vehicleInfoWeb.vehicle_distinguish = _this.appointInfo.vehicle_distinguish;//车辆识别代码
                _this.vehicleInfoWeb.card_type = _this.appointInfo.card_type;//ETC通行卡功能
                _this.vehicleInfoWeb.reservation_id = _this.appointInfo.appoint_id;//预约编号
                _this.vehicleInfoWeb.issue_obu = _this.appointInfo.only_cpu_card === '0' ? '1' : '0';//是否发行obu
                this.startLoading();
                fetch({
                    url: api['regVehicle'].url || '',
                    method: 'post',
                    data: {
                        method: api['regVehicle'].method,
                        ...ignoreNull(_this.vehicleInfoWeb),
                        customer_id : _this.customerInfo.customer_id,
                    }
                }).then(function (response) {
                    _this.vehicleInfoWeb = Object.assign(_this.vehicleInfoWeb, response)
                    _this.$store.commit('SET_VEHICLEINFO', _this.vehicleInfoWeb)
                    _this.endLoading()
                    _this.getUserInfo({
                        customer_id: _this.vehicleInfoWeb.customerId,
                    }, _this.vehicleInfoWeb.vehicle_code)

                    const h = _this.$createElement;
                    _this.$msgbox({
                        message: h('div', null, [
                            h('p', '用户名称：' + _this.$store.getters.customerInfo.customer_name),
                            h('p', '用户编号：'+ _this.$store.getters.customerInfo.customer_id),
                            h('p', '车牌号：' + _this.vehicleInfoWeb.vehicle_code),
                            h('p', '开户日期：' + _this.$store.getters.customerInfo.open_date),
                            h('p', '用户档案号：' + _this.$store.getters.customerInfo.archives_no),
                            h('p', '车辆档案号：' + _this.vehicleInfoWeb.vehicle_archives_no),
                        ]),
                        title: '提示',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确认',
                        type: 'success'
                    }).then(() => {
                        _this.reviewDlgVisible = false
                        _this.vehicleInfoWeb = defaultVars.vehicleInfo()
                        _this.reserveReset()
                        _this.reserveSearch()
                    });
                }).catch((err) => {
                    _this.endLoading()
                    this.$msgbox({
                        message: ( '新增车辆失败：') + err.message,
                        title: '失败',
                        customClass: 'my_msgBox singelBtn',
                        confirmButtonText: '确定',
                        type: 'error'
                    })
                })
            },
            //取消并返回用户预约界面
            returnReserve(){
                this.appointInfo.order_no = '';        // 预约订单号
                this.appointInfo.customer_type = '1';   // 用户类型
                this.appointInfo.customer_name = ''; // 用户名称
                this.appointInfo.id_type = '1';        // 证件类型
                this.appointInfo.id_code = '';          // 身份证号
                this.appointInfo.link_mobile = '';      // 手机号
                this.appointInfo.link_address = '';    // 联系地址
                this.appointInfo.link_phone = '';     // 联系电话
                this.appointInfo.link_man = '';           // 联系人
                this.appointInfo.vehicle_code ='';         //车牌号码
                this.appointInfo.vehicle_color = '';         //车牌颜色
                this.appointInfo.only_cpu_card = '0';         //通行卡颜色
                this.appointInfo.vehicle_type = '0';         //车型
                this.appointInfo.vehicle_user_type = '0';    //车辆用户类型
                this.appointInfo.vehicle_seat = '';       //座位数
                this.appointInfo.vehicle_engine = '';     //发动机号
                this.appointInfo.vehicle_distinguish = ''; //车辆识别代码
                this.appointInfo.vehicle_specificInfo = ''; //车辆特征描述
                this.appointInfo.card_type = '';            //ETC通行卡功能
                this.appointInfo.area_code = '0100';           //车籍地
                this.appointInfo.sign_channel = '';        //签约渠道
                this.appointInfo.sign_no = '';            //签约编号
                this.appointInfo.sign_card_no = '';      //签约银行卡号
                this.appointInfo.sign_bank_code = '';     //签约银行
                this.appointInfo.appoint_id = '';        //预约编码
                this.reviewDlgVisible = false;         //审核dialog关闭
                this.isNewAdd = false;               //用户是否已新增
            },
            // 点击展示大图
            toggleShowCustomerImage(file_code, index, name) {
                this.customerVisible = true;
                this.photoVisible = true;
                this.chooseImage = index;
                this.imgSrc = '/archives/display/L/' + file_code;
                this.imgName = name;
            },
            toggleShowVehicleImage(file_code, index, name) {
                this.vehicleVisible = true;
                this.photoVisible = true;
                this.chooseImage = index;
                this.imgSrc = '/archives/display/L/' + file_code;
                this.imgName = name;
            },
            closeImageShow() {
                this.photoVisible = false;
                this.vehicleVisible = false;
                this.customerVisible = false;
            },
            arrowClick(direction, name) {
                if(this.customerVisible){
                    if (direction === 'left') {
                        if (this.chooseImage >= 1) {
                            this.chooseImage = this.chooseImage - 1;
                            this.imgSrc = '/archives/display/L/' + this.customer_list[this.chooseImage].file_code;
                            this.imgName = this.getArchivesNameFilter(this.customer_list[this.chooseImage].photo_code)
                        } else {
                            this.noMore()
                        }
                    } else {
                        if (this.chooseImage < (this.customer_list.length - 1)) {
                            this.chooseImage = this.chooseImage + 1;
                            this.imgSrc = '/archives/display/L/' + this.customer_list[this.chooseImage].file_code;
                            this.imgName = this.getArchivesNameFilter(this.customer_list[this.chooseImage].photo_code)
                        } else {
                            this.noMore()
                        }
                    }
                }
                else{
                    if (direction === 'left') {
                        if (this.chooseImage >= 1) {
                            this.chooseImage = this.chooseImage - 1;
                            this.imgSrc = '/archives/display/L/' + this.vehicle_list[this.chooseImage].file_code;
                            this.imgName = this.getArchivesNameFilter(this.vehicle_list[this.chooseImage].photo_code)
                        } else {
                            this.noMore()
                        }
                    } else {
                        if (this.chooseImage < (this.vehicle_list.length - 1)) {
                            this.chooseImage = this.chooseImage + 1;
                            this.imgSrc = '/archives/display/L/' + this.vehicle_list[this.chooseImage].file_code;
                            this.imgName = this.getArchivesNameFilter(this.vehicle_list[this.chooseImage].photo_code)
                        } else {
                            this.noMore()
                        }
                    }
                }
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
            getArchivesNameFilter(val) {
                return getArchivesName(val);
            },
        },
        filters: {
            getVehicleUserTypeFilter(val) {
                return  getVehicleUserType(val);
            },
            getVehicleColorFilter(val) {
                return getVehicleColor(val);
            },
            getsignBankCodeFilter(val) {
                return getsignBankCode(val);
            },
            getshipppingMethodFilter(val){
                return getshippingMethods(val);
            },

        },
    }

</script>

<style type="text/scss" lang="scss" scoped>
    @import "../../../styles/mixin";
    @import "../../../styles/common";

    .appointInput{
        margin: 10px 45px;
    }
    .appointInputUpper{
        margin:3px 45px 10px 45px
    }
    .accountPagination{
        padding: 5px 20px;
    }
    .title {
        letter-spacing: 2px;
        font-family: 'PingFangSC-Regular';
        text-align: left;
        height: 22px;
        line-height: 22px;
        color: #000000;
        border-left: 2px solid #5584ff;
        padding: 12px 0px 12px 12px;

        span {
            color: #a0a2ad;
            font-size: 12px;
            display: inline-block;
            margin-left: 100px;
        }
    }

    .web-el-select{
        width: 65px;
    }
    .web-sel-item{
        width : 110px
    }


    .search_box {
        padding: 10px 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .search_label {
            width: 100px;
            text-align: left;
        }
    }
    .reserve-web-dialog{
        margin-top: 12.8vh;

        .el-dialog{
            width: 80%;
            max-width: 1248px;
        }
        .reserve-container{
            height: $dialog-height;
            overflow-y: auto;
            .new-user-container{
                margin: 30px;
            }
            .vehicle-info-container{
                margin: 30px;
            }
        }
    }
    .test{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .acResetBtn{
        margin: 0px 0px 0px 10px;
        border-color: #DCDFE6;
        background: #FFFFFF;
        color: #606266;
    }
    .ArchivesPhoto{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .webtext{
        color: red;
        font-size: 22px;
        padding: 10px;
        margin-left: 20px;
    }
</style>