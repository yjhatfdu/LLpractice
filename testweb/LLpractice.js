/**
 * LLpractice.js 1.0.1
 * 作者 acfun @哦那个青年 
 * 编辑 bilibili @Coldghost 
 * 请随意使用或修改源代码，但是最好和原作者分享一下
 * 本程序仅供学习交流HTML5技巧使用，本身不包含任何版权音频或者图像，最终部署的网页中的版权文件与本程序以及作者无关
 **/
(function(global,factory){

    // For CommonJS and CommonJS-like environments where a proper window is present
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "You requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this , function(window){
    /* 初始化数据 */

    var responsetime = 200;     //击打相应时间(ms)，默认在128的速度下为200ms
    var p = 0.5;                //canvas画布比例值常量，const并不被所有浏览器支持
    var hitmapdata;             //歌曲beat信息的json文件
    var bgmpath;                //BGM的json文件
    var duration;               //BGM流的持续时间(s)
    var audiocontext;           //HTML5 Audio的API
    var maingraphics;           //canvas主画布
    var starttime;              //音频的开始时间(和bitmap的starttime重名，最好修改一下)
    var ended = false;          //检测播放是否结束的标记
    var bgmbuffer;              //通过解析音频数据得到的音频缓存
    var perfectbuffer;          //Perfect音效音频缓存
    var greatbuffer;            //Great音效音频缓存
    var goodbuffer;             //Good音效音频缓存

    //var badbuffer;            //Bad音效音频缓存(未启用)
    //var missbuffer;           //Miss音效音频缓存(未启用)

    //var rankindicator         //得分统计界面画布(未实现)
    //var comboindicator        //打击数据统计界面画布(未实现)

    //var touchview;            //已定义为局部变量 为了调整canvas界面而采用的遮罩层，在开始后隐藏(可考虑删除用其它方法代替)
    //var windowwidth;          //已定义为局部变量 window.offsetWidth
    //var windowheight;         //已定义为局部变量 window.offsetHeight
    var mycanvas;               //canvas主画布
    //var mybody;               //已定义为局部变量 document.body
    //var inittime;             //已定义为局部变量 开始时间的提前值(s)

    var speed;                  //歌曲速度(最高为128)
    var noteslength=0;          //总键数
    var notes = new Array();    //存放每个lane的notes
    var currentdrawingnotes = new Array(8);  //存放每个lane当前出现的notes

    //记录各种rank的总数和combo
    var perfectcount = 0;       //perfect总数
    var greatcount   = 0;       //great总数
    var goodcount    = 0;       //good总数
    var badcount     = 0;       //bad总数
    var misscount    = 0;       //miss总数
    var currentcombo = 0;       //当前连击数
    var maxcombo     = 0;       //最高连击数

    var totaldelay   = 0;       //平均打击延迟
    var totaloffset  = 0;       //平均打击误差
    var currenttime;            //记录当前时间

    //var sensitivity  = 100;                 //灵敏度(未使用)
    //var recorder = new Array();             //用于记录每个hit的完成情况（未实现）
    //var canvaswidth;     //已定义为局部变量 窗口变化时主canvas宽度
    //var canvasheight;    //已定义为局部变量 窗口变化时主canvas宽度

    //所有绘制按照ipad尺寸1024*682绘制，然后转换成实际的尺寸
    //中心位置：(512px，170px)，lane长度425px，每个lane之间的角度为8/180PI，圆圈直径136px

    var ratio;                    //实际与计划height的比值 ratio=canvas的高度/682
    var fxsource;                 //将audioBufferSouceNode连接到audioContext.destination(扬声器)

    var hitsprite = new Array(8); //记录hit反馈
    var hitspritetime=200;        //hit反馈效果的持续时间
    var rankfade;                 //rank时间偏移量
    var rankpritetime=500;        //rank反馈时间
    var currentrank;              //当前的rank字幕
    var frame = 0;                //记录总帧数
    var lastplaytime;             //上次打击时间
    var needplaybuffer;           //打击音效缓存

    //var fps;                    //每秒传输帧数(未使用)
    //var combofade;              //未使用

    /*
     * 获取请求的参数
     * @var name 参数名
     */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    /*
     * 初始化方法
     * @function initgraphics 初始化主画布
     * @function loadhitmap   加载hitmap数据
     * @function initaudio    初始化音频
     * @function resize       调整画布位置
     */
    function init() {
        initgraphics();
        loadhitmap();
        initaudio();
        resize();
    }

    /*
     * 初始化画布
     */
    function initgraphics() {
        maingraphics = document.getElementById("maincanvas").getContext("2d");
        //rankindicator  = $("rankcanvas").getContext("2d");
        //comboindicator = $("combocanvas").getContext("2d");
    }

    /*
     * 加载hitmap数据
     * 数据结构为json
     * 示例：
     * {
     *  "audiofile":"snowhalation.mp3"
     *  "speed":128.0  //最大128
     *  "lane":
     *   [[
     *      {"starttime":1213,"endtime":1213 ,"longnote":false,"parallel":false,"hold":false},
     *       .....
     *   ]],
     *  "fps":30.0
     * }
     */
    function loadhitmap() {
        /*调试版启用
        if (hitmapfile==null){
            var  hitmapfile="data.js";
        }
        */
        var request = new XMLHttpRequest;
        request.open("GET", hitmapfile, false);
        request.send();
        hitmapdata = eval("(" + request.responseText + ")");
        for (i = 0; i < 9;i++)
        {
            notes[i] = hitmapdata.lane[i];
        }
        speed = hitmapdata.speed;
    }

    /*
     * 初始化音频
     */
    function initaudio() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        try{
            audiocontext=new window.AudioContext;
        } catch(e) {
            alert('!Your browser does not support AudioContext');
        }
        
        //加载bgm
        /*
        if (bgmpath==null){
            var bgmpath=hitmapdata.audiofile;
        }
        */
        //使用ajax加载
        var request = new XMLHttpRequest();
        request.open("GET", bgmpath, true);
        request.responseType = "arraybuffer";
        request.onprogress = function (evt) {
            //显示bgm加载进度
            var progress = evt.loaded / evt.total;
            document.getElementById("indicator").innerHTML = "loading" + Math.round(progress*10) * 10 + "%";
        }
        request.onload=function(){
            audiocontext.decodeAudioData(request.response, function (buffer) {
                bgmbuffer = buffer;
                document.getElementById("indicator").style.fontsize = 50 ;
                document.getElementById("indicator").innerHTML      = "START!"
                //document.getElementById("indicator").setAttribute("onclick", "start()");
                duration = buffer.duration * 1000;
            },function(){return;});
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
        /*
         //加载音效
         perfectbuffer = loadsound(perfectbuffer,"perfect.mp3");
         greatbuffer   = loadsound("great.mp3");
         goodbuffer    = loadsound("good.mp3");
         loadsound(badbuffer, "bad.mp3");
         loadsound(missbuffer, "miss.mp3");
        */
    }

    /*
     * 取得canvas实际尺寸,根据窗口调整布局
     */
    function resize() {

        document.getElementById("maindiv").style.height = "100%";
        document.getElementById("maindiv").style.width  = "100%";
        mycanvas = document.getElementById("maincanvas");
        var bgimg    = document.getElementById("bgimg");
        var windowheight = document.getElementById("maindiv").offsetHeight;
        var windowwidth  = document.getElementById("maindiv").offsetWidth;
        var touchview    = document.getElementById("touchview");
        var canvaswidth,canvasheight;
        if (windowheight / windowwidth < 682 / 1024) {
            canvasheight = windowheight;
            canvaswidth  = windowheight / 682 * 1024;
            touchview.style.top  = 0;
            touchview.style.left = 0.5 * (windowwidth - canvaswidth) + "px";
        } else {
            canvaswidth  = windowwidth;
            canvasheight = canvaswidth / 1024 * 682;
            touchview.style.top  = 0.5 * (windowheight - canvasheight) + "px";
            mycanvas.style.top   = 0.5 * (windowheight - canvasheight) + "px";
            touchview.style.left = 0;
        }
        touchview.style.width  = canvaswidth  + "px";
        touchview.style.height = canvasheight + "px";
        mycanvas.style.width   = canvaswidth  + "px";
        mycanvas.style.height  = canvasheight + "px";
        mycanvas.style.top     = touchview.style.top;
        mycanvas.width         = 1024 * p;
        mycanvas.height        = 682  * p;
        mycanvas.style.left    = touchview.style.left
        bgimg.style.width      = touchview.style.width;
        bgimg.style.height     = touchview.style.height;
        bgimg.style.left       = touchview.style.left ;
        bgimg.style.top        = touchview.style.top;
        ratio = canvasheight / 682;
    }

    function finishedloading(list) {
        perfectbuffer = list[0];
        greatbuffer   = list[1];
        goodbuffer    = list[2];
    }

    function loadsound(soundbuffer, soundurl) {
        //加载指定url的音频文件到指定buffer
        soundbuffer.DontDelete = true;
        var request = new XMLHttpRequest;
        request.responseType = "arraybuffer";
        request.open("GET", soundurl, true);
        request.onload = function(){
            audiocontext.decodeAudioData(request.response, function (buffer) {
                soundbuffer = buffer;
            });
        }
        request.send();
    }

    function start() {
        //开始
        resize();
        document.getElementById("touchview").style.display="none";
        /*
        //将bgm连接至AudioContext
        var bgmobj = document.getElementById("bgmmp3");
        bgmsource.connect(audiocontext.destination);
        */
        //初始化数组
        for (i = 0; i < 9; i++) {
            currentdrawingnotes[i] = {};
        }
        //创建touch检测
        if(document.hasOwnProperty("ontouchstart")) {
            mycanvas.addEventListener("touchstart",canvastouchdown,false);
            mycanvas.addEventListener("touchend",canvastouchend,false); 
        } else {
            mycanvas.addEventListener("mousedown",canvastouchdown,false);
            mycanvas.addEventListener("mouseup",canvastouchend,false);
        }
        var mybody=document.getElementById("body");
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
        rankfade = -rankpritetime;
        fxsource = audiocontext.createBufferSource();
        fxsource.connect(audiocontext.destination);
        //开始播放bgm
        var source    = audiocontext.createBufferSource();
        source.buffer = bgmbuffer;
        source.connect(audiocontext.destination);
        source.addEventListener("ended",function(){ended=true},false);
        if (getQueryString("t")) {
            var inittime = parseInt(getQueryString("t"));
        } else {
            inittime = 0
        }
        source.start(0,inittime);
        //记录开始时间
        var d = new Date;
        starttime = d.getTime()-1000*inittime;
        //图像渲染第一帧
        //fpsview = document.getElementById("fpsview");
        //setInterval(oneframe, 10);
        requestAnimationFrame(oneframe);
    }

    function oneframe() {
        //渲染一帧
        //记录开始时间
        var d = new Date;
        var fstarttime = d.getTime() - starttime;
        currenttime    = fstarttime;
        frame += 1;
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
            return;
        }
        x1 = circle1.x - Math.sin(a) * circle1.r;
        y1 = circle1.y - Math.cos(a) * circle1.r;
        x2 = circle1.x + Math.sin(a) * circle1.r;
        y2 = circle1.y + Math.cos(a) * circle1.r;
        x3 = circle2.x + Math.sin(a) * circle2.r;
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
        maingraphics.lineWidth = 16  * (circle.r / 64)*p;
        maingraphics.closePath;
        maingraphics.stroke();
        if(fill){
            //填充长note的末尾
           // maingraphics.fillStyle="rgb(240,240,240)";
           // maingraphics.fill();
        }
    }

    function drawhitsprite(lane)
    {

        //透明渐变太费性能，转用图片来实现

        //画hit的反馈效果
        var targetcircle=getcircle(0,lane);
        var offsettime=currenttime-hitsprite[lane];
        var grd=maingraphics.createRadialGradient(targetcircle.x,targetcircle.y,p*64*offsettime/hitspritetime,targetcircle.x,targetcircle.y,p*64*(offsettime/hitspritetime+2));
        
        var alpha=(1-offsettime/hitspritetime);
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
        maingraphics.fillStyle = "rgba(255,255,255,"+(1-offset)+")";
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
        //获取圆的相关信息
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
            r = 0;
        }
        circler = r * 64 * p ;
        angle   = 22.5 * lane;
        x = 512 - r * 425 * Math.cos(angle / 180 * Math.PI);
        y = 170 + r * 425 * Math.sin(angle / 180 * Math.PI);
        var result = new Object;
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

    function canvastouchdown(evt) {
        //响应canvas的touchstart事件
        var x,y;
        if(evt.changedTouches){
            for( i=0; i< evt.changedTouches.length;i++)
            {
                x = evt.changedTouches[i].pageX;
                y = evt.changedTouches[i].pageY;
                var lane=laneofpos(x,y);
                if(lane>=0){
                    touchdown(laneofpos(x,y));
                }
            }
        } else {
            x=evt.pageX;
            y=evt.pageY;
            var lane=laneofpos(x,y);
            if(lane>=0){
                touchdown(laneofpos(x,y));
            }
        }
    }

    function canvastouchend(evt) {
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
        } else {
            x=evt.pageX;
            y=evt.pageY;
        }
        var lane=laneofpos(x,y);
        if(lane>=0){
            touchup(laneofpos(x,y));
        }
    }

    //加入键盘响应
    function keydown(evt) {
        var keychar=String.fromCharCode(evt.keyCode);
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

    function keyup(evt) {
        var keychar=String.fromCharCode(evt.keyCode);
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

    function laneofpos(x,y) {
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
            return Math.round(angle/0.125/Math.PI);
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
        for( var i=0 ; i<currentdrawingnotes[lane].length;i++){
            tempoffset=currentdrawingnotes[lane][i].starttime-currenttime;
            if (Math.abs(tempoffset)<=minoffset){

                minoffset=tempoffset;
                minindex=i;
            }
        }

        var offset = minoffset;
        if (Math.abs(offset) > responsetime * 128 / speed) {
            return;
        }
        if (note.longnote == true) {
            note.hold = true;
            ranknote(offset, 0,lane);
        } else {
            //如果是短note就从绘图列表里删除
            currentdrawingnotes[lane].splice(i,1);
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
            ranknote(offset,1,lane);
        }
    }

    //countcombo表示是否增加combo数，当为longnote的starttime时为0，其他为1

    function ranknote(offsettime,countcombo,lane) {
        hitsprite[lane]=currenttime;
        totaldelay += offsettime;
        totaloffset += Math.abs(offsettime);
        noteslength += 1;
        var delay=Math.abs( offsettime*128/speed);
        if(delay<=responsetime * 0.25){
            perfect();
            combo(countcombo);
        } else if (delay <= responsetime *0.5) {
            great();
            combo(countcombo);
        } else if (delay <= responsetime *0.75) {
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

    function playsound(soundbuffer) {
        //播放音效
        if (currenttime-lastplaytime<50){
            return;
        }
        lastplaytime=currenttime;
        fxsource=audiocontext.createBufferSource();
        fxsource.connect(audiocontext.destination);
        fxsource.buffer = soundbuffer;
        /*
        fxsource.onended=function(){
            fx.disconnect(audiocontext.destination);
        }
        */
        fxsource.start(0);
    }

    function showresult() {
        var resultdiv = document.getElementById("result");
        resultdiv.style.display = "initial";
        document.getElementById("maxcombo").innerHTML = "MaxCombo:" + maxcombo;
        document.getElementById("perfectc").innerHTML = "Perfect:"  + perfectcount;
        document.getElementById("greatc").innerHTML   = "Great:"    + greatcount;
        document.getElementById("goodc").innerHTML    = "Good:"     + goodcount;
        document.getElementById("badc").innerHTML     = "Bad:"      + badcount;
        document.getElementById("missc").innerHTML    = "Miss:"     + misscount;
        document.getElementById("delayc").innerHTML   = "平均打击延迟:" + Math.round(totaldelay * 10 / noteslength) / 10  + "毫秒";
        document.getElementById("offsetc").innerHTML  = "平均打击误差:" + Math.round(totaloffset * 10 / noteslength) / 10 + "毫秒";
    }
    
    //LLpractice.js的初步模块化
    var LLpractice=function(){
        return {
            init : function(hitmap,bgm){
                hitmapfile = hitmap||null;
                bgmpath = bgm||null;
                init();
            },
            resize : function(){
                resize();
            },
            start : function(){
                start();
            }
        };
    }
    window.LLpractice=LLpractice();

}));
