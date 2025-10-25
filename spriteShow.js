import * as TextAnimation from './textAnimation.js';
const milaSprite = document.getElementById("mila");
const changChang = document.getElementById("chang");

let currentSprite = "none";

let currentExpression = "neutral";

const sprites = document.querySelectorAll(".sprite");
function showSprite(spriteName, talking = true, expression = "neutral") {
    currentExpression = expression;
    const spriteElement = document.getElementById(spriteName);

    if(spriteName === "none"){
        sprites.forEach(sprite => sprite.classList.remove("active"));
        if(window.spriteInterval) clearInterval(window.spriteInterval);
        return;
    }

    sprites.forEach(sprite => sprite.classList.remove("active"));
    spriteElement.classList.add("active");

    if (window.spriteInterval) clearInterval(window.spriteInterval);

    const spriteDiv = spriteElement.querySelector("div");
    const spriteBackgrounds = [
        `images/characters/${spriteName}/${spriteName}_${currentExpression}.png`,
        `images/characters/${spriteName}/${spriteName}_${currentExpression}_talk.png`
    ];

    const spriteImages = spriteBackgrounds.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });
    let index = 0;
    spriteDiv.style.background = `url(${spriteBackgrounds[0]}) no-repeat center center/cover`;

    if(talking) {
        window.spriteInterval = setInterval(() => {
            spriteDiv.style.background = `url(${spriteBackgrounds[index]}) no-repeat center center/cover`;
            index = (index + 1) % spriteBackgrounds.length;
        }, 300);

        const checkAnimationDone = setInterval(() => {
            if (TextAnimation.isAnimationDone() && currentExpression !== "balance") {
                clearInterval(window.spriteInterval);
                spriteDiv.style.background = `url(${spriteBackgrounds[0]}) no-repeat center center/cover`;
                clearInterval(checkAnimationDone);
            }
        }, 10);
    }
}



function changeExpression(newExpression) {
    currentExpression = newExpression;
}
export {showSprite, changeExpression};