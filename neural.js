// neural.js

// Initialize Brain.js network
let net = null;
try {
    net = new brain.NeuralNetwork({
        inputSize: 9, // p1_x, p1_y, p2_x, p2_y, distance_x, p1_health, p2_health, p1_jumping, p1_attacking
        outputSize: 4, // moveLeft, moveRight, jump, attack
        hiddenLayers: [16, 8],
        activation: "sigmoid"
    });
    console.log("Neural network initialized");
} catch (error) {
    console.error("Failed to initialize neural network:", error);
}

// Store training data
let trainingData = [];

// Load saved model
function loadAI() {
    try {
        const saved = localStorage.getItem("aiModel");
        if (saved) {
            const model = JSON.parse(saved);
            if (model && net) {
                net.fromJSON(model);
                console.log("AI model loaded successfully");
            } else {
                console.log("Invalid saved model, skipping load");
            }
        } else {
            console.log("No saved AI model found");
        }
    } catch (error) {
        console.error("Error loading AI model:", error);
        localStorage.removeItem("aiModel"); // Clear corrupted data
    }
}

// Save model
function saveAI() {
    try {
        if (net) {
            localStorage.setItem("aiModel", JSON.stringify(net.toJSON()));
            console.log("AI model saved");
        }
    } catch (error) {
        console.error("Error saving AI model:", error);
    }
}

// Train the neural network
function trainAI() {
    if (!net) {
        console.error("Neural network not initialized");
        return;
    }
    if (trainingData.length < 100) {
        console.log("Not enough data to train:", trainingData.length);
        return;
    }
    if (trainingData.length > 1000) {
        trainingData = trainingData.slice(-1000);
    }
    const formattedData = trainingData.map(data => ({
        input: [
            data.input.p1_x,
            data.input.p1_y,
            data.input.p2_x,
            data.input.p2_y,
            data.input.distance_x,
            data.input.p1_health,
            data.input.p2_health,
            data.input.p1_jumping,
            data.input.p1_attacking
        ],
        output: [
            data.output.moveLeft,
            data.output.moveRight,
            data.output.jump,
            data.output.attack
        ]
    }));
    console.log("Training AI with", formattedData.length, "samples");
    try {
        net.train(formattedData, {
            iterations: 1000,
            learningRate: 0.1,
            errorThresh: 0.01,
            log: true,
            logPeriod: 100
        });
        saveAI();
    } catch (error) {
        console.error("Training failed:", error);
    }
}

// Predict actions
function predictAction(player1, player2, canvasWidth, canvasHeight, isFlipped) {
    if (!net) {
        console.error("Neural network not initialized");
        return { moveLeft: false, moveRight: false, jump: false, attack: false };
    }
    if (!player1 || !player2 || !canvasWidth || !canvasHeight ||
        !player1.pos || !player2.pos || player1.health == null || player2.health == null) {
        console.error("Invalid inputs:", { player1, player2, canvasWidth, canvasHeight });
        return { moveLeft: false, moveRight: false, jump: false, attack: false };
    }
    if (trainingData.length < 100) {
        // Rule-based fallback
        const distance = player1.pos.x - player2.pos.x;
        return {
            moveLeft: distance > 50,
            moveRight: distance < -50,
            jump: Math.random() < 0.1,
            attack: Math.abs(distance) < 100 && Math.random() < 0.5
        };
    } else {
        const state = [
            player1.pos.x / canvasWidth,
            player1.pos.y / canvasHeight,
            player2.pos.x / canvasWidth,
            player2.pos.y / canvasHeight,
            (player1.pos.x - player2.pos.x) / canvasWidth,
            player1.health / 500,
            player2.health / 500,
            player1.isCurrentlyJumping ? 1 : 0,
            player1.curAnim() === "attack" ? 1 : 0
        ];
        if (state.some(val => isNaN(val) || val === undefined)) {
            console.error("Invalid state:", state);
            return { moveLeft: false, moveRight: false, jump: false, attack: false };
        }
        console.log("predictAction state:", state);
        try {
            const output = net.run(state);
            console.log("predictAction output:", output);
            const aiAction = {
                moveLeft: output[0] > 0.5,
                moveRight: output[1] > 0.5,
                jump: output[2] > 0.5,
                attack: output[3] > 0.5
            }

            // Reverse movement if the AI is flipped
            if (isFlipped) {
                [aiAction.moveLeft, aiAction.moveRight] = [aiAction.moveRight, aiAction.moveLeft];
            }

            return aiAction;
        } catch (error) {
            console.error("Prediction failed:", error);
            return { moveLeft: false, moveRight: false, jump: false, attack: false };
        }
    }
}

// Collect data
function collectData(state, action) {
    if (state && action && !Object.values(state).some(v => isNaN(v) || v === undefined)) {
        trainingData.push({ input: state, output: action });
    } else {
        console.warn("Invalid data skipped:", state, action);
    }
}

// Export AI functions
window.AI = {
    loadAI,
    trainAI,
    collectData,
    predictAction
};

console.log("neural.js loaded");