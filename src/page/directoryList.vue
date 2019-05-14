//企业名录
<template>
    <div class="directoryList">
        <shemiList ref="shemiList" :goBackName="goBackName" :secretLists="secretLists" :listALL="listALL" @getList="getList"/>
    </div>
</template>

<script>
import {company} from '@/service/getData'
export default {

    data () {
        return {
            goBackName: '企业名录',
            secretLists: [],
            listALL:''
        }
    },
    mounted () {
        let serverData = {
            pageNum: 1,
            keyword:''
        }
        this.getList('look',serverData)
        
    },
    activated () {
        // if (this.$route.query.typeName && this.$route.query.typeName !== this.goBackName) {
        //     this.faGuiTypeName = this.$route.query.typeName
        //     let serverData = {
        //         pageNum: 1,
        //         keyword: ''
        //     }
        //     this.getList('',serverData)
        // }
        if (this.$refs.shemiList) {
            this.$refs.shemiList.$refs.secretList.scrollTop = this.$refs.shemiList.secretListTop
        }
    },
    methods: {
        async getList (shemiTab,data) {
            if (data.pageNum == 1) {
                this.secretLists = []
            }
            
            let serverData;
            if (shemiTab == 'look') {
                serverData = {
                    pageNum: data.pageNum,
                    companyName: data.keyword
                }
            } else {
                serverData = {
                    pageNum: data.pageNum,
                    tradeType: data.keyword
                }
            }
            let list = await company(serverData);
            if (list.data && list.status == 200) {
                for (var i = 0; i < list.data.length; i++) {
                    this.secretLists.push(list.data[i])
                }
            } else {
                if (data.pageNum == 1) {
                    this.secretLists = null
                }
            }
            this.listALL = list
            return list
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
    .directoryList {}
</style>

