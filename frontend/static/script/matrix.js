const canvas = document.getElementById("matrix-text");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const LINE_NUMBER = 100;
const LETTER_NUMBER = Math.ceil(window.innerWidth * LINE_NUMBER / window.innerHeight );
const between = (e, l, r) => l <= e && e <= r;

const FONT_SIZE = Math.ceil(canvas.height / LINE_NUMBER);

ctx.font = `${FONT_SIZE}px Jetbrains Mono`;

let screen_array = [];
let rain_buffer = new Uint8Array(LINE_NUMBER * LETTER_NUMBER);
let rain_buffer_copy = new Uint8Array(LINE_NUMBER * LETTER_NUMBER);

/**
  * Initializes the screen array and rain buffer
  * 
  * @returns Nothing
  */
function screenInit() {
  for (let i = 0; i < LINE_NUMBER; i++) {
    screen_array.push([]);
    for (let j = 0; j < LETTER_NUMBER; j++) {
      // Each array element is an object representation of a char
      // Allowing to keep track of color and if it's in polytech or not
      // color acts as a countdown from 100 to 0
      // When 0 is on color, we "delete" the object by setting char to " "
      screen_array[i].push({
        char: " ",
        color: 50
      });

      // For the rain buffer, if a true is on the buffer, we move it one
      // down and put a false
      // Example :
      // [[false, true ],  ->  [[false, false]
      //  [true,  false]]  ->   [false, true ]]
      rain_buffer[i * LETTER_NUMBER + j] = 0;
      rain_buffer_copy[i * LETTER_NUMBER + j] = 0;
    }
  }
}


/**
  * Blits the screen array
  * 
  * @returns Nothing
  */
function blitArray() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < LINE_NUMBER; i++) {
    for (let j = 0; j < LETTER_NUMBER; j++) {
      // Use all of what's described above to make a perfect screen
      if (screen_array[i][j].char !== " ") {
        ctx.fillStyle = `hsl(110, 100%, ${screen_array[i][j].color}%)`;
        ctx.fillText(screen_array[i][j].char, j * FONT_SIZE, i * FONT_SIZE);
      }
    }
  }
}


/**
  * Makes up all the matrix rain effect, optimized
  */
function makeItRain() {
  for (let i = 0; i < LINE_NUMBER; i++) {
    for (let j = 0; j < LETTER_NUMBER; j++) {
      // Apply fading
      if (screen_array[i][j].char !== " ") {
        screen_array[i][j].color -= 5;
      }

      // Apply destruction
      if (screen_array[i][j].color === 0) {
        screen_array[i][j].char = " ";
      }

      // Apply creation
      if (rain_buffer[i * LETTER_NUMBER + j]) {
        screen_array[i][j].color = 100;
        screen_array[i][j].char = String.fromCharCode(Math.floor(Math.random() * 93) + 33);

        // Falling time
        if (i < LINE_NUMBER - 1) {
          rain_buffer_copy[(i + 1) * LETTER_NUMBER + j] = 1;
        }
      }
    }
  }

  // Copy back
  rain_buffer.set(rain_buffer_copy);
  rain_buffer_copy.fill(0);

  // Create more falling
  for (let i = 0; i < LETTER_NUMBER; i++) {
    if (Math.random() < 0.015) {
      rain_buffer[i] = true;
    }
  }

  blitArray();
}

screenInit();
blitArray();

setInterval(makeItRain, 100);