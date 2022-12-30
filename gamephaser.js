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
var platforms; // test
var sky;
var map;
var tileset;
var stage;
var player;
var groundLayer;
let direction = true; // for idle animation // true = right side, false = left side 

const imgSrc = [
    { key: 'bg', src: './assets/map_background.png'},
    { key: 'mg', src: './assets/map_midground.png'},
    { key: 'fg', src: './assets/map_foreground.png'},
    { key: 'ground', src: './assets/platform.png'},
    { key: 'shadow', src: './assets/shadow.png'},
    { key: 'selectScreen', src: './assets/bg_select_s.png'}
]

const tilesSrc = [
    { key: 'bgtiles', src: './assets/tilemap_packed.png'},
    { key: 'mgtiles', src: './assets/tiles_packed.png'},
    { key: 'collision', src: './assets/collision.png'},
]

const stageSrc = { key: 'map', src: './assets/map.json' }

const spriteSrc = [
    { key: 'dinoGre', src: './assets/spritedino_vita_cut.png'},
    { key: 'dinoRed', src: './assets/spritedino_mort.png'},
    { key: 'dinoYel', src: './assets/spritedino_tard.png'},
    { key: 'dinoBlu', src: './assets/spritedino_doux.png'}
]

const tsize = { w:18, h:18 } //tile size
const ssize = { w:22, h:18 } //new sprite frame size specs
//const spriteFrame = { w: 24, h:24 } //old frame specs

function preload () {
    for (i=0; i<tilesSrc.length; i++) {
        this.load.image(tilesSrc[i].key, tilesSrc[i].src)
    }

    // load tile map
    this.load.tilemapTiledJSON(stageSrc.key, stageSrc.src);

    // loading images
    for (i=0; i<imgSrc.length; i++) {
        this.load.image(imgSrc[i].key, imgSrc[i].src)
    }

    for (i=0; i<spriteSrc.length; i++) {
        this.load.spritesheet(
            spriteSrc[i].key, 
            spriteSrc[i].src, 
            {frameWidth: ssize.w, frameHeight: ssize.h}
        )
    }
}


function create () {
    sky = this.add.image(0, 350, 'bg').setScale(3); //sky background

    map = this.make.tilemap({ key: stageSrc.key, tileWidth: tsize.w, tileHeight: tsize.h })
    const midTiles = map.addTilesetImage('tiles_packed', 'mgtiles'); // name of tileset in Tiled, key from preload
    const mainLayer = map.createLayer('midground', midTiles, 0, -480).setScale(3); //name of layer in Tiled

    // collider test
    // platforms = this.physics.add.staticGroup();
    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(150, 200, 'dinoGre').setScale(3);

    player.setBounce(0.2);
    // player.setCollideWorldBounds(true); //collide with the canvas size limit
    player.body.setGravityY(200);
    this.physics.add.collider(player, mainLayer, platforms);
    mainLayer.setCollisionBetween(1,160);

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

    this.cameras.main.setBounds(0, -420, map.widthInPixels*3, map.heightInPixels*3);
    this.cameras.main.startFollow(player);
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

    // if (cursors.up.isDown && player.body.touching.down) {
    //     player.setVelocityY(-450);
    // }
    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-450);
    }
}