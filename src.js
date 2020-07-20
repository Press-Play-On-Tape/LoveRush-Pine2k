if ( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

var playerX = 60;
var playerY = 140;
var level = 4;

const NUMBER_OF_ENTITIES = 10;
const NUMBER_OF_HEARTS = 4;

const enemiesX = new Array(NUMBER_OF_ENTITIES);
const enemiesY = new Array(NUMBER_OF_ENTITIES);
const enemiesD = new Array(NUMBER_OF_ENTITIES);  // Direction where 0 = left, 1 = straight fown, 2 = right
const enemiesL = new Array(NUMBER_OF_ENTITIES);  // Length of travel

const bulletsX = new Array(NUMBER_OF_ENTITIES);
const bulletsY = new Array(NUMBER_OF_ENTITIES);

const heartsX = new Array(NUMBER_OF_HEARTS);
const heartsY = new Array(NUMBER_OF_HEARTS);

var bgLY = 0;
var topBgLY = 0;
var score = 0;
var lives = 5;
var shipAnim = 0;

const HUD_BG = file("HUD_BG", 0); 
const playerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const playerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const playerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow
const Bullet = file("Bullet", 0); // Bullet

const enemyImg = file("Enemy", 0); // load the enemy gfx
const heartImg = builtin("sHeart"); //Hearts for lives

const bgL = file("bgL", 0); // load the Left Background bottom layer image
const bgR = file("bgR", 0); // load the right Background bottom layer image
const topBgL = file("TopBgL",0); // load the Left Background Top layer image
const topBgR = file("TopBgR",0); // load the right Background Top layer image


//------------------------------------------------------------------------

// Position enemies and bullets before start of game ..

music("lrmusic.raw");

for (var i = 0; i < NUMBER_OF_ENTITIES; ++i) {
    bulletsY[i] = -5;
    enemySpawn(i);
    if (i < 4) heartSpawn(i);
}



//------------------------------------------------------------------------


function enemyHitBullet(enemyIndex, bulletIndex) {
    
    score += 5;
    enemySpawn(enemyIndex - 1);
    bulletsY[bulletIndex >> 4 - 1] = -5;    
    
}

function playerHitHeart(playerIndex, heartIndex) {
    
    score += 20;
    heartSpawn(heartIndex >> 8 - 1);
    bulletsY[bulletIndex >> 4 - 1] = -5;    
    
}

function enemyHitPlayer(enemyIndex, playerIndex) {
    
    io("VOLUME", 127);
    io("DURATION", 70);
    sound(random(44, 47));
    enemySpawn(enemyIndex - 1);
    lives -=1;
    
    if (lives < 1) {
        highscore(score);
        exit();
    }
    
}

function moveBullet(bulletIndex) {

    if (bulletsY[bulletIndex] > 0) {
        
        bulletsY[bulletIndex]-=5;  
        io("COLLISION", (1 + bulletIndex) << 4, 0x0F, enemyHitBullet);
        sprite(bulletsX[bulletIndex], bulletsY[bulletIndex], Bullet);
    }
    
}

function moveHeart(heartIndex) {


    // Move down ..

    var y = heartsY[heartIndex]+=2;


    if (y > 176) {
        heartSpawn(heartIndex);
    }


    // Render enemy ..

    io("COLLISION", (heartIndex + 1) << 8, 1024, playerHitHeart);
    sprite(heartsX[heartIndex], heartsY[heartIndex], heartImg);
    
}

function moveEnemy(enemyIndex) {

    var minDirection = 0;
    var maxDirection = 2;
    var newDirection = false;


    // Move down ..

    var y = enemiesY[enemyIndex]+= (2 + (enemyIndex / 3));
    
    if (y > 176) {
        enemySpawn(enemyIndex);
    }


    // Move left ..
    
    var direction = enemiesD[enemyIndex];
    var enemyX = enemiesX[enemyIndex];
    
    if (direction == 0) {
        if (enemyX > 30) {
            enemiesX[enemyIndex] -= 2;
        }
        else {
            minDirection = 2;
            newDirection = true;
        }
    }

    // Move right ..
    
    if (direction == 2) {
        if (enemyX < 200) {
            enemiesX[enemyIndex] += 2;
        }
        else {
            maxDirection = 1;
            newDirection = true;
        }
    }

    var length = --enemiesL[enemyIndex];


    // New Direction?

    if (length == 0 || newDirection == true) {
        enemiesD[enemyIndex] = random(minDirection, maxDirection + 1);
        enemiesL[enemyIndex] = random(16, 32);
    }


    // Render enemy ..

    io("COLLISION", enemyIndex + 1, 0);
    sprite(enemiesX[enemyIndex], enemiesY[enemyIndex], enemyImg);

}


function enemySpawn(enemyIndex) {

    enemiesY[enemyIndex] = -random(16, 64);
    enemiesX[enemyIndex] = random(32, 192);
    enemiesD[enemyIndex] = random(0, 3);
    enemiesL[enemyIndex] = random(16, 32);

}

function heartSpawn(heartIndex) {

    heartsY[heartIndex] = -random(0, 128);
    heartsX[heartIndex] = random(32, 192);

}

function fireBullet() {
    
    for (var i = 0; i < NUMBER_OF_ENTITIES; ++i) {
        
       if (bulletsY[i] <= 0) {
            bulletsX[i] = playerX + 6;          
            bulletsY[i] = playerY - 2;   
            break;
       }
       
    }
    
}

function bgScroll() {
    
    for(var yOffset = -220; yOffset < (8 * 55 - 220); yOffset += 55) {
        
        var y = yOffset + bgLY; 
        sprite(32, y, bgL); 
        sprite(172, y, bgR);
        
        y = yOffset + topBgLY; 
        sprite(0, y, topBgL); 
        sprite(188, y, topBgR);
        
    }
    
    bgLY+=2;
    if (bgLY > 55)      {bgLY = 0;}
    topBgLY+=4;
    if (topBgLY > 55)   {topBgLY = 0;}
}

function waitForInput() {
    
    if ((pressed("UP")) && (playerY > 18))           playerY-=2;
    if ((pressed("DOWN")) && (playerY < 160))        playerY+=2;
    if ((pressed("LEFT")) && (playerX > 20))         playerX-=2;
    if ((pressed("RIGHT")) && (playerX < 190))       playerX+=2;
    
    if (justPressed("A"))                            fireBullet();
    if (pressed("C"))                                exit();
    
}

function HUD() {
    
    sprite(0, 0, HUD_BG);

    for(var i=0; i<lives; ++i) {
        sprite(110 + (i * 8), 4, heartImg);
    }
    
    color(7);
    cursor(8,4)
    print(("SCORE ")); 
    print(score);
    color(0);
}


function update() {

    fill(65)

    bgScroll();
    waitForInput();

    if (score > 240)        level = 10;
    else if (score > 140)   level = 8;
    else if (score > 40)    level = 6;

    for(var i = 0; i< level; ++i)
        moveEnemy(i);

    for(var i = 0; i < level; ++i)
        moveBullet(i);

    ++shipAnim;
    
    io("COLLISION", 1024, 0x0F, enemyHitPlayer);
    if ((shipAnim/4)%2==0)
        sprite(playerX, playerY, playerShip_F1);
    else
        sprite(playerX, playerY, playerShip_F2);

    sprite(playerX+20, playerY+20, playerShip_shadow);

    for(var i = 0; i < NUMBER_OF_HEARTS; ++i)
        moveHeart(i);
        
    HUD();
}
