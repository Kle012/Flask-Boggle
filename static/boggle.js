class BoggleGame {
    constructor(boardId) { 
        this.score = 0; 
        this.words = new Set(); 
        this.board = $("#" + boardId); 
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
        $(".list", this.board).append($("<li>", { word })); 
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