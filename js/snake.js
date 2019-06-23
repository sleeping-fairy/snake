// 需要有一个构造函数 来产生食物
// 食物有大小 颜色 位置 构造函数的属性
// 方法：需要在地图上将食物渲染出来

function Food(){
  this.width = 20;   // 宽度
  this.height = 20;  // 高度
  this.bgColor = "green";  // 颜色
  this.position = "absolute";  //绝对定位
  this.left = 0;  
  this.top = 0;  

  // 定义一个标记用于表示食物是否创建了 如果创建了 食物就不创建
  this.div = null;
}

// 给food构造函数的原型对象添加一个方法
// 需要在地图上将食物渲染出啦
Food.prototype.render = function(mapObj){
  // 创建一个div标签
  // 先判断this.div的值是否为null 
  if(this.div == null){
    this.div = document.createElement("div");
  }

 
  this.div.style.width = this.width + 'px';
  this.div.style.height = this.height + 'px';
  this.div.style.backgroundColor = this.bgColor;
  this.div.style.position = this.position;

  // this.left 它的值是通过下面的随机函数出现的
  var maxWidth = mapObj.offsetWidth / this.width - 1;
  var maxHeight = mapObj.offsetHeight / this.height - 1;
  // console.log(maxWidth,maxHeight);
  
  this.left = getRandom(0,maxWidth);
  this.top = getRandom(0,maxHeight);

  this.div.style.left = this.left * this.width + 'px';
  this.div.style.top = this.top * this.height + 'px';
  
  // 节点操作：将创建的 标签追加到某个元素里面  对象.appendChild(要追加的节点)
  mapObj.appendChild(this.div);

  
}

// 定义一个产生随机数的函数
function getRandom(min,max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// 获取id=map这个标签
var map = document.querySelector('#map');


// 通过food构造 函数 实例化一个对象
var food = new Food();
food.render(map);

// 创建生产蛇的构造函数
function Snake(){
  this.width = 20;   // 每一个蛇节的宽度
  this.height = 20;  // 每一个蛇节的高度
  this.position = "absolute";  //绝对定位

  // 定义一个属性用来保存蛇头移动
  this.direction = "right";


  // 定义一个数组来保存蛇节的信息，数组里面的每一个元素有事一个对象
  this.body = [
    {x:4, y:2, color:'red', isCreate: null },   // 0下标这个信息是蛇头
    {x:3, y:2, color:'blue', isCreate: null },  // 1下标这个信息是蛇身
    {x:2, y:2, color:'blue', isCreate: null },  // 2下标这个信息是蛇尾
  ];
}

Snake.prototype.render = function(mapObj){

  for(var i = 0; i < this.body.length; i++){
    // 判断每一个对象里面的isCreate属性的值是不是null  如果是null就不创建了
    if(this.body[i].isCreate == null){
      // 如果没有创建就把当前的这个创建的div节点赋值给这个变量
      this.body[i].isCreate = document.createElement("div");
    }


    
    this.body[i].isCreate.style.width = this.width + 'px';
    this.body[i].isCreate.style.height = this.height + 'px';
    this.body[i].isCreate.style.position = this.position;
    this.body[i].isCreate.style.left = this.body[i].x * this.width + 'px';
    this.body[i].isCreate.style.top = this.body[i].y * this.width + 'px';
    this.body[i].isCreate.style.backgroundColor = this.body[i].color;

    // 将创建的this.div追加到mapObj这个对象里面去
    mapObj.appendChild(this.body[i].isCreate);

  }
}

// 定义一个方法让蛇移动  蛇的移动是靠身体将蛇往前推动
Snake.prototype.move = function(food,map){
  // 遍历this.body数组 应该是将后一个蛇节的位置变成前一个蛇节的位置
  for(var i = this.body.length - 1; i > 0; i--){
    this.body[i].x = this.body[i - 1].x;
    this.body[i].y = this.body[i - 1].y;
  }
  
  // 然后再去移动蛇头
  switch(this.direction){
    case "right":
    this.body[0].x += 1;  //向右走
    break;
    case "left":
    this.body[0].x -= 1;  //向左走
    break;
    case "up":
    this.body[0].y -= 1;  //向上走
    break;
    case "down":
    this.body[0].y += 1;  //向下走
    break;
  }

  // 让蛇去吃食物 如果蛇头的坐标等于食物的x坐标 并且 

  if(this.body[0].x == food.left && this.body[0].y == food.top){
    // 蛇吃到了食物  蛇身变长 食物重新出现
      var last = this.body[this.body.length - 1];
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color,
        isCreate: null
      });

      // 需要在地图上将食物重新渲染
      food.render(map);
  }
}



var snake = new Snake();
snake.render(map);


// 设置一个定时器  只想让它只有一条蛇 让蛇不停的移动
var timerId = setInterval(function(){
  snake.move(food,map);
  // 控制蛇活动的范围

  var maxWidth = map.offsetWidth / food.width - 1;
  var maxHeight = map.offsetHeight / food.height - 1;

  if(snake.body[0].x < 0 || snake.body[0].y < 0 ||snake.body[0].x > maxWidth || snake.body[0].y > maxHeight){
    alert("游戏结束");
    clearInterval(timerId);
    return;
  }

  
  snake.render(map);
},300);

// 给文档注册onkeydown事件 需要获取键盘的keycode  需要用到事件对象
document.onkeydown = function(e){
  e = window.event || e;
  var keycode = e.keyCode;
  switch(keycode){
    case 39:
    snake.direction = 'right';
       break;
    case 37:
    snake.direction = 'left';
       break;
    case 38:
    snake.direction = 'up';
       break;
    case 40:
    snake.direction = 'down';
       break;


  }
}
