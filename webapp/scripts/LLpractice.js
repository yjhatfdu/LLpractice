/*LLpractice.js 1.0  作者 acfun @哦那个青年  请随意使用或修改源代码，但是最好和做原作者分享一下
 本程序仅供学习交流html5技巧使用，本身不包含任何版权音频或者图像，最终部署的网页中的版权文件与本程序以及作者无关
 */
//初始化数据


//参数设置
//击打相应时间，默认在128的速度下为200ms












var responsetime = 200;

//渲染精度
const p = 1;
const linewidth=10;
var hitmapdata;
var duration;

var audiocontext;
var maingraphics, rankindicator, comboindicator;
var bgmbuffer, perfectbuffer,greatbuffer, goodbuffer, badbuffer, missbuffer;
var starttime;
var touchview;
var windowwidth, windowheight;
var ended=false;
var mycanvas,mybody;
//设置播放开始的时间
var inittime;
function getQueryString(name) {
    //获取请求的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function init() {
    // var maindiv = document.getElementById("maindiv");
    // maindiv.style.height = window.innerHeight;
    //  var divwidth = 4 / 3 * window.innerHeight;
    //  maindiv.style.width = divwidth;
    
    //  maindiv.style.left = 0.5 * (window.innerWidth - divwidth);
    
    
    
    
    initgraphics();
    loadhitmap();
    initaudio();
    resize();
}
function resize() {
    //取得canvas实际尺寸,根据窗口调整布局
    document.getElementById("maindiv").style.height = "100%";
    document.getElementById("maindiv").style.width = "100%";
    mycanvas = document.getElementById("maincanvas");
    
    var bgimg = document.getElementById("bgimg");
    windowheight = document.getElementById("maindiv").offsetHeight;
    windowwidth = document.getElementById("maindiv").offsetWidth;
    touchview = document.getElementById("touchview");
    if (windowheight / windowwidth < 682 / 1024) {
        canvasheight = windowheight;
        canvaswidth = windowheight / 682 * 1024;
        
        touchview.style.top = 0;
        touchview.style.left = 0.5 * (windowwidth - canvaswidth) + "px";
        
    } else {
        canvaswidth = windowwidth;
        
        canvasheight = canvaswidth / 1024 * 682;
        touchview.style.top = 0.5 * (windowheight - canvasheight) + "px";
        mycanvas.style.top = 0.5 * (windowheight - canvasheight) + "px";
        
        touchview.style.left = 0;
    }
    touchview.style.width = canvaswidth + "px";
    touchview.style.height = canvasheight + "px";
    mycanvas.style.width = canvaswidth + "px";
    mycanvas.style.height = canvasheight+ "px";
    mycanvas.style.top=touchview.style.top;
    mycanvas.width = 1024*p;
    mycanvas.height = 682*p;
    mycanvas.style.left=touchview.style.left
    bgimg.style.width = touchview.style.width;
    bgimg.style.height = touchview.style.height;
    bgimg.style.left = touchview.style.left ;
    bgimg.style.top = touchview.style.top;
    
    
    ratio = canvasheight / 682;
}

function initaudio() {
    //document.getElementById("bgmmp3").load();
    //初始化音频
    try{
        audiocontext = new webkitAudioContext;}
    catch(err) {
        audiocontext=new window.AudioContext;
    }
    
    //加载bgm
    /*调试版启用
    if (bgmpath==null){
        var bgmpath=hitmapdata.audiofile;
    }*/
    //使用ajax加载
    var request = new XMLHttpRequest();
    request.open("GET", bgmpath, true);
    request.responseType = "arraybuffer";
    request.onprogress = function (evt) {
        var progress = evt.loaded / evt.total;
        document.getElementById("indicator").innerHTML = "loading" + Math.round(progress*10) * 10 + "%";
        //显示bgm加载进度
    }
    request.onload=function(){
        audiocontext.decodeAudioData(request.response, function (buffer) {
                                     bgmbuffer = buffer;
                                     document.getElementById("indicator").style.fontsize = 50 ;
                                     document.getElementById("indicator").innerHTML = "START!"
                                     document.getElementById("indicator").setAttribute("onclick", "start()");
                                     duration = buffer.duration * 1000;
                                     },function(){return});
        
        
    }
    
    request.send();
    
    // bgmsource = audiocontext.createMediaElementSource(document.getElementById("bgmmp3"));
    
    var bufferloader = new BufferLoader(audiocontext,
                                        [
                                         "perfect.mp3",
                                         "great.mp3",
                                         "good.mp3"
                                         
                                         ],
                                        finishedloading
                                        );
    bufferloader.load();
    /*/加载音效
     perfectbuffer= loadsound(perfectbuffer,"perfect.mp3");
     
     greatbuffer = loadsound("great.mp3");
     
     goodbuffer= loadsound( "good.mp3");
     
     loadsound(badbuffer, "bad.mp3");
     
     loadsound(missbuffer, "miss.mp3");
     */
}
function finishedloading(list) {
    perfectbuffer = list[0];
    greatbuffer = list[1];
    goodbuffer = list[2];
}
function initgraphics() {
    //初始化画布
    maingraphics = document.getElementById("maincanvas").getContext("2d");
    
    //rankindicator = $("rankcanvas").getContext("2d");
    // comboindicator = $("combocanvas").getContext("2d");
}

function loadsound(soundbuffer, soundurl) {
    //加载指定url的音频文件到指定buffer
    soundbuffer.DontDelete = true;
    var request = new XMLHttpRequest;
    
    request.responseType = "arraybuffer";
    request.open("GET", soundurl, true);
    request.onload = function () {
        audiocontext.decodeAudioData(request.response, function (buffer) {
                                     soundbuffer = buffer;
                                     
                                     });
    }
    request.send();
}


var notes, speed, noteslength=0;
//存放每个lane的notes
var notes = new Array();
//存放每个lane当前出现的notes
var currentdrawingnotes = new Array(8);


function loadhitmap() {
    /*
     加载hitmap数据
     数据结构为json
     示例：
     {
     "audiofile":"snowhalation.mp3"
     "speed":128  /最大128
     "lane":[{"note":
     [
     "starttime":1213,"endtime":1213 ,"longnote":false,"parallel":false,"hold":false},
     .....
     ]    ]      }
     */

    var request = new XMLHttpRequest;
    /*调试版启用
    if (hitmapfile==null){
      var  hitmapfile="data.js";
    }*/
    request.open("GET", hitmapfile, false);
    request.send();
    hitmapdata = eval("(" + request.responseText + ")");
    for (i = 0; i < 9;i++)
    {
        notes[i] = hitmapdata.lane[i];
    }
    
    speed = hitmapdata.speed;
    
    
    
}
//记录各种rank的总数和combo
var perfectcount=0, greatcount=0, goodcount=0, badcount=0, misscount=0, currentcombo=0, maxcombo=0;
var sensitivity = 100;
//用于记录每个hit的完成情况（未实现）
var recorder = new Array();
var totaldelay = 0;
var canvaswidth, canvasheight;
var currenttime;
//所有绘制按照ipad尺寸1024*682绘制，然后转换成实际的尺寸
//中心位置：（512px，170px）,lane长度425px，每个lane之间的角度为8/180PI，圆圈直径136px


//实际与计划height的比值
var ratio;
var fps;

//记录hit反馈,为反馈动画开始的毫秒数
var hitsprite= new Array(8);
//hit反馈效果的持续时间
const hitspritetime=200;
var rankfade,combofade;

var fxsource;
//rank反馈时间
const rankpritetime=500;
var currentrank;
function start() {
    //开始
    resize();
    document.getElementById("touchview").style.display="none";

    //var bgmobj = document.getElementById("bgmmp3");
    //将bgm连接至AudioContext
    //bgmsource.connect(audiocontext.destination);
    //初始化数组
    for (i = 0; i < 9; i++) {
        currentdrawingnotes[i] = new Array();
    }
    //创建touch检测
	if(document.hasOwnProperty("ontouchstart")) {
      mycanvas.addEventListener("touchstart",canvastouchdown,false);
 mycanvas.addEventListener("touchend",canvastouchend,false); 
    }else{    mycanvas.addEventListener("mousedown",canvastouchdown,false);
    mycanvas.addEventListener("mouseup",canvastouchend,false);}



    mybody=document.getElementById("body");
    mybody.addEventListener("keydown",keydown,false);
    mybody.addEventListener("keyup",keyup,false);

    /*
    var htmlstring = "";
    for (i = 0; i < 9; i++) {
        
        htmlstring = htmlstring + '<div class="touchdiv" ontouchstart="touchdown(' + i + ')" ontouchend="touchup(' + i + ')" onmousedown="touchdown(' + i + ')" onmouseup="touchup(' + i + ')" id="t' + i + '" ></div>';
    }
    touchview.innerHTML = htmlstring;
    for (i = 0; i < 9; i++) {
        var x, y, width;
        var touch = document.getElementById("t" + i);
        
        x = (512 - 425 * Math.cos(i / 8 * Math.PI))*ratio-64*ratio;
        y =  (170 + 425 * Math.sin(i / 8 * Math.PI))*ratio-64*ratio;
        width = 128 * ratio;
        
        touch.style.left = x + "px";
        touch.style.top = y + "px";
        touch.style.width = width + "px";
        touch.style.height = width + "px";
        
    }
    */



    //初始化hitsprite防止开始时播放动画
    for (i=0;i<9;i++){
        hitsprite[i]=-hitspritetime;
    }
    rankfade=-rankpritetime;
    fxsource = audiocontext.createBufferSource();
    fxsource.connect(audiocontext.destination);
    
    //开始播放bgm
    var source = audiocontext.createBufferSource();
    source.buffer =bgmbuffer;
    source.connect(audiocontext.destination);
    
    source. addEventListener("ended",function(){ended=true},false )
    if (getQueryString("t"))
    {
        inittime=parseInt(getQueryString("t"));
    }else {inittime=0}

    source.start(0,inittime);
    
    //记录开始时间
    var d = new Date;
    starttime = d.getTime()-1000*inittime;
    
    //图像渲染第一帧
    //fpsview = document.getElementById("fpsview");
    //setInterval(oneframe, 10);
    requestAnimationFrame(oneframe);
    
    
}
var frame=0;
function test(){
	var a=1;
	}
function oneframe() {
    //渲染一帧
    //记录开始时间
    var d = new Date;
    var fstarttime = d.getTime() - starttime;
    currenttime = fstarttime;
	frame+=1;
    maingraphics.clearRect(0, 0, p*1024, p*768);
    for (i = 0; i < 9; i++) {
        if (notes[i].length > 0) {
            //将需要画的note取出
            if (notes[i][0].starttime < (fstarttime + 128000/speed)) {
                currentdrawingnotes[i].push(notes[i].shift());
                
            }
        }
        
        
        if (currentdrawingnotes[i].length > 0) {
            //将已经超过的note取出
            if (currentdrawingnotes[i][0].endtime < fstarttime - responsetime  || ((currentdrawingnotes[i][0].starttime < fstarttime - responsetime ) && currentdrawingnotes[i][0].hold==false )) {
                currentdrawingnotes[i].shift();
                lostcombo();
                miss();
            }
        }
       
		
      
        //设置描边颜色和宽度
        maingraphics.strokeStyle = "rgb(244,255,92)";
        
        //遍历画note
        
        var len = currentdrawingnotes[i].length;
        for (j = 0;j<len;j++){
            drawnote(j, i);
        }
        
    }
     //画hit反馈动画
		
        for (j=0;j<9;j++)
        {
            if (currenttime-hitsprite[j]<hitspritetime)
            {
                drawhitsprite(j);
            }
        }
        //画combo以及rank
      if (currenttime-rankfade<rankpritetime){
            drawrank();
            
        }
        if (currentcombo>0){
            drawcombo();
        }
    //检查bgm是否结束
    /* if (document.getElementById("bgmmp3").ended==false)
     {
     
     } else {
     
     }*/
    /*记录这一帧的结束时间
    var d = new Date;
    var fendtime = d.getTime() - starttime;
    //计算fps
    fps = 1000 / (fstarttime - fendtime);
    */
    if (currenttime>duration+1000){
        mycanvas.removeEventListener("touchstart",canvastouchdown,false);
        mycanvas.removeEventListener("touchend",canvastouchend,false);
        mycanvas.removeEventListener("mousedown",canvastouchdown,false);
        mycanvas.removeEventListener("mouseup",canvastouchend,false);
        showresult();
        return;
    }
    requestAnimationFrame(oneframe);
    if(needplaybuffer){
        playsound(needplaybuffer);
        needplaybuffer=null;
    }
}

function drawnote(index, lane) {
    //将来计划用类来实现
    note = currentdrawingnotes[lane][index];
    if (note.longnote==true) {
        //长note
        //长条的四个顶点
        
        var offsettime1, offsettime2;
        offsettime2 = currenttime - note.endtime;
        if (note.hold==false)
        {
            //画长条
            offsettime1 = currenttime - note.starttime;
            drawstrip(offsettime1, offsettime2,lane,false);
            //没有正在被按的note画出头
            drawshortnote(note.starttime, lane, false, note.parallel);
            drawshortnote(note.endtime, lane, true, false);
            
            
        } else {
            if (offsettime2 < 0) {
                offsettime1 = 0;
                drawstrip(offsettime1, offsettime2, lane,true);
                drawshortnote(note.endtime, lane, true, false);
            }
        }
        
    } else {
        drawshortnote(note.starttime, lane, false,note.parallel);
    }
    
    
}
function drawstrip(offsettime1, offsettime2, lane,hold) {
    //画长条
    var x1, x2, x3, x4, y1, y2, y3, y4;
    var circle1, circle2;
    var a = lane * 0.125 * Math.PI;
    circle1 = getcircle(offsettime1,lane);
    circle2 = getcircle(offsettime2, lane);
    if (circle1.dist < 0) {
        return
    }
    x1 = circle1.x - Math.sin( a) * circle1.r;
    y1 = circle1.y - Math.cos(a) * circle1.r;
    x2 = circle1.x + Math.sin( a) * circle1.r;
    y2 = circle1.y + Math.cos(a) * circle1.r;
    x3 = circle2.x + Math.sin( a) * circle2.r;
    y3 = circle2.y + Math.cos(a) * circle2.r;
    x4 = circle2.x - Math.sin(a) * circle2.r;
    y4 = circle2.y - Math.cos(a) * circle2.r;
    maingraphics.beginPath();
    maingraphics.moveTo(x1, y1);
    maingraphics.lineTo(x2, y2);
    maingraphics.lineTo(x3, y3);
    maingraphics.lineTo(x4, y4);
    maingraphics.closePath();
    if (hold == true) {
        var alpha=0.5+ 0.2 *Math.sin( currenttime/200) ;
        maingraphics.fillStyle = "rgba(255,255,255,"+ alpha + ")";
    }else{
        maingraphics.fillStyle = "rgba(255,255,255,0.5)";
    }
    maingraphics.closePath;
    maingraphics.fill();
}

function drawshortnote(starttime,lane,fill,parallel) {
    //画短note
    
    var offsettime = currenttime - starttime;
    
    var circle = getcircle(offsettime,lane);
    if (circle.dist<0){
        return
    }
    maingraphics.beginPath();
    
    maingraphics.arc(circle.x, circle.y, circle.r, 0.5 * Math.PI, 2.5 * Math.PI);
    if (parallel) {
        //画平行线标记
        maingraphics.moveTo(circle.x + circle.r - p*10 * (circle.r / 64), circle.y);
        maingraphics.lineTo(circle.x - circle.r + p*10 * (circle.r / 64), circle.y);
    }
    
    maingraphics.lineWidth = linewidth  * (circle.r / 64);
    
    maingraphics.closePath;
    maingraphics.stroke();
    if(fill){
        //填充长note的末尾
        maingraphics.fillStyle="rgb(240,240,240)";
        maingraphics.fill;
    }
}



function drawhitsprite(lane)
{

    // 透明渐变太费性能，转用图片来实现
    
    
    //画hit的反馈效果
    var targetcircle=getcircle(0,lane);
    var offsettime=currenttime-hitsprite[lane];
    var grd=maingraphics.createRadialGradient(targetcircle.x,targetcircle.y,1.5*p*64*offsettime/hitspritetime,targetcircle.x,targetcircle.y,1.5*p*64*(offsettime/hitspritetime+1));
    
    var alpha=Math.sqrt(1-offsettime/hitspritetime);
    grd.addColorStop(0,"rgba(255,255,255,"+alpha*alpha+")");
    grd.addColorStop(0.5,"rgba(255,255,255,"+alpha+")");
    grd.addColorStop(1,"rgba(255,255,255,0)");
    maingraphics.beginPath();
    maingraphics.arc(targetcircle.x,targetcircle.y,targetcircle.r *3,0,2*Math.PI);
    maingraphics.fillStyle=grd;
    maingraphics.fill();
    
    
    
}


function drawrank() {

    var offset=(currenttime-rankfade)/rankpritetime;
    maingraphics.textBaseline="middle";
    maingraphics.textAlign="center";
    
    maingraphics.fillStyle = "rgba(255,255,255,"+(1-offset)*1+")";
    maingraphics.font=p*(40*offset+40) + "px Arial";
    maingraphics.fillText(currentrank,512*p,350*p);
    
}
function drawcombo() {

    maingraphics.textBaseline="middle";
    maingraphics.textAlign="center";
    maingraphics.fillStyle ="rgba(255,255,255,0.8)";
    maingraphics.font=40*p + "px Arial";
    maingraphics.fillText(currentcombo + " COMBO",512*p,250*p);
}

function getcircle(offsettime,lane) {
    //获取园的相关信息
    var x, y, angle, r, circler;
    //note的时间与当前时间的偏差
    //校正后note与center的位置/lane的半径
    if (offsettime / (128000 / speed) < -1000) {
        offsettime = -(128000 / speed);
    }
    /*
     没这么复杂
     if (offsettime < 0) {
     circler = ratio * 64 * Math.sin((1 + offsettime / (128000 / speed)) * Math.PI / 2);
     r =1.414* Math.sin((1+(offsettime / (128000 / speed))) * Math.PI / 4);
     } else {
     r = (1 + 0.707*  offsettime / (128000 / speed));
     circler = ratio * 64
     }
     if (circler < 0) {
     circler = 0;
     r = 0;
     
     }*/
    r = (offsettime / (128000 / speed) + 1)
    if (r < 0) {
        r=0
    }
    circler = r * 64*p ;
    
    
    angle = 22.5 * lane;
    x = 512 - r * 425 * Math.cos(angle / 180 * Math.PI);
    y = 170 + r * 425 * Math.sin(angle / 180 * Math.PI);
    var result =new Object;
    result.x = x*p;
    result.y = y*p;
    result.r = circler;
    result.dist = r;
    return result;
}

function perfect() {
    perfectcount += 1;
    needplaybuffer=perfectbuffer;
    //playsound(perfectbuffer);
    currentrank="Perfect";
    rankfade=currenttime;
}

function great() {
    greatcount += 1;
    needplaybuffer=greatbuffer;
    //playsound(greatbuffer);
    currentrank="Great";
    rankfade=currenttime;
}
function good() {
    goodcount += 1;
    needplaybuffer=goodbuffer;
    //playsound(goodbuffer);
    currentrank="Good";
    rankfade=currenttime;
}
function bad() {
    badcount += 1;
    currentrank="Bad";
    rankfade=currenttime;
}
function miss() {
    misscount += 1;
    currentrank="Miss";
    rankfade=currenttime;
}
function canvastouchdown(evt){
    //相应canvas的touchstart事件
    var x,y;
    if(evt.changedTouches){
        for( i=0; i< evt.changedTouches.length;i++)
        {
            x= evt.changedTouches[i].pageX;
            y= evt.changedTouches[i].pageY;
            var lane=laneofpos(x,y);
            if(lane>=0){
                touchdown(laneofpos(x,y));
            }
        }

    }else
    {
        x=evt.pageX;
        y=evt.pageY;
        var lane=laneofpos(x,y);
        if(lane>=0){
            touchdown(laneofpos(x,y));
        }
    }

}
function canvastouchend(evt){
    var x,y;
    if(evt.changedTouches){
        for( i=0; i< evt.changedTouches.length;i++)
        {
            x= evt.changedTouches[i].pageX;
            y= evt.changedTouches[i].pageY;
            var lane=laneofpos(x,y);
            if(lane>=0){
                touchup(laneofpos(x,y));
            }
        }
    }else
    {
        x=evt.pageX;
        y=evt.pageY;
    }
    var lane=laneofpos(x,y);
    if(lane>=0){
        touchup(laneofpos(x,y));
    }

}
//加入键盘相应
function keydown(evt){
   var keychar=String.fromCharCode( evt.keyCode);
    var lane;
    switch (keychar){
        case "A":lane=0;break;
        case "S":lane=1;break;
        case "D":lane=2;break;
        case "F":lane=3;break;

        case "J":lane=5;break;
        case "K":lane=6;break;
        case "L":lane=7;break;



    }
    if (evt.keyCode==32)
    {
        lane=4;
    }
    if (evt.keyCode==186){
        lane=8;
    }
    if(lane>=0){
        touchdown(lane);
    }

}
function keyup(evt){
    var keychar=String.fromCharCode( evt.keyCode);
    var lane;
    switch (keychar){
        case "A":lane=0;break;
        case "S":lane=1;break;
        case "D":lane=2;break;
        case "F":lane=3;break;

        case "J":lane=5;break;
        case "K":lane=6;break;
        case "L":lane=7;break;



    }
    if (evt.keyCode==32)
    {
        lane=4;
    }
    if (evt.keyCode==186){
        lane=8;
    }
    if(lane>=0){
        touchup(lane);
    }
}
function laneofpos(x,y)
{
    //使用绝对坐标解析出相对的方向0-8
    //相对于canvas的位置
    var rx,ry;
    rx=x-mycanvas.offsetLeft;
ry=y-mycanvas.offsetTop;
    //解析出对于画图的相对坐标；
    rx=rx/ratio-512;
ry=ry/ratio-170;
    //算出角度
    
        var r=Math.sqrt(rx*rx+ry*ry);
        var angle= Math.acos(-rx/r);
        return Math.round(angle/0.125/Math.PI)
return null;

}
function touchdown(lane) {
    //相应按下的事件
     var d = new Date();
        currenttime = d.getTime() - starttime;
        if (currentdrawingnotes[lane].length == 0) {
            return;
        }
        var  minoffset=128000/speed+100;
        var tempoffset;
        var minindex;
		var note;
        for( var i=0 ; i<currentdrawingnotes[lane].length;i++){
            tempoffset=currentdrawingnotes[lane][i].starttime-currenttime;
            if (Math.abs(tempoffset)<=minoffset){

                minoffset=tempoffset;
                minindex=i;
            }
        }
note=currentdrawingnotes[lane][minindex];
        var offset = minoffset;
        if (Math.abs(offset) > responsetime * 128 / speed) {
            return;
        }
        if (note.longnote == true) {
            note.hold = true;
            ranknote(offset, 0,lane);
        } else {
            //如果是短note就从绘图列表里删除
            currentdrawingnotes[lane].splice(minindex,1);
            ranknote(offset,1,lane);
        }
}

function touchup(lane) {
    if (currentdrawingnotes[lane].length == 0) {
        return;
    }
    var note = currentdrawingnotes[lane][0];
    var d = new Date();
    var current = d.getTime() - starttime;
    var offset = current - note.endtime;
    if (note.hold) {
        
        currentdrawingnotes[lane].shift();
        ranknote(offset, 1,lane);
    }
}
//countcombo表示是否增加combo数，当为longnote的starttime时为0，其他为1
var totaloffset = 0;
function ranknote(offsettime,countcombo,lane) {
    hitsprite[lane]=currenttime;
    totaldelay += offsettime;
    totaloffset += Math.abs(offsettime);
    noteslength += 1;
    var delay=Math.abs( offsettime);
    if(delay<=responsetime * 0.25/speed*128){
        perfect();
        combo(countcombo);
    } else if (delay <= responsetime *0.5/speed*128) {
        great();
        combo(countcombo);
    } else if (delay <= responsetime *0.75/speed*128) {
        good();
        lostcombo();
    }else{
        bad();
        lostcombo();
    }
}




function lostcombo(){
    currentcombo = 0;
}
function combo(countcombo) {
    currentcombo = currentcombo + countcombo;
    if (currentcombo > maxcombo) {
        maxcombo = currentcombo;
    }
}

var lastplaytime;
var needplaybuffer;
function playsound(soundbuffer) {
    //播放音效
    
    if (currenttime-lastplaytime<50){
        return;
    }
    
    lastplaytime=currenttime;
    
    fxsource=audiocontext.createBufferSource();
    fxsource.connect(audiocontext.destination);
    fxsource.buffer = soundbuffer;
    fxsource.start(0);
    
}
function showresult() {
    
    var resultdiv = document.getElementById("result");
    resultdiv.style.display = "initial";
    document.getElementById("maxcombo").innerHTML = "MaxCombo:" + maxcombo;
    document.getElementById("perfectc").innerHTML = "Perfect:" + perfectcount;
    document.getElementById("greatc").innerHTML = "Great:" + greatcount;
    document.getElementById("goodc").innerHTML = "Good:" + goodcount;
    document.getElementById("badc").innerHTML = "Bad:" + badcount;
    document.getElementById("missc").innerHTML = "Miss:" + misscount;
    document.getElementById("delayc").innerHTML = "平均打击延迟:" + Math.round(totaldelay * 10 / noteslength) / 10 + "毫秒";
    document.getElementById("offsetc").innerHTML = "平均打击误差:" + Math.round(totaloffset * 10 / noteslength) / 10 + "毫秒";
}
