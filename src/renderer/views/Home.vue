<template>
  <div>
    这是home页面
    <el-button @click="turnTo">跳转回首页</el-button>
    <input type="file">
  </div>
</template>
<script>
export default {
  name: 'Home',
  created () {
    console.log(this.$route.query.id)
    this.userId = this.$route.query.id
    console.log(this)
    // this.$http.get('http://www.baidu.com' + this.userId).then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    turnTo () {
      this.$router.push('/')
    }
  }
}
</script>