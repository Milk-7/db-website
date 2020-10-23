import requests
from bs4 import BeautifulSoup
import json
from translations import (
    ACCESS_FAIL_UNAUTHORIZED,
    STATION_PATTERN_URL,
    STATION_ALL_CHAGNES_URL,
    STATION_PLAN_URL,
    STATION_RECENT_CHANGES_URL,
)
from datetime import datetime

# TODO use regex
class DBClient:
    def __init__(self, auth_token: str) -> None:
        # headers needed to make requests
        self.headers = {
            "Accept": "application/xml",
            "Authorization": f"Bearer {auth_token}",
        }

        # check if the token is valid
        request = requests.get(STATION_PATTERN_URL + "BLS", headers=self.headers)

        if request.status_code == 401:
            raise Exception("Invalid Token")

    def get_stations(self, pattern: str) -> dict:
        request = requests.get(STATION_PATTERN_URL + pattern, headers=self.headers)
        soup = BeautifulSoup(request.text, "xml")
        stations = soup.find_all("station")

        # check if there are any stations found
        if len(stations) == 0:
            return {}

        # converte needed data into dict
        data = {}
        for station in stations:
            s = {"station": {"name": station["name"], "eva": station["eva"]}}

        return data

    @staticmethod
    def check_date(date: str) -> bool:
        # check if date is in correct format
        if len(date) != 6:
            return False

        try:
            int(date)

        except:
            return False

        year = date[0:2]
        month = int(date[2:4])
        day = int(date[4:6])

        try:
            datetime(year=int(f"20{year}"), month=month, day=day)
        except:
            return False

        return True

    @staticmethod
    def check_hour(hour: str) -> bool:
        # check if hour is in correct format
        try:
            int(hour)

        except:
            return False

        if len(hour) != 2 or int(hour) > 24:
            return False

        return True

    def get_planned_data(self, eva: str, date: str, hour: str) -> dict:
        pass
