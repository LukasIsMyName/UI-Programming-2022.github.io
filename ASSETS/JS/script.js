const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const keys = 
{
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    keyLeft: {
        pressed: false
    },
    keyRight: {
        pressed: false
    },
    keyDown: {
        pressed: false
    }
}

//Enum "class" for direction
const directionEnum = Object.freeze(
{
    Right: 0,
    Left: 1,
    Up: 2,
    Down: 3,
    RightArrow: 4,
    LeftArrow: 5,
    UpArrow: 6,
    DownArrow: 7,
    None: 8
});

//Enum "class" for blocking
const block = Object.freeze(
{
    Hands: 0,
    Legs: 1,
    None: 2
});

//Enum "class" for attacking
const attack = Object.freeze(
{
    Hands: 0,
    Legs: 1,
    None: 2
});

function gameLoop()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    render()
    update()
    
    window.requestAnimationFrame(gameLoop)
}

function run()
{
    gameLoop()
}

function update()
{
    player.update()
    //player2.update()
}

function render()
{
    background.render()
    player.render()
    //player2.render()
}
addEventListener('keydown', (event) =>
    {
        switch(event.key)
        {
            //Player 1 input
            case 'd':
                player.move(directionEnum.Right) // Right
                break
            case 'a':
                player.move(directionEnum.Left) // Left
                break
            case 'w':
                player.move(directionEnum.Up) // Up
                break
            case 's':
                player.move(directionEnum.Down) // Down
                break
            case 'u':
                player.block(block.Hands)
                break
            case 'i':
                player.block(block.Legs)
                break
            case 'j':
                player.attack(attack.Hands)
                break
            case 'k':
                player.attack(attack.Legs)
                break
                
            //Player 2 input
            case 'ArrowRight':
                player2.move(directionEnum.RightArrow) // Right
                break
            case 'ArrowLeft':
                player2.move(directionEnum.LeftArrow) // Left
                break
            case 'ArrowUp':
                player2.move(directionEnum.UpArrow) // Up
                break
            case 'ArrowDown':
                player2.move(directionEnum.DownArrow) // Down
                break
            case '8':
                player2.block(block.Hands)
                break
            case '9':
                player2.block(block.Legs)
                break
            case '5':
                player2.attack(attack.Hands)
                break
            case '6':
                player2.attack(attack.Legs)
                break
        }
    })
addEventListener('keyup', (event) =>
{
    switch(event.key)
    {
        //Player 1
        case 'd': 
            keys.d.pressed = false
            player.isStanding = true
            break
        case 'a':
            keys.a.pressed = false
            player.isStanding = true
            break
        case 's':
            if(player.isCrouching === true)
            {
            }
            keys.s.pressed = false
            player.isCrouching = false
            player.isStanding = true
            break
        case 'u':
            player.isBlockingHands = false
            player.isReady = true
            break
        case 'i':
            player.isBlockingLegs = false
            player.isReady = true
            break
        case 'j':
            player.isAttacking = false
            player.attackBoxWidth = 50
            break
        case 'k':
            player.isAttacking = false
            player.attackBoxWidth2 = 50
            break
        //Player 2
        case 'ArrowRight': 
            keys.keyRight.pressed = false
            break
        case 'ArrowLeft':
            keys.keyLeft.pressed = false
            break
        case 'ArrowDown':
            if(player2.isCrouching === true)
            {
                player2.height = 200
                player2.position.y -= 100
            }
            keys.keyDown.pressed = false
            player2.isCrouching = false
            player2.isStanding = true
            break
        case '8':
            player2.isBlockingHands = false
            player2.isReady = true
            break
        case '9':
            player2.isBlockingLegs = false
            player2.isReady = true
            break
        case '5':
            player2.isAttacking = false
            player2.attackBoxWidth = player2.defaultBoxWidth
            break
        case '6':
            player2.isAttacking = false
            player2.attackBoxWidth2 = player2.defaultBoxWidth
            break
    }
})


window.onload = run()