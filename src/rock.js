class Rock {

  move(element, direction, pace) {
    if (direction === 'left') {
      if (parseInt(element.style.left) > 5.2) {
        element.style.left = parseInt(element.style.left) + -pace + 'px';
      }
    } else if (direction === 'right') {
      if (parseInt(element.style.left) < 310) {
        element.style.left = parseInt(element.style.left) + pace + 'px';
      }
    } else if (direction === 'up') {
      if (parseInt(element.style.bottom) > 5.2) {
        element.style.bottom = parseInt(element.style.bottom) + pace + 'px';
      }
    } else if (direction === 'down') {
      if (parseInt(element.style.bottom) < 310) {
        element.style.bottom = parseInt(element.style.bottom) + -pace + 'px';
      }
    }
  }

  checkCollision(rock) {

    let bottom = parseInt(rock.style.bottom)
    let dodger = document.getElementById('dodger')

    if (bottom < 25) {
      const dodgerLeftEdge = parseInt(dodger.style.left)
      const dodgerRightEdge = dodgerLeftEdge + 40;
      const rockLeftEdge = parseInt(rock.style.left)
      const rockRightEdge = rockLeftEdge + 60;

      if ((rockLeftEdge <= dodgerLeftEdge && rockRightEdge >= dodgerLeftEdge) ||
          (rockLeftEdge <= dodgerLeftEdge && rockRightEdge >= dodgerRightEdge) ||
          (rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerRightEdge)) {
        return true
      }
    }
  }

  createRock(x) {

    let game = document.getElementById('game');
    let rock = document.createElement('div');

    rock.className = 'rock'
    rock.style.left = `${x}px`

    rock.style.bottom = '390px';

    game.appendChild(rock);

    const that = this;

    function animate() {
      rock.style.bottom = parseInt(rock.style.bottom) + -1 + 'px';
      setTimeout(function () {
        if (that.checkCollision(rock)){
          alert("you lost");




          let main = document.querySelector('main')
          while (main.firstChild) {
            main.removeChild(main.firstChild);
          }

          let game = document.createElement('div')
          game.id = 'game';

          main.appendChild(game);




          
        } else {
          if (parseInt(rock.style.bottom) > 0) {
            animate()
          } else {
            rock.remove();
          }
        }
      }, 1);
    }
    animate();
  }
}
