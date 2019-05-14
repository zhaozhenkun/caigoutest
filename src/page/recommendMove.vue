<template>
    <div class="recommendMove">
        <goBack  :goBackName="goBackName" @goBackClick="goBackClick"  path='/'/>
        <searchList ref="searchList" @getGoBackName="getGoBackName"/>
    </div>
</template>

<script>
export default {
    data () {
        return {
            goBackName: '全部推荐'
        }
    },
    components: {
        searchList: r => {
            require(['../components/searchList'],r)
        },
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    watch: {
    },
    mounted () {
        if (this.$route.query.typeName) {
            switch (this.$route.query.typeName) {
                case '公开招标公告':
                    this.goBackName = '公开招标'
                    break;
                case '竞争性谈判公告':
                    this.goBackName = '竞争性谈判'
                    break;
                case '资格预审公告':
                    this.goBackName = '资格预审'
                    break;
                case '邀请招标公告':
                    this.goBackName = '邀请公告'
                    break;
                case '竞争性磋商公告':
                    this.goBackName = '竞争性磋商'
                    break;
                case '终止公告':
                    this.goBackName = '废标流标'
                    break;
                case '单一来源公告':
                    this.goBackName = '单一来源公示'
                    break;
                default:
                    this.goBackName = this.$route.query.typeName
            }
        }
    },
    activated () {
        if (this.$route.query.typeName) {
            switch (this.$route.query.typeName) {
                case '公开招标公告':
                    this.goBackName = '公开招标'
                    break;
                case '竞争性谈判公告':
                    this.goBackName = '竞争性谈判'
                    break;
                case '资格预审公告':
                    this.goBackName = '资格预审'
                    break;
                case '邀请招标公告':
                    this.goBackName = '邀请公告'
                    break;
                case '竞争性磋商公告':
                    this.goBackName = '竞争性磋商'
                    break;
                case '终止公告':
                    this.goBackName = '废标流标'
                    break;
                case '单一来源公告':
                    this.goBackName = '单一来源公示'
                    break;
                default:
                    this.goBackName = this.$route.query.typeName
            }
        } else {
            this.goBackName = '全部推荐'
        }
    },
    methods: {
        goBackClick() {
           this.$refs.searchList.goBackInit()
        },
        getGoBackName (name) {
            this.goBackName = name
        }
    }
}
</script>

<style lang="scss">
    .recommendMove {
        .moveTitle {
            height: 1.28rem;
            line-height: 1.28rem;
            text-align: center;
            font-size: 0.48rem;
            color: #333;
            .goBack {
                float: left;
            }
        }
    }
</style>

