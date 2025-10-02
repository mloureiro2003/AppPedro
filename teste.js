// ===============================
// Helper
// ===============================
let prompt = require("prompt-sync")();
const fs = require("fs");

// function to get parcels (full, half, fifth)
function parcels(number){
  return(`${number}, ${Math.floor(number / 2)}, ${Math.floor(number / 5)}`);
}

function list(title, array) {
  console.log(`\n${title}:`);
  array.forEach((item, i) => {
  console.log(`${i + 1}: ${item.name || item}`);
  });
}

function loopControl(message){
  while (true) {
  console.log(`\n${message} (Y/N)`)
  let option = prompt().trim().toUpperCase();
  if (option === 'Y') return true;
  if (option === 'N') return false;
  console.log('\nPlease choose Y or N');
  }
}

function validateNumber(value, maxInclusive) {
  let n = parseInt(value);
    while (isNaN(n) || n < 1 || n > maxInclusive) {
      console.log("\nPlease choose a valid number");
      n = parseInt(prompt());
    }
  return n;
}