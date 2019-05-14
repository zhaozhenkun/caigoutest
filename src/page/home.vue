// 首页
<template>

  <div class="hideScroll">

    <div class="home">
      <div class="homeNav" ref="homeNav">
        <div class="homeNavTop">
          <div class="logoArea">
            <div class="area" @click="goArea">
              <span>{{LocationCity.length > 3?LocationCity.slice(0,3)+'...':LocationCity}}</span>
              <i></i>
            </div>
            <div class="logoRinght">
              <img src="../assets/logo2.png" alt="">
            </div>
         </div>
          <div class="search" >
            <i></i>
            <input type="text" placeholder="输入关键字，如采购 物业，多个词用空格隔开" @focus="searchRouter">
          </div>
        </div>
        
        <p>今日新增{{dataCount}}条信息</p>
      </div>
      <div class="classify" v-show="listMax">
        <ul>
          <li v-for="(item,index) in classifyData" :key="index" v-if="index < 4" @click="classifyContent(item.code,item.id)">
            <img :src="item.icon" :alt="item.icon">
            <p>{{item.name}}</p>
          </li>
          <li @click="goTypeAll">
            <img src="../assets/classifyMove.png" alt="更多">
            <p>更多</p>
          </li>
        </ul>
      </div>
      <div class="directory" v-show="listMax">
        <span class="enterprise" @click="goProduct('directoryRouter')">
          <i></i>
          企业名录
        </span>
        <span class="product" @click="goProduct('product')">
          <i></i>
          产品名录
        </span>
      </div>
      <div class="bannerHome" v-show="bannerHomeShow" ref="bannerHome" id="bannerHome">
        <mt-swipe :auto="4000">

          <mt-swipe-item v-for="(item,index) in imgData" :key="index">
            <div v-if="item.targetType == '外链'">
                <a :href="item.link">
                  <img :src="item.img" alt="">
                </a>
            </div>
            <div v-else>
              <router-link to="/proprietorList?name=业主分析&searchText=输入企业名称%20人名等" v-if="item.target == '业主分析'">
                <img :src="item.img" alt="">
              </router-link>
              <a v-else href="https://cg.calcnext.com/downLoadApp">
                <img :src="item.img" alt="">
              </a>
            </div>
            
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="recommend" :style="!listMax?'margin-top:4rem':''">
        <div class="recommendTitle" v-show="listMax">
          <span class="title">精灵智库</span>
          <span class="move" @click="recommendMove">查看更多 <i></i></span>
        </div>
        <div class="recommendList"  ref="wrapper" :style="{ height: wrapperHeight + 'px' }" @scroll="wrapperScroll" v-if="dataList">
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
        <div v-else-if="!dataList" class="noData">
            <img src="../assets/shemiListNull.png" alt="无数据">
            <p>暂时没有记录</p>
        </div>
      </div>
              

      <footerNav />
      
    </div>  
  </div>
</template>

<script>
import { getInfoType,getTodayUpdateCount,getPurchaseInfo,getViewpoint,getAdInfo} from '@/service/getData';
import { Loadmore, Swipe, SwipeItem,Toast } from 'mint-ui';
import BMap from 'BMap'

export default {
  data () {
    return {
      classifyData: [],
      dataCount: 0,
      dataList: [],
      topStatus:'' ,
      bottomStatus: '',
      allLoaded: false,
      wrapperHeight: 200,
      listMax:true,
      newScrollTop:0,
      pageNum:1,
      LocationCity:"正在定位",
      secretListTop: 0,
      bannerHomeShow: true,
      beforeTop: 0,
      bannerHomeHeight: 0,
      imgData: []

    }
  },
  components:{
    footerNav: r => {
      require(['../components/footerNav'],r)
    }
  },
  async mounted () {
    this.$router.push({
      path: '/home'
    })
    this.city()
    const classify = await getInfoType({})
    this.classifyData = classify.data
    const dataCount = await getTodayUpdateCount()
    this.dataCount = dataCount.data;
    const adInfoData = await getAdInfo({  
        position:'banner'
    })
    this.imgData = adInfoData.data
    
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
    this.bannerHomeHeight = this.$refs.bannerHome.clientHeight
  },
  activated () {
    if (this.$route.query.LocationCity && this.LocationCity !== this.$route.query.LocationCity ) {
        this.LocationCity = this.$route.query.LocationCity 
        this.dataList = []
        this.pageNum = 1
        this.getDataList()
    }
    if (this.$refs.wrapper) { 
        this.$refs.wrapper.scrollTop = this.secretListTop
    }
  },
  methods: {
    wrapperScroll (event) {
        if (this.$refs.wrapper.scrollTop > this.beforeTop ) {
          if (this.$refs.bannerHome.clientHeight > 0 ) {
            let heightScroll = this.$refs.bannerHome.clientHeight - (this.$refs.wrapper.scrollTop - this.beforeTop)
            
            if (heightScroll < 0) {
              heightScroll = 0
            }
            this.$refs.bannerHome.style.height = heightScroll  + 'px'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
          }
        } else {
          if (this.$refs.wrapper.scrollTop < this.bannerHomeHeight && this.$refs.wrapper.scrollTop !== 0) {
            this.$refs.bannerHome.style.height = this.$refs.bannerHome.clientHeight + (this.beforeTop - this.$refs.wrapper.scrollTop) + 'px'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
          } else if (this.$refs.wrapper.scrollTop == 0) {
            this.$refs.bannerHome.style.height = this.bannerHomeHeight + 'px'
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
          }
        }
        this.beforeTop =  this.$refs.wrapper.scrollTop
    },
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
    searchRouter () {
      this.$router.push({
        path: '/search'
      })
    },
    recommendMove () {
      this.$router.push({
        path: '/viewpointMove'
      })
    },
    goTypeAll () {
      this.$router.push({
        path: '/typeAll',
        query: {
          name:'全部分类'
        }
      })
    },
    goProduct (type) {
      if (type == 'directoryRouter') {
          this.$router.push({
            path: '/directoryRouter'
          })
      } else {
          this.$router.push({
            path: '/product'
          })
      }
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
    goArea () {
      this.$router.push({
        path: '/areaSelect'
      })
    },
    classifyContent (val,id) {
      if (val == '涉密采购' || val == '采购需求') {
        this.$router.push({
          path: '/secretList',
          query: {
            name: val,
            searchText: '输入标题，产品名称等关键词'
          }
        })
      } else {
        this.$router.push({
        path: '/recommendMove',
        query:{
          typeName:val,
          typeID: id
        }
      })
      }
      
    },
    city(){    //定义获取城市方法
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position){
          let city = position.address.city;             //获取城市信息
          let province = position.address.province;    //获取省份信息
          _this.LocationCity = city
          window.localStorage.setItem('locationCity', city);
          _this.getDataList()

      }, function(e) {
          _this.LocationCity = "定位失败"
          _this.getDataList()
      }, {provider: 'baidu'});		
    }
  }
}
</script>


<style lang="scss">
  .home::-webkit-scrollbar  {
    display: none;
  }
  .home {
    background: #f8f9fb;
    .bannerHome {
      width: 100%;
      height: 3.3333rem;
      img {
        width: 100%;
        height: 3.3333rem;
      }
      .mint-swipe-indicators {
        bottom: 0.2666rem;
        .mint-swipe-indicator {
          opacity: inherit;
          width: 0.184rem;
          height: 0.184rem;
          border: 0.02666rem solid rgba(255,255,255,1);
          border-radius:50%;
          background: none;
          margin: 0;
          margin-left: 0.2666rem;
        }
        .is-active {
          width: 0.360rem;
          height: 0.184rem;
          background:rgba(255,255,255,1);
          border: 0.02666rem solid rgba(255,255,255,1);
          border-radius: 0.9333rem;
        }
      }
    }
    .homeNav {
      background: url(../assets/topNavBG.png) no-repeat;
      background-size: 100% 3.8rem;
      background-color: #3887F5;
      padding-top: 0.9233rem;
      width: 100%;
      z-index: 10000;
      .homeNavTop {
        overflow: hidden;
        margin: 0 0.36rem;
        .logoArea {
            margin-bottom: 0.3666rem;
            overflow: hidden;
          .logoRinght {
              float: right;
              width: 2.173rem;
              height: 0.4666rem;
              display: inline-block;
              img {
                width: 100%;
                height: 100%;
                display: inline-block;
              }
          }
        }
        .area {
            display: inline-block;
            float: left;
            font-size: 0;
          span {
            font-size: 0.426rem;
            color: #fff;
            letter-spacing: 0.0213rem;
            line-height: 0.426rem;
          }
          i {
            display: inline-block;
            width: 0.2666rem;
            height: 0.1333rem;
            vertical-align: top;
            margin-left: 0.1rem;
            margin-top: 0.16rem;
            background: url(../assets/downPull.png) no-repeat;
            background-size: 0.2666rem 0.1333rem;
          }
        }
        .search {
          display: block;
          width: 100%;
          height: 0.9588rem;
          background: #fff;
          border-radius: 0.106rem;
          overflow: hidden;
          font-size: 0;
          text-align: center;
          i {
            display: inline-block;
            width: 0.6rem;
            height: 0.488rem;
            background: url('../assets/searchTop.png') no-repeat;
            background-size: 0.6rem;
            vertical-align: sub;
            margin-top: 0.15rem;
            float: left;
            margin-left: 0.2666rem;
            margin-right: 0.2rem;
          }
          input {
            width: 71%;
            height: 0.9588rem;
            font-size: 0.32rem;
            color: #999;
            border: none;
            line-height: 0.95888rem;
            display: inline-block;
            float: left;

          }
        }
      }
      p {
        color: #eeeeee;
        font-size: 0.293rem;
        clear: both;
        text-align: center;
        margin-top: 0.4rem;
        padding-bottom: 0.353rem;
      }
    }
    .classify {
      // margin-bottom: 0.2666rem;
      margin-bottom: 0.1rem;
      // margin-top: 3.599rem;
      ul {
        background: #fff;
        li {
          width: 19.7%;
          display: inline-block;
          text-align: center;
          // margin-top: 0.4rem;
          // margin-bottom: 0.4rem;
          margin-top: 0.3rem;
          margin-bottom: 0.3rem;
          white-space: nowrap;
          img {
            width: 1.2rem;
            height: 1.2rem;
            display: inline-block;
            border-radius: 50%;
          }
          p {
            margin-top: 0.1rem;
            // margin-top: 0.24rem;
            font-size: 0.32rem;
            color: #686868;
          }
        }
      }
    }
    .directory {
      background: #fff;
      font-size: 0;
      text-align: center;
      // margin-bottom: 0.2666rem;
      margin-bottom: 0.1rem;
      span {
        display: inline-block;
        width: 50%;
        font-size: 0.426rem;
        // height: 1.28rem;
        // line-height: 1.28rem;
        height: 1.1rem;
        line-height: 1.1rem;
        color: #333333;
        i {
          display: inline-block;
          width: 0.586rem;
          height: 0.56rem;
          background: red;
          vertical-align: middle;
          margin-right: 0.32rem;
        }
      }
      .enterprise {
        i {
          width: 0.586rem;
          height: 0.586rem;
          background: url('../assets/directory1.png') no-repeat;
          background-size: 0.586rem;
        }
      }
      .product {
        i {
          width: 0.586rem;
          height: 0.586rem;
          background: url('../assets/directory2.png') no-repeat;
          background-size: 0.586rem;

        }
      }
    }
    .recommend {
      background: #fff;
      .recommendTitle {
        height: 1.28rem;
        border-bottom: 0.026rem solid #dfdfdf;
        line-height: 1.28rem;
        padding: 0 0.4rem;
        .title {
          font-size: 0.48rem;
          color: #333333;
        }
        .move {
          float: right;
          color: #686868;
          font-size: 0.32rem;
          i {
            display: inline-block;
            width: 0.2533rem;
            height: 0.21333rem;
            background: url('../assets/moveIcon.png') no-repeat center;
          }

        }
      }
      .recommendList {
        margin-bottom: 1.65rem;
        overflow: scroll;
        -webkit-overflow-scrolling:touch;
      }
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

