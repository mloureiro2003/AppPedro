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

// ===============================
// Files
// ===============================
function loadData(filePath) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    try {
      return JSON.parse(data);
    } catch (err) {
      console.log(`\nError parsing ${filePath}:`, err);
      return [];
    }
  } else {
    return [];
  }
}

function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ===============================
// Class Cost
// ===============================
class Cost{
  constructor(MP, SP, PP) {
    this.MP = parseInt(MP) || 0;
    this.SP = parseInt(MP) || 0;
    this.PP = parseInt(MP) || 0;
  }

  static newCost(){
    console.log("\nSpells' cost in magic points")
    let MP = parseInt(prompt().trim())

    console.log("\nSpells' cost in sanity points")
    let SP = parseInt(prompt().trim())

    console.log("\nSpells' cost in power points")
    let PP = parseInt(prompt().trim())

    const cost = new Cost(MP, SP, PP);
    return cost;
  }

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
  static filePath = "./spells.txt"

  static load(){
    const raw = loadData(Spell.filePath)
    Spell.spells = raw.map(s => new Spell(s.name, s.const, s.time))
  }

  static save(){
    saveData(Spell.filePath, Spell.spells)
  }

  static newSpell() {
    console.log("\nSpells' name")
    let name = prompt().trim();

    let cost = Cost.newCost()

    console.log("\nSpells' conjuring time")
    let time = prompt().trim();

    const spell = new Spell(name, cost, time);
    Spell.spells.push(spell);
    Spell.spells.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`\nSpell "${name}" had been added.`);
    Spell.save()

    return spell;
  }

  static addSpell(array) {
    let flag = true;
    while (flag) {
      if (Spell.spells.length === 0) {
        console.log('\nNo spell registered. Create a new one.');
        array.push(Spell.newSpell());
      } else {
        list('\nSpells', Spell.spells);
        console.log(`${Spell.spells.length + 1}: Add new spell`);
        console.log("\nChoose the spells' number")
        let number = validateNumber(prompt(), Spell.spells.length + 1);
        if (number === Spell.spells.length + 1) {
          array.push(Spell.newSpell());
        } else {
          array.push(Spell.spells[number - 1]);
        }
      }
      flag = loopControl('\nDo you wish to add more spells?');
    }
  }

  static showSpell(spell){
    let costString = Cost.listCost(spell.name, spell.cost)
    let output = `${costString}, time: ${spell.time}`;
    console.log(output)
  }

  static showSpells(array){
    array.forEach((spell) => {
      Spell.showSpell(spell)
    });
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
  static filePath = "./weapons.txt"

  static load(){
    const raw = loadData(Weapon.filePath)
     Weapon.weapons = raw.map(w => new Weapon(
      w.name,
      w.skill,
      w.damage,
      w.flagBonus ?? false,
      w.flagBuild ?? false
    ));
  }

  static save(){
    saveData(Weapon.filePath, Weapon.weapons)
  }

  static newWeapon(){
    console.log("\nWeapon's name");
    let name = prompt().trim();

    let skill = "blank";

    console.log("\nWeapon's damage (use DB for demage bonus from body)");
    let damage = prompt().trim();

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

  static addWeapon(array) {
    let flag = true;
    while (flag) {
    if (Weapon.weapons.length === 0) {
      console.log('\nNo weapon in the database. Create a new one.');
      array.push(Weapon.newWeapon());
    } else {
      list('\nWeapons', Weapon.weapons);
      console.log(`${Weapon.weapons.length + 1}: Add new weapon`);
      console.log("\nChoose the weapon's name")
      let number = validateNumber(prompt(), Weapon.weapons.length + 1);
      if (number === Weapon.weapons.length + 1) {
        let weapon = Weapon.newWeapon()
        console.log("Value of npc's skill with this weapon:")
        let value = prompt()
        value = validateNumber(value, 100)
        weapon.skill = value
        array.push(weapon);
      } else {
        let weapon = Weapon.weapons[number - 1]
        console.log("Value of npc's skill with this weapon:")
        let value = prompt()
        value = validateNumber(value, 100)
        weapon.skill = value
        array.push(weapon);
      }
    }
    flag = loopControl('\nDo you wish to add more weapons?');
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

  static inflictDamageFigher(localFighters, characterTurn){
    console.log("Choose which stats were demaged:")

    console.log("Choose the type(s) of demage inflicted:")
    console.log("hp (hp), san (sanity), cons(constitution), pow(power")
    let selectionDemage = prompt().split(",").map(s => s.trim());

    console.log("\n=== Fighters ===");
    localFighters.forEach((f, index) => {
      if (index != characterTurn){
        console.log(`${index}: ${f.name}`);
      }
    });
    console.log("\nSelect fighters by index");
    let selectionIndices = prompt().split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0 && n < localFighters.length && n !== characterTurn);

    for (const stat of selectionDemage){
      for (let j = selectionIndices.length - 1; j >= 0; j--) {
        const indexToDamage = selectionIndices[j];
        const demagedFighter = localFighters[indexToDamage];
        
        console.log(`\nEnter the amount of demage inflicted in ${demagedFighter.name}'s ${stat}`);
        let demageInput = parseInt(prompt())
        demageInput = validateNumber(demageInput, 100)

        if (demagedFighter.hasOwnProperty(stat)){
          demagedFighter[stat] -= demageInput
          
          if (demagedFighter[stat] < 1){
            localFighters.splice(indexToDamage, 1)
          }

          if (indexToDamage <= characterTurn){
            characterTurn--
          }

          selectionIndices.splice(j, 1)
        }
      }
    }
    return { localFighters, characterTurn }
  }

  static castSpell(localFighters, fighter, spellIndex, characterTurn){
    const spell = fighter.spells[spellIndex - 1]

    if (spell.cost.MP != 0){
      console.log("Spend magic points")
      let MPcost = parseInt(prompt())
    } 
    
    if (spell.SP != 0){
      console.log("Spend sanity points")
      let SPcost = parseInt(prompt())
      fighter.san -= SPcost
      if (fighter.san < 1){
        const fighterIndex = localFighters.indexOf(fighter)
        localFighters.splice(fighterIndex, 1)
        if (fighterIndex <= characterTurn) characterTurn--
        return { localFighters, characterTurn };
      }
    } 
    
    if (spell.cost.PP != 0){
      console.log("Spend power points")
      let PPcost = parseInt(prompt())
      fighter.pow -= PPcost
      if (fighter.pow < 1){
        const fighterIndex = localFighters.indexOf(fighter)
        localFighters.splice(fighter, 1)
        if (demagedChar <= characterTurn) characterTurn--;
      }
    }
    return { localFighters, characterTurn };
  }
}

// ===============================
// Class Character
// ===============================
class Character extends Fighter {
  constructor(name, dex, hp, san, cons, pow, spells, weapons, magic) {
    super(name, dex, hp, san, cons, pow);
    this.type = 'Character';
  }
  
  static characters = [];
  static filePath = "./characters.txt"

  static load(){
    const raw = loadData(Character.filePath)
    Character.characters = raw.map(c => new Character(c.name, c.dex, c.hp, c.san))
  }

  static save(){
    saveData(Character.filePath, Character.characters)
  }

  static listCharacters() {
    if (Character.characters.length === 0) {
      console.log('\nNo character in the database');
      return;
    }
    Character.characters.sort((a, b) => b.dex - a.dex);
    console.log("\n")
    Character.characters.forEach((item, i) => {
      let number = `${i+1}`
      let string = Character.returnCharacter(item)
      console.log(number + "  - " + string)
    });
  }

  static returnCharacter(item){
    return (`${item.name}: Dexterity(${item.dex}), Sanity(${item.san}), HP(${item.hp})`)
  }

  static listCharacter(item){
    console.log(`${item.name}: Dexterity(${item.dex}), Sanity(${item.san}), HP(${item.hp})`);
  }

  static displayCharacter(item){
    console.log(`${item.dex} - ${item.name}, Sanity(${item.san}), HP(${item.hp})`);
  }

  static cloneCharacter(f){
    let clone = new Character(f.name, f.dex, f.hp, f.san);
    return clone
  }

  static newCharacter() {
    console.log("\nCharacter's name")
    let name = prompt().trim();

    console.log("\nCharacter's dexterity")
    let dex = prompt()
    dex = validateNumber(dex, 100)
    
    console.log("\nCharacter's sanity")
    let san = prompt()
    san = validateNumber(san, 100)

    console.log("\nCharacter's constitution")
    let cons = prompt()
    cons = validateNumber(cons, 100)

    console.log("\nCharacter's power")
    let pow = prompt()
    pow = validateNumber(pow, 100)
    
    console.log("\nCharacter's HP")
    let hp = prompt()
    hp = validateNumber(hp, 100)

    console.log("\nCharacter's magic")
    let magic = prompt()
    magic = validateNumber(magic, 100)

    let spells = [];
    if (loopControl("\nDo you wish to add spells to the character's sheet?")) Spell.addSpell(spells);

    let character = new Character(name, dex, hp, san, cons, pow, hp, magic, spells, weapons);
    Character.characters.push(character);
    Character.save()
    console.log(`\nCharacter "${name}" has been added.`);
    return character;
  }

  static addCharacter(array) {
    let flag = true;
    while (flag) {
      if (Character.characters.length === 0) {
        console.log('\nNo character in the database. Create a new one');
        array.push(Character.newCharacter());
      } else {
        Character.listCharacters();
        console.log(`${Character.characters.length + 1}: Add new character`);
        console.log("\nChoose the character's number")
        let number = validateNumber(prompt(), Character.characters.length + 1)
        if (number === Character.characters.length + 1) {
          array.push(Character.newCharacter());
        } else {
          array.push(Character.characters[number - 1]);
        }
      }
      flag = loopControl('\nDo you wish to add more characters?');
    }
  }

  static editCharacter(character){
    console.log("\n1 - Dexterity")
    console.log("2 - Sanity")
    console.log("3 - HP")
    console.log("4 - Constitution")
    console.log("5 - Power")

    console.log("\nChoose the number of the stat you wish to change")
    let choice = parseInt(prompt())
    choice = validateNumber(choice, 5)
    
    console.log("\nChoose the new value of the stat")
    let stat = parseInt(prompt())
    stat = validateNumber(stat, 100)

    if (choice === 1){
      character.dex = stat
    } else if (choice === 2){
      character.san = stat
    } else if (choice === 3){
      character.hp = stat
    } else if (choice === 4){
      character.cons = stat
    } else {
      character.pow = stat
    }
    return character
  }

  static CharacterLoop(action) {
    if (Character.characters.length === 0) {
      console.log(`\nThere are no characters to ${action}`);
    return null;
    }
    let flag = true;
    while (flag) {
      Character.listCharacters();
      console.log(`\nChoose the number of the character you wish to ${action}`)
      let choice = validateNumber(prompt(), Character.characters.length)
      let index = choice - 1

      if (action === "edit"){
        Character.editCharacter(Character.characters[index]);
      } else if (action === "see"){
        Character.listCharacter(Character.characters[index]);
      }
      flag = loopControl(`\nDo you wish to ${action} another character?`);
    }
    return (flag)
  }

  static characterMenu() {
    let choice = 0;
    while (choice !== 4) {
      console.log("\n1 - See character's stats")
      console.log('2 - Add new character to the database');
      console.log('3 - Edit character');
      console.log('4 - Go back');

      choice = parseInt(prompt())
      choice = validateNumber(choice, 4)

      if (choice === 1) {
        Character.CharacterLoop("see");
      } else if (choice === 2) {
        Character.newCharacter();
      } else if (choice === 3) {
        Character.CharacterLoop("edit");
      }
    }
  }
}  

// ===============================
// Class NPC
// ===============================
class NPC extends Fighter {
  constructor(name, fight, dex, str, size, cons, dodge, hp, magic, san, pow, spells, weapons) {
    super(name, dex, hp, san, cons, pow, spells, magic); 
    this.fight = parseInt(fight) || 0;
    this.str = parseInt(str) || 0;
    this.size = parseInt(size) || 0;
    this.dodge = parseInt(dodge) || 0;
    this.weapons = weapons;
    this.type = 'NPC';
  }

  static npcs = [];
  static filePath = "./npcs.txt"

  static load(){
    const raw = loadData(NPC.filePath)
    NPC.npcs = raw.map(n => new NPC(
      n.name, n.fight, n.dex, n.str, n.size, n.cons, n.dodge, n.hp, n.magic, n.san, n.pow, n.spells, n.weapons
    ))
  }

  static save(){
    saveData(NPC.filePath, NPC.npcs)
  }

  static listNPCs() {
    if (NPC.npcs.length === 0) {
      console.log('\nNenhum NPC cadastrado.');
    return;
    }
    NPC.npcs.sort((a, b) => b.dex - a.dex);
    NPC.npcs.forEach((item, i) => {
      listNPC(item)
    });
  }

  static listNPC(item) {
    console.log(`${item.name}: Fight(${item.fight}), Dexterity(${item.dex}), Strength(${item.str}), Size(${item.size}), Constitution(${item.cons}), Dodge(${item.dodge}), Magic(${item.magic}), HP(${item.hp}), Sanity(${item.san}), Power(${item.pow})`);
    if (item.spells.length != 0){
      console.log("Spells:")
      Spell.showSpells(item.spells)
    }
    if (item.weapons.length != 0){
      console.log("Weapons:")
      Weapon.showWeapons(item.weapons, item)
    }
  }

  static displayNPC(item) {
    console.log(`${item.dex} - ${item.name}, Fight(${item.fight}), Strength(${item.str}), Size(${item.size}), Constitution(${item.cons}), Dodge(${item.dodge}), Magic(${item.magic}), HP(${item.hp}), Sanity(${item.san}), Power(${item.pow})`);
    list("Spells", item.spells);
    list("Weapons", item.weapons);
  }

  static cloneNPC (f){
    let clone = new NPC(f.name, f.fight, f.dex, f.str, f.size, f.cons, f.dodge, f.magic, f.hp, f.san, f.pow, f.spells, f.weapons)
    return clone
  }

  static newNPC() {
    console.log("\nChoose the NPC's name")
    let name = prompt().trim();

    console.log("\nChoose the NPC's fight")
    let fight = parseInt(prompt())
    fight = validateNumber(fight, 100)

    console.log("\nChoose the NPC's dexterity")
    let dex = parseInt(prompt())
    dex = validateNumber(dex, 100)
    
    console.log("\nChoose the NPC's strength")
    let str = parseInt(prompt())
    str = validateNumber(str, 100)
   
    console.log("\nChoose the NPC's size")
    let size = parseInt(prompt())
    size = validateNumber(size, 100)

    console.log("\nChoose the NPC's constitution")
    let cons = parseInt(prompt())
    cons = validateNumber(cons, 100)

    console.log("\nChoose the NPC's dodge")
    let dodge = parseInt(prompt())
    dodge = validateNumber(dodge, 100)
   
    let hp = Math.floor((cons+size)/10)

    console.log("\nChoose the NPC's power")
    let pow = parseInt(prompt())
    pow = validateNumber(pow, 100)

    let san = pow
    let magic = Math.floor(pow/5)

    let spells = [];
    if (loopControl("\nDo you wish to add spells to the NPC's sheet?")) Spell.addSpell(spells);

    let weapons = [];
    if (loopControl("\nDo you wish to add weapons to the NPC's sheet?")) Weapon.addWeapon(weapons);

    let npc = new NPC(name, fight, dex, str, size, cons, dodge, hp, magic, san, pow, spells, weapons);
    NPC.npcs.push(npc);
    NPC.save()
    console.log(`\nNPC "${name}" has been created.`);
    return npc;
  }

  static addNPC(array) {
    let flag = true;
    while (flag) {
      if (NPC.npcs.length === 0) {
        console.log('\nNO NPC in the database. Create a new one.');
        array.push(NPC.newNPC());
      } else {
        NPC.listNPCs();
        console.log(`${NPC.npcs.length + 1}: Add a new NPC`);
        console.log("\nChoose the NPC's number")
        let number = parseInt(prompt())
        number = validateNumber(number, NPC.npcs.length + 1)
        if (number === NPC.npcs.length + 1) array.push(NPC.newNPC());
        else array.push(NPC.npcs[number - 1]);
      }
      flag = loopControl("\nDo you wish to add more NPC's");
    }
  }

  static editNPC(npc){
    let flag = true
    let keys = Object.keys(npc).filter(k => !['type', 'spells', 'weapons', 'name'].includes(k));
    keys.forEach((k, i) => console.log(`${i+1}: ${k}`));

    console.log("\nChoose the number of the stat you wish to change")
    let choice = parseInt(prompt()-1)
    choice = validateNumber(choice+1, keys.length)

    console.log("\nChoose the new value of the stat")
    let stat = parseInt(prompt())
    stat = validateNumber(stat, 100)

    npc[keys[choice]] = stat;
  }

  static NPCLoop(action) {
    if (NPC.npcs.length === 0) {
      console.log(`\nThere are no NPCs to ${action}`);
    return;
    }
    let flag = true;
    while (flag) {
      NPC.listNPCs();
      console.log(`\nChoose the number of the NPC you wish to ${action}`)
      let choice = prompt()
      choice = validateNumber(choice, NPC.npcs.length)
      NPC.editNPC(NPC.npcs[choice - 1]);
      flag = loopControl(`\nDo you wish to ${action} another NPC?`);
    }
    return (choice-1)
  }

  static NPCMenu() {
    let choice = 0;
    while (choice !== 4) {
      console.log("\n1 - See NPC's stats")
      console.log('2 - Add new NPC to the database');
      console.log('3 - Edit NPC');
      console.log('4 - Go back');
      choice = parseInt(prompt())
      choice = validateNumber(choice, 4)
      if (choice === 1){
        let flag = true
        while (flag){
          let choice = NPC.NPCLoop("see")
          NPC.displayNPC(NPC.npcs[choice]);
          let flag2 = loopControl("\nDo you wish to edit this NPC?")
            if (flag2){
            NPC.editNPC(NPC.npcs[choice])
          }
          flag = loopControl("\nDo you wish to see more NPCs?")
        }
      } else if (choice === 2){
        NPC.newNPC(NPC.npcs)  
      } else if (choice === 3){
        let flag = true
        while (flag){
          let choice = NPC.NPCLoop("edit")
          NPC.editNPC(NPC.npcs[choice]);
          flag = loopControl("\nDo you wish to edit more NPC?")
        }
      }
    }
  }

  static NPCBonus(npc){
    raw = npc.size + npc.str
    let bonus
    if (raw <= 64){
      bonus = '-2'
    } else if (raw <= 84){
      bonus = '-1'
    } else if (raw <= 124){
      bonus = '+0'
    } else if (raw <= 164){
      bonus = '+1D4'
    } else{
      bonus = '+1D6'
    }
    return bonus
  }

  static NPCBuild(npc){
    raw = npc.size + npc.str
    let bonus
    if (raw <= 64){
      bonus = '-2'
    } else if (raw <= 84){
      bonus = '-1'
    } else if (raw <= 124){
      bonus = '+0'
    } else if (raw <= 164){
      bonus = '+1'
    } else{
      bonus = '+2'
    }
    return bonus
  }
}  

// ===============================
// Class Combat
// ===============================
class Combat {
  constructor(name, fighters = []) {
    this.name = name;
    this.fighters = fighters;
  }
  
  static combats = [];
  static filePath = "./combats.txt"

  static load(){
    const raw = loadData(Combat.filePath)
    Combat.combats = raw.map(c => new Combat (c.name, c.fighters))
  }

  static save(){
    saveData(Combat.filePath, Combat.combats)
  }

  static newCombat() {
    console.log("\nCombat's name")
    let name = prompt().trim();
    
    console.log("\n=== Characters ===");
    Character.characters.forEach((c, i) => {
      console.log(`C${i}: ${c.name} (DEX: ${c.dex}, HP: ${c.hp})`);
    });

    console.log("\n=== NPCs ===");
    NPC.npcs.forEach((npc, i) => {
      console.log(`N${i}: ${npc.name} (DEX: ${npc.dex}, HP: ${npc.hp})`);
    });

    console.log("\nSelect fighters by index (ex: C0,N1,C2):");
    let selection = prompt().split(",").map(s => s.trim());

    const fighters = [];
    for (let sel of selection) {
      if (sel.startsWith("C")) {
        const index = parseInt(sel.slice(1));
        if (Character.characters[index]) fighters.push(Character.characters[index]);
      } else if (sel.startsWith("N")) {
        const index = parseInt(sel.slice(1));
        if (NPC.npcs[index]) fighters.push(NPC.npcs[index]);
      }
    }

    const combat = new Combat(name, fighters);
    Combat.combats.push(combat);
    Combat.save()
    console.log(`\nCombat "${name}" created with ${fighters.length} fighters.`);

    return combat;
  }

  static showCombat(combat, choice){
    console.log(`\nCombat ${choice}: ${combat.name}`)
    console.log("\nFighters in the combat:")
    Fighter.listFighters(combat)
    if (loopControl("\nDo you wish to edit this combat?")){
      Combat.editCombat(combat)
    }
  }

  static showCombats(){
    if (Combat.combats.length === 0){
      console.log("\nThere are no available combats")
      return
    }

    let flag = true

    while (flag){
      console.log("\nAvailable combats:")
      Combat.combats.forEach((combat, i) => {
        console.log(`${i+1} ${combat.name} [${combat.fighters.length} fighters]`)
      })
      console.log(`${Combat.combats.length+1}: Create a new combat`)

      console.log("\nChoose option: ")
      let choice = parseInt(prompt())
      choice = validateNumber(choice, Combat.combats.length+1)
    
      if (choice === Combat.combats.length+1){
        Combat.newCombat()
        continue
      } else {
        const combat = Combat.combats[choice-1]
        Combat.showCombat(combat, choice)}
      flag = loopControl("\nDo you wish to see more combats?")  
    }
  }

  static editCombat(combat) {
    let choice = 0;
    Fighter.listFighters(combat);

    while (choice !== 3) {
      console.log("\nOptions");
      console.log("1 - Add fighter");
      console.log("2 - Edit fighter");
      console.log("3 - Go back");
      console.log("Choose desired option");

      choice = parseInt(prompt());
      choice = validateNumber(choice, 3);

      if (choice === 1) {
        let flag = true;
        while (flag) {
          console.log("\n1 - Add Characters");
          console.log("2 - Add NPCs");
          console.log("Pick which option you want");

          let choice2 = parseInt(prompt());
          choice2 = validateNumber(choice2, 2);

          if (choice2 === 1) {
            Character.addCharacter(combat.fighters);
          } else {
            NPC.addNPC(combat.fighters);
          }

          flag = loopControl("\nDo you wish to add more fighters?");
        }
      } else if (choice === 2) {
        let flag = true;
        while (flag) {
          console.log("\nWhich fighter do you wish to edit?");
          let fighter = parseInt(prompt());
          fighter = validateNumber(fighter, combat.fighters.length);

          if (fighter > 0 && fighter <= combat.fighters.length) {
            Fighter.editFighters(combat.fighters[fighter - 1]);
          } else {
            console.log("Invalid fighter number.");
          }

          flag = loopControl("\nDo you wish to edit more fighters?");
        }
      }
    }
  }

  static runCombat(){
    Combat.combats.forEach((combat, i) => {
        console.log(`${i+1} ${combat.name} [${combat.fighters.length} fighters]`)
      })
    console.log(`${Combat.combats.length + 1}: add new combat`);
    console.log("\nChoose combat number");

    let choice = parseInt(prompt());
    choice = validateNumber(choice, Combat.combats.length + 1)

    if (choice === Combat.combats.length + 1) {
      return Combat.newCombat();
    }

    let combat = Combat.combats[choice - 1];
    let localFighters = Fighter.cloneFighter(combat.fighters)
    localFighters.sort((a, b) => b.dex - a.dex);
    console.log(`\nRunning combat: ${combat.name}`);
    
    let flag = true
    while (flag){
      for (let characterTurn = 0; characterTurn < localFighters.length; characterTurn++){
        const fighter = localFighters[characterTurn]

        localFighters.forEach((f, i) => {
          if (i === characterTurn){
            console.log("////")
            Fighter.displayFighters(fighter)
            console.log("////")
          } else {
            Fighter.displayFighters(f)
          }
        })

        console.log("\nHit Y if the character inflicted damage on someone, M if they cast a spell, or just press enter to go to the next turn. If multiple, separate by comma.")
        let flagHit = prompt().toUpperCase()
        flagHit = flagHit.split(",").map(s => s.trim());

        if (flagHit.includes('Y')){
          const result = Fighter.inflictDamageFigher(localFighters, characterTurn)
          localFighters =  result.localFighters
          characterTurn = result.characterTurn
        }
        
        if (localFighters[characterTurn] && flagHit.includes('M')){          
          if (localFighters[characterTurn].spells.length > 0){
            list(`\nChoose Spell`, localFighters[characterTurn].spells)
            let spell = parseInt(prompt())
            spell = validateNumber(spell, localFighters[characterTurn])

            const result = Fighter.castSpell(localFighters, localFighters[characterTurn], spell, characterTurn)
            localFighters = result.localFighters
            characterTurn = result.characterTurn 
          }
        }
      }
      flag = loopControl("\nDo you wish to continue the fight")
    }
  }

  static menuCombat(){
    let choice = 1
    while (choice != 5){
      console.log("\n1 - Show existing combats")
      console.log("2 - Add new combat to databaset")
      console.log("3 - Edit combat")
      console.log("4 - Run combat")
      console.log("5 - Go back")
    
      choice = parseInt(prompt())
      choice = validateNumber(choice, 5)

      if (choice === 1){
        Combat.showCombats()
      } else if (choice === 2){
        Combat.newCombat()
      } else if (choice === 3){
        list("\nCombat", Combat.combats);
        console.log(`${Combat.combats.length + 1}: add new combat`);
        let choice2 = parseInt(prompt("\nChoose combat number: "));
        choice2 = validateNumber(choice, Combat.combats.length + 1)

        if (choice2 === Combat.combats.length + 1) {
          return Combat.newCombat();
        }
        let combat = Combat.combats[choice2 - 1];
        console.log(`\nEditing combat: ${combat.name}`);
        Combat.editCombat(combat)
      } else if (choice === 4){
        Combat.runCombat()
      }
    }
  }
}


// ===============================
// Global Load/Save
// ===============================
function loadAllData(){
  Spell.load()
  Weapon.load()
  Character.load()
  NPC.load()
  Combat.load()
}

function saveAllData(){
  Spell.save()
  Weapon.save()
  Character.save()
  NPC.save()
  Combat.save()
}

loadAllData()

process.on('exit', saveAllData)
process.on('SIGINT', () => {saveAllData(); process.exit()})

// ===============================
// CheatSheet
// ===============================

let CheatSheet = {
    data: [
  {
    name: "Skill Checks",
    items: [
      "Combined Skill Rolls: Some rolls may be compared to more than one skill.",
      "Opposed Rolls: Both sides roll; best success level wins. No push, higher stat wins ties.",
      "Against NPCs: <50 = Regular, >50 = Hard, ≥90 = Extreme."
    ],
    subsections: [
      {
        name: "Dice Modifiers",
        items: [
          "Bonus Die: Roll extra tens die, keep lowest.",
          "Penalty Die: Roll extra tens die, keep highest.",
          "Multiple dice cancel to net modifier."
        ]
      },
      {
        name: "Luck",
        items: [
          "Spend points to succeed or upgrade success.",
          "Can’t escape Fumbles by spending Luck.",
          "Not usable on Luck rolls, SAN, damage, or opposed rolls."
        ]
      },
      {
        name: "Pushing Rolls",
        items: [
          "Retry with justification.",
          "Failing a pushed roll has dire consequences.",
          "Not allowed for Luck, SAN, Combat, Damage, or opposed rolls."
        ]
      }
    ]
  },
  {
    name: "Sanity",
    items: [
      "Roll d100 ≤ SAN for minimal loss; fail = greater loss; fumble = max loss.",
      "Failing SAN = involuntary reaction (cry, freeze, lash out).",
      "First Mythos insanity adds +5 Cthulhu Mythos; later = +1."
    ]
  },
  {
    name: "Combat",
    subsections: [
      {
        name: "Initiative",
        items: [
          "Highest DEX first; ties = higher combat skill.",
          "Readied firearms/spells = +50 DEX."
        ]
      },
      {
        name: "Surprise",
        items: [
          "Keeper may allow Listen/Spot Hidden/Psychology roll.",
          "Opposed vs attacker’s Stealth.",
          "Firearms/Thrown always require roll with Bonus die."
        ]
      },
      {
        name: "Melee (Brawl) Attacks",
        subsections: [
          {
            name: "Fighting Maneuvers",
            items: [
              "Choose outcome (disarm, knock down, grapple, etc.).",
              "Compare Build: penalty dice if smaller, difference ≥3 = impossible.",
              "Defender declares Dodge/Fight Back/Maneuver.",
              "Success can impose ongoing disadvantage (e.g. pinned)."
            ]
          },
          {
            name: "Extreme Damage / Impales",
            items: [
              "Blunt weapons: max damage + max bonus.",
              "Penetrating weapons: max damage + max bonus + extra weapon damage roll."
            ]
          },
          {
            name: "Outnumbered",
            items: [
              "After defending once, further Brawl attacks give attacker a Bonus die.",
              "Not applied if single creature makes multiple attacks."
            ]
          }
        ]
      },
      {
        name: "Thrown Weapons",
        items: [
          "Can Fight Back if within DEX/5 ft.",
          "Can always Dodge.",
          "Thrown/missile apply half attacker’s damage bonus."
        ]
      },
      {
        name: "Attack Options",
        items: [
          "Fight Back: Highest success wins; tie = initiator wins.",
          "Dodge: Attacker wins with higher success; tie = defender wins.",
          "Do Nothing: Attack auto succeeds or gains Bonus die.",
          "Flee: May trigger a Chase based on MOV."
        ]
      },
      {
        name: "Firearms",
        items: [
          "Cannot Dodge or Fight Back against firearm attacks."
        ]
      }
    ]
  },
  {
    name: "Roll Results",
    items: [
      "01 = Critical Success",
      "≤ 1/5 skill = Extreme Success",
      "≤ 1/2 skill = Hard Success",
      "≤ skill = Regular Success",
      "> skill = Failure",
      "96+ if skill < 50% = Fumble",
      "100 = Fumble"
    ]
  },
  {
    name: "SAN Loss Effects",
    items: [
      "5+ from one source: INT roll → fail = suppress memory, success = temporary insanity (d10 hrs).",
      "1/5 in one day: Indefinite Insanity.",
      "Reach 0 SAN: Permanent Insanity, become NPC."
    ]
  },
  {
    name: "Firearms & Ranged Combat",
    subsections: [
      {
        name: "Ranges",
        items: [
          "Base = Regular success.",
          "Long (x2) = Hard success.",
          "Extreme (x4) = Extreme success.",
          "Very long = Extreme only; impale only on 01."
        ]
      },
      {
        name: "Bonus Dice",
        items: [
          "Aiming: spend 1 round.",
          "Point Blank: within DEX/5 ft.",
          "Large Target: Build 4+."
        ]
      },
      {
        name: "Penalty Dice",
        items: [
          "Cover (≥ half target).",
          "Fast-Moving Target (MOV 8+).",
          "Reloading: 1 round per shot.",
          "Handguns multiple shots: -1 per shot.",
          "Firing into melee: fumble may hit ally.",
          "Small Target: Build -2 or less.",
          "Dive for Cover: Dodge roll; lose next attack."
        ]
      },
      {
        name: "Automatic Fire",
        items: [
          "Skill ÷ 10 = bullets per volley (min 3).",
          "Extra volleys add penalty dice.",
          "After 2 penalty dice, increase difficulty level required.",
          "Damage = volley roll × bullets fired."
        ]
      },
      {
        name: "Multiple Targets",
        items: [
          "Waste 1 bullet per yard between targets.",
          "Success: half bullets hit; Extreme: all bullets hit.",
          "Extreme difficulty shots = normal hits, not impales."
        ]
      },
      {
        name: "Malfunctions",
        items: [
          "Revolver/bolt-action: fail to fire.",
          "Lever-action: jam (fix with roll).",
          "Fumbles may hit ally or self."
        ]
      }
    ]
  },
  {
    name: "Armor",
    items: [
      "Reduces physical damage taken.",
      "Does not protect from magic, poison, drowning, etc."
    ]
  },
  {
    name: "Chases",
    subsections: [
      {
        name: "Initiation",
        items: [
          "CON or Drive roll modifies MOV.",
          "If escapee MOV > pursuer → escape.",
          "Else chase begins."
        ]
      },
      {
        name: "Chase Round",
        items: [
          "Place participants, hazards, barriers.",
          "Assign movement actions based on MOV.",
          "Resolve in DEX order."
        ]
      },
      {
        name: "Movement Actions",
        items: [
          "Slowest = 1 action.",
          "Others gain +1 per MOV above slowest."
        ]
      },
      {
        name: "Actions",
        items: [
          "Move Forward (1–5 locations with penalties).",
          "Attack (Fighting, Firearms, Drive Auto).",
          "Move + ranged attack (penalty die).",
          "Cast spell or other action.",
          "Create hazard (requires skill roll).",
          "Dodge/Fight Back are free."
        ]
      },
      {
        name: "Hazards",
        items: [
          "Spend actions for bonus dice.",
          "Failing reduces actions by 1d3."
        ]
      },
      {
        name: "Barriers",
        items: [
          "Fail = stop or wreck vehicle.",
          "Vehicle deals 1d10 damage per Build.",
          "Attacker vehicle also takes half damage."
        ]
      },
      {
        name: "Conflict",
        items: [
          "Vehicles use Drive Auto for combat.",
          "Damage reduces Build (-1 per 10 damage)."
        ]
      },
      {
        name: "Passengers",
        items: [
          "Gain protection from vehicle.",
          "Can assist driver (Spot Hidden/Navigate)."
        ]
      },
      {
        name: "Ranged Attacks",
        items: [
          "Tires: armor 3, only impaling weapons harm them.",
          "Burst tire: 2 damage, vehicle loses 1 Build.",
          "Driver taking Major Wound must roll to keep control."
        ]
      }
    ]
  },
  {
    name: "Magic",
    items: [
      "Magic Points = 1/5 POW at start.",
      "Casting a new spell: POW (Hard) roll, can be pushed.",
      "Regain 1 MP per hour."
    ]
  },
  {
    name: "Wounds & Healing",
    subsections: [
      {
        name: "Death",
        items: [
          "Damage > max HP in one attack = death."
        ]
      },
      {
        name: "Major Wound",
        items: [
          "≥50% HP in one attack.",
          "Target prone, CON roll to avoid unconsciousness."
        ]
      },
      {
        name: "Zero HP",
        items: [
          "At 0 HP with Major Wound = unconscious and dying."
        ]
      },
      {
        name: "Dying",
        items: [
          "Roll CON at end of each round; fail = death."
        ]
      },
      {
        name: "First Aid",
        items: [
          "Within 1 hr: restores 1 HP.",
          "Stabilizes dying (1 temp HP)."
        ]
      },
      {
        name: "Medicine",
        items: [
          "Restores 1d3 HP if same day.",
          "Later requires Hard success.",
          "Prevents relapse into dying."
        ]
      },
      {
        name: "Recovery",
        items: [
          "No Major Wound: +1 HP/day.",
          "With Major Wound: weekly CON roll.",
          "Success = +1d3 HP/week, Extreme = +2d3 HP.",
          "Extreme success or HP > half max removes Major Wound."
        ]
      }
    ]
  },
  {
    name: "Development Phase",
    items: [
      "Skill Check Improvement: Roll > skill or >95 → +1d10.",
      "If skill reaches 90%: +2d6 SAN."
    ],
    subsections: [
      {
        name: "Activities",
        items: [
          "Check Credit Rating.",
          "Use Contacts.",
          "Recover Luck.",
          "Training: 4 months to improve skill.",
          "Aging effects.",
          "Keeper SAN Awards.",
          "Reduce SAN limits (track Mythos SAN loss).",
          "Psychotherapy: Psychoanalysis roll, SAN gain/loss, cure disorders.",
          "Self-Help: SAN check to gain/lose SAN, handle Key Connections.",
          "Private Care: Monthly roll (01–95 = SAN gain, 96–100 = SAN loss).",
          "Institutionalization: Monthly roll (01–50 = SAN gain, 51–95 = no change, 96–100 = SAN loss)."
        ]
      }
    ]
  },
  {
    name: "Insanity",
    subsections: [
      {
        name: "Phase 1 (Bout of Madness)",
        items: [
          "Lose self-control; Keeper dictates.",
          "Lasts d10 rounds or longer.",
          "Character cannot lose further SAN during Bout.",
          "Backstory permanently altered afterwards."
        ]
      },
      {
        name: "Phase 2 (Aftereffects)",
        items: [
          "Roleplay ongoing insanity.",
          "Any SAN loss triggers another Bout.",
          "Lasts for remaining duration (hours or indefinitely)."
        ]
      },
      {
        name: "Phobic/Manic",
        items: [
          "Penalty die on all rolls.",
          "Successful Psychoanalysis can suppress phobia/mania."
        ]
      },
      {
        name: "Reality Check",
        items: [
          "Fail = lose 1 SAN, delusion continues.",
          "Success = perceive reality correctly."
        ]
      }
    ]
  },
  {
    name: "Mythos Tomes",
    subsections: [
      {
        name: "Initial Reading",
        items: [
          "Takes days.",
          "Language roll required.",
          "Gain CMI, reduce Max SAN, lose SAN."
        ]
      },
      {
        name: "Full Study",
        items: [
          "Must know language.",
          "SAN roll, lose SAN.",
          "Gain CMF if Mythos < rating, else gain CMI.",
          "Each further study = ×2 time, same SAN/CM gain."
        ]
      },
      {
        name: "Reference",
        items: [
          "1d4 hours.",
          "Make book’s Mythos rating roll."
        ]
      }
    ]
  }
    ],

  listRule: function (item, indent = 0) {
    const prefix = " ".repeat(indent);

    console.log(`\n${prefix}${item.name}:`);

    if (item.items) {
      item.items.forEach(line => {
      console.log(`${prefix}- ${line}`);
    });
      }

      if (item.subsections) {
        item.subsections.forEach(sub => {
        this.listRule(sub, indent + 2);
      });
     }
  },

  listCheats: function () {
    let flag = true;
    while (flag) {
      console.log("\nCategories:");
      this.data.forEach((item, i) => {
      console.log(`${i + 1}: ${item.name}`);
    });

    let number = parseInt(prompt("Choose which category you wish to read about: ")) - 1;
    number = validateNumber(number+1, this.data.length-1)
    this.listRule(this.data[number]);
    flag = loopControl("Do you want to read another category?");
    }
  }
};

function menu(){
  let choice = 1
  while (choice != 6){
    console.log("\n1 - Add new spell to database")
    console.log("2 - Add new weapon to database")
    console.log("3 - See character related options")
    console.log("4 - See npc related options")
    console.log("5 - See combat related options")
    console.log("6 - See Cheat Sheet")
    console.log("7 - Close")
    
    choice = parseInt(prompt())
    choice = validateNumber(choice, 7)

    if (choice === 1){
      Spell.newSpell()
    } else if (choice === 2){
      Weapon.newWeapon()
    } else if (choice === 3){
      Character.characterMenu()
    } else if (choice === 4){
      NPC.NPCMenu()
    } else if (choice === 5){
      Combat.menuCombat()
    } else {
      CheatSheet.listCheats()
    }
  }
}

menu()