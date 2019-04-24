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

var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score;
var lives;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var audio;
var direction = "RIGHT";
var users = [{username: "a", password: "a"}];

function Start() {
    board = new Array();
    score = 0;
    lives = 3;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = num_balls;
    var pacman_remain = 1;
    var point5_num = Math.floor(0.6 * food_remain);
    var point15_num = Math.floor(0.3 * food_remain);
    var point25_num = food_remain - point5_num - point15_num;
    audio = new Audio('introsound.mp3');
    audio.loop = true;
    audio.play();

    start_time = new Date();

    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
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
    context.rect(0, 0, 600, 600);
    context.strokeStyle = "#000000";
    context.stroke();
    context.closePath();

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            var x_eye = center.x + 5;
            var y_eye = center.y - 15;
            if (board[i][j] === 2) {
                context.beginPath();
                switch(direction) {
                    case "UP":
                    context.arc(center.x, center.y, 30, 2*Math.PI-Math.PI*11/18, 2*Math.PI-Math.PI*7/18, true);
                    x_eye = center.x -15;
                    y_eye = center.y + 5;
                    break;
        
                    case "DOWN":
                    context.arc(center.x, center.y, 30, 2*Math.PI-Math.PI*29/18, 2*Math.PI-Math.PI*25/18, true);
                    x_eye = center.x -15;
                    y_eye = center.y + 5;
                    break;
        
                    case "LEFT":
                    context.arc(center.x, center.y, 30, 2*Math.PI-Math.PI*10/9, 2*Math.PI-Math.PI*8/9, true);
                    break;
        
                    case "RIGHT":
                    context.arc(center.x, center.y, 30, 2*Math.PI-Math.PI/9, 2*Math.PI-Math.PI*17/9, true);
                    break;
        
                    default:
                    break;                    
                }
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(x_eye, y_eye, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
                context.fillStyle = color_5_points; //color
                context.fill();
            }
            else if (board[i][j] === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 11, 0, 2 * Math.PI); // circle
                context.fillStyle = color_15_points; //color
                context.fill();
            } 
            else if (board[i][j] === 6) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = color_25_points; //color
                context.fill();
            } 
             else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 30, center.y - 30, 60, 60);
                context.fillStyle = "grey"; //color
                context.fill();
            }
        }
    }


}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x === 1) {
        direction = "UP";
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
        }
    }
    if (x === 2) {
        direction = "DOWN";
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
        }
    }
    if (x === 3) {
        direction = "LEFT";
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
        }
    }
    if (x === 4) {
        direction = "RIGHT";
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
        }
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
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (lives === 0) {
        window.clearInterval(interval);
        window.alert("You Lost!");
        audio.pause();
    }
    if (time_elapsed >= game_time) {
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
    if (score === 50) {
        window.clearInterval(interval);
        window.alert("Game completed");
        audio.pause();
    } else {
        Draw();
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
        Start();
}

