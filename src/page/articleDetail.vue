<template>
  <div class="article-detail">
    <goBack :goBackName="goBackName" style="  padding: 0 .4rem;"/>
    <div ref="wrapper" :style="'height:'+wrapperHeight+'px;overflow:scroll;padding: 0 .4rem;-webkit-overflow-scrolling:touch;'">
      <div v-if="routerType == 'purchaseDemand'">
            <div class="title">{{detailObj.title}}</div>
            <div >
              <div class="purchaseDemandTime">
                <p>发布时间:{{timeInit(detailObj.publishTime)}} <span><a :href="detailObj.link">查看原文</a></span></p>
                <p>开始申报时间:{{timeInit(detailObj.createTime)}}</p>
                <p>结束申报时间:{{timeInit(detailObj.endTime)}}</p>
              </div>
            </div>
            <p v-if="detailObj.projectNumber || detailObj.projectType || detailObj.major" class="purchaseText">基础信息</p>
            <div v-if="detailObj.projectNumber || detailObj.projectType || detailObj.major" class="content">
              <p v-if="detailObj.projectNumber">项目编号:{{detailObj.projectNumber}}</p>
              <p v-if="detailObj.projectType">项目类型:{{detailObj.projectType}}</p>
              <p v-if="detailObj.major">专业领域:{{detailObj.major}}</p>
            </div>
            <p v-if="detailObj.function" class="purchaseText">功能用途</p>
            <div class="purchaseDemandCon" v-if="detailObj.function" v-html="detailObj.function"></div>
            <p class="purchaseText">主要指标</p>
            <div class="purchaseDemandCon" v-html="detailcontent"></div>
            <ul class="detail-type">
              <li v-for="item in detailType" @click="godetailType(item)" v-if="item">{{item}}</li>
            </ul>
            <div class="errors">
              <button>报错</button>
            </div>
            <div class="abpolicy" v-if="!policyInfoShow">
              <p v-if="detarelObj.before" @click="goUpDownContent(detarelObj.before.id,'purchaseDemand')"><span>上一篇:</span>{{this.detarelObj.before.title}}</p>
              <p v-else><a><span>上一篇:</span>当前是第一篇,没有上一篇</a></p>
              <p v-if="detarelObj.after" @click="goUpDownContent(detarelObj.after.id,'purchaseDemand')"><span>下一篇:</span>{{this.detarelObj.after.title}}</p>
              <p v-else><a><span>下一篇:</span>当前是最后一篇,没有下一篇</a></p>
            </div>
      </div>
      <div v-else-if="routerType == 'policyInfo'">
            <div class="title">{{detailObj.title}}</div>
            <!-- content -->
            <div class="content" v-html="detailObj.content"></div>
            <div class="errors">
              <button>报错</button>
            </div>
            <div class="abpolicy" v-if="!policyInfoShow">
              <p v-if="detarelObj.before" @click="goUpDownContent(detarelObj.before.id,'policyInfo')"><span>上一篇:</span>{{this.detarelObj.before.title}}</p>
              <p v-else><a><span>上一篇:</span>当前是第一篇,没有上一篇</a></p>
              <p v-if="detarelObj.after" @click="goUpDownContent(detarelObj.after.id,'policyInfo')"><span>下一篇:</span>{{this.detarelObj.after.title}}</p>
              <p v-else><a><span>下一篇:</span>当前是最后一篇,没有下一篇</a></p>
            </div>
      </div>
      <div v-else-if="routerType == 'purchaseSecret'">
            <div class="title">{{detailObj.title}}</div>
            <div >
              <p class="purchaseSecretTitle">{{timeInit(detailObj.publishTime)}}</p>
            </div>
            <p class="messageText">全军武器装备采购信息网{{timeInit(detailObj.publishTime)}}发布各类采购信息如下:</p>
            <div class="content">
              <table>
                <tbody>
                  <tr class="tableTitle">
                    <th>项目名称</th>
                    <th>信息栏目</th>
                    <th>密级</th>
                    <th>有效时限</th>
                  </tr>
                  <tr v-for="(item,index) in detailObj.detailTable" :index="index" :class="index%2 == 0?'':'select'">
                    <td>{{item.name}}</td>
                    <td>{{item.infoColumn}}</td>
                    <td>{{item.secretDegree}}</td>
                    <td>{{timeInit(item.endTime)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul class="detail-type">
              <li v-for="item in detailType" @click="godetailType(item)" v-if="item">{{item}}</li>
            </ul>
            <div class="errors">
              <button>报错</button>
            </div>
            <div class="abpolicy" v-if="!policyInfoShow">
              <p v-if="detarelObj.before" @click="goUpDownContent(detarelObj.before.id,'purchaseSecret')"><span>上一篇:</span>{{this.detarelObj.before.title}}</p>
              <p v-else><a><span>上一篇:</span>当前是第一篇,没有上一篇</a></p>
              <p v-if="detarelObj.after" @click="goUpDownContent(detarelObj.after.id,'purchaseSecret')"><span>下一篇:</span>{{this.detarelObj.after.title}}</p>
              <p v-else><a><span>下一篇:</span>当前是最后一篇,没有下一篇</a></p>
            </div>
      </div>
      <!-- 产品详情 -->
      <div v-else-if="routerType == 'product'">
            <div class="title" style="text-align: center;">{{detailObj.title}}</div>
            <div >
              <p class="purchaseSecretTitle">发布于{{timeInit(detailObj.publishTime)}}</p>
            </div>
            <p>
              <img class="productImg" :src="detailObj.img" alt="" @error="productImgError">
            </p>
            <div class="content">
              <b class="productContent">基本信息</b>
              <ul>
                <li>
                  <span>单位名称：</span>
                  {{detailObj.companySummary.name}}
                </li>
                <li>
                  <span>专业领域：</span>
                  {{detailObj.majorField}}
                </li>
                <li>
                  <span>先进程度：</span>
                  {{detailObj.degree}}
                </li>
                <li>
                  <span>信息来源：</span>
                  {{detailObj.source}}
                </li>
                <li>
                  <span>产品（技术）关键词：</span>
                  {{detailObj.productKeyword}}
                </li>
                <li>
                  <span>产品（技术）简介：</span>
                  <br/>
                  {{detailObj.productSummary}}
                </li>
              </ul>
            </div>
            <div class="abpolicy" v-if="!policyInfoShow">
              <p v-if="detarelObj.before"  @click="goUpDownContent(detarelObj.before.id,'product')"><span>上一篇:</span>{{detarelObj.before.title}}</p>
              <p v-else><a><span>上一篇:</span>当前是第一篇,没有上一篇</a></p>
              <p v-if="detarelObj.after"  @click="goUpDownContent(detarelObj.after.id,'product')"><span>下一篇:</span>{{detarelObj.after.title}}</p>
              <p v-else><a><span>下一篇:</span>当前是最后一篇,没有下一篇</a></p>
            </div>
            <div class="errors">
              <button>报错</button>
            </div>
      </div>
      <!-- 精灵智库 -->
      <div v-else-if="routerType == 'viewpoint'">
          <div class="title">{{detailObj.title}}</div>
          <div v-if="policyInfoShow">
            <div class="sub-title"><b>{{timeInit(detailObj.publishTime)}}</b><span style="margin:0;">来源：</span><b>{{detailObj.author}}</b></div>
          </div>
          <div class="content" v-html="detailObj.content" ></div>
      </div>
      <div v-else style="height:100%;">
            <div class="title">{{detailObj.title}}</div>
            <div v-if="policyInfoShow">
              <div class="sub-title"><span>来源</span><b>{{detailObj.source}}</b><b>{{detailObj.createTime}}</b></div>
              <div class="link"><a :href="detailObj.link">查看原文</a></div>
            </div>
            <div class="content" v-html="detailObj.content" ></div>
            <ul class="detail-type">
              <li v-for="item in detailType" @click="godetailType(item)" v-if="item">{{item}}</li>
            </ul>
            <div class="errors" >
              <button @click="errorsClick">报错</button>
            </div>
            <div class="abpolicy" v-if="!policyInfoShow">
              <p v-if="detarelObj.before" @click="goUpDownContent(detarelObj.before.id,'policyInfo')"><span>上一篇:</span>{{this.detarelObj.before.title}}</p>
              <p v-else><a><span>上一篇:</span>当前是第一篇,没有上一篇</a></p>
              <p v-if="detarelObj.after" @click="goUpDownContent(detarelObj.after.id,'policyInfo')"><span>下一篇:</span>{{this.detarelObj.after.title}}</p>
              <p v-else><a><span>下一篇:</span>当前是最后一篇,没有下一篇</a></p>
            </div>
      </div>
      <div class="errorsListBg" v-show="errorsListShow">
        <div class="errorsList">
          <div class="errorsListTop">
            <ul>
              <li @click="errorsListSelect('题文不符')" :class="errorsListText.indexOf('题文不符') > -1?'select':''">题文不符</li>
              <li @click="errorsListSelect('原文链接失败')" :class="errorsListText.indexOf('原文链接失败') > -1?'select':''">原文链接失败</li>
            </ul>
          </div>
          <div class="errorsListbot">
            <span @click="errorsListSubmit">提交</span>
            <span @click="errorsListClose">取消</span>
          </div>
        </div>
      </div>
      
    </div>
    <downLoad></downLoad>
  </div>
</template>
<script>
import { getByTypeList, getBannerList, getDetail, getPolicy,getpurchaseDemand, getpurchaseSecret,productContent,reportErrors,viewpointContent} from '@/service/getData'
import { Indicator, Lazyload, InfiniteScroll, Loadmore, Toast, Swipe, SwipeItem } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'

export default {
  name: '',
  data() {
    return {
      selected: '1',
      detailObj: {},
      detarelObj: {},
      detailcontent: '',
      detailType: [],
      keyword: '',
      noCheck: false,
      policyInfoShow: true,
      routerType: '',
      wrapperHeight: '',
      errorsListShow: false,
      errorsListText: [],
      goBackName: ''
    }
  },
  watch: {
    $route () {
      location.reload()
    }
  },
  async created() {

    if (this.$route.query.type == 'policyInfo'){ //政策法规
      const detail = await getPolicy('',this.$route.query.id)
      this.detailObj = detail.data.current
      this.detarelObj = detail.data
      this.policyInfoShow = false
      this.routerType = 'policyInfo'
      this.goBackName = '详情'
    } else if (this.$route.query.type == 'purchaseDemand') { // 采购需求
      const detail = await getpurchaseDemand('',this.$route.query.id)
      this.detailObj = detail.data.current
      this.detailcontent = detail.data.current.quota
      this.detarelObj = detail.data
      this.policyInfoShow = false
      this.routerType = 'purchaseDemand'
      this.goBackName = '详情'
    } else if (this.$route.query.type == 'purchaseSecret') { //涉密
      const detail = await getpurchaseSecret('',this.$route.query.id)
      this.detailObj = detail.data.current
      this.detarelObj = detail.data
      this.policyInfoShow = false
      this.routerType = 'purchaseSecret'
      this.goBackName = '详情'
    } else if (this.$route.query.type == 'product') {  // 产品详情页
      const detail = await productContent('',this.$route.query.id)
      this.detailObj = detail.data.current
      this.detarelObj = detail.data
      this.routerType = 'product'
      this.policyInfoShow = false
      this.goBackName = '详情'
    } else if (this.$route.query.type == 'viewpoint') { //精灵智库
      const detail = await viewpointContent('',this.$route.query.id)
      this.detailObj = detail.data
      this.detarelObj = detail.data
      this.routerType = 'viewpoint'
      this.policyInfoShow = true
      this.goBackName = '精灵智库'
    }else {
      const detail = await getDetail('',this.$route.query.id)
      this.detailObj = detail.data
      this.detailObj.createTime = new Date(this.detailObj.createTime).toLocaleDateString().replace(/\//g, "-")
      this.goBackName = '详情'
    }
  },
  mounted () {
     this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
  },
  updated () {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
  },
  deactivated() {
    if (this.keyword !== this.$route.query.id){
      this.$destroy()
    }
  },
  methods: {
    godetailType(keyword) {
      this.$router.push({
        path: '/search',
        query: {keyword: keyword}
      })
    },
    typeName (cid,pid,name) {
      this.$refs.navBar.pushNavBar(cid,pid,name)
    },
    timeInit (time) {
      var date = new Date(time).toLocaleDateString().replace(/\//g, "-") + ''
      return date
    },
    productImgError (event) {
      event.target.src = require("../assets/imgNull.png")
    },
    async errorsListSubmit () {
      const data = await reportErrors({
        infoId:this.$route.query.id,
        genre: this.$route.query.type?this.$route.query.type:'purchaseInfo',
        errorInfo:this.errorsListText.join(',')	
      })
    },
    errorsListClose () {
      this.errorsListShow = false
      this.errorsListText = []
    },
    errorsClick () {
      this.errorsListShow = true 
    },
    errorsListSelect (val) {
      if (this.errorsListText.indexOf(val) > -1) {
        for (var i = 0;i < this.errorsListText.length;i++) {
          if (this.errorsListText[i] == val) {
              this.errorsListText.splice(i,1)
          }
        }
      } else {
        this.errorsListText.push(val)
      }
      
    },
    async goUpDownContent (id,type) {
        if (type == 'policyInfo'){ //政策法规
          const detail = await getPolicy('',id)
          this.detailObj = detail.data.current
          this.detarelObj = detail.data
          this.policyInfoShow = false
          this.routerType = 'policyInfo'
          // purchaseInfo/policyInfo/purchaseSecret/purchaseDemand 采购信息/政策法规/涉密采购/采购需求
          // this.genre = ''
        } else if (type == 'purchaseDemand') { // 采购需求
          const detail = await getpurchaseDemand('',id)
          this.detailObj = detail.data.current
          this.detailcontent = detail.data.current.quota
          this.detarelObj = detail.data
          this.policyInfoShow = false
          this.routerType = 'purchaseDemand'
        } else if (type == 'purchaseSecret') { //涉密
          const detail = await getpurchaseSecret('',id)
          this.detailObj = detail.data.current
          this.detarelObj = detail.data
          this.policyInfoShow = false
          this.routerType = 'purchaseSecret'
        } else if (type == 'product') {  // 产品详情页
          const detail = await productContent('',id)
          this.detailObj = detail.data.current
          this.detarelObj = detail.data
          this.routerType = 'product'
          this.policyInfoShow = false
        }else {
          const detail = await getDetail('',id)
          this.detailObj = detail.data
          this.detailObj.createTime = new Date(this.detailObj.createTime).toLocaleDateString().replace(/\//g, "-")
        }
        this.$refs.wrapper.scrollTop = 0
    }
  },
  components: {
    downLoad: r => {
      require(['../components/downLoad'], r)
    },
    goBack: r => {
      require(['../components/goBack'], r)
    }
  }
}
</script>
<style lang="scss">
@import '../css/app';
  .article-detail {
    .goBackTitle{
      span:last-child {
        // padding-left: 37%;
        // float: left;
      }
    }
  }
  .nav-bar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 2.16rem;
  }
  .top-search {
    width: 100%;
    height: 1.2rem;
    background: #0288ac;
    line-height: 1.2rem;
    text-align: center;
    display: flex;
    img {
      width: 2.29333333rem;
      margin: auto 0;
      padding-left: 10px;
    }
    span {
      display: inline-block;
      position: absolute;
      right: .32rem;
      top: .1rem;
      padding: .13333333rem;
      width: .56rem;
      height: .57333333rem;
      z-index: 100;
      img {
        width: 100%;
      }
    }
  }
  #topNav {
    padding: 0 .32rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    height: .96rem;
    line-height: .96rem;
    font-size: .42666667rem;
    color: #121414;
    .swiper-slide {
      width: auto;
      padding: 0 .26666667rem;
      span {
        transition: all .3s ease;
        display: block;
      }
    }
    .active {
      span {
        transform: scale(1.1);
        color: #0288ac;
      }
    }
  }
.article-detail {
  .related {
    padding-bottom: .53333333rem;
    P {
      color: #9b9d9d;
      font-size: .4rem;
      padding-bottom: .26666667rem;
    }
    ul {
      background: #f1f1f1;
      li {
        font-size: 0.4rem;
        line-height: .6rem;
        border-bottom: 1px solid #ccc;
        padding: 0.15rem 0;
        margin: 0 0.2rem;
      }
      li:last-child {
        border-bottom: none;
      }
    }
  }
  .cut-language {
    margin-top: 2.5rem;
    .mint-navbar {
      width: 2.13333333rem;
      height: .66666667rem;
      line-height: .66666667rem;
      border: 1px solid #0288ac;
      color: #0288ac;
      border-radius: 2px;
      margin: .4rem .2rem;
      .mint-tab-item {
        padding: 0;
        font-size: .37333333rem;
        height: .66666667rem;
        line-height: .66666667rem;
        display: block;
        .mint-tab-item-label {
          font-size: .37333333rem;
          height: .66666667rem;
          line-height: .66666667rem;
          display: block;
        }
      }
      a:hover {
        text-decoration: none;
      }
      .mint-tab-item.is-selected {
        color: #ffffff;
        background: #0288ac;
        border-bottom: none;
        margin-bottom: 0;
      }
    }
  }
  .purchaseText {
    font-size: 0.4rem;
    margin-top: 0.4rem;
    margin-bottom: 0.2rem;
    font-weight: 800;
  }
  .title {
    margin-top: 0.4rem;
    font-size: 0.45rem;
    line-height: 0.7rem;
    margin-bottom: 0.5rem;
    font-weight: 800;
  }
  .abpolicy {
    p {
      margin-bottom: 0.3rem;
       font-size: 0.4rem;
        color: #4e86ed;
        span {
          color: #000 ;
        
      }
    }
  }
  .link {
    float: right;
    a {
      color: #4e86ed;
    }
  }
  .sub-title {
    display: inline-block;
    color: #9b9d9d;
    font-size: .29333333rem;
    span {
      margin-right: .26666667rem;
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;      
    }
    b {
      font-style: normal;
      margin-right: .26666667rem;
      display: inline-block;
      padding-right: .32rem;
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .messageText{
    font-size: 0.35555rem;
    letter-spacing: 0.05rem;
    margin-top: 0.2rem;
    color: #515151;
  }
  .purchaseSecretTitle {
    color: #515151; 
  }
  .purchaseDemandTime {
    font-size: 0.3rem;
    color: #515151;
    p {
      margin-top: 0.2rem;
      span {
        float: right;
        a {
          color: #4e86ed;
        }
      }
    }
  }
  .purchaseDemandCon {
    font-size: .4rem !important;
    line-height: 0.7rem !important;
    color: #515151 !important;
    table {
       border-collapse:collapse;
      .tableTitle {
        background: #B8D6FC;
        height: 1rem;
      }
      .select {
        background: #F4F5F7;
      }
      tr {
        td {
          text-align: center;
          border:1px solid #E8E8E9;
          font-size: 0.3rem;
        }
        th {
          text-align: center;
          font-weight: 500;
          font-size: 0.35rem;
          border: 1px solid #E8E8E9;
        }
        td:nth-child(1) {
          width: 50%;
          text-align: left;
          font-size: 0.3rem;
          line-height: 0.5rem;
          // line-height: 1.2rem;
        }
      }
    }
    img {
      width:100% !important;
      height: 100% !important;
      max-width: 100% !important;
          word-break: break-word;
    }
    span {
      font-size: .4rem !important;
      // padding: .4rem 0;
      color: #515151 !important;
          word-break: break-word;
    }
    p {
      font-size: .4rem !important;
      line-height: 0.7rem;
      text-indent: 0rem !important;
      // padding: .4rem 0;
      color: #515151 !important;
      word-break: break-word;
    }
    div {
      font-size: .4rem !important;
      line-height: 0.7rem;
      // padding: .4rem 0;
      color: #515151 !important;
          word-break: break-word;
    }
    h1 {
      font-size: .85rem !important;
      color: #515151 !important;
    }
    h2 {
      font-size: .64rem !important;
      color: #515151 !important;
    }
    h3 {
     font-size: .49rem !important; 
     color: #515151 !important;
    }
    h4 {
      font-size: .42rem !important;
      color: #515151 !important;
    }
    h5 {
      font-size: .35rem !important;
      color: #515151 !important;
    }
    h6 {
      font-size: .32rem !important;
      color: #515151 !important;
    }
  }
  .content {
    padding: .4rem 0;
    font-size: .4rem !important;
      line-height: 0.7rem !important;
    color: #515151 !important;
    .productContent {
      font-size: 0.426666rem;
      color: #000;
      margin-bottom: 0.13333rem;
      display: block;
      font-weight: 800;
    }
    table {
       border-collapse:collapse;
      .tableTitle {
        background: #B8D6FC;
        height: 1rem;
      }
      .select {
        background: #F4F5F7;
      }
      tr {
        td {
          text-align: center;
          border:1px solid #E8E8E9;
          font-size: 0.3rem;
        }
        th {
          text-align: center;
          font-weight: 500;
          font-size: 0.35rem;
          border: 1px solid #E8E8E9;
        }
        td:nth-child(1) {
          width: 50%;
          text-align: left;
          font-size: 0.3rem;
          line-height: 0.5rem;
          // line-height: 1.2rem;
        }
      }
    }
    img {
      width:100% !important;
      height: 100% !important;
      max-width: 100% !important;
    }
    span {
      font-size: .4rem !important;
      // padding: .4rem 0;
      color: #515151 !important;
          word-break: break-word;
    }
    p {
      font-size: .4rem !important;
      line-height: 0.7rem;
      text-indent: 0rem !important;
      // padding: .4rem 0;
      color: #515151 !important;
          word-break: break-word;
    }
    div {
      font-size: .4rem !important;
      line-height: 0.7rem;
      // padding: .4rem 0;
      color: #515151 !important;
          word-break: break-word;
    }
    h1 {
      font-size: .85rem !important;
      color: #515151 !important;
    }
    h2 {
      font-size: .64rem !important;
      color: #515151 !important;
    }
    h3 {
     font-size: .49rem !important; 
     color: #515151 !important;
    }
    h4 {
      font-size: .42rem !important;
      color: #515151 !important;
    }
    h5 {
      font-size: .35rem !important;
      color: #515151 !important;
    }
    h6 {
      font-size: .32rem !important;
      color: #515151 !important;
    }
  }
  .read-num {
    color: #9b9d9d;
    font-size: .29333333rem;
    padding-bottom: .26666667rem;
  }
  .detail-type {
    padding-bottom: .53333333rem;
    overflow: hidden;
    width: 100%;
    li {
      list-style: none;
      width: 1.98rem;
      height: .58666667rem;
      text-align: center;
      line-height: .58666667rem;
      color: .29333333rem;
      border-radius: 4px;
      border: 1px solid #9b9d9d;
      float: left;
      margin-right: .26666667rem;
      margin-bottom: .26666667rem;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .typeName {
    padding-bottom: .53333333rem;
    color: #9b9d9d;
    font-size: .29333333rem;
    span {
      color: #0288ac;
      font-size: .355rem;
    }
  }
  .productImg {
    width: 9.2rem;
    height: 5.2rem;
    display:inline-block;
    margin-top: 0.6666rem;
  }
  .errors {
    text-align: center;
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
    display: none;
    button {
      width: 3.7466666rem;
      height: 1.173333rem;
      border: 0.026666rem solid  rgba(78, 134, 237, 1);
      text-align: center;
      border-radius: 0.5333rem;
      background: #fff;
      color: #4e86ed;
      font-size: 0.426666rem;
    }
  }
  .errorsListBg {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    .errorsList {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 7.17rem;
      height: 3.22rem;
      background: #fff;
      margin-left: -3.585rem;
      margin-top: -1.61rem;
      border-radius: 0.2333rem;
      .errorsListTop {
        height: 2rem;
        width: 100%;
        ul {
          li {
            border: 0.026rem solid rgba(221, 221, 221, 1);
            border-radius: 0.53333rem;
            display: inline-block;
            height: 0.5333rem;
            padding: 0 0.2333rem;
            line-height: 0.5333rem;
            margin-top: 0.2888rem;
            margin-left: 0.2555rem;
          }
          .select {
            border: 0.026666rem solid  rgba(78, 134, 237, 1);
            color: #4e86ed;
          }
        }
      }
      .errorsListbot {
        height: 1.22rem;
        border-top: 0.026rem solid rgba(221, 221, 221, 1);
        width: 100%;
        text-align: center;
        color: #4e86ed;
        font-size: 0.426666rem;
        span {
          display: inline-block;
          width: 49%;
          height: 100%;
          line-height: 1.22rem;
        }
        span:nth-child(1) {
          border-right: 0.026rem solid rgba(221, 221, 221, 1);
        }
      }
    }
  }
}
</style>
