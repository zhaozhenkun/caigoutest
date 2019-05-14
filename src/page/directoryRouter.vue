<template>
    <div class="directoryRouter">
        <goBack goBackName="企业名录" />
        <div class="routerList">
            <div class="directory" @click="goList('directory')">
                <p>企业名录</p>
                <button>点击查看</button>
            </div>
            <div class="owner" @click="goList('owner')">
                <p>业主分析</p>
                <button>点击查看</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    methods: {
        goList (type) {
            if (type == 'directory') {
                this.$router.push({
                    path:'/directoryList',
                    query: {
                        name:'企业名录',
                        searchText: '输入企业名称 人名等'
                    }
                })
            } else {
                this.$router.push({
                    path:'/proprietorList',
                    query: {
                        name:'业主分析',
                        searchText: '输入企业名称 人名等'
                    }
                })
            }
            
            // proprietorList
        }
    }
}
</script>

<style lang="scss">
    .directoryRouter {
        .routerList {
            padding: 0 0.4rem;
            div {
                height: 5.17333rem;
                width: 100%;
                border-radius: 0.26666rem;
                margin-top: 0.53333rem;
                text-align: center;
                p {
                    font-size: 0.66666rem;
                    color: #fff;
                    padding-top: 1.5733333rem;
                }
                button {
                    margin-top: 0.66666rem;
                    width: 2.66666rem;
                    height: 0.8rem;
                    border: 0.026666rem solid #fff;
                    border-radius: 1.6rem;
                    font-size: 0.3733333rem;
                    color: #fff;
                    background: none;
                }
            }
            .directory {
                background: url('../assets/directoryBG1.png') no-repeat;
                background-color: rgba(104, 163, 236, 1);
                background-size: 100% 5.17333rem;
            }
            .owner {
                background: url('../assets/directoryBG2.png') no-repeat;
                background-color: rgba(88, 195, 159, 1);
                background-size: 100% 5.17333rem;
            }
        }
    }
</style>

