new Vue({
  el: '#app',
  data: {
    centerButton: "START",
    playing: false,
    isClickable: false,
    isWon: false,
    isWrong: false,
    strict: false,
    score: 0,
    sequence: [],
    sequenceInterval: null,
    playerSequence: [],
    sounds: [
    new Howl({
      src: ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"] }),

    new Howl({
      src: ["https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"] }),

    new Howl({
      src: ["https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"] }),

    new Howl({
      src: ["https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"] })],


    isLit: {
      1: false,
      2: false,
      3: false,
      4: false } },


  computed: {
    showScore() {
      if (this.isWon) {
        return "Play Again?";
      }
      return "Score: " + this.score;
    } },

  watch: {
    // if strict changes in middle of game, reset it
    strict() {
      this.startGame();
    } },

  methods: {
    startGame() {
      this.playing = true;
      this.sequence = [];
      this.playerSequence = [];
      this.centerButton = "RESET";
      this.isWon = false;
      this.isWrong = false;
      this.score = 0;
      clearInterval(this.sequenceInterval);
      this.showSequence();
    },
    clicked(tile) {
      if (this.isClickable) {
        this.playSound(tile);
        this.lightUp(tile);
        this.playerSequence.push(tile);
        this.checkWinLose();
      }
    },
    checkWinLose() {
      // check for incorrect
      for (let i = 0; i < this.playerSequence.length; i++) {
        if (this.playerSequence[i] !== this.sequence[i]) {
          if (this.strict) {
            this.centerButton = "Wrong!";
            this.isWrong = true;
            this.isClickable = false;
            return setTimeout(() => {
              this.startGame();
            }, 1000);
          }
          this.playerSequence = [];
          this.centerButton = "Wrong!";
          this.isWrong = true;
          setTimeout(() => {
            this.centerButton = "RESET";
            this.isWrong = false;
          }, 1000);
          this.showSequence(true);
        }
      }
      // if all correct and same length , continue
      if (this.playerSequence.length === this.sequence.length) {
        this.playerSequence = [];
        this.score++;
        // if win condition, show win, dont continue.
        if (this.score === 20) {
          this.centerButton = "Winner!";
          this.isClickable = false;
          this.isWon = true;
        } else {
          this.showSequence();
        }
      }
    },
    lightUp(tile) {
      this.isLit[tile] = true;
      setTimeout(() => {
        this.isLit[tile] = false;
      }, 300);
    },
    playSound(tile) {
      this.sounds[tile - 1].play();
    },
    showSequence(redo) {
      let currentIndex = 0;
      let speed = this.sequence.length === 0 ? 1000 : 700;
      this.isClickable = false;
      if (!redo) {
        // dont add number on incorrect answers
        this.sequence.push(Math.floor(Math.random() * 4 + 1));
      }
      this.sequenceInterval = setInterval(() => {
        if (currentIndex >= this.sequence.length) {
          clearInterval(this.sequenceInterval);
          return this.isClickable = true;
        }
        this.playSound(this.sequence[currentIndex]);
        this.lightUp(this.sequence[currentIndex]);
        currentIndex++;
      }, speed);
    } } });