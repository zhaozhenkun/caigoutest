<template>
  <div id="app" >
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> 
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (this.$route.path == '/' && !this.$route.query.id) {
      this.$router.push('/home');
    }
    document.documentElement.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }, false)
  }
}
</script>

<style lang="scss">
@import "./css/app";
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: $base-size;
}
</style>
