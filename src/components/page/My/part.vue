<template>
  <div class="part">
    <div class="part_tree">
      <el-tree :data="departList"
               :props="defaultProps"
               :highlight-current="true"
               ref="elTree"
               @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="into">
      <div>
        <el-radio-group v-model="depart" size="small" @change="onChange">
          <el-radio v-model="depart_level" size="medium" border label="2">添加同级部门</el-radio>
          <el-radio v-model="depart_level" size="medium" border label="1">添加子部门</el-radio>
        </el-radio-group>
      </div>
      <div>
        <el-form label-width="110px" v-model="depart_name">
          <el-form-item label="输入部门名称">
            <el-input v-model="depart_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="onInto">添加部门</el-button>
        <el-button type="primary" @click="onDel">删除部门</el-button>
        <el-button type="primary">权限设置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {reqDepartList, reqRoleList, reqDepartAdd, reqDepartDel} from "../../../api";

export default {
  name: "part",
  data() {
    return {
      departList: [],
      defaultProps: {
        children: 'children',
        label: 'depart_name'
      },
      info: null,
      depart_level: '',
      depart_name: '',
      pidObj: null,
      depart: '2',
      currentKey: null
    }
  },
  mounted() {
    //  获取当前部门 子部门列表
    this.info = JSON.parse(localStorage.getItem('user'))
    this.getDepartList()
    //  获取角色列表
    this.getRoleList()
  },
  methods: {
    onChange() { //选择添加的部门级别
    },
    onDel() {
      this.$confirm("删除当前选择的部门", "删除部门", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reqDepartDel({depart_id: this.pidObj.depart_id}).then(rsp => {
          if (rsp.code != 0) {
            this.$message.error(rsp.msg)
          } else {

          }
        })

      }).catch(res => {
      })
    },
    onInto() {
      let pid
      if (this.pidObj && this.pidObj.depart_id) {
        pid = this.pidObj.pid;//默认
        //判断是否选择节点
        // console.log(this.pidObj)
      } else {
        this.$alert('请选择部门', '提示', {
          confirmButtonText: '好的',
          roundButton: true
        });
      }
      if (this.depart === '1') {
        pid = this.pidObj.depart_id;
      }
      let depart_name = this.depart_name.trim()
      if (depart_name) {
        reqDepartAdd({pid, depart_name: depart_name}).then(res => {
          if (res.code === 0) {
            this.addNode(this.departList, {pid, depart_id: res.data.depart_id, depart_name, children: []})
          }
        })
      } else {
        this.$alert('请输入部门名称', '提示', {
          confirmButtonText: '好的',
          roundButton: true
        });
      }
    },
    addNode(list, node) {
      if (list) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].depart_id === node.pid) {
            list[i].children.push(node)
            break
          } else {
            this.addNode(list[i].children, node)
          }
        }
      }
    },
    transListToTreeData(list, RootValue) {
      let arr = [];
      list.forEach((item) => {
        //如果数据对象的pid为 '' 说明数据为根节点
        if (item.pid === RootValue) {
          let children = this.transListToTreeData(list, item.depart_id); //寻找id等于该对象pid的数据，为它的子节点,返回一个数组
          if (children.length) {
            item.children = children; //往对象添加一个children属性，属性值为一个数组
          }
          arr.push(item);
        }
      });
      return arr;
    },
    getRoleList() {
      reqRoleList().then(res => {
        console.log(res)
      })
    },
    getDepartList() {
      reqDepartList({depart_id: this.info.depart_id}).then(res => {
        console.log(res)
        if (res.code === 0 || res.code === 200) {
          let arr = this.transListToTreeData(res.data, this.info.depart_id)
          res.data[0].children = arr
          let obj
          res.data.forEach(item => {
            if (item.depart_id === this.info.depart_id) {
              item.children = arr;
              obj = item
            }
          })
          this.departList = [obj]
        }
      })
    },
    handleNodeClick(data) {
      this.pidObj = data;
      console.log(data)
      this.$nextTick(() => {
        // this.currentKey=data.pid
      })
    },
  }
}
</script>

<style lang="less">
.el-tree-node__content:hover {
  background-color: #3e8f69 !important;
  color: white !important;
}

.el-tree-node:focus > .el-tree-node__content {
  background-color: #3e8f69 !important;
  color: white !important;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #3e8f69 !important;
  color: white !important;
}

.part {
  width: 100%;
  display: flex;

  > div {
    padding: 10px;
    box-sizing: border-box;
    background: white;
    margin-left: 20px;
  }

  .part_tree {
    width: 40%;
    height: 80vh;
  }

  .into {
    width: 40%;

    > div {
      margin: 20px 30px;
    }
  }
}
</style>
