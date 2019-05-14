<template>
  <div class="search">
    <div class="search-box">
      <span @click="goBack"></span>
      <form action="" @submit.prevent="submitSearch">
        <i @click="submitSearch"></i>
        <input @input="searchChange" :style="searchContent !== ''?'width:83%;':''" v-model="searchContent" type="text" placeholder="请输入想要搜索的法规名称或内容">
        <b v-if="searchContent !== ''" @click="searchValNull"></b>
      </form>
      <button @click="submitSearch">搜索</button>
    </div>
    <template v-if="noResult">
      <!-- <div class="hot-search">
        <p>热门搜索</p>
        <ul class="hot-list">
          <li @click="goHotList(item.keyword)" v-for="(item,i) in hotList">{{item.keyword}}</li>
        </ul>
      </div> -->
      <ul class="history" >
        <li class="title">
          搜索记录
          <b @click="deleteAll"><img src="./../assets/delete.png" alt=""></b></li>
        <li class="list" v-if="searchList.length > 0" v-for="(item, index) in searchList">
          <span @click="searchGoDetail(item)">{{item}}</span>
        </li>
      </ul>
      <div class="noData" v-if="searchList.length == 0">
          <img src="../assets/shemiListNull.png" alt="无数据">
          <p>暂时没有记录</p>
      </div>
      <div class="deleteYesNoBg" v-if="deleteYesNoShow">
        <div class="deleteYesNo">
          <p>确定清除浏览历史？</p>
          <p>
            <span @click="deleteClose">取消</span>
            <span @click="deleteYes">确定</span>
          </p>
        </div>
      </div>
    </template>

    <!-- <searchList ref="searchList" :searchVal="searchContent" v-else/> -->
    <div v-else>
        <div class="studySearchList"  ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-if="dataList">
          <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
            <ul>
              <li v-for="(item,index) in dataList" :key="index" @click="goContent(item.id,item.typeId)">
                <div class="listLeft">
                  <p class="title">{{item.title.length > 20?item.title.slice(0,20)+'...':item.title}}</p>
                  <p class="description">
                    <span class="date">{{time(item.createTime)}}</span>
                  </p>
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
  </div>
</template>
<script>
import { Search, Indicator, Lazyload, InfiniteScroll, Loadmore, Toast } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'
import { searchListAll, gethotSearch,knowledgeSearch } from '@/service/getData'

export default {
  name: 'search',
  data() {
    return {
      searchContent: '',
      allOpen: false,
      keyword: '',
      searchList: [],
      dataList: [],
      noResult: true,
      pageNum: 1,
      pageSize: 10,
      newslist: [],
      loadMore: false,
      allLoaded: false,
      isLoadMore: true,
      getSearchLength: false,
      deleteYesNoShow: false,
      wrapperHeight: 0,
      allLoaded: false
    }
  },
  computed: {
  },
  components: {
    searchList: r => {
      require(['../components/searchList'],r)
    }
  },
  watch: {
    $route () {
      // location.reload()
    }
  },
  mounted () {
    if (this.$route.query.searchVal) {
      this.searchContent = this.$route.query.searchVal
      if (this.$route.query.searchVal !== '') {
        this.noResult = false
      } else {
        this.noResult = true
      }
    }
    if (this.$route.query.keyword){
      this.searchContent = this.$route.query.keyword
      this.submitSearch()
    }
    
    
  },
  activated () {
    if (this.$route.query.searchVal) {
      this.searchContent = this.$route.query.searchVal
      if (this.$route.query.searchVal !== '') {
        this.noResult = false
      } else {
        this.noResult = true
      }
    }
    if (this.$refs.wrapper) { 
        this.$refs.wrapper.scrollTop = this.secretListTop
    }
  },
  methods: {
    searchChange() {
      if (this.searchContent === '') {
        this.noResult = true
      }
    },
    searchGoDetail(item) {
      this.searchContent = item
      this.newslist = []      
      this.submitSearch()
      this.noResult = false      
      let setLocalList = getStore('studySearchList')
      this.searchContent = this.searchContent.replace(/\s+/g, '')
      if (this.searchContent) {
        if (setLocalList) {
          let indexTemp = false
          setLocalList.map((value,index) => {
            if (value === this.searchContent) {
              indexTemp = true
              setLocalList.splice(index,1)
              setLocalList.unshift(this.searchContent)
              setStore('studySearchList', setLocalList)  
            }
          })
          if (!indexTemp) {
            setLocalList.unshift(this.searchContent)
            setStore('studySearchList', setLocalList)            
          }
        } else {
          setLocalList = []
          setLocalList.unshift(this.searchContent)
          setStore('studySearchList', setLocalList)
        }
      }
      // window.location.href =this.locationHref+'#/studySearch?searchVal='+this.searchContent;
      // window.location.reload()
      this.setListLength()
    },
    lookAll() {
      this.allOpen = this.allOpen ? false: true
      this.setListLength()
    },
    goBack() {
      if (this.noResult) {
        this.$router.push({
          path:'/study'
        })
        // window.location.reload()
      } else {
        this.$router.push({
          path:'/studySearch'
        })
        window.location.reload()
      }
    },
    searchValNull () {
      this.searchContent = ''
    },
    deleteClose () {
      this.deleteYesNoShow = false
    },
    deleteYes () {
      this.searchList = []
      removeStore('studySearchList')
      this.deleteYesNoShow = false
    },
    deleteAll() {
      this.deleteYesNoShow = true
    },
    deleteNum(num) {
      let listArr = getStore('studySearchList')
      listArr.splice(num, 1)
      setStore('studySearchList', listArr)      
      this.setListLength()
    },
    setListLength() {
      let listNum = 0
      if (this.allOpen) {
        listNum = 10
      } else {
        listNum = 20
      }
      this.searchList = []
      const listArr = getStore('studySearchList')
      if (listArr) {
        listArr.map((value, index)=>{
          if (index < listNum) {
            this.searchList.push(value)
          } else {
            return
          }
        })
      }
    },
    async submitSearch() {
       if (this.searchContent == '') {
          Toast({
              message: '搜索内容不能为空'
          })
          return
        }
        if (this.pageNum == 1) {
          this.dataList = []
        }
        const dataList = await knowledgeSearch({
            keyword: this.searchContent,
            pageNum: this.pageNum
        })
         if (dataList.status == 200) {
            for (let i = 0; i < dataList.data.list.length; i++) {
             this.dataList.push(dataList.data.list[i])
            }

        } else {
            if (this.pageNum == 1) {
             this.dataList = null
            }
            
        }
      let setLocalList = getStore('studySearchList')
      this.searchContent = this.searchContent.replace(/\s+/g, '')
      if (this.searchContent) {
        if (setLocalList) {
          let indexTemp = false
          setLocalList.map((value) => {
            if (value === this.searchContent) {
              indexTemp = true
            }
          })
          if (!indexTemp) {
            setLocalList.unshift(this.searchContent)
            setStore('studySearchList', setLocalList)            
          }
        } else {
          setLocalList = []
          setLocalList.unshift(this.searchContent)
          setStore('studySearchList', setLocalList)
        }
      }
      this.setListLength()
      this.noResult = false
      this.newslist = []
      this.pageNum = 1
      this.getNewsList()
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      return dataList;
    //   document.activeElement.blur();
    //   window.location.href =this.locationHref+'#/search?searchVal='+this.searchContent;
    //   window.location.reload()
    },
    goDetail(artype, id) {
      switch (artype) {
        case 'banner':
          break
        case 'P':
          this.$router.push({
            path: '/',
            query: { artype: artype, id: id }
          })
          break          
        case 'C':
          this.$router.push({
            path: '/',
            query: { artype: artype, id: id }
          })
          break          
        case 'T':
          this.$router.push({
            path: '/pictureDetail/',
            query: { artype: artype, id: id }
          })
          break          
        case 'S':
          this.$router.push({
            path: '/videoDetail/',
            query: { artype: artype, id: id }
          })   
          break               
      }
    },
    getNewsList() {
      if (this.$refs.searchList) {
        this.$refs.searchList.pageNum = 1;
        this.$refs.searchList.dataList = [];
        this.$refs.searchList.getDataList()
      }
      // const list = await searchListAll({
      //   keyword: this.searchContent,
      //   type: 'N',
      //   currentpage: this.pageNum,
      //   pagesize: this.pageSize
      // })
      // if (list.status === '0001') {
      //   var resListArr = list.data.content
      //   resListArr.map((element)=>{
      //     element.imgpath = element.imgpath.replace(/\s+/g, '')                            
      //     this.newslist.push(element)          
      //   })
      //   this.getSearchLength = false
      // } else {
      //   this.getSearchLength = true
      // }
      // Indicator.close()
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
      this.submitSearch().then((data) => {
        if (data.status == 200) {
          this.$refs.loadmore.onTopLoaded();
        }
      })
    },
    async loadBottom () {
      this.pageNum = this.pageNum + 1   
      this.submitSearch().then((data) => {
        if (data.status == 200) {
          this.$refs.loadmore.onTopLoaded();
        } else {
          this.allLoaded = true
          this.$refs.loadmore.onBottomLoaded();
          Toast({
              message: '数据已全部加载完成'
          })
        }
      })
    },
    deactivated () {
    },
    goContent (id,typeId) {
      this.$router.push({
        path: '/studyContent',
        query: {
          typeId: id,
          id: typeId
        }
      })
      this.secretListTop = document.getElementsByClassName('studySearchList')[0].scrollTop
    }
  },
  async created() {
    this.setListLength()
    // const res = await gethotSearch()
    // this.hotList = res.data
  },
}
</script>
<style lang="scss" scoped>
@import '../css/app';
.search {
  width: 100%;
  overflow: hidden;
  background: #fff;
  min-height: 100vh;
  .studySearchList {
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
    ul {
      li {
        margin: 0 0.4rem;
        border-bottom: 1px solid rgba(233,233,233,1);
        .title {
          margin-bottom: 0.4rem;
          margin: 0.4rem 0;
          font-size: 0.453333rem;
          color: #333;
          line-height: 0.42333rem;
        }
        .description{
          margin-bottom: 0.5333rem;
          color: #999;
          font-size: 0.346666rem;
          line-height: 0.34666rem;
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
  .search-box {
    width: 100%;
    padding: .1rem .4rem;
    height: 1.30666667rem;
    line-height: 1.06666667rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    clear: both;
    font-size: .4rem;
    padding-top: 0.2rem;
    border-bottom: 0.02666rem solid rgba(233,233,233,1);
    form {
      width: 7.786rem;
      position: relative;
      float: left;
    }
    button {
      float: left;
      border: none;
      background: none;
      margin-left: 5px;
      margin-top: 10px;
      margin-top: 0.29rem;
      color: #333;
      font-size: 0.32rem;
      letter-spacing: 0.5px;
    }
    i {
      background: #f1f1f1 url('./../assets/search.png') no-repeat left;
      display: block;
      /* float: left; */
      width: 4%;
      height: .6rem;
      position: absolute;
      left: 0;
      top: .1rem;
      padding: .13333333rem;
      background-size: 75%;
      background-position-x: 70%;
    }
    b {
      position: absolute;
      right: 0;
      top: 0.1rem;
      background: url('../assets/serchValNull.png') no-repeat;
      width: 0.6rem;
      height: 0.85333rem;
      background-size: 0.6rem;
      background-color: #f1f1f1;
      background-position-y: 0.13rem;
    }
    input {
      padding: .13333333rem;
      padding-left: 8%;
      border-radius: 3px;
      width: 90%;
      height: .6rem;
      line-height: .6rem;
      background: #f1f1f1;      
      border: none;
      font-size: .37333333rem;
    }
    span {
      text-align: center;
      display: inline-block;
      width: 0.2rem;
      height: 0.426rem;
      background:  url(../assets/goBack.png) no-repeat;
      background-size: 0.2rem 0.426rem;
      vertical-align: text-top;
      float: left;
      margin-top: 0.29rem;
      margin-right: 0.4rem;
    }
  }
  .deleteYesNoBg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    .deleteYesNo {
      width: 6.666rem;
      height: 4rem;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -2rem;
      margin-left: -3.33333rem;
      text-align: center;
      border-radius: 0.3055rem;
      p {
        width: 3.5rem;
        margin: 0 auto;
        margin-top: 1rem;
        text-align: center;
        font-size: 0.377rem;
        span:nth-child(1) {
          float: left;
        }
        span:nth-child(2) {
          float: right;
        }
      }
    }
  }
  .history {
    width: 100%;
    overflow: hidden;
    margin-top: .32rem;
    background: #fff;
    padding: 0 0.4rem;
    padding-bottom: .32rem;
    li {
      // padding: 0 .4rem;
      // width: calc(100% - .8rem);
      font-size: .4rem;
      b {
        font-style: normal;
        display: table-cell;
        width: .4rem;
        float: right;
        overflow: hidden;
        margin-right: 0.266rem;
        img {
          // margin-top: .4rem;
          width: 100%;
        }
      }
    }
    .title {
      color: #999;
      margin-bottom: 0.4rem;
      font-size: .4266666rem;
      padding-right: 0.4rem;
      .l-more {
        display: inline-block;
        width: .37333333rem;
        height: .18666667rem;
        margin-left: .13333333rem;
      }
      .l-more-all {
        background: url('./../assets/up.png') no-repeat center;        
        background-size: 100%;
      }
      .l-more-small {
        background: url('./../assets/down.png') no-repeat center;
        background-size: 100%;        
      }
    }
    .list {
      display: inline-block;
      padding: 0.2266rem 0.4rem;
      box-sizing: border-box;
      font-size: .373rem;
      background: #F4F5F7;
      position: relative;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      border-radius: 0.5rem; 
      margin: 0 0.266rem;
      margin-bottom: 0.266rem;
      color: #333;
      max-width: 90%;
      span {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 100%;
      }
    }
  }
  .hot-search {
    margin-top: .32rem;
    background: #fff;
    clear: both;
    overflow: hidden;
    p {
      padding: 0 .4rem;
      width: calc(100% - .8rem);
      font-size: .4266666rem;
      color: #9b9d9d;
      margin-bottom: 0.4rem;
      // border-bottom: 1px solid #f1f1f1;
    }
    .hot-list {
      clear: both;
      overflow: hidden;
      width: 100%;
      padding-bottom: .32rem;
      padding: 0 0.4rem ;
      li {
        float: left;
        padding: 0.2266rem 0.4rem;
        box-sizing: border-box;
        font-size: .373rem;
        background: #F4F5F7;
        position: relative;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        border-radius: 0.5rem; 
        margin: 0 0.266rem;
        margin-bottom: 0.266rem;
        color: #333;
        span {
          width: 1.06666667rem;
          height: 1.0rem;
          display: inline-block;
          float: left;
          font-size: 0.5rem;
          /* line-height: 19px; */
          // margin-top: 0.2rem;
        }
        &:nth-child(odd) {
          &:after {
            content: "";
            height: 1rem;
            width: 1px;
            margin-top: .1rem;
            background: #f1f1f1;
            position: absolute;
            right: 0px;
          }
        }
        &:nth-child(1) span {
          background: url('./../assets/1.png') no-repeat;
          /* background-size: 0.8rem; */
          // background-position-x: .4rem;
          width: 1.06666667rem;
          height: 1.0rem;
          display: inline-block;
          float: left;
          /* line-height: 19px; */
          margin-top: 0.2rem;
        }
        &:nth-child(2) span {
          background: url('./../assets/2.png') no-repeat;
           /* background-size: 0.8rem; */
          // background-position-x: .4rem;
          width: 1.06666667rem;
          height: 1.0rem;
          display: inline-block;
          float: left;
          /* line-height: 19px; */
          margin-top: 0.2rem;
        }
        &:nth-child(3) span {
          background: url('./../assets/3.png') no-repeat left;
            /* background-size: 0.8rem; */
          // background-position-x: .4rem;
          width: 1.06666667rem;
          height: 1.0rem;
          display: inline-block;
          float: left;
          /* line-height: 19px; */
          margin-top: 0.2rem;
        }
      }
    }
  }
  .home-list{
    padding: 0 .32rem;
    margin-top: .26666667rem;
    background: #fff;
    .home-list-li{
      border-bottom: .01333333rem solid #dfdfdf;
      .on-top {
        color: #a90915;
        display: inline-block;
        width: .86666667rem;
        height: .4rem;
        line-height: .4rem;
        border: 1px solid #a90915;
        border-radius: 8px;
        text-align: center;
        font-size: .32rem;
        font-style: normal;
        margin-right: .13333333rem;
      }
      .describe-p{
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
         /* autoprefixer: off */
        -webkit-box-orient: vertical; // 参考 https://github.com/postcss/autoprefixer/issues/776
        /* autoprefixer: on */
        font-size: .42666667rem;
        padding-top: .4rem;
        line-height: .66666667rem;
      }
      .source-and-time {
        display: inline-block;
        padding: .50666667rem 0;
        width: 100%;
        b{
          color: #9b9d9d;
          font-size: .29333333rem;
          font-weight: normal;
          display: inline-block;
          padding-right: .32rem;
          max-width: 40%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .ordinary-1 {
  }
  .ordinary-2 {
    .pic-and-des {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 3.09333333rem;
      .l-des {
        width: calc(100% - 3.65333333rem);
      }
      .r-des-img {
        height: 2.1rem;
        width: 3.01333333rem;
        padding-top: .5rem;
        overflow: hidden;
        img {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }
  }
  .picture-1 {
    .describe-p {
      padding-bottom: .4rem;
    }
    .pic-show{
      width: 100%;
      height: 5.33333333rem;
      overflow: hidden;
      background: #f1f1f1;
      img {
        width: 100% !important;
        height: 100% !important;
      }    
    }
  }
  .picture-2 {
    .describe-p {
      padding-bottom: .4rem;
    }
    .pic-show-three {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      width: 100%;
      height: 3.06666667rem;      
      overflow: hidden;
      div {
        width: 3.06666667rem;
        overflow: hidden;
        img {
          width: 150%;
        }
      }
    }
  }
  .video-detail {
    padding-top: 0.4rem;
    .video {
      height: 5.33333333rem;
      overflow: hidden;
      position: relative;
      .video-img {
        width: 100% ;
        position: absolute;
        width: 100% !important;
        height: 100% !important;
      }
      .video-sec {
        position: absolute;
        height: 100%;
        width: 100%;
        .describe-p {
          color: #fff;
        }
        span {
          display: block;
          width: 100%;
          text-align: center;
          padding-top: .4rem;
          img {
            width: 1.05333333rem;
            height: 1.05333333rem;
          }
        }
      }
    }
  }


}
</style>
