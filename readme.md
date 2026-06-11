# Catching Object Canvas Game

## Introduction

Catching Object is a simple HTML5 Canvas game developed using JavaScript and CSS. The player controls a catcher to collect good items, avoid obstacles, and survive as long as possible while achieving the highest score.

## Demo

Live Demo:
https://hanth0509.github.io/Catching_Object_Canvas/

## Features

* Catch falling objects to earn points.
* Lose lives when missing objects or hitting obstacles.
* Heart items restore one life (maximum 3 lives).
* Speed Up items increase falling speed.
* Slow Down items decrease falling speed.
* Final score is displayed on the Game Over screen.
* Restart functionality.
* Lane-based spawning system.

## Controls

* Left Arrow: Move left
* Right Arrow: Move right
* Mouse: Move catcher with cursor
* Touch: Move catcher on mobile devices

## Technologies Used

* HTML5 Canvas
* JavaScript (ES6)
* CSS3

## Project Structure

* `index.html` creates the game canvas and loads all scripts.
* `style.css` styles the page, canvas, game HUD, and buttons.
* `game_object.js` contains the base game object class with movement and collision detection helpers.
* `catcher.js` contains the player catcher class and movement logic.
* `falling_object.js` contains score objects that increase the player's score when collected.
* `obstacle.js` contains obstacle objects that reduce the player's lives.
* `heart_object.js` contains heart items that restore one life.
* `speed_up_object.js` contains items that increase the falling speed of objects.
* `slow_down_object.js` contains items that decrease the falling speed of objects.
* `game_ui.js` creates the score, lives, start screen, and game over UI.
* `game.js` manages the game loop, spawning system, collision handling, scoring, lives, and game states.

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/hanth0509/Catching_Object_Canvas.git
```

2. Open `index.html` in a web browser.

