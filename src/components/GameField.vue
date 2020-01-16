	<template>
  <div class="template__container">
    <!-- left side-->
    <div class="game">
      <b-container>
        <b-row>
          <b-col cols="4">
            <select name="select_mode" class="game__input select-mode" v-on:change="setMode()">
              <option selected disabled style="display: none">Pick game mode</option>
              <option class="option-mode" v-for="(value, key) in gameMode" :key="key">{{ key }}</option>
            </select>
          </b-col>
          <b-col cols="4">
            <b-form-input
              type="text"
              class="game__input input-mode"
              placeholder="Enter your name"
              v-on:keyup="setName()"
              v-model="gamePlayer"
            ></b-form-input>
          </b-col>
          <b-col cols="4">
            <b-button
              class="game__input game__button"
              :disabled="buttonEnable==false"
              v-on:click="generateGameField()"
            >Play</b-button>
          </b-col>
        </b-row>

        <b-alert show variant="succec" class="game__message" v-if="messageEnable">
          <p>{{gamePlayer}}'s score: {{gameScore.gameScorePlayer}}</p>
          <p>Computer's score: {{gameScore.gameScoreComputer}}</p>
          <p v-if="gameEnd">{{gameMsg}}</p>
        </b-alert>
        <div class="game__field"></div>
      </b-container>
    </div>
    <!--end left side-->
    <!-- right side-->
    <div class="score-board">
      <b-container>
        <h2>Leader Board</h2>
        <div class="score-board__table">
          <div class="score-board__row" v-for="(value, key) in scoreToBoard" :key="key">
            <div>{{value.winner}}</div>
            <div>{{value.date}}</div>
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

	<script>
export default {
  data() {
    return {
      gameMode: Object,
      gameMsg: String,
      gamePlayer: "",
      gameSetMode: {
        delay: Number,
        field: Number
      },
      gameScore: {
        gameScorePlayer: 0,
        gameScoreComputer: 0
      },
      gameResult: {
        winner: String,
        date: String
      },
      gameModeLink:
        "https://starnavi-frontend-test-task.herokuapp.com/game-settings",
      gameResultLink:
        "https://starnavi-frontend-test-task.herokuapp.com/winners",
      setModeStatus: false,
      setNameStatus: false,
      gameEnd: false,
      messageEnable: false,
      scoreToBoard: Object
    };
  },
  methods: {
    /**
     * get game setting from  "https://starnavi-frontend-test-task.herokuapp.com/game-settings",
     */
    getMode() {
      let modeInformation;
      let getGameModeRequest = new XMLHttpRequest();
      getGameModeRequest.open("GET", this.gameModeLink, false);
      getGameModeRequest.onload = () => {
        if (getGameModeRequest.readyState != 4) return;
        if (getGameModeRequest.status != 200) {
          alert(
            getGameModeRequest.status + ": " + getGameModeRequest.statusText
          );
        } else {
          modeInformation = JSON.parse(getGameModeRequest.responseText);
          this.gameMode = modeInformation;
        }
      };
      getGameModeRequest.send(null);
    },

    /**
     * set game setting by user`s click on mode select
     */
    setMode() {
      let nameMode = event.target.value;
      this.gameSetMode.delay = this.gameMode[nameMode].delay;
      this.gameSetMode.field = this.gameMode[nameMode].field;
      this.setModeStatus = true;
    },
    setName() {
      if (event.target.value != "") {
        this.setNameStatus = true;
      } else {
        this.setNameStatus = false;
      }
    },
    generateGameField() {
      const gameArea = document.querySelector(".game__field");
      this.messageEnable = true;
      //clear content of game field
      gameArea.innerHTML = "";

      //set width of game field. 50 is width of game dot

      gameArea.style.width = this.gameSetMode.field * 30 + "px";

      //add game dots inside game area
      for (
        let indexRow = 0;
        indexRow < this.gameSetMode.field * this.gameSetMode.field;
        indexRow++
      ) {
        let newElement = document.createElement("div");
        newElement.classList.add("game__block");
        gameArea.appendChild(newElement);
      }
      //change button`s text
      event.target.innerText = "Play again";

      this.play();
    },
    //stop game
    stop(arrayOfUsageBlocks, time, amoutOfBlocks) {
      if (
        arrayOfUsageBlocks.length == amoutOfBlocks ||
        this.gameScore.gameScorePlayer > Math.floor(amoutOfBlocks / 2) ||
        this.gameScore.gameScoreComputer >= Math.floor(amoutOfBlocks / 2)
      ) {
        clearInterval(time);

        //set result for request
        if (this.gameScore.gameScorePlayer > this.gameScore.gameScoreComputer) {
          this.gameResult.winner = this.gamePlayer;
          this.gameMsg = "You won";
        } else {
          this.gameResult.winner = "Computer";
          this.gameMsg = "Computer won";
        }

        this.gameResult.date = new Date().toLocaleString();
        this.gameEnd = true;
        this.sendResult();
      }
    },
    play() {
      const gameBlock = document.getElementsByClassName("game__block");
      const gameButton = document.querySelector(".game__button");
      const MAX_NUMBER = gameBlock.length;
      let arrayOfUsageBlocks = [];
      let clickStatus = [];
      this.gameScore.gameScorePlayer = 0;
      this.gameScore.gameScoreComputer = 0;
      this.gameEnd = false;
      let amoutOfBlocks = this.gameSetMode.field * this.gameSetMode.field;

      //
      //get random number of block
      let currentBlock = () => {
        return Math.floor(Math.random() * MAX_NUMBER);
      };
      //
      // play again
      gameButton.addEventListener("click", () => {
        clearInterval(time);
      });
      //

      let time = setInterval(() => {
        let indexGameBlock = currentBlock();

        //set unique random number of block
        while (arrayOfUsageBlocks.includes(indexGameBlock)) {
          indexGameBlock = currentBlock();
        }

        let setBlock = () => {
          arrayOfUsageBlocks.push(indexGameBlock);
          gameBlock[indexGameBlock].classList.add("start");

          gameBlock[indexGameBlock].addEventListener("click", () => {
            clickStatus[indexGameBlock] = true;
          });
        };

        setBlock();
        //check click
        setTimeout(() => {
          if (clickStatus[indexGameBlock]) {
            gameBlock[indexGameBlock].classList.add("success");
            this.gameScore.gameScorePlayer++;
          } else {
            gameBlock[indexGameBlock].classList.add("fail");
            this.gameScore.gameScoreComputer++;
          }
        }, this.gameSetMode.delay);

        this.stop(arrayOfUsageBlocks, time, amoutOfBlocks);
      }, this.gameSetMode.delay);
    },

    // send result to server
    sendResult() {
      let setGameResultRequest = new XMLHttpRequest();
      setGameResultRequest.open("POST", this.gameResultLink, false);

      setGameResultRequest.setRequestHeader("Content-type", "application/json");
      setGameResultRequest.onload = () => {
        if (setGameResultRequest.readyState != 4) return;
        if (setGameResultRequest.status != 200) {
          alert(
            setGameResultRequest.status + ": " + setGameResultRequest.statusText
          );
        }
      };
      let sendData = JSON.stringify(this.gameResult);
      setGameResultRequest.send(sendData);
      this.getResultToBoard();
    },

    //get result from server to score board
    getResultToBoard() {
      let resultBoard;
      let getResultBoard = new XMLHttpRequest();
      getResultBoard.open("GET", this.gameResultLink, false);
      getResultBoard.onload = () => {
        if (getResultBoard.readyState != 4) return;
        if (getResultBoard.status != 200) {
          alert(getResultBoard.status + ": " + getResultBoard.statusText);
        } else {
          resultBoard = JSON.parse(getResultBoard.responseText);
          this.scoreToBoard = resultBoard;
        }
      };

      getResultBoard.send(null);
    }
  },

  computed: {
    buttonEnable() {
      if (this.setNameStatus == true && this.setModeStatus == true) {
        return true;
      } else return false;
    }
  },
  beforeMount() {
    this.getMode();
    this.getResultToBoard();
  }
};
</script>

	<style>
@import url(../assets/css/gameField.css);
</style>