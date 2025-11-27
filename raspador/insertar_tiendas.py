# CÓDIGO para el NUEVO ARCHIVO: raspador/insertar_tiendas.py

import requests
import json
import os

# NOTA: Usaremos la ruta /demo que es la que borra y crea los datos de ejemplo
API_URL = "http://localhost:3000/api/tiendas-fisicas/demo" 
RUTA_DATOS = "datos_tiendas_demo.json"

def insertar_tiendas():
    # 1. Leer el archivo JSON
    try:
        with open(RUTA_DATOS, 'r', encoding='utf-8') as f:
            datos_tiendas = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Archivo {RUTA_DATOS} no encontrado.")
        return

    print(f"Enviando {len(datos_tiendas)} tiendas a la API: {API_URL}")
    
    # 2. Enviar los datos por POST
    try:
        response = requests.post(
            API_URL, 
            json=datos_tiendas,
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status() # Lanza error para códigos 4xx/5xx

        print(f"✅ Éxito al guardar: {response.json().get('msg')}")
        print("\n¡Datos del mapa cargados!")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error en la petición a la API: {e}")
        if e.response is not None:
            print(f"Respuesta del servidor: {e.response.text}")

if __name__ == "__main__":
    insertar_tiendas()