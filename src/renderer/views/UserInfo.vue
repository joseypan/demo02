<template>
  <div class="user-info">
    <div class="info-header">
        <div class="base-info">
            <div class="content">
            <div class="username">潘旭敏</div>
            <div class="company">上海逸广信息科技有限公司</div>
        </div>
        <div class="image-wrap">
            <el-avatar shape="square" :size="50" :src="squareUrl" />
        </div>
        </div>
        <div class="card">
          <i class="el-icon-postcard"></i>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info{
    width: 100%;
    height: 100%;
}
.info-header {
  -webkit-app-region: drag;
  height: 35%;
  background-color: #eee;
  .base-info {
    height: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .username {
        font-size: 24px;
    }
  }
  .card {
      margin-left: 10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-weight: bold;
      background-color: #fff;
      border-radius: 50%;
  }
}
</style>
