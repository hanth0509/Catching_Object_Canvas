let canvas;
let gameWorld;

window.onload = () => {
    "use strict";

    canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 520;

    gameWorld = new Game(canvas);
    window.gameWorld = gameWorld;
    window.requestAnimationFrame((timeStamp) => gameWorld.gameLoop(timeStamp));
};

const BACKGROUND_COLOR = "#0f172a";
const FLOOR_COLOR = "#1e293b";
const CATCHER_WIDTH = 110;
const CATCHER_HEIGHT = 28;
const START_LIVES = 3;
const FALL_SPEED = 180;
const OBSTACLE_SPEED = 220;

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.ui = new GameUI(canvas);

        this.score = 0;
        this.lives = START_LIVES;
        this.run = false;
        this.gameOver = false;
        this.oldTimeStamp = 0;
        this.spawnTimer = 0;
        this.spawnTime = 1.1;

        this.fallingObjects = [];
        this.obstacles = [];
        this.heartObjects = [];

        this.speedUpObjects = [];
        this.slowDownObjects = [];

        this.speedMultiplier = 1;

        this.createActors();
        this.listenForPlayerInput();
        this.draw();
        this.showStart();
    }

    createActors() {
        this.catcher = new Catcher(
            this.context,
            this.width / 2 - CATCHER_WIDTH / 2,
            this.height - 64,
            CATCHER_WIDTH,
            CATCHER_HEIGHT
        );
    }

    listenForPlayerInput() {
        window.addEventListener("keydown", (event) => {
            if (event.code === "ArrowLeft") {
                this.catcher.moveLeft = true;
            } else if (event.code === "ArrowRight") {
                this.catcher.moveRight = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.code === "ArrowLeft") {
                this.catcher.moveLeft = false;
            } else if (event.code === "ArrowRight") {
                this.catcher.moveRight = false;
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (!this.run || this.gameOver) {
                return;
            }

            this.catcher.moveToCenter(this.canvasX(event.clientX), this.width);
        });

        this.canvas.addEventListener("touchmove", (event) => {
            if (!this.run || this.gameOver) {
                return;
            }

            let touch = event.targetTouches[0];
            this.catcher.moveToCenter(this.canvasX(touch.clientX), this.width);
        });
    }

    gameLoop(timeStamp) {
        let secondsPassed = (timeStamp - this.oldTimeStamp) / 1000 || 0;
        secondsPassed = Math.min(secondsPassed, 0.05);
        this.oldTimeStamp = timeStamp;

        if (this.run) {
            this.update(secondsPassed);
        }

        this.draw();
        window.requestAnimationFrame((nextTimeStamp) => this.gameLoop(nextTimeStamp));
    }

    update(secondsPassed) {
        this.catcher.update(secondsPassed, this.width);

        // TODO: Spawn falling objects and obstacles.
        this.spawnItems(secondsPassed);

        // Update the speed of falling objects and obstacles based on the speed multiplier.
        for (let i = 0; i < this.fallingObjects.length; i++) {
            this.fallingObjects[i].vy = FALL_SPEED * this.speedMultiplier;
        }

        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].vy = OBSTACLE_SPEED * this.speedMultiplier;
        }

        for (let i = 0; i < this.heartObjects.length; i++) {
            this.heartObjects[i].vy = FALL_SPEED * this.speedMultiplier;
        }

        for (let i = 0; i < this.speedUpObjects.length; i++) {
            this.speedUpObjects[i].vy = FALL_SPEED * this.speedMultiplier;
        }

        for (let i = 0; i < this.slowDownObjects.length; i++) {
            this.slowDownObjects[i].vy = FALL_SPEED * this.speedMultiplier;
        }
        // TODO: Update falling objects and obstacles.
        // Hint: loop over this.fallingObjects and this.obstacles.
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            this.fallingObjects[i].update(secondsPassed);
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(secondsPassed);
        }
        for (let i = this.heartObjects.length - 1; i >= 0; i--) {
            this.heartObjects[i].update(secondsPassed);
        }
        for (let i = this.speedUpObjects.length - 1; i >= 0; i--) {
            this.speedUpObjects[i].update(secondsPassed);
        }
        for (let i = this.slowDownObjects.length - 1; i >= 0; i--) {
            this.slowDownObjects[i].update(secondsPassed);
        }
        // TODO: Check if catcher touches a falling object.
        // If yes, increase score and remove that object.
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            if (this.catcher.isTouching(this.fallingObjects[i])) {
                this.score++;
                this.fallingObjects.splice(i, 1);
            }
        }
        // TODO: Check if catcher touches a speed-up object.
        // If yes, increase speed and remove that object.
        for (let i = this.speedUpObjects.length - 1; i >= 0; i--) {
            if (this.catcher.isTouching(this.speedUpObjects[i])) {
                this.speedMultiplier += 0.5;
                // Limit the speed multiplier to prevent it from becoming too fast.
                if (this.speedMultiplier > 5) {
                    this.speedMultiplier = 5;
                }
                this.speedUpObjects.splice(i, 1);
            }
        }
        // TODO: Check if catcher touches a slow-down object.
        // If yes, decrease speed and remove that object.
        for (let i = this.slowDownObjects.length - 1; i >= 0; i--) {
            if (this.catcher.isTouching(this.slowDownObjects[i])) {
                this.speedMultiplier -= 0.5;
                // Limit the speed multiplier to prevent it from becoming too slow.
                if (this.speedMultiplier < 0.1) {
                    this.speedMultiplier = 0.1;
                }
                this.slowDownObjects.splice(i, 1);
            }
        }
        // TODO: Check if catcher touches an obstacle.
        // If yes, lose a life and remove that obstacle.
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.catcher.isTouching(this.obstacles[i])) {
                this.lives--;
                this.obstacles.splice(i, 1);
            }
        }
        for (let i = this.heartObjects.length - 1; i >= 0; i--) {
            if (this.catcher.isTouching(this.heartObjects[i])) {
                if (this.lives < 3) {
                    this.lives++;
                }
                this.heartObjects.splice(i, 1);
            }
        }
        // TODO: Remove items that leave the screen.
        // If a falling object reaches the bottom, lose a life.
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            if (this.fallingObjects[i].isOffScreen(this.height)) {
                this.lives--;
                this.fallingObjects.splice(i, 1);
            }
        }
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            if (this.obstacles[i].isOffScreen(this.height)) {
                this.obstacles.splice(i, 1);
            }
        }
        for (let i = this.heartObjects.length - 1; i >= 0; i--) {
            if (this.heartObjects[i].isOffScreen(this.height)) {
                this.heartObjects.splice(i, 1);
            }
        }

        for (let i = this.speedUpObjects.length - 1; i >= 0; i--) {
            if (this.speedUpObjects[i].isOffScreen(this.height)) {
                this.speedUpObjects.splice(i, 1);
            }
        }

        for (let i = this.slowDownObjects.length - 1; i >= 0; i--) {
            if (this.slowDownObjects[i].isOffScreen(this.height)) {
                this.slowDownObjects.splice(i, 1);
            }
        }
        // TODO: If lives is 0, set gameOver and show restart UI.
        if (this.lives <= 0) {
            this.showGameOver();
        }

    }

    spawnItems(secondsPassed) {
        this.spawnTimer += secondsPassed;

        if (this.spawnTimer < this.spawnTime) {
            return;
        }

        this.spawnTimer = 0;

        // TODO: Randomly create either a FallingObject or an Obstacle.
        // Helpful values:
        // let x = Math.random() * (this.width - 40);
        const LANES = 19;
        const laneWidth = this.width / LANES;
        let lane = Math.floor(Math.random() * LANES);


        let shouldSpawnObstacle = Math.random() < 0.3;
        let shouldSpawnHeart = this.lives < 3 && Math.random() < 0.03;
        let shouldSpawnSpeed = Math.random() < 0.05;
        let shouldSpawnSlow = Math.random() < 0.05;
        // object example:

        if (shouldSpawnHeart) {
            let x = lane * laneWidth + (laneWidth - 32) / 2;
            this.heartObjects.push(new HeartObject(this.context, x, -32, 32, FALL_SPEED));
        } else
            if (shouldSpawnSpeed) {
                let x = lane * laneWidth + (laneWidth - 32) / 2;
                this.speedUpObjects.push(new SpeedUpObject(this.context, x, -32, 32, FALL_SPEED));
            } else
                if (shouldSpawnSlow) {
                    let x = lane * laneWidth + (laneWidth - 32) / 2;
                    this.slowDownObjects.push(new SlowDownObject(this.context, x, -32, 32, FALL_SPEED));
                } else
                    if (shouldSpawnObstacle) {
                        let x = lane * laneWidth + (laneWidth - 44) / 2;
                        this.obstacles.push(new Obstacle(this.context, x, -36, 44, 28, OBSTACLE_SPEED));
                    } else {
                        let x = lane * laneWidth + (laneWidth - 32) / 2;
                        this.fallingObjects.push(new FallingObject(this.context, x, -32, 32, FALL_SPEED));
                    }

    }

    start() {
        this.run = true;
        this.gameOver = false;
        this.oldTimeStamp = performance.now();
        this.ui.hideMessage();
    }

    restart() {
        this.score = 0;
        this.lives = START_LIVES;
        this.run = true;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.fallingObjects = [];
        this.obstacles = [];
        this.heartObjects = [];
        this.speedUpObjects = [];
        this.slowDownObjects = [];
        this.speedMultiplier = 1;
        this.createActors();
        this.oldTimeStamp = performance.now();
        this.ui.hideMessage();
    }

    showStart() {
        this.ui.showMessage("Catch Objects", "Start", () => this.start());
    }

    showGameOver() {
        this.run = false;
        this.gameOver = true;
        this.ui.showMessage("Game Over", "Restart", () => this.restart());
    }

    draw() {
        this.clear();
        this.drawBackground();
        this.fallingObjects.forEach((fallingObject) => fallingObject.draw());
        this.obstacles.forEach((obstacle) => obstacle.draw());
        this.heartObjects.forEach((heartObject) => heartObject.draw());
        this.speedUpObjects.forEach((speedUpObject) => speedUpObject.draw());
        this.slowDownObjects.forEach((slowDownObject) => slowDownObject.draw());
        this.catcher.draw();
        this.ui.updateGameInfo(this.score, this.lives);
    }

    drawBackground() {
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = "rgba(125, 211, 252, 0.08)";
        for (let x = 0; x < this.width; x += 42) {
            this.context.fillRect(x, 0, 1, this.height);
        }

        this.context.fillStyle = FLOOR_COLOR;
        this.context.fillRect(0, this.height - 36, this.width, 36);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    canvasX(clientX) {
        let rect = this.canvas.getBoundingClientRect();
        let scaleX = this.canvas.width / rect.width;
        return (clientX - rect.left) * scaleX;
    }
}
