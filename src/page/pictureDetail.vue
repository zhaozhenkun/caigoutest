<template>
  <div>
    <navBar :activeNav ="activeNav"></navBar>
    <div class="picture-detail" ref="page">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in detailArr">
            <div class="img-title">
              <span class="source-and-time" v-if="desShow">
                <b>来源：</b>
                <b>{{item.jca_soure}}</b>
              </span>
              <div class="img-des"  v-if="desShow">
                <ul class="detail-type">
                  <li v-for="i in item.detailType" @click="godetailType(i)" v-if="i != ''">{{i}}</li>
                </ul>
                <p><span>{{item.num}}/<i>{{item.detailNum}}</i></span>{{item.content}}</p>
              </div>
            </div>
            <div class="img-detail" @click="imgDetail">
              <img :src="item.imgUrl" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <downLoad></downLoad>
  </div>
</template>
<script>
import { getDetail } from '@/service/getData'
import { Indicator } from 'mint-ui'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { setStore, getStore, removeStore } from '@/config/utils'

export default {
  name: 'pictureDetail',
  data() {
    return {
      detailObj: {},
      detailArr: [],
      keyword: '',
      desShow: true // 图片来源描述是否显示
    }
  },
  components: {
    NavBar: r => {
      require(['../components/NavBar'], r)
    },
    downLoad: r => {
      require(['../components/downLoad'], r)
    }
  },
  methods: {
    // 点击图片事件
    imgDetail () {
      if (this.desShow) {
        this.desShow = false
      } else {
        this.desShow = true        
      }
    },
    goSearch() {
      this.$router.push({
        path: '/search'
      })
    },
    goHome() {
      this.$router.push({
        path: '/'
      })
    }, 
    godetailType(keyword) {
      this.$router.push({
        path: '/search',
        query: {keyword: keyword}
      })
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
    Indicator.open()
  },
  async mounted() {
    this.$refs.page.style.height = `${document.documentElement.clientHeight - 75}px`
    const detail = await getDetail({
      type: this.$route.query.type,
      id: this.$route.query.id
    })
    this.detailObj = detail.data.article.contentindex
    var stand = detail.data.article.jca_strand_id
    this.detailObj.forEach((element, index) => {
      var obj = {}
      obj.num = element
      obj.detailNum = this.detailObj.length
      obj.jca_soure = detail.data.article.jca_soure
      obj.imgUrl = detail.data.article.pathcontent[index]
      obj.content = detail.data.article.textcontent[index]
      obj.detailType = stand.split(',')   
      obj.keywords = detail.data.article.keywords 
      this.detailArr.push(obj)
    })
    if (detail.data.article.jca_en_title != '' && detail.data.article.jca_en_title != null) {
     document.getElementsByTagName('title')[0].innerHTML=detail.data.article.jca_en_title     
    } else {
     document.getElementsByTagName('title')[0].innerHTML=detail.data.article.jca_title          
    }
    if (document.getElementsByTagName('meta')) {
      var meta = document.getElementsByTagName('meta')
      for (var i = 0; i < meta.length;i++) {
        if (meta[i].name == 'description') {
          meta[i].content = this.detailArr[0].keywords
        }
      }
    }
    Indicator.close()    
    this.$nextTick(() =>{
      var mySwiper = new Swiper('.swiper-container', {
      })
    })
    sessionStorage.setItem('lastUrl', 0)      
       
  },
  deactivated() {
    if (this.keyword !== this.$route.query.id){
      this.$destroy()
    }
  }
}
</script>
<style lang="scss">
@import '../css/app';
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
    margin-top: 0;
    .swiper-slide {
      width: auto !important;
      padding: 0 .26666667rem;
      background: #fff;
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
.picture-detail {
  width: 100%;
  background: #000;
  color: #fff;
  .swiper-container {
    height: 100%;
    width: 100%;
    margin-top: 2.2rem;
  }
  .swiper-slide {
    width: 100%;
    height: 100%;
    background: #000;
    position: relative;
    .img-detail {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top:0;
      img {
        width: 100%;
      }
    }
    .img-title {
      width: 100%;
      height: calc(100% - .8rem);
      padding: .4rem 0;
      position: absolute;
      .source-and-time {
        display: inline-block;
        width: calc(100% - 0.8rem);
        padding: 0 .4rem;
        b{
          font-size: .29333333rem;
          font-weight: normal;
          display: inline-block;
          max-width: 40%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .detail-type {
        overflow: hidden;
        width: 100%;
        padding-top: .4rem;
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
      .img-des {
        position: absolute;
        z-index: 2;
        bottom: 0px;
        overflow-y: auto;
        max-height: 30%;
        width: calc(100% - 0.8rem);
        padding: 0 0.4rem 0.4rem;
        background: rgba(0,0,0,0.5);
        p {
          span {
            margin-right: 10px;
            i {
              font-style: normal;
              font-size: .32rem;
            }
          }
          font-size: .37333333rem;
        }
      }
    }
  }
}
</style>
