<template>
    <div>
        <div class="AppDownLoad" v-show="downloadHref !== false">
            <img class="bottomLogo2" src="./../assets/logo3.png" alt="">
            <img class="bottomLogo" src="./../assets/logo2.png" alt="">
            <div class="right">
                <button @click="AppDownLoad">下载APP</button>
                <i class="close" @click="AppClose">
                <img src="./../assets/close.png" alt="">
                </i>
            </div>
        </div>
    </div>
</template>
<script>
import { getByTypeList, getBannerList } from '@/service/getData'
import { Indicator, Lazyload, InfiniteScroll, Loadmore, Toast, Swipe, SwipeItem } from 'mint-ui'
import { setStore, getStore, removeStore } from '@/config/utils'

export default {
  name: 'home',
  data() {
    return {
      downloadHref: ''
    }
  },
  methods: {
    AppDownLoad() {
      window.location = 'https://cg.calcnext.com/downLoadApp' //打开app下载地址，有app同事提供
      // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
      //  //ios
      //   window.location = 'http://itunes.apple.com/app/id1438694503'
      //   let loadDateTime = Date.now();
      //   let turn = setTimeout(function(){
      //       let timeOutDateTime = Date.now();
      //       if ((timeOutDateTime - loadDateTime) < 1000 ){
      //           window.location = "mingriqingbao://newsDetails?id=101" //打开app下载地址，有app同事提供
      //       }
      //   },600);
      // } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
      //   window.location = "mrqb://mingriqingbao:8888/openapp"
      //   let loadDateTime = Date.now();
      //   let turn = setTimeout(function(){
      //       let timeOutDateTime = Date.now();
      //       if ((timeOutDateTime - loadDateTime) < 1000 ){
      //           window.location = 'http://18042899642.fx.sj.360.cn/qcms/view/t/detail?id=3979045' //打开app下载地址，有app同事提供
      //       }
      //   },600);
      // }
    },
    AppClose () {
      this.downloadHref = false
    }
  }, 
  async mounted() {
  },
}
</script>
<style lang="scss">
@import '../css/app';
  .AppDownLoad {
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0;
    background: rgba(0,0,0,0.6);
    z-index: 10000;
    height: 1.38888rem;
    line-height: 1.38888rem;
    span {
      font-size: 0.38rem;
      color: #333;
    }
    .bottomLogo {
      height: 0.5rem;
      display: inherit;
      display: inline-block;
      vertical-align: middle;
      margin-left: 0.416rem;
      margin-right: 0.27777rem;
    }
    .bottomLogo2 {
        height: 1rem;
        margin-left: 0.3rem;
        vertical-align: middle;
        display: inline-block;
        border-radius: 0.1rem;
    }
    .right {
      display: inline-block;
      float: right;
      line-height: 1.3888rem;
      button {
        height: 0.83rem;
        width: 1.6666666rem;
        background: #4e86ed;
        color: #fff;
        font-size: 0.36rem;
        margin-right: 0.41rem;
        border: none;
        outline: none;
        border-radius: 2px;
      }
      .close {
        display: inline-block;
        margin-right: 0.55rem;
        img {
          width: 0.4rem;
          height: 0.4rem;
          vertical-align: middle;
        }
      }
    }
  }
</style>
