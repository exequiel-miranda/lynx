# Student Questionnaire Backend API

Backend API para un sistema de cuestionarios estudiantiles con autenticación JWT y MongoDB.

## 🚀 Características

- ✅ Registro y autenticación de estudiantes con JWT
- ✅ Gestión de preguntas desde MongoDB
- ✅ Almacenamiento de respuestas de estudiantes
- ✅ Consulta de respuestas por estudiante
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos
- ✅ Manejo de errores robusto

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- Base de datos `BancoDB` con colección `QA`

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/BancoDB
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h
```

3. **Asegurarse de que MongoDB esté corriendo:**
```bash
# En Windows, MongoDB debería estar corriendo como servicio
# O iniciar manualmente si es necesario
```

## 🎯 Uso

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints de la API

### Autenticación

#### Registrar Estudiante
```http
POST /api/auth/register
Content-Type: application/json

{
  "carnet": "20250505",
  "password": "miPassword123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "carnet": "20250505",
    "createdAt": "2026-01-20T21:38:24.000Z"
  }
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "carnet": "20250505",
  "password": "miPassword123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "carnet": "20250505"
  }
}
```

### Preguntas (Requieren Autenticación)

#### Obtener Todas las Preguntas
```http
GET /api/questions
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "questions": [
    {
      "_id": "696fe001fea60c28fe623a07",
      "area": "HTTP",
      "tipo": "pregunta_abierta",
      "dificultad": "basico",
      "pregunta": "¿Qué es el protocolo HTTP y cómo funciona el ciclo petición-respuesta?"
    }
  ]
}
```

#### Obtener Pregunta por ID
```http
GET /api/questions/:id
Authorization: Bearer <token>
```

#### Filtrar por Área
```http
GET /api/questions/area/HTTP
Authorization: Bearer <token>
```

#### Filtrar por Dificultad
```http
GET /api/questions/difficulty/basico
Authorization: Bearer <token>
```

### Respuestas (Requieren Autenticación)

#### Enviar Respuesta
```http
POST /api/answers
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "696fe001fea60c28fe623a07",
  "answer": "verdadero"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Answer saved successfully",
  "data": {
    "studentCarnet": "20250505",
    "questionId": "696fe001fea60c28fe623a07",
    "answer": "verdadero",
    "timestamp": "2026-01-20T21:38:24.000Z",
    "updated": false
  }
}
```

#### Obtener Mis Respuestas
```http
GET /api/answers/my-answers
Authorization: Bearer <token>
```

#### Obtener Respuestas de un Estudiante
```http
GET /api/answers/:carnet
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "carnet": "20250505",
  "count": 5,
  "answers": [
    {
      "_id": "...",
      "studentCarnet": "20250505",
      "questionId": "696fe001fea60c28fe623a07",
      "answer": "verdadero",
      "timestamp": "2026-01-20T21:38:24.000Z"
    }
  ]
}
```

#### Obtener Estadísticas
```http
GET /api/answers/stats/me
Authorization: Bearer <token>
```

#### Eliminar Respuesta
```http
DELETE /api/answers/:questionId
Authorization: Bearer <token>
```

## 🔐 Autenticación

Todas las rutas excepto `/api/auth/register` y `/api/auth/login` requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al registrarse o iniciar sesión y expira en 24 horas (configurable).

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MongoDB
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── models/
│   ├── Student.js           # Modelo de estudiante
│   └── Answer.js            # Modelo de respuesta
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── questions.js         # Rutas de preguntas
│   └── answers.js           # Rutas de respuestas
├── utils/
│   └── jwt.js               # Utilidades JWT
├── .env.example             # Ejemplo de variables de entorno
├── .gitignore
├── package.json
├── server.js                # Punto de entrada
└── README.md
```

## 🗄️ Colecciones de MongoDB

### `students`
```json
{
  "_id": ObjectId,
  "carnet": "20250505",
  "password": "$2b$10$...",  // Hash bcrypt
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### `QA` (existente)
```json
{
  "_id": ObjectId,
  "area": "HTTP",
  "tipo": "pregunta_abierta",
  "dificultad": "basico",
  "pregunta": "¿Qué es el protocolo HTTP?"
}
```

### `answers`
```json
{
  "_id": ObjectId,
  "studentCarnet": "20250505",
  "questionId": "696fe001fea60c28fe623a07",
  "answer": "verdadero",
  "timestamp": ISODate
}
```

## 🧪 Pruebas

### Usando curl

**Registrar estudiante:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"carnet\":\"20250505\",\"password\":\"test123\"}"
```

**Iniciar sesión:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"carnet\":\"20250505\",\"password\":\"test123\"}"
```

**Obtener preguntas:**
```bash
curl http://localhost:3000/api/questions \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Enviar respuesta:**
```bash
curl -X POST http://localhost:3000/api/answers \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d "{\"questionId\":\"696fe001fea60c28fe623a07\",\"answer\":\"verdadero\"}"
```

## 🔧 Solución de Problemas

### MongoDB no se conecta
- Verificar que MongoDB esté corriendo
- Verificar la URI en el archivo `.env`
- Verificar que la base de datos `BancoDB` exista

### Token inválido
- Verificar que el token esté en el formato correcto: `Bearer <token>`
- El token expira en 24 horas, obtener uno nuevo

### Error de CORS
- El servidor tiene CORS habilitado por defecto
- Verificar la configuración si necesitas restringir orígenes

## 📝 Notas

- Las contraseñas se hashean con bcrypt (10 rounds)
- Los tokens JWT expiran en 24 horas
- Las respuestas se pueden actualizar (si un estudiante responde la misma pregunta dos veces)
- El carnet debe ser numérico
- La contraseña debe tener al menos 6 caracteres

## 👨‍💻 Desarrollo

Para contribuir o modificar:

1. Hacer cambios en el código
2. Probar con `npm run dev`
3. Verificar que todas las rutas funcionen
4. Documentar cambios en este README

## 📄 Licencia

ISC
