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
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    offset: {
        x: 25,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png'
})

const enemy = new Fighter({
    position: {
        x: 700,
        y: 100
    },
    velocity : {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
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

    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player speed
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -10;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 10;
    }

    // enemy speed
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -10;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 10;
    }

    // Detect for collision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + '%';
    }

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + '%';
    }

    // End game based on health
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener('keydown', (e) => {
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
