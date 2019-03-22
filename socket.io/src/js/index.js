$(function() {
    // io-client
    // 连接成功会触发服务器端的connection事件
    var socket = io(); 

    // 点击输入昵称
    $('#nameBtn').click(()=> {  
      var imgN = Math.floor(Math.random()*4)+1; // 随机分配头像
      if($('#name').val().trim()!=='')
          socket.emit('login', {  // 触发服务器端登录事件
            name: $('#name').val(),
            img: 'image/img (' + imgN + ').png'
          }); 
      return false;  
    });
    // 登录成功，隐藏登录层
    socket.on('loginSuc', ()=> { 
      $('.name').hide(); 
    })
    socket.on('loginError', ()=> {
      alert('用户名已存在，请重新输入！');
      $('#name').val('');
    }); 


    // 显示在线人员
    socket.on('disUser', (usersInfo)=> {
      displayUser(usersInfo);
    });
    // 显示在线人员
    function displayUser(users) {
      $('#users').text(''); // 每次都要重新渲染
      if(!users.length) {
        $('.contacts p').show();
      } else {
        $('.contacts p').hide();
      }
      $('#num').text(users.length);
      for(var i = 0; i < users.length; i++) {
        var $html = `<li>
          <img src="${users[i].img}">
          <span>${users[i].name}</span>
        </li>`;
        $('#users').append($html);
      }
    }


    // 点击按钮或回车键发送消息
    $('#sub').click(sendMsg);
    $('#m').keyup((ev)=> {
      if(ev.which == 13) {
        sendMsg();
      }
    });

    // 接收消息
    // socket.on('receiveMsg', (obj)=> { // 将接收到的消息渲染到面板上
    //   $('#messages').append(` 
    //      <li class='${obj.side}'>
    //       <img src="${obj.img}">
    //       <div>
    //         <span>${obj.name}</span>
    //         <p>${obj.msg}</p>
    //       </div>
    //     </li>
    //   `);
    //   // 滚动条总是在最底部
    //   $('#messages').scrollTop($('#messages')[0].scrollHeight);
    // }); 
    socket.on('receiveMsg', (obj)=> {  
      // 提取文字中的表情加以渲染
      var msg = obj.msg;
      var content = '';
      while(msg.indexOf('[') > -1) {  // 其实更建议用正则将[]中的内容提取出来
        var start = msg.indexOf('[');
        var end = msg.indexOf(']');

        content += '<span>'+msg.substr(0, start)+'</span>';
        content += '<img src="image/emoji/emoji%20('+msg.substr(start+6, end-start-6)+').png">';
        msg = msg.substr(end+1, msg.length);
      }
      content += '<span>'+msg+'</span>';
      
      $('#messages').append(`
        <li class='${obj.side}'>
          <img src="${obj.img}">
          <div>
            <span>${obj.name}</span>
            <p style="color: ${obj.color};">${content}</p>
          </div>
        </li>
      `);
      // 滚动条总是在最底部
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });


    // 发送消息
    function sendMsg() { 
      if($('#m').val() == '') {  // 输入消息为空
        alert('请输入内容！');
        return false;
      }
      socket.emit('sendMsg', {
        msg: $('#m').val()
      });
      $('#m').val(''); 
      return false; 
    }
    // 显示表情选择面板
    $('#smile').click(()=> {
      $('.selectBox').css('display', "block");
    });
    $('#smile').dblclick((ev)=> { 
      $('.selectBox').css('display', "none");
    });  
    $('#m').click(()=> {
      $('.selectBox').css('display', "none");
    }); 

    // 用户点击发送表情
    $('.emoji li img').click((ev)=> {
        ev = ev || window.event;
        var src = ev.target.src;
        var emoji = src.replace(/\D*/g, '').substr(6, 8); // 提取序号
        var old = $('#m').val(); // 用户输入的其他内容
        $('#m').val(old+'[emoji'+emoji+']');
        $('.selectBox').css('display', "none");
    });
});