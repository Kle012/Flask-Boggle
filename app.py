from flask import Flask, render_template, request, session, jsonify
# from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask (__name__)
app.config['SECRET_KEY'] = "secret"
# debug = DebugToolbarExtension(app)
# app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
 

boggle_game = Boggle()

@app.route("/")
def home_page():
    """Displaying the Board"""
    board = boggle_game.make_board()
    session["board"] = board
    plays = session.get("plays", 0)
    highscore = session.get("highscore", 0)
    return render_template("home.html", board=board, plays=plays, highscore=highscore)


@app.route("/check-word")
def check_word():
    """Check for a Valid Word"""
    word = request.args["word"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, word)
    return jsonify({"result": res})

@app.route("/keep-score", methods=["POST"])
def keep_score():
    """Posting a Score: get score, update highscore and guesses """
    data = request.get_json()
    score = data["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    session["plays"] = plays + 1
    session["highscore"] = max(score, highscore)
    

    return jsonify(highestScore = score > highscore)


