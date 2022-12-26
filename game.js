let canvas;
let context;
const view = {w:256, h:128}; 
const fps = 30;
const dinoSpriteSize = 24;
let touchdev = false; //not touchable screen
let mobiledev = false; //not mobile device
let scalerate = 1; //base scale
let loading = true;
var lastKeyPressed; //get resting position

const bgImgSrc = './assets/bg_fight.png'
bgImg = new Image()
bgImg.src = bgImgSrc

const effectsImgSrc = [
    './assets/shadow.png',
    './assets/bg_select_s.png'
]

const playerImgSrc = [
    './assets/spritedino_vita.png',
    './assets/spritedino_mort.png',
    './assets/spritedino_tard.png',
    './assets/spritedino_doux.png'
]

let effectsImg = new Array();
let playerImg = new Array();


// run when loaded
window.onload = function(){
    // if touch show button controllers
    var ua = navigator.userAgent;
	touchdev = false;
	if( ua.indexOf('iPhone') > 0
		|| ua.indexOf('iPod') > 0
		|| ua.indexOf('iPad') > 0
		|| ua.indexOf('Android') > 0
		|| ua.indexOf('Windows Phone') > 0 ) {
		touchdev = true;
	}
    // if mobile resize the game screen
	mobiledev = false;
    if( ua.indexOf('iPhone') > 0
    	|| ua.indexOf('iPod') > 0
		|| ua.indexOf('Windows Phone') > 0
    	|| ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        mobiledev = true;
    }
	scalerate = Math.min(window.innerWidth/view.w, window.innerHeight/view.h);
	if(!mobiledev) scalerate = 2;
    canvas = document.getElementById('canvas');
    canvas.width = view.w;
    canvas.height = view.h;
    canvas.style.width = view.w*scalerate+'px';
    canvas.style.height = view.h*scalerate+'px';
    context = canvas.getContext('2d');
		
    
    context.fillStyle = 'white'
    context.fillRect(0,0, canvas.w, canvas.h)
    
    for (i=0; i<effectsImgSrc.length; i++){
        effectsImgSrc[i] = new Image()
        effectsImgSrc[i].src = effectsImgSrc[i]
    }

    for (i=0; i<playerImgSrc.length; i++){
        playerImg[i] = new Image()
        playerImg[i].src = playerImgSrc[i]
    }

    loading = false
}


class Sprite {
    constructor({ position, image }) {
        this.position = position
        this.image = image
    }
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y) // fight background
    }
}

const background = new Sprite({
    position: { x: 0, y: -190 },
    image: bgImg
})

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
}

function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    
    // select background
    // context.globalAlpha = 0.5;
    // context.drawImage(bgImg[1], -canvas.width/16, canvas.height/4, canvas.width*1.12, canvas.height/3)
    // player dino
    
    context.globalAlpha = 1.0;
    context.drawImage(
        playerImg[0],
        0, //cropping
        0, //cropping
        playerImg[0].width/24, //cropping
        playerImg[0].height, //cropping
        scalerate*8, 
        scalerate*39,
        playerImg[0].width/24, 
        playerImg[0].height
        )
    if (keys.d.pressed) {
        background.position.x = background.position.x - 20
    }

    // dinos select
    // context.drawImage(
    //     playerImg[0], //green
    //     0, //cropping
    //     0, //cropping
    //     playerImg[0].width/24, //cropping
    //     playerImg[0].height, //cropping
    //     scalerate*8, 
    //     scalerate*20,
    //     playerImg[0].width/24, 
    //     playerImg[0].height
    //     )
    // context.drawImage(
    //     playerImg[1], //red
    //     0, //cropping
    //     0, //cropping
    //     playerImg[1].width/24, //cropping
    //     playerImg[1].height, //cropping
    //     scalerate*41, 
    //     scalerate*20,
    //     playerImg[1].width/24, 
    //     playerImg[1].height
    //     )
    // context.drawImage(
    //     playerImg[2], //yellow
    //     0, //cropping
    //     0, //cropping
    //     playerImg[2].width/24, //cropping
    //     playerImg[2].height, //cropping
    //     scalerate*74, 
    //     scalerate*20,
    //     playerImg[2].width/24, 
    //     playerImg[2].height
    //     )
    // context.drawImage(
    //     playerImg[3], //blue
    //     0, //cropping
    //     0, //cropping
    //     playerImg[3].width/24, //cropping
    //     playerImg[3].height, //cropping
    //     scalerate*106, 
    //     scalerate*20,
    //     playerImg[3].width/24, 
    //     playerImg[3].height
    //     )
}
animate()



//////////////////// controllers
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
    



