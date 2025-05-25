# 💻 Challenge Service 🏥

Proyecto Serverless con AWS Lambda y DynamoDB.

---

## 📋 Requisitos Previos

- Node.js (v18+)
- npm o yarn
- **AWS CLI** instalado y configurado
- **Serverless Framework** instalado

### 🔧 Instalar AWS CLI

Descargar e instalar **AWS CLI** desde [AWS CLI Oficial](https://aws.amazon.com/cli/).  
Para verificar la instalación:

```bash
aws --version
```

## 👤 Crear y configurar un usuario IAM en AWS
Inicia sesión en la Consola de AWS.

Ve a IAM (Identity and Access Management).

Crea un nuevo usuario con permisos de AdministratorAccess. Genera una clave de acceso y secreta.

Configura las credenciales en AWS CLI con:

```batch
aws configure
```

```batch
AWS Access Key ID [None]: XXXXXXXXXX
AWS Secret Access Key [None]: XXXXXXXXXX
Default region name [None]: us-east-1
Default output format [None]: json
```

## 💻 Instalar Serverless Framework:

```batch
npm install -g serverless
```

## ⚒️ Configuración Inicial

1️⃣ Clonar el repositorio:

```batch
git clone https://github.com/HectorCaleroSaico/challenge-service.git
```
```batch
cd challenge-service
```
2️⃣ Instalar dependencias:

```batch
npm install
```

## 📂 Estructura del Proyecto

```
src/
├── application/          # Lógica de la aplicación
│   ├── handlers/         # Lambdas
│   ├── services/         # Servicios de negocio
│   └── dtos/             # DTOs
├── config/               # Configuración de los servicios
├── domain/               # Modelos de dominio
├── infrastructure/       # AWS (DynamoDB) y APIS Externas
serverless.yml            # Deploy Serverless Framework
```

## 🚀 Despliegue

```batch
serverless deploy
```
