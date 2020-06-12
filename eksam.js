class Expression {
    constructor(a, operation, b) {
        this.operation = operation;
        this.a = a;
        this.b = b;
    }
    get evaluation() {
        switch(this.operation) {
            case '+':
                return this.a + this.b;
            case '-':
                return this.a - this.b;
            case '*':
                return this.a * this.b;
            case '/':
                return this.a / this.b;
        }
    }
    get string() {
        return this.a.toString() + ' ' + this.operation + ' ' + this.b.toString();
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    setX(x) { this.x = x; }
    setY(y) { this.y = y; }
    draw(expr) {
        context.fillStyle = "darkgray";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = "black";
        if(movementEligible)
            context.strokeRect(this.x, this.y, this.width, this.height);
        context.fillStyle = "black";
        context.fillText(expr.string, this.x + this.width / 2, this.y + this.height / 2);
    }
    get rightmost() { return this.x + this.width; }
    get bottommost() { return this.y + this.height; }
}

var gameStart, gameEnd;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font = "18px Arial";
context.lineWidth = 4;
var rectangle;
var speedPercentage = 1.25; // how many percent of the canvas' height the rectangle moves with each second
var speed = speedPercentage * canvas.height / 100; // pixels per second
var notification = document.getElementById("notification");
var button = document.getElementById("startstop");
var ongoing = false;
var interval;
var expr;
var counter;
var movementEligible = true;

function gameOver() {
    if(rectangle.x + rectangle.width >= canvas.width)
    {
        ongoing = false;
        return "win";
    }
    else if(rectangle.y + rectangle.height >= canvas.height)
    {
        ongoing = false;
        return "loss";
    }
    else return "false";
}

function refreshExpr() {

    //Child mode
    let _a = Math.round(Math.random() * 10);
    let _b = Math.round(Math.random() * 10);

    /*Testing mode :)
    let _a = 0;
    let _b = 0;
    */
    expr = new Expression(_a, '*', _b);
}

function check() {
    if(!ongoing) {
        beginGame();
    }
    else {
        endGame();
    }
    ongoing = !ongoing;
}

function beginGame() {
    refreshExpr();
    counter = 0;
    button.innerHTML = "<b>Lõpeta</b>";
    context.clearRect(0, 0, canvas.width, canvas.height);
    rectInterval = setInterval(gameLoop, 3000);
    gameStart = new Date();
    notification.innerHTML = "";
    rectangle = new Rectangle(0, 0, 100, 100);
    rectangle.draw(expr);
}

function endGame() {
    gameEnd = new Date();
    button.innerHTML = "<b>Alusta</b>";
    clearInterval(rectInterval);
}

function gameLoop()
{
    refreshExpr();
    if(counter == 2) {
        counter = 0;
        movementEligible = true;
    }
    let currentTime = new Date();
    let duration = (currentTime - gameStart) / 1000; //in seconds
    rectangle.setY(Math.round(duration * speed));
    console.log(Math.round(duration * speed));
    context.clearRect(0, 0, canvas.width, canvas.height);
    rectangle.draw(expr);
    if(gameOver() == "win") {
        notification.innerHTML = "<b>Võitsid!</b>";
        endGame();
    }
    else if(gameOver() == "loss") {
        notification.innerHTML = "<b>Kaotasid!</b>";
        endGame();
    }
    counter += 1;
}

//add call function on keypress
var input = document.getElementById("answer");
document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        if(ongoing) {
            var tbl = document.getElementById("history");
            var tr = document.createElement("tr");

            var td1 = document.createElement("td");
            td1.innerHTML = expr.string;
            tr.appendChild(td1);

            var td2 = document.createElement("td");
            td2.innerHTML = Math.round(parseInt(document.getElementById("answer").value));
            tr.appendChild(td2);

            var td3 = document.createElement("td");
            if(Math.round(expr.evaluation) == Math.round(parseInt(document.getElementById("answer").value))) {
                td3.innerHTML = "<b>Tõene</b>";
                tr.style.backgroundColor = "rgb(129, 255, 129)";
                if(movementEligible) {
                    rectangle.move(rectangle.width, 0);
                    movementEligible = false;
                }
            }
            else
                {
                    td3.innerHTML = "<b>Väär</b>";
                    tr.style.backgroundColor = "rgb(255, 64, 64)";
                }

            tr.appendChild(td3);
            tbl.appendChild(tr);
            answer.value = null;
        }
    }
};