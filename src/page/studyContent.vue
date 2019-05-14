<template>
    <div class="studyContent">
        <div :class="catalogueShow?'studyContentRightL studyContentRight':'studyContentRight'">
            <div class="goBack">
                <i class="catalogMove" @click="catalogueClick" v-if="!catalogueShow"></i>
                <i class="goBackIcon" @click="goBack" :style="catalogueShow?'left:14px': ''"></i>
            </div>
            <iframe :src="'/../../static/pdf/web/viewer.html?file='+pdfSrc" aaa='454545' ref="wrapper" :style="{ height: wrapperHeight + 'px' }"></iframe>
        </div>
        <div class="studyContentLeft" v-show="catalogueShow">
            <p class="studyContentLeftTitle">
                <i @click="catalogueClick"></i>
                <span>目录</span>
            </p>
            <ul>
                <li v-for="(item,index) in catalogData" :key="index" @click="pdfListClick(item.id,item.typeId)" :class="id == item.id?'checked':''">{{item.title}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { knowledgeTypeContent, getKnowledge,imagesFile } from '@/service/getData';
import Http from 'axios'

export default {
    data () {
        return {
            contentData: [],
            catalogData: [],
            pdfSrc: '',
            catalogueShow: false,
            id: '',
            typeId: '',
            wrapperHeight: 0
        }
    },
    mounted () {
        this.typeId = this.$route.query.id
        this.id = this.$route.query.typeId
        this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top + 10;
        this.getData()
    },
    methods: {
        async getData () {
            const catalogData = await getKnowledge({
                typeId: this.typeId,
                id: this.id
            }) 
            if (catalogData.status == 200) {
                this.contentData = catalogData.data.current
                this.catalogData = catalogData.data.all
                this.id = catalogData.data.current.id
                let pdfSrcData = catalogData.data.current.content.split('https://lifangmi-image.oss-cn-qingdao.aliyuncs.com/purchase/images/')[1]
                this.pdfSrc = encodeURIComponent(this.PdfHref+'/download/images?imagesName='+pdfSrcData+'&startPage='+catalogData.data.current.startPage+'&totalPage='+catalogData.data.total)
            } else {

            }
        },
        catalogueClick () {
            if (this.catalogueShow) {
                this.catalogueShow = false
            } else {
                this.catalogueShow = true
            }
        },
        goBack () {
            if (this.catalogueShow) {
                this.catalogueShow = false
            } else if (this.$route.query.typeId){  
                this.$router.push({
                    path: '/studySearch'
                })
            } else {
                this.$router.push({
                    path: '/study'
                })
            }
        },
        pdfListClick (id,typeId) {
            this.typeId = typeId
            this.id = id
            this.getData()
            this.catalogueShow = false
        }
    }
}
</script>

<style lang="scss">
    .studyContent{
        .studyContentRight {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
        }
        .studyContentRightL {
            left: 3.96666rem;
        }
        .studyContentLeft {
            position: absolute;
            top: 0;
            left: 0;
            width: 3.96666rem;
            background:rgba(228,228,228,1);
            height: 100%;
            .studyContentLeftTitle {
                text-align: center;
                // margin: 0.26666rem;
                font-size: 0.426666rem;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(51,51,51,1);
                line-height: 0.84rem;
                margin-bottom: 0.2666rem;
                i {
                    display: inline-block;
                    background: url('../assets/icon_more.png') no-repeat;
                    width: 0.53rem;
                    height: 0.47rem;
                    background-size: 0.45rem;
                    position: absolute;
                    left: 0.3866rem;
                    top: 0.25rem;
                }
            }
            ul {
                li {
                    text-align: center;
                    font-size: 0.34666rem;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    line-height: 0.84rem;
                }
                .checked {
                    color:rgba(78,134,237,1);
                }
            }
        }
        .goBack {
            height: 1.3066666rem;
            line-height: 1.3066666rem;
            .goBackIcon {
                display: inline-block;
                background: url('../assets/goBack.png') no-repeat;
                width: 0.53rem;
                height: 0.47rem;
                background-size: 0.25rem;
                position: absolute;
                left: 1.3rem;
                top: 0.37rem;
            }
            .catalogMove {
                display: inline-block;
                background: url('../assets/icon_more.png') no-repeat;
                width: 0.53rem;
                height: 0.47rem;
                background-size: 0.45rem;
                position: absolute;
                left: 0.4rem;
                top: 0.37rem;
            }
        }
        .studyConTitle {
            text-align: center;
            font-size: 0.58666rem;
            font-family:PingFangSC-Regular;
            font-weight:bold;
            color:rgba(51,51,51,1);
            line-height: 0.66666rem;
            margin-bottom: 0.2666rem;
        }
        iframe {
            width: 100%;
            height: 600px;
            border: none;
        }
    }
</style>

