# Scraper base
import requests
from bs4 import BeautifulSoup

class ScraperBase:
    def __init__(self, url):
        self.url = url
    
    def obtener_html(self):
        response = requests.get(self.url)
        return response.text
    
    def parsear(self, html):
        return BeautifulSoup(html, 'html.parser')
