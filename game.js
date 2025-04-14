kaboom({
    width: 1280,
    height: 720,
    scale: 0.9,
    debug: false
})

// Global variable to track control mode
let useAIControl = true; // Default to AI control

// LOAD FONT
loadFont("digital_glitch", "assets/font/ThingsDigitalRegular-BWedn.ttf")

// LOAD SOUND
// At the top, with other globals
let isSoundLoaded = false;

// After loadSound
loadSound("game-start", "assets/audio/627040__herb__aiva-cyberpunk-ambient.mp3").then(() => {
    isSoundLoaded = true;
    console.log("Game start sound loaded");
});

loadSound("character-attack", "assets/audio/sword-slash-and-swing-185432.mp3").then(() => {
    isSoundLoaded = true;
    console.log("Game attack sound loaded");
});

loadSound("victory", "assets/audio/victory-sound-1.wav").then(() => {
    isSoundLoaded = true;
    console.log("Game victory sound loaded");
});

// LOAD ALL SPRITE SHEET SECTION
// Load background sprite
loadSprite("background", "assets/background/cyberpunk-street-files/Assets/Version 2/Layers/foreground.png")
loadSprite("back_building", "assets/background/cyberpunk-street-files/Assets/Version 2/Layers/back.png")
loadSprite("middle", "assets/background/cyberpunk-street-files/Assets/Version 2/Layers/middle.png")
loadSpriteAtlas("assets/oak_woods_v1.0/oak_woods_tileset.png", {
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

// loadSprite("shop", "assets/shop_anim.png", {
//     sliceX: 6,
//     sliceY: 1,
//     anims: {
//         "default": {
//             from: 0,
//             to: 5,
//             speed: 12,
//             loop: true
//         }
//     }
// })

// DEFAULT TESTING SPRITE
loadSprite("idle-player1", "assets/TheSword/idle-player1.png", {
    sliceX: 8, sliceY: 1, anims: { "idle": {from: 0, to: 7, speed: 12, loop: true}}
})
loadSprite("jump-player1", "assets/TheSword/jump-player1.png", {
    sliceX: 2, sliceY: 1, anims: { "jump": { from: 0, to: 1, speed: 12, loop: true}}
})
loadSprite("attack-player1", "assets/TheSword/attack-player1.png", {
    sliceX: 6, sliceY: 1, anims: { "attack": { from: 0, to: 5, speed: 18}}
})
loadSprite("run-player1", "assets/TheSword/run-player1.png", {
    sliceX: 8, sliceY: 1, anims: { "run": { from: 0, to: 7, speed: 18}}
})
loadSprite("death-player1", "assets/TheSword/death-player1.png", {
    sliceX: 6, sliceY: 1, anims: { "death": { from: 0, to: 5, speed: 10}}
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

// Store character data globally
let characterData = [
    {
        id: "player1",
        name: "TheSword",
        spriteHeight: 43, // Unscaled height of idle-player1.png (adjust based on actual sprite)
        sprites: {
            idle: "idle-player1",
            run: "run-player1",
            jump: "jump-player1",
            attack: "attack-player1",
            death: "death-player1"
        }
    },
    {
        id: "player2",
        name: "GhostSword",
        spriteHeight: 52, // Unscaled height of idle-player2.png (adjust based on actual sprite)
        sprites: {
            idle: "idle-player2",
            run: "run-player2",
            jump: "jump-player2",
            attack: "attack-player2",
            death: "death-player2"
        }
    }
];

let isLoading = true; // Track loading state

// Load additional characters from JSON
async function loadCharacters() {
    try {
        const response = await fetch("characters.json");
        if (!response.ok) throw new Error(`Failed to load characters.json: ${response.status}`);
        const characters = await response.json();
        for (const char of characters) {
            // Default spriteHeight if missing
            char.spriteHeight = char.spriteHeight || 50; // Fallback height
            for (const [state, sprite] of Object.entries(char.sprites)) {
                const spriteName = `${state}-${char.id}`;
                loadSprite(spriteName, sprite.path, {
                    sliceX: sprite.sliceX,
                    sliceY: sprite.sliceY,
                    anims: sprite.anims
                });
                char.sprites[state] = spriteName;
            }
        }
        return characters;
    } catch (error) {
        console.error("Error loading characters:", error);
        return [];
    }
}

// Load JSON and append new characters
loadCharacters().then(newCharacters => {
    characterData = characterData.concat(newCharacters);
    isLoading = false;
    console.log("Characters loaded:", characterData);
});

// SCENE HOME
scene("home", () => {
    // Play sound on scene start
    if (isSoundLoaded) {
        play("game-start", {
            loop: true,
            volume: 0.5
        });
    } else {
        console.log("Sound not loaded yet, retrying...");
        onLoad(() => {
            play("game-start", {
                loop: true,
                volume: 0.5
            });
        });
    }
    // In the "home" scene
    const canvas = document.querySelector('canvas');

    // Reset cursor when mouse leaves the canvas
    canvas.addEventListener('mouseleave', () => {
        canvas.style.cursor = 'default';
    });

    // Update hover effects to include cursor change
    onHover("btn", (b) => {
        canvas.style.cursor = 'pointer';  // Change to hand cursor
        b.color = b.color.lighten(20);    // Existing color effect
        b.scale = vec2(1.05);             // Existing scale effect
    });

    onHoverEnd("btn", (b) => {
        canvas.style.cursor = 'default';  // Reset to default cursor
        b.color = b.color.darken(20);     // Existing color reset
        b.scale = vec2(1);                // Existing scale reset
    });

    // Background
    const background = add([
        sprite("back_building"),
        scale(3),
        pos(0, 0),
        z(0), // Lower z-index (rendered first)
    ])

    background.add([
        sprite("back_building"),
        scale(3),
        pos(100, 0),
        z(0),
    ])

    background.add([
        sprite("background"),
        z(2), // Lower z-index (rendered first)
    ])

    // shop.play("default")

    background.add([
        sprite("middle"),
    ])

    // Add a yellow background rectangle
    const textWidth = 600; // Approximate width for "Battle Infinity" at size 90
    const textHeight = 100; // Approximate height for the text
    const padding = 20; // Extra space around the text for the background

    // const backgroundRect = add([
    //     rect(textWidth + padding * 10, textHeight + padding * 2, { radius: 8 }), // Rectangle with rounded corners
    //     pos(center().x, 150),                                                  // Same position as text
    //     anchor("center"),                                                     // Center the rectangle
    //     color(255, 255, 0),
    //     z(0),                                                                 // Lower layer (behind text)
    // ]);

    // Title with 90s synthwave style
    add([
        text("Battle Infinity", { 
            size: 65,
            font: "digital_glitch", // Modern font
        }),
        pos(center().x, 150),
        anchor("center"),
        color(255, 255, 0), // Yellow color
        z(1)
    ]);

    // Add a glowing effect behind the title
    add([
        rect(700, 150, { radius: 20 }), // Large glowing rectangle
        pos(center().x, 150),
        anchor("center"),
        color(255, 0, 255), // Neon pink glow
        opacity(0.3), // Semi-transparent
        z(0)
    ]);

    // Add a gradient bar below the title
    add([
        rect(600, 10),
        pos(center().x, 200),
        anchor("center"),
        color(0, 255, 255), // Cyan gradient bar
        z(1)
    ]);

    // Start Button
    const startBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 300),
        area(),
        anchor("center"),
        color(255, 255, 0),
        "btn"
    ]);

    startBtn.add([
        text("Start Game", { 
            size: 20,
            font: "digital_glitch"
        }),
        anchor("center"),
        color(0, 204, 255)
    ]);

    // Instructions Button
    const instructionsBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 400),
        area(),
        anchor("center"),
        color(255, 255, 0),
        "btn"
    ]);

    instructionsBtn.add([
        text("How to Play", { 
            size: 20,
            font: "digital_glitch"
        }),
        anchor("center"),
        color(255, 0, 255)
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
            go("character_select");
        } else if (b === instructionsBtn) {
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
                rect(800, 600, { radius: 12 }),
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
                pos(0, -230),
                anchor("center"),
                color(255, 255, 255)
            ]);

            panel.add([
                text(
                    "# Player 1 Controls:\n" +
                    "A/D - Move Left/Right\n" +
                    "W - Jump\n" +
                    "Space - Attack\n\n" +
                    "Use a variety of moves to train the AI effectively!\n" +
                    "# Player 2 Controls:\n" +
                    "←/→ - Move Left/Right\n" +
                    "↑ - Jump\n" +
                    "↓ - Attack\n\n" +
                    "Game Rules:\n" +
                    "- First to reduce opponent's health to 0 wins!\n" +
                    "- 60 second time limit",
                    {
                        size: 15,
                        font: "sinko",
                        width: 700,
                        lineSpacing: 15,
                        align: "center",
                        styles: {
                            outline: 2
                        }
                    }
                ),
                pos(0, -0),
                anchor("center"),
                color(255, 255, 255)
            ]);

            // Close button (avoid redeclaring closeBtn)
            const closeButton = panel.add([
                rect(120, 40, { radius: 6 }),
                pos(0, 250),
                anchor("center"),
                area(),
                color(200, 50, 50),
                z(102), // Optional: ensures it’s above other panel elements,
                "btn"                // Add this tag
            ]);
            
            closeButton.add([
                text("Close", { size: 24 }),
                anchor("center"),
                color(255, 255, 255)
            ]);
            
            closeButton.onClick(() => {
                destroyAll("instructions"); // Destroy panel and overlay
            });
        }
    });

    // Add a toggle button for control mode
    const controlModeBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 500),
        area(),
        anchor("center"),
        color(255, 255, 0),
        "btn"
    ]);

    const controlModeText = controlModeBtn.add([
        text(useAIControl ? "AI Control" : "Player 2 Control", { size: 20, font: "digital_glitch" }),
        anchor("center"),
        color(0, 0, 0)
    ]);

    controlModeBtn.onClick(() => {
        useAIControl = !useAIControl;
        controlModeText.text = useAIControl ? "AI Control" : "Player 2 Control";
    });

    // Start with any key
    onKeyPress("enter", () => go("character_select"));
});

// SCENE CHARACTER SELECT
scene("character_select", () => {
    // Background
    const background = add([
        sprite("back_building"),
        scale(3),
        pos(0, 0),
        z(0), // Lower z-index (rendered first)
    ])

    background.add([
        sprite("back_building"),
        scale(3),
        pos(100, 0),
        z(0),
    ])

    background.add([
        sprite("background"),
        z(2), // Lower z-index (rendered first)
    ])

    // shop.play("default")

    background.add([
        sprite("middle"),
    ])

    // Title
    const textWidth = 600; // Approximate width for "Battle Infinity" at size 90
    const textHeight = 100; // Approximate height for the text
    const padding = 30; // Extra space around the text for the background

    const backgroundRect = add([
        rect(textWidth + padding * 10, textHeight + padding * 2, { radius: 8 }), // Rectangle with rounded corners
        pos(center().x, 50),                                                  // Same position as text
        anchor("center"),                                                     // Center the rectangle
        color(255, 255, 0),
        z(0),                                                                 // Lower layer (behind text)
    ]);

    // Title
    add([
        text("Select Your Character", { 
            size: 50,
            font: "digital_glitch",
            styles: {
                outline: 4,
                outlineColor: rgb(255, 255, 255),
                stroke: { width: 4, color: rgb(0, 0, 0) },
            }
        }),
        pos(center().x, 50),
        anchor("center"),
        color(0, 204, 255),
        z(2)
    ]);

    // Player selection state
    let player1Choice = null;
    let player2Choice = null;

    // Display characters in a grid
    const charWidth = 200;
    const charHeight = 200;
    const startX = center().x - (characterData.length * charWidth) / 2 + charWidth / 2;
    const startY = 200;

    characterData.forEach((char, index) => {
        const charBox = add([
            rect(charWidth - 30, charHeight - 30, { radius: 8 }),
            pos(startX + index * charWidth, startY),
            anchor("center"),
            color(50, 50, 50),
            area(),
            "charBox",
            z(3)
        ]);

        // Character sprite
        const spriteObj = charBox.add([
            sprite(char.sprites.idle),
            scale(1.7),
            anchor("center"),
            z(4)
        ]);
        spriteObj.play("idle");

        // Character name
        charBox.add([
            text(char.name, { size: 20, font: "sinko" }),
            pos(0, charHeight / 2 - 30),
            anchor("center"),
            color(255, 255, 255),
            z(4)
        ]);

        // Click handler for selection
        charBox.onClick(() => {
            if (!player1Choice) {
                player1Choice = char;
                charBox.color = rgb(100, 100, 200); // Blue for Player 1
            } else if (!player2Choice && char !== player1Choice) {
                player2Choice = char;
                charBox.color = rgb(200, 100, 100); // Red for Player 2
                // Both players have chosen, proceed to fight
                go("fight", { player1: player1Choice, player2: player2Choice });
            }
        });

        // Hover effects
        charBox.onHover(() => {
            charBox.scale = vec2(1.05);
            canvas.style.cursor = "pointer";
        });
        charBox.onHoverEnd(() => {
            charBox.scale = vec2(1);
            canvas.style.cursor = "default";
        });
    });

    // Instructions
    add([
        text("Player 1: Choose first\nPlayer 2: Choose second", { size: 24, font: "sinko" }),
        pos(center().x, 500),
        anchor("center"),
        color(255, 255, 255),
        z(3)
    ]);

    // Back button
    const backBtn = add([
        rect(240, 60, { radius: 8 }),
        pos(center().x, 600),
        area(),
        anchor("center"),
        color(200, 50, 50),
        "btn",
        z(3)
    ]);

    backBtn.add([
        text("Back", { size: 32, font: "sinko" }),
        anchor("center"),
        color(0, 0, 0),
        z(4)
    ]);

    backBtn.onClick(() => go("home"));
});

// SCENE FIGHT
scene("fight", (params = { player1: characterData[0], player2: characterData[1] }) => {
    const { player1: player1Data, player2: player2Data } = params;
    
    // Background
    const background = add([
        sprite("back_building"),
        scale(3),
        pos(0, 0),
        z(0), // Lower z-index (rendered first)
    ])

    background.add([
        sprite("back_building"),
        scale(3),
        pos(100, 0),
        z(0),
    ])

    background.add([
        sprite("background"),
        z(2), // Lower z-index (rendered first)
    ])

    // shop.play("default")

    background.add([
        sprite("middle"),
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

//    background.add([
//     sprite("fence"),
//     pos(85, 125)
//    ])

//    background.add([
//     sprite("fence"),
//     pos(10, 125)
//    ])

//    background.add([
//     sprite("sign"),
//     pos(290, 115)
//    ])

    function makePlayer(posX, groundY, scaleFactor, charData) {
        const width = 16; // Consistent collision width
        const height = charData.spriteHeight; // Use sprite height for collision
        const posY = groundY + (height * scaleFactor) / 2; // Center player’s anchor at ground
        return add([
            pos(posX, posY),
            scale(scaleFactor),
            area({shape: new Rect(vec2(0), width, height)}),
            anchor("center"),
            body({stickToPlatform: true}),
            {
                isCurrentlyJumping: false,
                health: 500,
                sprites: charData.sprites,
                id: charData.id
            }
        ])
    }

    setGravity(1200)

    const groundY = 200; // Top of ground tiles
    const player1 = makePlayer(200, groundY, 4, player1Data)
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

    // Player1 controls
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

    const player2 = makePlayer(1000, groundY, 4, player2Data)
    player2.use(sprite(player2.sprites.idle))
    player2.play("idle")
    player2.flipX = true

    // Collect player1 data for AI
    onUpdate(() => {
        const state = {
            p1_x: player1.pos.x / width(),
            p1_y: player1.pos.y / height(),
            p2_x: player2.pos.x / width(),
            p2_y: player2.pos.y / height(),
            distance_x: (player1.pos.x - player2.pos.x) / width(),
            p1_health: player1.health / 500,
            p2_health: player2.health / 500,
            p1_jumping: player1.isCurrentlyJumping ? 1 : 0,
            p1_attacking: player1.curAnim() === "attack" ? 1 : 0
        };
        const action = {
            moveLeft: isKeyDown("a") ? 1 : 0,
            moveRight: isKeyDown("d") ? 1 : 0,
            jump: isKeyDown("w") ? 1 : 0,
            attack: isKeyDown("space") ? 1 : 0
        };
        AI.collectData(state, action);
    });

    // Control logic for player2 based on use AIControl
    if (useAIControl) {
        // Variables to track timing
        let lastAttackTime = 0;
        const attackCooldown = 0.1; // 0.1 second between attacks
        let lastActionTime = 0;
        const actionDelay = 0.1; // 100ms delay between actions

        // AI control for player2
        onUpdate(() => {
            const currentTime = time();

            // Skip if not enough time has passed since the last action
            if (currentTime - lastActionTime < actionDelay) return;
            lastActionTime = currentTime;

            // Get AI decision
            const aiAction = AI.predictAction(player1, player2, width(), height(), player2.flipX);

            // Handle movement
            if (aiAction.moveLeft && !aiAction.moveRight) {
                run(player2, -500, true); // Move left (adjusted for flip)
            } else if (aiAction.moveRight && !aiAction.moveLeft) {
                run(player2, 500, false); // Move right
            } else {
                resetPlayerToIdle(player2); // Stop moving
            }

            // Handle jump
            if (aiAction.jump) makeJump(player2);

            // Handle attack with cooldown and probability
            if (aiAction.attack && currentTime - lastAttackTime > attackCooldown && Math.random() < 0.7) {
                attack(player2, []);
                lastAttackTime = currentTime;
            }
        });
    } else {
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
    }

    // Data collection
    onUpdate(() => {
        const state = {
            p1_x: player1.pos.x / width(), // Normalize to 0-1
            p1_y: player1.pos.y / height(),
            p2_x: player2.pos.x / width(),
            p2_y: player2.pos.y / height(),
            distance_x: (player1.pos.x - player2.pos.x) / width(),
            p1_health: player1.health / 500,
            p2_health: player2.health / 500,
            p1_jumping: player1.isCurrentlyJumping ? 1 : 0,
            p1_attacking: player1.curAnim() === "attack" ? 1 : 0
        };
        const action = {
            moveLeft: isKeyDown("a") ? 1 : 0,
            moveRight: isKeyDown("d") ? 1 : 0,
            jump: isKeyDown("w") ? 1 : 0,
            attack: isKeyDown("space") ? 1 : 0
        };
        trainingData.push({ input: state, output: action });
    });
    
    // COUNTER SET UP
    const counter = add([
        rect(100,100),
        pos(center().x, center().y - 300),
        color(10,10,10),
        area(),
        anchor("center"),
        outline(8, WHITE)
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
        // End sound effect
        if (isSoundLoaded) {
            play("victory", {
                loop: false,
                volume: 0.5
            });
        } else {
            console.log("Sound not loaded yet, retrying...");
            onLoad(() => {
                play("victory", {
                    loop: false,
                    volume: 0.5
                });
            });
        }

        const whiteOverlay = add([
            rect(width(), height()),
            color(255, 255, 255),
            opacity(0.3), // Adjust the opacity to control the intensity of the white filter
            fixed(),
            z(0), // Ensure it's behind other elements
        ]);

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

        // Add "Back to Home" button
        const backToHomeBtn = add([
            rect(240, 60, { radius: 8 }),           // Button shape with rounded corners
            pos(center().x, center().y + 100),     // Position below winning text
            area(),                                // Enable click detection
            anchor("center"),                      // Center the button
            color(100, 100, 200),                  // Blue-ish color
            "btn"                                  // Tag for hover effects
        ]);

        backToHomeBtn.add([
            text("Back to Home", { size: 32, font: "sinko" }), // Button label
            anchor("center"),                                  // Center text in button
            color(0, 0, 0)                                     // Black text
        ]);

        backToHomeBtn.onClick(() => go("home"));              // Navigate to "home" scene on click

        // Add "Restart" button
        const restartBtn = add([
            rect(240, 60, { radius: 8 }),           // Button shape with rounded corners
            pos(center().x, center().y + 200),     // Position further below
            area(),                                // Enable click detection
            anchor("center"),                      // Center the button
            color(100, 200, 100),                  // Green-ish color
            "btn"                                  // Tag for hover effects
        ]);

        restartBtn.add([
            text("Restart", { size: 32, font: "sinko" }), // Button label
            anchor("center"),                             // Center text in button
            color(0, 0, 0)                                // Black text
        ]);

        restartBtn.onClick(() => go("fight"));           // Restart "fight" scene on click

        AI.trainAI(); // Train AI after match
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
        outline(8, WHITE),
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
        if (gameOver) return;
        if (player1.health !== 0) {
            console.log("Player 1 hit by Player 2! Health:", player1.health, "Position:", player1.pos);
            player1.health -= 50;

            // change health container
            tween(player1HealthBar.width, player1.health, 1, (val) => {
                player1HealthBar.width = val;
            }, easings.easeOutSine);

            // being attacked indicator
            player1.color = rgb(255, 0, 0);
            wait(0.3, () => {
                player1.color = rgb(255, 255, 255); // This will be fixed later
                console.log("Player 1 flash reset");
            });

            // attack sound
            if (isSoundLoaded) {
                play("character-attack", {
                    loop: false,
                    volume: 0.5
                });
            } else {
                console.log("Sound not loaded yet, retrying...");
                onLoad(() => {
                    play("character-attack", {
                        loop: false,
                        volume: 0.5
                    });
                });
            }

        }
        if (player1.health === 0) {
            console.log("Player 1 defeated!");
            clearInterval(countInterval);
            declareWinner(winningText, player1, player2);
            gameOver = true;
        }
    });

    const player2HealthContainer = add([
        rect(500, 70),
        area(),
        outline(8, WHITE),
        pos(690, 20),
        color(200,0,0)
    ])
       
    const player2HealthBar = player2HealthContainer.add([
        rect(498, 65),
        color(0,180,0),
        pos(2.5, 2.5),
    ])
    
    player2.onCollide(player1.id + "attackHitbox", () => {
        if (gameOver) return;
        if (player2.health !== 0) {
            console.log("Player 2 hit by Player 1! Health:", player2.health, "Position:", player2.pos);
            player2.health -= 50;
            player2.color = rgb(255, 0, 0);

            // change health container
            tween(player2HealthBar.width, player2.health, 1, (val) => {
                player2HealthBar.width = val;
            }, easings.easeOutSine);

            // being attacked effect
            wait(0.3, () => {
                player2.color = rgb(255, 255, 255); // This will be fixed later
                console.log("Player 2 flash reset");
            });

            // attack sound
            if (isSoundLoaded) {
                play("character-attack", {
                    loop: false,
                    volume: 0.5
                });
            } else {
                console.log("Sound not loaded yet, retrying...");
                onLoad(() => {
                    play("character-attack", {
                        loop: false,
                        volume: 0.5
                    });
                });
            }
        }
        if (player2.health === 0) {
            console.log("Player 2 defeated!");
            clearInterval(countInterval);
            declareWinner(winningText, player1, player2);
            gameOver = true;
        }
    });
})


// Load AI model and start game
AI.loadAI();
go("home");