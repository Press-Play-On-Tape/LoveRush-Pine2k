if( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

//window(0, 0, 220, 176);
//tileshift(2, 0);

var PlayerX = 60;
var PlayerY = 40;

var enemiesX = new Array(5);
var enemiesY = new Array(5);
var enemiesD = new Array(5);  // Direction where 0 = left, 1 = straight fown, 2 = right
var enemiesL = new Array(5);  // Length of travel

var bgLX = 0;
var bgLY = 0;
var TopbgLX = 0;
var TopbgLY = 0;
var Level = 1;
var score = 0;
var lives = 3;
var ShipAnim = 0;

const PlayerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const PlayerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const PlayerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow

const Enemy1 = file("Enemy1", 0); // load the enemy gfx

const Heart_f1 = file("Heart_f1", 0); // load the heart gfx
const Heart_f2 = file("Heart_f2", 0); // load the heart gfx
const Heart_f3 = file("Heart_f3", 0); // load the heart gfx
const Heart_f4 = file("Heart_f4", 0); // load the heart gfx

const bgL = file("bgL",0); // load the Left Background bottom layer image
const TopBgL = file("TopBgL",0); // load the Left Background Top layer image



// Position enemies before start of game ..

for (var i = 0; i < length(enemiesY); ++i) {
    enemiesY[i] = -random((i * 40), (i * 40) + 40);
    enemiesX[i] = random(20, 190);
    enemiesD[i] = random(0, 3);
    enemiesL[i] = random(20, 40);
}

// function collide(x1, y1, w1, h1, x2, y2, w2, h2) {
    
//   return !(x2       >= x1 + w1  ||
//            x2 + w2  <= x1       ||
//            y2       >= y1 + h1  ||
//            y2 + h2  <= y1);
                
// }

function collision(x1, y1, x2, y2) {
    
    return !((x2       >= (x1 + w1))  ||
             ((x2 + 16)  <= x1)       ||
             (y2       >= (y1 + h1))  ||
             ((y2 + 16)  <= y1));

}

function waitForInput() {
    if((pressed("UP")) && (PlayerY > 2))
        PlayerY-=2;
    if((pressed("DOWN")) && (PlayerY < 160))
        PlayerY+=2;
    if((pressed("LEFT")) && (PlayerX > 20))
        PlayerX-=2;
    if((pressed("RIGHT")) && (PlayerX < 190))
        PlayerX+=2;
    //if(justPressed("B")){
    //    Shoot();
    //}
    if(pressed("C"))
        exit();
}

function bgScroll() {
    for(var yOffset = 0; yOffset < 4; ++yOffset){
        var y = yOffset * 110 + bgLY - 220; 
        mirror(false); sprite(16, y, bgL); 
        mirror(true);  sprite(172, y, bgL);
    }
    
    mirror(false); sprite(TopbgLX, TopbgLY-220, TopBgL);
    sprite(TopbgLX, TopbgLY, TopBgL);
    
    mirror(true);
    sprite(TopbgLX+188, TopbgLY, TopBgL);
    sprite(TopbgLX+188 ,TopbgLY - 220, TopBgL);
    mirror(false);
    
    bgLY+=2;
    if(bgLY > 200) {bgLY = 0}
    TopbgLY+=4;
    if(TopbgLY > 200) {TopbgLY = 0}
}

function EnemySpawn(enemyIndex)
{
    enemiesY[enemyIndex] = -random(20, 60);
    enemiesX[enemyIndex] = random(30, 180);
    enemiesD[enemyIndex] = random(0, 3);
    enemiesL[enemyIndex] = random(20, 40);
}


function EnemyUpdate(i)
{

        var minDirection = 0;
        var maxDirection = 2;
        var newDirection = 0; // 0 false, 1 true


        // // Move Enemies ..
        
        enemiesY[i]+=2;

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
        
        if (enemiesY[i] > 176) { EnemySpawn(i); }


        // Render enemy ..

        sprite(enemiesX[i], enemiesY[i], Enemy1);
        
        
        // Have we collided?
        
        var collide = collision(PlayerX, PlayerY, enemiesX[i], enemiesY[i]);
        
        if (collide) {
            
             console("collision");
            
        }
    
}

function update()
{

    fill(65)
    bgScroll();
    waitForInput();
    ShipAnim++;
    if((ShipAnim/3)%2==0)
        sprite(PlayerX, PlayerY, PlayerShip_F1);
    else
        sprite(PlayerX, PlayerY, PlayerShip_F2);
    sprite(PlayerX+20, PlayerY+20, PlayerShip_shadow);
    
    for(var i = 0; i< length(enemiesY); ++i) {
        EnemyUpdate(i);
    }
}