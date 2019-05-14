<template>
    <div class="goBackTitle">
        <div>
            <span class="goBack" @click="goBack"></span>
            <span v-if="goBackName">{{goBackName.length > 11?goBackName.slice(0,11)+'...':goBackName}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['goBackName','path','LocationCity'],
    data () {
        return {

        }
    },
    methods: {
        goBack () {
            if (this.path == '/') {
                this.$emit('goBackClick')
                this.$router.push({
                    path:'/home',
                    query: {
                        LocationCity: this.LocationCity
                    }
                })
            } else {
                this.$emit('goBackClick')
                this.$router.go(-1)
            }

        }
    }
}
</script>

<style lang="scss">
    .goBackTitle {
            height: 1.28rem;
            line-height: 1.28rem;
            text-align: center;
            font-size: 0.48rem;
            color: #333;
            background: #fff;
            div {
                border-bottom: 0.02666rem solid #dfdfdf;
                position: fixed;
                width: 100%;
                background: #fff;
                left: 0;
                top: 0;
                z-index: 100;
            }
            span {
            }
            .goBack {
                // float: left;
                background: url('../assets/goBack.png') no-repeat;
                width: 0.53rem;
                height: 0.47rem;
                background-size: 0.25rem;
                position: absolute;
                left: 0.4rem;
                top: 0.37rem;
            }
        }
</style>

