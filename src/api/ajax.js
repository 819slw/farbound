/*
src/api/ajax.js
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from "axios";
import md5 from "./md5";
import vue from "../main";
import el from "element-ui/src/locale/lang/el";
import { Loading } from "element-ui";

axios.defaults.withCredentials = false;

//进行加密操作
function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function(key) {
    newArgs[key] = args[key];
  });
  var string = "";
  for (var k in newArgs) {
    string += "&" + k + "=" + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

// md5加密
function setMd5(data) {
  return md5.md5(data).toUpperCase();
}

export default function ajax(url, data = {}, type = "GET", isJson) {
  let sign = setMd5(
    setMd5(raw(data)) + "&secret=GFE88E9F9A2GCCBE7116643640G6C086"
  );
  url = url + "?sign=" + sign;
  return new Promise(function(resolve, reject) {
    // 执行异步ajax请求
    let promise;
    let arr = [];
    for (let key in data) {
      arr.push(key + "=" + data[key]);
    }
    // 发送post请求
    let AccessToken;
    if (localStorage.getItem("user") && url.indexOf("login") === -1) {
      AccessToken = JSON.parse(localStorage.getItem("user")).auth_token;
    }
    promise = axios.post(url, isJson ? data : arr.join("&"), {
      headers: {
        "X-Access-Token": AccessToken
      }
    });
    //这里统一提示msg  loading也是
    // let loadingInstance = Loading.service({ fullscreen: true });
    promise
      .then(response => {
        if (response.data.code === 0 || Number(response.data.code) === 200) {
          // vue.$message.success(response.data.msg);
        } else {
          vue.$message.error(response.data.msg);
        }
        if (response.data.code > 1999) {
          vue.$router.replace("/login").then(r => {});
        }
        resolve(response.data);
        // loadingInstance.close();
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
