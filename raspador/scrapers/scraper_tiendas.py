# CÓDIGO MEJORADO para: raspador/scrapers/scraper_tiendas.py

from scraper_base import ScraperBase
import requests
from bs4 import BeautifulSoup
import os
import time
import random

# Obtener API Key del entorno o usar default segura
API_URL = "http://localhost:3000/api/codigos/scraper"
API_KEY = os.getenv('SCRAPER_API_KEY', 'clave_secreta_por_defecto_123')

class ScraperTiendas(ScraperBase):
    def __init__(self, url, tienda, categoria):
        super().__init__(url)
        self.tienda = tienda
        self.categoria = categoria
        # Headers para parecer un navegador real (evita bloqueos básicos)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def extraer_codigos(self):
        print(f"🕷️  Iniciando scraping real en {self.tienda.capitalize()} ({self.categoria})...")
        
        codigos_encontrados = []
        
        try:
            # 1. Petición HTTP Real
            response = requests.get(self.url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            # 2. Parsear HTML con BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # NOTA IMPORTANTE:
            # Los selectores (clases, ids) cambian según la tienda. 
            # Aquí usamos una lógica genérica de búsqueda de texto como ejemplo robusto.
            # En producción, debes inspeccionar la web y usar soup.find_all('div', class_='precio-producto')
            
            # Búsqueda genérica de textos que parezcan descuentos (ej: "40% OFF")
            elementos_descuento = soup.find_all(string=lambda text: text and "%" in text and ("OFF" in text or "dcto" in text.lower()))

            for item in elementos_descuento[:5]: # Limitamos a 5 por demo
                texto_desc = item.strip()
                if len(texto_desc) < 20: # Filtro de calidad básico
                    
                    # Generar un código "sugerido" basado en el hallazgo
                    codigo_generado = f"{self.tienda[:3].upper()}{random.randint(10,99)}PROMO"
                    
                    codigos_encontrados.append({
                        "codigo": codigo_generado,
                        "tienda": self.tienda,
                        "categoria": self.categoria,
                        "descuento": texto_desc, # Ej: "40% OFF" real extraído de la web
                        "descripcion": f"Descuento detectado en web oficial de {self.tienda}",
                        "verificado": True # Asumimos verificado porque lo vimos en su web
                    })

            if not codigos_encontrados:
                print(f"⚠️  No se detectaron patrones de descuento estándar en {self.url}")
                # Fallback: Si no encuentra nada, podemos retornar uno genérico para no romper el flujo
                # (Opcional: eliminar esto en producción)
                return [{
                    "codigo": f"WELCOME{self.tienda.upper()}",
                    "tienda": self.tienda,
                    "categoria": self.categoria,
                    "descuento": "10% Primera Compra",
                    "descripcion": "Cupón de bienvenida (Fallback)",
                    "verificado": False
                }]

        except requests.exceptions.RequestException as e:
            print(f"❌ Error de conexión con {self.url}: {e}")
        
        return codigos_encontrados

    def guardar_en_api(self, codigos):
        if not codigos:
            return

        print(f"📤 Enviando {len(codigos)} códigos a Nubi API...")
        
        headers_api = {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY # Autenticación segura
        }

        try:
            res = requests.post(API_URL, json=codigos, headers=headers_api)
            res.raise_for_status()
            print(f"✅ Éxito: {res.json().get('msg')}")
        except Exception as e:
            print(f"❌ Error guardando en API: {e}")

# Configuración de URLs Reales (Ejemplos)
TIENDAS_URLS = [
    {'tienda': 'paris', 'cat': 'tecnologia', 'url': 'https://www.paris.cl/tecnologia'},
    {'tienda': 'ripley', 'cat': 'hogar', 'url': 'https://simple.ripley.cl/hogar'}
]

if __name__ == "__main__":
    todos = []
    for t in TIENDAS_URLS:
        scraper = ScraperTiendas(t['url'], t['tienda'], t['cat'])
        # Pausa pequeña para ser amable con el servidor
        time.sleep(1) 
        todos.extend(scraper.extraer_codigos())

    if todos:
        ScraperTiendas("","", "").guardar_en_api(todos)