<template>
    <div class="searchList">
        <div class="filterR">
            <div class="filter">
                <div @click="downPush(1)">
                    <p :class="downPushShow == 1?'select':''">{{critAllText}} <i ></i></p>
                </div>
                <div @click="downPush(2)">
                    <!-- <p v-if="typeSelectText == '公开招标公告'">公开招标</p>
                    <p v-else-if="typeSelectText == '竞争性谈判公告'">竞争性谈判</p>
                    <p v-else-if="typeSelectText == '资格预审公告'">资格预审</p>
                    <p v-else-if="typeSelectText == '邀请招标公告'">邀请公告</p>
                    <p v-else-if="typeSelectText == '竞争性磋商公告'">竞争性磋商</p>
                    <p v-else-if="typeSelectText == '终止公告'">竞争性磋商</p> -->
                    <p :class="downPushShow == 2?'select':''">类型 <i ></i></p>
                </div>
                <div @click="downPush(3)">
                    <p :class="downPushShow == 3?'select':''">{{souceSelectText.length > 5?souceSelectText.slice(0,5)+'...':souceSelectText}} <i ></i></p>
                </div>
            </div>
            <cirt @critAllShow="critAllShow" @critBgAllShow="critBgAllShow" v-show="downPushShow == 1"/>
            <div class="typeSelect" v-show="downPushShow == 2" @click.stop="typeSelectNone">
                <ul>
                    <li v-for="(item,index) in infoTypeList" :key="index" @click="typeSelect(item.code,item.id)" :class="item.code == typeSelectText?'select':''" v-if="item.name !== '采购需求' && item.name !== '涉密采购'">
                        {{item.name}}
                    </li>
                </ul>
            </div>
            <div class="souceSelect" v-show="downPushShow == 3" @click.stop="typeSelectNone">
                <ul>
                    <li v-for="(item,index) in sourceList" :key="index" @click="souceSelect(item.code)" :class="item.code == souceSelectText?'select':''">
                        {{item.code}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="searchListData" ref="searchListData" :style="{ height: searchListDataHeight + 'px' }" v-if="dataList">
            <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <ul>
                    <li v-for="(item,index) in dataList" :key="index" @click="goContent(item.id)">
                    <p class="title">{{item.title.length > 32?item.title.slice(0,32)+'...':item.title}}</p>
                    <p class="description">
                        <span class="area">{{item.province?item.province:'全国'}}</span>
                        <span :class="item.type == '公开招标公告'?'className GKZB':item.type == '招标公告'?'className ZBGG':item.type == '招标采购公告'?'className ZBCG':'className'">{{item.type}}</span>
                        <span class="area" v-if="item.source == '中国政府采购网'">政府采购网</span>
                        <span class="area" v-else-if="item.source == '全军武器装备采购网'">装备采购网</span>
                        <span class="area" v-else-if="item.source == '中国人民解放军总医院后勤招标采购中心'">总医院采购网</span>
                        <span class="area" v-else-if="item.source == '武警物资采购网'">武警采购网</span>
                        <span class="area" v-else>{{item.source}}</span>
                        <span class="date">{{time(item.publishTime)}}</span>
                    </p>
                    </li>
                </ul>
            </mt-loadmore> 
        </div>
        <div v-else-if="!dataList" class="noData">
            <img src="../assets/shemiListNull.png" alt="无数据">
            <p>暂时没有记录</p>
        </div>
    </div>
</template>

<script>
import {searchListAll,getInfoType,getSource} from '@/service/getData'
import { Loadmore,Toast } from 'mint-ui';
export default {
    data () {
        return {
            dataList: [],
            infoTypeList:[],
            sourceList:[],
            allLoaded:false,
            searchListDataHeight: '',
            pageNum: 1,
            critAllIs: false,
            critAllText: '全国',
            downPushShow: false,
            typeSelectText: '类型',
            souceSelectText:'来源',
            secretListTop: 0,
            searchListId: ''

        }
    },
    async mounted () {
        const infoType = await getInfoType()
        if (infoType.status == 200) {
            this.infoTypeList = infoType.data
        }
        const source = await getSource()
        if (source.status == 200) {
            this.sourceList = source.data
        }
        if (this.$route.query.typeID) {
            this.searchListId = this.$route.query.typeID
        }
        if (this.$route.query.typeName) {
            this.typeSelectText = this.$route.query.typeName
        }
        if (this.$route.query.souceName) {
            this.souceSelectText = this.$route.query.souceName
        }
         this.city()
    },
    updated () {
        if (this.searchListDataHeight == '') {
            this.searchListDataHeight = document.documentElement.clientHeight - this.$refs.searchListData.getBoundingClientRect().top;
        }
    },
    components: {
        cirt: r => {
            require(['../components/area'],r)
        }
    },
    watch: {
        $route () {
        }
    },
    activated () {
        if (this.$route.query.typeName && this.$route.query.typeName !== this.typeSelectText ) {
            this.typeSelectText = this.$route.query.typeName
            this.searchListId = this.$route.query.typeID
            this.pageNum = 1
            this.dataList = []
            this.downPushShow = false
             this.city()
        }
        if (this.$route.query.souceName && this.$route.query.souceName !== this.souceSelectText ) {
            this.souceSelectText = this.$route.query.souceName
            this.pageNum = 1
            this.dataList = []
            this.downPushShow = false
             this.city()
        }
        // if (!this.$route.query.typeName) {
        //     this.typeSelectText = ''
        //     this.searchListId = ''
        //     this.pageNum = 1
        //     this.dataList = []
        //     this.downPushShow = false
        //      this.city()
        // }
        // if (!this.$route.query.souceName) {
        //     this.pageNum = 1
        //     this.dataList = []
        //     this.souceSelectText = '来源'
        //     this.downPushShow = false
        //      this.city()
        // }
        
        if (this.$refs.searchListData) {
            this.$refs.searchListData.scrollTop = this.secretListTop
        }
    },
    methods: {
        async getDataList () {
            const list = await searchListAll({
                keyword: this.$attrs.searchVal,
                pageNum: this.pageNum,
                source: this.souceSelectText == '来源'?'':this.souceSelectText,
                address: this.critAllText == '全国'?'':this.critAllText,
                // type: this.typeSelectText == '类型'?'':this.typeSelectText,
                menuId: this.searchListId,
                sort: this.$route.path == '/search'?'relevance':''
            })
            if (list.status == 200) {
                if (this.pageNum == 1) {
                    this.dataList = []
                }
                for (var i = 0; i < list.data.length; i++) {
                    this.dataList.push(list.data[i])
                } 
            } else {
                if (this.pageNum == 1) {
                    this.dataList = null
                }
            }
            return list;
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
            this.getDataList().then((data) => {
                if (data.status == 200) {
                    this.$refs.loadmore.onTopLoaded();
                }
            })
        },
        async loadBottom () {
            this.pageNum = this.pageNum + 1
            this.getDataList().then((data) => {
                if (data.status == 200) {
                 this.$refs.loadmore.onBottomLoaded();
                } else if (data.data == null) {
                    this.allLoaded = true
                    this.$refs.loadmore.onBottomLoaded();
                    Toast({
                        message: '数据已全部加载完成'
                    })
                }
            })
        },
        goContent (id) {
            this.$router.push({
                path: '/',
                query:{
                id:id
                }
            })
            this.secretListTop = document.getElementsByClassName('searchListData')[0].scrollTop
        },
        downPush (index) {
            if (index == this.downPushShow) {
                this.downPushShow = false
            } else {
                this.downPushShow = index
            }
        },
        critAllShow (type,critAllText) {
            this.downPushShow = false
            this.critAllText = critAllText
            this.dataList = []
            this.getDataList()
            
        },
        critBgAllShow () {
            this.downPushShow = false
        },
        souceSelect (text) {
            // if (text == '全军武器装备采购网' || text == '武警物资采购网' || text == '军队采购网') {
            //     this.critAllText = '全国'
            // } else {
                if (this.critAllText !== '全国') {
                    this.critAllText = this.critAllText
                }else if (this.$route.query.souceName  !== '全军武器装备采购网' && this.$route.query.souceName  !== '武警物资采购网' && this.$route.query.souceName  !== '军队采购网' && this.critAllText == '全国') {
                    this.critAllText = '全国'
                }else if (this.$route.query.crit) {
                    this.critAllText = this.$route.query.crit
                } else {
                    this.critAllText = window.localStorage.getItem('locationCity')
                }
                
            // }
            if (this.$route.path == '/search') {
               
                // this.souceSelectText = text
                // this.pageNum = 1
                // this.dataList = []
                // this.getDataList()
                if (this.typeSelectText !== '') {
                    window.location.href =this.locationHref+'#/search?typeName='+this.typeSelectText+'&typeID='+this.searchListId+'&souceName='+text+'&crit='+this.critAllText+'&searchVal='+this.$attrs.searchVal
                    window.location.reload()
                } else {
                    window.location.href =this.locationHref+'#/search?souceName='+text+'&crit='+this.critAllText+'&searchVal='+this.$attrs.searchVal
                    window.location.reload() 
                }
            } else {
                if (this.typeSelectText !== '') {
                    window.location.href =this.locationHref+'#/recommendMove?typeName='+this.typeSelectText+'&typeID='+this.searchListId+'&souceName='+text+'&crit='+this.critAllText
                    window.location.reload()
                } else {
                    window.location.href =this.locationHref+'#/recommendMove?souceName='+text+'&crit='+this.critAllText
                    window.location.reload() 
                }
                
            }
        },
        typeSelect (text,id) {
             if (this.critAllText !== '全国') {
                    this.critAllText = this.critAllText
                }else if (this.$route.query.souceName  !== '全军武器装备采购网' && this.$route.query.souceName  !== '武警物资采购网' && this.$route.query.souceName  !== '军队采购网' && this.critAllText == '全国') {
                    this.critAllText = '全国'
                }else if (this.$route.query.crit) {
                    this.critAllText = this.$route.query.crit
                } else {
                    this.critAllText = window.localStorage.getItem('locationCity')
                }
            if (this.$route.path == '/search') {
               if (this.$route.query.souceName) {
                    window.location.href =this.locationHref+'#/search?typeName='+text+'&typeID='+id+'&searchVal='+this.$attrs.searchVal+'&souceName='+this.$route.query.souceName+'&crit='+this.critAllText
                    window.location.reload()
                } else {
                    window.location.href =this.locationHref+'#/search?typeName='+text+'&typeID='+id+'&searchVal='+this.$attrs.searchVal+'&crit='+this.critAllText
                    window.location.reload()
                }
                // this.typeSelectText = text
                // this.searchListId = id
                // this.pageNum = 1
                // this.dataList = []
                // this.getDataList()
            } else {
                if (this.$route.query.souceName) {
                    window.location.href =this.locationHref+'#/recommendMove?typeName='+text+'&typeID='+id+'&souceName='+this.$route.query.souceName+'&crit='+this.critAllText
                    window.location.reload()
                } else {
                    window.location.href =this.locationHref+'#/recommendMove?typeName='+text+'&typeID='+id+'&crit='+this.critAllText
                    window.location.reload()
                }
                
            }
            
        },
        city(){    //定义获取城市方法
            var _this = this
                if (_this.$route.query.souceName == '全军武器装备采购网' || _this.$route.query.souceName == '武警物资采购网' || _this.$route.query.souceName == '军队采购网') {
                    _this.critAllText = '全国'
                }else if (_this.$route.query.crit) {
                    _this.critAllText= _this.$route.query.crit
                } else {
                    _this.critAllText = window.localStorage.getItem('locationCity')
                }
                _this.dataList = []
                _this.getDataList()	
        },
        typeSelectNone () {
            this.downPushShow = false
        },
        goBackInit () {
            this.pageNum = 1
            this.souceSelectText = '来源'
            this.critAllText = window.localStorage.getItem('locationCity')
            this.typeSelectText = '类型'
            this.city()
        }
    }
}
</script>


<style lang="scss">
    .searchList {
        .filterR {
            position: relative;
            .typeSelect {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 2.39rem;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                ul {
                    position: absolute;
                    z-index: 1000;
                    background: #FFF;
                    width: 100%;
                    height: 6.73333rem;
                    overflow: scroll;
                     -webkit-overflow-scrolling:touch;
                    li {
                        text-align: center;
                        margin: 0.46666rem 0;
                        color: #333;
                        font-size: 0.426666rem;
                    }
                    .select {
                        color: #4e86ed;
                    } 
                }
            }
            .souceSelect {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 2.39rem;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                ul {
                    position: absolute;
                    z-index: 1000;
                    background: #FFF;
                    width: 100%;
                    max-height: 6.73333rem;
                    overflow: scroll;
                    -webkit-overflow-scrolling:touch;
                    li {
                        text-align: center;
                        margin: 0.46666rem 0;
                        color: #333;
                        font-size: 0.426666rem;
                    }
                    .select {
                        color: #4e86ed;
                    }
                }
            }
        }
        .filter {
            overflow: hidden;
            border-bottom: 0.026rem solid #dfdfdf;
            > div {
                float: left;
                width: 33%;
                .select {
                    color: #4e86ed;
                    i {
                        background: url('../assets/upIcon.png') no-repeat;
                        background-size: 0.58rem;
                    }
                    
                }
                p {
                    text-align: center;
                    display: inline-block;
                    height: 0.4rem;
                    width: 100%;
                    border-right: 0.026rem solid #dfdfdf;
                    margin-bottom: 0.373rem;
                    margin-top: 0.306rem;              
                    font-size: 0.373rem;
                    color: #333;
                    i {
                        width: 0.58rem;
                        height: 0.58rem;
                        display: inline-block;
                        background: url('../assets/downIcon.png') no-repeat;
                        margin-left: 0.05666rem;
                        background-size: 0.58rem;
                        vertical-align: top;
                        font-style: initial;
                    }
                    
                }
            }
            div:last-child {
                p {
                    border: none;
                }
            }
        }
        .searchListData {
            overflow-y: scroll;
            -webkit-overflow-scrolling:touch;
            ul {
                li {
                border-bottom: 0.026rem solid #dfdfdf;
                margin: 0.4rem;
                .title {
                    color: #333333;
                    font-size: 0.453rem;
                    margin-bottom: 0.266rem;
                }
                .description {
                    margin-bottom: 0.4rem;
                    span {
                    display: inline-block;
                    height: 0.533rem;
                    padding: 0 0.16rem;
                    line-height: 0.593rem;
                    margin-right: 0.266rem;
                    font-size: 0.346rem;
                    }
                    .area {
                        color: #4e86ed;
                        background-color: rgba(235, 241, 247, 1);
                    }
                    .className {
                    color: #4e86ed;
                    background-color: rgba(235, 241, 247, 1);
                    }
                    .ZBGG {
                    color: #DC645F;
                    background: #F9ECEC;
                    }
                    .ZBCG {
                    color: #4BB994;
                    background: #E9F5F1;
                    }
                    .GKZB {
                    color: #E49257;
                    background: #F7F0EB;
                    }
                    
                    .date {
                    float: right;
                    color: #999999;
                    }
                }
                }
                li:last-child {
                border-bottom: none;
                }
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