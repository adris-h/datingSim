

const bodyElement = document.body;
const bcgUrl = 'images/bcg1.jpg';

/*
* bodyElement.style.backgroundImage = `url(${bcgUrl})`;
bodyElement.style.backgroundSize = 'cover';
bodyElement.style.backgroundPosition = 'center';
bodyElement.style.backgroundRepeat = 'no-repeat';
* */

//const container = document.querySelector('.text-anim');
let animationDone = false;
let timeline = null;

function animeTween(letters, mainTarget) {
    animationDone = false;

    const textWrapper = document.querySelector('.text-anim .letters');
    if (textWrapper) {
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        document.querySelectorAll('.text-anim .letter').forEach(l => {
            l.style.display = 'inline-block';
            l.style.opacity = 0;
        });
    }

    if (timeline) {
        timeline.pause();
        timeline = null;
    }

    timeline = anime.timeline({
        complete: function() {
            animationDone = true;
            console.log("Animation complete");
        }
    });

    timeline.add({
        targets: letters,
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutExpo',
        delay: (el, i) => 40 * (i + 1)
    });
}

function isAnimationDone() {
    return animationDone;
}

function completeAnimation() {
    if (timeline && !animationDone) {
        timeline.seek(timeline.duration);
        animationDone = true;
    }
}
export { animeTween, isAnimationDone, completeAnimation };