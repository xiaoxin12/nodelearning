var fs = require('fs');

// 任意选中一个文件夹/文件对其使用递归判断类型
var target = '.\\copys'

function dir_type(dir, tar) {
    // 读取文件信息

    fs.stat(dir, function(err, stats){
        if (err) {return console.log('文件信息获取失败'+err)}
        var s1 = dir.split("\\").length;
        var s = dir.split("\\")[s1-1]	
        if(stats.isFile()){
            //这是一个文件
            start_copy(dir, tar+'\\'+s)
        }else if (stats.isDirectory()) {
        
            // 1. 获取到相关的目录名字，并创建目录
            isDirectory(s , tar)
            each_dir(s, dir,tar)
        }
    })
}
function each_dir(s, dir,tar){
    // 2. 对目录下的每个文件实现copy
    fs.readdir(dir, function(err,files){
        if (err) {
           return console.error(err);
       }
       files.forEach( function (file){
       		// console.log(s,dir,tar,file, '文件目录信息')
           dir_type(dir+'\\'+file, tar+'\\'+s)

       });
    })
}

function start_copy(name,dirname){
    // 这里的name 是原始的文件
    // dirname 是将要copy到的文件的名字
    var readerStream = fs.createReadStream(name);
    // 创建一个可写流
    var writerStream = fs.createWriteStream(dirname);

    // 管道读写操作
    readerStream.pipe(writerStream);

    console.log(name+ "copy 完毕");
}

function isDirectory(dir, target){
    // 首先在目标地址下创建目录。然后实现文件的copy
    target = target +'\\'+ dir
    fs.mkdir(target, function(){
        console.log('创建目录'+ target)
    })
}

function copy_exe(need,target){
	console.log('start copy')
	dir_type(need, target)
	console.log('copy end!')
}
copy_exe('E:\\mylear\\软件', target)


