var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;
var isPlayingSequence = false;

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("h1").text("Level " + level);

    isPlayingSequence = true; 
    playSequence().then(() => {
        isPlayingSequence = false;
        var buttonColors = ["red", "blue", "green", "yellow"];
        var randomNumber = Math.floor(Math.random() * 4);
        var randomChosenColor = buttonColors[randomNumber];
        gamePattern.push(randomChosenColor);

        $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
        playSound(randomChosenColor);
    });
}

function playSequence() {
    return new Promise((resolve) => {
        let i = 0;
        function playNextColor() {
            if (i < gamePattern.length) {
                var currentColor = gamePattern[i];
                $("#" + currentColor).fadeIn(100).fadeOut(100).fadeIn(100);
                playSound(currentColor);
                i++;
                setTimeout(playNextColor, 600); 
            } else {
                resolve();
            }
        }
        playNextColor();
    });
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 200);
    $("h1").text("Game Over, Press Any Key to Restart");
    startOver();
}

function startOver() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
    isPlayingSequence = false; // Restablecer estado
}

$(".btn").click(function () {
    if (started && !isPlayingSequence) { // Permitir clics solo si el juego ha comenzado y la secuencia no está en curso
        var userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);
        animatePress(userChosenColor);

        checkAnswer(userClickedPattern.length - 1);
    }
});

$(document).keypress(function () {
    if (!started) {
        $("h1").text("Level " + level);
        nextSequence();
        started = true;
    }
});
