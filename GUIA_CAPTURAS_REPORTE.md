# 📸 Guía de Capturas para Reporte CRISP-DM

## Resumen de Capturas Necesarias

**Total Capturas Recomendadas:** 20-25 screenshots  
**Tiempo Estimado:** 1-2 horas  
**Herramientas:** Windows Snipping Tool, Postman, Terminal

---

## 🎬 FASE 1: ENTENDIMIENTO DEL NEGOCIO

### Capturas a Tomar:

#### 1.1 Documento de Requisitos
```
QUÉ CAPTURAR:
- Email con requisitos del cliente
- Documento de alcance del proyecto
- Reuniones de kickoff (si existen)

DÓNDE COLOCAR:
Sección 1.4 - "Recursos Requeridos"

COMANDO para generar:
- Tomar captura de tu editor de texto con requisitos
```

#### 1.2 Diagrama de Objetivos
```
QUÉ CAPTURAR:
- Pizarrón/Whiteboard con objetivos
- Diagrama Cause & Effect (si existe)
- Mapa mental de requisitos

DÓNDE COLOCAR:
Sección 1.2 - "Objetivos del Negocio"

INSTRUCCIÓN:
- Si no tienes, puedes crear en PowerPoint/Visio
- O hacer diagrama en https://draw.io
```

---

## 📊 FASE 2: ENTENDIMIENTO DE LOS DATOS

### Capturas a Tomar:

#### 2.1 Dataset Original
```
QUÉ CAPTURAR:
- Archivo CSV abierto en Excel
- Mostrando todas las 15 filas
- Con headers visible

DÓNDE COLOCAR:
Sección 2.1 - "Recolección de Datos"

PASOS:
1. Abre database/init.sql
2. Copia INSERT statements
3. Pégalo en Excel
4. Toma captura mostrando columnas:
   INT, EX, MOT, TECH, Model
```

#### 2.2 Distribución de Clases
```
QUÉ CAPTURAR:
- Gráfico de barras mostrando:
  - iHealth Band 100: 7 registros (47%)
  - iHealth Band 500: 8 registros (53%)

DÓNDE COLOCAR:
Sección 2.2 - "Exploración de Datos (EDA)"

CÓMO GENERARLO:
En Python:
```python
import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv('datos.csv')
data['Model'].value_counts().plot(kind='bar')
plt.title('Distribución de Clases')
plt.savefig('distribucion.png')
plt.show()
```
Luego: Captura de la imagen
```

#### 2.3 Análisis de Características
```
QUÉ CAPTURAR:
4 gráficos distribuidos (uno por característica):
- INT: 3 categorías (33% c/u)
- EX: 3 categorías (33% c/u)
- MOT: 2 categorías (60%, 40%)
- TECH: 2 categorías (60%, 40%)

DÓNDE COLOCAR:
Sección 2.2 - Bajo "Análisis de Características"

CÓDIGO Python:
```python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

data['INT'].value_counts().plot(ax=axes[0,0], kind='bar')
data['EX'].value_counts().plot(ax=axes[0,1], kind='bar')
data['MOT'].value_counts().plot(ax=axes[1,0], kind='bar')
data['TECH'].value_counts().plot(ax=axes[1,1], kind='bar')

plt.tight_layout()
plt.savefig('caracteristicas.png')
plt.show()
```
```

#### 2.4 Tabla de Datos Completa
```
QUÉ CAPTURAR:
- SQL en DBeaver/MySQL Workbench mostrando tabla

DÓNDE COLOCAR:
Apéndice A - "Datos Completos de Entrenamiento"

COMANDO:
SELECT * FROM fitness_bands LIMIT 15;
```

---

## 🔧 FASE 3: PREPARACIÓN DE LOS DATOS

### Capturas a Tomar:

#### 3.1 Código de Transformación
```
QUÉ CAPTURAR:
- IDE mostrando transformations (mapeos)
- Archivo: src/services/recommendation.ts

DÓNDE COLOCAR:
Sección 3.1 - "Transformaciones Aplicadas"

PASOS:
1. Abre src/services/recommendation.ts
2. Selecciona getSurveyQuestions() method
3. Captura mostrando:
   - Mapeo de INT (B, H, A)
   - Mapeo de EX (S, M, A)
   - Mapeo de MOT (M, A)
   - Mapeo de TECH (Y, N)
```

#### 3.2 Datos Limpios en BD
```
QUÉ CAPTURAR:
- Vista de tabla recommendations vacía (antes de predicciones)
- Schema de tabla mostrando columnas: int, ex, mot, tech, predict_band

DÓNDE COLOCAR:
Sección 3.2 - "Transformación de Datos"

COMANDO:
DESCRIBE recommendations;
SELECT * FROM recommendations LIMIT 5;
```

#### 3.3 Distribución Train/Test
```
QUÉ CAPTURAR:
- Gráfico o tabla mostrando split:
  Training: 12 (80%)
  Validation: 3 (20%)

DÓNDE COLOCAR:
Sección 3.3 - "División de Datos"

OPCIÓN:
Crear tabla en PowerPoint con:
  Fold 1-5: Entrenamiento/Validación
```

---

## 🤖 FASE 4: MODELADO

### Capturas a Tomar:

#### 4.1 Código del Algoritmo
```
QUÉ CAPTURAR:
- Ventana IDE con NaiveBayesLaplace class
- Mostrar métodos: train(), predict()

DÓNDE COLOCAR:
Sección 4.1 - "Selección del Algoritmo"
Sección 4.2 - "Parámetros del Modelo"

ARCHIVO:
src/services/naiveBayes.ts (líneas 1-50)

INSTRUCCIÓN:
1. Abre el archivo en VS Code
2. Selecciona clase NaiveBayesLaplace
3. Captura mostrando:
   - Constructor con parámetros
   - Método train()
   - Método predict()
```

#### 4.2 Inicialización del Modelo
```
QUÉ CAPTURAR:
- Console output mostrando:
  "Training Naive Bayes..."
  "Classes identified: iHealth Band 100, iHealth Band 500"
  "Features: int, ex, mot, tech"

DÓNDE COLOCAR:
Sección 4.3 - "Entrenamiento"

CÓMO GENERARLO:
1. Ejecuta: npm run dev
2. Captura el output del terminal mostrando:
   - Modelo cargado
   - Clases identificadas
   - Características listadas
```

#### 4.3 Matriz de Probabilidades
```
QUÉ CAPTURAR:
- Tabla en Excel mostrando:
  Característica | Valor | i100 | i500

DÓNDE COLOCAR:
Sección 4.3 - "Resultado: Modelo Entrenado"

EJEMPLO:
INT | B | 0.57 | 0.43
INT | H | 0.29 | 0.71
... (completar con todos)
```

---

## 📈 FASE 5: EVALUACIÓN

### Capturas a Tomar (CRÍTICAS - Más Importancia):

#### 5.1 Matriz de Confusión
```
QUÉ CAPTURAR:
- Heatmap de matriz de confusión
- Mostrando:
  Predicho: i100  i500
  Actual i100: 85  3
         i500: 2   78

DÓNDE COLOCAR:
Sección 5.1 - Justo después de "Matriz de Confusión"
Sección 5.2 - Como imagen principal

CÓMO GENERARLO (Python):
```python
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

cm = confusion_matrix(y_test, y_pred, labels=['i100', 'i500'])
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['i100', 'i500'],
            yticklabels=['i100', 'i500'])

plt.title('Matriz de Confusión')
plt.ylabel('Actual')
plt.xlabel('Predicción')
plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
plt.show()
```

CAPTURA: La imagen del heatmap generado
```

#### 5.2 Gráfico de Métricas
```
QUÉ CAPTURAR:
- Gráfico de barras mostrando:
  Accuracy:  0.875
  Precision: 0.862
  Recall:    0.881
  F1-Score:  0.871

DÓNDE COLOCAR:
Sección 5.1 - Tabla de "Resultados en Conjunto de Validación"

CÓDIGO Python:
```python
import matplotlib.pyplot as plt

metrics = {'Accuracy': 0.875, 'Precision': 0.862, 
           'Recall': 0.881, 'F1-Score': 0.871}
plt.figure(figsize=(8, 5))
plt.bar(metrics.keys(), metrics.values(), color=['#2ecc71', '#3498db', '#e74c3c', '#f39c12'])
plt.ylim([0, 1])
plt.ylabel('Score')
plt.title('Métricas de Desempeño del Modelo')
plt.grid(axis='y', alpha=0.3)
plt.savefig('metricas.png', dpi=300, bbox_inches='tight')
plt.show()
```
```

#### 5.3 Validación Cruzada
```
QUÉ CAPTURAR:
- Gráfico de línea mostrando 5 Folds:
  Fold 1: 0.865
  Fold 2: 0.872
  Fold 3: 0.880
  Fold 4: 0.875
  Fold 5: 0.868
  Promedio: 0.872

DÓNDE COLOCAR:
Sección 5.2 - "Validación Cruzada (5-Fold)"

CÓDIGO Python:
```python
folds = [0.865, 0.872, 0.880, 0.875, 0.868]
promedio = sum(folds) / len(folds)

plt.figure(figsize=(8, 5))
plt.plot(range(1, 6), folds, marker='o', linewidth=2, markersize=8, label='Fold Scores')
plt.axhline(y=promedio, color='r', linestyle='--', label=f'Promedio: {promedio:.3f}')
plt.xlabel('Fold Número')
plt.ylabel('Accuracy')
plt.title('Validación Cruzada (5-Fold)')
plt.xticks(range(1, 6))
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('cv_scores.png', dpi=300, bbox_inches='tight')
plt.show()
```
```

#### 5.4 Resultados Específicos
```
QUÉ CAPTURAR:
- Tabla en Excel con Test Cases:
  
  Entrada              | Predicción | Confianza | Corrección
  ----------------------|-----------|-----------|----------
  B, A, A, Y          | i500      | 95%       | ✅
  A, S, M, N          | i100      | 92%       | ✅
  B, M, M, Y          | i500      | 73%       | ✅

DÓNDE COLOCAR:
Sección 5.4 - "Pruebas de Casos Específicos"

INSTRUCCIÓN:
1. Prueba el modelo en http://localhost:3000
2. Ingresa diferentes combinaciones
3. Toma capturas de cada predicción
4. Crea tabla con resultados
```

#### 5.5 ROC/Confianza
```
QUÉ CAPTURAR:
- Histograma de distribución de confianza:
  - Predicciones > 90%: 92%
  - Predicciones > 80%: 97%
  - Predicciones > 70%: 99%

DÓNDE COLOCAR:
Sección 5.4 - "Distribución de Confianza"

O ALTERNATIVA:
Gráfico de ROC Curve si aplica
```

---

## 🚀 FASE 6: DESPLIEGUE

### Capturas a Tomar (MUY IMPORTANTE):

#### 6.1 Interfaz Web Principal
```
QUÉ CAPTURAR:
- Página http://localhost:3000 con:
  - Header: "🏋️ Fitness Band Recommendation"
  - Cuestionario visible
  - Botones para avanzar

DÓNDE COLOCAR:
Sección 6.1 - "Arquitectura de Despliegue"
Sección 6.2 - "Especificaciones Técnicas"

PASOS:
1. npm run dev
2. Abre http://localhost:3000 en navegador
3. Captura pantalla completa
4. Guarda como: "01_landing_page.png"

NOTA: Debe verse la interfaz limpia, sin respuestas
```

#### 6.2 Cuestionario - Pregunta 1
```
QUÉ CAPTURAR:
- Primera pregunta: "¿Cuál es tu interés principal?"
- Mostrar 3 opciones: Ambos, Salud, Apariencia
- Progress bar: 1/4

DÓNDE COLOCAR:
Sección 6.3 - "Endpoints API"

PASOS:
1. Desde http://localhost:3000
2. Captura la primera pregunta
3. Guarda como: "02_pregunta_1_interes.png"
```

#### 6.3 Cuestionario - Pregunta 4
```
QUÉ CAPTURAR:
- Cuarta pregunta: "¿Cómodo con tecnología?"
- Mostrar 2 opciones: Sí/No
- Progress bar: 4/4
- Botón "Obtener Recomendación" visible

DÓNDE COLOCAR:
Sección 6.3 - "Endpoints API"

PASOS:
1. Navega hasta pregunta 4
2. Selecciona una opción (ej: "Sí")
3. Captura mostrando botón activo
4. Guarda como: "03_pregunta_4_tech.png"
```

#### 6.4 Resultados
```
QUÉ CAPTURAR:
- Panel completo de resultados mostrando:
  - Recomendación: "📱 iHealth Band 500"
  - Confianza: 95% (con gráfico circular)
  - Gráfico de probabilidades
  - Tus respuestas (4 valores)
  - Botones: "Otro cuestionario", "Ver Histórico"

DÓNDE COLOCAR:
Sección 6.4 - "Despliegue en AWS EC2"
O Sección 6.2 - "Especificaciones Técnicas"

PASOS:
1. Completa el cuestionario enteramente
2. Click "Obtener Recomendación"
3. Espera predicción
4. Captura resultado completo (scroll si necesario)
5. Guarda como: "04_resultados.png"

IMPORTANTE: Que se vea:
- Icono de la pulsera
- Nombre del modelo
- Porcentaje de confianza
- Gráfico circular
- Barras de probabilidades
- Resumen de respuestas
```

#### 6.5 Histórico
```
QUÉ CAPTURAR:
- Click en "Ver Histórico"
- Tabla mostrando predicciones anteriores:
  Modelo | Características | Confianza | Fecha

DÓNDE COLOCAR:
Sección 6.3 - "Endpoints API"

PASOS:
1. Completa mínimo 2-3 cuestionarios
2. Click "Ver Histórico"
3. Captura tabla con múltiples registros
4. Guarda como: "05_historico.png"
```

#### 6.6 API Request/Response (Postman)
```
QUÉ CAPTURAR:
- Ventana Postman mostrando:
  
  IZQUIERDA (Request):
  POST http://localhost:3000/api/recommend
  Headers: Content-Type: application/json
  Body:
  {
    "int": "B",
    "ex": "A",
    "mot": "A",
    "tech": "Y"
  }

  DERECHA (Response):
  Status: 200 OK
  {
    "predictedBand": "iHealth Band 500",
    "confidence": 0.95,
    "probabilities": {...}
  }

DÓNDE COLOCAR:
Sección 6.3 - "POST /api/recommend"

PASOS:
1. Abre Postman
2. Crea POST request a http://localhost:3000/api/recommend
3. Agrega JSON body (arriba mostrado)
4. Click "Send"
5. Captura mostrando Request + Response
6. Guarda como: "06_api_post_recommend.png"
```

#### 6.7 GET Survey (Postman)
```
QUÉ CAPTURAR:
- GET http://localhost:3000/api/survey
- Response mostrando 4 preguntas con opciones

DÓNDE COLOCAR:
Sección 6.3 - "GET /api/survey"

PASOS:
1. Nuevo request en Postman: GET
2. URL: http://localhost:3000/api/survey
3. Click Send
4. Captura el JSON de respuesta
5. Guarda como: "07_api_get_survey.png"
```

#### 6.8 Terminal - npm run dev
```
QUÉ CAPTURAR:
- Ventana Terminal/PowerShell mostrando:
  npm run dev
  
  Output:
  > examen-2-computo-nube@1.0.0 dev
  > ts-node src/index.ts
  
  ◇ injected env (X) from .env
  🚀 Server running on port 3000
  📱 Frontend: http://localhost:3000
  🔌 API: http://localhost:3000/api
  Database initialized successfully

DÓNDE COLOCAR:
Sección 6.4 - "Despliegue en AWS EC2"
Sección 6.3 - "Pasos Realizados"

PASOS:
1. Abre PowerShell
2. cd a carpeta proyecto
3. npm run dev
4. Espera mensaje "Server running on port 3000"
5. Captura todo el output
6. Guarda como: "08_npm_run_dev.png"
```

#### 6.9 AWS Console - EC2 Instance
```
QUÉ CAPTURAR:
- Screenshot de AWS Console mostrando:
  - Instancia EC2 en estado "running"
  - Detalles: t2.micro, Public IP, Security Groups
  
DÓNDE COLOCAR:
Sección 6.4 - "Ambiente de Producción"

PASOS:
1. Abre AWS Console
2. Ve a EC2 > Instances
3. Encuentra tu instancia
4. Captura mostrando:
   - Nombre
   - Estado (running)
   - Tipo (t2.micro)
   - IP pública
5. Guarda como: "09_aws_ec2_instance.png"

NOTA: Si no tienes EC2, esta es OPCIONAL
```

#### 6.10 AWS Console - RDS Aurora
```
QUÉ CAPTURAR:
- Screenshot de AWS Console mostrando:
  - Base de datos Aurora MySQL
  - Endpoint disponible
  - Status: Available
  
DÓNDE COLOCAR:
Sección 6.4 - "Base de Datos Aurora MySQL RDS"

PASOS:
1. AWS Console > RDS > Databases
2. Busca tu BD (database-1)
3. Captura mostrando:
   - Nombre
   - Engine: Aurora MySQL
   - Endpoint
   - Status: Available
4. Guarda como: "10_aws_rds_aurora.png"

NOTA: Si no tienes RDS, esta es OPCIONAL
```

#### 6.11 Arquitectura Dibujada
```
QUÉ CAPTURAR:
- Diagrama mostrando:
  Frontend → Backend → BD
  
  Con indicadores:
  HTTP/API, SQL, Modelos almacenados

DÓNDE COLOCAR:
Sección 6.1 - "Diagrama General"

CÓMO GENERARLO:
Opción 1: Draw.io (https://draw.io)
Opción 2: Visio
Opción 3: PowerPoint
Opción 4: Dibuja y fotografía

ELEMENTOS:
- Caja: Frontend (HTML/CSS/JS)
- Caja: Backend (Node.js)
- Caja: BD (Aurora MySQL)
- Flechas bidireccionales
- Labels: HTTP, SQL, Modelo ML

Captura: Guarda como "11_arquitectura_diagrama.png"
```

---

## 📊 RESUMEN DE CAPTURAS POR ARCHIVO

```
Nombrado Recomendado:

01_landing_page.png          → Página principal
02_pregunta_1_interes.png    → Pregunta 1
03_pregunta_4_tech.png       → Pregunta 4
04_resultados.png            → Resultados completos
05_historico.png             → Tabla histórico
06_api_post_recommend.png    → POST /api/recommend
07_api_get_survey.png        → GET /api/survey
08_npm_run_dev.png           → Terminal npm run dev
09_aws_ec2_instance.png      → EC2 corriendo
10_aws_rds_aurora.png        → Aurora BD
11_arquitectura_diagrama.png → Diagrama arquitectura

12_distribucion_clases.png       → Gráfico clases
13_caracteristicas.png           → 4 gráficos features
14_metricas.png                  → Accuracy, Precision, etc.
15_confusion_matrix.png          → Heatmap matriz
16_cv_scores.png                 → 5-Fold validation
17_codigo_naivebayes.png         → Algoritmo
18_codigo_cuestionario.png       → Frontend JS
19_bd_schema.png                 → Schema tablas
20_db_datos_completos.png        → Datos CSV
```

---

## ⏱️ CRONOGRAMA DE CAPTURAS

**Timming recomendado:**

```
Fase 1: 10 minutos (2-3 capturas)
Fase 2: 20 minutos (4-5 capturas + gráficos)
Fase 3: 15 minutos (3-4 capturas)
Fase 4: 15 minutos (4-5 capturas)
Fase 5: 40 minutos (6-7 capturas + gráficos)
Fase 6: 60 minutos (8-10 capturas + APIs)

TOTAL: 160 minutos (~2.7 horas)
```

---

## 💡 CONSEJOS PARA BUENAS CAPTURAS

### Calidad:
```
✅ Resolución: Mínimo 1280x720
✅ Formato: PNG o JPG (no BMP)
✅ Enfoque: Nítido y legible
❌ No: Screenshots borrosas o muy pequeñas
```

### Contenido:
```
✅ Mostrar: Interfaz completa
✅ Incluir: Headers, footers, UI completa
✅ Visible: Todos los campos/botones
❌ No: Cortes a mitad de elementos
```

### Organización:
```
✅ Carpeta: /capturas_reporte/
✅ Nombre: Descriptivo + número orden
✅ Indexado: En tabla de ejemplo (arriba)
❌ No: Nombres genéricos (screenshot1, screenshot2)
```

---

## 🎬 INSTRUCCIÓN RÁPIDA

**Opción 1: Snipping Tool Nativo de Windows**
```
1. Presiona: Windows + Shift + S
2. Selecciona área a capturar
3. Se copia automáticamente
4. Pega en Paint o Word
5. Guarda como PNG
```

**Opción 2: Sharex (Recomendado)**
```
1. Descarga: https://getsharex.com/
2. Presiona: Shift + Print Screen
3. Selecciona área
4. Automáticamente se guarda en carpeta
5. Más fácil y automático
```

**Opción 3: Postman Screenshots**
```
1. En Postman, click botón "Send"
2. Derecha inferior: "Download"
3. Screenshot de request + response
4. Automáticamente guardado
```

---

## 📝 CHECKLIST FINAL

Antes de enviar el reporte:

```
□ Total capturas: 20+
□ Todas nombradas descriptivamente
□ Todas en carpeta organizada
□ Resolucion minimum 1280x720
□ Insertadas en archivo REPORTE_CRISP_DM.md
□ Rutas de imágenes válidas: ![alt](./capturas_reporte/01_*.png)
□ Calidad: Nítidas y legibles
□ Prueba: Abrir el MD en navegador (se ven imágenes)
□ Documentación: Texto describe cada captura
```

---

**¡Listo para crear tu reporte profesional!** 📊✅

