kaboom({
    width: 1280,
    height: 720,
    scale: 0.9,
    debug: false
})

scene("home", () => {
    // Background
    const bg = add([
        sprite("background"),
        scale(4)
    ]);

    bg.add([
        sprite("trees"),
    ]);

    // Title
    add([
        text("Battle V", { 
            size: 64,
            font: "sinko",
            styles: {
                outline: 4,
                outlineColor: rgb(0, 0, 0)
            }
        }),
        pos(center().x, 100),
        anchor("center"),
        color(255, 255, 255)
    ]);

    // Start Button
    const startBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 300),
        area(),
        anchor("center"),
        color(100, 200, 100),
        "btn"
    ]);

    startBtn.add([
        text("Start Game", { 
            size: 32,
            font: "sinko"
        }),
        anchor("center"),
        color(0, 0, 0)
    ]);

    // Instructions Button
    const instructionsBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 400),
        area(),
        anchor("center"),
        color(200, 100, 100),
        "btn"
    ]);

    instructionsBtn.add([
        text("How to Play", { 
            size: 32,
            font: "sinko"
        }),
        anchor("center"),
        color(0, 0, 0)
    ]);

    // Button hover effects
    onHover("btn", (b) => {
        b.color = b.color.lighten(20);
        b.scale = vec2(1.05);
    });

    onHoverEnd("btn", (b) => {
        b.color = b.color.darken(20);
        b.scale = vec2(1);
    });

    // Button click handlers
    onClick("btn", (b) => {
        if (b === startBtn) {
            go("fight");
        } else {
            // Darken background
            const overlay = add([
                rect(width(), height()),
                color(0, 0, 0),
                opacity(0.7),
                fixed(),
                z(100),
                "instructions"
            ]);

            // Instructions panel
            const panel = add([
                rect(800, 500, { radius: 12 }),
                pos(center().x, center().y),
                anchor("center"),
                color(20, 20, 20),
                outline(4, WHITE),
                fixed(),
                z(101),
                "instructions"
            ]);

            panel.add([
                text("How to Play", { 
                    size: 48,
                    font: "sinko",
                    styles: { outline: 3 }
                }),
                pos(0, -200),
                anchor("center"),
                color(255, 255, 255)
            ]);

            const content = panel.add([
                text(
                    "Player 1 Controls:\n" +
                    "A/D - Move Left/Right\n" +
                    "W - Jump\n" +
                    "Space - Attack\n\n" +
                    "Player 2 Controls:\n" +
                    "←/→ - Move Left/Right\n" +
                    "↑ - Jump\n" +
                    "↓ - Attack\n\n" +
                    "Game Rules:\n" +
                    "- First to reduce opponent's health to 0 wins!\n" +
                    "- 60 second time limit\n" +
                    "- Best of 3 rounds wins the match!",
                    {
                        size: 28,
                        font: "sinko",
                        width: 700,
                        lineSpacing: 15,
                        styles: {
                            outline: 2
                        }
                    }
                ),
                pos(0, -0),
                anchor("center"),
                color(255, 255, 255)
            ]);

            // Close button
            const closeBtn = panel.add([
                rect(120, 40, { radius: 6 }),
                pos(0, 200),
                anchor("center"),
                area(),
                color(200, 50, 50),
                "closeBtn"
            ]);

            closeBtn.add([
                text("Close", { size: 24 }),
                anchor("center"),
                color(255, 255, 255)
            ]);

            onClick("closeBtn", () => {
                destroyAll("instructions");
            });

            onClick(overlay, () => {
                destroyAll("instructions");
            });
        }
    });

    // Start with any key
    onKeyPress("enter", () => go("fight"));
});


loadSprite("background", "assets/oak_woods_v1.0/background/background_layer_1.png")
loadSprite("trees", "assets/oak_woods_v1.0/background/background_layer_2.png")
loadSpriteAtlas("assets/oak_woods_tileset.png", {
    "ground-golden": {
        "x": 16,
        "y": 0,
        "width": 16,
        "height": 16,
    },
    "deep-ground": {
        "x": 16,
        "y": 32,
        "width": 16,
        "height": 16
    },
    "ground-silver": {
        "x": 150,
        "y": 0,
        "width": 16,
        "height": 16
    }
})

/* 
   Load a sprite into the game using Kaboom.js

   - "idle-player1": The name used to reference this sprite.
   - "assets/idle-player1.png": The file path to the sprite image.
   - sliceX: 8 -> The sprite sheet is divided into 8 horizontal frames (columns).
   - sliceY: 1 -> There is only 1 row in the sprite sheet.
   - anims: Defines animations for the sprite.
     - "idle": 
       - from: 0 -> Start animation from frame 0.
       - to: 7 -> End animation at frame 7.
       - speed: 12 -> Plays at 12 frames per second.
       - loop: true -> The animation will repeat indefinitely.
*/

loadSprite("shop", "assets/shop_anim.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
        "default": {
            from: 0,
            to: 5,
            speed: 12,
            loop: true
        }
    }
})
loadSprite("fence", "assets/fence_1.png")
loadSprite("sign", "assets/sign.png")

loadSprite("idle-player1", "assets/NightBorne/NightBorne.png", {
    sliceX: 23, sliceY: 5, anims: { "idle": {from: 0, to: 8, speed: 12, loop: true}}
})
loadSprite("jump-player1", "assets/MasterSu/IDLE.png", {
    sliceX: 10, sliceY: 1, anims: { "jump": { from: 0, to: 9, speed: 12, loop: true}}
})
loadSprite("attack-player1", "assets/MasterSu/ATTACK.png", {
    sliceX: 7, sliceY: 1, anims: { "attack": { from: 0, to: 6, speed: 18}}
})
loadSprite("run-player1", "assets/MasterSu/RUN.png", {
    sliceX: 16, sliceY: 1, anims: { "run": { from: 0, to: 15, speed: 18}}
})
loadSprite("death-player1", "assets/MasterSu/HURT.png", {
    sliceX: 4, sliceY: 1, anims: { "death": { from: 0, to: 3, speed: 10}}
})

loadSprite("idle-player2", "assets/鬼剑士/idle-player2.png", {
    sliceX: 4, sliceY: 1, anims: { "idle": { from: 0, to: 3, speed: 8, loop: true}}
})
loadSprite("jump-player2", "assets/鬼剑士/jump-player2.png", {
    sliceX: 2, sliceY: 1, anims: {"jump": { from: 0, to: 1, speed: 2, loop: true}}
})
loadSprite("attack-player2", "assets/鬼剑士/attack-player2.png", {
    sliceX: 4, sliceY: 1, anims: { "attack": { from: 0, to: 3, speed: 18}}
})
loadSprite("run-player2", "assets/鬼剑士/run-player2.png", {
    sliceX: 8, sliceY: 1, anims: { "run": { from: 0, to: 7, speed: 18}}
})
loadSprite("death-player2", "assets/鬼剑士/death-player2.png", {
    sliceX: 7, sliceY: 1, anims: { "death": { from: 0, to: 6, speed: 10}}
})

scene("fight", () => {
    const background = add([
        sprite("background"),
        scale(4)
    ])

    background.add([
        sprite("trees"),
    ])

    const groundTiles = addLevel([
        "","","","","","","","","",
        "------#######-----------",
        "dddddddddddddddddddddddd",
        "dddddddddddddddddddddddd"
        ], {
        tileWidth: 16,
        tileHeight: 16,
        tiles: {
            "#": () => [
                sprite("ground-golden"),
                area(),
                body({isStatic: true})
            ],
            "-": () => [
                sprite("ground-silver"),
                area(),
                body({isStatic: true}),
            ],
            "d": () => [
                sprite("deep-ground"),
                area(),
                body({isStatic: true})
            ]
        }
    })
    
    groundTiles.use(scale(4))

    const shop = background.add([
        sprite("shop"),
        pos(170, 15),
    ])

    shop.play("default")

   // left invisible wall
   add([
    rect(16, 720),
    area(),
    body({isStatic: true}),
    pos(-20,0)
   ])

   // right invisible wall
   add([
    rect(16, 720),
    area(),
    body({isStatic: true}),
    pos(1280,0)
   ])

   background.add([
    sprite("fence"),
    pos(85, 125)
   ])

   background.add([
    sprite("fence"),
    pos(10, 125)
   ])

   background.add([
    sprite("sign"),
    pos(290, 115)
   ])

    function makePlayer(posX, posY, width, height, scaleFactor, id) {
        return add([
            pos(posX, posY),
            scale(scaleFactor),
            area({shape: new Rect(vec2(0), width, height)}),
            anchor("center"),
            body({stickToPlatform: true}),
            {
                isCurrentlyJumping: false,
                health: 500,
                sprites: {
                    run: "run-" + id,
                    idle: "idle-" + id,
                    jump: "jump-" + id,
                    attack: "attack-" + id,
                    death: "death-" + id
                }
            }
        ])
    }

    setGravity(1200)

    const player1 = makePlayer(200, 70, 16, 60, 4, "player1")
    player1.use(sprite(player1.sprites.idle))
    player1.play("idle")

    function run(player, speed, flipPlayer) {
        if (player.health === 0) {
            return
        }
    
        if (player.curAnim() !== "run"
            && !player.isCurrentlyJumping) {
            player.use(sprite(player.sprites.run))
            player.play("run")
        }
        player.move(speed,0)
        player.flipX = flipPlayer
    }

    function resetPlayerToIdle(player) {
        player.use(sprite(player.sprites.idle))
        player.play("idle")
    }

    onKeyDown("d", () => {
        run(player1, 500, false)
    })
    onKeyRelease("d", () => {
        if (player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = false
        }
    })

    onKeyDown("a", () => {
        run(player1, -500, true)
    })
    onKeyRelease("a", () => {
        if (player1.health !== 0) {
            resetPlayerToIdle(player1)
            player1.flipX = true
        }
    })

    function makeJump(player) {
        if (player.health === 0) {
            return
        }
    
        if (player.isGrounded()) {
            const currentFlip = player.flipX
            player.jump()
            player.use(sprite(player.sprites.jump))
            player.flipX = currentFlip
            player.play("jump")
            player.isCurrentlyJumping = true
        }
    }

    function resetAfterJump(player) {
        if (player.isGrounded() && player.isCurrentlyJumping) {
            player.isCurrentlyJumping = false
            if (player.curAnim() !== "idle") {
                resetPlayerToIdle(player)
            }
        }
    }

    onKeyDown("w", () => {
        makeJump(player1)
    })

    player1.onUpdate(() => resetAfterJump(player1))

    function attack(player, excludedKeys) {
        if (player.health === 0) {
            return
        }
    
        for (const key of excludedKeys) {
            if (isKeyDown(key)) {
                return
            }
        }
    
        const currentFlip = player.flipX
        if (player.curAnim() !== "attack") {
            player.use(sprite(player.sprites.attack))
            player.flipX = currentFlip
            const slashX = player.pos.x + 30
            const slashXFlipped = player.pos.x - 350
            const slashY = player.pos.y - 200
            
            add([
                rect(300,300),
                area(),
                pos(currentFlip ? slashXFlipped: slashX, slashY),
                opacity(0),
                player.id + "attackHitbox"
            ])
    
            player.play("attack", {
                onEnd: () => {
                    resetPlayerToIdle(player)
                    player.flipX = currentFlip
                }
            }) 
        }
    }

    onKeyPress("space", () => {
        attack(player1, ["a", "d", "w"])
    })

    onKeyRelease("space", () => {
        destroyAll(player1.id + "attackHitbox")
    })

    const player2 = makePlayer(1000, 200, 16, 52, 4, "player2")
    player2.use(sprite(player2.sprites.idle))
    player2.play("idle")
    player2.flipX = true

    onKeyDown("right", () => {
        run(player2, 500, false)
    })
    onKeyRelease("right", () => {
        if (player2.health !== 0) {
            resetPlayerToIdle(player2)
            player2.flipX = false
        }
    })

    onKeyDown("left", () => {
        run(player2, -500, true)
    })
    onKeyRelease("left", () => {
        if (player2.health !== 0) {
            resetPlayerToIdle(player2)
            player2.flipX = true
        }
    })

    onKeyDown("up", () => {
        makeJump(player2)
    })

    player2.onUpdate(() => resetAfterJump(player2))

    onKeyPress("down", () => {
        attack(player2, ["left", "right", "up"])
    })

    onKeyRelease("down", () => {
        destroyAll(player2.id + "attackHitbox")
    })
    
    const counter = add([
        rect(100,100),
        pos(center().x, center().y - 300),
        color(10,10,10),
        area(),
        anchor("center")
       ])
    
    const count = counter.add([
        text("60"),
        area(),
        anchor("center"),
        {
            timeLeft: 60,
        }
    ])

    const winningText = add([
        text(""),
        area(),
        anchor("center"),
        pos(center())
    ])
    
    let gameOver = false
    onKeyDown("enter", () => gameOver ? go("fight") : null)

    function declareWinner(winningText, player1, player2) {
        if (player1.health > 0 && player2.health > 0
            || player1.health === 0 && player2.health === 0) {
            winningText.text = "Tie!"
        } else if (player1.health > 0 && player2.health === 0) {
            winningText.text = "Player 1 won!"
            player2.use(sprite(player2.sprites.death))
            player2.play("death")
        } else {
            winningText.text = "Player 2 won!"
            player1.use(sprite(player1.sprites.death))
            player1.play("death")
        }
    }

    const countInterval = setInterval(() => {
        if (count.timeLeft === 0) {
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true
    
            return
        }
        count.timeLeft--
        count.text = count.timeLeft
    }, 1000)

    const player1HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(90, 20),
        color(200,0,0)
       ])
       
    const player1HealthBar = player1HealthContainer.add([
        rect(498, 65),
        color(0,180,0),
        pos(498, 70 - 2.5),
        rotate(180)
    ])

    player1.onCollide(player2.id + "attackHitbox", () => {
        if (gameOver) {
            return
        }
        
        if (player1.health !== 0) {
            player1.health -= 50
            tween(player1HealthBar.width, player1.health, 1, (val) => {
                player1HealthBar.width = val
            }, easings.easeOutSine) 
        } 
        
        if (player1.health === 0) {
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true
        }
    })

    const player2HealthContainer = add([
        rect(500, 70),
        area(),
        outline(5),
        pos(690, 20),
        color(200,0,0)
    ])
       
    const player2HealthBar = player2HealthContainer.add([
        rect(498, 65),
        color(0,180,0),
        pos(2.5, 2.5),
    ])
    
    player2.onCollide(player1.id + "attackHitbox", () => {
        if (gameOver) {
            return
        }
        
        if (player2.health !== 0) {
            player2.health -= 50 
            tween(player2HealthBar.width, player2.health, 1, (val) => {
                player2HealthBar.width = val
            }, easings.easeOutSine) 
        } 
        
        if (player2.health === 0) {
            clearInterval(countInterval)
            declareWinner(winningText, player1, player2)
            gameOver = true
        }
    })
})

// Change the initial scene to home
go("home");

go("fight")

// Change the initial scene to home
go("home");