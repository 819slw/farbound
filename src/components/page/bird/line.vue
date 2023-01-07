<template>
  <div>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      :total="infos_length"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-button type="primary" title="新增" size="medium" @click="intoMuseum">新增线路</el-button>
    <!-- <el-button type="primary" title="部门" size="medium" @click="onDepart">部门</el-button> -->
    <!--表格内容-->
    <el-table
      ref="list"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :data="infos.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :current-page.sync="currentPage"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        label="部门名称"
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.depart_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="线路名称"
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.line_name }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="创建时间"
        align="center"
        >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.create_at }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        width="220"
        align="center">
        <!-- <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入用户昵称搜索"/>
        </template> -->
        <template slot-scope="scope">
          <el-button @click="editData(scope.row)" type="primary" title="删除" size="small"
          >编辑
          </el-button>

          <el-button @click="onDelete(scope.row.line_id)" type="danger" title="删除" size="small"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹出框-->
    <el-dialog
      :title="isEdit ? '编辑线路' : '添加线路'"
      :visible.sync="isShowEditDialog"
      width="500px"
    >
      <el-form
        ref="formFileds"
        :rules="rule"
        :model="formFileds"
        label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门" prop="username">
          <el-cascader
          v-model="formFileds.depart_id"
          :options="departList"
          :props="defaultProps"
          @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="线路名称" prop="password">
          <el-input type="text" v-model="formFileds.line_name"></el-input>
        </el-form-item>

        <div style="margin-left: 30%">
          <el-button type="primary" title="提交" size="medium"
                     @click="submitUpload('formFileds')">提交
          </el-button>
          <el-button type="primary" title="关闭" size="medium"
                     @click="isShowEditDialog = false">关闭
          </el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-drawer
      title="选择部门"
      :modal="false"
      size="20%"
      :visible.sync="drawer"
      :direction="direction"
      >
      <div class="part_tree">
        <el-tree :data="departList"
                 :props="defaultProps"
                 :highlight-current="true"
                 ref="elTree"
                 @node-click="handleNodeClick">
        </el-tree>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//引入定义ajax请求方法
import {
  delLine,
  addLine,
  lineList,
  reqDepartList,
  reqRoleList,
  updateLine
} from "../../../api";

export default {
  name: "Table",
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      formFileds: {
        //表单内容
        line_name: "",
        depart_id: "", //当前选择的部门id
        depart_name: ""
      },
      rule: {
        line_name: [
          { required: true, message: "请输入线路名称", trigger: "blur" }
        ],
        depart_id: [{ required: true, message: "请选择部门", trigger: "blur" }]
      },
      isShowEditDialog: false,
      infos: [],
      infos2: new Map(),
      infos_length: 0,
      search: "",
      userInfo: null,
      direction: "rtl",
      drawer: false,
      departList: [],
      defaultProps: {
        children: "children",
        label: "depart_name",
        value: "depart_id",
        checkStrictly: true
      },
      depart_map: new Map(),
      depart_name_map: new Map(),
      roleList: [],
      role_name_map: new Map(),
      role_id: "",
      loading: false,
      allDepartList: [],
      isEdit: false
    };
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    this.formFileds.depart_id = this.userInfo.depart_id;
    this.getInfoList(this.userInfo.depart_id);
    this.getDepartList(this.userInfo.depart_id);
    this.getRoleList();
  },
  watch: {
    search(newVal) {
      this.handleSearch(newVal);
    }
  },
  methods: {
    editData(data) {
      this.isEdit = true;
      this.formFileds.depart_name = data.depart_name;
      this.formFileds.line_name = data.line_name;
      this.formFileds.line_id = data.line_id;
      console.log(this.allDepartList);
      console.log(data);
      let obj = this.allDepartList.find(v => v.depart_id == data.depart_id);
      let arr = [];
      if (data.depart_id != "1/") {
        arr = [obj.pid, data.depart_id];
      } else {
        arr = [data.depart_id];
      }
      console.log(arr);
      if (arr[0] != "1/") {
        arr.unshift("1/");
      }
      this.formFileds.depart_id = arr;
      this.isShowEditDialog = true;
    },
    handleChange(obj, el) {
      console.log("obj");
      console.log(obj);
      let id = obj[obj.length - 1];
      this.formFileds.depart_name = this.allDepartList.find(
        v => v.depart_id == id
      ).depart_name;
      console.log(this.formFileds);
    },
    handleNodeClick(data) {
      this.formFileds.depart_id = data.depart_id;
      this.getInfoList(data.depart_id);
    },
    transListToTreeData(list, RootValue) {
      let arr = [];
      list.forEach(item => {
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
    //获取角色列表
    getRoleList() {
      reqRoleList().then(res => {
        console.log(res);
        if (res.code === 0) {
          this.roleList = res.data;
          this.roleList.forEach(item => {
            this.role_name_map.set(item.role_id, item.role_name);
          });
          this.formFileds.role_id = res.data[0].role_id;
        }
      });
    },
    getDepartList(depart_id) {
      //获取部门
      reqDepartList({ depart_id }).then(res => {
        console.log(res);
        if (res.code === 0 || res.code === 200) {
          this.allDepartList = [...res.data];
          let arr = this.transListToTreeData(res.data, this.userInfo.depart_id);
          res.data[0].children = arr;
          let obj;
          res.data.forEach(item => {
            this.depart_name_map.set(item.depart_id, item.depart_name);
            if (item.depart_id === this.userInfo.depart_id) {
              item.children = arr;
              obj = item;
            }
          });
          this.departList = [obj];
        }
      });
    },
    onDepart() {
      //部门
      this.drawer = true;
    },
    //获取用户列表
    getInfoList(depart_id) {
      this.infos = [];
      this.loading = true;
      // if (this.depart_map.has(depart_id)) {
      //   this.infos = this.depart_map.get(depart_id);
      //   this.loading = false;
      //   console.log("12312");
      // } else {
      lineList({ depart_id }).then(res => {
        if ((res.data && res.code === 0) || res.code === 200) {
          this.infos = res.data.list;
          this.infos2.set(1, res.data);
          this.infos_length = this.infos.length;
        }
        this.loading = false;
        // this.depart_map.set(depart_id, this.infos);
      });
      // }
    },
    onDelete(id) {
      //删除用户
      this.$confirm("确定要删除当前行吗？", "删除", {
        comfirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          delLine({ line_id: id }).then(res => {
            if (res.code === 200 || res.code === 0) {
              this.$message.success("删除成功");
              this.getInfoList(this.userInfo.depart_id);
            } else {
              this.$message.error(res.msg);
            }
          });
          return false;
        })
        .catch(() => {});
    },
    submitUpload(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let obj = {
            line_name: this.formFileds.line_name,
            depart_name: this.formFileds.depart_name,
            depart_id: this.formFileds.depart_id[
              this.formFileds.depart_id.length - 1
            ]
          };
          if (this.isEdit) {
            obj.line_id = this.formFileds.line_id;
            updateLine(obj).then(res => {
              this.isShowEditDialog = false;
              this.isShowEditDialog = false;
              this.formFileds.line_name = "";
              this.formFileds.depart_name = "";
              this.formFileds.depart_id = [];
              this.getInfoList(this.userInfo.depart_id);
            });
          } else {
            addLine(obj).then(res => {
              if (res.code == 200 || res.code == 0) {
                this.isShowEditDialog = false;
                this.formFileds.line_name = "";
                this.formFileds.depart_name = "";
                this.formFileds.depart_id = [];
                this.getInfoList(this.userInfo.depart_id);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    intoMuseum() {
      this.isEdit = false;
      this.isShowEditDialog = true;
      this.formFileds.depart_name = this.depart_name_map.get(
        this.formFileds.depart_id
      );
    },
    //搜索功能
    handleSearch(val) {
      let search = val;
      if (search == "") {
        //如果search等于空
        this.infos = this.infos2.get(1);
        this.infos_length = this.infos.length;
      }
      if (search != "") {
        //如果search不等于空
        this.infos = this.infos.filter(
          data =>
            !search ||
            data.nick_name.toLowerCase().includes(search.toLowerCase())
        );
        this.infos_length = this.infos.length;
      }
    },
    //分页功能
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>

<style  lang="less">
.part_tree {
  width: 300px;
}
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
.el-form {
  padding: 0 10px;
  margin-top: 10px;
}

.upload-demo {
  margin-left: 15px !important;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-date-editor {
  width: 100% !important;
}

.demo-input-suffix {
  width: 100%;
}

.demo-input-suffix span {
  width: 20%;
}

.el-input {
  //margin-top: 10px;
}
</style>
