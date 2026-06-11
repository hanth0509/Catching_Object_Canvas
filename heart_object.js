const HEART_COLOR = "#c522b8";
const HEART_DARK_COLOR = "#2e0a35";

class HeartObject extends GameObject {
    constructor(context, x, y, size, speed) {
        super(context, x, y, size, size, 0, speed);
    }

    update(secondsPassed) {
        super.update(secondsPassed);
    }

    draw() {
        this.context.fillStyle = HEART_COLOR;

        this.context.font = `${this.width}px Arial`;
        this.context.fillText(
            "❤",
            this.x,
            this.y + this.height
        );
    }

    isOffScreen(boardHeight) {
        return this.bottom() > boardHeight;
    }
}