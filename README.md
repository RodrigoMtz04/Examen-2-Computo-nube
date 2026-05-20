# Fitness Band Recommendation System

Sistema de recomendación de pulseras iHealth utilizando el algoritmo Naive Bayes con suavizado de Laplace, desplegado en AWS ECS con base de datos Aurora MySQL.

## Arquitectura

- **Backend**: Node.js + TypeScript + Express
- **Algoritmo**: Naive Bayes categórico con estimador de Laplace
- **Base de datos**: AWS Aurora MySQL
- **Despliegue**: AWS ECS (Windows Server)
- **Contenedores**: Docker

## Estructura del Proyecto

```
├── src/
│   ├── controllers/       # Controladores de la API
│   ├── database/          # Conexión y inicialización de BD
│   ├── models/            # Modelos de datos
│   ├── routes/            # Rutas de la API
│   ├── services/          # Lógica de negocio (Naive Bayes)
│   └── index.ts           # Punto de entrada
├── database/
│   └── init.sql           # Script de inicialización de BD
├── Dockerfile             # Configuración de Docker para Windows Server
├── ecs-task-definition.json  # Definición de tarea ECS
├── deploy.bat             # Script de despliegue
└── package.json
```

## Atributos del Dataset

- **HM** (Nivel de ejercicio): M (Moderado), A (Avanzado)
- **CEL** (Acostumbrado a dispositivos): S (Poco), A (Acostumbrado), M (Muy acostumbrado)
- **MI** (Motivación): H (Alta), A (Moderada), B (Baja)

## API Endpoints

### GET /api/survey
Obtiene las preguntas de la encuesta con opciones.

```json
{
  "questions": {
    "hm": {
      "question": "¿Cuál es tu nivel de ejercicio actual?",
      "options": [
        { "value": "M", "label": "Moderado" },
        { "value": "A", "label": "Avanzado" }
      ]
    },
    ...
  }
}
```

### POST /api/recommend
Envía las respuestas y obtiene una recomendación.

**Body:**
```json
{
  "hm": "M",
  "cel": "A",
  "mi": "H"
}
```

**Response:**
```json
{
  "id": 1,
  "predictedBand": "iHealth Band 100",
  "probabilities": {
    "iHealth Band 100": 0.75,
    "iHealth Band 500": 0.25
  },
  "confidence": 0.75
}
```

### GET /api/history
Obtiene el historial de recomendaciones guardadas.

## Configuración Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   copy .env.example .env
   ```
   Editar `.env` con las credenciales de tu base de datos.

3. **Inicializar la base de datos:**
   ```bash
   mysql -u root -p < database/init.sql
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Compilar y ejecutar en producción:**
   ```bash
   npm run build
   npm start
   ```

## Despliegue en AWS

### Prerrequisitos

- AWS CLI configurado
- Docker instalado
- ECR repository creado
- ECS cluster configurado
- Aurora MySQL instance creada

### Pasos de Despliegue

1. **Crear repositorio ECR:**
   ```bash
   aws ecr create-repository --repository-name fitness-band-recommendation
   ```

2. **Autenticar Docker con ECR:**
   ```bash
   aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
   ```

3. **Configurar variables de entorno:**
   Editar `deploy.bat` con:
   - `AWS_ACCOUNT_ID`
   - `AWS_REGION`
   - `ECS_CLUSTER`

4. **Ejecutar despliegue:**
   ```bash
   deploy.bat
   ```

### Configuración de Aurora MySQL con IAM Authentication

1. Crear una instancia Aurora MySQL en AWS RDS
2. Habilitar IAM Database Authentication en la instancia RDS
3. Configurar el security group para permitir acceso desde ECS
4. Crear un usuario de base de datos con autenticación IAM:
   ```sql
   CREATE USER 'admin' IDENTIFIED WITH AWSAuthenticationPlugin AS 'RDS';
   GRANT ALL PRIVILEGES ON fitness_bands_db.* TO 'admin'@'%';
   FLUSH PRIVILEGES;
   ```
5. Ejecutar el script `database/init.sql` en la instancia
6. Crear una IAM Policy para acceso a RDS:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "rds-db:connect"
         ],
         "Resource": [
           "arn:aws:rds-db:REGION:ACCOUNT_ID:dbuser:*/admin"
         ]
       }
     ]
   }
   ```
7. Adjuntar la policy al IAM Role de la tarea ECS
8. Configurar variables de entorno en `.env` o ECS task definition:
   - `DB_HOST`: Endpoint de Aurora
   - `DB_USER`: admin
   - `AWS_REGION`: Región de AWS
   - No se necesita `DB_PASSWORD` (se genera token IAM automáticamente)

## Algoritmo Naive Bayes

El sistema utiliza Naive Bayes categórico con suavizado de Laplace para evitar probabilidades cero cuando una combinación de atributos no aparece en el dataset de entrenamiento.

### Fórmula de Laplace

```
P(x_i|c) = (count(x_i, c) + 1) / (Σ count(x_k, c) + N)
```

Donde:
- `count(x_i, c)`: Frecuencia del valor x_i en la clase c
- `N`: Número de valores posibles del atributo

### Ventajas

- Manejo del problema de frecuencia cero
- Robusto con datasets pequeños
- Cálculo eficiente
- No requiere hiperparámetros complejos

## Licencia

ISC
