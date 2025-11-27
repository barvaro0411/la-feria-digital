# CÓDIGO FINAL para: raspador/scrapers/scraper_tiendas.py

from scraper_base import ScraperBase
import requests

API_URL = "http://localhost:3000/api/codigos/scraper"

class ScraperTiendas(ScraperBase):
    def __init__(self, url, tienda, categoria):
        super().__init__(url)
        self.tienda = tienda
        self.categoria = categoria

    def extraer_codigos(self):
        # Esta es la parte de SIMULACIÓN de la extracción real con BeautifulSoup.
        print(f"Extrayendo data de {self.tienda} / {self.categoria}...")
        
        codigos = [
            {
                "codigo": f"RASPADO{self.tienda[:3].upper()}{self.categoria[:2].upper()}{i}",
                "tienda": self.tienda,
                "categoria": self.categoria,
                "descuento": f"Simulación Descuento {i}%",
                "descripcion": f"Código raspado para {self.categoria} de la web.",
                "verificado": False
            }
            for i in range(1, 3) # Simula 2 códigos por tienda/categoría
        ]
        return codigos

    def guardar_en_api(self, codigos):
        if not codigos:
            print("No hay códigos para guardar.")
            return

        print(f"Enviando {len(codigos)} códigos a la API...")
        try:
            # Usa requests para enviar un array JSON al endpoint desprotegido
            response = requests.post(
                API_URL, 
                json=codigos, 
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            
            print(f"✅ Éxito al guardar: {response.json().get('msg')}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Error al conectar o en la API: {e}")
            if e.response is not None:
                print(f"Respuesta del servidor: {e.response.text}")
            
# Tiendas y Categorías definidas en config.py
TIENDAS = ['paris', 'falabella', 'ripley'] 
CATEGORIAS = ['mujer', 'tecnologia'] 

if __name__ == "__main__":
    todos_los_codigos = []
    
    for tienda in TIENDAS:
        for categoria in CATEGORIAS:
            scraper = ScraperTiendas(f"https://{tienda}.com/{categoria}", tienda, categoria)
            codigos_extraidos = scraper.extraer_codigos()
            todos_los_codigos.extend(codigos_extraidos)

    if todos_los_codigos:
        guardador = ScraperTiendas("", "", "") 
        guardador.guardar_en_api(todos_los_codigos)
    else:
        print("No se extrajo ningún código.")

    print(f"\nProceso finalizado. Total de códigos generados: {len(todos_los_codigos)}")