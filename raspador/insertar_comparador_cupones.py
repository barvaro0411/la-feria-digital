# CÓDIGO para el NUEVO ARCHIVO: raspador/insertar_comparador_cupones.py

import requests
import json

API_URL = "http://localhost:3000/api/codigos/scraper" 

def insertar_cupones_comparador():
    cupones = [
        {
            "codigo": "TECH20",
            "tienda": "falabella",
            "categoria": "tecnologia",
            "descuento": "20% en productos seleccionados",
            "descripcion": "El mejor descuento de tecnologia",
            "verificado": True
        },
        {
            "codigo": "RIPLEY15",
            "tienda": "ripley",
            "categoria": "tecnologia",
            "descuento": "15% OFF en toda la tienda",
            "descripcion": "Descuento general de temporada",
            "verificado": True
        },
        {
            "codigo": "PARIS10",
            "tienda": "paris",
            "categoria": "tecnologia",
            "descuento": "10% adicional con tarjeta",
            "descripcion": "Descuento en tecnología",
            "verificado": True
        }
    ]

    print(f"Enviando {len(cupones)} cupones de tecnología al comparador...")
    try:
        response = requests.post(API_URL, json=cupones, headers={'Content-Type': 'application/json'})
        response.raise_for_status()
        print(f"✅ Éxito al guardar: {response.json().get('msg')}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error al conectar o en la API: {e}")

if __name__ == "__main__":
    insertar_cupones_comparador()