<template>
<div class="contentedit">
  <video-player
  class="video-player-box"
  ref='videoPlayer'
  :options="playerOptions"
  :playsinline='true'
  v-if="$route.query.mediaType == 1"
  >
  </video-player>
  <el-input placeholder="请输入内容" v-if="$route.query.mediaType == 1" v-model="newsContent"></el-input>
  <quill-editor v-model="newsContent" v-if="$route.query.mediaType === undefined"></quill-editor>
  <el-button type="primary" v-if="this.$route.query.newsTrackID" @click="save">保存</el-button>
  <el-button type="success" v-if="this.$route.query.newsTrackID" @click="publish">发布</el-button>
</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: '',
  data () {
    return {
      newsContent: '',
      newsOriginContent: '',
      playerOptions: {
        sources: [{
          type: 'video/mp4',
          src: 'videoSrc'
        }],
        poster: '',
        muted: false,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: true
        }

      }
    }
  },
  components: {
    quillEditor,
    videoPlayer
  },
  mounted () {
    if (this.$route.query.mediaType) {
      // 发送Ajax请求获取视频
      axios.get(`http://www.gjzxedu.com/crawler/newscontent?newsTrackID=${this.$route.query.newsTrackID}&mediaType=1`).then(res => {
        const ret = res.data.data.newsTitle
        // 获取视频 url
        const videoUrl = res.data.data.content
        // 获取视频封面图片
        const videoImg = res.data.data.coverImg
        this.playerOptions.sources[0].src = videoUrl
        this.playerOptions.poster = videoImg
        this.newsOriginContent = ret
        this.newsContent = ret
      })
    } else if (this.$route.query.newsTrackID) {
      axios.get(`http://www.gjzxedu.com/crawler/newscontent?newsTrackID=${this.$route.query.newsTrackID}`).then(res => {
        const ret = res.data.data.content
        this.newsOriginContent = ret
        this.newsContent = ret
      })
    }
    this.$nextTick(() => {
      document.getElementById('contentEdit').className = 'el-menu-item is-active'
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$nextTick(() => {
      document.getElementById('contentEdit').className = 'el-menu-item'
    })
    next()
  },
  methods: {
    save () {
      let params
      // 发送Ajax，保存修改
      if (this.$route.query.mediaType) {
        params = {'newsTitle': this.newsContent, 'newsTrackID': this.$route.query.newsTrackID, 'mediaType': 1}
      } else {
        params = {'content': this.newsContent, 'newsTrackID': this.$route.query.newsTrackID, 'mediaType': 0}
      }
      axios.post(`http://www.gjzxedu.com/crawler/updataNewsDetal`, qs.stringify(params), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
      }).then(res => {
        alert('保存成功')
        if (this.$route.query.mediaType) {
          this.$router.push('/admin/videoaudit')
        } else {
          this.$router.push('/admin/contentaudit')
        }
      })
    },
    publish () {
      // 发布新闻
      if (confirm('确定发布吗？')) {
        // 先保存新闻内容
        let params
        if (this.$route.query.mediaType) {
          params = {'newsTitle': this.newsContent, 'newsTrackID': this.$route.query.newsTrackID, 'mediaType': 1}
        } else {
          params = {'content': this.newsContent, 'newsTrackID': this.$route.query.newsTrackID, 'mediaType': 0}
        }
        axios.post(`http://www.gjzxedu.com/crawler/updataNewsDetal`, qs.stringify(params), {
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
        }).then(res => {
          // 发布新闻
          let params = {'newsTrackID': this.$route.query.newsTrackID}
          axios.post(`http://www.gjzxedu.com/crawler/newsPublish`, qs.stringify(params), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
          }).then(res => {
            // 发布成功跳转路由
            if (this.$route.query.mediaType) {
              this.$router.push('/admin/videoaudit')
            } else {
              this.$router.push('/admin/contentaudit')
            }
          })
        })
      }
    }
  }
}
</script>

<style lang='scss'>
  .contentedit{
    margin-top: 10px;
    .ql-container{
      min-height: 500px;
    }
    .el-button{
      margin-top: 15px;
      margin-left: 15px;
    }
    .video-js{
      width: 80%;
      margin-left: 10%;
      margin-bottom: 15px;
    }
    .vjs-big-play-button{
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%);
    }
    .el-input{
      width: 80%;
      margin-left: 10%;
      display: block;
    }
  }
</style>
