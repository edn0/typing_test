// Credit : https://www.geeksforgeeks.org/design-a-typing-speed-test-game-using-javascript/

let duree = 60;

let liste_prompts = [
    "Il était une fois, un drôle de chimpanzé qui se balladait sans trop savoir où aller. Il croisa le chemin d'une gazelle qui lui demandit alors ce qu'il faisait dans ce coin de la savane. Lui même cherchant une réponse à la question, il fit mine de se gratter la tête puis lui retourna la question.",
    "L'histoire deux",
    "L'histoire trois"
]


let mpm_value = document.querySelector("#mpm_value")
let fpm_value = document.querySelector("#fpm_value")
let err_value = document.querySelector("#err_value")
let time_value = document.querySelector("#time_value")
let precision_value = document.querySelector("#precision_value")
let prompt_value = document.querySelector("#prompt")

let current_prompt = null;
let prompt_number = 0;
let errors = 0;
let curr_input = "";
let curr_input_array = {};
let characters_typed = 0;
let prompt_span_array = {};
let total_errors = 0;
let time_left = duree;
let time_elapsed = 0;
let timer = null;

function clear_interval(timer) {
    timer = 0;
}

function start_game() {

    reset_values();
    maj_prompt();

    clear_interval(timer);
    timer = setInterval(update_timer, 1000);

}

function reset_values() {        
    current_prompt = null;
    prompt_number = 0;
    errors = 0;
    curr_input = "";
    curr_input_array = {};
    characters_typed = 0;
    prompt_span_array = {};
    total_errors = 0;
}


function finish_game() {
    // stop the timer
    clear_interval(timer);
   
    // disable the input area
    input_area.disabled = true;
   
    // show finishing text
    prompt_value.textContent = "Click on restart to start a new game.";

   
    // calculate cpm and wpm
    mpm = Math.round(((characters_typed / time_elapsed) * 60));
    fpm = Math.round((((characters_typed / 5) / time_elapsed) * 60));
   
    // update cpm and wpm text
    mpm_value.textContent = mpm;
    fpm_value.textContent = fpm;

}

function update_timer() {

    if (time_left > 0) {
      // decrease the current time left
      time_left--;
   
      // increase the time elapsed
      time_elapsed++;
   
      // update the timer text
      time_value.textContent = time_left;
    }
    else {
      // finish the game
      finish_game();
    }
}

function maj_prompt() {

    document.getElementById('title').classList.add('reduced');
    document.getElementById("header").classList.add('reduced_header');


    prompt_value.textContent = null;
    current_prompt = liste_prompts[prompt_number];

    // séparer chaque caractère en un élement distinct pour pouvoir les styler individuellement par la suite
    current_prompt.split('').forEach(char => {
        const span_caractere = document.createElement('span')
        span_caractere.innerText = char
        prompt_value.appendChild(span_caractere)
        })

    // retour au début de la liste
    if (prompt_number < liste_prompts.length - 1) {
    prompt_number++;
    }
    else {
    prompt_number = 0;
    }
}



function process_current_text() {

    // obtiens le contenu entré et le split
    curr_input = input_area.value;
    curr_input_array = curr_input.split('');

    // incrémente le nombre de caractères tapés
    characters_typed++

    errors = 0;

    prompt_span_array = prompt_value.querySelectorAll('span');
    prompt_span_array.forEach((char, index) => {
        let typed_char = curr_input_array[index]

        // caractère non tapé
        if (typed_char == null) {
            char.classList.remove('correct_char');
            char.classList.remove('incorrect_char');
        }

        // bon caractère
        else if (typed_char === char.innerText) {
            char.classList.add('correct_char');
            char.classList.remove('incorrect_char');
        }

        // mauvais caractère
        else {
            char.classList.add("incorrect_char");
            char.classList.remove('correct_char');
            errors++;
        }
    });

    err_value.textContent = errors;

    // met à jour la précision
    let correct_characters = (characters_typed - (total_errors + errors));
    let accuracyVal = ((correct_characters / characters_typed) * 100);
    precision_value.textContent = Math.round(accuracyVal);
    
    // if current text is completely typed
    // irrespective of errors
    if (curr_input.length == current_prompt.length) {
        maj_prompt();
    
        // update total errors
        total_errors += errors;
    
        // clear the input area
        input_area.value = "";
    }

}