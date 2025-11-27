# Funciones auxiliares para scraping
import re
from datetime import datetime

def limpiar_codigo(codigo):
    return re.sub(r'[^A-Z0-9]', '', codigo.upper())

def validar_fecha(fecha_str):
    try:
        return datetime.strptime(fecha_str, '%Y-%m-%d')
    except ValueError:
        return None
