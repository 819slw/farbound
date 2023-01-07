<template>
  <el-aside width="auto" height="auto">
    <el-menu :collapse="isCollapse" :default-active="onRoutes" background-color="#232323" text-color="#ccc" active-text-color="#ddd" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subItems">
          <el-submenu :index="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <div v-for="(subItem, i) in item.subItems"  :key="i">
              <el-menu-item @click="onclick(subItem.path)" :index="subItem.path" v-if="!subItem.subItems">
                <i :class="item.icon"></i>
                <span slot="title">{{ subItem.title }}</span>
              </el-menu-item>
              <el-submenu :index="subItem.path" v-else>
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ subItem.title }}</span></template>
                <el-menu-item v-for="(subItem1, ii) in subItem.subItems" @click="onclick(subItem.path)" :index="subItem1.path" :key="ii">
                    {{ subItem1.title }}
                </el-menu-item>
              </el-submenu>
            </div>
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
              title: "防外破监测",
              icon: "el-icon-setting",
              path: "/device"
            },
            {
              title: "激光驱鸟装置",
              icon: "el-icon-setting",
              path: "/bird",
              subItems: [
                {
                  title: "线路管理",
                  path: "/bird/line"
                },
                {
                  title: "杆塔管理",
                  path: "/bird/tower"
                }
              ]
            },
            {
              title: "视频监测",
              icon: "el-icon-setting",
              path: "/device1"
            },
            {
              title: "图像监测",
              icon: "el-icon-setting",
              path: "/device2"
            },
            {
              title: "布控装置",
              icon: "el-icon-setting",
              path: "/device3"
            },
            {
              title: "传感器",
              icon: "el-icon-setting",
              path: "/device4"
            },
            {
              title: "设备主页",
              path: "/fristPage"
            }
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
