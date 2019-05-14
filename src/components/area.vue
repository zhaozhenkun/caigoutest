<template>

    <div class="critAllBG" @click.stop="closeCrit">
        <div class="critAll">
            <div class="critAllLeft">
                <ul>
                    <li v-for="(item,index) in dataList" :key="index" @click="areaChild(index)" :class="selectKey == index?'select':''">{{item.province}}</li>
                </ul>
            </div>
            <div class="critAllRight">
                <ul>
                    <li v-for="(item,index) in childDataList" :key="index" @click="areaSelect(index)"  :class="selectChildKey == index?'select':''">{{item.name}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import areaJson from '../../static/critAll.json'

export default {
    data () {
        return {
            dataList:'',
            childDataList: '',
            selectKey: 0,
            selectChildKey: -1
        }
    },
    mounted () {
        this.dataList = areaJson
        this.childDataList = areaJson[0].city
        // this.areaRightData = areaJson.alphabet
    },
    activated () {
        this.selectKey = 0
        this.selectChildKey = -1
        this.childDataList = areaJson[0].city
    },
    methods: {
        areaChild (index) {
            this.selectKey = index
            this.childDataList = areaJson[index].city
        },
        areaSelect (index) {
            this.selectChildKey = index;
            this.$emit('critAllShow',false,this.childDataList[index].name)
        },
        closeCrit (event) {
            if (event.target.className == 'critAllBG') {
                this.$emit('critBgAllShow')
            }
        }
    }
}
</script>

<style lang="scss">
    .critAllBG {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 2.39rem;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    }
    .critAll {
        position: absolute;
        top: 0rem;
        width: 100%;
        z-index: 1000;
        overflow: hidden;
        height: 9.46666rem;
        background: #fff;
        .critAllLeft {
            width: 50%;
            height: 100%;
            float: left;
            overflow: scroll;
             -webkit-overflow-scrolling:touch;
            ul {
                li {
                    width: 100%;
                    margin: 0.46666rem 0;
                    text-align: center;
                    font-size: 0.4266rem;
                    color: #333;
                }
                .select {
                    color: #4e86ed;
                }
            }
        }
        .critAllRight {
            width: 50%;
            height: 100%;
            float: left;
            background: #F8F9FB;
            overflow: scroll;
             -webkit-overflow-scrolling:touch;
            ul {
                li {
                    width: 100%;
                    margin: 0.46666rem 0;
                    text-align: center;
                    font-size: 0.4266rem;
                    color: #333;
                }
                .select {
                    color: #4e86ed;
                }
            }
        }
    }
</style>

