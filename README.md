![AWS](https://skillicons.dev/icons?i=aws,nodejs,mongodb)

AWS Lambda - Recordatorios de actividades

Esta función AWS Lambda se encarga de generar automáticamente notificaciones de recordatorio para los usuarios registrados en actividades
que están próximas a comenzar.

La función consulta las actividades activas programadas para las próximas 24 horas,
obtiene sus inscripciones confirmadas y crea una notificación para cada usuario que todavía no tenga
un recordatorio registrado para esa actividad.


## 📌 Funcionalidad:
El flujo principal de la Lambda es:
Conectarse a MongoDB utilizando la variable de entorno MONGODB_URI.
Buscar actividades con estado activo.
Filtrar actividades cuya fecha se encuentre entre el momento actual y las próximas 24 horas.
Buscar las inscripciones con estado confirmada.
Verificar si el usuario ya tiene un recordatorio para esa actividad.
Crear la notificación si todavía no existe.
Retornar la cantidad de notificaciones creadas.

## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/f8cb17e8-c2c4-46aa-b8c9-e4f393d0dbfd" />  Tecnologías implementadas:
Node.js
AWS Lambda
MongoDB
MongoDB Node.js Driver
AWS CloudWatch


## 🏗️ Arquitectura

lambda/\
├── index.js\
├── package.json\
├── package-lock.json\
└── README.md\

## ⚙️ Configuración
La Lambda requiere la siguiente variable de entorno:

Variable:\
MONGODB_URI\
Descripción:\
Cadena de conexión utilizada para conectarse a MongoDB\



## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/81be8991-6f82-4a92-9a37-c3ce768bd69c" />   Dependencias:
npm install mongodb

## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/81a87812-e602-4232-b2b8-5570d2e5bc29" />   Colecciones utilizadas:
[events]\
Contiene las actividades disponibles.

La Lambda utiliza principalmente:\
_id\
title\
status\
date

Solo se procesan actividades que cumplan:\
status = "activo"\
y cuya fecha esté dentro de las próximas 24 horas.

[registrations]\
Contiene las inscripciones de los usuarios.\
Se buscan únicamente registros con:\
status = "confirmada"\
La relación con la actividad se realiza mediante:\
registration.event -> event._id\

[notifications]\
Contiene las notificaciones generadas para los usuarios.\
Las notificaciones creadas tienen la siguiente estructura:\

{\
  "user": "ID_DEL_USUARIO",\
  "event": "ID_DEL_EVENTO",\
  "type": "recordatorio",\
  "message": "La actividad \"Nombre de la actividad\" está por comenzar.",\
  "read": false,\
  "createdAt": "2026-08-26T18:00:00.000Z",\
  "updatedAt": "2026-08-26T18:00:00.000Z"\
}


## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/c27afb8f-89e7-44d2-b7fa-9d80a1bbb857" />  Prevención de notificaciones duplicadas
Antes de crear una notificación, la Lambda verifica si ya existe un registro que coincida con:

user
event
type = "recordatorio"

Si existe, no se crea una nueva notificación.
Esto permite que la Lambda pueda ejecutarse periódicamente sin generar múltiples recordatorios para el mismo usuario y actividad.


## 🚀 Despliegue
Instalar las dependencias:
npm install

Comprimir los archivos necesarios:
zip -r lambda.zip index.js package.json package-lock.json node_modules


## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/02fb227c-3415-489d-9386-1fe405fd7cb5" />   Ejecución programada
La Lambda está diseñada para ejecutarse periódicamente mediante un servicio de programación de AWS, como Amazon EventBridge.
Por ejemplo, puede configurarse para ejecutarse cada cierto intervalo y comprobar si existen actividades que comenzarán durante las próximas 24 horas.

EventBridge
     │
     │ 
     ▼
AWS Lambda
     │
     ▼
MongoDB
     │
     ▼
Notificaciones


## <img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/aa9abae9-03e9-46ed-bdd8-65f05e8a5444" />   Requisitos de AWS
La función Lambda debe contar con:
Acceso a las variables de entorno configuradas.
Permisos de ejecución de Lambda.
Permisos para enviar logs a CloudWatch.
Acceso a MongoDB
