<template>
    <div class="downLoadAPP" >
        <div class="downLoadTop">
            <div class="downLoadIcon">
                <div >
                    <img src="../assets/Downlogo.png" alt="">
                </div>
                <p>采购精灵</p>
            </div>
        </div>
        <div class="downLoadBut">
            <a href="http://itunes.apple.com/app/id1438694503">IOS下载</a>
            <a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.ansiyida.cgjl">Andriod下载</a>
        </div>  
        <div class="downLoadBot"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            downLoadHeight: ''
        }
    },
    mounted () {
        this.downLoadHeight = document.documentElement.clientHeight 
    }
}
</script>

<style lang="scss">
    .downLoadAPP {
        // background: url(../assets/APPBg.png) no-repeat;
        // width: 100%;
        // height: 100%;
        .downLoadTop {
            background: url('../assets/downLoadTop.png') no-repeat;
            width: 100%;
            height: 5.6666rem;
            background-size: 100%; 
            .downLoadIcon {
                text-align: center;
                padding-top: 4.5666rem;
                div {
                    text-align: center;
                    background: #fff;
                    width: 2.2rem;
                    height: 2.2rem;
                    border-radius: 0.4rem;
                    padding: 0.2rem;
                    margin: 0 auto;
                    box-shadow: 0px 0px 0.53333rem rgba(0,0,0,0.5);
                    img {
                        width: 1.8rem;
                        height: 2rem;
                    }
                }
                p {
                    margin-top: 0.433rem;
                    font-size: 0.52666rem;
                    color:  #4e86ed;
                    letter-spacing: 0.1rem;
                    font-weight: 500;
                }
            }
        }
        .downLoadBut {
            position: fixed;
            top: 53%;
            left: 50%;
            margin-left: -2.6666rem;
            margin-top: -0.5333rem;
            a {
                display: block;
                width: 5.333rem;
                height: 1.06666rem;
                background: #4e86ed;
                color: #fff;
                border: none;
                margin-bottom: 0.8333rem;
                border-radius: 0.5rem;
                font-size: 0.42666rem;
                text-align: center;
                line-height: 1.0666rem;
                text-decoration: none;
            }
        }
        .downLoadBot {
            background: url('../assets/downLoadBot.png') no-repeat;
            width: 100%;
            height: 3.866666rem;
            background-size: 100%;
            position: fixed;
            bottom: 0;
        }
    }
</style>

