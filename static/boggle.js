class BoggleGame {
    constructor(boardId, secs = 60) { 
        this.secs = secs;
        this.displayTime();

        this.score = 0; 
        this.words = new Set(); 
        this.board = $("#" + boardId); 

        // Every 1000msec, count down
        this.timer = setInterval(this.countDown.bind(this), 1000); 

        // Capture the return JSON result and show it on page
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    displayTime() {
        // Display timer
        $(".timer", this.board).text(this.secs); 
    }

    async countDown() {
        // Count down every second
        this.secs -= 1;
        this.displayTime();

        if(this.secs === 0){
            clearInterval(this.timer);
            await this.gameEnd(); 
        }
    }

    alertMsg(msg, cls) {
        // Show an alert msg
        $(".msg", this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`); 
    }

    guessedWord(word) {
        // List of guessed words
        $(".list", this.board).append($("<li>", { text: word })); 
    }

    displayScore() {
        // Display score
        $(".score", this.board).text(this.score);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const $word = $(".word", this.board); 
        let w = $word.val();

        if (!w) return;
        if (this.words.has(w)){
            this.alertMsg(`${w} has already been found`, "err");
            return;  
        }

        // Check for valid word in dictionary
        const res = await axios.get("/check-word", { params: {word: w }});
        if (res.data.result === "not-word"){
            this.alertMsg(`${w} is not a valid word`, "err");
        } 
        else if (res.data.result === "not-on-board"){
            this.alertMsg(`${w} is not on valid on board`, "err"); 
        } 
        else {
            this.guessedWord(w);
            this.score += w.length; 
            this.displayScore(); 
            this.words.add(w);
            this.alertMsg(`${w} is added`, "ok"); 
        }
        $word.val("").focus(); 
    }

    async gameEnd() {
        // Display score when game end
        $(".add-word", this.board).hide();
        const res = await axios.post("/keep-score", { score: this.score });
        if (res.data.highestScore) {
            this.alertMsg(`New record: ${this.score}`, "ok")
        }
        else {
            this.alertMsg(`Final score: ${this.score}`, "ok")
        }
    }
}