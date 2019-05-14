<template>
    <div class="directoryContent">
        <goBack :goBackName="goBackName"/>
        <div class="directoryList"  ref="wrapper" :style="'height:'+wrapperHeight+'px;overflow:scroll; -webkit-overflow-scrolling:touch;'" v-if="$route.query.name == '企业名录'">
            <p>法人代表名称：{{contentData.corporation}}</p>
            <p>单位名称：{{contentData.companyName}}</p>
            <p>企业网址：<a :href="'http://'+contentData.website" style="margin:0;display:inline;">{{contentData.website}}</a></p>
            <p>行业类别：{{contentData.tradeType}}</p>       
            <div>
                <b>专业领域</b>
                <p>{{contentData.majorField}}</p>
            </div>
            <div>
                <b>主营业务关键词：</b>
                <p>{{contentData.businessKeyword}}</p>
            </div>
            <div>
                <b>企业简介</b>
                <p>{{contentData.companySummary}}</p>
            </div>
            <div>
                <b>主营业务简介</b>
                <p>{{contentData.businessSummary}}</p>
            </div>
            <p>
                <a :href="contentData.businessInfo">点击查看企业工商信息</a>
            </p>
            <div class="winTender" >
                <b>中标信息<i @click="tableBig(true)"></i></b>
                <table>
                    <tr>
                        <th>业主</th>
                        <th>项目</th>
                        <th>结果</th>
                        <th>金额</th>
                    </tr>
                    <tr v-for="(item,index) in winTenderData" :key="index" :class="index % 2 == 0?'winTenderTwo':''">
                        <td @click="tableContent('/directoryContent?name=业主分析&id=',item.proprietorSummary.id)">{{item.proprietorSummary.name.length > 10?item.proprietorSummary.name.slice(0,10)+'...':item.proprietorSummary.name}}</td>
                        <td @click="tableContent('/?id=',item.purchaseInfoSummary.id)">{{item.purchaseInfoSummary.title.length > 10?item.purchaseInfoSummary.title.slice(0,10)+'...':item.purchaseInfoSummary.title}}</td>
                        <td @click="tableContent('/directoryContent?name=企业名录&id=',item.companySummaries[0].id)">{{item.companySummaries[0].name.length > 4?item.companySummaries[0].name.slice(0,4)+'...':item.companySummaries[0].name}}</td>
                        <td>{{item.purchaseInfoSummary.money.length > 3?item.purchaseInfoSummary.money.slice(0,3)+'...':item.purchaseInfoSummary.money}}</td>
                    </tr>
                </table>
            </div>
            <div class="winTender winTenderBig" v-show="winTenderBigShow">
                <div class="winTenderBigBox" :style="'height: '+clientWidth+'px;margin-top: '+(-clientWidth + 60)+'px;width: '+(clientHeight - 60)+'px;'">
                    <div class="winTenderBigTitle"><span>中标信息</span><i @click="tableBig(false)"></i></div>
                    <div class="winTenderBigTable">
                        <table :style="'width:'+(clientHeight - 70)+'px'">
                            <tr>
                                <th>业主</th>
                                <th>项目</th>
                                <th>结果</th>
                                <th>金额</th>
                            </tr>
                            <tr v-for="(item,index) in winTenderData" :key="index" :class="index % 2 == 0?'winTenderTwo':''">
                                <td @click="tableContent('/directoryContent?name=业主分析&id=',item.proprietorSummary.id)">{{item.proprietorSummary.name}}</td>
                                <td @click="tableContent('/?id=',item.purchaseInfoSummary.id)">{{item.purchaseInfoSummary.title}}</td>
                                <td @click="tableContent('/directoryContent?name=企业名录&id=',item.companySummaries[0].id)">{{item.companySummaries[0].name}}</td>
                                <td>{{item.purchaseInfoSummary.money}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="directoryList" v-else-if="proprietorData !== ''">
            <p>今日发布信息：{{proprietorData.proprietorInfo.todayNum}}条</p>
            <p>历史发布信息：{{proprietorData.proprietorInfo.updateNum}}条</p>
            <div class="winTender">
                <b>发布概况<i @click="tableBig(true)"></i></b> 
                <table>
                    <tr>
                        <th>项目</th>
                        <th>金额</th>
                        <th>中标单位</th>
                    </tr>
                    <tr v-for="(item,index) in proprietorData.tender" :key="index" :class="index % 2 == 0?'winTenderTwo':''">
                        <td @click="tableContent('/?id=',item.purchaseInfoSummary.id)">{{item.purchaseInfoSummary.title.length > 10?item.purchaseInfoSummary.title.slice(0,10)+'...':item.purchaseInfoSummary.title}}</td>
                        <td>{{item.purchaseInfoSummary.money.length > 10?item.purchaseInfoSummary.money.slice(0,10)+'...':item.purchaseInfoSummary.money}}</td>
                        <td @click="tableContent('/directoryContent?name=企业名录&id=',item.companySummaries[0].id)">{{item.companySummaries[0].name.length > 10?item.companySummaries[0].name.slice(0,10)+'...':item.companySummaries[0].name}}</td>
                    </tr>
                </table>
            </div>
            <div class="winTender winTenderBig" v-show="winTenderBigShow">
                <div class="winTenderBigBox" :style="'height: '+clientWidth+'px;margin-top: '+(-clientWidth + 60)+'px;width: '+(clientHeight - 60)+'px;'">
                    <div class="winTenderBigTitle"><span>发布概况</span><i @click="tableBig(false)"></i></div>
                    <div class="winTenderBigTable">
                        <table :style="'width:'+(clientHeight - 60)+'px'">
                            <tr>
                                <th>项目</th>
                                <th>金额</th>
                                <th>中标单位</th>
                            </tr>
                            <tr v-for="(item,index) in proprietorData.tender" :key="index" :class="index % 2 == 0?'winTenderTwo':''">
                                <td @click="tableContent('/?id=',item.purchaseInfoSummary.id)">{{item.purchaseInfoSummary.title}}</td>
                                <td>{{item.purchaseInfoSummary.money}}</td>
                                <td @click="tableContent('/directoryContent?name=企业名录&id=',item.companySummaries[0].id)">{{item.companySummaries[0].name}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {companyContent, winTender, proprietorContent} from '@/service/getData';
export default {
    data () {
        return {
            contentData: '',
            winTenderData: [],
            proprietorData: '',
            goBackName: '',
            winTenderBigShow: false,
            clientWidth: '',
            clientHeight: '',
            wrapperHeight: ''
        }
    },
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    watch: {
        $route () {
            window.location.reload()
        }
    },
    mounted () {
        this.getContent()
        this.clientWidth = document.documentElement.clientWidth
        this.clientHeight = document.documentElement.clientHeight
    },
    updated () {
        if (this.wrapperHeight == '') {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top -50;

        }
    },
    methods: {
        async getContent () {
            if (this.$route.query.name == '企业名录') {
                let contentData = await companyContent('',this.$route.query.id)
                if (contentData.status == 200) {
                    this.contentData = contentData.data;
                    this.goBackName = contentData.data.companyName
            
                }
                let winTenderData = await winTender({
                    companyName: this.contentData.companyName
                });
                if (winTenderData.status == 200) {
                    this.winTenderData = winTenderData.data
                    
                }
            } else {
                let proprietorData = await proprietorContent('',this.$route.query.id)
                if (proprietorData.status == 200) {
                    this.proprietorData = proprietorData.data;
                    this.goBackName = proprietorData.data.proprietorInfo.name
                }
            }
        },
        tableBig (type) {
            this.winTenderBigShow = type
        },
        tableContent (path,id) {
            if (id) {
                window.location.href =this.locationHref+'#'+path+id
            }
        }

    }
}
</script>

<style lang="scss">
    .directoryContent {
        
        .directoryList {
            padding: 0 0.4rem;
            padding-bottom: 1.06666rem;
            p {
                font-size: 0.48rem;
                color: #333;
                margin-top: 0.533333rem;
                a {
                    color: #4e86ed;
                    font-size: 0.4rem;
                    margin-top: 1.12rem;
                    display: block;
                }
            }
            div {
                margin-top: 1.12rem;
                b {
                    color: #333333;
                    font-size: 0.48rem;
                }
            }
            .winTender {
                b {
                    i {
                        float: right;
                        background: url('../assets/tableBig.png') no-repeat;
                        display: inline-block;
                        width: 1rem;
                        height: 1rem;
                        background-size: 0.8rem;
                    }
                }
                table {
                    width: 100%;
                    border-collapse:collapse;
                    border: 1px solid #dfdfdf;
                    margin-top: 0.53333rem;
                    .winTenderTwo {
                        background-color: rgba(244, 245, 247, 1);
                    }
                    tr {
                        height: 1.42666rem;
                        text-align: center;
                        td {
                            border-collapse:collapse;
                            border: 1px solid #dfdfdf;
                        }
                        td:nth-child(1) {
                            width: 30%;
                        }
                        td:nth-child(2) {
                            width: 30%;
                        }
                        td:nth-child(3) {
                            width: 20%;
                        }
                        td:nth-child(4) {
                            width: 20%;
                        }
                        th {
                            border-collapse:collapse;
                            border: 1px solid #dfdfdf;
                            text-align: center;
                            height: 1.06666rem;
                            background-color: rgba(184, 214, 251, 1);
                        }
                    }
                }
            }
            .winTenderBig {
                position: fixed;
                background: rgb(255, 255, 255);
                width: 100%;
                height: 100%;
                top: 0px;
                margin: 0px;
                left: 0px;
                .winTenderBigBox {
                    transform: rotate(90deg);
                    transform-origin: left bottom;
                    margin: 0;
                    position: relative;
                    .winTenderBigTitle {
                        margin: 0;
                        height: 40px;
                        line-height: 40px;
                        width: 100%;
                        overflow: hidden;
                        i {
                            float: right;
                            background: url('../assets/tableBig.png') no-repeat;
                            display: inline-block;
                            width: 1rem;
                            height: 1rem;
                            margin-right: 0.73333rem;
                            background-size: 1rem;
                        }
                    }
                    .winTenderBigTable {
                        margin: 0;
                        overflow: scroll;
                        -webkit-overflow-scrolling:touch;
                        height: 360px;
                        table {
                            margin: 0;
                        }
                    }
                }
            }
        }
        

    }
</style>

