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
const enemiesS = new Array(NUMBER_OF_ENTITIES);  // Speed, 2 slow - 5 fastest

const bulletsX = new Array(NUMBER_OF_ENTITIES);
const bulletsY = new Array(NUMBER_OF_ENTITIES);

const heartsX = new Array(NUMBER_OF_HEARTS);
const heartsY = new Array(NUMBER_OF_HEARTS);

var bgLY = 0;
var topbgLY = 0;
var Level = 1;
var score = 0;
var lives = 5;
var shipAnim = 0;

const HUD_BG = file("HUD_BG", 0); 
const PlayerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const PlayerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const PlayerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow
const Bullet = file("Bullet", 0); // Bullet

const Enemy1 = file("Enemy1", 0); // load the enemy gfx
const heart = builtin("sHeart"); //Hearts for lives

const bgL = file("bgL", 0); // load the Left Background bottom layer image
const bgR = file("bgR", 0); // load the right Background bottom layer image
const TopBgL = file("TopBgL",0); // load the Left Background Top layer image
const TopBgR = file("TopBgR",0); // load the right Background Top layer image


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

    heartsY[heartIndex]+=2;


    if (heartsY[heartIndex] > 176) {
        heartSpawn(heartIndex);
    }


    // Render enemy ..

    io("COLLISION", (heartIndex + 1) << 8, 1024, playerHitHeart);
    sprite(heartsX[heartIndex], heartsY[heartIndex], heart);
    
}

function enemySpawn(enemyIndex) {

    enemiesY[enemyIndex] = -random(20, 60);
    enemiesX[enemyIndex] = random(30, 180);
    enemiesD[enemyIndex] = random(0, 3);
    enemiesL[enemyIndex] = random(20, 40);
    enemiesS[enemyIndex] = random(2, 5);

    
}

function moveEnemy(enemyIndex) {

    var minDirection = 0;
    var maxDirection = 2;
    var newDirection = false;


    // Move down ..

    enemiesY[enemyIndex]+=enemiesS[enemyIndex];


    //Move left ..
    
    if (enemiesD[enemyIndex] == 0) {
        if (enemiesX[enemyIndex] > 30) {
            enemiesX[enemyIndex] -= 2;
        }
        else {
            minDirection = 2;
            newDirection = true;
        }
    }

    // Move right ..
    
    if (enemiesD[enemyIndex] == 2) {
        if (enemiesX[enemyIndex] < 200) {
            enemiesX[enemyIndex] += 2;
        }
        else {
            maxDirection = 1;
            newDirection = true;
        }
    }

    --enemiesL[enemyIndex];


    // New Direction?

    if ((enemiesL[enemyIndex] == 0) || (newDirection == true)) {
        enemiesD[enemyIndex] = random(minDirection, maxDirection + 1);
        enemiesL[enemyIndex] = random(20, 40);
    }
    
    if (enemiesY[enemyIndex] > 176) {
        enemySpawn(enemyIndex);
    }


    // Render enemy ..

    io("COLLISION", enemyIndex + 1, 0);
    sprite(enemiesX[enemyIndex], enemiesY[enemyIndex], Enemy1);

}

function heartSpawn(heartIndex) {

    heartsY[heartIndex] = -random(0, 70);
    heartsX[heartIndex] = random(30, 180);

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
        // mirror(false); sprite(32, y, bgL); 
        // mirror(true);  sprite(172, y, bgL);
        sprite(32, y, bgL); 
        sprite(172, y, bgR);
        
        var y2 = yOffset + topbgLY; 
        // mirror(true);  sprite(188, y2, TopBgL);
        // mirror(false); sprite(0, y2, TopBgL); 
        sprite(0, y2, TopBgL); 
        sprite(188, y2, TopBgR);
        
    }
    
    bgLY+=2;
    if(bgLY > 55) {bgLY = 0;}
    topbgLY+=4;
    if(topbgLY > 55) {topbgLY = 0;}
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
        sprite(110 + (i * 8), 4, heart);
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

    if (score > 120)        level = 10;
    else if (score > 80)    level = 7;
    else if (score > 40)    level = 4;
    else level = 4;

    for(var i = 0; i< level; ++i)
        moveEnemy(i);

    for(var i = 0; i < level; ++i)
        moveBullet(i);

    //++shipAnim;
    
    io("COLLISION", 1024, 0x0F, enemyHitPlayer);
    //if ((shipAnim/4)%2==0)
        sprite(playerX, playerY, PlayerShip_F1);
    //else
    //    sprite(playerX, playerY, PlayerShip_F2);

    sprite(playerX+20, playerY+20, PlayerShip_shadow);

    for(var i = 0; i < NUMBER_OF_HEARTS; ++i)
        moveHeart(i);
        
    HUD();
}
