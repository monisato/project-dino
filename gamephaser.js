///////////// Phaser Version

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

const imgSrc = [
    { key: 'sky', src: './assets/sky.png'},
    { key: 'ground', src: './assets/platform.png'},
    { key: 'shadow', src: './assets/shadow.png'},
    { key: 'selectScreen', src: './assets/bg_select_s.png'}
]

const spriteSrc = [
    { key: 'dinoGre', src: './assets/spritedino_vita_cut.png'},
    { key: 'dinoRed', src: './assets/spritedino_mort.png'},
    { key: 'dinoYel', src: './assets/spritedino_tard.png'},
    { key: 'dinoBlu', src: './assets/spritedino_doux.png'}
]

const spriteFrame = { w: 22, h:18 } //new frame specs
//const spriteFrame = { w: 24, h:24 } //old frame specs

function preload () {
    for (i=0; i<imgSrc.length; i++) {
        this.load.image(imgSrc[i].key, imgSrc[i].src)
    }
    for (i=0; i<spriteSrc.length; i++) {
        this.load.spritesheet(
            spriteSrc[i].key, 
            spriteSrc[i].src, 
            {frameWidth: spriteFrame.w, frameHeight: spriteFrame.h}
        )
    }
}

var platforms;

let direction = true; // true = right side, false = left side

function create () {
    this.add.image(400, 300, 'sky')

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    player = this.physics.add.sprite(100, 450, 'dinoGre').setScale(3);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(200);
    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left-walk',
        frames: this.anims.generateFrameNumbers('dinoGre', { frames: [42, 43, 44, 45, 46, 47]}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'left-idle',
        frames: this.anims.generateFrameNumbers('dinoGre', { frames: [35, 36, 37, 38] }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right-walk',
        frames: this.anims.generateFrameNumbers('dinoGre', { frames: [7, 8, 9, 10, 11, 12]}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right-idle',
        frames: this.anims.generateFrameNumbers('dinoGre', { frames: [0, 1, 2, 3] }),
        frameRate: 10,
        repeat: -1
    });

}

function update () {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left-walk', true);
        direction = false;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right-walk', true);
        direction = true;
    } else {
        player.setVelocityX(0);
        if (direction) {
            player.anims.play('right-idle', true);
        } else {
            player.anims.play('left-idle', true);
        }
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-450);
    }
}