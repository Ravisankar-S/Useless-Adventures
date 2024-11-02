let clickCount = 0;
const button = document.getElementById("startButton");

const initialPosition = {
    x: '50%',
    y: '70%'
};

function randomizeButtonPosition() {  
  const buttonWidth = button.offsetWidth;  
  const buttonHeight = button.offsetHeight;  
  const viewportWidth = window.innerWidth;  
  const viewportHeight = window.innerHeight;  

  const pathWidth = 600;  
  const pathX = (viewportWidth - pathWidth) / 2;  
  const pathY = (viewportHeight - pathWidth) / 2;  

  const randomX = Math.random() * pathWidth + pathX;  
  const randomY = Math.random() * pathWidth + pathY;  

  button.style.left = `${randomX}px`;  
  button.style.top = `${randomY}px`;  
}

function resetButtonPosition() {
    button.style.left = initialPosition.x;
    button.style.top = initialPosition.y;
    button.style.transform = 'translate(-50%, -50%)';
}

resetButtonPosition();

button.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 20) {
        resetButtonPosition();
        button.textContent = "Let's Start"; 
        return; 
    }

    randomizeButtonPosition();

    if (clickCount < 7) {
        button.textContent = "Let's Start";
    } else if (clickCount === 7) {
        button.textContent = "Common Buddy";
    } else if (clickCount === 12) {
      button.textContent = "You Can Do It";
    } else if (clickCount === 16) {
      button.textContent = "Almost There!";
    }
    if (clickCount === 19) {
        alert("Ok you win. Click on the button and move on");
        button.textContent = "MOVE ON";
        button.onclick = function() {
            window.location.href = "templates/ffriend.html"; 
        };
    }
});
