<template>
  <el-aside width="auto" height="auto">
    <el-menu :collapse="isCollapse" :default-active="onRoutes" background-color="#232323" text-color="#ccc"
             active-text-color="#ddd" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subItems">
          <el-submenu :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem, i) in item.subItems" @click="onclick(subItem.path)" :index="subItem.path"
                          :key="i">
              {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import Bus from "./bus";

export default {
  name: "Sidebar",
  data() {
    return {
      isCollapse: false,
      items: [
        {
          title: "用户",
          path: "/index",
          icon: "el-icon-setting",
          subItems: [
            {
              title: "用户列表",
              path: "/index"
            },
            {
              title: "部门管理",
              path: "/part"
            }
          ]
        },
        {
          title: "设备",
          path: "/device",
          icon: "el-icon-setting",
          subItems: [
            {
              title: "设备列表",
              path: "/device"
            },
            {
              title: "设备主页",
              path: "/fristPage"
            } /*{
              title: '轮询播放',
              path: '/lunxun1'
            },*/
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.fullPath;
    }
  },
  methods: {
    onclick(path) {
      this.$bus.emit("nav", path);
    }
  },
  created() {
    // 通过 event bus进行组件间的通信 来折叠和展开侧边栏
    Bus.$on("collapse", isCollapse => {
      this.isCollapse = isCollapse;
    });
  }
};
</script>

<style scoped lang="less">
.el-menu {
  height: 100%;
  border: none;

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}

.el-menu-item.is-active {
  border-left: 3px solid @mainColor;
  background-color: #171717 !important;
}
</style>
