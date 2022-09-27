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
    <!--    <el-button type="primary" title="批量设置抓图时间模板" size="medium" @click="intoMuseum">批量设置</el-button>-->
    <el-button type="primary" title="多窗口" size="medium" @click="lunxun">多窗口</el-button>
    <!--表格内容-->
    <el-table
      ref="list"
      :data="infos.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :current-page.sync="currentPage"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        label="设备名称"
      >
        <template slot-scope="scope">
          <span @click="updateDeviceName(scope.row)" style="margin-left: 5px;cursor:pointer;color: #3a8ee6"
                title="点击修改名称">{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_at"
        align="center"
        label="设备序列号"
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.deviceSerial }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="隶属部门"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.depart_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <!--          <span style="margin-left: 5px">{{ scope.row.status | filterStatus }}</span>-->
          <el-tag style="cursor: pointer" title="点击打开预览" v-if="scope.row.status==1" type="success"
                  @click="preview(scope.row)">在线
          </el-tag>
          <el-tag v-else type="danger" style="cursor: pointer" title="设备离线，无法预览">离线</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column
              label="创建时间"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.create_at }}</span>
              </template>
            </el-table-column>-->
      <el-table-column
        align="center"
        label="位置"
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.lng + "," + scope.row.lat }}</span>
        </template>
      </el-table-column>


      <!--      <el-table-column
              label="操作"
              width="220"
              align="center">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入用户昵称搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button type="danger" title="删除" size="small"
                >删除
                </el-button>
              </template>
            </el-table-column>-->
    </el-table>
    <el-dialog
      :title="previewTitle"
      :visible.sync="dialogVisible"
      width="80%"
      fullscreen
      :close-on-click-modal="false"
      :before-close="onClose"
    >
      <preview v-if="dialogVisible"></preview>
      <!--      <span slot="footer" class="dialog-footer">-->
      <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--  </span>-->
    </el-dialog>
    <el-dialog
      title="轮询播放"
      :visible.sync="play"
      width="80%"
      fullscreen
      :close-on-click-modal="false"
      :before-close="onplayClose"
    >
      <lunxun v-if="play"></lunxun>
      <!--      <span slot="footer" class="dialog-footer">-->
      <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--  </span>-->
    </el-dialog>
  </div>
</template>

<script>
//引入定义ajax请求方法
import {
  reqDeviceList, reqPresetAdd, updateDevicename
} from "../../../api"
import preview from "./preview";
import lunxun from "./lunxun";

export default {
  name: "Table",
  components: {preview, lunxun},
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      infos: [],
      infos2: new Map(),
      infos_length: 0,
      search: '',
      userInfo: null,
      openVideo: false,//打开视频预览页面
      dialogVisible: false,//打开视频预览页面
      previewTitle: "",//打开视频预览页面
      device: {},//当前预览的device
      closePlayerCallback: null,
      multipleSelection: [],
      play: false

    }
  },
  filters: {
    filterStatus(val) {
      if (val == 1) {
        return '在线'
      } else {
        return '离线'
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('user'))
    this.getDevice()
  },
  watch: {
    search(newVal) {
      this.handleSearch(newVal);
    },
  },
  methods: {
    lunxun() {
      this.play = true
    },
    onplayClose() {
      this.play = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    updateDeviceName(row) {
      this.$prompt('请输入设备名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.deviceName || ""
      }).then(({value}) => {
        value = value.trim()
        if (value) {
          let {deviceSerial,} = row
          updateDevicename({deviceSerial, deviceName: value}).then(rsp => {

            if (rsp.code == 200) {
              row.deviceName = value
              this.$message.success(rsp.msg)
            } else
              this.$message.error(rsp.msg)
          })
        } else {
          this.$message.warning("请输入设备名称")
        }
      }).catch(() => {

      });
    },
    onClose(done) {
      if (this.closePlayerCallback) {
        this.closePlayerCallback().then(rsp => {
          done()
        }).catch(e => {
          done()
        })
      }

      // this.dialogVisible = false
    },
    getRow() {
      return this.device
    },
    closePlayer() {

    },

    preview(row) {
      this.previewTitle = row.deviceName
      this.device = row
      this.dialogVisible = true
    },
    //获取设备列表
    getDevice() {
      reqDeviceList({depart_id: this.userInfo.depart_id}).then(res => {
        console.log(res)
        if (res.code == 200 || res.code == 0) {
          this.infos = res.data;
          this.infos2.set(1, res.data);
          this.infos_length = this.infos.length;
        }
      });
    },
    intoMuseum() {
      if (this.multipleSelection.length) {

      } else {
        this.$message.warning("请选择设备")
      }
      // this.$prompt('请输入', '添加设备预置点', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(async ({value}) => {
      //   //  reqPresetAdd
      // })
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
          (data) =>
            !search || data.deviceName.toLowerCase().includes(search.toLowerCase())
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
    },
  }
}
</script>

<style scoped lang="less">


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
