/*
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-14 11:17:12
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-29 23:59:53
 * @FilePath: /farbound/src/api/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//src/api/index.js 保存项目所有请求方法
//1:引入刚才创建ajax函数
import ajax from "./ajax";
//2:创建常量保存请求服务器基础路径
// export const BASE_URL = "http://83lur872mq.51xd.pub";
export const BASE_URL = "https://www.xzxdlkj.com:8890";
// export const BASE_URL = "http://localhost:8890";
//3:创建函数 登录
export const reqLogin = data =>
  ajax(BASE_URL + "/api/v1/back/user/login", data, "POST");
//添加设备预置点
export const reqPresetAdd = data =>
  ajax(BASE_URL + "/api/v1/back/device/preset/add", data, "POST");
//删除用户
export const reqDeleteUser = data =>
  ajax(BASE_URL + "/api/v1/back/user/delete", data, "POST");
//添加用户
export const reqAddUser = data =>
  ajax(BASE_URL + "/api/v1/back/user/add", data, "POST");
//后台根据部门id获取设备列表
export const reqDeviceList = data =>
  ajax(BASE_URL + "/api/v1/back/device/list", data, "POST");
//根据部门id获取用户列表
export const reqUserList = data =>
  ajax(BASE_URL + "/api/v1/back/user/list", data, "POST");
//根据角色id获取权限
export const reqAuthByRoleId = data =>
  ajax(BASE_URL + "/api/v1/role/getAuthByRoleId", data, "POST");
//获取api列表
export const reqApiList = () =>
  ajax(BASE_URL + "/api/v1/apis/list", {}, "POST");
//获取角色列表
export const reqRoleList = () =>
  ajax(BASE_URL + "/api/v1/role/list", {}, "POST");
//根据部门id获取子部门列表
export const reqDepartList = data =>
  ajax(BASE_URL + "/api/v1/depart/list", data, "POST");
//添加部门
export const reqDepartAdd = data =>
  ajax(BASE_URL + "/api/v1/depart/add", data, "POST");
//删除部门
export const reqDepartDel = data =>
  ajax(BASE_URL + "/api/v1/depart/delete", data, "POST");
//更新设备名称
export const updateDevicename = data =>
  ajax(BASE_URL + "/api/v1/back/device/name/update", data, "POST");
export const getToken = () =>
  ajax(BASE_URL + "/api/v1/back/token/get", {}, "POST");

// 图片 getLogList
export const getLogList = data =>
  ajax(BASE_URL + "/api/v1/mobile/log/list", data, "POST");

// 图片 getLogList
export const getimgList = data =>
  ajax(
    BASE_URL + "/api/v1/mobile/log/getLogByDeviceSerialWithTime",
    data,
    "POST"
  );

// 设备列表
export const getdeviceList = data =>
  ajax(BASE_URL + "/api/v1/mobile/device/list", data, "POST");
