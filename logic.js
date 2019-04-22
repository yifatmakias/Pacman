// default tab
document.getElementById("defaultOpen").click();

var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = [{username: "a", password: "a"}];

Start();

function Start() {
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
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
                    food_remain--;
                    board[i][j] = 1;
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
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
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
    if (keysDown['ArrowUp']) {
        return 1;
    }
    if (keysDown['ArrowDown']) {
        return 2;
    }
    if (keysDown['ArrowLeft']) {
        return 3;
    }
    if (keysDown['ArrowRight']) {
        return 4;
    }
}

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] === 2) {
                context.beginPath();
                context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 4) {
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
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
        }
    }
    if (x === 2) {
        if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
        }
    }
    if (x === 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
        }
    }
    if (x === 4) {
        if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
        }
    }
    if (board[shape.i][shape.j] === 1) {
        score++;
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (score === 50) {
        window.clearInterval(interval);
        window.alert("Game completed");
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
    alert("Your registration is completed successfully.")
    e.preventDefault();
    var username = document.getElementById("username-id").value;
    var password = document.getElementById("psw-id").value;
    var user = {};
    user.username = username;
    user.password = password;
    users.push(user);
});

  function push_to_dic() {
      alert("Your registration is completed successfully.")
      var username = document.getElementById("username-id").value;
      var password = document.getElementById("psw-id").value;
      var user = {};
      user.username = username;
      user.password = password;
      users.push(user);
  }

  function check_login() {
    var username = document.getElementById("loginusername").value;
    var password = document.getElementById("loginpsw").value;
    var game_div = document.getElementById("game");
    var login_div = document.getElementById("login-form");

    if (search(username, password) === true){
        login_div.style.display = "none";
        game_div.style.display = "block";
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

