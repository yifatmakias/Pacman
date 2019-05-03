// default tab
document.getElementById("defaultOpen").click();

// controls array
var controls = [];

// game settings
var num_balls;
var color_5_points;
var color_15_points;
var color_25_points;
var game_time;
var num_of_monsters;

// username
var pacman_name;

//slider in settings
var slider = document.getElementById("myRange");
var output = document.getElementById("slider_value");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

//game parameters
var context;
var shape;
var bonus;
var ghost1;
var ghost2;
var ghost3;
var direction_ghost1;
var direction_ghost2;
var direction_ghost3;
var direction_bonus;
var board;
var score;
var lives;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var audio;
var direction;
var users = [{username: "a", password: "a"}];
var intersection;
var game_over;
var ghost_radius;
var prev_ghost;
var prev_bonus;
var isMaxScore;
var isBonusEaten;
var isTimeUp;
var clock = new Image();
clock.src = "clock.png";
var pill = new Image();
pill.src = "pill.png";
var twoPills = new Image();
twoPills.src = "2pill.png";

function Start() {
    context = canvas.getContext("2d");
    shape = new Object();
    ghost1 = null;
    ghost2 = null;
    ghost3 = null;
    bonus = null;
    isMaxScore = false;
    isBonusEaten = false;
    isTimeUp = false;
    prev_ghost = 0;
    prev_bonus = 0;
    direction = "RIGHT";
    direction_bonus = "LEFT";
    ghost_radius = 15;
    intersection = false;
    game_over = false;
    board = new Array();
    score = 0;
    lives = 3;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = num_balls;
    var pacman_remain = 1;
    var ghost_remain = num_of_monsters;
    var point5_num = Math.floor(0.6 * food_remain);
    var point15_num = Math.floor(0.3 * food_remain);
    var point25_num = food_remain - point5_num - point15_num;
    audio = new Audio('introsound.mp3');
    audio.loop = true;
    audio.play();

    start_time = new Date();

    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        for (var j = 0; j < 10; j++) {
            if (i === 0 && j === 0) {
                board[i][j] = 3;
                ghost_remain--;
                ghost1 = new Object();
                ghost1.i = i;
                ghost1.j = j;
            }
            else if (i === 0 && j === 9 && ghost_remain > 0) {
                board[i][j] = 3;
                ghost_remain--;
                ghost2 = new Object();
                ghost2.i = i;
                ghost2.j = j;
            }
            else if (i === 9 && j === 0 && ghost_remain > 0) {
                board[i][j] = 3;
                ghost_remain--;
                ghost3 = new Object();
                ghost3.i = i;
                ghost3.j = j;
            }
            else if (i === 9 && j === 9) {
                board[i][j] = 7;
                bonus = new Object();
                bonus.i = i;
                bonus.j = j;
            }
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            else if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2) || (i === 7 && j === 6) || (i === 8 && j === 6) || (i === 6 && j === 6) || (i === 1 && j === 8) || (i === 2 && j === 8)) {
                board[i][j] = 4;
            } else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {
                    if (randomNum < 1.0 * point25_num / food_remain) {
                        point25_num--;
                        board[i][j] = 6;
                    }
                    else if (randomNum < 1.0 * point15_num / food_remain) {
                        point15_num--;
                        board[i][j] = 5;
                    }
                    else if (randomNum < 1.0 * point5_num / food_remain){
                        point5_num--;
                        board[i][j] = 1;
                    }
                    food_remain--;
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    shape.i = i;
                    shape.j = j;
                    pacman_remain--;
                    board[i][j] = 2;
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
        var index = 8;
        loop2:
            for (var k = 0; k < 10; k++) {
                for (var l = 0; l < 10; l++) {
                    if (index === 11) {
                        break loop2;
                    }
                    if (board[k][l] === 0) {
                        board[k][l] = index;
                        index++;
                    }
                }
            }

    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.which] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.which] = false;
    }, false);
    interval = setInterval(UpdatePosition, 250);
}


function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i, j];
}

/**
 * @return {number}
 */
function GetKeyPressed() {
    if (keysDown[controls[0]]) { // up
        return 1;
    }
    if (keysDown[controls[1]]) { // down
        return 2;
    }
    if (keysDown[controls[3]]) { // left
        return 3;
    }
    if (keysDown[controls[2]]) { //right
        return 4;
    }
}

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = lives;
    lblPacmanName.value = pacman_name;

    context.beginPath();
    context.rect(0, 0, 400, 400);
    context.strokeStyle = "#000000";
    context.stroke();
    context.closePath();

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 40 + 20;
            center.y = j * 40 + 20;
            var x_eye = center.x + 5;
            var y_eye = center.y - 15;
            if (board[i][j] === 2) {
                context.beginPath();
                switch(direction) {
                    case "UP":
                    context.arc(center.x, center.y, 20, 2*Math.PI-Math.PI*11/18, 2*Math.PI-Math.PI*7/18, true);
                    x_eye = center.x -15;
                    y_eye = center.y + 5;
                    break;
        
                    case "DOWN":
                    context.arc(center.x, center.y, 20, 2*Math.PI-Math.PI*29/18, 2*Math.PI-Math.PI*25/18, true);
                    x_eye = center.x -15;
                    y_eye = center.y + 5;
                    break;
        
                    case "LEFT":
                    context.arc(center.x, center.y, 20, 2*Math.PI-Math.PI*10/9, 2*Math.PI-Math.PI*8/9, true);
                    break;
        
                    case "RIGHT":
                    context.arc(center.x, center.y, 20, 2*Math.PI-Math.PI/9, 2*Math.PI-Math.PI*17/9, true);
                    break;
        
                    default:
                    break;                    
                }
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(x_eye, y_eye, 3, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = color_5_points; //color
                context.fill();
            }
            else if (board[i][j] === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
                context.fillStyle = color_15_points; //color
                context.fill();
            } 
            else if (board[i][j] === 6) {
                context.beginPath();
                context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
                context.fillStyle = color_25_points; //color
                context.fill();
            } 
             else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 20, center.y - 20, 40, 40);
                context.fillStyle = "grey"; //color
                context.fill();
            }
            else if (board[i][j] === 3) {
                // body
                context.beginPath();
                context.arc(center.x, center.y, ghost_radius, Math.PI,0,false);
                context.moveTo(center.x - ghost_radius, center.y);
                context.lineTo(center.x-ghost_radius, center.y + ghost_radius);
                context.lineTo(center.x-ghost_radius + ghost_radius/3, center.y + ghost_radius - ghost_radius/4);
                context.lineTo(center.x-ghost_radius + ghost_radius/3*2, center.y + ghost_radius);
                context.lineTo(center.x, center.y + ghost_radius - ghost_radius/4);
                context.lineTo(center.x + ghost_radius/3, center.y + ghost_radius);
                context.lineTo(center.x + ghost_radius/3*2, center.y + ghost_radius - ghost_radius/4);
                context.lineTo(center.x + ghost_radius, center.y + ghost_radius);
                context.lineTo(center.x + ghost_radius, center.y);
                context.fillStyle = "red"; //color
                context.fill();

                // eyes
                context.fillStyle = "white";
                context.strokeStyle = "white";
                context.beginPath();//left eye
                context.arc(center.x - ghost_radius/2.5, center.y - ghost_radius/5, ghost_radius/5, 0, Math.PI*2, true); // white
                context.fill();
        
                context.beginPath(); // right eye
                context.arc(center.x + ghost_radius/2.5, center.y - ghost_radius/5, ghost_radius/5, 0, Math.PI*2, true); // white
                context.fill();

                // eye balls
                context.fillStyle="black"; //left eyeball
				context.beginPath();
				context.arc(center.x - ghost_radius/3 + ghost_radius/15, center.y - ghost_radius/5, ghost_radius/6, 0, Math.PI*2, true); //black
				context.fill();

				context.fillStyle="black"; //right eyeball
				context.beginPath();
				context.arc(center.x + ghost_radius/3 + ghost_radius/5, center.y - ghost_radius/5, ghost_radius/6, 0, Math.PI*2, true); //black
				context.fill();
            }
            else if (board[i][j] === 7) {
                context.beginPath();
                context.rect(center.x - 15, center.y - 10, 30, 30);
                context.strokeStyle = "black"; //color
                context.stroke();
                context.closePath();
                context.beginPath();
                context.font = "12px Arial";
                context.fillText("+50", center.x-10, center.y+5);
            }
            else if (board[i][j] === 8) {
                context.drawImage(pill, center.x-20, center.y-20);
            }
            else if (board[i][j] === 9) {
                context.drawImage(clock, center.x-20, center.y-20);
            }
            else if (board[i][j] === 10) {
                context.drawImage(twoPills, center.x-20, center.y-20);
            }
        }
    }
}

function isValidStep(i, j) {
    if (j >= 0 && j <= 9 && i >= 0 && i <= 9 && board[i][j] !== 4 && board[i][j] !== 3 && board[i][j] !== 7 && board[i][j] !== 8 && board[i][j] !== 9 && board[i][j] !== 10) {
        return true;
    }
    else {
        return false;
    }
}

function isValidStepForBonus(i, j) {
    if (j >= 0 && j <= 9 && i >= 0 && i <= 9 && board[i][j] !== 4 && board[i][j] !== 3 && board[i][j] !== 2 && board[i][j] !== 8 && board[i][j] !== 9 && board[i][j] !== 10) {
        return true;
    }
    else {
        return false;
    }
}

function getBonusDirection(){
    var index = 0;
    var direction_array = [];
    // up move
    var up_i = bonus.i;
    var up_j = bonus.j - 1;

    // down move
    var down_i = bonus.i;
    var down_j = bonus.j + 1;

    // left move
    var left_i = bonus.i - 1;
    var left_j = bonus.j;

    // right move
    var right_i = bonus.i + 1;
    var right_j = bonus.j;

    if (isValidStepForBonus(up_i, up_j) === true) {
        direction_array[index] = "UP";
        index++;
    }
    if (isValidStepForBonus(down_i, down_j) === true) {
        direction_array[index] = "DOWN";
        index++;
    }
    if (isValidStepForBonus(left_i, left_j) === true) {
        direction_array[index] = "LEFT";
        index++;
    }
    if (isValidStepForBonus(right_i, right_j) === true) {
        direction_array[index] = "RIGHT";
        index++;
    }

    var random_index_step = Math.floor(Math.random() * (index-0)+0);
    if (direction_array[random_index_step] === "UP"){
        direction_bonus = "UP";
    }
    else if (direction_array[random_index_step] === "DOWN"){
        direction_bonus = "DOWN";
    }
    else if (direction_array[random_index_step] === "LEFT"){
        direction_bonus = "LEFT";
    }
    else if (direction_array[random_index_step] === "RIGHT"){
        direction_bonus = "RIGHT";
    }
}

function getGhostDirection(ghost, ghost_number){
    var distanceUp = Number.MAX_SAFE_INTEGER;
    var distanceDown = Number.MAX_SAFE_INTEGER;
    var distanceLeft = Number.MAX_SAFE_INTEGER;
    var distanceRight = Number.MAX_SAFE_INTEGER;
    var index = 0;
    var direction_array = [];
    // up move
    var up_i = ghost.i;
    var up_j = ghost.j - 1;

    // down move
    var down_i = ghost.i;
    var down_j = ghost.j + 1;

    // left move
    var left_i = ghost.i - 1;
    var left_j = ghost.j;

    // right move
    var right_i = ghost.i + 1;
    var right_j = ghost.j;

    if (isValidStep(up_i, up_j) === true) {
        distanceUp = Math.sqrt(Math.pow((up_i - shape.i) ,2) + Math.pow((up_j - shape.j) ,2));
        direction_array[index] = "UP";
        index++;
    }
    if (isValidStep(down_i, down_j) === true) {
        distanceDown = Math.sqrt(Math.pow((down_i - shape.i) ,2) + Math.pow((down_j - shape.j) ,2));
        direction_array[index] = "DOWN";
        index++;
    }
    if (isValidStep(left_i, left_j) === true) {
        distanceLeft = Math.sqrt(Math.pow((left_i - shape.i) ,2) + Math.pow((left_j - shape.j) ,2));
        direction_array[index] = "LEFT";
        index++;
    }
    if (isValidStep(right_i, right_j) === true) {
        distanceRight = Math.sqrt(Math.pow((right_i - shape.i) ,2) + Math.pow((right_j - shape.j) ,2));
        direction_array[index] = "RIGHT";
        index++;
    }

    var minDistance = Math.min(Math.min(distanceUp, distanceDown), Math.min(distanceLeft, distanceRight));
    var random_step = Math.random();
    if (random_step <= 0.6){
        var random_index_step = Math.floor(Math.random() * (index-0)+0);
        if (direction_array[random_index_step] === "UP"){
            minDistance = distanceUp;
        }
        if (direction_array[random_index_step] === "DOWN"){
            minDistance = distanceDown;
        }
        if (direction_array[random_index_step] === "LEFT"){
            minDistance = distanceLeft;
        }
        if (direction_array[random_index_step] === "RIGHT"){
            minDistance = distanceRight;
        }
    }

    switch(minDistance){
        case distanceUp:
        if (ghost_number === 1) {
            direction_ghost1 = "UP";
        }
        if (ghost_number === 2) {
            direction_ghost2 = "UP";
        }
        if (ghost_number === 3) {
            direction_ghost3 = "UP";
        }
        break;
        
        case distanceDown:
        if (ghost_number === 1) {
            direction_ghost1 = "DOWN";
        }
        if (ghost_number === 2) {
            direction_ghost2 = "DOWN";
        }
        if (ghost_number === 3) {
            direction_ghost3 = "DOWN";
        }
        break;

        case distanceLeft:
        if (ghost_number === 1) {
            direction_ghost1 = "LEFT";
        }
        if (ghost_number === 2) {
            direction_ghost2 = "LEFT";
        }
        if (ghost_number === 3) {
            direction_ghost3 = "LEFT";
        }
        break;

        case distanceRight:
        if (ghost_number === 1) {
            direction_ghost1 = "RIGHT";
        }
        if (ghost_number === 2) {
            direction_ghost2 = "RIGHT";
        }
        if (ghost_number === 3) {
            direction_ghost3 = "RIGHT";
        }
        break;
    } 
}

function newGame() {
    window.clearInterval(interval);
    Start();
}

function updateGhostPosition() {
    if (ghost1 !== null) {
        getGhostDirection(ghost1, 1);
        moveGhost(ghost1, direction_ghost1, 1);
    }
    if (ghost2 !== null) {
        getGhostDirection(ghost2, 2);
        moveGhost(ghost2, direction_ghost2, 2);
    }
    if (ghost3 !== null) {
        getGhostDirection(ghost3, 3);
        moveGhost(ghost3, direction_ghost3, 3);
    }
}

function updateBonusPosition() {
    if (bonus !== null && isBonusEaten === false) {
        getBonusDirection();
        moveBonus(direction_bonus);
    }
}

function moveBonus(bonus_direction) {
    board[bonus.i][bonus.j] = prev_bonus;
    switch(bonus_direction) {
        case "UP":
        bonus.j--;
        break;

        case "DOWN":
        bonus.j++;
        break;

        case "LEFT":
        bonus.i--;
        break;

        case "RIGHT":
        bonus.i++;
        break;
    }
    prev_bonus = board[bonus.i][bonus.j];
    board[bonus.i][bonus.j] = 7;
}

function moveGhost(ghost, ghost_dirction, ghost_num) {
    if (prev_ghost === 2) {
        score-=10;
        if (lives > 0) {
            lives-=1;
        }
        intersection = true;
        prev_ghost = 0;
        board[ghost.i][ghost.j] = prev_ghost;
        if (ghost_num === 1) {
            ghost.i = 0;
            ghost.j = 0;
        }
        if (ghost_num === 2) {
            ghost.i = 0;
            ghost.j = 9;
        }
        if (ghost_num === 3) {
            ghost.i = 9;
            ghost.j = 0;
        }
        prev_ghost = board[ghost.i][ghost.j];
        board[ghost.i][ghost.j] = 3;
    }
    else {
        board[ghost.i][ghost.j] = prev_ghost;
        switch(ghost_dirction) {
            case "UP":
            ghost.j--;
            break;
    
            case "DOWN":
            ghost.j++;
            break;
    
            case "LEFT":
            ghost.i--;
            break;
    
            case "RIGHT":
            ghost.i++;
            break;
        }
        prev_ghost = board[ghost.i][ghost.j];
        board[ghost.i][ghost.j] = 3;
    }
}

function UpdatePosition() {
    updateGhostPosition();
    updateBonusPosition();
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x === 1) {
        direction = "UP";
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4 && board[shape.i][shape.j - 1] !== 3) {
            shape.j--;
        }
    }
    if (x === 2) {
        direction = "DOWN";
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4 && board[shape.i][shape.j + 1] !== 3) {
            shape.j++;
        }
    }
    if (x === 3) {
        direction = "LEFT";
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4 && board[shape.i - 1][shape.j] !== 3) {
            shape.i--;
        }
    }
    if (x === 4) {
        direction = "RIGHT";
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4 && board[shape.i + 1][shape.j] !== 3) {
            shape.i++;
        }
    }
    if (intersection === true) {
        intersection = false;    
        var i = Math.floor(Math.random() * 10);
        var j = Math.floor(Math.random() * 10);
        while ((i === shape.i && j === shape.j) || board[i][j] === 4 || board[i][j] === 3 || board[i][j] === 7 || board[i][j] === 8 || board[i][j] === 9 || board[i][j] === 10) {
            i = Math.floor(Math.random() * 10);
            j = Math.floor(Math.random() * 10);
        }
        shape.i = i;
        shape.j = j;
    }
    if (board[shape.i][shape.j] === 1) {
        score+=5;
    }
    if (board[shape.i][shape.j] === 5) {
        score+=15;
    }
    if (board[shape.i][shape.j] === 6) {
        score+=25;
    }
    if (board[shape.i][shape.j] === 7) {
        score+=50;
        isBonusEaten = true;
    }
    if (board[shape.i][shape.j] === 8) {
        lives+=1;
    }
    if (board[shape.i][shape.j] === 10) {
        lives+=2;
    }
    if (board[shape.i][shape.j] === 9) {
        start_time = new Date();
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();

    time_elapsed = (currentTime - start_time) / 1000;
    Draw();

    if (game_over === true) {
        window.clearInterval(interval);
        window.alert("You Lost!");
        audio.pause();
    }
    else if (lives <= 0) {
        game_over = true;
    }
    else if (isMaxScore === true) {
        window.clearInterval(interval);
        window.alert("We have a Winner!!!");
        audio.pause();
    }
    else if (isTimeUp === true) {
        if (score < 150) {
            window.clearInterval(interval);
            window.alert("You can do better. Your score is: " + score);
            audio.pause();
        }
        else {
            window.clearInterval(interval);
            window.alert("We have a Winner!!!");
            audio.pause();
        }
    }
    else if (time_elapsed >= game_time) {
        isTimeUp = true;
    }
    loop1:
    for (var i =0; i < 10; i++) {
        for (var j =0; j < 10; j++) {
            if (board[i][j] === 1 || board[i][j] === 5 || board[i][j] === 6 || board[i][j] === 7) {
                isMaxScore = false;
                break loop1;
            }
            else {
                isMaxScore = true;
            }
        }
    }
}

  // about tab
  function aboutModalDialog() {
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.sho
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    // When the user clicks escape, close it
    window.onkeyup = function(event) {
        var modal = document.getElementById('myModal');
        if (event.keyCode == 27) {
            modal.style.display = "none";
        }
    }
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    if (tabName === 'about'){
        aboutModalDialog();
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
   
  }

  // jquery form validation
  $(document).ready(function() {
    $("#register-form").validate({
      rules: {
        username: {
          required: true,
        },
        psw: {
          required: true,
          regexp: '^[a-zA-Z0-9]{8,}$'
        },
        firstname: {
          required: true,
          regexp: '^[a-zA-Z]*$'
        },
        lastname: {
          required: true,
          regexp: '^[a-zA-Z]*$'
        },
        email: {
          required: true,
          email: true
        },
        bday: {
          required: true,
        }
  
      },
      messages: {
        username: {
          required: "This field cannot be null.",
        },
        psw: {
          required: "This field cannot be null",
          regexp: "Please input a password that contains at least 8 characters of numbers and letters.",
        },
        firstname: {
          required: "This field cannot be null",
          regexp: "Please input a password that contains only letters.",
        },
        lastname: {
          required: "This field cannot be null",
          regexp: "Please input a password that contains only letters.",
        },
        email: "Please enter a valid email address",
        bday: {
          required: "This field cannot be null",
        }
      }
  
    });
    jQuery.validator.addMethod(
      'regexp',
      function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
  })

  $("#register-form").submit(function(e) {
    if($(this).valid()) {
        alert("Your registration is completed successfully.");
        e.preventDefault();
        var username = document.getElementById("username-id").value;
        var password = document.getElementById("psw-id").value;
        var user = {};
        user.username = username;
        user.password = password;
        users.push(user);
    }
});


  function check_login() {
    var username = document.getElementById("loginusername").value;
    pacman_name = username;
    var password = document.getElementById("loginpsw").value;
    var settings_div = document.getElementById("settings");
    var login_div = document.getElementById("login-form");

    if (search(username, password) === true){
        login_div.style.display = "none";
        settings_div.style.display = "block";
    }
    else {
        alert("This user does not exist, please register first.")
    }
  }

  function search(username, password) {
      for (var i=0; i<users.length; i++) {
          if (users[i].username === username && users[i].password === password) {
              return true;
          }
      }
      return false;
  }

  function getGameControl(event, id) {
    var x = event.which || event.keyCode;
    if (id === "up") {
        document.getElementById("up_value").innerHTML = x;
        controls[0] = x;
    }
    if (id === "down") {
        document.getElementById("down_value").innerHTML = x;
        controls[1] = x;
    }
    if (id === "right") {
        document.getElementById("right_value").innerHTML = x;
        controls[2] = x;
    }
    if (id === "left") {
        document.getElementById("left_value").innerHTML = x;
        controls[3] = x;
    }
  }

  // random function for settings
  function randomSettings() {
    // set controls
    document.getElementById("up_value").innerHTML = 38;
    document.getElementById("down_value").innerHTML = 40;
    document.getElementById("right_value").innerHTML = 39;
    document.getElementById("left_value").innerHTML = 37;

    controls[0] = 38;
    controls[1] = 40;
    controls[2] = 39;
    controls[3] = 37;

    // set random number of balls
    num_balls = Math.floor(Math.random() * (90-50) + 50);
    document.getElementById("myRange").value = num_balls;
    //slider in settings
    var slider = document.getElementById("myRange");
    var output = document.getElementById("slider_value");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
    output.innerHTML = this.value;
    }
    // set random colors
    color_5_points = "#"+((1<<24)*Math.random()|0).toString(16);
    color_15_points = "#"+((1<<24)*Math.random()|0).toString(16);
    color_25_points = "#"+((1<<24)*Math.random()|0).toString(16);
    document.getElementById("5point").value = color_5_points;
    document.getElementById("15point").value = color_15_points;
    document.getElementById("25point").value = color_25_points;

    // set game time
    game_time = Math.floor(Math.random() * (36000-60) + 60);
    document.getElementById("game_time").value = game_time;

    // set monsters number
    num_of_monsters = Math.floor(Math.random() * (4-1) + 1);
    document.getElementById("num_of_monsters").value = num_of_monsters;
}

function set() {
        // check if all fields are valid
        if (controls.length !== 4) {
            alert("Please enter all the settings fields.");
            return;
        }

        // set number of balls
        num_balls = document.getElementById("myRange").value;

        // set colors
        color_5_points = document.getElementById("5point").value;
        color_15_points = document.getElementById("15point").value;
        color_25_points = document.getElementById("25point").value;

        // set game time
        game_time = document.getElementById("game_time").value;

        // set monsters number
        num_of_monsters = document.getElementById("num_of_monsters").value;

        var settings_div = document.getElementById("settings");
        var game_div = document.getElementById("game");
        settings_div.style.display = "none";
        game_div.style.display = "block";
        newGame();
}

