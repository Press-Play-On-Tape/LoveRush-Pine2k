if( file("images.res", 0) != 1 ){
    console("Could not find resources!");
    exit();
}

var PlayerX = 60;
var PlayerY = 140;
var level = 4;              // Starting level (also number of enemies / bullets cannot exceed NUMBER_OF_ENEMIES)

const NUMBER_OF_ENEMIES = 10;

var enemiesX = new Array(NUMBER_OF_ENEMIES);
var enemiesY = new Array(NUMBER_OF_ENEMIES);
var enemiesD = new Array(NUMBER_OF_ENEMIES);  // Direction where 0 = left, 1 = straight fown, 2 = right
var enemiesL = new Array(NUMBER_OF_ENEMIES);  // Length of travel
var enemiesS = new Array(NUMBER_OF_ENEMIES);  // Speed, 2 slow - 5 fastest

var bulletsX = new Array(NUMBER_OF_ENEMIES);
var bulletsY = new Array(NUMBER_OF_ENEMIES);

var BGchange = 65;
var bgLY = 0;
var TopbgLX = 0;
var TopbgLY = 0;
var Level = 1;
var score = 0;
var lives = 5;
var ShipAnim = 0;
var bulletIndex;

const HUD_BG = file("HUD_BG", 0); // load the ship frame1
const PlayerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const PlayerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const PlayerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow
const Bullet = file("Bullet", 0); // Bullet

const Enemy1 = file("Enemy1", 0); // load the enemy gfx

const heart = builtin("sHeart"); //Hearts for lives

const bgL = file("bgL", 0); // load the Left Background bottom layer image
const TopBgL = file("TopBgL",0); // load the Left Background Top layer image

// Position enemies and bullets before start of game ..
music("lrmusic.raw");
for (var i = 0; i < NUMBER_OF_ENEMIES; ++i)
{
    bulletsY[i] = -5;
    EnemySpawn(i);
}

function fireBullet()
{
    for (var i = 0; i < level; ++i)
    {
       if (bulletsY[i] <= 0)
       {
            bulletsX[i] = PlayerX + 6;          
            bulletsY[i] = PlayerY - 2;   
            break;
       }
    }
}

function EnemyHitBullet(enemyIndex)
{
    score += 5;
    //BGchange +=1;
    EnemySpawn(enemyIndex - 1);
    bulletsY[bulletIndex] = -5;    
}

function moveBullet(bulletIndex)
{
    if (bulletsY[bulletIndex] > 0)
    {
        bulletsY[bulletIndex]-=5;  
        io("COLLISION", 0, -1, EnemyHitBullet);
        sprite(bulletsX[bulletIndex], bulletsY[bulletIndex], Bullet);
    }
}

function waitForInput()
{
    if((pressed("UP")) && (PlayerY > 18))
        PlayerY-=2;
    if((pressed("DOWN")) && (PlayerY < 160))
        PlayerY+=2;
    if((pressed("LEFT")) && (PlayerX > 20))
        PlayerX-=2;
    if((pressed("RIGHT")) && (PlayerX < 190))
        PlayerX+=2;
    if(justPressed("A"))
    {
        fireBullet();
    }
    if(pressed("C"))
        exit();
}

function bgScroll()
{
    for(var yOffset = -220; yOffset < (8 * 55 - 220); yOffset += 55)
    {
        var y = yOffset + bgLY; 
        mirror(false); sprite(32, y, bgL); 
        mirror(true);  sprite(172, y, bgL);
        var y2 = yOffset + TopbgLY; 
        mirror(true);  sprite(188, y2, TopBgL);
        mirror(false); sprite(0, y2, TopBgL); 
    }
    
    bgLY+=2;
    if(bgLY > 55) {bgLY = 0;}
    TopbgLY+=4;
    if(TopbgLY > 55) {TopbgLY = 0;}
}

function EnemySpawn(enemyIndex)
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

    if (enemiesD[i] == 0)
    {
        if (enemiesX[i] > 30)
        {
            //console(enemiesX[i]);
            enemiesX[i] -= 2;
            //console(enemiesX[i]);
        }
        else
        {
            minDirection = 1;
            newDirection = 1;
        }
    }

    if (enemiesD[i] == 2)
    {
        if (enemiesX[i] < 200)
        {
            // console(enemiesX[i]);
            enemiesX[i] += 2;//Right
            // console(enemiesX[i]);
        }
        else
        {
            maxDirection = 1;
            newDirection = 1;
        }
    }

    --enemiesL[i];


    // New Direction?

    if ((enemiesL[i] == 0) || (newDirection == 1))
    {
        enemiesD[i] = random(minDirection, maxDirection + 1);
        enemiesL[i] = random(20, 40);
    }
    
    if (enemiesY[i] > 176)
    {
        EnemySpawn(i);
    }


    // Render enemy ..

    io("COLLISION", i + 1, 0);
    sprite(enemiesX[i], enemiesY[i], Enemy1);
}


function HUD()
{
       for( var x = 0; x < 220; x+=4 )
       {
           sprite(x, 0, HUD_BG);
       }
        
        for(var i=0; i<lives; ++i)
        {
            sprite(110 + (i * 8), 4, heart);
        }

        color(7);
        cursor(8,4)
        print(("SCORE ")); 
        print(score);
        color(0);
}

function EnemyHitPlayer(enemyIndex)
{
    io("VOLUME", 127);
    io("DURATION", 70);
    sound(random(44, 47));
    EnemySpawn(enemyIndex - 1);
    lives -=1;
    if (lives < 1) {
        highscore(score);
        exit();
    }
}

function update()
{

    fill(65)
    //fill(BGchange) // Crazy Background Effect but take 2% progmem
    //if (BGchange < 70)
    //BGchange +=1;
    //else BGchange = 65
    
    bgScroll();
    waitForInput();

    if (score > 80)         level = 10;
    else if (score > 60)    level = 8;
    else if (score > 40)    level = 6;
    else if (score > 40)    level = 4;
    else level = 4;

    for(var i = 0; i < level; ++i) {
        EnemyUpdate(i);
        moveBullet(i);
    }

//    io("COLLISION", 0, -1, EnemyHitPlayer);
    ++ShipAnim;
    if ((ShipAnim/4)%2==0)
        sprite(PlayerX, PlayerY, PlayerShip_F1);
    else
        sprite(PlayerX, PlayerY, PlayerShip_F2);
        
    sprite(PlayerX+20, PlayerY+20, PlayerShip_shadow);
    HUD();
}
