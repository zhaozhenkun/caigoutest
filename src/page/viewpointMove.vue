<template>
    <div>
        <goBack  goBackName="精灵智库" @goBackClick="goBackClick" path='/'/>
        <div class="recommendList"  ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="dataList">
            <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
                <ul>
                <li v-for="(item,index) in dataList" :key="index" @click="goContent(item.id)">
                    <div class="listLeft">
                    <p class="title">{{item.title.length > 20?item.title.slice(0,20)+'...':item.title}}</p>
                    <p class="description">
                        <span class="source">来源: {{item.types}}</span>
                        <span class="date">{{time(item.publishTime)}}</span>
                    </p>
                    </div>
                    <div class="listRight">
                    <img :src="item.img" alt="">
                    </div>
                </li>
                </ul>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
import { getViewpoint } from '@/service/getData';
import { Loadmore,Toast } from 'mint-ui';

export default {
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    data () {
        return {
            dataList: [],
            pageNum: 1,
            wrapperHeight: 0,
            allLoaded: false,
            secretListTop: 0
        }
    },
    mounted () {
        this.getDataList()
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;

    },
    activated () {
        if (this.$refs.wrapper) { 
            this.$refs.wrapper.scrollTop = this.secretListTop
        }
    },
    methods: {
        async getDataList () {
            const dataList = await getViewpoint({
                pageNum:this.pageNum
            })
            let that = this
            if (dataList.status == 200) {
                for (let i = 0; i < dataList.data.list.length; i++) {
                that.dataList.push(dataList.data.list[i])
                }

            } else {
                if (that.pageNum == 1) {
                that.dataList = null
                }
                
            }
            return dataList;
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
                    id:id,
                    type:'viewpoint'
                }
            })
            this.secretListTop = document.getElementsByClassName('recommendList')[0].scrollTop
        },
        time (val) {
            var ymd = new Date(val)
            var year = ymd.getFullYear();     
            var month = ymd.getMonth()+1;     
            var date = ymd.getDate();  
            return  year+'-'+ (month < 10?'0'+month:month)+'-'+(date < 10?'0'+date:date)
        },
        goBackClick() {
           this.pageNum = 1
           this.getDataList()
           this.secretListTop = 0
        }
    }
}
</script>

<style lang="scss">
     .recommendList {
        margin-bottom: 1.65rem;
        overflow: scroll;
        -webkit-overflow-scrolling:touch;
         ul {
        li {
          border-bottom: 0.026rem solid #dfdfdf;
          margin: 0.4rem;
          overflow: hidden;
          .listLeft {
            width: 5.8666rem;
            float: left;
          }
          .listRight {
            width: 3.01rem;
            float: right;
            height: 2.02rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .title {
              color: #333333;
              font-size: 0.453rem;
              margin-bottom: 0.266rem;
              line-height: 0.64rem;
              font-weight: 400;
              font-family: PingFangSC-Regular;
              height: 1.166rem;
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
            .source {
              font-size: 0.346rem;
              color: #999;
              margin: 0;
              padding: 0;
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
     
</style>