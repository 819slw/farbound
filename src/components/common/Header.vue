<template>
  <el-header>
    <!-- 右侧导航栏折叠按钮 -->
    <span class="btn-collapse" @click="collapseChage" :title="collapse ? '展开侧边栏' : '收起侧边栏'">
      <i class="el-icon-menu"></i>
    </span>
    <!-- 系统标题 -->
    <h3 class="header-title margin-l-10">电网精灵</h3>
    <div class="header-right">
      <img class="header-portrait" src="../../assets/img/logo.jpg" alt="logo">
      <!-- 用户名下拉菜单 -->
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import Bus from './bus';

export default {
  name: "Header",
  data() {
    return {
      message: 1,
      username: JSON.parse(localStorage.getItem('user')).nick_name,
      collapse: false
    }
  },
  methods: {
    // 侧边栏折叠打开效果
    collapseChage() {
      this.collapse = !this.collapse;
      Bus.$emit('collapse', this.collapse);
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if ('loginout' == command) {
        //清空存储在本地的数据
        localStorage.removeItem('user');
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped lang="less">
[class*='el-icon'] {
  cursor: pointer;
}

.el-header {
  width: 100%;
  padding: 0 30px;
  background-color: @mainColor;
  color: white;
  font-size: 16px;
  line-height: 53px;
}

.header-title, .btn-info {
  display: inline-block;
}

.header-title, .btn-collapse, .el-icon-bell {
  font-size: 25px;
}

.header-right {
  float: right;
  margin-right: 10px;
}

.btn-collapse {
  vertical-align: sub;
}

.btn-info {
  position: relative;
}

.btn-info-tip {
  position: absolute;
  top: 10px;
  .circle(8px);
  background-color: #ff464f;
}

.el-icon-bell {
  color: white;
  vertical-align: text-top;
}

.header-portrait {
  .circle(46px);
  margin: 0 20px;
  width: 50px;
  vertical-align: middle;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>
