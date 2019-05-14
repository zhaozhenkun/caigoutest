<template>
  <div >
    <NavBar :activeNav ="activeNav"></NavBar>
    <div class="video-details" ref="page">
      <span class="source-and-time">
        <b>来源：</b>
        <b>{{detailObj.jca_soure}}</b>
      </span>
      <span class="source-and-time">
        <b>发布时间：</b>
        <b>{{detailObj.dateformat}}</b>
      </span>
      <div class="video">
        <div class="open">
          <video controls webkit-playsinline playsinline 
            :poster="detailObj.jca_img"
            :src="detailObj.vieo_path"
            preload="auto" duration="1">
          </video>
        </div>
        <span>播放：{{detailObj.jca_browse}}</span>
        <ul class="detail-type">
          <li v-for="item in detailType" @click="godetailType(item)" v-if="item != ''">{{item}}</li>
        </ul>
      </div>
    </div>
    <downLoad></downLoad>
  </div>
</template>
<script>
import { getDetail } from '@/service/getData'
import { Indicator } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'

export default {
  name: 'videoDetail',
  data() {
    return {
      detailObj: {},
      detailType: [],
      keyword:''
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
    sessionStorage.setItem('lastUrl', 0)
  },
  components: {
    NavBar: r => {
      require(['../components/NavBar'], r)
    },
    downLoad: r => {
      require(['../components/downLoad'], r)
    }
  },
  async mounted() {
    this.$refs.page.style.height = `${document.documentElement.clientHeight - 75}px`
    const detail = await getDetail({
      type: this.$route.query.type,
      id: this.$route.query.id
    })
    this.detailObj = detail.data.article
    if (this.detailObj.jca_en_title != '' && this.detailObj.jca_en_title != null) {
     document.getElementsByTagName('title')[0].innerHTML=this.detailObj.jca_en_title     
    } else {
     document.getElementsByTagName('title')[0].innerHTML=this.detailObj.jca_title          
    }
    var stand = detail.data.article.jca_strand_id    
    this.detailType = stand.split(',')
     if (document.getElementsByTagName('meta')) {
      var meta = document.getElementsByTagName('meta')
      for (var i = 0; i < meta.length;i++) {
        if (meta[i].name == 'description') {
          meta[i].content =   this.detailObj.keywords
        }
      }
    }
    Indicator.close()    
  },
  deactivated() {
    if (this.keyword !== this.$route.query.id){
      this.$destroy()
    }
  },
  methods: {
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
.video-details {
  width: 100%;
  background: #000;
  padding: 0.4rem 0;
  box-sizing: border-box;
  color: #fff;
  margin-top: 2.2rem;
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
  .video {
    width: 100%;
    height: 5.6rem;
    position: absolute;
    top: 50%;
    margin-top: -3.6rem;
    z-index: 10;
    .open {
      width: 100%;
      height: 100%;
      margin-bottom: .4rem;
      overflow: hidden;
      video {
        width: 100%;
        height: 100%;
      }
    }
    span {
      font-size: .37333333rem;
      padding: 0 .4rem;
    }
  }
  .detail-type {
    overflow: hidden;
    width: 100%;
    padding: .4rem;
    box-sizing: border-box;
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
}
</style>
