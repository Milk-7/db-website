from flask import Flask, render_template, send_from_directory, url_for
from db_api_wrapper import DBClient
import os

app = Flask(__name__)
client = DBClient("")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_station/<pattern>")
def get_station(pattern: str) -> None:
    found = client.get_stations(pattern)
    return found


@app.route("/get_plan/<eva>/<date>/<time>")
def get_plan(eva: str, date: str, time: str) -> None:
    found = client.get_planned_data(eva, date, time)
    return found


@app.route("/get_all_changes/<eva>")
def get_all_changes(eva: str) -> None:
    found = client.get_all_known_changes(eva)
    return found


@app.route("/get_recent_changes/<eva>")
def get_recent_changes(eva: str) -> None:
    found = client.get_recent_changes(eva)
    return found
