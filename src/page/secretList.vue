// 涉密
<template>
    <div class="secret">
        <!-- <goBack :goBackName="goBackName"/> -->
        <shemiList ref="shemiList" :goBackName="goBackName" :secretLists="secretLists" :listALL="listALL" @getList="getList"/>
        
    </div>

</template>

<script>
import {purchaseSecret,purchaseDemand} from '@/service/getData'
import { Loadmore } from 'mint-ui';
export default {
    data () {
        return {
            goBackName: '涉密采购',
            secretLists: [],
            listALL:'',
            // faGuiTypeName: '全部法规',
            listHeight: 0
        }
    },
    mounted () {
        this.goBackName = this.$route.query.name
        let serverData = {
            pageNum: 1,
            keyword: '' 
        }
        this.getList('',serverData)
    },
     activated () {
        if (this.$route.query.name && this.$route.query.name !== this.goBackName) {
            this.goBackName = this.$route.query.name
            let serverData = {
                pageNum: 1,
                keyword: ''
            }
            this.getList('',serverData)
        }
        if (this.$refs.shemiList) {
            this.$refs.shemiList.$refs.secretList.scrollTop = this.$refs.shemiList.secretListTop
        }
    },
    methods: {
        async getList (type,data) {

            if (data.pageNum == 1) {
                this.secretLists = []
            }
            let serverData = {
                pageNum:data.pageNum,
                keyword:data.keyword
            }
            if (this.goBackName  == '涉密采购') {
                let list = await purchaseSecret(serverData);
                if (list.data && list.status == 200) {
                    for (var i = 0; i < list.data.list.length; i++) {
                        this.secretLists.push(list.data.list[i])
                    }
                }else {
                    if (data.pageNum == 1) {
                        this.secretLists = null
                    }
                }
                this.listALL = list
                return list 
            } else if (this.goBackName  == '采购需求') {
                let list = await purchaseDemand(serverData);
                if (list.data && list.status == 200) {
                    for (var i = 0; i < list.data.length; i++) {
                        this.secretLists.push(list.data[i])
                    }
                }else {
                    if (data.pageNum == 1) {
                        this.secretLists = null
                    }
                }
                this.listALL = list
                return list
            }
            
        }
    },
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        },
        shemiList: r => {
            require(['../components/shemiList'],r)
        }
    }
}
</script>

<style lang="scss">
    .secret {

        .secretConentBg {
            background: rgba(0,0,0,0.5);
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .secretConent {
            width: 5.9333rem;
            height: 3rem;
            background: #fff;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -2.9665rem;
            margin-top: -1.33333rem;
            border-radius: 0.1333rem;
            text-align: center;
            i {
                display: block;
                width: 0.56666rem;
                height: 0.56666rem;
                background: url('../assets/closeShemi.png') no-repeat;
                float: right;
                background-size: 0.5666rem;
            }
            p {
                margin-top: 0.5666rem;
                span {
                    display: block;
                    color: #4e86ed;
                }
                
            }
            button {
                background: #4e86ed;
                color: #fff;
                border: none;
                width: 1.0666rem;
                height: 0.6666rem;
                border-radius: 0.05333rem;
                margin: 0.2666rem 0;
            }
        }
        
    }
</style>

