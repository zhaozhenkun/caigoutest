import Vue from 'vue'
import Router from 'vue-router'
import home from '@/page/home'
import search from '@/page/search'
import hideAgreement from '@/page/hideAgreement'
import userAgreement from '@/page/userAgreement'
import articleDetail from '@/page/articleDetail'
import pushList from '@/page/pushList'
import pictureDetail from '@/page/pictureDetail'
import videoDetail from '@/page/videoDetail'
import YanTaoBean from '@/page/YanTaoBean'
import RecommendMove from '@/page/recommendMove'
import TypeAll from '@/page/typeAll'
import Product from '@/page/product'
import AreaSelect from '@/page/areaSelect'
import SecretList from '@/page/secretList'
import DirectoryRouter from '@/page/directoryRouter'
import DirectoryList from '@/page/directoryList'
import ProprietorList from '@/page/proprietorList'
import DirectoryContent from '@/page/directoryContent'
import PolicyInfo from '@/page/policyInfo'
import DownLoadAPP from '@/page/downLoadApp'
import viewpointMove from '@/page/viewpointMove'
import Study from '@/page/study'
import StudyContent from '@/page/studyContent'
import StudySearch from '@/page/StudySearch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'articleDetail',
      component: articleDetail,
      meta: {
        keepAlive: false // 需要被缓存
      }
      
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/hideAgreement',
      name: 'hideAgreement',
      component: hideAgreement,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/userAgreement',
      name: 'userAgreement',
      component: userAgreement,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/pushList',
      name: 'pushList',
      component: pushList,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/recommendMove',
      name: 'recommendMove',
      component: RecommendMove,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/typeAll',
      name: 'typeAll',
      component: TypeAll,
      meta: {
        keepAlive: false // 需要被缓存
      }
    },
    {
      path: '/product',
      name: 'product',
      component: Product,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/areaSelect',
      name: 'areaSelect',
      component: AreaSelect,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/secretList',
      name: 'secretList',
      component: SecretList,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/directoryRouter',
      name: 'directoryRouter',
      component: DirectoryRouter,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/directoryList',
      name: 'directoryList',
      component: DirectoryList,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/proprietorList',
      name: 'proprietorList',
      component: ProprietorList,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/directoryContent',
      name: 'directoryContent',
      component: DirectoryContent,
      meta: {
        keepAlive: false // 需要被缓存
      }
    },
    {
      path: '/policyInfo',
      name: 'policyInfo',
      component: PolicyInfo,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/downLoadAPP',
      name: 'downLoadAPP',
      component: DownLoadAPP
    },
    {
      path: '/viewpointMove',
      name: 'viewpointMove',
      component: viewpointMove,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/study',
      name: 'study',
      component: Study,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/studyContent',
      name: 'studyContent',
      component: StudyContent
    },
    {
      path: '/studySearch',
      name: 'studySearch',
      component: StudySearch,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    
    // {
    //   path: '/pictureDetail',
    //   name: 'pictureDetail',
    //   component: pictureDetail,
    //   meta: {
    //     keepAlive: false // 需要被缓存
    //   }
    // },
    // {
    //   path: '/videoDetail',
    //   name: 'videoDetail',
    //   component: videoDetail,
    //   meta: {
    //     keepAlive: false // 需要被缓存
    //   }
    // },
    // {
    //   path: '/YanTaoBean',
    //   name: 'YanTaoBean',
    //   component: YanTaoBean,
    //   meta: {
    //     keepAlive: false // 需要被缓存
    //   }
    // }
  ]
})
