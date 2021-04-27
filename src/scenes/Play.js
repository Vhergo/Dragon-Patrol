class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/Arrow.png');
        this.load.image('spaceship', './assets/DragonRed.png');
        this.load.image('spaceship2', './assets/DragonBlue.png');
        this.load.image('spaceship3', './assets/DragonGreen.png');
        this.load.image('starfield', './assets/Sky.png');
        this.load.image('archer', './assets/Archer.png');
        this.load.image('timerText', './assets/TimerText.png');

        // load ground
        this.load.image('ground', './assets/Ground.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/DeathAnimation.png', {frameWidth: 73, frameHeight: 51, startFrame: 0, endFrame: 11});
    }

    create() {
        //this.add.text(20, 20, "Rocket Patrol Play");
        // place tile sprite

        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        /*this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);*/

        // add ground
        this.add.image(0, 0, 'ground').setOrigin(0, 0)

        // add timer text
        this.add.image(0, 0, 'timerText').setOrigin(0, 0)

        // add archer
        this.archer = new Archer(this, game.config.width/2 + 100, game.config.height - borderUISize - borderPadding - 50, 'archer').setOrigin(0.5, 0);
        this.archer2 = new Archer2(this, game.config.width/2 - 100, game.config.height - borderUISize - borderPadding - 50, 'archer').setOrigin(0.5, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 + 100, game.config.height - borderUISize - borderPadding  - 50, 'rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket2(this, game.config.width/2 - 100, game.config.height - borderUISize - borderPadding  - 50, 'rocket').setOrigin(0.5, 0);

          // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship2', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship3', 0, 10).setOrigin(0,0);

          // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
       

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '30px',
            backgroundColor: '#628b95',
            color: '#cb362e',
            align: 'right',
            padding: {
            top: 0,
            bottom: 0,
            },
            fixedWidth: 0
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding + 550, borderUISize + borderPadding*2 - 43, this.p1Score, scoreConfig);
        this.scoreLeft2 = this.add.text(borderUISize + borderPadding + 92, borderUISize + borderPadding*2 - 43, this.p2Score, scoreConfig);

        // choosing time
        let time;
        if(game.settings.gameTimer == 60000){

            time = 60;
        }
        if(game.settings.gameTimer == 45000){

            time = 45;
        }

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2 - 150, 'GAME OVER', scoreConfig).setOrigin(0.5);

            if (this.p1Score > this.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2 - 50, 'Player 2 Wins!', scoreConfig).setOrigin(0.5);
            }else if (this.p1Score < this.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2 - 50, 'Player 1 Wins!', scoreConfig).setOrigin(0.5);
            }else {
                this.add.text(game.config.width/2, game.config.height/2 - 50, 'Tie!', scoreConfig).setOrigin(0.5);
            }

            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // display time
        let timeDisplay;
         
        let timeConfig = {
           fontFamily: 'Courier',
           fontSize: '36px',
           backgroundColor: '#628b95',
           color: '#cb362e',
           align: 'right',
           padding:{
               top: 0,
               bottom: 0,
           },
           fixedWidth: 0
       }

       timeDisplay = this.add.text(borderUISize + borderPadding + 325, borderUISize + borderPadding*2 - 43,time + "s", timeConfig);   

       let minusTime = setInterval(updateTime, 1000);

       function updateTime(){
           //console.log("In here");
           if(time > 0){
               time--;
           }
           timeDisplay.text = time + "s";
       }

    }

    update() {

          // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (!this.gameOver) {               
            this.p1Rocket.update();       // update rocket sprite
            this.p2Rocket.update();
            this.archer.update();
            this.archer2.update();
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 1;
        this.p1Rocket.update();
        this.p2Rocket.update();

        this.archer.update();
        this.archer2.update();
        // update spaceships (x3)
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        //p2
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          ship.reset();                       // reset ship position
          ship.alpha = 1;                     // make ship visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        this.sound.play('sfxDying');     
      }

      shipExplode2(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          ship.reset();                       // reset ship position
          ship.alpha = 1;                     // make ship visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p2Score += ship.points;
        this.scoreLeft2.text = this.p2Score; 
        this.sound.play('sfxDying');     
      }
}