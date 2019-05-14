<template>
    <div class="typeAll">
        <goBack :goBackName='$route.query.name'/>
        <div class="typeAllList">
            <ul>
                <li v-for="(item,index) in dataList" :key="index" @click="classifyContent(item.code,item.id)">
                    <img :src="item.icon" :alt="item.name" v-if="$route.query.name == '全部分类'">
                    <img :src="require('./../assets/fagui'+(index + 1)+'.png')" :alt="item.name" v-else-if="$route.query.name == '政策法规'">
                    <p>{{item.name}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {getInfoType, policyType} from '@/service/getData'
export default {
    data () {
        return {
            dataList:[]
        }
    },
    async mounted () {
        this.getList()
    },
    components: {
        goBack: r => {
            require(['../components/goBack'],r)
        }
    },
    methods: {
        async getList () {
            if (this.$route.query.name == '全部分类') {
                const list = await getInfoType({})
                if (list.status == 200) {
                    this.dataList = list.data
                }
            } else if (this.$route.query.name == '政策法规'){
                const list = await policyType({})
                if (list.status == 200) {
                    this.dataList = list.data
                }
            }
           
        },
        goBack () {
            this.$router.go(-1)
        },
        classifyContent (val,id) {
            if (this.$route.query.name == '全部分类') {
                 if (val == '涉密采购' || val == '采购需求') {
                    this.$router.push({
                        path: '/secretList',
                        query: {
                            name: val,
                            searchText: '输入标题，产品名称等关键词'
                        }
                        })
                    } else {
                        this.$router.push({
                            path: '/recommendMove',
                            query:{
                            typeName:val,
                            typeID: id
                            }
                        })
                    }
            } else if (this.$route.query.name == '政策法规'){
                this.$router.push({
                    path: '/policyInfo',
                    query:{
                        typeName:val,
                        name:'政策法规',
                        searchText:'请输入想要搜索的法规名称或内容'
                    }
                })
            }
            
        }
    }
    
}
</script>


<style lang="scss">
    .typeAll {
        .typeAllList {
            margin-top: 0.5333rem;
            ul {
                overflow: hidden;
                li {
                    margin: 0 0.28rem;
                    float: left;
                    width: 1.893333rem;
                    text-align: center;
                    font-size: 0; 
                    // margin-bottom:0.8rem; 
                    height: 3rem;
                    img {
                        display: inline-block;
                        width: 1.2rem;
                        height: 1.2rem;
                    }
                    p {
                        // white-space: nowrap;
                        font-size: 0.3150rem;
                        color: #686868;
                        margin-top: 0.2rem;
                    }
                }
            }
        }
    }
</style>
