// Restart the Game
function reloadGame() {
    reloadGame = location.reload();
}

const rematchFunc = () => {

    let rematchBtn = document.createElement("span");
    let footer = document.querySelector("body");
    rematchBtn.innerHTML = "REMATCH";
    rematchBtn.classList.add("rematch_btn");

    footer.append(rematchBtn);

    rematchBtn.addEventListener("click", () => {
        setTimeout(() => {
            reloadGame()
        }, 100)
    })
}

// Collision
const rectangularCollision = ({ rectangle1, rectangle2 }) => {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let timer = 60;
let timerId;
// determining the winner
const determineWinner = ({ player, enemy, timerId }) => {
    rematchFunc();
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';

    if(player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie!';
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins!';
    } else if (enemy.health > player.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins!';
    }

    setTimeout(() => {
        player.dead = true;
        enemy.dead = true;
    }, 150)
}

// Timer

const decreaseTimer = () => {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if(enemy.health <= 0 || player.health <= 0 || timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}
