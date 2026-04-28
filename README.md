# Examen 2 – Naive Bayes + MySQL (iHealth)

Proyecto web con:
- Formulario (frontend estático)
- Recomendación **Naive Bayes** (i100 vs i500) con **suavizado de Laplace**
- Guardado de compra en **MySQL**

## Requisitos
- Node.js 18+
- MySQL 8+

## 1) Configurar MySQL
Crea la BD/tablas y carga productos:

```sql
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;
```

> Puedes ejecutar lo anterior desde `mysql -u root -p`.

## 2) Variables de entorno
Copia `.env.example` a `.env` y ajusta credenciales:

```bash
cp .env.example .env
```

## 3) Ejecutar

```bash
npm install
npm run dev
```

Abre:
- http://localhost:3000

## 4) API
### POST `/api/recommend`
Body:

```json
{ "ctd": "Y", "hm": "M", "cel": "S", "mi": "H" }
```

Respuesta: probabilidades + recomendación.

### POST `/api/purchase`
Body:

```json
{
  "customer": {"nombre": "Juan", "email": "juan@mail.com", "telefono": "123"},
  "answers": {"ctd": "Y", "hm": "M", "cel": "S", "mi": "H"},
  "recommended": "i500"
}
```

Guarda en `purchases`.

