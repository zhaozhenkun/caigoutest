<template>
    <div class="study">
        <!-- <iframe :src="'./../../static/pdf/web/viewer.html'" frameborder="0" ></iframe> -->
        <p class="studyTitle">学院</p>
        <div class="studySearch">
            <div>
                <i></i>
                <input type="text" placeholder="请输入想要搜索的法规名称或内容" @focus="searchRouter">
            </div>
        </div>
        <div class="studylist" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="dataList">
            <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <ul>                       
                    <li v-for="(item,index) in dataList" :key="index" :class="item.imgClass">
                        <p>{{item.title}}</p>
                        <button @click="goContent(item.id)">开始学习</button>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <div v-else-if="!dataList" class="noData">
            <img src="../assets/shemiListNull.png" alt="无数据">
            <p>暂时没有记录</p>
        </div>
        <footerNav />
    </div>
</template>

<script>
import {getKnowledgeType} from '@/service/getData';
import { Loadmore, Swipe, SwipeItem,Toast } from 'mint-ui';

export default {
    data () {
        return {
            dataList:[],
            wrapperHeight: 0,
            allLoaded: false,
            pageNum: 1,
            secretListTop: 0
        }
    },
    mounted () {
        this.getDataList()
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
    },
    components:{
        footerNav: r => {
        require(['../components/footerNav'],r)
        }
    },
    activated () {
        if (this.$refs.wrapper) { 
            this.$refs.wrapper.scrollTop = this.secretListTop
        }
    },
    methods: {
        async getDataList () {
            if (this.pageNum == 1) {
                this.dataList = []
            }
            const knowledgeTypeData = await getKnowledgeType({
                pageNum:this.pageNum
            })
            let backgroungNum = 0
            if (knowledgeTypeData.status == 200) {
                for (let i = 0; i < knowledgeTypeData.data.list.length; i++) {
                    backgroungNum ++ 
                    if (backgroungNum == 1) {
                        knowledgeTypeData.data.list[i].imgClass = 'studyBg1'
                    } else if (backgroungNum == 2) {
                        knowledgeTypeData.data.list[i].imgClass = 'studyBg2'
                    } else if (backgroungNum == 3) {
                        knowledgeTypeData.data.list[i].imgClass = 'studyBg3'                        
                        backgroungNum = 0
                    }
                    this.dataList.push(knowledgeTypeData.data.list[i])
                }
            } else {
                if (this.pageNum == 1) {
                    this.dataList = null
                }
                
            }
            return knowledgeTypeData;
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
                path: '/studyContent',
                query:{
                    id:id
                }
            })
            this.secretListTop = document.getElementsByClassName('studylist')[0].scrollTop
        },
        searchRouter () {
            this.$router.push({
                path: '/studySearch'
            })
        }
    }
}
</script>

<style lang="scss">
    .study {
        background: #f8fbf9;
        .studyTitle {
            text-align: center;
            height: 1.30666rem;
            line-height: 1.30666rem;
            background: #fff;
            font-size: 0.48rem;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
        }
        .studySearch {
            height: 0.826666rem;
            padding: 0 0.4rem;
            background: #fff;
            padding-bottom: 0.173333rem;
            div {
                width: 100%;
                height: 0.826666rem;
                background:rgba(244,245,247,1);
                border-radius:0.106666rem;
                i {
                    display: inline-block;
                    width: 0.6rem;
                    height: 0.8rem;
                    height: 0.48rem;
                    background: url('../assets/searchTop.png') no-repeat;
                    margin-left: 0.4rem;
                    margin-right: 0.1rem;
                    vertical-align: sub;
                    background-size: 0.6rem;
                }
                input {
                    width: 80%;
                    border: none;
                    background:rgba(244,245,247,1);
                    height: 0.826666rem;
                }
            }
        }
        // .studylistBox {
            .studylist {
                overflow: scroll;
                -webkit-overflow-scrolling:touch;
                margin-top: 0.26666rem;
                background: #fff;
                ul {
                    padding: 0 0.4rem;
                    li {
                        width: 100%;
                        height: 3.38666rem;
                        text-align: center;
                        position: relative;
                        margin-top: 0.4rem;
                        p {
                            padding-top: 0.93333rem;
                            margin-bottom:  0.733333rem;
                            font-size: 0.426666rem;
                            font-family:PingFangSC-Medium;
                            font-weight:500;
                            color:rgba(255,255,255,1);
                            line-height: 0.42666rem;
                        }
                        button {
                            width: 2.24rem;
                            height: 0.666rem;
                            border: 0.026rem solid rgba(223,223,223,1);
                            border-radius: 0.1333rem;
                            font-size: 0.373rem;
                            font-family:PingFangSC-Regular;
                            font-weight:400;
                            color:rgba(255,255,255,1);
                            background: none;
                            outline: none;
                        }
                    }
                    .studyBg1 {
                        background: url('../assets/study1.png');
                        background-size: 100% 100%;
                    }
                    .studyBg2 {
                        background: url('../assets/study2.png');
                        background-size: 100% 100%;
                    }
                    .studyBg3 {
                        background: url('../assets/study3.png');
                        background-size: 100% 100%;
                    }
                }
            }
        // }
    }
</style>
