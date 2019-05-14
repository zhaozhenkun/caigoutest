<template>
  <div class="article-detail">
    <navBar :activeNav ="activeNav" ref="navBar"></navBar>
    <div class="page-loadmore-wrapper" :style="aaa">
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  @top-status-change="handleTopChange" ref="loadmore">
      <div class="YanTaoBear" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div class="YanTaoBearTop">
          <div class="YanTaoBearImg">
            <img :src="imgPath">
            <div style="
                position:  absolute;
                height: 100%;
                width: 100%;
                top: 0;
                background: rgba(0,0,0,0.3);
            "><p>{{detailObj.jp_title}}</p></div>
          </div>
          <div class="YanTaoBearContent">
            <p class="username"><img :src="detailObj.jmi_img"><span>{{detailObj.jmi_username}}</span></p>
            <p class="content" v-if="detailObj.jp_content">
              <span class="contentHtml" v-html="detailObj.jp_content.replace(/\n/g,'<br>').substring(0,35)"></span>
              <span @click="topContentShow" class="hide" v-show="detailObj.jp_content.length > 35">
                <i>...</i>
              </span>
            </p>            
            <p class="commnum">{{detailObj.answerCount}}个观点</p>
          </div>
        </div>
        <div class="YanTaoBearBottom">
          <div class="preference" v-if="preferenceShow && preferenceObj != ''">
            <p class="title">优选观点</p>
            <ul>
              <li>
                <p class="username"><img :src="preferenceObj.jmi_img || '/static/img/YanTao8.f8265a0.png'"><span>{{preferenceObj.jmi_username}}</span><span class="date">{{preferenceObj.ja_qtime.split(' ')[0]}}</span></p>
                <p class="content" v-if="preferenceObj.child"><span class="contentHtml" v-html="preferenceObj.ja_content.replace(/\n/g,'<br>').substring(0,171)"></span><span class="contentShow" @click="contentShow(0,171)" v-show="preferenceObj.ja_content.length > 171"><i>...</i>全文</span></p>
                <p class="content" v-else><span class="contentHtml" v-html="preferenceObj.ja_content.replace(/\n/g,'<br>').substring(0,100)"></span><span class="contentShow" @click="contentShow(0,100)" v-show="preferenceObj.ja_content.length > 100"><i>...</i>全文</span></p>
              </li>
            </ul>
          </div>
          <div class="Other" v-if="optionsObj.length > 0">
            <p class="title">其他观点</p>
            <ul>
              <li v-for="(v,i) in optionsObj" v-if="v.ja_is_opend == 'N'">
                <p class="username"><img :src="v.jmi_img || '/static/img/YanTao8.f8265a0.png'"><span>{{v.jmi_username}}</span><span class="date">{{v.ja_qtime.split(' ')[0]}}</span></p>
                <p class="content" v-if="v.child"><span class="contentHtml" v-html="v.ja_content.replace(/\n/g,'<br>').substring(0,171)"></span><span class="contentShow" @click="contentShow(i,171)" v-show="v.ja_content.length > 171"><i>...</i>全文</span></p>
                <p class="content" v-else><span class="contentHtml" v-html="v.ja_content.replace(/\n/g,'<br>').substring(0,100)"></span><span class="contentShow" @click="contentShow(i,100)" v-show="v.ja_content.length > 100"><i>...</i>全文</span></p>
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    </mt-loadmore>
    </div>
    <downLoad></downLoad>
  </div>
</template>
<script>
import { YanTaoDataAll, YanTaoOptionsAll } from '@/service/getData'
import { Indicator, Lazyload, InfiniteScroll, Loadmore, Toast, Swipe, SwipeItem } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'

export default {
  name: 'articleDetail',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      imgPath:'',
      detailObj:'',
      optionsObj: '',
      preferenceShow: false,
      contentShowHtml: '全文',
      preferenceObj: '',
      allLoaded: false,
      aaa: {
        height: '500px',
        'overflow':'scroll',
        '-webkit-overflow-scrolling': 'touch',
        'margin-top': '2.16rem',
      },
    }
  },
  watch: {
    $route () {
      location.reload()
    }
  },
  async created() {
    document.documentElement.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, false)
    this.activeNav = [
      {
          "jat_id": 94,
          "jat_pid": 1,
          "jat_name": "热点",
          "jat_sort": 93,
          "jat_status": "Y"
      },
    ]
    
    this.imgPath =  require(`../assets/YanTao${this.$route.query.imgPath}.png`)
    await this.getNewsList()
    
    sessionStorage.setItem('lastUrl', 0)  
    var num =window.screen.height - document.getElementsByClassName('nav-bar')[0].clientHeight
    this.aaa.height = num+'px'
  },
  deactivated() {
    if (this.keyword !== this.$route.query.id){
      this.$destroy()
    }
  },
  methods: {
   async getNewsList() {
        Indicator.open()
        const detail = await YanTaoDataAll({
          id: this.$route.query.id
        })
        const Options = await YanTaoOptionsAll({
          jp_id: this.$route.query.id,
          currentpage: this.pageNum
        })
        this.detailObj = detail.data.question
        this.optionsObj = Options.data.answers
        if (this.optionsObj.length > 0) {
          for (var i = 0 ; i < this.optionsObj.length;i++) {
            if (this.optionsObj[i].child) {
              this.optionsObj[i].ja_content = '<span>引用:【<i class="userName">'+this.optionsObj[i].child.jmi_username+'</i><span class="childContent">'+this.optionsObj[i].child.ja_content+'</span>】'+this.optionsObj[i].ja_content+'</span>'
            }
          }
          if (this.optionsObj[0].ja_is_opend == 'Y') {
              this.preferenceShow = true 
              this.preferenceObj = this.optionsObj[0]
          } else {
              this.preferenceShow = false
          }
        }
        Indicator.close()
    },
   contentShow (i,num) {
    if (event.target.nodeName == "SPAN") {
        if (event.target.innerText == '...全文') {
          event.target.parentNode.firstChild.innerHTML = this.optionsObj[i].ja_content.replace(/\n/g,'<br>')
          event.target.innerHTML = '<i></i>收起'
        } else {
          event.target.parentNode.firstChild.innerHTML = this.optionsObj[i].ja_content.replace(/\n/g,'<br>').substring(0,num)
          event.target.innerHTML = '<i>...</i>全文'
        }
    }
   },
   topContentShow () {
     if (event.target.nodeName == "SPAN") {
      if (event.target.className == 'hide') {
        event.target.parentNode.firstChild.innerHTML = this.detailObj.jp_content.replace(/\n/g,'<br>')
        event.target.className = 'show'
        event.target.innerHTML = '<i></i>'
      } else {
        event.target.parentNode.firstChild.innerHTML = this.detailObj.jp_content.replace(/\n/g,'<br>').substring(0,35)
        event.target.className = 'hide'
        event.target.innerHTML = '<i>...</i>'
      }
    }
   },
   async loadTop() {
     if (document.getElementsByClassName('page-loadmore-wrapper')[0].scrollTop <= 0 ) {
        this.pageNum = 1
        this.pageSize = 20
        await this.getNewsList()
        this.$refs.loadmore.onTopLoaded();
     }
    },
    async loadBottom() {
      var pageScroolTop = document.getElementsByClassName('page-loadmore-wrapper')[0]
       if (pageScroolTop.scrollTop+(pageScroolTop.clientHeight) >= pageScroolTop.scrollHeight) {
          if ( pageScroolTop.scrollTop > 0) {
            this.pageNum = this.pageNum + 1  
            } else {
              this.pageNum = this.pageNum
            } 
          await this.getNewsList()
          this.$refs.loadmore.onBottomLoaded();
          if (this.optionsObj.length < 10) {
            this.allLoaded = true
            Toast({
              message: '数据已全部加载完成'
            })
          }
      }
    },
    handleTopChange() {

    }
  },
  components: {
    NavBar: r => {
      require(['../components/NavBar'], r)
    },
    downLoad: r => {
      require(['../components/downLoad'], r)
    }
  }
}
</script>

<style lang="scss">
@import '../css/app';
.YanTaoBear {
  background-color: rgba(241, 241, 241, 1);
  .YanTaoBearTop {
    background: #fff;    
    overflow: hidden;
    .YanTaoBearImg {
      width:  100%;
      height: 5rem;
      position:  relative;
      img {
        height: 100%;
        width: 100%;
      }
      p {
        position:  absolute;
        bottom: 1.0375rem;
        padding-left: 0.3rem;
        font-size: 0.45rem;
        color: #fff;
      }
    }
    .YanTaoBearContent {
      margin-top: 0.375rem;
      padding-left: 0.3875rem;
      padding-right: 0.5875rem;
      .username {
        img {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;
        }
        span {
          font-size: 0.325rem;
          color: #9b9d9d;
          padding-left: 0.2625rem;
        }
      }
      .content {
        font-size: 0.4rem;
        color: #333333;
        padding-left: 0.75rem;
        letter-spacing: 0.02rem;
        .hide {
          display: inline-block;
          width: 0.9rem;
          height: 0.36rem;
          background:url('./../assets/YanTaoB.png') no-repeat right bottom;              
          background-size: 0.3rem 0.175rem;
        }
        .show {
          display: inline-block;
          width: 0.9rem;
          height: 0.36rem;
          background:url('./../assets/YanTaoT.png') no-repeat right bottom;          
          background-size: 0.3rem 0.175rem;
        }
      }
      .commnum {
        margin-top: 0.3625rem;
        font-size:0.4rem;
        color: #333333;
        margin-bottom: 0.35rem;
      }
      img {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        display:  inline-block;
        vertical-align: middle;
      }
    }
  }
  .YanTaoBearBottom {
    margin-top: 0.3125rem;
    background: #fff;
    padding-top: 0.362rem;
    .Other {
      padding-top: 0.362rem;
      .title {
        color: #333333;
        font-size: 0.386rem;
        padding-left: 0.362rem;
        padding-right: 0.289rem;
      }
    }
    .preference {
      .title {
        color: #333333;
        font-size: 0.386rem;
        padding-left: 0.362rem;
        padding-right: 0.289rem;
      }
    }
    ul {
      li {
        margin-top: 0.362rem;
        border-bottom: 1px solid #2333;
        padding-left: 0.362rem;
        padding-right: 0.289rem;
        .username {
          img {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            display:  inline-block;
            vertical-align: middle;
          }
          span {
            color: #9b9d9d;
            font-size: 0.314rem;
            padding-left: 0.25rem;
          }
          .date {
            float: right;
            margin-top: 0.15rem;
          }
        }
        .content {
          padding-left: 0.76rem;
          font-size: 0.38rem;
          padding-bottom: 0.362rem;
          .contentHtml {
            line-height: 0.55rem;
            word-wrap: break-word;
            .userName {
              color: #3146af;
              font-style: inherit;
            }
            .childContent {
              color:#9b9d9d;
            }
          }
          .contentShow {
            color: #0288ac;
            i {
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
