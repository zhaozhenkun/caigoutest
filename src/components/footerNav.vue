<template>
    <div class="footerNav">
        <ul>
            <li class="footerHome">
                <router-link to="/home" :class="$route.name == 'home'?'router-link-exact-active':''" @click.native="dataNull">
                    <i></i>
                    <p>首页</p>
                </router-link>
            </li>
            <!-- <li class="footerFagui">
                <router-link to="/policyInfo?typeName=国务院文件&name=政策法规&searchText=请输入想要搜索的法规名称或内容" :class="$route.name == 'home'?'':'router-link-exact-active'" @click.native="dataNull">
                    <i></i>
                    <p>政策法规</p>
                </router-link>
            </li> -->
            <li class="footerFagui">
                <router-link to="/study" :class="$route.name == 'home'?'':'router-link-exact-active'" @click.native="dataNull">
                    <i></i>
                    <p>学院</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            faguiSrc: require('../assets/footerHome2.png'),
            homeSrc: require('../assets/footerFagui2.png')
        }
    },
    mounted () {
    },
    methods: {
        dataNull () {
            this.$emit('dataNull')
        }
    }
}
</script>

<style lang="scss">
    .footerNav {
        height: 1.266rem;
        width: 100%;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        border-top: 0.026rem solid #dfdfdf;
        ul {
            font-size: 0;
            .footerHome {
                i {
                    background: url('../assets/footerHome2.png') no-repeat;
                    background-size:0.6rem; 
                }
                .router-link-exact-active {
                    p {
                        color: #4e86ed;
                    }
                    i {
                        background: url('../assets/footerHome.png') no-repeat;
                        background-size:0.6rem; 
                    }
                    
                }
            }
            .footerFagui {
                i {
                    background: url('../assets/footerFagui2.png') no-repeat;
                    background-size:0.6rem; 
                }
                .router-link-exact-active {
                    p {
                        color: #4e86ed;
                    }
                    i {
                        background: url('../assets/footerFagui.png') no-repeat;
                        background-size:0.6rem; 
                    }
                    
                }
            }
            li {
                display: inline-block;
                width: 50%;
                text-align: center;
                margin-top: 0.12rem;
                a {
                    text-decoration: none !important
                }
                i {
                    display: inline-block;
                    width: 0.6rem;
                    height: 0.6rem;
                    
                }
                p {
                    margin-top: 0.186rem;
                    font-size: 0.267rem; 
                    line-height: 0.267rem;
                    color: #686868;
                }
                
            }
        }
    }
</style>
