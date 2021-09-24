const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var score = 0;
var boardVerticalVelocity = 5;
var numberOfArrows = 10;
var board1, board2;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 100, 50, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 30, 150, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    330,
    playerBase.position.y - 112,
    100,
    100
  );

  board1 = new Board(width - 200, 200, 50, 175);
  board2 = new Board(width - 400, height - 300, 50, 175);
}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);

  
  playerArcher.display();

  board1.display();
  board2.display();
//title
fill("#FFFF");
textAlign("center");
textSize(40);
text("EPIC ARCHERY",width/2,100);

// score
fill("#FFFF");
textAlign("center");
textSize(30);
text("Score:"+score,width-200,100);

// Arrow count
fill("#FFFF");
textAlign("center");
textSize(30);
text("Remaining Arrows :"+ numberOfArrows,200,100);
  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

     //with distance formula
     d1 = dist(playerArrows[i].body.position.x,playerArrows[i].body.position.y,board1.body.position.x,board1.body.position.y);
     if(d1<=100){
       console.log("collision")
     }

     var board1Collision = Matter.SAT.collides(
       board1.body,
       playerArrows[i].body
     );

     var board2Collision = Matter.SAT.collides(
       board2.body,
       playerArrows[i].body
     );

     if(board1Collision.collided || board2Collision.collided){
       score +=5;
       console.log("yes");
     }

     

     if(numberOfArrows == 0){
       gameOver();
     }

}
  }
}
function keyPressed() {
  if (keyCode === 32) {
    if(numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -=1;
    }
  }
  }

function keyReleased() {
  if (keyCode === 32) {
    console.log("SpaceOut")

    if (playerArrows.length) {
      console.log("Space")
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameOver(){
  swal(
    {
      title: 'Game Over!!!',
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/PiratesInvasion/main/assets/board.png",
        imageSize: "150X150",
        comformButtonText: "Play Again"
    },
    function(isConfirm){
      if(isConfirm){
        location.reload();
      }
    }
  );
}


