<template>
    <div class="policyInfo">
        <div class="policyInfoTop">
            <p>政策法规</p>
        </div>
        <shemiList ref="shemiList" :goBackName="goBackName" :secretLists="secretLists" :listALL="listALL" @getList="getList" :faGuiTypeName="faGuiTypeName" :listHeight="listHeight"/>
        <footerNav @dataNull="dataNull"/>
    </div>
</template>

<script>
import {getPolicyList} from '@/service/getData'
import Vue from 'vue';
export default {
    data () {
        return {
            goBackName: '政策法规',
            secretLists: [],
            listALL:'',
            faGuiTypeName: '国务院文件',
            listHeight: 0
        }
    },
    mounted () {
        if (!this.$route.query.typeName) {
            let serverData = {
                pageNum: 1,
                keyword: '',
                faGuiTypeName: '国务院文件'
            }
            this.getList('',serverData)
        } else {
            let serverData = {
                pageNum: 1,
                keyword: '',
                faGuiTypeName: this.$route.query.typeName
            }
            this.getList('',serverData)
        }

    },
    activated () {
        if (this.$route.query.typeName && this.$route.query.typeName !== this.faGuiTypeName) {
            this.secretLists = []
            this.faGuiTypeName = this.$route.query.typeName
            let serverData = {
                pageNum: 1,
                keyword: '',
                faGuiTypeName: this.$route.query.typeName
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
            let list = await getPolicyList({
                pageNum:data.pageNum,
                type: data.faGuiTypeName == '全部法规'?'':data.faGuiTypeName,
                keyword:data.keyword 
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
        },
        dataNull () {
            this.faGuiTypeName = '国务院文件'
            this.$refs.shemiList.searchVal = ''
            this.secretLists = []
            let serverData = {
                pageNum: 1,
                keyword: '',
                faGuiTypeName: '国务院文件'
            }
            this.getList('',serverData)
        }
    },
    components: {
        shemiList: r => {
            require(['../components/shemiList'],r)
        },
        footerNav: r => {
            require(['../components/footerNav'],r)
        }
    }
}
</script>

<style lang="scss">
    .policyInfo {
        .policyInfoTop {
            height: 1.28rem;
            line-height: 1.28rem;
            text-align: center;
            font-size: 0.48rem;
            color: #333; 
            
            p {
                text-align: center;
                border-bottom: 0.02666rem solid #dfdfdf;
                position: fixed;
                width: 100%;
                background: #fff;
            }
        }
    }
</style>

