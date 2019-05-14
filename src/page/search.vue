<template>
  <div class="search">
    <div class="search-box">
      <span @click="goBack"></span>
      <form action="" @submit.prevent="submitSearch">
        <i @click="submitSearch"></i>
        <input @input="searchChange" :style="searchContent !== ''?'width:83%;':''" v-model="searchContent" type="text" placeholder="请输入关键字，多个词用空格隔开">
        <b v-if="searchContent !== ''" @click="searchValNull"></b>
      </form>
      <button @click="submitSearch" v-if="noResult">搜索</button>
      <button @click="screenShowClick" v-else>筛选</button>
    </div>
    <template v-if="noResult">
      <div class="hot-search">
        <p>热门搜索</p>
        <ul class="hot-list">
          <li @click="goHotList(item.keyword)" v-for="(item,i) in hotList">{{item.keyword}}</li>
        </ul>
      </div>
      <ul class="history" v-if="searchList.length > 0">
        <li class="title">
          搜索记录
          <b @click="deleteAll"><img src="./../assets/delete.png" alt=""></b></li>
        <li class="list" v-for="(item, index) in searchList">
          <span @click="searchGoDetail(item)">{{item}}</span>
        </li>
      </ul>

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
    <div v-else>
      <div class="searchSelect"><span @click="searchSelect('title')" :class="searchType=='title'?'checked':''">搜标题</span><span @click="searchSelect('full')" :class="searchType=='full'?'checked':''">搜全文</span></div>
      <div class="searchListData" ref="secretList" :style="{ height:+wrapperHeight+'px' }" v-if="newslist">
          <mt-loadmore :top-method="loadTop"  :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false">
              <ul>
                  <li v-for="(item,index) in newslist" :key="index" @click="goContent(item.id,index)">
                      <p class="title contentTitle" v-html="item.title.length > 32?item.title.slice(0,32)+'...':item.title">{{item.title.length > 32?item.title.slice(0,32)+'...':item.title}}</p>
                      <p v-if="item.content" class="title">
                        招标项目：<span v-html="item.content.length > 35?item.content.slice(0,35)+'...':item.content"></span>
                      </p>
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
      <div v-else-if="!newslist" class="noData">
          <img src="../assets/shemiListNull.png" alt="无数据">
          <p>暂时没有记录</p>
      </div>
    </div>
    <!-- <searchList ref="searchList" :searchVal="searchContent" v-else/> -->
    <div class="screenRightBg" v-if="screenShow" @click="screenShowFalse">
      <div class="screenRight">
        <div class="screenRightTitle">
          <span style="    position: absolute;left: 0.4rem;top: 0.08rem;">地区</span>
          <span style="    font-size: 0.453333rem;font-family: PingFangSC-Regular;font-weight: 400;">筛选</span>
        </div>
        <div class="areaList">
          <areaSelect ref="areaSelect" @areaGetVal="areaGetVal" :address="address"/>
        </div>
        <div class="areaSource">
          <p></p>
          <div >
            <span>信息类型</span>
            <p @click="areaSourceClick('type')">{{typeVal.name}}</p>
          </div>
          <div >
            <span>来源</span>
            <p @click="areaSourceClick('source')">{{sourceVal.name}}</p>
          </div>
        </div>
        <div class="screenRightTime">
          <p>时间</p>
          <div class="timeSelect">
            <span :class="timeSelectval == 7?'checked':''" @click="timeSelectClick(7)" >最近七天</span>
            <span :class="timeSelectval ==30?'checked':''" @click="timeSelectClick(30)">最近30天</span>
            <span :class="timeSelectval ==180?'checked':''" @click="timeSelectClick(180)" >最近半年</span>
          </div>
          <div class="timeInputs">
            <input type="text" readonly  @click="timeInputsClick('start')" :value="minYearVal" />
            <i></i>
            <input type="text" readonly @click="timeInputsClick('end')" :value="maxYearVal">
          </div>
        </div>
        <div class="screenRightBut">
          <button class="" @click="screenButNull">重置</button>
          <button class="succer" @click="screenButSuccer">确定</button>
        </div>
      </div>
    </div>
    <div class="areaSourceBoxBg" v-if="areaSourceBoxShow">
      <div class="areaSourceBox">
        <div class="areaSourceBoxTitle">
          <span @click="areaSourceBoxClose">取消</span>
          <span @click="areaSourceBoxOk">确定</span>
        </div>
        <ul>
          <li v-for="(item,index) in infoTypeList" :key="index" @click="typeSelect(item.code,item.id,index)" :class="item.name == type.name ?'select':item.name == source.name?'select':''" v-if="item.name !== '采购需求' && item.name !== '涉密采购'">
              {{item.name}}
          </li>
        </ul>
      </div>   
    </div>
    <div class="areaSourceBoxBg" v-if="areaTimeBoxShow">
      <div class="areaSourceBox">
        <div class="areaSourceBoxTitle">
          <span @click="areaTimeBoxClose">取消</span>
          <span @click="areaTimeBoxOk">确定</span>
        </div>
        <ul>
          <li v-for="index in areaTimeData" :key="index" @click="areaTimeList(index)" :class="index == minYearListVal && yearType == 'start'?'select':index == maxYearListVal && yearType == 'end'?'select':''">
              {{index}}
          </li>
        </ul>
      </div>   
    </div>
  </div>
</template>
<script>
import { Search, Indicator, Lazyload, InfiniteScroll, Loadmore, Toast } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'
import { searchListAll, gethotSearch,purchaseInfoSearch,getInfoType,getSource } from '@/service/getData'

export default {
  name: 'search',
  data() {
    return {
      searchContent: '',
      allOpen: false,
      keyword: '',
      searchList: [],
      hotList: [],
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
      searchType: 'title',
      screenShow: false,
      address: '',
      infoTypeList: [],
      areaSourceBoxShow: false,
      type: '',
      source: '',
      areaSourceType: '',
      typeVal: {name:'全部'},
      sourceVal: {name:'全部'},
      timeSelectval: '',
      startYear: '',
      endYear: '',
      areaTimeBoxShow: false,
      minYear: 1970,
      maxYear: '',
      minYearVal: '',
      maxYearVal: '',
      minYearListVal: '',
      maxYearListVal: '',
      areaTimeData:[],
      yearType: '',
      closeData: {
        address: '全国',
        startYear: '',
        endYear: '',
        minYearVal: '',
        maxYearVal: '',
        minYearListVal:  '',
        maxYearListVal:  '',
        timeSelectval: '',
        type: '全部',
        source: '全部',
        typeVal: {name:'全部'},
        sourceVal: {name:'全部'}
      },
      secretListTop: 0

    }
  },
  computed: {
  },
  components: {
    areaSelect: r => {
      require(['./areaSelect'],r)
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
    if (this.$refs.secretList) {
        this.$refs.secretList.scrollTop = this.secretListTop
    }
  },
  methods: {
    goHotList(name) {
      this.searchContent = name
      this.newslist = []            
      this.getNewsList()
      this.noResult = false
      let setLocalList = getStore('searchList')
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
            setStore('searchList', setLocalList)            
          }
        } else {
          setLocalList = []
          setLocalList.unshift(this.searchContent)
          setStore('searchList', setLocalList)
        }
      }
      window.location.href =this.locationHref+'#/search?searchVal='+this.searchContent;
      window.location.reload()
      this.setListLength()
    },
    time (val) {
      var ymd = new Date(val)
      var year = ymd.getFullYear();     
      var month = ymd.getMonth()+1;     
      var date = ymd.getDate();  
      return  year+'-'+ (month < 10?'0'+month:month)+'-'+(date < 10?'0'+date:date)
    },
    timeSelectClick (n) {
      this.minYearVal = ''
      this.maxYearVal = ''
      this.minYearListVal = ''
      this.maxYearListVal = ''
       var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        var endYear = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + ' 00:00:00';
        if(day <= n) {
            if(mon > 1) {
                mon = mon - 1;
            } else {
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        var startYear = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day) + ' 00:00:00';
        if (n == this.timeSelectval) {
          this.startYear = ''
          this.endYear = ''
          this.timeSelectval = ''
        } else {
          this.startYear = startYear
          this.endYear = endYear
          this.timeSelectval = n
        }
        
    },
    screenShowFalse (event) {
      if (event.target.className == 'screenRightBg') {
        this.address = this.closeData.address
        this.startYear = this.closeData.startYear
        this.endYear = this.closeData.endYear
        this.minYearVal = this.closeData.minYearVal
        this.maxYearVal = this.closeData.maxYearVal
        this.minYearListVal = this.closeData.minYearListVal
        this.maxYearListVal = this.closeData.maxYearListVal
        this.timeSelectval = this.closeData.timeSelectval
        this.type = this.closeData.type
        this.source = this.closeData.source
        this.typeVal = this.closeData.typeVal
        this.sourceVal = this.closeData.sourceVal
        this.screenShow = false
      }
    },
    screenButNull () {
      this.address = '全国'
      this.startYear = ''
      this.endYear = ''
      this.minYearVal = ''
      this.maxYearVal = ''
      this.minYearListVal = ''
      this.maxYearListVal = ''
      this.timeSelectval = ''
      this.type = '全部'
      this.source = '全部'
      this.typeVal = {name:'全部'}
      this.sourceVal =  {name:'全部'}
      this.newslist = []
      this.pageNum = 1 
      this.getNewsList()
      // this.screenShow = false
    },
    searchChange() {
      if (this.searchContent === '') {
        this.noResult = true
      }
    },
    searchGoDetail(item) {
      this.searchContent = item
      this.newslist = []      
      this.getNewsList()
      this.noResult = false      
      let setLocalList = getStore('searchList')
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
            setStore('searchList', setLocalList)            
          }
        } else {
          setLocalList = []
          setLocalList.unshift(this.searchContent)
          setStore('searchList', setLocalList)
        }
      }
      window.location.href =this.locationHref+'#/search?searchVal='+this.searchContent;
      window.location.reload()
      this.setListLength()
    },
    lookAll() {
      this.allOpen = this.allOpen ? false: true
      this.setListLength()
    },
    goBack() {
      if (this.noResult) {
        window.location.href =this.locationHref+'#/';
        window.location.reload()
      } else {
        this.$router.push({
          path:'/search'
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
    areaSourceBoxOk () {
      this.typeVal = this.type
      this.sourceVal = this.source
      if (this.source.code == '全军武器装备采购网' || this.source.code == '武警物资采购网' || this.source.code == '军队采购网') {
        this.$refs.areaSelect.LocationCity = '全国'
      } else {
        this.$refs.areaSelect.LocationCity = this.address
      }
      this.areaSourceBoxShow = false
    },
    deleteYes () {
      this.searchList = []
      removeStore('searchList')
      this.deleteYesNoShow = false
    },
    deleteAll() {
      this.deleteYesNoShow = true
    },
    deleteNum(num) {
      let listArr = getStore('searchList')
      listArr.splice(num, 1)
      setStore('searchList', listArr)      
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
      const listArr = getStore('searchList')
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
    goContent (id,index) {
        document.getElementsByClassName('contentTitle')[index].className = 'title contentTitle titleChecked'
        this.$router.push({
            path: '/',
            query:{
            id:id
            }
        })
        this.secretListTop = document.getElementsByClassName('searchListData')[0].scrollTop
    },
    submitSearch() {
      let setLocalList = getStore('searchList')
      this.searchContent = this.searchContent.replace(/\s+/g, '')
      if (this.searchContent == '') {
        Toast({
            message: '搜索内容不能为空'
        })
        return
      }
      
      if (this.searchContent) {
        this.noResult = false
        if (setLocalList) {
          let indexTemp = false
          setLocalList.map((value,index) => {
            if (value === this.searchContent) {
              indexTemp = true
              setLocalList.splice(index,1)
              setLocalList.unshift(this.searchContent)
              setStore('searchList', setLocalList)  

            }
          })
          if (!indexTemp) {
            setLocalList.unshift(this.searchContent)
            setStore('searchList', setLocalList)            
          }
        } else {
          setLocalList = []
          setLocalList.unshift(this.searchContent)
          setStore('searchList', setLocalList)
        }
      }
      this.setListLength()
      this.newslist = []
      this.pageNum = 1
      this.getNewsList()
      document.activeElement.blur();
      // document.activeElement.blur();
      // window.location.href =this.locationHref+'#/search?searchVal='+this.searchContent;
      // window.location.reload()
    },
    searchSelect (type) {
      this.searchType = type
      this.newslist = []
      this.pageNum = 1
      this.getNewsList()
    },
    typeSelect (code,id,i) {
      if (this.areaSourceType == 'type') {
        this.type = this.infoTypeList[i]
      } else {
        this.source = this.infoTypeList[i]
      }
    },
    areaGetVal (val) {
      this.address = val
    },
    areaTimeList (index) {
      if (this.yearType == 'start') {
        this.minYearListVal = index
      } else {
        this.maxYearListVal = index
      }
    },
    areaTimeBoxOk () {
      this.timeSelectval = ''
      this.minYearVal = this.minYearListVal
      this.maxYearVal = this.maxYearListVal
      this.startYear = this.minYearVal+'-1-1 00:00:00'
      this.endYear = (this.maxYearVal+1)+'-1-1 00:00:00'
      this.areaTimeBoxShow = false
    },
    areaTimeBoxClose () {
      this.minYearListVal = this.minYearVal
      this.maxYearListVal = this.maxYearVal 
      this.areaTimeBoxShow = false
    },
    timeInputsClick (type) {
      this.areaTimeData = []
      this.yearType = type
      if (type == 'start') {
        if (this.maxYearVal == '') {
          for (var i = this.minYear; i < this.maxYear + 1;i++) {
            this.areaTimeData.push(i)
          }
        } else {
          for (var i = this.minYear; i < this.maxYearVal + 1;i++) {
            this.areaTimeData.push(i)
          }
        }
      } else {
        if (this.minYearVal == '') {
          for (var i = this.minYear; i < this.maxYear + 1;i++) {
            this.areaTimeData.push(i)
          }
        } else {
          for (var i = this.minYearVal; i < this.maxYear + 1;i++) {
            this.areaTimeData.push(i)
          }
        }
      }
      this.areaTimeBoxShow = true
    },
    async areaSourceClick (type) {
      this.source = this.sourceVal
      this.type = this.typeVal
      this.areaSourceType = type
      if (type == 'type') {
        const infoType = await getInfoType()
        if (infoType.status == 200) {
            this.infoTypeList = infoType.data
        }
      } else {
        const source = await getSource()
        if (source.status == 200) {
            this.infoTypeList = source.data
        }
      }
      this.areaSourceBoxShow = true
    },
    areaSourceBoxClose () {
      this.source = this.sourceVal
      this.type = this.typeVal
      this.areaSourceBoxShow = false
    },
    screenButSuccer () {
      this.screenShow = false
      this.newslist = []
      this.pageNum = 1 
      this.getNewsList()
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
    async getNewsList() {
      if (this.pageNum == 1) {
        this.newslist = []
      }
      if (this.$refs.searchList) {
        this.$refs.searchList.pageNum = 1;
        this.$refs.searchList.dataList = [];
        this.$refs.searchList.getDataList()
      }
      let address = ''
      if (this.source.code == '全军武器装备采购网' || this.source.code == '武警物资采购网' || this.source.code == '军队采购网') {
        address = '全国'
      } else {
        address = this.address
      }
      const list = await purchaseInfoSearch({
        // params: {
        address: address == '全国'?'':address,
        keyword: this.searchContent,
        searchType: this.searchType,
        pageNum: this.pageNum,
        pagesize: this.pageSize,
        startTime: this.startYear,
        endTime: this.endYear,
        type: this.type.code,
        source: this.source.code
      })

      if (list.status == '200') {
        for (var i  = 0; i < list.data.length; i++) {
          this.newslist.push(list.data[i])  
        }
        if (this.pageNum == 1) {
         this.wrapperHeight = document.documentElement.clientHeight - this.$refs.secretList.getBoundingClientRect().top;
        }
      } else {
        if (this.pageNum == 1) {
          this.newslist = null
        }
      }
      this.closeData.address = this.address
      this.closeData.startYear = this.startYear
      this.closeData.endYear = this.endYear
      this.closeData.minYearVal = this.minYearVal
      this.closeData.maxYearVal = this.maxYearVal
      this.closeData.minYearListVal = this.minYearListVal
      this.closeData.maxYearListVal = this.maxYearListVal
      this.closeData.timeSelectval = this.timeSelectval
      this.closeData.type = this.type
      this.closeData.source = this.source
      this.closeData.typeVal = this.typeVal
      this.closeData.sourceVal = this.sourceVal
      Indicator.close()
      return list
    },
    screenShowClick () {
      this.screenShow = true
    },
    async loadTop() {
      this.pageNum = 1
      this.getNewsList().then((data) => {
        if (data.status == 200) {
          this.$refs.loadmore.onTopLoaded();
        }
      })
    },
    async loadBottom () {
      this.pageNum = this.pageNum + 1
      this.isLoadMore = true      
      this.getNewsList().then((data) => {
        if (data.status == 200) {
          this.$refs.loadmore.onBottomLoaded();
        } else {
          this.allLoaded = true
          this.$refs.loadmore.onBottomLoaded();
          Toast({
            message: '数据已全部加载完成'
          })
        }
      })
    }
  },
  async created() {
    this.setListLength()
    const res = await gethotSearch()
    this.hotList = res.data
  },
  mounted() {
    if (this.$route.query.searchVal){
      this.searchContent = this.$route.query.searchVal
      this.submitSearch()
    }
    var date = new Date();
    var year = date.getFullYear();
    this.maxYear = year

  },
  deactivated() {
  }
}
</script>
<style lang="scss" scoped>
@import '../css/app';
.search {
  width: 100%;
  overflow: hidden;
  background: #fff;
  min-height: 100vh;
  .searchSelect {
      height: 1.16rem;
      line-height: 1.16rem;
      padding: 0 0.5333rem;
      border-bottom: 0.026rem solid rgba(223,223,223,1);
      font-size: 0.426rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102,102,102,1);
      .checked {
        color:rgba(78,134,237,1);
      }
      span {
        margin-right: 0.5333rem;
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
  .screenRightBg {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    right: 0;
    .screenRight {
      width: 8rem;
      height: 100%;
      background: #fff;
      position: absolute;
      top: 0;
      right: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      .currentAreaShow {
          height: 1rem;
          line-height: 1rem;
      }
      .screenRightTitle {
        height: 1rem;
        line-height: 1rem;
        text-align: center;
      }
      .areaList {
        height: 8.813333rem;
      }
      .areaSource {
        > p {
          width: 100%;
          height: 0.6333rem;
          background:rgba(248,249,251,1); 
        }
        > div {
          height: 1.02rem;
          line-height: 1.02rem;
          margin: 0 0.29333rem;
          border-bottom: 0.026rem solid rgba(223,223,223,1);
          > span {
            display: inline-block;
            width: 1.8rem;
            margin: 0 0.186rem;
            font-size:0.4rem;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          > p {
            width: 4.8333rem;
            height: 0.666rem;
            background:rgba(255,255,255,1);
            border:0.026rem solid rgba(153,153,153,1);
            border-radius:0.133rem;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            line-height: 0.6666rem;
          }
        }
        > div:last-child {
          border: none;
        }
      }
      .screenRightTime {
        p {
          width: 100%;
          height: 0.6333rem;
          background:rgba(248,249,251,1); 
          line-height: 0.6333rem;
          padding-left: 0.4266rem;
          color: #999999;
          font-size: 0.373rem;
        }
        .timeSelect {
          margin: 0.2333rem 0.4rem;
          span {
            margin-right: 1rem;
            font-size: 0.4rem;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          .checked {
            color: #ECD53D;
          }
          span:last-child {
            margin-right: 0rem;
          }
        }
      }
      .timeInputs {
        margin: 0 0.4rem;
        padding: 0.1333rem 0;
        border-bottom: 0.026rem solid rgba(223,223,223,1);
        input {
          width: 2.5rem;
          height: 0.666rem;
          background:rgba(236,236,236,1);
          border-radius: 0.1333rem;
          border: none;
          outline: none;
          text-align: center;
          font-size: 0.373rem;
          color: #333;
        }
        i {
          width: 1.333rem;
          display: inline-block;
          vertical-align: middle;
          border: 0.0266rem solid rgba(229,229,229,1);
          margin: 0 0.23333rem;
        }
      }
      .screenRightBut {
        margin-top: 0.8rem;
        text-align: center;
        margin-bottom: 0.44rem;
        button {
          width:2.4rem;
          height:0.8rem;
          background:rgba(204,204,204,1);
          border-radius:0.4rem;
          border: none;
          margin-right: 0.72rem;
          color: #666;
        }
        .succer {
          color: #fff;
          background:rgba(78,134,237,1);
          margin: 0;
        }
      }
    }
  }
  .areaSourceBoxBg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .areaSourceBox {
    position: absolute;
    bottom: 0;
    width: 99.8%;
    z-index: 1000;
    background: #FFF;
    border:0.01333rem solid rgba(205,205,205,1);
  
    .areaSourceBoxTitle {
      height: 0.7333rem;
      line-height: 0.7333rem;
      padding: 0 0.73333rem;
      /* width: 99.8%; */
      background: #fff;
      border-bottom: 0.01333rem solid #cdcdcd;
      color: #00A0CB;
      span {
        display: inline-block;
        width: 49%;
      }
      span:last-child {
        text-align: right;
      }
    }
    ul {
      overflow: scroll;
      height: 3.73333rem;
      li {
        height: 0.9333rem;
        line-height: 0.9333rem;
        width: 100%;
        text-align: center;
        font-size: 0.32rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(66,66,66,1);
        opacity:0.9;
      }
      .select {
        font-size: 0.37333rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(2,2,2,1);
      }
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
      .titleChecked {
        color: #999999;
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
