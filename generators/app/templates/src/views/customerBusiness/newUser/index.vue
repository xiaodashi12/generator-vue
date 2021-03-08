<template>
    <div class="new-user-container">
        <div class="new-user-dialog">
            <div class="new-user-content">
<!--                <div class="new-user-appointment">-->
<!--                    <div>渠道预约：</div>-->
<!--                    <el-button size="mini" @click="showReserveSearch" class="reserve-search">预约查询-->
<!--                    </el-button>-->
<!--                </div>-->
                <!-- 个人-->
                <el-form ref="personal" v-show="customer_type==='1'" size="medium" :model="personalUserInfo"
                         :rules="personalUserRules"
                         label-width="100px">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户类型：" prop="customer_type">
                                <el-radio-group v-model="customer_type" @change="userTypeChange"
                                                :disabled="appointIsEdit"
                                                label="1">
                                    <el-radio-button v-for="(value,key) in customerTypeList" :label="key" :key="key">
                                        {{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户名称：" prop="customer_name">
                                <el-radio-group label="1">
                                    <el-input :class="isPersonalOcr ? 'ocrRecognition':''"
                                              placeholder="请填写用户名称"
                                              :disabled= "appointIsEdit"
                                              v-model="personalUserInfo.customer_name "></el-input>
                                    <div class="ocr_scanning" v-if="personalUserInfo.certificates_type === '1'&& !appointIsEdit">
                                        <img :src="require('@assets/ocr.png')" @click="openCamDialog('')"/>
                                    </div>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件类型：" prop="certificates_type">
                                <el-select size="medium"  :disabled="appointIsEdit" v-model="personalUserInfo.certificates_type" placeholder="请选择">
                                    <el-option
                                            v-for="(item, index) in personalOCRType"
                                            :key="index"
                                            :label="item"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件号码：" prop="certificates_code">
                                <el-radio-group label="1">
                                    <el-input maxlength="18"  :class="isPersonalOcr ? 'ocrRecognition':''"
                                              placeholder="用于绑定电子发票平台"
                                              :disabled="appointIsEdit"
                                              v-model="personalUserInfo.certificates_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="手机号码：" prop="link_mobile">
                                <el-radio-group label="1">
                                    <el-input placeholder="用于绑定电子发票平台"
                                              :disabled="appointIsEdit"
                                              v-model="personalUserInfo.link_mobile"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系地址：" prop="link_address">
                                <el-radio-group label="1">
                                    <el-input :class="isPersonalOcr ? 'ocrRecognition':''"
                                              placeholder="联系地址"
                                              v-model="personalUserInfo.link_address"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--经办人&&联系电话-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系人：" prop="link_man">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系人/经办人" v-model="personalUserInfo.link_man"></el-input>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系电话：" prop="link_phone">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系电话" v-model="personalUserInfo.link_phone"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--邮政编码：&&EMail：-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="邮政编码：" prop="posttal_code">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入邮政编码" v-model="personalUserInfo.posttal_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="EMail：" prop="email">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入电子邮件地址" v-model="personalUserInfo.email"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--备注-->
                    <el-form-item class="my_form_label" label="备注：" prop="remark">
                        <el-radio-group label="1">
                            <el-input placeholder="请输入备注信息" type="textarea" :cols="20"
                                      v-model="personalUserInfo.remark"></el-input>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <!-- 企业-->
                <el-form ref="enterprise" v-show="customer_type==='2'" size="medium" :model="enterpriseUserInfo"
                         :rules="enterpriseUserRules"
                         label-width="100px">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户类型：" prop="customer_type">
                                <el-radio-group v-model="customer_type" @change="userTypeChange"
                                                label="1">
                                    <el-radio-button v-for="(value,key) in customerTypeList" :label="key" :key="key">
                                        {{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户名称：" prop="customer_name">
                                <el-radio-group label="1">
                                    <el-input v-model="enterpriseUserInfo.customer_name"  placeholder="请填写企业名称"></el-input>
                                    <div class="ocr_scanning" :class="isEnterpriseOcr ? 'ocrRecognition':''"
                                         v-if="enterpriseUserInfo.certificates_type === '3'">
                                        <img :src="require('@assets/ocr.png')" @click="openCamDialog('organization')"/>
                                    </div>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件类型：" prop="certificates_type">
                                <el-select size="medium" v-model="enterpriseUserInfo.certificates_type"
                                           placeholder="请选择">
                                    <el-option
                                            v-for="(item, index) in enterpriseOCRType"
                                            :key="index"
                                            :label="item"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件号码：" prop="certificates_code">
                                <el-radio-group label="1">
                                    <el-input :class="isEnterpriseOcr ? 'ocrRecognition':''"
                                              placeholder="用于绑定电子发票平台"
                                              v-model="enterpriseUserInfo.certificates_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="手机号码：" prop="link_mobile">
                                <el-radio-group label="1">
                                    <el-input placeholder="用于绑定电子发票平台"
                                              v-model="enterpriseUserInfo.link_mobile"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系地址：" prop="link_address">
                                <el-radio-group label="1">
                                    <el-input :class="isEnterpriseOcr ? 'ocrRecognition':''"
                                              placeholder="联系地址"
                                              v-model="enterpriseUserInfo.link_address"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--经办人&&联系电话-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="经办人：" prop="link_man">
                                <el-radio-group label="1">
                                    <el-input :class="isPersonEnterpriseOcr?'ocrRecognition':''" placeholder="联系人/经办人"
                                              v-model="enterpriseUserInfo.link_man"></el-input>
                                    <div class="ocr_scanning" v-if="enterpriseUserInfo.agent_id_type === '1'">
                                        <img :src="require('@assets/ocr.png')" @click="openCamDialog('')"/>
                                    </div>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系电话：" prop="link_phone">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系电话" v-model="enterpriseUserInfo.link_phone"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--                经办人证件类型&&经办人证件号码-->
                    <el-row :span="24">
                        <el-col :span="12">

                            <el-form-item class="my_form_item" prop="agent_id_type">
                                <div class="my_form_item_label" slot="label">
                                    <div class="my_form_item_star">*</div>
                                    <div>
                                        <div class="my_form_item_label_top">经办人</div>
                                        <div class="my_form_item_label_bottom">证件类型</div>
                                    </div>
                                    <div class="my_form_item_colon">：</div>
                                </div>

                                <div class="my_form_item_input">
                                    <el-select size="medium" v-model="enterpriseUserInfo.agent_id_type"
                                               placeholder="请选择">
                                        <el-option
                                                v-for="(item, index) in personalOCRType"
                                                :key="index"
                                                :label="item"
                                                :value="index">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">


                            <el-form-item class="my_form_item" prop="agent_id_num">
                                <div class="my_form_item_label" slot="label">
                                    <div class="my_form_item_star">*</div>
                                    <div>
                                        <div class="my_form_item_label_top">经办人</div>
                                        <div class="my_form_item_label_bottom">证件号码</div>
                                    </div>
                                    <div class="my_form_item_colon">：</div>
                                </div>

                                <div class="my_form_item_input">
                                    <el-radio-group>
                                        <el-input maxlength="18"  :class="isPersonEnterpriseOcr?'ocrRecognition':''"
                                                  placeholder="经办人证件号码"
                                                  v-model="enterpriseUserInfo.agent_id_num"></el-input>
                                    </el-radio-group>
                                </div>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <!--邮政编码：&&EMail：-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="邮政编码：" prop="posttal_code">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入邮政编码"
                                              v-model="enterpriseUserInfo.posttal_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="EMail：" prop="email">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入电子邮件地址" v-model="enterpriseUserInfo.email"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--邮政编码：&&EMail：-->
                    <el-form-item class="my_form_label" label="备注：" prop="remark">
                        <el-radio-group label="1">
                            <el-input placeholder="请输入备注信息" type="textarea" :cols="20"
                                      v-model="enterpriseUserInfo.remark"></el-input>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <!-- 事业或政府单位-->
                <el-form ref="government" v-show="customer_type==='3'" size="medium" :model="governmentUserInfo"
                         :rules="governmentUserRules"
                         label-width="100px">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户类型：" prop="customer_type">
                                <el-radio-group v-model="customer_type" @change="userTypeChange"
                                                label="1">
                                    <el-radio-button v-for="(value,key) in customerTypeList" :label="key" :key="key">
                                        {{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="用户名称：" prop="customer_name">
                                <el-radio-group label="1">
                                    <el-input v-model="governmentUserInfo.customer_name" placeholder="请填写单位名称" ></el-input>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件类型：" prop="certificates_type">
                                <el-select size="medium" v-model="governmentUserInfo.certificates_type"
                                           placeholder="请选择">
                                    <el-option
                                            v-for="(item, index) in governmentOCRType"
                                            :key="index"
                                            :label="item"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="证件号码：" prop="certificates_code">
                                <el-radio-group label="1">
                                    <el-input v-model="governmentUserInfo.certificates_code" placeholder="用于绑定电子发票平台"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="单位级别：" prop="unit_level">
                                <el-radio-group v-model="governmentUserInfo.unit_level"
                                                label="1">
                                    <el-radio-button v-for="(value,key) in companyDetailsLevelList" :label="key"
                                                     :key="key">
                                        {{value}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="单位属性：" prop="unit_attribute">
                                <el-select size="medium" v-model="governmentUserInfo.unit_attribute" placeholder="请选择">
                                    <el-option
                                            v-for="(item, index) in companyAttrList"
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
                            <el-form-item class="my_form_label" label="手机号码：" prop="link_mobile">
                                <el-radio-group label="1">
                                    <el-input placeholder="用于绑定电子发票平台"
                                              v-model="governmentUserInfo.link_mobile"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系地址：" prop="link_address">
                                <el-radio-group label="1">
                                    <el-input v-model="governmentUserInfo.link_address"  placeholder="联系地址"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--经办人&&联系电话-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="经办人：" prop="link_man">
                                <el-radio-group label="1">
                                    <el-input :class="isGovernmentOcr ? 'ocrRecognition':''" placeholder="联系人/经办人"
                                              v-model="governmentUserInfo.link_man"></el-input>
                                    <div class="ocr_scanning">
                                        <img :src="require('@assets/ocr.png')" @click="openCamDialog('')"/>
                                    </div>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="联系电话：" prop="link_phone">
                                <el-radio-group label="1">
                                    <el-input placeholder="联系电话" v-model="governmentUserInfo.link_phone"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--                经办人证件类型&&经办人证件号码-->
                    <el-row :span="24">
                        <el-col :span="12">

                            <el-form-item class="my_form_item" prop="agent_id_type">
                                <div class="my_form_item_label" slot="label">
                                    <div class="my_form_item_star">*</div>
                                    <div>
                                        <div class="my_form_item_label_top">经办人</div>
                                        <div class="my_form_item_label_bottom">证件类型</div>
                                    </div>
                                    <div class="my_form_item_colon">：</div>
                                </div>

                                <div class="my_form_item_input">
                                    <el-select v-model="governmentUserInfo.agent_id_type"
                                               placeholder="请选择">
                                        <el-option
                                                v-for="(item, index) in personalOCRType"
                                                :key="index"
                                                :label="item"
                                                :value="index">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>

                        </el-col>
                        <el-col :span="12">

                            <el-form-item class="my_form_item" prop="agent_id_num">
                                <div class="my_form_item_label" slot="label">
                                    <div class="my_form_item_star">*</div>
                                    <div>
                                        <div class="my_form_item_label_top">经办人</div>
                                        <div class="my_form_item_label_bottom">证件号码</div>
                                    </div>
                                    <div class="my_form_item_colon">：</div>
                                </div>

                                <div class="my_form_item_input">
                                    <el-radio-group>
                                        <el-input maxlength="18"  :class="isGovernmentOcr ? 'ocrRecognition':''"
                                                  placeholder="经办人证件号码"
                                                  size="medium"
                                                  v-model="governmentUserInfo.agent_id_num"></el-input>
                                    </el-radio-group>
                                </div>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <!--邮政编码：&&EMail：-->
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="邮政编码：" prop="posttal_code">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入邮政编码"
                                              v-model="governmentUserInfo.posttal_code"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item class="my_form_label" label="EMail：" prop="email">
                                <el-radio-group label="1">
                                    <el-input placeholder="请输入电子邮件地址" v-model="governmentUserInfo.email"></el-input>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--邮政编码：&&EMail：-->
                    <el-form-item class="my_form_label" label="备注：" prop="remark">
                        <el-radio-group label="1">
                            <el-input placeholder="请输入备注信息" type="textarea" :cols="20"
                                      v-model="governmentUserInfo.remark"></el-input>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <el-form size="medium"
                         label-width="100px">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-form-item class="my_form_label"
                                          v-show="appointIsEdit"
                                          label="申领证件：" prop="customer_type">
                                <div class="ArchivesPhoto">
                                    <checkArchives v-for="(item, index) in list" @toggleShowImage="toggleShowImage" :ind="index" :file_code="item.file_code" :name="getArchivesNameFilter(item.photo_code)"></checkArchives>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <dlg-footer :btninfos="ftBtnArrays.customerInfo" @ftClick="ftClick"></dlg-footer>
        </div>
        <el-dialog width="350" height="100%" id="new-user-reserve" title="用户预约查询" :visible.sync="reserveDlgVisible"
                   append-to-body>
            <el-row :span="24" class="test">
                <el-col :span="10">
                    <div class="search_box">
                        <div class="search_label">证件号码：</div>
                        <el-input placeholder="请输入证件号码" size="small" width="100" v-model="search_card">
                            <el-button slot="append" size="mini" @click="reserveSearch('card')"
                                       icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="search_box">
                        <div class="search_label">手机号：</div>
                        <el-input placeholder="请输入手机号" size="small" width="100" v-model="search_phone">
                            <el-button slot="append" size="mini" @click="reserveSearch('phone')"
                                       icon="el-icon-search"></el-button>
                        </el-input>
                    </div>

                </el-col>
            </el-row>
            <el-table :data="reserveList" stripe @row-click="selectReserve" style="width: 100%"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <el-table-column align='center' prop="reservation_id" label="预约编号"></el-table-column>
                <el-table-column align='center' prop="customer_name" label="用户名称"></el-table-column>
                <el-table-column align='center' prop="customer_type" label="用户类型"></el-table-column>
                <el-table-column align='center' prop="unit_level" label="单位属性"></el-table-column>
                <el-table-column align='center' prop="license_type" label="证件类型"></el-table-column>
            </el-table>
        </el-dialog>
        <PhotoDialog :transfer="dialog" @PhotoftClick="photoftClick" @onCloseDialog="onCloseDialog"></PhotoDialog>
        <PhotoComponent @arrowClick="arrowClick" :name="imgName" @closeImageShow="closeImageShow" :photoVisible="photoVisible"
                        :imgSrc="imgSrc"></PhotoComponent>
    </div>
</template>
<script>
    import DlgFooter from "@/components/Dialog/DlgFooter";
    import PhotoDialog from '@/components/PhotoDialog'
    import PhotoComponent from '@/components/PhotoComponent'
    import {cmds, ftBtns} from "@/utils/ftBtnConsts";
    import {dataUrlToBlob, getArchivesName} from "@/utils/utils";
    import fetch from '@utils/fetch';
    import api from '@/api';
    import {ignoreNull} from '@utils/arrayUtils';
    import {Loading, MessageBox} from 'element-ui';
    import * as dict from "@utils/dictionaries"
    import {getToken} from '@/utils/auth';
    import axios from 'axios'
    import {mapGetters, mapActions} from 'vuex'
    import checkArchives from '@/components/checkArchives';
    let ws;
    export default {
        name: "ObuIssue",
        components: {
            DlgFooter,
            checkArchives,
            PhotoComponent,
            PhotoDialog
        },
        props: {
            btninfos: {
                type: Array,
                requeired: true
            },
            idx: {//当前步骤条
                type: Number,
                default: ''
            }
        },
        data() {
            // 个人身份证或者军官证验证
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('证件号码不能为空'));
                } else {
                    if (this.personalUserInfo.certificates_type === '1') {
                        // 身份证
                        if (!/^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)\d{15}(\d{1}|X)$/.test(value)) {
                            callback(new Error('请输入正确的身份证号码!'));
                        }
                    } else if (this.personalUserInfo.certificates_type === '2') {
                        // 军官证
                        if (!/^[\u2E80-\uFE4F\w\-—]+$/.test(value)) {
                            callback(new Error('请输入正确的证件号码!'));
                        }
                    } else {
                        // 其他证件
                        if (!/^[\w()\-（）—\/]+$/.test(value)) {
                            callback(new Error('请输入正确的证件号码!'));
                        }
                    }
                    callback()

                }
            };
            // 企业经办人证件号码校验
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('证件号码不能为空'));
                } else {
                    if (this.enterpriseUserInfo.agent_id_type === '1') {
                        // 身份证
                        if (!/^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)\d{15}(\d{1}|X)$/.test(value)) {
                            callback(new Error('请输入正确的经办人身份证号码!'));
                        }
                    } else if (this.enterpriseUserInfo.agent_id_type === '2') {
                        // 军官证
                        if (!/^[\u2E80-\uFE4F\w\-—]+$/.test(value)) {
                            callback(new Error('请输入正确的经办人证件号码!'));
                        }
                    } else {
                        // 其他证件
                        if (!/^[\w()\-（）—\/]+$/.test(value)) {
                            callback(new Error('请输入正确的经办人证件号码!'));
                        }
                    }
                    callback()
                }
            };
            var validatePass3 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('证件号码不能为空'));
                } else {
                    if (this.governmentUserInfo.agent_id_type === '1') {
                        // 身份证
                        if (!/^(11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65)\d{15}(\d{1}|X)$/.test(value)) {
                            callback(new Error('请输入正确的经办人身份证号码!'));
                        }
                    } else if (this.governmentUserInfo.agent_id_type === '2') {
                        // 军官证
                        if (!/^[\u2E80-\uFE4F\w\-—]+$/.test(value)) {
                            callback(new Error('请输入正确的经办人证件号码!'));
                        }
                    } else {
                        // 其他证件
                        if (!/^[\w()\-（）—\/]+$/.test(value)) {
                            callback(new Error('请输入正确的经办人证件号码!'));
                        }
                    }
                    callback()
                }
            };
            var posttal_code_check = (rule, value, callback) => {
                if (value) {
                    if (!/^[1-9][0-9]{5}$/.test(value)) {
                        callback(new Error('请输入正确的邮政编码!'));
                    } else {
                        callback();
                    }
                }
                callback();
            };
            var email_check = (rule, value, callback) => {
                if (value) {
                    if (!/\w@\w*\.\w/.test(value)) {
                        callback(new Error('请输入正确的邮箱!'));
                    } else {
                        callback();
                    }
                }
                callback();
            };
            var phone_check = (rule, value, callback) => {
                if (value) {
                    if (!/^0[1-9][0-9]{1,2}-[1-9][0-9]{5,7}(-[0-9]{1,5})?|1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
                        callback(new Error('请输入正确的联系电话!'));
                    } else {
                        callback();
                    }
                }
                callback();
            };
            return {
                photoVisible: false,
                idEdit: false,
                imgSrc: '',
                imgName: '',
                list: [],
                pictureList: [],
                chooseImage: 0,
                dialog: {
                    visible: false,
                },
                originCustomerType: '', // 保存原始用户类型，为编辑用户提示，是否放弃编辑信息，做依据
                isPersonalOcr: false, // 判断当前填写个人信息的是否是ocr识别的
                isEnterpriseOcr: false, // 判断当前填写企业信息的是否是ocr识别的
                isPersonEnterpriseOcr: false, // 判断当前填写企业经办人信息的是否是ocr识别的
                isGovernmentOcr: false, // 判断当前填写的事业单位信息是否是ocr识别的
                UserInfo: {},
                search_card: '',  // 搜索条件-》证件号码
                search_phone: '',  // 搜索条件-》手机号码
                reserveList: [],
                imgBase64: '',
                photoType: '',
                ftBtnArrays: ftBtns,
                dialogVisible: false,
                reserveDlgVisible: false,
                //用户类型字典
                customerTypeList: dict.customerType,
                userCardTypeList: dict.certificatesType,
                //个人证件类型字典
                personalOCRType: dict.personalOCRType,
                // 企业类型字典
                enterpriseOCRType: dict.enterpriseOCRType,
                //事业或政府单位类型字典
                governmentOCRType: dict.governmentOCRType,
                companyDetailsLevelList: dict.companyDetailsLevel,
                companyAttrList: dict.companyAttr,
                customer_type: '1',         // 用户类型索引
                personalUserInfo: {
                    customer_name: '',          // 用户名称
                    certificates_type: '1',     // 证件类型
                    certificates_code: '',   // 证件号码
                    link_mobile: '',       // 手机号码
                    link_address: '',    // 联系地址
                    link_phone: '',     // 联系电话：
                    link_man: '',           // 经办人
                    posttal_code: '',        // 邮政编码
                    email: '',              // EMail
                    remark: '',              // 备注：
                },
                personalUserRules: {
                    customer_name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {
                            pattern: '(^[A-Za-z\\s••.]+$)|(^[\u2E80-\\uFE4F••.]+$)',
                            message: '请输入正确的用户名称',
                            trigger: 'blur'
                        }
                    ],
                    certificates_type: [
                        {required: true, message: '请选择证件类型', trigger: 'blur'},
                    ],
                    certificates_code: [
                        {
                            required: true,
                            validator: validatePass2,
                            trigger: 'blur'
                        }
                    ],
                    link_mobile: [
                        {
                            required: true,
                            pattern: '(^1[3|4|5|6|7|8|9][0-9]{9})$',
                            message: '请输入正确的手机号码',
                            trigger: 'blur'
                        }
                    ],
                    link_address: [
                        {
                            required: true,
                            pattern: '^[\u2E80-\\uFE4F\\w.+()（）\\-—\\/&:：#&*《》、，,.。~••“”\\"\\"【】\\[\\]]+$',
                            message: '请输入正确的联系地址',
                            trigger: 'blur'
                        },
                    ],
                    link_man: [
                        {
                            required: true,
                            pattern: '(^[A-Za-z\\s••.]+$)|(^[\u2E80-\\uFE4F••.]+$)',
                            message: '请输入正确的联系人/经办人',
                            trigger: 'blur'
                        },
                        {max: 100, message: '最长支持100个字符', trigger: 'blur'},
                    ],
                    link_phone: [
                        {
                            required: false,
                            validator: phone_check,
                            trigger: 'blur'
                        },
                    ],
                    posttal_code: [
                        {
                            required: false,
                            validator: posttal_code_check,
                            trigger: 'blur'
                        },
                    ],
                    email: [
                        {
                            required: false,
                            validator: email_check,
                            trigger: 'blur'
                        },
                    ],
                },
                enterpriseUserInfo: {
                    customer_name: '',          // 用户名称
                    certificates_type: '3',     // 证件类型
                    certificates_code: '',   // 证件号码
                    link_mobile: '',       // 手机号码
                    link_address: '',    // 联系地址
                    link_phone: '',     // 联系电话：
                    link_man: '',           // 经办人
                    agent_id_type: '1', // 经办人证件类型
                    agent_id_num: '', // 经办人证件号码
                    posttal_code: '',        // 邮政编码
                    email: '',              // EMail
                    remark: '',              // 备注：
                },
                enterpriseUserRules: {
                    customer_name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {
                            pattern: '^[\u2E80-\\uFE4F\\w()（）.\\-••—\\/\\&《》]+$',
                            message: '请输入正确的用户名称',
                            trigger: 'blur'
                        }
                    ],
                    certificates_type: [
                        {required: true, message: '请选择证件类型', trigger: 'blur'},

                    ],
                    certificates_code: [
                        {
                            required: true,
                            pattern: '^[\\w()\\-（）—\\/]+$',
                            message: '请输入正确的证件号码',
                            trigger: 'blur'
                        }
                    ],
                    link_mobile: [
                        {
                            required: true,
                            pattern: '(^1[3|4|5|6|7|8|9][0-9]{9})$',
                            message: '请输入正确的手机号码',
                            trigger: 'blur'
                        }
                    ],
                    link_address: [
                        {
                            required: true,
                            pattern: '^[\u2E80-\\uFE4F\\w.+()（）\\-—\\/&:：#&*《》、，,.。~••“”\\"\\"【】\\[\\]]+$',
                            message: '请输入正确的联系地址',
                            trigger: 'blur'
                        },
                    ],
                    link_man: [
                        {
                            required: true,
                            pattern: '(^[A-Za-z\\s••.]+$)|(^[\u2E80-\\uFE4F••.]+$)',
                            message: '请输入正确的联系人/经办人',
                            trigger: 'blur'
                        },
                        {max: 100, message: '最长支持100个字符', trigger: 'blur'},
                    ],
                    link_phone: [
                        {
                            required: false,
                            validator: phone_check,
                            trigger: 'blur'
                        },
                    ],
                    agent_id_type: [
                        {required: true, trigger: 'blur'},
                    ],
                    agent_id_num: [
                        {
                            required: true,
                            validator: validatePass1,
                            trigger: 'blur'
                        }
                    ],
                    posttal_code: [
                        {
                            required: false,
                            validator: posttal_code_check,
                            trigger: 'blur'
                        },
                    ],
                    email: [
                        {
                            required: false,
                            validator: email_check,
                            trigger: 'blur'
                        },
                    ],
                },

                governmentUserInfo: {
                    customer_name: '',          // 用户名称
                    certificates_type: '4',     // 证件类型
                    certificates_code: '',   // 证件号码
                    unit_level: '0',      // 单位级别
                    unit_attribute: '0',  // 单位属性
                    link_mobile: '',       // 手机号码
                    link_address: '',    // 联系地址
                    link_phone: '',     // 联系电话：
                    link_man: '',           // 经办人
                    agent_id_type: '1', // 经办人证件类型
                    agent_id_num: '', // 经办人证件号码
                    posttal_code: '',        // 邮政编码
                    email: '',              // EMail
                    remark: '',              // 备注：
                },
                governmentUserRules: {
                    customer_name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {
                            pattern: '^[\u2E80-\\uFE4F\\w()（）.\\-••—\\/\\&《》]+$',
                            message: '请输入正确的用户名称',
                            trigger: 'blur'
                        }
                    ],
                    certificates_type: [
                        {required: true, message: '请选择证件类型', trigger: 'blur'},
                    ],
                    certificates_code: [
                        {
                            required: true,
                            pattern: '^[\\w()\\-（）—\\/]+$',
                            message: '请输入正确的组织机构代码证',
                            trigger: 'blur'
                        }
                    ],
                    link_mobile: [
                        {
                            required: true,
                            pattern: '(^1[3|4|5|6|7|8|9][0-9]{9})$',
                            message: '请输入正确的手机号码',
                            trigger: 'blur'
                        }
                    ],
                    link_address: [
                        {
                            required: true,
                            pattern: '^[\u2E80-\\uFE4F\\w.+()（）\\-—\\/&:：#&*《》、，,.。~••“”\\"\\"【】\\[\\]]+$',
                            message: '请输入正确的联系地址',
                            trigger: 'blur'
                        },
                    ],
                    link_man: [
                        {
                            required: true,
                            pattern: '(^[A-Za-z\\s••.]+$)|(^[\u2E80-\\uFE4F••.]+$)',
                            message: '请输入正确的联系人/经办人',
                            trigger: 'blur'
                        },
                        {max: 100, message: '最长支持100个字符', trigger: 'blur'},
                    ],
                    link_phone: [
                        {
                            required: false,
                            validator: phone_check,
                            trigger: 'blur'
                        },
                    ],
                    agent_id_type: [
                        {required: true, trigger: 'blur'},
                    ],
                    agent_id_num: [
                        {
                            required: true,
                            validator: validatePass3,
                            trigger: 'blur'
                        }
                    ],
                    posttal_code: [
                        {
                            required: false,
                            validator: posttal_code_check,
                            trigger: 'blur'
                        },
                    ],
                    email: [
                        {
                            required: false,
                            validator: email_check,
                            trigger: 'blur'
                        },
                    ],
                },
            };
        },
        computed: {
            ...mapGetters([
                'modelType',
                'customerInfo',
                'cancelVehicle',
                'appointInfo'
            ]),
            appointIsEdit: {
                get: function () {
                    if( !!(this.$store.getters.appointInfo.order_no) ){ return true }
                    else { return false }
                },
            },
        },
        destroyed: function () {
            this.$store.getters.appointInfo.order_no= ''
        },
        mounted() {
            //console.log(this.customerInfo, 'this.customerInfo');
            if (this.modelType !== 'newuser' || this.cancelVehicle) {
                // 编辑用户
                this.idEdit = true;
                this.customer_type = this.customerInfo.customer_type;
                this.originCustomerType = this.customerInfo.customer_type;
                let str = this.customer_type === '1' ? 'personalUserInfo' : (this.customer_type === '2' ? 'enterpriseUserInfo' : 'governmentUserInfo')

                this[str] = {...this.customerInfo}
                this.UserInfo = {...this.customerInfo};
            } else {
                // 新建用户
                this.idEdit = false;
                if(this.$store.getters.appointInfo.order_no){//若预约信息存在，则直接从预约信息里获值
                  let parmas = {
                    order_no: this.$store.getters.application_order_no,
                    type: '1'
                  }
                  fetch({
                    url: api['internetArchives'].url ,
                    method: 'post',
                    data: {
                      method:api['internetArchives'].method,
                      ...parmas
                    }
                  }).then(res=>{
                    this.list = res;
                    console.log(res, 'res');
                  }).catch(err=>{
                    console.log(err, 'err');
                  })
                    this.personalUserInfo.customer_name = this.$store.getters.appointInfo.customer_name;//用户姓名
                    this.$store.getters.appointInfo.customer_name = '';
                    this.personalUserInfo.customer_type = this.$store.getters.appointInfo.customer_type;//用户类型（默认为个人身份
                    this.$store.getters.appointInfo.customer_type = '1';
                    this.personalUserInfo.certificates_type = this.$store.getters.appointInfo.id_type;//证件类型（默认为身份证
                    this.$store.getters.appointInfo.id_type = '1';
                    this.personalUserInfo.certificates_code = this.$store.getters.appointInfo.id_code;//证件号码
                    this.$store.getters.appointInfo.id_code = '';
                    this.personalUserInfo.link_man = this.$store.getters.appointInfo.link_man;//联系人
                    this.$store.getters.appointInfo.link_man = '';
                    this.personalUserInfo.link_mobile = this.$store.getters.appointInfo.link_mobile;//联系号码
                    this.$store.getters.appointInfo.link_mobile = '';
                    this.personalUserInfo.link_phone = this.$store.getters.appointInfo.link_phone;//联系电话
                    this.$store.getters.appointInfo.link_phone = '';
                    this.personalUserInfo.link_address = this.$store.getters.appointInfo.link_address;//联系地址
                    this.$store.getters.appointInfo.link_address = '';
                    this.personalUserInfo.reservation_id = this.$store.getters.appointInfo.appoint_id;//联系地址
                }
                this.UserInfo = this.personalUserInfo;
            }
        },
          beforeDestroy() {
            console.log('用户页面销毁');
            this.setCancelVehicle(false)
          },
        methods: {
            ...mapActions([
                'setCustomerInfo',
                'setVehicleInfo',
                'setModelType',
                'setCancelVehicle',
            ]),
            // 点击展示大图
            toggleShowImage(file_code, index, name) {
                this.photoVisible = true;
                this.chooseImage = index;
                this.imgSrc = '/archives/display/L/' + file_code;
                this.imgName = name;
            },
            closeImageShow() {
                this.photoVisible = false;
            },
            arrowClick(direction, name) {
              if (direction === 'left') {
                if (this.chooseImage >= 1) {
                  this.chooseImage = this.chooseImage - 1;
                  this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                  this.imgName = this.getArchivesNameFilter(this.list[this.chooseImage].photo_code)
                } else {
                  this.noMore()
                }
              } else {
                if (this.chooseImage < (this.list.length - 1)) {
                  this.chooseImage = this.chooseImage + 1;
                  this.imgSrc = '/archives/display/L/' + this.list[this.chooseImage].file_code;
                  this.imgName = this.getArchivesNameFilter(this.list[this.chooseImage].photo_code)
                } else {
                  this.noMore()
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
            onCloseDialog() {
                this.dialog.visible = false;
            },
            reserveSearch(type) {
                if (!(this.search_card || this.search_phone)) {
                    this.$message({
                        showClose: true,
                        message: '请输入证件号码或手机号进行查询',
                        type: 'warning'
                    });
                    return false;
                }

                fetch({
                    url: api['userReservation'].url || '',
                    method: 'post',
                    data: {
                        method: api['userReservation'].method,
                        license_no: this.search_card,
                        phone: this.search_phone,
                    }
                }).then((res) => {
                    console.log(res, 'res');
                    this.reserveList = res;
                }).catch((err) => {
                    console.log(err, 'err');
                })
            },
            selectReserve(row) {
                this.customer_type = row.customer_type;
                let obj = undefined;
                if (this.customer_type === '1') {
                    obj = this.personalUserInfo;
                } else if (this.customer_type === '2') {
                    obj = this.enterpriseUserInfo;
                } else {
                    obj = this.governmentUserInfo;
                }
                obj.unit_level = row.unit_level;
                obj.customer_name = row.customer_name;

                obj.license_type = row.license_type;

                obj.license_no = row.license_no;
                obj.contacts = row.contacts;                //联系人
                obj.post_code = row.post_code;              // 邮编
                obj.phone = row.phone;                      //电话号码
                obj.mobile = row.mobile;                    //手机
                obj.address = row.address;                  //联系地址
                obj.email = row.email;                      //email
            },
            showReserveSearch: function () {
                this.reserveDlgVisible = true;

            },
            photoftClick(val) {
                this.imgBase64 = val;
                this.upload()

                // this.setImg();
            },
            // 扫描事件处理
            openCamDialog(type) {
                this.photoType = type;
                this.dialog.visible = true;
            },

            saveInfo() {
                let _this = this;
                let customer_type = _this.customer_type === '1' ? 'personal' : (_this.customer_type === '2' ? 'enterprise' : 'government')
                console.log('_+_+_+_',customer_type,'____+++');
                console.log('++++++',this.$refs[customer_type],'++_____++');
                this.$refs[customer_type].validate(valid => {
                    if (valid) {
                        _this.startLoading();
                        return new Promise(((resolve, reject) => {
                            let str = _this.idEdit ? 'editUser' : 'regUser'
                            _this.UserInfo = _this.customer_type === '1' ? _this.personalUserInfo : (_this.customer_type === '2' ? _this.enterpriseUserInfo : _this.governmentUserInfo)
                            fetch({
                                url: api[str].url || '',
                                method: 'post',
                                data: {
                                    method: api[str].method,
                                    ...ignoreNull(_this.UserInfo),
                                    customer_type: _this.customer_type
                                }
                            }).then(function (response) {
                                _this.endLoading()
                                if (!_this.idEdit) {//若为新建用户
                                    _this.setCustomerInfo({
                                        ...ignoreNull(_this.UserInfo),
                                        archives_no: response.archives_no,
                                        customer_type: _this.customer_type,
                                        open_date: response.open_date,
                                        customer_id: response.customer_id,
                                    });
                                    _this.setVehicleInfo({})
                                    const h = _this.$createElement;
                                    if(_this.$store.getters.appointInfo.order_no){
                                        _this.$msgbox({
                                            title: '用户新增成功',
                                            customClass: 'my_msgBox singelBtn',
                                            type: 'success',
                                            message: h('div', null, [
                                                h('p', null, '用户名称：' + response.customerName),
                                                h('p', null, '用户编号： ' + response.customer_id),
                                                h('p', null, '用户档案号： ' + response.archives_no),
                                                h('p', null, '开户日期：' + response.open_date),
                                            ]),
                                            confirmButtonText: '上传用户档案',
                                            beforeClose: (action, instance, done) => {
                                                if (action === 'confirm') {
                                                    done();
                                                    _this.setModelType(dict.modelType.userbusiness)
                                                    _this.$emit("ftClick", cmds.next);
                                                }
                                            }
                                        }).then(action => {
                                            resolve()
                                        }).catch(function () {
                                            resolve()
                                        });
                                    }
                                    else{
                                        _this.$msgbox({
                                            title: '用户新增成功',
                                            customClass: 'my_msgBox',
                                            message: h('div', null, [
                                                h('p', null, '用户名称：' + response.customerName),
                                                h('p', null, '用户编号： ' + response.customer_id),
                                                h('p', null, '用户档案号： ' + response.archives_no),
                                                h('p', null, '开户日期：' + response.open_date),
                                            ]),
                                            showCancelButton: true,
                                            confirmButtonText: '上传用户档案',
                                            cancelButtonText: '继续新增用户',
                                            beforeClose: (action, instance, done) => {
                                                if (action === 'confirm') {
                                                    done();
                                                    _this.setModelType(dict.modelType.userbusiness)
                                                    _this.$emit("ftClick", cmds.next);
                                                } else {//重置用户信息
                                                    this.appointInfo.order_no='';
                                                    switch (_this.customer_type) {
                                                        case '1':
                                                            _this.personalUserInfo = {
                                                                customer_name: '',          // 用户名称
                                                                certificates_type: '1',     // 证件类型
                                                                certificates_code: '',   // 证件号码
                                                                link_mobile: '',       // 手机号码
                                                                link_address: '',    // 联系地址
                                                                link_phone: '',     // 联系电话：
                                                                link_man: '',           // 经办人
                                                                posttal_code: '',        // 邮政编码
                                                                email: '',              // EMail
                                                                remark: '',              // 备注：
                                                            }
                                                            break;
                                                        case '2':
                                                            _this.enterpriseUserInfo = {
                                                                customer_name: '',          // 用户名称
                                                                certificates_type: '3',     // 证件类型
                                                                certificates_code: '',   // 证件号码
                                                                link_mobile: '',       // 手机号码
                                                                link_address: '',    // 联系地址
                                                                link_phone: '',     // 联系电话：
                                                                link_man: '',           // 经办人
                                                                agent_id_type: '1', // 经办人证件类型
                                                                agent_id_num: '', // 经办人证件号码
                                                                posttal_code: '',        // 邮政编码
                                                                email: '',              // EMail
                                                                remark: '',              // 备注：
                                                            }
                                                            break;
                                                        case '3':
                                                            _this.governmentUserInfo = {
                                                                customer_name: '',          // 用户名称
                                                                certificates_type: '4',     // 证件类型
                                                                certificates_code: '',   // 证件号码
                                                                unit_level: '0',      // 单位级别
                                                                unit_attribute: '0',  // 单位属性
                                                                link_mobile: '',       // 手机号码
                                                                link_address: '',    // 联系地址
                                                                link_phone: '',     // 联系电话：
                                                                link_man: '',           // 经办人
                                                                agent_id_type: '1', // 经办人证件类型
                                                                agent_id_num: '', // 经办人证件号码
                                                                posttal_code: '',        // 邮政编码
                                                                email: '',              // EMail
                                                                remark: '',              // 备注：
                                                            }
                                                            break;
                                                    }
                                                    done();
                                                }
                                            }
                                        }).then(action => {
                                            resolve()
                                        }).catch(function () {
                                            resolve()
                                        });
                                    }
                                } else {//若为编辑用户
                                    _this.$msgbox({
                                        title: '用户编辑成功',
                                        message: '用户编辑成功',
                                        customClass: 'my_msgBox singelBtn',
                                        // showCancelButton: true,
                                        confirmButtonText: '上传用户档案',
                                        beforeClose: (action, instance, done) => {
                                            if (action === 'confirm') {
                                                _this.setModelType(dict.modelType.userbusiness)
                                                _this.setCustomerInfo({
                                                    ..._this.UserInfo,
                                                    customer_type: _this.customer_type
                                                });
                                                done();
                                                _this.$emit("ftClick", cmds.next);
                                            } else {
                                                _this.setCustomerInfo({
                                                    ..._this.UserInfo,
                                                    customer_type: _this.customer_type
                                                });
                                                done();
                                            }
                                        }
                                    })
                                }
                            }).catch(function (err) {
                                _this.endLoading()
                                _this.$msgbox({
                                    title: '警告',
                                    message: err.message,
                                    customClass: 'my_msgBox singelBtn',
                                    // showCancelButton: true,
                                    confirmButtonText: '确定',
                                    beforeClose: (action, instance, done) => {
                                        done();
                                    }
                                })
                            })
                        }))
                    } else {
                        return false
                    }
                })
            },
            //底部按钮点击事件处理
            ftClick: function (cmd) {
                switch (cmd) {
                    //返回
                    case cmds.goBack:
                        this.$emit("ftClick", cmd);
                        break
                    //保存
                    case cmds.saveCustInfo:
                        this.saveInfo()
                        break;
                    //用户档案
                    case cmds.next:
                        if (this.idEdit) {
                            if (this.originCustomerType !== this.customer_type) {
                                MessageBox.confirm('确认放弃编辑用户信息？', '警告', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$emit("ftClick", cmds.next);
                                })
                            } else {
                                let obj = this.customer_type === '1' ? this.personalUserInfo : (this.customer_type === '2' ? this.enterpriseUserInfo : this.governmentUserInfo)
                                let r = false;
                                for (let k in this.UserInfo) {
                                    if (this.UserInfo[k] !== obj[k]) {
                                        r = true;
                                    }
                                }
                                if (r) {
                                    MessageBox.confirm('确认放弃编辑用户信息？', '警告', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.$emit("ftClick", cmds.next);
                                    })
                                } else {
                                    this.$emit("ftClick", cmds.next);
                                }
                            }


                        } else {
                            this.$alert('请先新增用户！', '警告', {
                                confirmButtonText: '确定',
                                callback: action => {
                                }
                            });
                        }

                        break;
                    //其他（上一步、下一步）
                    default:
                        //TODO 是否可以上一步下一步
                        //如果可以，才调用上层事件处理
                        this.$emit("ftClick", cmd);
                        break;
                }
            },

            //显示进度条
            startLoading: function (progressStr = null) {
                this.loading = Loading.service({
                    lock: true,
                    text: progressStr === null ? this.progressStr : progressStr,
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            },
            //隐藏进度条
            endLoading: function () {
                if (this.loading !== undefined && this.loading !== null) {
                    this.loading.close();
                }
            },
            userTypeChange(id) {
                if (this.idEdit) {
                    switch (id) {
                        case '1':
                            this.personalUserInfo = {...this.UserInfo, ...ignoreNull(this.personalUserInfo)}
                            break
                        case '2':
                            // debugger
                            this.enterpriseUserInfo = {...this.UserInfo, ...ignoreNull(this.enterpriseUserInfo)}
                            break
                        case '3':
                            this.governmentUserInfo = {...this.UserInfo, ...ignoreNull(this.governmentUserInfo)}
                            break
                    }
                } else {
                    this.UserInfo = (id === '1' ? this.personalUserInfo : (id === '2' ? this.enterpriseUserInfo : this.governmentUserInfo));
                }
            },
            getArchivesNameFilter(val) {
                return getArchivesName(val);;
              },

            // 上传图片
            upload() {
                let param = new FormData(); //创建form对象
                let biz_content = {
                    file_name: "file",
                    ocr_type: '1',
                }
                param.append('method', api['ocrIdentify'].method);
                param.append('biz_content', JSON.stringify(biz_content))

                param.append('ticket', getToken());
                // todo 暂时写死身份证
                let blob = dataUrlToBlob(this.imgBase64);
                param.append('file', blob, 'img.jpg');

                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                };  //添加请求头
                axios.post('/issue/do', param, config)
                    .then(response => {
                        if (response.data.return_code === '0') {
                            let info = response.data.biz_content ? JSON.parse(response.data.biz_content) : {};
                            let map = {};
                            info.forEach((item, index) => {
                                map[item.key_name] = item.key_value;
                            })
                            // 身份证
                            if (this.customer_type === '1') {
                                this.personalUserInfo.customer_name = map['姓名'];
                                this.personalUserInfo.link_address = map['住址'];
                                this.personalUserInfo.certificates_code = map['公民身份号码'];
                                this.isPersonalOcr = true;
                            } else if (this.customer_type === '2') {
                                // 企业选项中的营业执照
                                if (this.photoType) {
                                    this.enterpriseUserInfo.customer_name = map['公司名称'];
                                    this.enterpriseUserInfo.link_address = map['公司地址'];
                                    this.enterpriseUserInfo.certificates_code = map['证件号码'];
                                    this.isEnterpriseOcr = true;
                                } else {
                                    this.enterpriseUserInfo.link_man = map['姓名'];
                                    this.enterpriseUserInfo.agent_id_num = map['公民身份号码'];
                                    this.isPersonEnterpriseOcr = true;
                                }
                            } else {
                                this.governmentUserInfo.link_man = map['姓名'];
                                this.governmentUserInfo.agent_id_num = map['公民身份号码'];
                                this.isGovernmentOcr = true;
                            }
                            this.$msgbox({
                                title: '温馨提示',
                                message: '证件识别完成，蓝色背景为识别项，由于证件是被存在一定的误差，请务必再次核对信息正确',
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
                            this.$msgbox({
                                title: '错误',
                                message: response.data.return_msg,
                                customClass: 'my_msgBox singelBtn',
                                confirmButtonText: '确定',
                                beforeClose: (action, instance, done) => {
                                    if (action === 'confirm') {
                                        done();
                                    }
                                }
                            })
                        }

                    })
            },

        },

    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin";
    @import "../../../styles/common";

    .new-user-container {
        background: #ffffff;
        padding-bottom: 0px;
        height: 100%;
        box-sizing: border-box;

        .new-user-dialog {
            flex-direction: column;
            display: flex;
            justify-content: space-between;
            height: 100%;
            box-sizing: border-box;
        }

        .new-user-content {
            padding: 0px 20px;
            height: $dialog-height;
            overflow-y: auto;
        }

        .new-user-appointment {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 10px;

            .reserve-search {
                background: $second-color;
                color: #ffffff
            }
        }

        .ocr_scanning {
            margin-left: 10px;
            cursor: pointer;

            img {
                width: 100%;
            }
        }

        .el-select {
            width: 100% !important;
        }


        .el-dialog {
            border-radius: 6px;

            .el-dialog__header {
                background-color: #3C4150;
                text-align: left;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                height: 40px;
                padding: 0px 20px;

                .el-dialog__title {
                    line-height: 40px;
                    font-family: PingFangSC-Regular;
                    font-size: 20px;
                    color: #f2f6fc;
                    letter-spacing: 0;
                    height: 40px;
                }

                .el-dialog__headerbtn {
                    font-size: 20px;
                    line-height: 40px;
                    top: 0px;
                    right: 10px;

                    .el-icon-close:before {
                        content: "";
                        display: block;
                        height: 40px;
                        width: 40px;
                        background-image: url(require('@assets/back.png'));
                        background-repeat: no-repeat;
                    }
                }
            }

            .el-dialog__body {
                background-color: #3C4150;
                text-align: center;

                .picture_Canvas {
                    background-color: #f2f6fc;
                    width: 695px;
                    height: 350px;
                    margin-left: 55px;
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

    .search_box {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .search_label {
            width: 100px;
            text-align: right;
        }
    }

    .test {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .ArchivesPhoto{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }


</style>