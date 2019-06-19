class Pong {

  constructor() {
    this.gameInterval = null;
    this.score = 0;
  }

  addUserPaddle() {
    const game = document.getElementById('game');
    let paddle = document.createElement('div');

    paddle.id = 'user-paddle';
    paddle.style.bottom = '160px';
    paddle.style.left = '10px';

    game.appendChild(paddle);
  }

  addComputerPaddle() {

    const game = document.getElementById('game');
    let paddle = document.createElement('div');

    paddle.id = 'computer-paddle';
    paddle.style.bottom = '160px';
    paddle.style.left = '380px';

    game.appendChild(paddle);
  }

  addBall() {

    const game = document.getElementById('game');
    let ball = document.createElement('div');

    ball.className += 'ball';
    ball.style.bottom = '193px';
    ball.style.left = '193px';

    game.appendChild(ball);
  }



  checkCollision(ballObj, user, comp ) {

    let score = document.getElementById('score');

    let min = 12
    let halfH = 40
    console.log(ballObj, user, comp);
    if (ballObj.x > 390 || ballObj.x < 0) {
      // check if ball hit front or back wall
      return this.endGame();
    } else if ((ballObj.x - user.x > 0) && (ballObj.x - user.x <= min) && (ballObj.y - user.y > 70) && (ballObj.y - user.y <= 85)) {
      // check top of user paddle for collision
      return 3;
    } else if ((ballObj.x - user.x > 0) && (ballObj.x - user.x <= min) && (ballObj.y - user.y > -10) && (ballObj.y - user.y <= 5)) {
      // check botton of user paddle for collision
      return 4;
    } else if ((ballObj.x - user.x > 0) && (ballObj.x - user.x <= min) && (ballObj.y - user.y > 5) && (ballObj.y - user.y <= 70)) {
      // check mid of user paddle for collision
      return 1;
    } else if ((comp.x - 6 - ballObj.x < min) && (ballObj.y - comp.y > 0) && (comp.y - ballObj.y <= 80)) {
      //check if ball hit computer paddle
      score.textContent = `score: ${parseInt(score.textContent.substr(6)) + 1}`;
      return 1;
    } else if (ballObj.y > 385 || ballObj.y < 5) {
      return 2;
    }
    return 0;
  }

  update(ballObj, user, comp) {
    // ball movement
    switch(this.checkCollision(ballObj, user, comp)) {
      case 0:
        break;
      case 3:
        ballObj.vectY = ballObj.vectY + 1;
        ballObj.vectX = -ballObj.vectX;
        break
      case 4:
        ballObj.vectY = ballObj.vectY - 1;
        ballObj.vectX = -ballObj.vectX;
        break;
      case 1:
        if (ballObj.vectY === 0) {
          ballObj.vectY = 3;
          ballObj.vectX = -ballObj.vectX;
        } else if (ballObj.vectX < 12) {
          ballObj.vectX = -1.05 * ballObj.vectX;
        } else {
          ballObj.vectX = -ballObj.vectX;
        }
        break;
      case 2:
        ballObj.vectY = -ballObj.vectY;
        break;
    }
    ballObj.x = ballObj.x + ballObj.vectX;
    ballObj.y = ballObj.y + ballObj.vectY;

    // computer movement
    if (ballObj.y - comp.y > 12) {
      comp.y = comp.y + ballObj.vectY;
    } else if (ballObj.y - comp.y < 12) {
      comp.y = comp.y - ballObj.vectY;
    }
  }

  draw(ballObj, user, comp) {
    let ball = document.querySelector('.ball');
    ball.style.left = ballObj.x +'px';
    ball.style.bottom = ballObj.y +'px';

    let player = document.getElementById('user-paddle');
    player.style.left = user.x+'px';
    player.style.bottom = user.y+'px';

    let computer = document.getElementById('computer-paddle');
    computer.style.left = comp.x+'px';
    computer.style.bottom = comp.y+'px';
  }

  addListen(user) {
    document.addEventListener("keydown", function(e) {
      if (e.key === "ArrowUp" && user.y < 310) {
        user.y = user.y + 7;
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "ArrowDown" && user.y > 7) {
        user.y = user.y - 7;
      }
    });
  }

  start() {
    let score = document.getElementById('score');
    score.textContent = 'score:0';


    let game = document.getElementById('game');
    let startButton = document.createElement('button');

    startButton.textContent = 'start'
    startButton.id = 'start'

    startButton.addEventListener('click', () => {
      startButton.style.display = 'none';
      startBall();
    })

    let highScores = document.getElementById('high-scores');

    loadScores();

    function loadScores() {
      fetch('http://localhost:3000/scores')
      .then(res => res.json())
      .then(json => {
        displayScores(json);
      })
    }

    function displayScores(json) {
      let scoreArr = [];
      for (let i = 0; i < json.length; i++) {
        if (json[i].game_id == 2) {
          scoreArr.push(json[i]);
        }
      }
      console.log(scoreArr);
      scoreArr.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));

      scoreArr.forEach((scr) => {
        let score = document.createElement('li');
        score.className += 'high-scores';
        score.textContent = `${scr.player}: ${scr.score}`;

        highScores.appendChild(score);
      });
    }

    game.appendChild(startButton);

    const that = this;

    function startBall() {
      let ballObj = new Ball(192, 192, 0, 0);
      let user = new Paddle(10, 160);
      let comp = new Paddle(380, 160);
      ballObj.vectX = -5;
      ballObj.vectY = 3;
      that.addListen(user);

      that.gameInterval = setInterval(function(){
        that.update(ballObj, user, comp);
        that.draw(ballObj, user, comp);
      }, 30);
    }
  }

  endGame(ballObj, user, comp) {
    ballObj = null;
    user = null;
    comp = null;
    clearInterval(this.gameInterval);
    alert('howdy');
  }
}

class Ball {
  constructor(x, y, vectX, vectY) {
    this.x = x;
    this.y = y;
    this.vectX = vectX;
    this.vectY = vectY;
  }
}

class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
