if( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

//window(0, 0, 220, 176);
//tileshift(2, 0);

var PlayerX = 60;
var PlayerY = 140;

var enemiesX = new Array(4);
var enemiesY = new Array(4);
var enemiesD = new Array(4);  // Direction where 0 = left, 1 = straight fown, 2 = right
var enemiesL = new Array(4);  // Length of travel
var enemiesS = new Array(4);  // Speed, 2 slow - 5 fastest

var bulletsX = new Array(4);
var bulletsY = new Array(4);

var bgLX = 0;
var bgLY = 0;
var TopbgLX = 0;
var TopbgLY = 0;
var Level = 1;
var score = 0;
var lives = 3;
var ShipAnim = 0;

const HUD_BG = file("HUD_BG", 0); // load the ship frame1
const PlayerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const PlayerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const PlayerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow
const Bullet = file("Bullet", 0); // Bullet

const Enemy1 = file("Enemy1", 0); // load the enemy gfx

const heart = builtin("sHeart"); //Hearts for lives

const Heart_f1 = file("Heart_f1", 0); // load the heart gfx
const Heart_f2 = file("Heart_f2", 0); // load the heart gfx
const Heart_f3 = file("Heart_f3", 0); // load the heart gfx
const Heart_f4 = file("Heart_f4", 0); // load the heart gfx

const bgL = file("bgL",0); // load the Left Background bottom layer image
const TopBgL = file("TopBgL",0); // load the Left Background Top layer image



// Position enemies before start of game ..

for (var i = 0; i < 4; ++i) {
    EnemySpawn(i, (i * 40), (i * 40) + 40);
    bulletsY[i] = -5;
}

function fireBullet() {
    for (var i = 0; i < 4; ++i) {
       if (bulletsY[i] < 0) {
            bulletsX[i] = PlayerX + 7;          
            bulletsY[i] = PlayerY - 2;   
            break;
       }
    }
}

function moveBullet(bulletIndex) {
   if (bulletsY[bulletIndex] > 0) {
        bulletsY[bulletIndex]-=5;  
        sprite(bulletsX[bulletIndex], bulletsY[bulletIndex], Bullet);
        
        // Did we hit an enemy?
        for (var i = 0; i < 4; ++i) {
            if (collisionBullet(bulletsX[bulletIndex], bulletsY[bulletIndex], enemiesX[i], enemiesY[i])) {
               EnemySpawn(i, 20, 60);
               bulletsY[bulletIndex] = -5;
               break;
            }
        }
   }
}

function collisionBullet(bulletX, bulletY, x2, y2) {
    
    return !((x2       >= (bulletX + 4))  ||
             ((x2 + 16)  <= bulletX)       ||
             (y2       >= (bulletY + 4))  ||
             ((y2 + 16)  <= bulletY));

}


function collisionEnemy(x1, y1, x2, y2) {
    
    return !((x2       >= (x1 + 16))  ||
             ((x2 + 16)  <= x1)       ||
             (y2       >= (y1 + 16))  ||
             ((y2 + 16)  <= y1));

}

function waitForInput() {
    if((pressed("UP")) && (PlayerY > 18))
        PlayerY-=2;
    if((pressed("DOWN")) && (PlayerY < 160))
        PlayerY+=2;
    if((pressed("LEFT")) && (PlayerX > 20))
        PlayerX-=2;
    if((pressed("RIGHT")) && (PlayerX < 190))
        PlayerX+=2;
    if(justPressed("B")){
        fireBullet();
    }
    if(pressed("C"))
        exit();
}

// function bgScroll() {
//     for(var yOffset = 0; yOffset < 4; ++yOffset){
//         var y = yOffset * 110 + bgLY - 220; 
//         mirror(false); sprite(16, y, bgL); 
//         mirror(true);  sprite(172, y, bgL);
//     }
    
//     mirror(false); sprite(TopbgLX, TopbgLY-220, TopBgL);
//     sprite(TopbgLX, TopbgLY, TopBgL);
    
//     mirror(true);
//     sprite(TopbgLX+188, TopbgLY, TopBgL);
//     sprite(TopbgLX+188 ,TopbgLY - 220, TopBgL);
//     mirror(false);
    
//     bgLY+=2;
//     if(bgLY > 200) {bgLY = 0}
//     TopbgLY+=4;
//     if(TopbgLY > 200) {TopbgLY = 0}
// }

function EnemySpawn(enemyIndex, minY, maxY)
{
    enemiesY[enemyIndex] = -random(20, 60);
    enemiesX[enemyIndex] = random(30, 180);
    enemiesD[enemyIndex] = random(0, 3);
    enemiesL[enemyIndex] = random(20, 40);
    enemiesS[enemyIndex] = random(2, 5);
}


function EnemyUpdate(i) 
{

        var minDirection = 0;
        var maxDirection = 2;
        var newDirection = 0; // 0 false, 1 true


        // // Move Enemies ..
        
        enemiesY[i]+=enemiesS[i];

        if (enemiesD[i] == 0) {
            if (enemiesX[i] > 30) {
                //console(enemiesX[i]);
                enemiesX[i] = enemiesX[i] - 2;
                //console(enemiesX[i]);
            }
            else {
                minDirection = 1;
                newDirection = 1;
            }
        }

        if (enemiesD[i] == 2) {
            if (enemiesX[i] < 200) {
                // console(enemiesX[i]);
                enemiesX[i] = enemiesX[i] + 2;//Right
                // console(enemiesX[i]);
            }
            else{
                maxDirection = 1;
                newDirection = 1;
            }
        }

        enemiesL[i] = enemiesL[i] - 1;


        // New Direction?

         if ((enemiesL[i] == 0) || (newDirection == 1)) {
             enemiesD[i] = random(minDirection, maxDirection + 1);
             enemiesL[i] = random(20, 40);
         }
        
        if (enemiesY[i] > 176) { EnemySpawn(i, 20, 60); }


        // Render enemy ..

        sprite(enemiesX[i], enemiesY[i], Enemy1);
        
        
        // Have we collided?
        
        var collide = collisionEnemy(PlayerX, PlayerY, enemiesX[i], enemiesY[i]);
        
        if (collide) {
            
             lives -=1;
             io("VOLUME", 127);
             io("DURATION", 70);
             sound(random(44, 47));
             //console("collision");
            
        }
    
}


function HUD()
{
       var x = 0;
       for( var counter = 0; counter < 28; ++counter ) { sprite(x, 0, HUD_BG); x += 8; }
           for(var i=0; i<lives; ++i)
        sprite(80 + (i * 8), 4, heart);
        cursor(60, 165);
        color(7);
        cursor(8,4)
        print(("SCORE")); color(0);
        color(7);
        cursor(50,4)
        print((SCORE)); color(0);
}

function update()
{

    fill(65)
    //bgScroll();
    waitForInput();

    for(var i = 0; i< 4; ++i) {
        EnemyUpdate(i);
        moveBullet(i);
    }
    
    
        ShipAnim++;
    if((ShipAnim/3)%2==0)
        sprite(PlayerX, PlayerY, PlayerShip_F1);
    else
        sprite(PlayerX, PlayerY, PlayerShip_F2);
    sprite(PlayerX+20, PlayerY+20, PlayerShip_shadow);
    HUD();
}