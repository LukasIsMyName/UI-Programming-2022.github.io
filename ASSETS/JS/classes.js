class Sprite{
    constructor({position, imageSource, scale = 1, framesMax = 1}){
         //Body members
        this.position = position
        this.height = 0
        this.width = 0
        this.image = new Image()
        this.image.src = imageSource
        this.scale = scale
        this.framesMax = framesMax
        this.frameNo = 0
        this.framesPassed = 0
        this.framesHold = 1
    }
    
    render()
    {ctx.drawImage( this.image,                                      
                    this.frameNo * (this.image.width / this.framesMax), 
                    0,                                                   
                    this.image.width / this.framesMax, 
                    this.image.height,     
                    this.position.x,
                    this.position.y, 
                    (this.image.width / this.framesMax) * this.scale,
                    this.image.height * this.scale)}
    animate()
    {
        this.framesPassed++
        if(this.framesPassed % this.framesHold === 0)
        {
            if(this.frameNo < this.framesMax - 1){
            this.frameNo++
            }else{this.frameNo = 0}
        }
    }
    /*
        @brief Method that handles update
    */ 
    update()
    {
        //this.animate()
    }
}

class Body extends Sprite{
    constructor({position, velocity, color, speed = 4, vertical = -10, offsetX, offset2X, attackBoxWidth,
                imageSource, scale = 1, framesMax = 1, sprites}){

        super({
            position,
            imageSource, 
            scale, 
            framesMax,
        })

        this.frameNo = 0
        this.framesPassed = 0
        this.framesHold = 18
        this.sprites = sprites
        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            console.log(sprites[sprite].imageSource)
            sprites[sprite].image.src = sprites[sprite].imageSource
        }    
         //Body members
        this.velocity = velocity
        this.height = 200
        this.width = 50

        //Hands members
        this.attackBoxHeight = 50
        this.attackBoxWidth = attackBoxWidth
        this.defaultBoxWidth = attackBoxWidth

        //Legs members
        this.attackBoxWidth2 = 50
        this.attackBoxHeight2 = 50
        // Hands
        this.offsetX = offsetX
        this.offsetY = 0
        this.attackingWidth = this.attackBoxWidth + this.offsetX

        //Legs
        this.offset2X = offset2X
        this.offset2Y = 0

        this.boxHands = {
            position: {
                x: this.position.x,
                y: this.position.y
            }
        }

        this.gravity = 0.2  //Gravity var
        this.color = color //Color string
        this.speed = speed //Speed var
        this.vertical = vertical //Vertical height var

        //State control initialize
        this.jumpCount = 0
        this.doubleJumped = false
        this.onGround = false
        this.isCrouching = false
        this.isStanding = true
        this.isMoving = false
        this.inAir = false
        this.isBlockingHands = false
        this.isBlockingLegs = false
        this.isReady = true //Ready to attack
        this.isAttacking = false //Attacking state
        
    }
    
    addGravity()
    {
        this.velocity.y += this.gravity
    }
    move(facing)
    {
        this.isStanding = false
        this.isMoving = true
        //Player 1 movement
        if(facing == directionEnum.Right) //Right
        {
            keys.d.pressed = true
            this.changeSprite('run')
        }
        if(facing == directionEnum.Left) //Left
        {
            keys.a.pressed = true
            this.changeSprite('run')
        }
        if(facing == directionEnum.Up) //Up
        {
            if(this.jumpCount === 2)
            {
                this.doubleJumped = true
            }
            if(this.doubleJumped === false)
            {
                this.velocity.y = this.vertical
                this.jumpCount += 1
                this.inAir = true
            }   
        }
        if(facing == directionEnum.Down)
        {
            keys.s.pressed = true
            this.crouch()  
        }

        //Player 2 movement
        if(facing == directionEnum.RightArrow) //Right
        {
            keys.keyRight.pressed = true
        }
        if(facing == directionEnum.LeftArrow) //Left
        {
            keys.keyLeft.pressed = true
        }
        if(facing == directionEnum.UpArrow) //Up
        {
            if(this.jumpCount === 2)
            {
                this.doubleJumped = true
            }
            if(this.doubleJumped === false)
            {
                this.velocity.y = this.vertical
                this.jumpCount += 1
                this.inAir = true
            }   
        }
        if(facing == directionEnum.DownArrow)
        {
            keys.keyDown.pressed = true
            this.crouch()  
        }
    }
    crouch()
    {
        if(keys.s.pressed)
        {
            if(this.onGround && !this.inAir)
            {
                this.onGround = false
                this.inAir = true
                this.isCrouching = true
            }else if(this.inAir){this.gravity = this.gravity * 3}
        }
        if(keys.keyDown.pressed)
        {
            if(this.onGround && !this.inAir)
            {
                this.onGround = false
                this.inAir = true
                this.isCrouching = true
            }else if(this.inAir){this.gravity = this.gravity * 3}
        }
    }
    block(key)
    {
        
        if(key === block.Hands) // If blocking hands
        {
            this.isBlockingHands = true
            this.isReady = false // isReady to attack not
            //Change position to vertical to block
            this.attackBoxHeight = 100 // Change height
            this.attackBoxWidth = 50 // Change width
            this.offsetY = 50 // Change offset Y
        }
        if(key === block.Legs) // If blocking legs
        {
            this.isBlockingLegs = true
            this.changeSprite('crouchBlock')
            if(this.isCrouching && this.isBlockingLegs) //If crouching, render
            {
                this.offset2Y =  100
            }else{this.offset2Y = 50}
             //Change position to vertical to block
            this.isReady = false        //isReady to attack not
            this.attackBoxHeight2 = 100
            this.attackBoxWidth2 = 50
    
        }
    }
    attack(key)
    {
        if(this.isReady) // if isReady to attack = continue
        {   if(!this.isCrouching)
            {
                if(key === attack.Hands) // If attack with hands
                {
                    this.isAttacking = true
                    this.changeSprite('punch')
                    this.attackBoxWidth = this.attackingWidth//Extend the attack box
                }
            }
            if(key === attack.Legs) // If attack with legs
            {
                if(this.isCrouching)
                {this.changeSprite('crouchKick')
                }else{this.changeSprite('kick')}
                this.isAttacking = true
                this.attackBoxWidth2 = this.attackingWidth
            }
        }
    }
    collision()
    {
    }
    /*
        @brief Method that handles update
    */
    changeSprite(sprite)
    {
        switch(sprite)
        { 
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                  }
                  break
            case 'crouch':
                if (this.image !== this.sprites.crouch.image) {
                    this.image = this.sprites.crouch.image
                    this.framesMax = this.sprites.crouch.framesMax
                    this.framesCurrent = 0
                  }
                  break
            case 'punch':
                if (this.image !== this.sprites.punch.image) {
                    this.image = this.sprites.punch.image
                    this.framesMax = this.sprites.punch.framesMax
                    this.framesCurrent = 1
                    }
                break
            case 'kick':
                if (this.image !== this.sprites.kick.image) {
                    this.image = this.sprites.kick.image
                    this.framesMax = this.sprites.kick.framesMax
                    this.framesCurrent = 1
                    }
                break
            case 'crouchKick':
                if (this.image !== this.sprites.crouchKick.image) {
                    this.image = this.sprites.crouchKick.image
                    this.framesMax = this.sprites.crouchKick.framesMax
                    this.framesCurrent = 1
                    }
                break
            case 'crouchBlock':
                if (this.image !== this.sprites.crouchBlock.image) {
                    this.image = this.sprites.crouchBlock.image
                    this.framesMax = this.sprites.crouchBlock.framesMax
                    this.framesCurrent = 1
                    }
                break
        }
    }
        
    update()
    {
        this.animate()
        if(this.isStanding){this.changeSprite('idle')}
        if(this.isCrouching){this.changeSprite('crouch')}
        if(!this.isBlockingHands)
        {
            this.attackBoxHeight = 50
            this.attackBoxWidth = 50
            this.offsetY = 0
        }
        if(!this.isBlockingLegs)
        {
            this.attackBoxHeight2 = 50
            this.attackBoxWidth2 = 50
            this.offset2Y = 0
        }
        this.velocity.x = 0 //Resets to 0 X velocity to stop if no movement

        //            Method to smoothen out the movement, 
        // i.e if D is pressed and then A, switches to move in A direction
        //  and if A is released D is still true and moves in D direction
                        //Player 1 smoothining
        if(keys.a.pressed) //If key <a> pressed
        {player.velocity.x = -this.speed // move to left
        }else if(keys.d.pressed) //else if key <d> pressed
        {player.velocity.x = this.speed} // move to right
        
        //Player 2 smoothining
        if(keys.keyLeft.pressed) //If key <left> pressed
        {player2.velocity.x = -this.speed // move to left
        }else if(keys.keyRight.pressed) //else if key <right> pressed
        {player2.velocity.x = this.speed} // move to right
        

        //Update the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        //Gravity + ground collision
        // If position.y + height = bottom of model + velocity.y bigger than
        // the bottom of the canvas(because canvas 0, 0 is at the top of the screen)
        if(this.position.y + this.height + this.velocity.y >= canvas.height) 
        {       //If on ground, reset
            this.velocity.y = 0                  //Reset fall
            this.jumpCount = 0                   //Reset jumpcount
            this.inAir = false                   //Not <inAir> anymore, reset
            this.doubleJumped = false            //Not jumping, reset
            if(!this.inAir){
                this.gravity = 0.2
                this.onGround = true}  //Reset gravity and returns onGround true
        }else{this.addGravity()} // if statement above false, call addGravity()
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSource: 'ASSETS/IMAGES/background.jpg',
    scale: 2.9
})

const player = new Body({
    position:{
        x: 100,
        y: 200
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset2X: 50,
    offsetX: 50,
    attackBoxWidth: 50,
    imageSource: 'ASSETS/IMAGES/idle.png',
    framesMax: 4,
    scale: 6.4,
    sprites: {
        idle: {
            imageSource: 'ASSETS/IMAGES/idle.png',
            framesMax: 4
        },
        run: {
            imageSource: 'ASSETS/IMAGES/run.png',
            framesMax: 4
        },
        crouch: {
            imageSource: 'ASSETS/IMAGES/crouch.png',
            framesMax: 1
        },
        punch: {
            imageSource: 'ASSETS/IMAGES/punch.png',
            framesMax: 1
        },
        kick: {
            imageSource: 'ASSETS/IMAGES/kick.png',
            framesMax: 1
        },
        crouchKick: {
            imageSource: 'ASSETS/IMAGES/crouchKick.png',
            framesMax: 1
        },
        crouchBlock: {
            imageSource: 'ASSETS/IMAGES/crouchBlock.png',
            framesMax: 1
        }
    }
})

/*
const player2 = new Body({
    position:{
        x: 1224,
        y: 200
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset2X: -50,
    offsetX: -50,
    attackBoxWidth: 0,
    scale: 6.4,
    imageSource: 'ASSETS/IMAGES/idle.png',
    framesMax: 4
})*/






