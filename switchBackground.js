const backgrounds = document.querySelectorAll(".bcg");
//let toShow, toHide;

function SwitchBackground(currentBcg){
    backgrounds.forEach((bg, index) => {
        if(index + 1 === currentBcg){
            //bg.style.backgroundImage = `url(images/bcg${currentBcg}.jpg)`;
            bg.classList.add("active");
        } else{

            bg.classList.remove("active");
        }
    });

    console.log("current bcg: ", currentBcg );


}
export {SwitchBackground};