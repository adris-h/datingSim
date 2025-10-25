const dialogueFilePath = "dialogues.json";



async function getDialogueLines() {
    let response = await fetch(`${dialogueFilePath}`);
    return await response.json();
}

//import { animeTween } from "./textAnimation.js";
import { SwitchBackground } from "./switchBackground.js";
import * as TextAnimation from "./textAnimation.js";

const chosenChoices = {};

//let currentDialogue = "beatrice-2" //mc-1

let currentDialogue = "mc-1";

const body = document.querySelector("body");

let textblock = document.querySelector(".text-anim");
let dialogueSpeaker = document.getElementById("char-name");
let dialogueText = document.getElementById("char-dialogue");
let dialogueChoice1 = document.getElementById("ch-1");
let dialogueChoice2 = document.getElementById("ch-2");

let dialogueChoice3 = document.getElementById("ch-3");
let dialogueChoice4 = document.getElementById("ch-4");

const mainBox = document.getElementById("text-block");

let allDialogues = {};

let lovePoints = document.getElementById("love-fill");
let currentLovePoints = 0;

lovePoints.style.width = currentLovePoints + "%" ;

function updateLovePoints(){
    lovePoints.style.width = currentLovePoints + "%" ;
}

getDialogueLines().then(data => {
    allDialogues = data;
    loadDialogue(currentDialogue);
});


let jAvailable = false;


const continueButton = document.getElementById("c-button")
const milaNameWrapper = document.querySelector("#mila-row td:nth-child(1)");
const milaLikesWrapper = document.querySelector("#mila-row td:nth-child(2)");
let name = "";


const inputContainer = document.getElementById("input-container");

import { showSprite } from "./spriteShow.js";

const chapter2Btn = document.querySelector("#chapter2-btn");

function loadDialogue(currentDialogue) {
    const dialogue = allDialogues[currentDialogue];
    console.log(dialogue.speaker);
    dialogueSpeaker.innerText = dialogue.speaker;

    dialogueText.innerText = "";
    dialogueText.style.opacity = "0";

    console.log(dialogue.sprite)

    if(dialogue.sprite){
        showSprite(dialogue.sprite, dialogue.talking, dialogue.expression || "neutral");
    }


    if(dialogue.input){
        inputContainer.innerHTML ='<input type="text" id="name-input" placeholder="Enter your name">';
        const nameInput = document.getElementById("name-input");
        textblock.style.display = "none";

        continueButton.onclick = () => {
            name = nameInput.value.trim();
            if(name === ""){
                console.log("name is required");
            } else{

                currentDialogue = dialogue.next;
                loadDialogue(currentDialogue);
            }
        }
    } else{
        inputContainer.innerHTML = '';
        textblock.style.display = "flex";

        let displayText = dialogue.text;
        if(name) displayText = displayText.replace("{name}", name)

        setTimeout(() => {
            dialogueText.innerText = displayText;
            dialogueText.style.opacity = "1";
            TextAnimation.animeTween('.text-anim .letter', '.text-anim');
        }, dialogue.delay || 0);

        if(continueButton){
            continueButton.onclick = () => {
                skipDialogue();
            };
        }
    }

    function skipDialogue(){
        if(!TextAnimation.isAnimationDone()){
            document.querySelectorAll('.text-anim .letter').forEach(l => l.style.opacity = 1);
            document.querySelector('.text-anim').style.opacity = 1;
            TextAnimation.completeAnimation();
        } else {
            currentDialogue = dialogue.next;
            loadDialogue(currentDialogue);
        }
    }



    if(dialogueSpeaker.innerText === "Mila" || dialogueSpeaker.innerText === "Cute girl"){
        dialogueSpeaker.style.color = "oklch(0.52 0.1 338.03)";
    } else if(dialogueSpeaker.innerText === "You"){
        dialogueSpeaker.style.color = "#FFFFFF";
    } else if(dialogueSpeaker.innerText === "Chang"){
        dialogueSpeaker.style.color = "oklch(0.52 0.1 227.12)"; //#FF69B4 #3cfe32
    }
    else if(dialogueSpeaker.innerText === "Adrian"){
        dialogueSpeaker.style.color = "oklch(0.52 0.1 159.44)";
    }
    else if(dialogueSpeaker.innerText === "Beatrice"){
        dialogueSpeaker.style.color = "oklch(0.52 0.1 10.6)";
    }

    if(dialogue.background){
        SwitchBackground(dialogue.background);
    }

    if(lovePoints){
        currentLovePoints += dialogue.lovePoints || 0;
    }

    if(dialogue.choices){
        let [choice1, choice2, choice3, choice4] = dialogue.choices;

        dialogueChoice1.innerText = choice1.text;
        dialogueChoice2.innerText = choice2.text;

        if(dialogue.choices.length > 2){
            dialogueChoice3.innerText = choice3.text;
        } else if(dialogue.choices.length > 3){
            dialogueChoice4.innerText = choice4.text;
        }

        if(dialogue.choices.length < 3){
            dialogueChoice3.style.display = "none"
            dialogueChoice4.style.display = "none"
        }

        dialogueChoice1.onclick = () => {
            if(choice1.character){
                markChoicePicked(dialogue.character, 0);
            }
            currentDialogue = choice1.next;
            loadDialogue(currentDialogue);

        }

        dialogueChoice2.onclick = () => {
            if(choice2.character){
                markChoicePicked(dialogue.character, 1);
            }
            currentDialogue = choice2.next;
            loadDialogue(currentDialogue);
        }

        if(dialogue.choices.length > 2){
            dialogueChoice3.onclick = () => {
                markChoicePicked(dialogue.character, 2);
                currentDialogue = choice3.next;
                loadDialogue(currentDialogue);
            }
        }
        if(dialogue.choices.length === 4){
            dialogueChoice4.onclick = () => {
                markChoicePicked(dialogue.character, 3);
                currentDialogue = dialogue.choices[3].next;
                loadDialogue(currentDialogue);
            }
        }

        //console.log(choice1);
    }


    // DIALOGUE CHANGES TO PROFILES
    if(currentDialogue === "response1"){
        milaNameWrapper.innerText = "MILA";
    }

    if(currentDialogue === "end"){
        milaLikesWrapper.innerText = "Pizza";
    }

    if(currentDialogue === "beatrice-5"){
        jAvailable = true;
        //console.log("journal? ", jAvailable);
    }



    if(dialogue.canChoose === true){
        continueButton.style.display = "none";
        dialogueChoice1.style.display = "block";
        dialogueChoice2.style.display = "block";
        dialogueChoice3.style.display = dialogue.choices.length > 2 ? "block" : "none";
        dialogueChoice4.style.display = dialogue.choices.length > 3 ? "block" : "none";
    } else{
        continueButton.style.display = "flex";
        dialogueChoice1.style.display = "none";
        dialogueChoice2.style.display = "none";
        dialogueChoice3.style.display = "none";
        dialogueChoice4.style.display = "none";
    }

    function markChoicePicked(dialogueId, choiceIndex) {
        chosenChoices[dialogueId + "_" + choiceIndex] = true;
    }

    if (dialogue.choices && dialogue.choices.length > 0) {
        [dialogueChoice1, dialogueChoice2, dialogueChoice3, dialogueChoice4].forEach((choiceElement, index) => {
            if(dialogue.choices[index]){
                choiceElement.style.display = chosenChoices[dialogue.id + "_" + index] ? "none" : "block";
                if(!chosenChoices[dialogue.id + "_" + index]){
                    choiceElement.innerText = dialogue.choices[index].text;
                }
            } else {
                choiceElement.style.display = "none";
            }
        });
    } else {
        [dialogueChoice1, dialogueChoice2, dialogueChoice3, dialogueChoice4].forEach(btn => btn.style.display = "none");
    }

    if(dialogue.end){
        continueButton.style.display = "none";
    }
    updateLovePoints();

    if(jAvailable){
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 74) {
               if(doc.classList.contains("active")){
                   doc.classList.remove("active");
               } else{
                   doc.classList.add("active");
               }
            }
        })
    }

    if(currentDialogue === "balance") {
        body.classList.add("shake");

        setTimeout(() => {
            mainBox.classList.remove("shake");
        }, 500);
    }

    if(currentDialogue === "end" ){
        mainBox.style.display = "none";
        mainBox.style.visibility = "hidden";

        chapter2Btn.style.visibility = "visible";

        chapter2Btn.onclick = () => {
            skipDialogue();
        }
    } else if(currentDialogue === "chapter2-end"){
        mainBox.style.display = "none";
        mainBox.style.visibility = "hidden";

        chapter2Btn.innerHTML = "The End...";
        chapter2Btn.style.visibility = "visible";



        setTimeout(() => {
            redirect();
        }, 3000);
    }
    else{
        mainBox.style.display = "flex";
        mainBox.style.visibility = "visible";

        chapter2Btn.style.visibility = "hidden"
    }
}

function redirect(){
    window.location.href = "credits.html"
}

// animeTween('.text-anim .letter', '.text-anim');
// dialogueText.innerText = "HELLO BRO";
const doc = document.getElementById("office-document")

