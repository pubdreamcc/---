<template>
  <el-container>
    <el-aside width="200px" v-show="asideFlag">
      <el-header>
        <i class="el-icon-eleme"></i>
        <span>运营平台</span>
      </el-header>
      <el-header>
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </el-header>
      <el-menu :default-openeds="['1', '2', '3']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-setting"></i>内容管理</template>
            <el-menu-item index="1-1" @click="switchRouter('新闻审核')" id="contentAudit">新闻审核</el-menu-item>
            <el-menu-item index="1-2" @click="switchRouter('视频审核')" id="videoAudit">视频审核</el-menu-item>
            <el-menu-item index="1-3" @click="switchRouter('内容编辑')" id="contentEdit">内容编辑</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-setting"></i>系统管理</template>
            <el-menu-item index="2-1">用户管理</el-menu-item>
            <el-menu-item index="2-2">角色管理</el-menu-item>
            <el-menu-item index="2-3">菜单管理</el-menu-item>
            <el-menu-item index="2-4">字典管理</el-menu-item>
            <el-menu-item index="2-5">通知管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div><i class="el-icon-s-fold" @click="switchAside($event)"></i>
        <span>...，欢迎使用运营平台！</span></div>
        <div><i class="el-icon-bell"></i>
        <i class="el-icon-full-screen" @click="fullScreen"></i></div>
        <el-dropdown>
          <span>...</span>
          <i class="el-icon-caret-bottom"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <router-view v-if="isRouterAlive"></router-view>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      asideFlag: true,
      isRouterAlive: true
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  computed: {
    className () {
      return this.asideFlag ? 'el-icon-s-fold' : 'el-icon-s-unfold'
    }
  },
  methods: {
    switchRouter (str) {
      switch (str) {
        case '新闻审核':
          this.$router.push('/admin/contentaudit')
          break
        case '视频审核':
          this.$router.push('/admin/videoaudit')
          break
        case '内容编辑':
          this.$router.push('/admin/contentedit')
          break
      }
    },
    switchAside (ev) {
      this.asideFlag = !this.asideFlag
      ev.target.className = this.className
    },
    fullScreen () {
      document.documentElement.requestFullscreen()
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
  .el-aside{
    background-color: #2B2D36;
    color: #fff;
    .el-menu{
      background-color: #2B2D36;
      border-right: none;
      .el-submenu__title{
        color: #fff;
        i{
          color: white;
        }
        &:hover{
          background-color: #2B2D36;
          color: #fff;
        }
      }
      .el-menu-item{
        color: white;
        &:hover{
          color: white;
          background-color: #2B2D36;
        }
        &.is-active{
          color: skyblue;
          background-color: #2B2D36;
        }
      }
    }
    .el-header{
      background-color: #2B2D36;
      color: white;
      line-height: 60px;
    }
  }
  .is-vertical{
    .el-header{
      border-bottom: 1px solid gray;
      display: flex;
      align-items: center;
      justify-content: space-between;
      i{
        margin-right: 20px;
        font-size: 24px;
      }
      span{
        font-size: 24px;
      }
    }
  }
</style>
