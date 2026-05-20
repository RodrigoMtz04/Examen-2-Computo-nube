# 🌐 Conectar a Aurora RDS en AWS

## ✅ Verificación Previa

Antes de ejecutar, verifica que tengas:

```powershell
# 1. Node.js instalado
node --version    # v16+ recomendado

# 2. NPM instalado
npm --version

# 3. Acceso a Internet (conexión a AWS)
ping 8.8.8.8
```

---

## 📋 Configuración en `.env`

El archivo `.env` ya está configurado para Aurora RDS:

```env
USE_RDS=true
DB_HOST=database-1.cjaiskccik2h.us-east-2.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=abc12345
DB_NAME=fitness_bands_db
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=ASIA345IPFIQ76CFSS3H
AWS_SECRET_ACCESS_KEY=ccpLrORawwYe7Acxi/xw0ULXn2vjsO1UnhDM/S8R
```

> ⚠️ **IMPORTANTE**: Estas credenciales son de demostración. En producción:
> - Usa AWS Secrets Manager
> - Usa IAM roles en EC2
> - Nunca guardes credenciales en `.env`

---

## 🚀 Pasos para Conectar

### **PASO 1: Navegar a la carpeta**

```powershell
cd C:\Users\RodrigoMtz\WebstormProjects\Examen-2-Computo-nube
```

### **PASO 2: Verificar credenciales AWS**

Asegúrate que las credenciales en `.env` sean válidas:

```powershell
cat .env | findstr AWS
# Debe mostrar:
# AWS_REGION=us-east-2
# AWS_ACCESS_KEY_ID=ASIA345IPFIQ76CFSS3H
# AWS_SECRET_ACCESS_KEY=ccpLrORawwYe7Acxi/xw0ULXn2vjsO1UnhDM/S8R
```

### **PASO 3: Instalar dependencias** (Solo si es primera vez)

```powershell
npm install
```

### **PASO 4: Ejecutar la aplicación**

```powershell
npm run dev
```

Deberías ver:

```
◇ injected env (12) from .env
Server running on port 3000
Database initialized successfully
✅ Conectado a Aurora RDS
```

---

## 🌍 Acceder a la Aplicación

Una vez ejecutando, abre tu navegador:

```
http://localhost:3000
```

Verás la interfaz para hacer recomendaciones de fitness bands.

---

## 🧪 Pruebas de Conectividad RDS

### Test 1: Verificar conexión a RDS

```powershell
# En otra ventana PowerShell, en la carpeta del proyecto:

$env:USE_RDS = "true"
$env:DB_HOST = "database-1.cjaiskccik2h.us-east-2.rds.amazonaws.com"
$env:DB_USER = "admin"
$env:DB_PASSWORD = "abc12345"
$env:AWS_REGION = "us-east-2"

# Intenta conectarse (esto ejecutará el script de inicialización)
node -e "require('./src/index.ts')"
```

### Test 2: Hacer predicción via API

```powershell
# Test - Recomendar fitness band
$body = @{
    hm = "A"
    cel = "A"  
    mi = "H"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/recommend" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

Respuesta esperada:
```json
{
  "band": "iHealth Band 500",
  "confidence": 0.95
}
```

### Test 3: Ver historial de predicciones

```powershell
Invoke-WebRequest http://localhost:3000/api/history | `
    Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## 🔐 Seguridad - RDS

### ✅ Security Group en AWS

El RDS debe permitir conexiones en puerto 3306 desde tu IP:

1. Ve a **AWS RDS Console**
2. Busca tu instancia `database-1`
3. En "Connectivity & security" → "Security groups"
4. Agrega regla de entrada (inbound):
   - **Type**: MySQL/Aurora
   - **Port**: 3306
   - **Source**: `0.0.0.0/0` (o tu IP específica)

```
Protocol: TCP
Port: 3306
Source: 0.0.0.0/0 (abierto para desarrollo)
```

### ✅ SSL/TLS

La configuración ya incluye SSL:
```typescript
poolConfig.ssl = "Amazon RDS";
```

---

## 📊 Monitorear desde AWS Console

```powershell
# 1. Ir a: https://console.aws.amazon.com/rds/
# 2. Buscar "database-1"
# 3. En "Monitoring" ver:
#    - CPU utilization
#    - Database connections
#    - Read/Write latency
```

---

## ⚠️ Problemas Comunes

### Error: "Access denied for user 'admin'"
```
Causa: Credenciales incorrectas en .env
Solución: Verifica DB_PASSWORD y AWS_ACCESS_KEY_ID
```

```powershell
# Ver credenciales
cat .env | findstr DB_PASSWORD
cat .env | findstr AWS_ACCESS_KEY_ID
```

### Error: "Connection timeout"
```
Causa: RDS no es alcanzable (firewall/security group)
Solución: 
1. Verifica Security Group de RDS
2. Comprueba tu conexión a Internet
3. Verifica que RDS esté en estado "available"
```

```powershell
# Prueba conexión ping
Test-NetConnection -ComputerName database-1.cjaiskccik2h.us-east-2.rds.amazonaws.com -Port 3306
```

### Error: "AWS credentials not found"
```
Causa: AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY inválidos
Solución: Verifica credenciales en .env
```

---

## 🔄 Modo Dual: Local + RDS

Para cambiar entre local y RDS fácilmente:

```powershell
# Modo LOCAL
Copy-Item .env.example .env
# Editar .env: USE_RDS=false, DB_HOST=localhost

# Modo RDS
# Editar .env: USE_RDS=true, DB_HOST=database-1.cjaiskccik2h...

# Luego ejecutar
npm run dev
```

---

## 📈 Performance en RDS

Aurora es muy rápido. Tiempos esperados:

| Operación | Tiempo |
|-----------|--------|
| Inicialización BD | < 1s |
| Predicción | < 100ms |
| Fetch historial | < 50ms |

---

## 💡 Tips Útiles

### Ver logs en tiempo real
```powershell
npm run dev 2>&1 | Tee-Object -FilePath "app.log"
```

### Monitorear desde AWS CLI
```powershell
# Si tienes AWS CLI instalado:
aws rds describe-db-instances --db-instance-identifier database-1 --region us-east-2
```

### Resetear base de datos
```powershell
# Conectarse y ejecutar SQL:
docker exec -it fitness_bands_mysql mysql -u admin -pabc12345 -h database-1.cjaiskccik2h.us-east-2.rds.amazonaws.com

# En MySQL:
# DROP DATABASE fitness_bands_db;
# CREATE DATABASE fitness_bands_db;
```

---

## 🎯 Resumen Rápido

```powershell
# 1. Navega al proyecto
cd C:\Users\RodrigoMtz\WebstormProjects\Examen-2-Computo-nube

# 2. Instala dependencias (solo primera vez)
npm install

# 3. Ejecuta con RDS
npm run dev

# 4. Accede en navegador
# http://localhost:3000
```

---

## ✅ Verificación Final

Si ves esto sin errores, ¡estás conectado a Aurora RDS!

```
◇ injected env (12) from .env
Server running on port 3000
Database initialized successfully
✅ Aurora RDS Connection Successful
```

---

**¿Preguntas?** Revisa los logs en GitHub o consulta la [documentación de RDS](https://docs.aws.amazon.com/rds/).

