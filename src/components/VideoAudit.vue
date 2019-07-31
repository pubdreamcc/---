<template>
  <el-main>
    <el-header style="font: bold 24px '微软雅黑';">视频审核</el-header>
    <el-form :inline="true" :model="formInline" style="margin-top: 15px;">
      <el-form-item><el-input placeholder="标题内容" v-model="formInline.title"></el-input></el-form-item>
      <el-form-item><el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="formInline.date"></el-date-picker></el-form-item>
      <el-form-item><el-button type="primary" @click="query(formInline)">查询</el-button></el-form-item>
    </el-form>
    <el-tabs type="card" :value="tabName" @tab-click='handleTabClick'>
      <el-tab-pane label="未发布" name="first">
        <el-table :data="tableData">
          <el-table-column prop="videoTitle" label="微视频" width="700" align="center">
            <template slot-scope="scope">
              <el-card :body-style="{ padding: '0px',  position: 'relative'}">
                <div class="videoInfo-wrap">
                  <img :src=scope.row.coverImg>
                  <div class="videoTime_wrap">
                    <i class="el-icon-caret-right"></i>
                    <span class="videoTime">{{scope.row.videoTimeLong}}</span>
                  </div>
                </div>
                <h2 class="videoTitle" v-html="scope.row.newsTitle" :title="scope.row.newsTitle"></h2>
                <p class="videoSource"><span>来源：{{scope.row.sourceWeb}}</span><span>发布时间：{{scope.row.videoDate}}</span></p>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="状态" width="100" align="center">
          </el-table-column>
          <el-table-column prop="videoDate" label="创建时间" width="120" align="center">
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleClick(scope.row)"
                >编辑发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="1" :pager-count="5" :page-sizes="[10]" :page-size="10" layout="prev, pager, next, jumper, total, sizes" :total="totalVideo" background style="margin-top: 10px;" @current-change="handleCurrentChange">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="second">
        <el-table :data="tableData2">
          <el-table-column prop="videoTitle" label="微视频" width="700" align="center">
            <template slot-scope="scope">
              <el-card :body-style="{ padding: '0px',  position: 'relative'}">
                <div class="videoInfo-wrap">
                  <img :src=scope.row.coverImg>
                  <div class="videoTime_wrap">
                    <i class="el-icon-caret-right"></i>
                    <span class="videoTime">{{scope.row.videoTimeLong}}</span>
                  </div>
                </div>
                <h2 class="videoTitle" v-html="scope.row.newsTitle" :title="scope.row.newsTitle"></h2>
                <p class="videoSource"><span>来源：{{scope.row.sourceWeb}}</span><span>发布时间：{{scope.row.videoDate}}</span></p>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="状态" width="100" align="center">
          </el-table-column>
          <el-table-column prop="videoDate" label="创建时间" width="120" align="center">
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="cancelNewsPublish(scope.row)"
                >取消发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="1" :pager-count="5" :page-sizes="[10]" :page-size="10" layout="prev, pager, next, jumper, total, sizes" :total="totalVideo2" background style="margin-top: 10px;" @current-change="handleCurrentChange2">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: '',
  inject: ['reload'],
  data () {
    return {
      formInline: {
        title: '',
        date: ''
      },
      tableData: [],
      tableData2: [],
      totalVideo: 0,
      totalVideo2: 0,
      index: 1,
      tabName: '' // 表格展示的选项名称
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.index = val
      // 获取未发布的内容
      axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${val}&rows=10&release=0&mediaType=1`).then(res => {
        const ret = res.data
        this.tableData = ret.rows
        this.tableData.forEach(item => {
          item.videoDate = item.newsDate.slice(0, 10)
          item.auditStatus = '未发布'
          item.videoTimeLong = this.formatTime(item.videoTimeLong)
        })
      })
    },
    handleTabClick (tab) {
      this.tabName = tab.paneName
      sessionStorage.setItem('tabName', tab.paneName)
    },
    handleCurrentChange2 (val) {
      // 获取发布后的内容
      axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${val}&rows=10&release=15&mediaType=1`).then(res => {
        const ret = res.data
        this.tableData2 = ret.rows
        this.tableData2.forEach(item => {
          item.videoDate = item.newsDate.slice(0, 10)
          item.auditStatus = '已发布'
          item.videoTimeLong = this.formatTime(item.videoTimeLong)
        })
      })
    },
    query (info) {
      // 查询新闻
      if (info.title || info.date) {
        let newsTitle = info.title
        let arr = []
        let beginTime = ''
        let endTime = ''
        if (info.date) {
          info.date.forEach((item, index) => {
            let day = item.getDate() < 10 ? '0' + item.getDate() : item.getDate()
            let month = item.getMonth() + 1 < 10 ? '0' + (item.getMonth() + 1) : item.getMonth() + 1
            let year = item.getFullYear()
            arr[index] = `${year}-${month}-${day}`
          })
          beginTime = arr[0]
          endTime = arr[1]
        }
        axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${this.index}&rows=10&newsTitle=${newsTitle}&beginTime=${beginTime}&endTime=${endTime}&release=0&mediaType=1`).then(res => {
          let ret = res.data.rows
          this.tableData = ret
          this.totalVideo = this.tableData.length
          this.tableData.forEach(item => {
            item.videoDate = item.newsDate.slice(0, 10)
            item.auditStatus = '未发布'
            item.videoTimeLong = this.formatTime(item.videoTimeLong)
          })
        })
        axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${this.index}&rows=10&newsTitle=${newsTitle}&beginTime=${beginTime}&endTime=${endTime}&release=15&mediaType=1`).then(res => {
          let ret = res.data.rows
          this.tableData2 = ret
          this.totalVideo2 = this.tableData2.length
          this.tableData2.forEach(item => {
            item.videoDate = item.newsDate.slice(0, 10)
            item.auditStatus = '已发布'
            item.videoTimeLong = this.formatTime(item.videoTimeLong)
          })
        })
      }
    },
    handleClick (news) {
      this.$router.push({
        path: '/admin/contentedit',
        query: {
          newsTrackID: news.newsTrackID,
          mediaType: 1
        }
      })
    },
    cancelNewsPublish (news) {
      if (window.confirm('确定取消发布么？')) {
        let params = {newsTrackID: news.newsTrackID}
        axios.post(`http://www.gjzxedu.com/crawler/cancelNewsPublish`, qs.stringify(params), {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}}).then(res => {
          this.reload()
        })
      }
    },
    // 用于格式化时间工具函数
    formatTime (time) {
      let m = parseInt(time / 60)
      let s = time - m * 60
      if (m < 10) {
        m = `0${m}`
      }
      if (s < 10) {
        s = `0${s}`
      }
      return `${m}:${s}`
    }
  },
  mounted () {
    this.tabName = sessionStorage.getItem('tabName') || 'first'
    // 查询未发布
    axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=0&mediaType=1`).then(res => {
      const ret = res.data
      this.tableData = ret.rows
      this.totalVideo = ret.total
      this.tableData.forEach(item => {
        item.videoDate = item.newsDate.slice(0, 10)
        item.videoTimeLong = this.formatTime(item.videoTimeLong)
        item.auditStatus = '未发布'
      })
    })
    // 查询已发布
    axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=15&mediaType=1`).then(res => {
      const ret = res.data
      this.tableData2 = ret.rows
      this.totalVideo2 = ret.total
      this.tableData2.forEach(item => {
        item.videoDate = item.newsDate.slice(0, 10)
        item.videoTimeLong = this.formatTime(item.videoTimeLong)
        item.auditStatus = '已发布'
      })
    })
    this.$nextTick(() => {
      document.getElementById('videoAudit').className = 'el-menu-item is-active'
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$nextTick(() => {
      document.getElementById('videoAudit').className = 'el-menu-item'
    })
    next()
  },
  watch: {
    formInline: {
      deep: true,
      handler (newValue, oldValue) {
        if (!newValue.date && !newValue.title) {
          // 查询未发布
          axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=0&mediaType=1`).then(res => {
            const ret = res.data
            this.tableData = ret.rows
            this.totalVideo = ret.total
            this.tableData.forEach(item => {
              item.videoDate = item.newsDate.slice(0, 10)
              item.auditStatus = '未发布'
              item.videoTimeLong = this.formatTime(item.videoTimeLong)
            })
          })
          // 查询已发布
          axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=15&mediaType=1`).then(res => {
            const ret = res.data
            this.tableData2 = ret.rows
            this.totalVideo2 = ret.total
            this.tableData2.forEach(item => {
              item.videoDate = item.newsDate.slice(0, 10)
              item.auditStatus = '已发布'
              item.videoTimeLong = this.formatTime(item.videoTimeLong)
            })
          })
        }
      }
    }
  }
}
</script>

<style lang='scss'>
  .el-card{
    width: 80%;
  }
  .videoInfo-wrap {
    position: relative;
    width: 200px;
    height: 150px;
    img{
      width: 200px;
      height: 150px;
    }
    .videoTime_wrap{
      position: absolute;
      bottom: 14px;
      right: 12px;
      border-radius: 3px;
      background-color:rgba(128, 128, 128, .4);
      color: white;
      font-size: 14px;
      padding: 0 5px;
    }
  }
  .videoTitle{
    position: absolute;
    left: 200px;
    top: 10px;
    font-size: 16px;
    color: red;
    padding: 0 10px;
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  .videoSource{
    position: absolute;
    left: 200px;
    top: 20px;
    padding: 10px 10px;
    margin: 10px 0;
    font-size: 14px;
    color: gray;
    span:nth-child(1){
      margin-right: 10px;
    }
  }
</style>
