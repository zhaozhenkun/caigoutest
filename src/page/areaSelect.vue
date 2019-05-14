<template>
    <div >
        <goBack goBackName="地区选择" path='/' :LocationCity='LocationCity' v-if="routerPath !== 'search'"/>
        <div  class="areaSele"  >
            <div class="currentArea">
                <p class="areaTitle">当前位置</p>
                <div class="currentAreaShow">
                    <span>
                        <i></i>
                        {{LocationCity}}
                    </span>
                    <span class="newArea" @click="city">
                        刷新
                    </span>
                </div>
            </div>
            <div  ref="area" id="area"  @scroll="areaTouch"  :style="'height:'+wrapperHeight+'px;overflow:scroll; -webkit-overflow-scrolling:touch;'">
                <div class="areaList" v-for="(item,index) in dataList" :key="index">
                    <p class="areaAll" v-if="index == 0 && routerPath !== 'search'"  @click="areaUlSelect('全国')">全国</p>
                    <p class="areaTitle" ref="areaTitle">{{item.idx}}</p>
                    <ul ref="areaUl">
                        <li v-for="(val,key) in item.cities" :key="key" @click="areaUlSelect(val.name)">
                            {{val.name}}
                        </li>
                    </ul>
                </div>
            </div>
            
            
            <div :class="routerPath == 'search'?'areaRight searchAreaRight':'areaRight'">
                <ul v-for="(val,key) in areaRightData" :key="key" @click="areaRight(key)">
                    <li>{{val}}</li>
                </ul>
            </div>
            <div class="areaText" v-if="areaTextShow">
                {{areaText}}
            </div>
        </div>
    </div>
</template>


<script>
import areaJson from '../../static/crit.json'
import BMap from 'BMap'
export default {
    data () {
        return {
            dataList:'',
            areaRightData: '',
            areaText: '',
            areaTextShow: false,
            LocationCity: '正在定位',
            wrapperHeight: '',
            areaTouchEndShow: true,
            routerPath: ''
        }
    },
    mounted () {
        this.dataList = areaJson.cityList
        this.areaRightData = areaJson.alphabet
        this.routerPath = this.$route.name
        if (this.$parent.source) {
            if(this.$parent.source.code == '全军武器装备采购网' || this.$parent.source.code == '武警物资采购网' || this.$parent.source.code == '军队采购网') {
                this.LocationCity = '全国';
            }
        } else if (this.$parent.address !== '' && this.$parent.address !== '全国' && this.$parent.address ) {
            this.LocationCity = this.$parent.address;
        }else  {
            this.city()
        }
       
        this.areaTouch()
        if (this.routerPath == 'search') {
            this.wrapperHeight = 250;
        } else {
            this.wrapperHeight = document.documentElement.clientHeight - 50;
        }
        
    },
    components: {
        goBack: r => {
            require(['../components/goBack'], r)
        }
    },
    methods: {
        areaTouch (event) {
            // document.addEventListener ('scroll',() => {
                if (this.$refs.areaTitle) {
                    let areaTitle = this.$refs.areaTitle;
                    let areaUl = this.$refs.areaUl;
                    for (var i = 0; i < areaTitle.length; i++) {
                        if (this.$refs.area.scrollTop <= areaTitle[i].offsetTop + areaUl[i].offsetHeight  - this.$refs.area.offsetTop && this.$refs.area.scrollTop  >= areaTitle[i].offsetTop - this.$refs.area.offsetTop) {
                            this.areaTextShow = true
                            this.areaText = areaTitle[i].innerText
                            this.areaTouchEnd()
                        }
                    }
                }
            // })
            
        },
        areaTouchEnd () {
            if (this.areaTouchEndShow) {
                this.areaTouchEndShow = false
                setTimeout(() => {
                    this.areaTextShow = false
                    this.areaTouchEndShow = true
                }, 1000);
            }
        },
        areaRight (key) {
            this.$refs.area.scrollTop = this.$refs.areaTitle[key].offsetTop - this.$refs.area.offsetTop
            this.areaTextShow = true
            this.areaText = this.$refs.areaTitle[key].innerText
            this.areaTouchEnd()
        },
        city(){    //定义获取城市方法
            const geolocation = new BMap.Geolocation();
            var _this = this
            geolocation.getCurrentPosition(function getinfo(position){
                let city = position.address.city;             //获取城市信息
                let province = position.address.province;    //获取省份信息
                _this.LocationCity = city

                console.log(city)
                if (_this.routerPath == 'search') {
                    _this.$emit('areaGetVal',city)
                } else {
                    window.localStorage.setItem('locationCity', city);
                }
                
            }, function(e) {
                _this.LocationCity = "定位失败"
                window.localStorage.setItem('locationCity', '定位失败');
            }, {provider: 'baidu'});		
        },
        areaUlSelect (name) {
            this.LocationCity = name;
            if (this.routerPath == 'search') {
                this.$emit('areaGetVal',name)
            }else {
                window.localStorage.setItem('locationCity', name);
                this.$router.push({
                    path:'/home',
                    query: {
                        LocationCity: this.LocationCity
                    }
                })
            }
            
        }
    }
}
</script>

<style lang="scss">
    .areaSele {
        width: 100%;
        background: #F8F9FB;
        height: 100%;
        overflow: scroll;
         -webkit-overflow-scrolling:touch;
        position: relative;
        .currentArea {
            // position: fixed;
            // top: 49px;
            // left: 0;
            // background: #fff;
            // width: 100%;
            .areaTitle {
                height: 0.84rem;
                font-size: 0.37333rem;
                color: #999999;
                line-height: 0.84rem;
                padding:0 0.4rem;
            }
            .currentAreaShow {
                height: 1.28rem;
                line-height: 1.28rem;
                padding:0 0.4rem;
                background: #fff;
                font-size: 0.4rem;
                color: #333;
                margin-bottom: 0.2666rem;
                .newArea {
                    float: right;
                }
            }
        }
        .areaList {
            .areaAll {
                height: 1.28rem;
                line-height: 1.28rem;
                padding:0 0.4rem;
                background: #fff;
                font-size: 0.4rem;
                color: #333;
            }
            .areaTitle {
                height: 0.84rem;
                font-size: 0.37333rem;
                color: #999999;
                line-height: 0.84rem;
                padding:0 0.4rem;
            }
            ul {
                background: #fff;
                li {
                    height: 1.28rem;
                    line-height: 1.28rem;
                    border-bottom: 0.02666rem solid #DFDFDF;
                    margin:0 0.4rem;
                    font-size: 0.4rem;
                    color: #333;
                }
                li:last-child {
                    border-bottom: none;
                }
            }
        }   
        .areaText {
            position: fixed;
            top:50%;
            left: 50%;
            width: 1.12rem;
            height: 1.2rem;
            margin-left: -0.56rem;
            margin-top: -0.6rem;
            background: rgba(0,0,0,0.5);
            color: #fff;
            text-align: center;
            line-height: 1.2rem;
            font-size: 0.48rem;
            
        }
        .areaRight {
            position: absolute;
            top: 2.544rem;
            right: 0;
            ul {
                li {
                    margin-bottom: 0.2rem;
                    font-size: 0.346rem;
                    color: #b3b3b3;
                }
            }
        }
        .searchAreaRight {
            top: 0;
            ul {
                li {
                    margin-bottom: 0rem;
                }
            }
        }
    }
</style>

