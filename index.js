const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// display
canvas.width = 1750;
canvas.height = 1000;



//interaction
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// background image
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

// shop image
const shop = new Sprite({
    position: {
        x: 1025,
        y: 225
    },
    imageSrc: './img/shop.png',
    scale: 4.75,
    framesMax: 6,
})

const player = new Fighter({
    position: {
      x: 350,
      y: 440
    },
    velocity: {
      x: 0,
      y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 4.2,
    offset: {
        x: 360,
        y: 310
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 75
        },
        width: 325,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 1275,
        y: 440
    },
    velocity : {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 4.2,
    offset: {
        x: 360,
        y: 336.6
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -325,
            y: 75
        },
        width: 325,
        height: 50
    }
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}

decreaseTimer();

// Animation
const animate = () => {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // draw objects
    background.update();
    shop.update();
    // background opacity
    c.fillStyle = 'rgba(255, 255, 255, 0.11)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    // instantiate player and enemy
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -10;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 10;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -10;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 10;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // Detect for collision player / attack
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy })
        && player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses attack
    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    // Detect for collision enemy / attack
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if enemy misses attack
    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }
}

animate();

window.addEventListener('keydown', (e) => {
    if (!player.dead) {
        // if(player.position.x <= 0) player.position.x = 0;
        // if (player.position.x + player.width >= canvas.width) player.position.x = canvas.width - player.width + 10;
        switch (e.key) {
        //Player movement
            case 'w':
                player.position.y + player.height + player.velocity.y >= canvas.height - 168.5 ? player.velocity.y = -20 : null
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        if(enemy.position.x <= 0) enemy.position.x = 0;
        if (enemy.position.x + enemy.width >= canvas.width) enemy.position.x = canvas.width - enemy.width;
        switch (e.key) {
            // Enemy movement
            case 'ArrowUp':
                enemy.position.y + enemy.height + enemy.velocity.y >= canvas.height - 168.5 ? enemy.velocity.y = -20 : null
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (e) => {
    // Player
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
    }

    // Enemy
    switch (e.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
    }

})
