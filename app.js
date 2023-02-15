'use strict';

const getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
  // config object,

  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0, // for special attacks
      winner: null, // for determining the winner.
      playerAttacks: [],
      monsterAttacks: [],
    };
  },

  computed: {
    // without arguments. Because there won't be any difference between
    // computed properties and methods.

    monsterBarStyles() {
      return { width: `${this.monsterHealth}%` };
    },

    playerBarStyles() {
      return { width: `${this.playerHealth}%` };
    },

    specialAttackIsAvailable() {
      const isEnabled = this.currentRound % 3 === 0;
      return !isEnabled;
    },

    fightIsOn() {
      return this.playerAttacks.length > 0 && this.monsterAttacks.length > 0;
    },
  },

  watch: {
    playerHealth(value) {
      const minLimit = 1;
      const monsterHealth = this.monsterHealth;

      if (value === minLimit && monsterHealth === minLimit)
        this.winner = 'draw'; // A draw
      else if (value <= minLimit) this.winner = 'monster'; // player lost
    },

    monsterHealth(value) {
      const minLimit = 1;
      const playerHealth = this.playerHealth;

      if (value === minLimit && playerHealth === value)
        this.winner = 'draw'; // A draw
      else if (value <= minLimit) this.winner = 'player'; // monster lost
    },
  },

  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.playerAttacks = [];
      this.monsterAttacks = [];
    },

    // Attacks are done with arbitrary and random damage values.

    attackMonster() {
      this.currentRound++;
      // minDamage: 5 and maxDamage: 12 => damage done per blow.
      const damage = getRandomValue(5, 12);
      this.playerAttacks.push(damage);
      this.monsterHealth -= damage;
      this.monsterHealth = Math.max(1, this.monsterHealth);

      this.attackPlayer(); // player must be counter-attacked at the same time.
    },

    specialAttackMonster() {
      // Special Attack does more damage.
      // minDamage: 10 and maxDamage: 25
      this.currentRound++;
      const specialAttackDamage = getRandomValue(10, 25);
      this.playerAttacks.push(specialAttackDamage);
      this.monsterHealth -= specialAttackDamage;
      this.monsterHealth = Math.max(1, this.monsterHealth);

      this.attackPlayer();
    },

    attackPlayer() {
      // minDamage = 8 and maxDamage = 15
      const damage = getRandomValue(8, 15);
      this.monsterAttacks.push(damage);
      this.playerHealth -= damage;
      this.playerHealth = Math.max(this.playerHealth, 1);
    },

    healPlayer() {
      this.currentRound++;
      const healedHealth = this.playerHealth + getRandomValue(8, 15); // monster damage values
      this.playerHealth = Math.min(100, healedHealth);
      this.attackPlayer(); // monster attacks us while healing
    },

    surrender() {
      this.winner = 'monster';
      this.playerHealth = 1;
    },

    computeLog(index) {
      const log = `Player attacked the monster and the damage done was ${this.playerAttacks[index]}%.

       Monster counter-attacked the player and the damage done was ${this.monsterAttacks[index]}%`;

      return log;
    },
  },
});

app.mount('#game');

// Like data properties, methods can be accessed using 'this' keyword in VUE
// as they're also merged in a  B-T-S managed GLOBAL instance object
