var express = require('express'); // 引入express 模块
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// 路由为/默认www静态文件夹
app.use('/', express.static(__dirname + '/src'));
// app.get('/', function(req, res) {
// 	res.send('<h1>heelo world</h1>')
// })
let users = [], usersInfo = [], userInfo = []
io.on('connection', function(socket){ // 用户连接时触发
  console.log('a user connected');
  // 渲染在线人员
  io.emit('disUser', userInfo);

  // 登陆检测用户名
  socket.on('login', (user) =>{
  	if(users.indexOf(user.name) > -1) { // 昵称是否存在
            socket.emit('loginError'); // 触发客户端的登录失败事件
        } else {
            users.push(user.name); //储存用户的昵称
            usersInfo.push(user); // 储存用户的昵称和头像
            socket.emit('loginSuc'); // 触发客户端的登录成功事件
            socket.nickname = user.name;
            io.emit('system', {  // 向所有用户广播该用户进入房间
                name: user.name,
                status: '进入'
            });
            io.emit('disUser', usersInfo);  // 渲染右侧在线人员信息
            console.log(users.length + ' user connect.'); // 打印连接人数
        }
  })
  // 发送消息事件
    socket.on('sendMsg', (data)=> {
        var img = '';
        for(var i = 0; i < usersInfo.length; i++) {
            if(usersInfo[i].name == socket.nickname) {
                img = usersInfo[i].img;
            }
        }
        socket.broadcast.emit('receiveMsg', {  // 向除了发送者之外的其他用户广播
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            side: 'left'
        });
        socket.emit('receiveMsg', {  // 向发送者发送消息，为什么分开发送？因为css样式不同
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            side: 'right'
        });
    });
 
});
http.listen(1000, function(){
	console.log('listen on *:1000')
})