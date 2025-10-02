// ===============================
// Helper
// ===============================
/**
 * @param {string} message - The question to display to the user.
 * @returns {Promise<boolean>} - A promise that resolves to true for 'Yes' and false for 'No'.
 * @param {number} maxInclusive - The maximum valid number (minimum is 1).
 * @returns {Promise<number>} - A promise that resolves to the valid number chosen by the user.
 * @returns {Promise<string>} - A promise that resolves to the submitted string value.
 * @param {string} title - The title/prompt for the user.
 * @param {Array<{value: any, label: string}>} options - The list of items to select from.
 * @returns {Promise<Array<any>>} - A promise that resolves with an array of the selected 'value' properties.
 */

// function to get parcels (full, half, fifth)
function parcels(number){
  return(`${number}, ${Math.floor(number / 2)}, ${Math.floor(number / 5)}`);
}

// receives an array, lists every element of it
function list(title, array) {
  console.log(`\n${title}:`);
  array.forEach((item, i) => {
  console.log(`${i + 1}: ${item.name || item}`);
  });
}

function loopControl(message){
  return new Promise(resolve =>{
    const messageElement = document.getElementById('questions-message')
    const yesButton = document.getElementById('yes-button')
    const noButton = document.getElementById('no-button')
    const container = document.getElementById('input-container')

    messageElement.textContent = message
    container.style.display = 'block'

    const handleYes = () => {
      yesButton.removeEventListener('click', handleYes)
      noButton.removeEventListener('click', handleNo)
      container.style.display = 'nome'
      resolve(true)
    }

    const handleNo = () => {
      yesButton.removeEventListener('click', handleYes)
      noButton.removeEventListener('click', handleNo)
      container.style.display = 'none'
      resolve(false)
    }

    yesButton.addEventListener('click', handleYes)
    noButton.addEventListener('click', handleNo)
  })
}

function validateNumber(value, maxInclusive, min) {
  return new Promise(resolve => {
    const messageElement = document.getElementById('questions-message')
    const container = document.getElementById('input-container')
    const inputField = document.getElementById('number-input')
    const submitButton = document.getElementById('number-submit-button')
    const errorElement = document.getElementById('number-error')

    if (flag === 0){
      messageElement.textContent = `{message} (Enter a number between 0 and ${maxInclusive})`
      inputField.min = 0
    } else {
      messageElement.textContent = `{message} (Enter a number between 1 and ${maxInclusive})`
      inputField.min = 1
    }

    inputField.value = ''
    inputField.max = maxInclusive
    errorElement.textContent = '';
    container.style.display = 'block'
    
    const handleSubmit = () => {
      if (flag === 0){
        if ((isNaN(value) || value < 0 || value > maxInclusive)){
          errorElement.textContent = `Error: Please enter a valid number between 0 and ${maxInclusive}`
          return
        }
      } else {
        if ((isNaN(value) || value < 1 || value > maxInclusive)){
          errorElement.textContent = `Error: Please enter a valid number between 1 and ${maxInclusive}`
          return
        }
      } 

    submitButton.removeEventListener('click', handleSubmit)
    container.style.display = 'none'
    resolve(value)

    submitButton.addEventListener('click', handleSubmit)
    }
  })
}

function getBrowserStringInput(message) {
    return new Promise(resolve => {
        // Assume these elements exist in the HTML structure
        const container = document.getElementById('string-input-container');
        const messageElement = document.getElementById('string-message');
        const inputField = document.getElementById('string-input');
        const submitButton = document.getElementById('string-submit-button');

        // Set up the UI
        messageElement.textContent = message;
        inputField.value = ''; 
        // Ensure container is displayed to the user
        container.style.display = 'block';

        const handleSubmit = () => {
            const value = inputField.value.trim();
            
            // Cleanup and resolve with the string value
            submitButton.removeEventListener('click', handleSubmit);
            container.style.display = 'none';
            resolve(value);
        };

        submitButton.addEventListener('click', handleSubmit);
    });
}

function getMultiSelect(title, options){
  return new Promise(resolve => {
    const container = document.getElementById('multi-select-container')
    const titleElement = document.getElementById('multi-select-title')
    const optionsArea = document.getElementById('multi-select-options')
    const submitButton = document.getElementById('multi-select-submit')

    if (!container){
      console.error("Multi-Select HTML container not found.")
      return getBrowserStringInput(title +" (Please enter selections separated by commas)").then(resolve);
    }

    titleElement.textContent = title
    optionsArea.innerHTML = ''
    container.style.display = 'block'

    const selectedValues = new Set()

    const toggleOption = (optionValue, element) => {
      if (selectedValues.has(optionValue)) {
        selectedValues.delete(optionValue)
        element.classList.remove('selected-option')
      } else {
        selectedValues.add(optionValue)
        element.classList.add('selected-option')
      }
    }

    options.forEach(option => {
      const button = document.createElement('button')
      button.textContent = option.label
      button.classList.add('multi-select-option')
      button.onClick = () => toggleOption(option.value, button)
      optionsArea.appendChild(button)
    })

    const handleSubmit = () => {
      submitButton.removeEventListener('click', handleSubmit)
      container.style.display = 'none'
      resolve(Array.from(selectedValues))
    }

    submitButton.addEventListener('click', handleSubmit)
  })
}

// ===============================
// Files
// ===============================
/**
 * Loads data from a fixed path/URL using the Fetch API.
 * This is asynchronous, assuming the file is hosted alongside the HTML.
 * @param {string} filePath - The path to the JSON file (e.g., 'spells.json').
 * @returns {Promise<any>} - A promise that resolves with the parsed JSON data.
 */

function loadData(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status} when fetching ${filePath}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(`Fetch/Parsing Error for ${filePath}:`, error);
            // Return an empty array if loading/parsing fails
            return []; 
        });
}


/**
 * Saves data by triggering a download of a JSON file (cannot save back to server).
 * @param {string} filename - The suggested filename for the download.
 * @param {any} data - The data structure to be saved.
 */
function saveData(filename, data) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename; 
    document.body.appendChild(a); 
    a.click(); 

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`Data download initiated for file: ${filename}`);
}

// ===============================
// Class Cost
// ===============================
class Cost{
  constructor(MP, SP, PP) {
    this.MP = parseInt(MP) || 0;
    this.SP = parseInt(SP) || 0;
    this.PP = parseInt(PP) || 0;
  }

  /**
     * @async
     * Prompts the user for the three cost values (MP, SP, PP) using the HTML form.
     * @returns {Promise<Cost>} - A Promise that resolves to a new Cost object.
     */

  static async newCost(){
    const MP = await validateNumber("Enter the spell's cost in Magic Points (MP):", 100)
    const SP = await validadeNumber("Enter the spell's cost in Sanity Points (SP):", 100)
    const PP = await validadeNumber("Enter the spell's cost in Sanity Points (PP):", 100)
    const cost = new Cost(MP, SP, PP);
    return cost;
  }

  /**
     * Formats the cost details into a readable string.
     * @param {string} spellName - The name of the spell.
     * @param {Cost} spellCost - The Cost object.
     * @returns {string} - The formatted cost string.
   */

  static listCost(spellName, spellCost){
    let parts = [];
    if (spellCost.MP != 0) parts.push(`MP - ${spellCost.MP}`);
    if (spellCost.SP != 0) parts.push(`SP - ${spellCost.SP}`);
    if (spellCost.PP != 0) parts.push(`PP - ${spellCost.PP}`);

    return `${spellName}: ${parts.join(", ")}`;
  }
}

// ===============================
// Class Spell
// ===============================
class Spell {
  constructor(name, cost, time) {
    this.name = name;
    this.cost = cost;
    this.time = time;
  }

  static spells = [];
  static filePath = "./spells.json"; 

  /**
   * Loads spell data from a fixed JSON file path using the asynchronous loadData (fetch).
   * @async
   */

  static async load(){
    const raw = await loadData(Spell.filePath); 
    Spell.spells = raw.map(s => {
        let costObj = s.cost ? new Cost(s.cost.MP, s.cost.SP, s.cost.PP) : new Cost(0, 0, 0);
        return new Spell(s.name, costObj, s.time);
      })
  }

  /**
   * Saves spell data by triggering a file download (using the asynchronous saveData).
   */
  static save() {
    saveData("spells.json", Spell.spells); 
  }

  static async newSpell() {
    let name = prompt("Enter the spells' name").trim();

    const cost = await Cost.newCost()

    let time  = prompt(`Enter the spell's conjuring time:`,).trim();

    const spell = new Spell(name, cost, time);
    Spell.spells.push(spell);
    Spell.spells.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`\nSpell "${name}" had been added.`);
    Spell.save()

    return spell;
  }

  /**
   * Guides the user through adding a spell (new or existing) to a target array.
   * @async
   */
  static async addSpell(array) {
    let flag = true;
    while (flag) {
      if (Spell.spells.length === 0) {
        console.log('\nNo spell registered. Create a new one.');
        array.push(Spell.newSpell());
      } else {
        list('\nSpells', Spell.spells);
        console.log(`${Spell.spells.length + 1}: Add new spell`);
        console.log("\nChoose the spells' number")

        let number = await validateNumber("Choose the spell's number from the list or select 'Add new spell':", Spell.spells.length + 1);
        
        if (number === Spell.spells.length + 1) {
          array.push(Spell.newSpell());
        } else {
          array.push(Spell.spells[number - 1]);
        }
      }
      flag = await displayQuestion('Do you wish to add more spells?');
    }
  }

  static showSpell(spell){
    let costString = Cost.listCost(spell.name, spell.cost)
    let output = `${costString}, time: ${spell.time}`;
    console.log(output)
    return output
  }

  static showSpells(array){
    array.forEach((spell) => {
      Spell.showSpell(spell);
    });
    return array.map(spell => Spell.showSpell(spell));
  }
}

// ===============================
// Class Weapon
// ===============================
class Weapon {
  constructor(name, skill, damage, flagBonus=false, flagBuild=false) {
    this.name = name;
    this.skill = skill;
    this.damage = damage;
    this.flagBonus = flagBonus;
    this.flagBuild = flagBuild
  }
  
  static weapons = [];
  static filePath = "./weapons.json"


  /**
   * Loads spell data from a fixed JSON file path using the asynchronous loadData (fetch).
   * @async
   */
  static async load(){
    const raw = await loadData(Weapon.filePath)
     Weapon.weapons = raw.map(w => new Weapon(
      w.name,
      w.skill,
      w.damage,
      w.flagBonus ?? false,
      w.flagBuild ?? false
    ));
  }

  static save(){
    saveData("./weapons.json", Weapon.weapons)
  }

  /**
   * Guides the user through creating a new Spell object using asynchronous HTML inputs.
   * @async
   */
  static async newWeapon(){
    let name = await getBrowserStringInput("Enter the weapon's name");

    let skill = await getBrowserStringInput("Enter which ability the fighter used the weapon with (e.g., Fighting, Firearms)");

    let damage = await getBrowserStringInput("Enter the weapon's damage (e.g., 1d6, 2d8+DB)");
    let flagBonus = false;
    let flagBuild = false;

    const parts = damage.split("+");
    if (parts.length === 3){
      flagBonus = true
      flagBuild = true
    } else if (parts.length === 2){
      let part = parts[1].trim();
      if (part === 'DB' || part.toLowerCase() === 'half db' || part === '1/2 DB') {
        flagBuild = true
      } else{
        flagBonus = true
      }
    }
    const weapon = new Weapon(name, skill, damage, flagBonus, flagBuild);
    Weapon.weapons.push(weapon);
    console.log(`\nWeapon "${name}" has been added.`);
    Weapon.save()
    return weapon;
  }

  /**
   * Guides the user through adding a weapon (new or existing) to a target array.
   * @async
   */
  static async addWeapon(array) {
    let flag = true;
    while (flag) {

    if (Weapon.weapons.length === 0) {
      console.log('\nNo weapon in the database. Create a new one.');
      array.push(Weapon.newWeapon());
    } else {
      list('\nWeapons', Weapon.weapons);
      console.log(`${Weapon.weapons.length + 1}: Add new weapon`);
      console.log("\nChoose the weapon")

      let number = parseInt(prompt("Choose the weapon number or select 'Add new weapon':"))
      number =  await validateNumber(number, Weapon.weapons.length + 1);

      if (number === Weapon.weapons.length + 1) {
        let weapon = await Weapon.newWeapon()
        array.push(weapon);
      } else {
        let weapon = Weapon.weapons[number - 1]
        let value = prompt(`Value of NPC's skill with ${weapon.name} (Max 100):`)
        value = validateNumber(value, 100)
        weapon.skill = value
        array.push(weapon);
      }
    }
    flag = await displayQuestion('Do you wish to add more spells?');
    }
  }

  static showWeapon(weapon, npc){
    let name = `${weapon.name}`
    let skill = parcels(weapon.skill)
    let damage = weapon.damage

    if (weapon.flagBonus || weapon.flagBuild) {
      let damageBase = damage.split("+")[0];
      let calculatedDamage = damageBase;

      if (weapon.flagBuild) {
        calculatedDamage += NPC.NPCBuild(npc);
      }
        
      if (weapon.flagBonus) {
        let bonusPart = damage.split("+").slice(1).find(p => p.trim() !== 'DB' && p.toLowerCase() !== 'half db' && p !== '1/2 DB');
        if (bonusPart) {
          calculatedDamage += `+${bonusPart.trim()}`;
        }
      }
      damage = calculatedDamage;
    }
    console.log(`${name} (${skill}) - ${damage}`);
    return `${name} (${skill}) - ${damage}`; 
  }

  static showWeapons(array, npc){
    array.forEach((weapon) => {
      Weapon.showWeapon(weapon, npc)
    });
  }
}

// ===============================
// Base Class Fighter
// ===============================
class Fighter {
  constructor(name, dex, hp, san, cons, pow, spells, magic) {
    this.name = name;
    this.dex = parseInt(dex) || 0;
    this.hp = parseInt(hp) || 0;
    this.san = parseInt(san) || 0;
    this.cons = parseInt(cons) || 0;
    this.pow = parseInt(pow) || 0;
    this.spells = spells;
    this.magic = parseInt(magic) || 0;
  }

  getType() {
    return this.constructor.name; // Character or NPC
  }

  static listFighters(combat){
    combat.fighters.forEach((fighter, idx) => {
      if (fighter.type === 'NPC'){
        NPC.listNPC(fighter)
      } else{
        Character.listCharacter(fighter)
      }
    })
  }

  static displayFighters(fighter){
    if (fighter.type === 'NPC'){
      NPC.displayNPC(fighter)
    } else{
      Character.displayCharacter(fighter)
    }
  }

  static editFighters(fighter){
    if (fighter.type === 'NPC'){
       NPC.editNPC(fighter)
    } else{
      Character.editCharacterO(fighter)
     }
  }
  
  static cloneFighter(fighters){
    return fighters.map(fighter => {
      if (fighter.type === 'NPC'){
        return NPC.cloneNPC(fighter)
      } else{
        return Character.cloneCharacter(fighter)
      }
    }
  )}

  /**
   * Guides the user through inflicting damage on selected fighters.
   * @async
   */

  static async inflictDamageFigher(localFighters, i, characterTurn){
    const availableStats = ['hp','san','cons', 'pow']
    const stateOptions = availableStats.map(stat => ({
      value: stat,
      lable: stat.toLocaleUpperCase()
    }))

    let selectionDemage = await getMultiSelect("Choose the type(s) of demage inflicted:", stateOptions)

    if (selectionDemage.length === 0){
      console.warn("No damage type selected. Please select at least one type of demage")
      selectionDemage = await getMultiSelect("Choose the type(s) of demage inflicted:", stateOptions)
      return { localFighters, characterTurn };
    }

    const targetOptions = localFighters.map((f, index) => {
      value = index,
      label = `${index}: ${f.name} (${f.getType()})`
    })
    .filter(option => option.value != i)

    let selectionIndeces = await getMultiSelect("Select the fighers to target:", targetOptions)

    if (selectionIndeces.length === 0){
      console.warn("No targets selected. Please select at least one target")
      selectionIndeces = await getMultiSelect("Select the fighers to target:", targetOptions)
    }

    for (let j = selectionIndeces.length - 1; j >= 0; j--){
      const indexToDamage = selectionIndeces[j]
      const demagedFighter = localFighters[indexToDamage]
      const demageMessage = ''
      let demageInput = 0

      if (stat.value === 'hp') {
        demageMessage = `Enter the amount of demage inflicted in ${demagedFighter.name}'s ${stat} (Max ${demagedFighter.hp})`
        demageInput = await validateNumber(damageMessage, demagedFighter.hp); 
      } else if (stat.value === 'san'){
        demageMessage = `Enter the amount of demage inflicted in ${demagedFighter.name}'s ${stat} (Max ${demagedFighter.san})`
        demageInput = await validateNumber(damageMessage, demagedFighter.san); 
      } else if (stat.value === 'cons'){
        demageMessage = `Enter the amount of demage inflicted in ${demagedFighter.name}'s ${stat} (Max ${demagedFighter.cons})`
        demageInput = await validateNumber(damageMessage, demagedFighter.cons); 
      } else {
        demageMessage = `Enter the amount of demage inflicted in ${demagedFighter.name}'s ${stat} (Max ${demagedFighter.pow})`
        demageInput = await validateNumber(damageMessage, demagedFighter.pow); 
      }

      demagedFighter[stat] -= demageInput;
      if (demagedFighter[stat] < 1) {
            localFighters.splice(indexToDamage, 1);
            if (indexToDamage <= characterTurn) {
              characterTurn--;
            }
      }
    }
    return { localFighters, characterTurn };
  }

   /**
   * Guides the user through casting a spell, checking costs and reducing stats.
   * @async
   * @param {Array<Fighter>} localFighters - The array of fighters in the combat encounter (mutated).
   * @param {Fighter} fighter - The fighter casting the spell.
   * @param {number} spellIndex - The 1-based index of the spell being cast.
   * @param {number} characterTurn - The index used to track whose turn it is (mutated).
   * @returns {Promise<{localFighters: Array<Fighter>, characterTurn: number}>} The updated fighter array and turn index.
   */
  static  async castSpell(localFighters, fighter, spellIndex, characterTurn){
    const spell = fighter.spells[spellIndex - 1]

    const deduceCost = async (statName, costAmount, currentStatValue) => {
      if (costAmount <= 0) return true

      const message = `Enter the amount of ${statName.toUpperCase()} to spend (Cost: ${costAmount}, Max: ${currentStatValue}):`
      let spent = await validateNumber(message, currentStatValue)

      fighte[statName] -= spent
      console.log(`${fighter,name}'s ${statName} reduced by ${spent} to ${fighters[statName]}.`)

      if (fighter[statName] < 1){
        const fighterIndex = localFighters.indexOf(fighter)
        if (fighterIndex > -1){
          localFighters.splice(fighterIndex, 1)
          if (fighterIndex <= characterTurn) characterTurn--
        }
        return false
      }
      return true
    }

      if (spell.cost.MP != 0){
        if (!await deduceCost('magic', spellCost.MP, fighter.magic)){
          return { localFighters, characterTurn }
        }
      }

      if (spell.cost.SP != 0){
        if (!await deduceCost('sanity', spellCost.SP, fighter.san)){
          return { localFighters, characterTurn }
        }
      }

      if (spell.cost.PP != 0){
        if (!await deduceCost('power', spellCost.MP, fighter.pow)){
          return { localFighters, characterTurn }
        }
      }
  }
}

