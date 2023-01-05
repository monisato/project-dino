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
var overLayer;
let direction = true; // for idle animation // true = right side, false = left side 

const imgSrc = [
    { key: 'shadow', src: './assets/shadow.png'},
    { key: 'selectScreen', src: './assets/bg_select_s.png'}
]

const tilesSrc = [
    { key: 'bgtiles', src: './assets/tilemap_packed.png'},
    { key: 'mgtiles', src: './assets/tiles_packed.png'},
]

const stageSrc = [
    { key: 'map', src: './assets/map.json' },
    { key: 'map2', src: './assets/map2.json' }
]

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
    // load tiles
    for (i=0; i<tilesSrc.length; i++) {
        this.load.image(tilesSrc[i].key, tilesSrc[i].src)
    }
    
    // load tile map
    for (i=0; i<stageSrc.length; i++) {
        this.load.tilemapTiledJSON(stageSrc[i].key, stageSrc[i].src);
    }

    // loading images
    for (i=0; i<imgSrc.length; i++) {
        this.load.image(imgSrc[i].key, imgSrc[i].src)
    }

    // load sprites
    for (i=0; i<spriteSrc.length; i++) {
        this.load.spritesheet(
            spriteSrc[i].key, 
            spriteSrc[i].src, 
            {frameWidth: ssize.w, frameHeight: ssize.h}
        )
    }
}


function create () {
    // make map
    map = this.make.tilemap({ key: stageSrc[1].key, tileWidth: tsize.w, tileHeight: tsize.h })
    
    // add tileset
    const midTiles = map.addTilesetImage('tiles_packed', 'mgtiles'); // name of tileset in Tiled, key from preload
    const backTiles = map.addTilesetImage('tilemap_packed', 'bgtiles'); // name of tileset in Tiled, key from preload
    
    // create layers
    // first parameter is 'name of layer in Tiled'
    const bgLayer = map.createLayer('background', backTiles, 0, -480).setScale(3); 
    const cloudLayer = map.createLayer('main-clouds', midTiles, 0, -480).setScale(3); 
    const groundLayer = map.createLayer('main-ground', midTiles, 0, -480).setScale(3); 
    const waterLayer = map.createLayer('main-water', midTiles, 0, -480).setScale(3); 
    const etcLayer = map.createLayer('main-etc', midTiles, 0, -480).setScale(3); 
    
    // add player
    player = this.physics.add.sprite(150, 200, 'dinoGre').setScale(3);
    
    // render overlay after player
    overLayer = map.createLayer('overlay', midTiles, 0, -480).setScale(3); //'name of layer in Tiled'
    
    // player.setCollideWorldBounds(true); //collide with the canvas size limit
    player.setBounce(0.2);
    player.body.setGravityY(200);
    groundLayer.setCollisionBetween(1,160);
    this.physics.add.collider(player, groundLayer);
        
    // show hidden area
    overLayer.setTileIndexCallback([19, 39, 23, 24, 25, 123, 124], hitHidden, this);
    // detect touch overlay/hidden area and run line above
    this.physics.add.overlap(player, overLayer);
    
    /////////////////// player animation
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

    // camera
    this.cameras.main.setBounds(0, -420, map.widthInPixels*3, map.heightInPixels*3);
    this.cameras.main.startFollow(player);
}

function hitHidden (sprite, tile)
{
    tile.alpha = 0.5;

    // Return true to exit processing collision of this tile vs the sprite - in this case, it
    // doesn't matter since the tiles are not set to collide.
    return false;
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

    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-450);
    }
}