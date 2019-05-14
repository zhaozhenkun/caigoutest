// 产品名录
<template>
    <div class="product"> 
        <goBack goBackName="产品名录" @goBackClick="goBackClick"/>
        <div class="productSearchTop">
            <form action="" class="productSearch" @submit.prevent="productSearch">
                <i @click="productSearch"></i>
                <input type="text" v-model="searchVal" placeholder="输入产品、技术名词等关键词">
                <b @click="searchValNull" v-if="searchVal !== ''"></b>
            </form>
            <button @click="productSearch">搜索</button>
        </div>
        <div class="productList" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
            <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <ul>
                    <li v-for="(item,index) in listData" :key="index" @click="productContent(item.id)">
                        <div class="listText">
                            <p class="title">{{item.title.length > 12?item.title.slice(0,12)+'...':item.title}}</p>
                            <p class="productSummary">摘要: {{item.productSummary.length > 14?item.productSummary.slice(0,14)+'...':item.productSummary}}</p>
                        </div>
                        <div class="listImg">
                            <img :src="item.img"  @error="listImgError">
                        </div>
                    </li>
                </ul>
            </mt-loadmore>

        </div>
    </div>
</template>

<script>
import { Loadmore,Toast } from 'mint-ui';
import {product} from '@/service/getData'
export default {
    data () {
        return {
            listData:[],
            allLoaded: false,
            wrapperHeight: 0,
            pageNum: 1,
            searchVal: '',
            secretListTop: 0
        }
    },
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    mounted() {
        this.getList()
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
    },
    activated () {
        if (this.$refs.wrapper) {
            this.$refs.wrapper.scrollTop = this.secretListTop
        }
    },
    methods: {
        async getList () {
            const list = await product({
                pageNum:this.pageNum,
                keyword:this.searchVal
            });
            if (list.status == 200) {
                for (var i = 0;i < list.data.length;i++) {
                    this.listData.push(list.data[i])
                }
            }
            return list;
        },
        listImgError (event) {
            event.target.src=require("../assets/imgNull.png")
        },
        searchValNull () {
            this.searchVal = ''
        },
        async loadTop() {
            this.pageNum = 1
            this.getList().then((data) => {
                if (data.status == 200) {
                this.$refs.loadmore.onTopLoaded();
                }
            })
        },
        async loadBottom () {
            this.pageNum = this.pageNum + 1
            this.getList().then((data) => {
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
        async productSearch () {
            this.pageNum = 1;
            this.listData = []
            this.getList()
        },
        productContent (id) {
            this.$router.push({
                path: '/',
                query: { type: 'product', id: id }
            })
            this.secretListTop = document.getElementsByClassName('productList')[0].scrollTop
        },
        goBackClick () {
            this.searchVal = ''
            this.pageNum = 1;
            this.listData = []
            this.getList()
        }
    }
}
</script>

<style lang="scss">
    .product {
        .productSearchTop {
            overflow: hidden;
            padding: 0.2rem 0.4rem;
            button {
                border: none;
                background: none;
                margin-left: 0.1466rem;
                margin-top: 0.15rem;
                color: #333;
                font-size: 0.32rem;
                letter-spacing: 0.015rem;
            }
        }
        .productSearch {
            background: #F4F5F7;
            height: 0.76rem;
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
                float: right;
                font-size: 0.32rem;
                color: #9b9d9d;
                padding-right: 0.6rem;
            }

        }
        .productList {
            overflow: scroll;
             -webkit-overflow-scrolling:touch;
            ul {
                li {
                    margin: 0 0.4rem;
                    border-bottom: 0.02666rem solid #DFDFDF;
                    overflow: hidden;
                    padding: 0.4rem 0;
                    .listText {
                        float: left;
                        margin-top: 0.2666rem;
                        .title {
                            font-size: 0.45333rem;
                            color: #333;
                            line-height: 0.45333rem;
                        }
                        .productSummary {
                            font-size: 0.346666rem;
                            color:#9b9d9d;
                            margin-top: 0.24rem;
                        }
                    }
                    .listImg {
                        float: right;
                        img {
                            width: 2.3333rem;
                            height: 1.57333rem;
                        }
                    }
                }
            }
        }
    }
</style>
