# pemap-api

API REST hecha en NodeJS para ser consumida por la aplicación web `pemap-webapp`.

## Requerimientos

- NodeJS LTS (v12)
- Docker
- Docker Compose

## Stack

Elegí implementar Docker + Docker Compose para unificar el entorno de desarrollo y test. Me permite levantar instancias de **MongoDB** y **Redis** para utilizar en el API.

El código está escrito en **ES6** y luego es transpilado utilizando **Babel**.

Para implementar esta API decidí utilizar el framework **express.js** como servidor, por su cómodo manejo de las rutas y configuraciones de seguridad gracias a sus middlewares. Al agregarle el middleware **express-validation** pude validar que cada request reciba los parametros requeridos y retorne un error de validación en caso contrario. Para ello, esta librería utiliza internamente **@hapi/joi**, por lo que escribi validaciones de Joi.

Como base de datos preferí usar **MongoDB** + **mongoose** por cuestiones prácticas de implementación, ya que es la dupla que mas usé hasta ahora.

Para el cache de requests al servicio externo utilice **axios** + **axios-cache-adapter** + **redis** porque la integración entre ellos es simple y configurable.

Para correr los tests preferí utilizar **Jest** debido a su rapida implementacion e integracion con este stack.

> Nota: En todos los casos tuve en cuenta la seguridad, el soporte de comunidad y popularidad de los paquetes y herramientas utilizadas.

## Instalación

Una vez clonado el repositorio, se deben instalar las dependencias con el siguiente comando:

```bash
yarn install
```

## Puesta en marcha

Para levantar el servicio, primero se debe crear el archivo `.env` a partir de `.env.example` y editarlo con los valores correspondientes para las variables `PEYA_API_URL`, `PEYA_CLIENT_ID` y `PEYA_CLIENT_SECRET`.

Luego se deben levantar los servicios de **mongodb** y **redis** utilizando Docker Compose con el siguiente comando:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Por último, se inicia el servidor (en modo dev) con el comando:

```bash
yarn dev
```

Para iniciar el servidor en modo production, se deberia editar la variable de entorno `NODE_ENV=production` en el archivo `.env` y correr el comando:

```bash
yarn start
```

## Test unitarios

Para correr los tests unitarios primero es necesario editar el archivo `.env.test` y usar un email y contraseña válidos para las variables `PEYA_USERNAME` y `PEYA_PASSWORD`.

Luego se deben levantar los servicios de **mongodb** y **redis** utilizando Docker Compose con el siguiente comando:

```bash
docker-compose -f docker-compose.test.yml up --build
```

Por último, en otra pestaña, se corren los test con el comando:

```bash
yarn test
```

## Puntos faltantes

Uno de los puntos que me faltó implementar fue el registro de los usuarios logueados actualmente, que sería devuelto en el endpoint de administración. A este punto lo implementaría guardando en la base de datos (podria ser en un modelo _Session_) algunos datos del usuario cuando este inicia una sesión exitosamente. Así podria listar las sessiones activas actualmente y mostrar a que usuario corresponde cada una.

Otro punto faltante fue habilitar la modificacion del _tiempo X_ (tiempo de vida del cache de busquedas de restaurantes) el cual podria ser implementado en un endpoint que que reciba una request del tipo `PUT /admin/search-cache-expiration` y que requiera como parametro el nuevo tiempo a ser configurado. Este valor podria estar almacenado en la base de datos, utilizando un modelo _AppConfig_, el cual seria consultado para obtener el tiempo de expiracion seteado actualmente cuando se lo necesite.

También se podrían mejorar los test con mocks de requests a servicios externos y testear conexiones de base de datos.
