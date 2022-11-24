from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        """Stuff to do before every test"""
        self.client = app.test_client()
        app.config["TESTING"] = True
        app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]
    
    def test_home(self):
        """Testing homepage to make sure session and HTML displayed correctly"""
        with self.client:
            res = self.client.get("/")
            html = res.get_data(as_text = True)
            self.assertEqual(res.status_code, 200)
            self.assertIn("<h1>WELCOME TO THE BOGGLE GAME</h1>", html)
            self.assertIn("Score:", html)
            self.assertIn("Timer:", html)
            self.assertIn("Number of plays:", html)
            self.assertIn("Highest score", html)
            self.assertIn("board", session)
            self.assertIsNone(session.get("hightscore"))
            self.assertIsNone(session.get("plays"))
    
    def test_valid(self):
        """Testing for validity of a word by setting session before request"""
        with self.client as client:
            with client.session_transaction() as change_session:
                change_session["board"] = [["D","O","G","G","G"], ["D","O","G","G","G"], ["D","O","G","G","G"], ["D","O","G","G","G"], ["D","O","G","G","G"]]
        res = self.client.get("/check-word?word=dog")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json["result"], "ok")
    
    def test_invalid(self):
        """Testing if word is on board"""
        self.client.get("/")
        res = self.client.get("/check-word?word=abbreviation")
        self.assertEqual(res.json["result"], "not-on-board")

    def test_word(self):
        """Testing if word is a valid English word"""
        self.client.get("/")
        res = self.client.get("/check-word?word=kjdgvnkdjfvh")
        self.assertEqual(res.json["result"], "not-word")



