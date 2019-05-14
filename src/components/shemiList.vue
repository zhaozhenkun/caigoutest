<template>
    <div class="shemiList">
        <goBack :goBackName="goBackName" @goBackClick="goBackClick"  path='/' v-if="goBackName !== '政策法规'"/>
        <div class="shemiTab" id="secretTop" v-if="goBackName == '企业名录'">
            <p>
                <span :class="shemiTab == 'look'?'select':''" @click="shemiTabClick('look')">找企业</span>
            </p>
            <p>
                <span :class="shemiTab == 'checked'?'select':''" @click="shemiTabClick('checked')">查行业</span>
            </p>
        </div>
        <div class="secretTop" ref="secretTop">
            <div>
                <div class="allFaGui" @click="goTypeAll" v-if="goBackName == '政策法规'">
                    <p>{{faGuiTypeName.length > 4?faGuiTypeName.slice(0,4)+'...':faGuiTypeName}} <i></i></p>
                </div>
            </div>
            <form :class="goBackName == '政策法规'?'secretSearch faguSearch':'secretSearch'" @submit.prevent="submitSearch">
                <i @click="submitSearch"></i>
                <input type="text" name="" id="" v-model="searchVal" :placeholder="$route.query.searchText" :class="searchVal !== ''?'addValInput':''">
                <b @click="searchValNull" v-if="searchVal !== ''"></b>
            </form>
            <button @click="submitSearch">搜索</button>
        </div>
        <div class="secretList" ref="secretList" :style="{ height:+wrapperHeight+'px' }" v-if="secretLists">
            <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <ul>
                    <li v-for="(item,index) in secretLists" :key="index" @click="goContent(item.id)">
                        <p class="secretListTitle" v-if="item.title">{{item.title.length > 32?item.title.slice(0,32)+'...':item.title}}</p>
                        <p class="secretListTitle" v-else-if="item.name">{{item.name.length > 32?item.name.slice(0,32)+'...':item.name}}</p>
                        <p class="secretListTitle" v-else-if="item.companyName">{{item.companyName.length > 32?item.companyName.slice(0,32)+'...':item.companyName}}</p>
                        <p v-if="goBackName == '企业名录' && item.companySummary" class="summary">{{item.companySummary.length > 45?item.companySummary.slice(0,45)+'...':item.companySummary}}</p>
                        <p class="depict">
                            <span v-show="goBackName == '涉密采购'">{{item.secretDegree}}</span>
                            <span v-show="goBackName == '企业名录'" class="margin0">{{time(item.createTime)}}</span>
                            <span v-show="goBackName == '政策法规'" class="margin0">{{time(item.publishTime)}}</span>
                            <span v-show="goBackName == '涉密采购'">发表时间：{{time(item.publishTime)}}</span>
                            <span v-show="goBackName == '涉密采购'">有限时间：{{time(item.endTime)}}</span>
                            <span v-show="goBackName == '采购需求'">{{time(item.publishTime)}}</span>
                            <span v-if="goBackName == '业主分析'">最新更新{{time(item.createTime)}}</span>
                        </p>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <div v-else-if="!secretLists" class="noData">
            <img src="../assets/shemiListNull.png" alt="无数据">
            <p>暂时没有记录</p>
        </div>
        <div class="secretConentBg" v-show="secretConent && goBackName == '涉密采购'">
            <div class="secretConent">
                <i @click="secretConentClose"></i>
                <p>对接请到全军武器装备信息网<span>http://www.weain.mil.cn/fwzn/xccxlc</span>查看详细对接步骤</p>
                <a href="http://www.weain.mil.cn/fwzn/xccxlc">
                <button>前往</button>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import {purchaseSecret, purchaseDemand, company, proprietor, getPolicyList, policyType} from '@/service/getData'
    import { Loadmore,Toast } from 'mint-ui';
    export default {
        data () {
            return {
                // secretLists:[],
                pageNum: 1,
                allLoaded: false,
                wrapperHeight: '',
                secretConent: false,
                goBackName: '',
                searchVal: '',
                shemiTab: 'look',
                secretListTop: 0,
            }
        },
        props:['secretLists','listALL','getList','faGuiTypeName','listHeight'],
        mounted () {
            this.goBackName = this.$route.query.name
        },
        updated () {
            if (document.documentElement.clientHeight > this.wrapperHeight) {
                if (this.$route.query.name == '政策法规') {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.secretList.offsetTop - 50
                } else {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.secretList.offsetTop 
                }
            }
        },
        activated () {
            this.goBackName = this.$route.query.name
                if (this.$route.query.name == '政策法规') {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.secretList.offsetTop - 50
                } else {
                    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.secretList.offsetTop 
                }
            
        },
        methods: {
            submitSearch () {
                let serverData = {
                    pageNum: 1,
                    keyword:this.searchVal,
                    faGuiTypeName: this.$route.query.typeName?this.$route.query.typeName:''
                }
                this.$emit('getList',this.shemiTab,serverData)
                document.activeElement.blur();
            },
            goContent (id) {
                if (this.$route.query.name == '涉密采购') {
                    this.secretConent = true
                } else if (this.$route.query.name == '企业名录' || this.$route.query.name == '业主分析') {
                    this.$router.push({
                        path:'/directoryContent',
                        query:{
                            name: this.$route.query.name,
                            id:id
                        }
                    })
                    this.secretListTop = document.getElementsByClassName('secretList')[0].scrollTop
                } else if (this.$route.query.name == '政策法规') {
                    this.$router.push({
                        path:'/',
                        query:{
                            type:'policyInfo',
                            id:id
                        }
                    })
                    this.secretListTop = document.getElementsByClassName('secretList')[0].scrollTop
                }else {
                    this.$router.push({
                        path:'/',
                        query:{
                            type:'purchaseDemand',
                            id:id
                        }
                    })
                    this.secretListTop = document.getElementsByClassName('secretList')[0].scrollTop
                }
            },
            secretConentClose () {
                this.secretConent = false
            },
            searchValNull () {
                this.searchVal = ''
            },
            time (val) {
                var ymd = new Date(val)
                var year = ymd.getFullYear();     
                var month = ymd.getMonth()+1;     
                var date = ymd.getDate();  
                return  year+'-'+ (month < 10?'0'+month:month)+'-'+(date < 10?'0'+date:date)
            },
            async loadTop() {
                this.pageNum = 1
                let serverData = {
                    pageNum: this.pageNum,
                    keyword:this.searchVal,
                    faGuiTypeName: this.faGuiTypeName == '全部法规'?'':this.faGuiTypeName
                }
                this.$emit('getList',this.shemiTab,serverData)
                if (this.listALL.status == 200) {
                    this.$refs.loadmore.onTopLoaded();
                }
            },
            async loadBottom () {
                this.pageNum = this.pageNum + 1
                let serverData = {
                    pageNum: this.pageNum,
                    keyword:this.searchVal,
                    faGuiTypeName: this.faGuiTypeName == '全部法规'?'':this.faGuiTypeName
                }
               this.$emit('getList',this.shemiTab,serverData)
               
                // this.getList().then((data) => {
                    if (this.listALL.status == 200 ) {
                     this.$refs.loadmore.onBottomLoaded();
                    } else if (this.listALL.data == null) {
                        this.allLoaded = true
                        this.$refs.loadmore.onBottomLoaded();
                        Toast({
                            message: '数据已全部加载完成'
                        })
                    }
                // })
            },
            shemiTabClick (name) {
                this.searchVal = ''
                this.shemiTab = name
                let serverData = {
                    pageNum: 1,
                    keyword:this.searchVal
                }
                this.$emit('getList',name,serverData)
            },
            goTypeAll () {
                this.$router.push({
                    path: '/typeAll',
                    query: {
                    name:'政策法规'
                    }
                })
            },
            goBackClick () {
                this.searchVal = ''
                this.shemiTab = 'look'
                let serverData = {
                    pageNum: 1,
                    keyword:''
                }
                this.$emit('getList','look',serverData)
            }
        },
        components: {
            goBack: r => {
                require(['../components/goBack'],r)
            }
        }
    }
</script>

<style lang="scss">
    .shemiList {
        // position: relative;
    }
    .shemiTab {
        overflow: hidden;
        border-bottom: 0.02666rem solid #dfdfdf;
        p {
            width: 50%;
            text-align: center;
            float: left;
            font-size: 0.4266666rem;
            span {
                display: inline-block;
                padding: 0.26666rem 0;
            }
        }
        .select {
            color: #4e86ed; 
            border-bottom:0.053333rem solid #4e86ed;           
        }
    }
    .secretTop {
            overflow: hidden;
            height: 0.76rem;
            margin: 0.2rem 0.4rem;
            .allFaGui {
                float: left;
                p {
                    line-height: 0.7555rem;
                    color: #333333;
                    font-size: 0.3729rem;
                    i {
                        display: inline-block;
                        width: 0.26666rem;
                        height: 0.28333rem;
                        background: url('../assets/downIcon.png') no-repeat center;
                    }
                }
            }
        .secretSearch {
            background: #F4F5F7;
            height: 100%;
            font-size: 0;
            overflow: hidden;
            position: relative;
            width: 90%;
            float: left;
            i {
                display: inline-block;
                float: left;
                width: 0.4rem;
                height: 0.4rem;
                background: url('../assets/search.png') no-repeat;
                background-size: 0.4rem;
                margin: 0.18666rem 0.2rem;
            }
            b {
                position: absolute;
                right: 0;
                top: 0.1rem;
                background: url('../assets/serchValNull.png') no-repeat;
                width: 0.6rem;
                height: 0.6rem;
                background-size: 0.6rem;
            }
            input {
                border: none;
                height: 100%;
                width: 83%;
                background: #F4F5F7;
                float: left;
                font-size: 0.32rem;
                color: #9b9d9d;
            }
        }
        button {
            float: left;
            border: none;
            background: none;
            margin-left: 0.146rem;
            margin-top: 0.15rem;
            color: #333;
            letter-spacing: 0.013333rem;
            font-size: 0.32rem;
        }
        .faguSearch {
            float: left;
            width: 63%;
            margin-left: 0.266rem;
            input {
                width: 85%;
            }
            .addValInput {
                width: 75%;
            }
        }
    }
    .secretList {
        overflow-y: scroll;
         -webkit-overflow-scrolling:touch;
        ul {
            margin: 0 0.4rem;
         

            li {
                padding: 0.4rem 0;
                border-bottom: 0.02666rem solid #dfdfdf;
                .secretListTitle {
                    font-size: 0.453333rem;
                    color: #333;
                }
                .summary {
                    margin-top: 0.10666rem;
                    color: #9b9d9d;
                    font-size: 0.3466666rem;
                }
                .depict {
                    overflow: hidden;
                    margin-top: 0.30666rem;
                    span:first-child {
                        float: left;
                        margin-left: 0;
                        color: #4e86ed;
                        background-color: #ebf1f7;
                        display: inline-block;
                        padding: 0 0.13333rem;
                    }
                    span {
                        float: left;
                        margin-left: 0.2rem;
                        color: #999999;
                        font-size: 0.32rem;
                    }
                    .margin0 {
                        margin-left: 0;
                    }
                    span:last-child {
                        float: right;
                    }
                }
            }
            li:last-child {
                border-bottom: none;
            }
        }
    }
    .noData {
        text-align: center;
        img {
            width: 6.6666rem;
            margin-top: 2.6666rem;
        }
        p {
            margin-top: 0.5rem;
            font-size: 0.466666rem;
            color: #333;
        }
    }
</style>

