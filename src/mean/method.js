export function getBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = () => {
      imgResult = reader.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    //成功的
    reader.onloadend = () => {
      resolve(imgResult);
    };
  });
}

//切换
export function switchEnable(e, infosw, request) {
  let id = infosw.id;
  let show = e;
  request({id, show}).then(res => {
    console.log(res);
  })
}

//上传的图片格式
export function uploadFormat(file, that) {
  let arr = [
    'image/png',
    'image/jpg',
    'image/jpeg',
  ]
  const isImage = arr.includes(file.raw.type)
  if (!isImage) {
    that.$message.error("上传文件类型必须是jpg/jpeg/png格式!");
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    that.$message.error("上传图片大小不能超过 5MB!");
  }
  that.dialogImageUrl = file.url
  //返回为false时 不能上传
  return isImage && isLt2M;
}

//移动事件
export function mouseDown(id, width, height) {
  let ball = document.getElementById(id);
  let leftCha, topCha;
  //定义鼠标是否按下的标识
  let isDown = false;
  var e = e || window.event;
  leftCha = e.clientX - ball.offsetLeft;
  topCha = e.clientY - ball.offsetTop;
  isDown = true;
  window.onmousemove = function (e) {
    var e = e || window.event;
    if (!isDown) {
      return;  //终止程序执行
    }
    //div在windows窗口移动的距离
    ball.style.left = e.clientX - leftCha + 'px';
    ball.style.left = parseInt(ball.style.left) < 0 ? ball.style.left = 0 + 'px' : ball.style.left;
    ball.style.left = parseInt(ball.style.left) >= document.body.clientWidth - width ? ball.style.left = document.body.clientWidth - width + 'px' : ball.style.left;
    ball.style.top = e.clientY - topCha + 'px';
    ball.style.top = parseInt(ball.style.top) < 0 ? ball.style.top = 0 + 'px' : ball.style.top;
    ball.style.top = parseInt(ball.style.top) >= document.body.clientHeight - height ? ball.style.top = document.body.clientHeight - height + 'px' : ball.style.top;
  }
  //鼠标抬起事件
  ball.onmouseup = () => {
    isDown = false;
  }
}

//创建时间
export function createTime() {
  let time = new Date();
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minute = time.getMinutes()
  let second = time.getSeconds()
  if (month < 10) {
    month = '0' + month
  }
  if (date < 10) {
    date = '0' + date
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  let dayTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second;
  return dayTime;
}
