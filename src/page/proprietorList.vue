<template>
    <div>
        <!-- <goBack goBackName="业主分析"/> -->
        <shemiList ref="shemiList" :goBackName="goBackName" :secretLists="secretLists" :listALL="listALL" @getList="getList"/>
    </div>
</template>

<script>
import {proprietor} from '@/service/getData'
export default {
    data () {
        return {
            goBackName: '业主分析',
            secretLists: [],
            listALL:''
        }
    },
    mounted () {
        let serverData = {
            pageNum: 1,
            keyword: '' 
        }
        this.getList('',serverData)
    },
    activated () {
        if (this.$refs.shemiList) {
            this.$refs.shemiList.$refs.secretList.scrollTop = this.$refs.shemiList.secretListTop
        }
    },
    methods: {
        async getList (type,data) {
            if (data.pageNum == 1) {
                this.secretLists = []
            }
            let list = await proprietor({
                pageNum: data.pageNum,
                proprietorName: data.keyword
            });
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

