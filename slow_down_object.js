class SlowDownObject extends GameObject {
    constructor(context, x, y, size, speed) {
        super(context, x, y, size, size, 0, speed);
    }

    update(secondsPassed) {
        super.update(secondsPassed);
    }

    draw() {
        this.context.font = `${this.width}px Arial`;
        this.context.fillText("🎃", this.x, this.y + this.height);
    }

    isOffScreen(boardHeight) {
        return this.bottom() > boardHeight;
    }
}