<template>
    <div class="pushList">
        <p class="title">今日推送</p>
        <!-- <p>今日推送{{dataList.length}}条数据</p> -->
        <div class="listContent">
            <ul>
                <li v-for="(v,i) in dataList" :key="i">
                    <router-link :to="{name:'articleDetail',query:{id:v.id}}">
                        <p class="listTitle">{{v.title}}</p>
                        <p class="source">
                            <span>地址：{{v.address}}</span>
                            <span>来源：{{v.source}}</span>
                            <span>类型：{{v.type}}</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script >
import { getDetail} from '@/service/getData'
export default {
    data () {
        return {
            dataList:[]
        }
    },
    async created () {
        const detail = await getDetail({
            address:'北京市'
        },'')
        this.dataList = detail.data;
    }
}
</script>

<style lang="scss">
    .pushList {
        .title {
            font-size: 1.6em;
            text-align: center;
            margin-top: 1em;
        }
        .listContent {
            width: 100%;
            ul {
                li {
                    margin: 0 1em;
                    list-style: none;
                    margin-top: 1em;
                    border: 1px solid #888;
                    background-color: white;
                    padding: 0 0.5em;
                    border-radius: 5px;
                    a {
                        text-decoration: none;
                    }
                    .listTitle {
                        font-size: 1.2em;
                        color: #333;
                    }
                    .source {
                        margin-top: 0.3em;
                        color: #555;
                        span {
                            font-size: 1.0em;
                            margin-right: 1em;
                        }
                    }
                }
            }
        }
    }
</style>

