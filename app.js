new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameIsRunning: false,
        logMessage: '',
        turns: []
    },
    methods: {
        startGame: function () {
            this.gameIsRunning = true;
            this.playerHealth = 100;
            this.monsterHealth = 100;
        },
        attack: async function () {
            this.logMessage = '';
            await this.playerAttack(3, 10, false);
            await this.monsterAttack(5, 12);
        },
        specialAttack:async function () {
            this.logMessage = '';
            await this.playerAttack(10, 20, true);
            await this.monsterAttack(5, 12);
            
        },
        async heal () {
            this.logMessage = '';
            await this.playerHeal(5, 10);
            await this.monsterAttack(5, 12);
        },
        giveUp () {
            if (confirm("Are you sure you wanna give up?")) {
                this.startGame();
                this.gameIsRunning = false;
            }
        },
        calculateActionEffect (min, max) {
            return Math.max(Math.floor(Math.random() * max) + 1, min);
        },
        async checkWinCondition () {
            if (this.monsterHealth <= 0) {
                await this.writeLog("Player defeated the monster!<br />");
                this.endGameConfirmMessage('You win!! \o/ <br />Do you want to start again?');
                return true;
            } else if (this.playerHealth <= 0) {
                await this.writeLog("Player has died!<br />");
                this.endGameConfirmMessage('You loose! =( <br />Do you want to start again?');
                return false;
            }
        },
        endGameConfirmMessage (message) {
            if (confirm(message)) {
                this.startGame();
            }
            else {
                this.gameIsRunning = false;
            }
        },
        async playerAttack (min, max, isSpecial) {
            var attackMessage = "Player attacked!<br />";
            if (isSpecial)
                attackMessage = "Player used special attack!<br />"
            await this.writeLog(attackMessage);
            var damage = this.calculateActionEffect(min, max);
            this.monsterHealth -= damage;

            await this.writeLog(`Player has caused ${damage} of damage<br />`, true);
            if (await this.checkWinCondition())
                return;
        },
        async monsterAttack (min, max) {
            await this.writeLog("Monster attacked!<br />");
            var damage = this.calculateActionEffect(min, max);
            this.playerHealth -= damage;
            await this.writeLog(`Monster has caused ${damage} of damage<br />`, false);
            await this.checkWinCondition();
        },
        async playerHeal (min, max) {
            if (this.playerHealth < 100) {
                var healEffect = this.calculateActionEffect(min, max);
                if (this.playerHealth + healEffect <= 100) {
                    this.playerHealth += healEffect;
                    await this.writeLog(`Player was healed by ${healEffect}!<br />`, true);
                }
                else {
                    healEffect = 100 - this.playerHealth;
                    this.playerHealth = 100;
                    await this.writeLog(`Player was healed by ${healEffect}!<br />`, true);
                }
            }
        },
        async writeLog (message, isPlayer) {
            // this.turns.push({
            //     isPlayer: isPlayer,
            //     text: message
            // });
            // Prints in pokemon style
            for (let index = 0; index < message.length; index++) {
                const char = message[index];
                await this.sleep(50);
                this.logMessage += char;
            }
        },
        sleep (milisecconds) {
            return new Promise(resolve => setTimeout(resolve, milisecconds));
        },
    }
});