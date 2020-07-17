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
var score = 0;

const HUD_BG = file("HUD_BG", 0); // load the ship frame1
const PlayerShip_F1 = file("PlayerShip_F1", 0); // load the ship frame1
const PlayerShip_F2 = file("PlayerShip_F2", 0); // load the ship frame 2
const PlayerShip_shadow = file("PlayerShip_shadow", 0); // load the ship shadow
const Bullet = file("Bullet", 0); // Bullet

const Enemy1 = file("Enemy1", 0); // load the enemy gfx

const heart = builtin("sHeart"); //Hearts for lives

const bgL = file("bgL",0); // load the Left Background bottom layer image
const TopBgL = file("TopBgL",0); // load the Left Background Top layer image

music("lrmusic.raw");



// Position enemies and bullets before start of game ..

for (var i = 0; i < level; ++i)
{
    EnemySpawn(i, (i * 32), (i * 32) + 32);
    bulletsY[i] = -5;
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

function moveBullet(bulletIndex)
{
   if (bulletsY[bulletIndex] > 0)
   {
        bulletsY[bulletIndex]-=5;  
        sprite(bulletsX[bulletIndex], bulletsY[bulletIndex], Bullet);
        
        // Did we hit an enemy?
        for (var i = 0; i < level; ++i)
        {
            if (collision(bulletsX[bulletIndex], bulletsY[bulletIndex], enemiesX[i], enemiesY[i]))
            {
               score += 5;
               //BGchange +=1;
               EnemySpawn(i, 32, 64);
               bulletsY[bulletIndex] = -5;
               break;
            }
        }
   }
}

function collision(x1, y1, x2, y2)
{
    
    return !((x2       >= (x1 + 4))  ||
             ((x2 + 16)  <= x1)       ||
             (y2       >= (y1 + 4))  ||
             ((y2 + 16)  <= y1));

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
    for(var yOffset = 0; yOffset < 8; ++yOffset)
    {
        var y = yOffset * 55 + bgLY - 220; 
        mirror(false); sprite(32, y, bgL); 
        mirror(true);  sprite(172, y, bgL);
        var y2 = yOffset * 55 + TopbgLY - 220; 
        mirror(false); sprite(0, y2, TopBgL); 
        mirror(true);  sprite(188, y2, TopBgL);
    }
    
    bgLY+=2;
    if(bgLY > 55) {bgLY = 0}
    TopbgLY+=4;
    if(TopbgLY > 55) {TopbgLY = 0}
}

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

        if (enemiesD[i] == 0)
        {
            if (enemiesX[i] > 30)
            {
                //console(enemiesX[i]);
                enemiesX[i] = enemiesX[i] - 2;
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
                enemiesX[i] = enemiesX[i] + 2;//Right
                // console(enemiesX[i]);
            }
                else
                {
                    maxDirection = 1;
                    newDirection = 1;
                }
        }

        enemiesL[i] = enemiesL[i] - 1;


        // New Direction?

         if ((enemiesL[i] == 0) || (newDirection == 1))
         {
             enemiesD[i] = random(minDirection, maxDirection + 1);
             enemiesL[i] = random(20, 40);
         }
        
        if (enemiesY[i] > 176)
        {
            EnemySpawn(i, 32, 64);
        }


        // Render enemy ..

        sprite(enemiesX[i], enemiesY[i], Enemy1);
        
        
        // Have we collided?
        
        var collide = collision(PlayerX, PlayerY, enemiesX[i], enemiesY[i]);
        
        if (collide)
        {
             io("VOLUME", 127);
             io("DURATION", 70);
             sound(random(44, 47));
             lives -=1; if (lives < 1) { highscore(score); exit(); }
             //console("collision");
            
        }
    
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
    else if (score > 40)    level = 7;
    else level = 4;

    for(var i = 0; i < level; ++i)
    {
        EnemyUpdate(i);
        moveBullet(i);
    }
    
    
    ShipAnim++;
    if ((ShipAnim/4)%2==0)
        sprite(PlayerX, PlayerY, PlayerShip_F1);
    else
        sprite(PlayerX, PlayerY, PlayerShip_F2);
        
    sprite(PlayerX+20, PlayerY+20, PlayerShip_shadow);
    HUD();
}