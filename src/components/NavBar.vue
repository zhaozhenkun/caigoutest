<template>
  <div class="nav-bar">
    <div class="top-search">
      <span @click="goSearch()"><img src="./../assets/search-icon.png" alt=""></span>
      <img src="./../assets/logo.png" alt="" @click="goLogo()">
    </div>
    <div id="topNav" class="swiper-container swiper-container-horizontal swiper-container-free-mode">
      <div class="swiper-wrapper">
        <div class="swiper-slide active" v-for="item in activeNav">
          <span>{{item.jat_name}}</span>
        </div>
        <div class="swiper-slide" v-for="item in navArr">
          <span>{{item.jat_name}}</span>
        </div>
      </div>
    </div>
    <div @click="labelClick" class="labelBut"></div>
    <div class="labelSelect" :style="labelStyle" v-show="labelShow">
        <div @click="labelClose" class="labelClose"><span></span></div>
        <div>
            <div class="labelSelectConent">
                <div>
                    <span class="title">我的频道</span>
                    <span @click="labelEdit" class="ok">{{labelListShow?'完成':'编辑'}}</span>
                </div>
                <ul>
                    <li v-for="(value,index) in activeNav" class="labelscolor">{{value.jat_name}}</li>                    
                    <li v-for="(v,i) in navArr" :class="i < 4? 'labelscolor': ''" :key="i" @click="labelAll(i,v.jat_name)">{{v.jat_name}}<i v-if="v.jat_name != '热点' && v.jat_name != '推荐' && v.jat_name != '图片' && v.jat_name != '视频' && v.jat_name != '研讨厅' && labelListShow"></i></li>
                </ul>
            </div>
            <div class="labelSelectConent">
                <div>
                    <span class="title2">更多频道</span>
                </div>
                <ul > 
                    <li v-for="(v,i) in navArrAll" :key="i" @click="labelTop(i)">{{v.jat_name}}</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Swiper from 'swiper'
import { channelListAll } from '@/service/getData'
import { Indicator, Lazyload, InfiniteScroll, Loadmore, Toast, Swipe, SwipeItem } from 'mint-ui'
import 'swiper/dist/css/swiper.min.css'

export default {
  name: 'navbar',
  props: {
    activeNav: {
      type: Array
    }
  },
	data() {
        return {
            navArr:[],
            navArrAll:[],
            labelStyle: {
                height: '1800px'
            },
            labelShow: false,
            labelEditText: '编辑',
            labelListShow: false
        }
  },
  methods: {
      channelListAll () {
        var that = this
        var getChannelList = Promise.resolve(channelListAll())
        getChannelList.then(function (getChannelList) { 
            if (getChannelList.data) {
                that.navArrAll = getChannelList.data.otherChannel
                for (var i = 0; i < that.navArrAll.length; i++) {
                    for (var j = 0; j < that.navArr.length; j++) {
                        if (that.navArrAll[i].jat_id == that.navArr[j].jat_id) {
                            that.navArrAll.splice(i,1)
                        }
                    }
                }
            }
        })
    },
    goSearch() {
      this.$router.push({
        path: '/search'
      })
    },
    goLogo() {
      this.$router.push({
        path: '/'
      })
    },
    labelClick () {
      this.labelShow = true
      this.labelStyle.height = document.body.clientHeight+'px'
      if (document.getElementsByClassName('mint-loadmore')[0]) {
        document.getElementsByClassName('mint-loadmore')[0].style.display="none"
      } else if (document.getElementsByClassName('video-details')[0]) {
        document.getElementsByClassName('video-details')[0].style.display="none"          
      } else if (document.getElementById('artContent')) {
        document.getElementById('artContent').style.display="none"     
      } else if (document.getElementsByClassName('picture-detail')) {
        document.getElementsByClassName('picture-detail')[0].style.display="none"  
      }
    },
    chinese2Unicode(value){
        var preStr='\\u'
        var cnReg=/[\u0391-\uFFE5]/gm
        if(cnReg.test(value)){
            var ret=value.replace(cnReg,function(str){return preStr+str.charCodeAt(0).toString(16)})
            return ret 
        }else{ 
        }
    },
    labelClose () {
      this.labelShow = false
      if (document.getElementsByClassName('mint-loadmore')[0]) {
        document.getElementsByClassName('mint-loadmore')[0].style.display="block"
      } else if (document.getElementsByClassName('video-details')[0]) {
        document.getElementsByClassName('video-details')[0].style.display="block"          
      } else if (document.getElementById('artContent')) {
        document.getElementById('artContent').style.display="block"     
      } else if (document.getElementsByClassName('picture-detail')) {
        document.getElementsByClassName('picture-detail')[0].style.display="block"  
      }
      document.cookie = 'navArr'+'='+this.chinese2Unicode(JSON.stringify(this.navArr))
      var that = this
      this.mySwiper = new Swiper('#topNav', {
            freeMode: true,
            freeModeMomentumRatio: 0.5,
            slidesPerView: 'auto',
        }) 
      that.mySwiper.on('tap', (swiper, e) =>{
        if (that.$route.query.type != undefined) {
            this.$router.push({
                path: '/',
                query:{
                'Navid': swiper.clickedIndex
                }
            })
            return;
        }
        if (swiper.clickedIndex !== 0) { 
        var cid = this.navArr[swiper.clickedIndex-1].jat_id
        var pid = this.navArr[swiper.clickedIndex-1].jat_pid
        }
        var swiperWidth = that.mySwiper.container[0].clientWidth
        var maxTranslate = that.mySwiper.maxTranslate()
        var maxWidth = -maxTranslate + swiperWidth / 2
        const topNav = document.getElementById('topNav')
        if (swiper.clickedIndex < 4 ){
            return;
        }
        that.$emit('navIndex', swiper.clickedIndex,cid,pid)
        var slide = swiper.slides[swiper.clickedIndex]
        var slideLeft = slide.offsetLeft
        var slideWidth = slide.clientWidth
        var slideCenter = slideLeft + slideWidth / 2
        that.mySwiper.setWrapperTransition(300)
        if (slideCenter < swiperWidth / 2) {
          that.mySwiper.setWrapperTranslate(0)
        } else if (slideCenter > maxWidth) {
          that.mySwiper.setWrapperTranslate(maxTranslate)
        } else {
          var nowTlanslate = slideCenter - swiperWidth / 2
          that.mySwiper.setWrapperTranslate(-nowTlanslate)
        }
        var activeDiv = document.getElementsByClassName('active')[0]
        activeDiv.setAttribute('class','swiper-slide')
        var nextDIv = document.getElementsByClassName('swiper-slide')[swiper.clickedIndex]
        nextDIv.setAttribute('class','swiper-slide active')
    })    
    },
    labelTop (i) {
      this.navArr.push(this.navArrAll[i])
      this.navArrAll.splice(i,1)
    },
    labelAll (i,name) {
        if (name != '热点' && name != '推荐' && name != '图片' && name!= '视频' && name != '研讨厅' && this.labelListShow) {
            this.navArrAll.push(this.navArr[i])
            this.navArr.splice(i,1)
        }
    },
    labelEdit () {
        if (this.labelListShow) {
            this.labelListShow = false
        } else {
            this.labelListShow = true
        }
    },
    pushNavBar (cid,pid,name) {
        var obj = {
                    "jat_id": cid,
                    "jat_pid": pid,
                    "jat_name": name
                };
        var ss = ''
        for (var j = 0; j < this.navArr.length; j++) {
            if (this.navArr[j].jat_id == obj.jat_id) {
                ss= '1'
                this.$router.push({
                    path: '/',
                    query:{
                    'Navid': j+1
                    }
                })
            }
        }
        if (ss == '') {
                this.navArr.push(obj)
                this.$router.push({
                    path: '/',
                    query:{
                    'Navid': this.navArr.length
                    }
                })
        }
        document.cookie = 'navArr'+'='+this.chinese2Unicode(JSON.stringify(this.navArr))
    },
  },
  async created() {
    document.documentElement.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, false)
    var cookie = document.cookie.split(';')
    var infoObj = {}
    for (var i = 0;i < cookie.length; i++) {
        var aaa = cookie[i].split('=')
        var keyName = aaa[0].trim()
        infoObj[keyName] = aaa[1]
    }
    if (infoObj.navArr == undefined) {
        this.navArr = [
                {
                    "jat_id": 95,
                    "jat_pid": 2,
                    "jat_name": "推荐",
                    "jat_sort": 93,
                    "jat_status": "Y"
                },
                {
                    "jat_id": 98,
                    "jat_pid": 6,
                    "jat_name": "图片",
                    "jat_sort": 93,
                    "jat_status": "Y"
                },
                {
                    "jat_id": 97,
                    "jat_pid": 5,
                    "jat_name": "视频",
                    "jat_sort": 93,
                    "jat_status": "Y"
                },
                {
                    "jat_id": 0,
                    "jat_pid": 0,
                    "jat_name": "研讨厅",
                    "jat_sort": 0,
                    "jat_status": "Y"
                }
        ]
    } else {
        this.navArr = JSON.parse(infoObj.navArr)
    }
    this.channelListAll()
    Indicator.open()
  },
  async mounted() {
    
    var that = this
    
    // await this.channelListAll()
    // this.labelStyle.height = parseFloat(document.body.clientHeight+50)+'px'
    that.mySwiper = new Swiper('#topNav', {
      freeMode: true,
      freeModeMomentumRatio: 0.5,
      slidesPerView: 'auto',
    })
    
    var swiperWidth = that.mySwiper.container[0].clientWidth
    var maxTranslate = that.mySwiper.maxTranslate()
    var maxWidth = -maxTranslate + swiperWidth / 2
    const topNav = document.getElementById('topNav')
    if (that.$route.query.Navid != undefined) {
        var id = parseFloat(that.$route.query.Navid)
        if (id !== 0) {
        var cid = this.navArr[id - 1].jat_id
        var pid = this.navArr[id - 1].jat_pid
        that.$emit('navIndex', id,cid,pid)
        }
        var slide = document.getElementsByClassName('swiper-slide')[id]
        var slideLeft = slide.offsetLeft
        var slideWidth = slide.clientWidth
        var slideCenter = slideLeft + slideWidth / 2
         that.mySwiper.setWrapperTransition(300)
        if (slideCenter < swiperWidth / 2) {
          that.mySwiper.setWrapperTranslate(0)
        } else if (slideCenter > maxWidth) {
          that.mySwiper.setWrapperTranslate(maxTranslate)
        } else {
          var nowTlanslate = slideCenter - swiperWidth / 2
          that.mySwiper.setWrapperTranslate(-nowTlanslate)
        }
        var activeDiv = document.getElementsByClassName('active')[0]
        activeDiv.setAttribute('class','swiper-slide')
        var nextDIv = document.getElementsByClassName('swiper-slide')[id]
        nextDIv.setAttribute('class','swiper-slide active')
        if (nextDIv.innerText.indexOf("视频") != -1) {
          this.nextDIvText = true
        } else {
          this.nextDIvText = false          
        }
      }
    that.mySwiper.on('tap', (swiper, e) =>{
        if (swiper.clickedIndex == undefined) {
            return;
        }
        if (that.$route.query.type != undefined) {
            this.$router.push({
                path: '/',
                query:{
                'Navid': swiper.clickedIndex
                }
            })
            return;
        }
        if (swiper.clickedIndex !== 0) { 
        var cid = this.navArr[swiper.clickedIndex-1].jat_id
        var pid = this.navArr[swiper.clickedIndex-1].jat_pid
        }
        that.$emit('navIndex', swiper.clickedIndex,cid,pid)
        var slide = swiper.slides[swiper.clickedIndex]
        var slideLeft = slide.offsetLeft
        var slideWidth = slide.clientWidth
        var slideCenter = slideLeft + slideWidth / 2
        that.mySwiper.setWrapperTransition(300)
        if (slideCenter < swiperWidth / 2) {
          that.mySwiper.setWrapperTranslate(0)
        } else if (slideCenter > maxWidth) {
          that.mySwiper.setWrapperTranslate(maxTranslate)
        } else {
          var nowTlanslate = slideCenter - swiperWidth / 2
          that.mySwiper.setWrapperTranslate(-nowTlanslate)
        }
        var activeDiv = document.getElementsByClassName('active')[0]
        activeDiv.setAttribute('class','swiper-slide')
        var nextDIv = document.getElementsByClassName('swiper-slide')[swiper.clickedIndex]
        nextDIv.setAttribute('class','swiper-slide active')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .nav-bar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 9999;
    height: 1200px;
    width: 100%;
    height: 2.16rem;
    border-bottom: 1px solid #dfdfdf;
    background: #fff;
  }
  .labelBut {
    width: 8%;
    float: right;
    background: url('./../assets/label.png') no-repeat;
    height: .96rem;
    margin-top: 0.18rem;
    background-size: 0.6rem;
  }
  .labelSelect {
      background: #fff;
      width: 100%;
      position: fixed;
      top: 1.2rem;
      z-index: 10000;
      padding: 0 0.3rem;
        .labelClose {
            overflow: hidden;
            span{
                background: url('./../assets/labelClose.png') no-repeat;
                display: inline-block;
                float: right;
                width: 0.8rem;
                height: 0.8rem;
                background-size: 0.6rem;
                padding-right: 0.5rem;
                margin-top: 0.2rem;
                margin-bottom: 0.2rem;
            }
        }
        .labelSelectConent {
            overflow: hidden;
            div {
                margin-bottom: 0.2rem;
                padding: 0 0.4rem;
                .title {
                    font-size: 0.4rem;
                    font-weight: 800;
                    color: 999999;
                    color: #999999;
                }
                .ok {
                    color: #0288AC;
                    float: right;
                    padding-right: 0.8rem;
                    // line-height: 1rem;
                }
                .title2 {
                    font-size: 0.4rem;
                    font-weight: 800;
                    color: 999999;
                    color: #0288AC;
                }
            }
            ul {
                .labelscolor {
                   color: #0288AC; 
                }
                li {
                    width: 1.7rem;
                    margin: 0.15rem 0.3rem;
                    height: 0.7rem;
                    float: left;
                    background: #F1F1F1;
                    line-height: 0.8rem;
                    text-align: center;
                    border-radius: 0.1rem;
                    position: relative;
                    i {
                        position: absolute;
                        /* top: -11px; */
                        display: inline-block;
                        width: 0.5rem;
                        height: 0.5rem;
                        top: -0.2rem;
                        right: -0.2rem;
                        background: url('./../assets/labelCloses.png') no-repeat;
                        background-size: 0.5rem;
                    }
                }
            }          
        }
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
      padding-left: 0.2rem;
    //   margin: auto;
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
    width: 90%;
    box-sizing: border-box;
    overflow: hidden;
    background: #fff;
    height: .96rem;
    line-height: .96rem;
    font-size: .42666667rem;
    color: #121414;
    float: left;
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
</style>
