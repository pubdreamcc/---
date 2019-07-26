<template>
  <el-main>
    <el-header style="font: bold 24px '微软雅黑';">内容审核</el-header>
    <el-form :inline="true" :model="formInline" style="margin-top: 15px;">
      <el-form-item><el-input placeholder="标题内容" v-model="formInline.title"></el-input></el-form-item>
      <el-form-item><el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="formInline.date"></el-date-picker></el-form-item>
      <el-form-item><el-button type="primary" @click="query(formInline)">查询</el-button></el-form-item>
    </el-form>
    <el-tabs type="card" value="first">
      <el-tab-pane label="未发布" name="first">
        <el-table :data="tableData">
          <el-table-column prop="newsTitle" label="标题" width="350" align="left">
          </el-table-column>
          <el-table-column prop="sourceWeb" label="来源网站" width="160" align="left">
          </el-table-column>
          <el-table-column label="原文" width="110" align="left">
            <template slot-scope="scope">
              <el-link type="info" :href="scope.row.sourceUrl" target="_blank">查看</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="状态" width="100" align="left">
          </el-table-column>
          <el-table-column prop="newsDate" label="创建时间" width="120" align="left">
          </el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleClick(scope.row)"
                >编辑发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="1" :pager-count="5" :page-sizes="[10]" :page-size="10" layout="prev, pager, next, jumper, total, sizes" :total="totalNews" background style="margin-top: 10px;" @current-change="handleCurrentChange">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="second">
        <el-table :data="tableData2">
          <el-table-column prop="newsTitle" label="标题" width="350" align="left">
          </el-table-column>
          <el-table-column prop="sourceWeb" label="来源网站" width="160" align="left">
          </el-table-column>
          <el-table-column label="原文" width="110" align="left">
            <template slot-scope="scope">
              <el-link type="info" :href="scope.row.sourceUrl" target="_blank">查看</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="auditStatus" label="状态" width="100" align="left">
          </el-table-column>
          <el-table-column prop="newsDate" label="创建时间" width="120" align="left">
          </el-table-column>
          <el-table-column label="操作" width="160" align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="cancelNewsPublish(scope.row)"
                >取消发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="1" :pager-count="5" :page-sizes="[10]" :page-size="10" layout="prev, pager, next, jumper, total, sizes" :total="totalNews2" background style="margin-top: 10px;" @current-change="handleCurrentChange2">
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
      tableData: [],
      formInline: {
        title: '',
        date: ''
      },
      totalNews: 0,
      totalNews2: 0,
      tableData2: [],
      index: 1
    }
  },
  methods: {
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
        axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${this.index}&rows=10&newsTitle=${newsTitle}&beginTime=${beginTime}&endTime=${endTime}&release=0&mediaType=0`).then(res => {
          let ret = res.data.rows
          this.tableData = ret
          this.totalNews = this.tableData.length
          this.tableData.forEach(item => {
            item.newsDate = item.newsDate.slice(0, 10)
            item.auditStatus = '未发布'
          })
        })
        axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${this.index}&rows=10&newsTitle=${newsTitle}&beginTime=${beginTime}&endTime=${endTime}&release=15&mediaType=0`).then(res => {
          let ret = res.data.rows
          this.tableData2 = ret
          this.totalNews2 = this.tableData2.length
          this.tableData2.forEach(item => {
            item.newsDate = item.newsDate.slice(0, 10)
            item.auditStatus = '已发布'
          })
        })
      }
    },
    handleClick (news) {
      this.$router.push({
        path: '/admin/contentedit',
        query: {
          newsTrackID: news.newsTrackID
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
    handleCurrentChange (val) {
      this.index = val
      // 获取未发布的内容
      axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${val}&rows=10&release=0&mediaType=0`).then(res => {
        const ret = res.data
        this.tableData = ret.rows
        this.tableData.forEach(item => {
          item.newsDate = item.newsDate.slice(0, 10)
          item.auditStatus = '未发布'
        })
      })
    },
    handleCurrentChange2 (val) {
      // 获取发布后的内容
      axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=${val}&rows=10&release=15&mediaType=0`).then(res => {
        const ret = res.data
        this.tableData2 = ret.rows
        this.tableData2.forEach(item => {
          item.newsDate = item.newsDate.slice(0, 10)
          item.auditStatus = '已发布'
        })
      })
    }
  },
  mounted () {
    // 查询未发布
    axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=0&mediaType=0`).then(res => {
      const ret = res.data
      this.tableData = ret.rows
      this.totalNews = ret.total
      this.tableData.forEach(item => {
        item.newsDate = item.newsDate.slice(0, 10)
        item.auditStatus = '未发布'
      })
    })
    // 查询已发布
    axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=15&mediaType=0`).then(res => {
      const ret = res.data
      this.tableData2 = ret.rows
      this.totalNews2 = ret.total
      this.tableData2.forEach(item => {
        item.newsDate = item.newsDate.slice(0, 10)
        item.auditStatus = '已发布'
      })
    })
    this.$nextTick(() => {
      document.getElementById('contentAudit').className = 'el-menu-item is-active'
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$nextTick(() => {
      document.getElementById('contentAudit').className = 'el-menu-item'
    })
    next()
  },
  watch: {
    formInline: {
      deep: true,
      handler (newValue, oldValue) {
        if (!newValue.date && !newValue.title) {
          // 查询未发布
          axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=0&mediaType=0`).then(res => {
            const ret = res.data
            this.tableData = ret.rows
            this.totalNews = ret.total
            this.tableData.forEach(item => {
              item.newsDate = item.newsDate.slice(0, 10)
              item.auditStatus = '未发布'
            })
          })
          // 查询已发布
          axios.get(`http://www.gjzxedu.com/crawler/getnewslist?page=1&rows=10&release=15&mediaType=0`).then(res => {
            const ret = res.data
            this.tableData2 = ret.rows
            this.totalNews2 = ret.total
            this.tableData2.forEach(item => {
              item.newsDate = item.newsDate.slice(0, 10)
              item.auditStatus = '已发布'
            })
          })
        }
      }
    }
  }
}
</script>
