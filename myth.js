"use strict";

const canvas = document.createElement('canvas');
canvas.width = 160;
canvas.height = 140;
document.body.append(canvas);
const context = canvas.getContext('2d');
const blip = new Audio("./audio/blip.wav");
const click = new Audio("./audio/click.wav");
const select = new Audio("./audio/select.wav");
const die = new Audio("./audio/die.wav");

const SHEET = new Image(320, 144);
SHEET.onload = () => 
{
    context.drawImage(SHEET, 0, 0, 160, 144, 0, 0, 160, 144);
    context.drawImage(SHEET, 160, 0, 61, 15, 15, 74, 61, 15);
    context.drawImage(SHEET, 160, 15, 56, 13, 15, 94, 56, 13);
    context.drawImage(SHEET, 160, 28, 37, 16, 15, 114, 37, 16);
}
SHEET.src = "./image/sheet.png";

let option = 0;
let menu = true;

// MENU

function start()
{
    context.drawImage(SHEET, 0, 0, 160, 144, 0, 0, 160, 144);
    context.drawImage(SHEET, 160, 0, 61, 15, 15, 74, 61, 15);
    context.drawImage(SHEET, 160, 15, 56, 13, 15, 94, 56, 13);
    context.drawImage(SHEET, 160, 28, 37, 16, 15, 114, 37, 16);
    document.addEventListener('keydown', MENU_NAV, false);
    menu = true; 
    requestAnimationFrame(MENU)
}

window.requestAnimationFrame(MENU)

function MENU()
{
    if(menu)
    {
        context.fillStyle = "#222034";
        context.fillRect(4, 77, 5, 137)
        context.drawImage(SHEET, 160, 44, 5, 8, 4, option * 20 + 77, 5, 8);

        window.requestAnimationFrame(MENU);
    }
}

const MENU_NAV = key => 
{
    switch(key.key)
    {
        case "w":
            option = Math.max(option - 1, 0);
            click.play(); 
            break;
        case "s":
            option = Math.min(option + 1, 2);
            click.play();
            break;
        case "Enter":
            select.play();
            switch(option)
            {
                case 0:
                    if(!localStorage.getItem("win"))
                    {
                        document.removeEventListener('keydown', MENU_NAV, false);
                        menu = false;
                        context.drawImage(SHEET, 160, 52, 46, 45, 56, 50, 46, 45);
                        setTimeout(() => 
                        {
                            start();
                        }, 1000);
                    } else 
                    {
                        alert("you win")
                    }
                    break;
                case 2:
                    document.removeEventListener('keydown', MENU_NAV, false);
                    menu = false;
                    context.fillStyle = "#4b692f";
                    context.fillRect(30, 22, 100, 100);
                    document.addEventListener("keydown", SNEK_NAV, false);
                    window.requestAnimationFrame(SNEK);
                    head_x = 5;
                    head_y = 5;
                    velocity_x = 0;
                    velocity_y = 0;
                    apple_x = 3;
                    apple_y = 3;
                    snakeParts = [];
                    tailLength = 2;
                    gameover = false;
                    score = 3;
                    break;
                default:
                    document.removeEventListener('keydown', MENU_NAV, false);
                    menu = false;
                    context.drawImage(SHEET, 160, 52, 46, 45, 56, 50, 46, 45);
                    setTimeout(() => 
                    {
                        start();
                    }, 1000);
                    break;
            }
            break;
    }
}

document.addEventListener('keydown', MENU_NAV, false);

// SNEK

function die_fun()
{
    gameover = true; 
    die.play(); 
    document.removeEventListener('keydown', SNEK_NAV, false); 
    setTimeout(() => { start() }, 2000);
}

class SnakePart
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

let color = "#5b6ee1";

let head_x = 5;
let head_y = 5;
let velocity_x = 0;
let velocity_y = 0;
let apple_x = 3;
let apple_y = 3;
let snakeParts = [];
let tailLength = 2;
let gameover = false;
let score = 3;

function SNEK()
{
    head_x += velocity_x;
    head_y += velocity_y;

    if(!(velocity_x === 0 && velocity_y === 0))
    {
        if(head_x < 0) { die_fun(); }
        if(head_y < 0) { die_fun(); }
        if(head_x > 9) { die_fun(); }
        if(head_y > 9) { die_fun(); }

        for(let i = 0; i < snakeParts.length; i++)
        {
            let part = snakeParts[i];
            if(part.x === head_x && part.y === head_y)
            {
                die_fun();
                break;
            }
        }
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, 160, 144)

    context.fillStyle = "#4b692f";
    context.fillRect(30, 22, 100, 100);

    if(head_x == apple_x && head_y == apple_y)
    {
        apple_x = Math.floor(Math.random() * 10);
        apple_y = Math.floor(Math.random() * 10);
        score++;
        tailLength++;
        if(score === 25)
        {
            console.log('01101000 01100001 01101000 01100001 00100000 01101110 01101111 00100000 01101100 01101111 01110010 01100101 00100000 01101000 01100101 01110010 01100101 00101100 00100000 01111001 01100101 01110100')
        }
        blip.play();
    }
        
    context.drawImage(SHEET, 160, 117, 8, 8, apple_x * 10 + 31, apple_y * 10 + 23, 8, 8);

    context.fillStyle = color; 
    if(velocity_x == -1)
    {
        context.drawImage(SHEET, 160, 97, 10, 10, head_x * 10 + 30, head_y * 10 + 22, 10, 10);
    } 
    if(velocity_x == 1)
    {
        context.drawImage(SHEET, 170, 97, 10, 10, head_x * 10 + 30, head_y * 10 + 22, 10, 10);
    }
    if(velocity_y == -1)
    {
        context.drawImage(SHEET, 170, 107, 10, 10, head_x * 10 + 30, head_y * 10 + 22, 10, 10);
    }
    if(velocity_y == 1)
    {
        context.drawImage(SHEET, 160, 107, 10, 10, head_x * 10 + 30, head_y * 10 + 22, 10, 10);
    }
    for(let i = 0; i < snakeParts.length; i++)
    {
        let part = snakeParts[i];
        context.fillRect(part.x * 10 + 30, part.y * 10 + 22, 10, 10);
    }
    snakeParts.push(new SnakePart(head_x, head_y))
    if(snakeParts.length > tailLength)
    {
        snakeParts.shift();
    }

    let score_array = score.toString().split("");
    if(score_array.length === 1) score_array.unshift(0);
    context.drawImage(SHEET, 168 + score_array[0] * 3, 117, 3, 5, 0, 0, 3, 5)
    context.drawImage(SHEET, 168 + score_array[1] * 3, 117, 3, 5, 4, 0, 3, 5)

    if(!gameover)
    {
        setTimeout(() => 
        {
            window.requestAnimationFrame(SNEK);
        }, 100);
    }
}

const SNEK_NAV = key => 
{
    switch(key.key)
    {
        case "w":
            if(velocity_y == 1) return;
            velocity_y = -1;
            velocity_x = 0;
            break;
        case "a":
            if(velocity_x == 1) return;
            velocity_y = 0;
            velocity_x = -1;
            break;
        case "s":
            if(velocity_y == -1) return;
            velocity_y = 1;
            velocity_x = 0;
            break;
        case "d":
            if(velocity_x == -1) return;
            velocity_y = 0;
            velocity_x = 1;
            break;
    }
}
