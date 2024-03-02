var num_cli = 0;
var obj1, obj2, obj0;
var n = 4;
var imgdir = "../img/";
function initial() {

    document.write("<link href='../css/1.css' rel='stylesheet' type='text/css' />");
    //document.write("<div  id='debug_info'><h1 >  debug imformation </h1></div>");
    document.write("<div  id='layout'>");
    var i, j;
    //生成连连看布局
    for (i = 0; i <= n + 1; i++) {
        for (j = 0; j <= n + 1; j++) {
            k = parseInt(10 * Math.random());
            imgpath = imgdir + k + ".jpg";
            str_element = "<img id=" + (i * (n + 2) + j) + " src=" + imgpath + " onmousedown='myclick(event)' class='img'/>";
            if (i == 0 || j == 0 || i == n + 1 || j == n + 1)
                str_element = "<img id=" + (i * (n + 2) + j) + " src='../img/20.gif' width=0 height=0 dispaly='hidden'/>";
            document.write(str_element);
        }
        document.write("<br/>");
    }
    //声音
    document.write("</div>");
    //声音1，消掉两个相同图片
    document.write("<audio id='audio_choral1' src='../sound/boom.mp3' >the browser doesn't support</audio>");
    //声音2，按错提示音
    document.write("<audio id='audio_choral2' src='../sound/eroor.mp3' >the browser doesn't support</audio>");
    //设置背景音乐
    document.write("<br/><div class='ad'><audio class='au' id='mybgsound'src='../sound/background.mp3' autoplay='autoplay' loop='loop' volume=0.2 controls >the browser doesn't support</audio><div>");
    //设置背景音乐声音
    document.getElementById("mybgsound").volume = 0.2;
    obj0 = document.getElementById(0);
    // document.write("<embed height='150' width='310' src='music/1.mp3' />");
}
//处理点击事件
function myclick(myevent) {
    //alert("myclick myevent");
    //得到被点击的对象
    event.cancelBubble = true;
    obj = document.elementFromPoint(myevent.clientX, myevent.clientY);
    id_obj = obj.id;
    //得到点击对象的行号与列号 并给出提示信息
    /*row=parseInt(id_obj/n);
    col=id_obj%n;
    document.getElementById("debug_info").innerHTML = row + " " + col + "; " + obj + " name:" + obj.name + " id:" + obj.id + " x:" + myevent.clientX + " y:" + myevent.clientY + " " + obj.src;
    if (obj.src == obj0.src)
    {return;}*/
    //判断当前是第几次点击
    if (num_cli == 0)//点击的第1张图片，设置为点击状态
    {
        obj1 = obj;
        num_cli = 1;
        //obj1.class="img_selected";
    }
    else//点击的是第二张图片，送入判断逻辑
    {
        obj2 = obj;
        num_cli = 0;
        if (obj2 == obj1)
            return;
        res = judgeSame(obj1, obj2);
        //alert(res);
        soundRespond(res);
        if (res == 1) {
            obj1.src = obj0.src;
            obj2.src = obj0.src;//"p.jpg";
        }
        //judgeHealth();
    }
    judgeHealth();
}
function mymin(num1, num2) {
    if (num1 < num2)
        return num1;
    return num2;
}
function mymax(num1, num2) {
    if (num1 > num2)
        return num1;
    return num2;
}
function judgeHealth() {
    //alert("judgeHealth");
    flagGameOver = 1;
    for (i = 1; i <= n; i++) {
        if (flagGameOver == 0)
            break;
        for (j = 1; j <= n; j++) {
            tempId = i * (n + 2) + j;
            tempObj = document.getElementById(tempId);
            if (tempObj.src != obj0.src) {
                flagGameOver = 0;
                break;
            }
        }
    }
    if (flagGameOver == 1) { alert("恭喜过关"); retun; }
    //还没有过关，判断棋盘是否健康（有图可消）
    flagGameHealthy = 0;
    for (i = 1; i <= n; i++) {
        if (flagGameHealthy == 1)
            return 1;//break;
        for (j = 1; j <= n; j++) {
            tempId1 = i * (n + 2) + j;
            tempObj1 = document.getElementById(tempId1);
            if (tempObj1.src == obj0.src)
                continue;
            for (ii = i; ii <= n; ii++) {
                for (jj = 1; jj <= n; jj++) {
                    if (ii == i && jj == j)
                        continue;
                    tempId2 = ii * (n + 2) + jj;
                    tempObj12 = document.getElementById(tempId2);
                    if (tempObj1.src == obj0.src)
                        continue;
                    if (judgeSame(tempObj1, tempObj12) == 1) {
                        flagGameHealthy = 1;
                        return 1;
                    }
                }
            }
        }
    }
    if (flagGameHealthy == 0) {
        //alert("没有可以消掉的图片");
        shuffle();
        judgeHealth();
    }
}
function shuffle() {
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            tempId = i * (n + 2) + j;
            tempObj = document.getElementById(tempId);
            if (tempObj.src != obj0.src) {
                k = parseInt(10 * Math.random());
                imgpath = imgdir + k + ".jpg";
                tempObj.src = imgpath;
            }
        }
    }
}
//判断两张图片是否可以消掉
function judgeSame(o1, o2) {
    //两张图片必须是同样的图片    
    if (o1.src != o2.src) {
        return 0;
    }
    row1 = parseInt(o1.id / (n + 2));
    col1 = parseInt(o1.id % (n + 2));
    row2 = parseInt(o2.id / (n + 2));
    col2 = parseInt(o2.id % (n + 2));

    obj0 = document.getElementById(0);
    //判断两张图片是否可以通过某一行可达

    throughFlag = 0;
    for (row = 0; row <= n + 1; row++) {
        //两个图片都可以列到达row行，设标志位flag，=1表示可达，=0表示不可达
        flag = 1;
        //第row行，列通过
        for (col = mymin(col1, col2); col <= mymax(col1, col2); col++) {
            if (row == row1 && col == col1)
                continue;
            if (row == row2 && col == col2)
                continue;
            //路径上的一个图片，图片的行号为row，列号为col
            cur_id = (n + 2) * row + col;
            obj = document.getElementById(cur_id);
            //该位置不为空
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        if (flag == 0)
            continue;
        //第row行，1列通过
        for (row_temp = mymin(row, row1); row_temp <= mymax(row, row1); row_temp++) {
            if (row_temp == row1)
                continue;
            cur_id = (n + 2) * row_temp + col1;
            obj = document.getElementById(cur_id);
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        if (flag == 0)
            continue;
        //第row行，2列通过
        for (row_temp = mymin(row, row2); row_temp <= mymax(row, row2); row_temp++) {
            if (row_temp == row2)
                continue;
            cur_id = (n + 2) * row_temp + col2;
            obj = document.getElementById(cur_id);
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        //找到一条可行路径
        if (flag == 1) {
            throughFlag = 1;
            return 1;
            //break;
        }
    }
    //行列转换再次判断
    col1 = parseInt(o1.id / (n + 2));
    row1 = parseInt(o1.id % (n + 2));
    col2 = parseInt(o2.id / (n + 2));
    row2 = parseInt(o2.id % (n + 2));
    for (row = 0; row <= n + 1; row++) {
        flag = 1;
        for (col = mymin(col1, col2); col <= mymax(col1, col2); col++) {
            if (row == row1 && col == col1)
                continue;
            if (row == row2 && col == col2)
                continue;
            cur_id = (n + 2) * col + row;
            obj = document.getElementById(cur_id);
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        if (flag == 0)
            continue;
        for (row_temp = mymin(row, row1); row_temp <= mymax(row, row1); row_temp++) {
            if (row_temp == row1)
                continue;
            cur_id = (n + 2) * col1 + row_temp;
            obj = document.getElementById(cur_id);
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        if (flag == 0)
            continue;
        for (row_temp = mymin(row, row2); row_temp <= mymax(row, row2); row_temp++) {
            if (row_temp == row2)
                continue;
            cur_id = (n + 2) * col2 + row_temp;
            obj = document.getElementById(cur_id);
            if (obj.src != obj0.src) { flag = 0; break; }
        }
        if (flag == 1) {
            throughFlag = 1;
            return 1;
            break;
        }
    }
    return 0;
}
function soundRespond(flagThrough) {
    var tempaudio;
    if (flagThrough == 0)
        tempaudio = document.getElementById("audio_choral2");
    else
        tempaudio = document.getElementById("audio_choral1");
    tempaudio.currentTime = 0;
    tempaudio.play();
}