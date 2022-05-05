## PROYECTO 3: Weather Board / Dashboard
- #### (scroll for the english version)
- #### Probado en Chrome


La app web **Weather Board** presenta una interfaz simple para desplegar datos climáticos de diferentes regiones de México y del mundo mediante el consumo de datos de un servicio API público, lo anterior con enfoque en resultados profesionales. En esta ocasión la App tiene un alcance más amplio, por lo que se utilizan herramientas como **Parcel** (en desarrollo) para "empaquetar" el código y facilitar el despliegue a producción. También se utiliza **Vue** como framework principal para el render en el DOM de datos y de elementos repetitivos, además del manejo de las interacciones de usuario. Se dejó de lado su uso con componentes y se optó por añadir su Runtime y su compilador. Para añadir gráficas a la App se incluye Chart.js, herramienta potente en la visualización de datos. 

Se consumen datos del API abierto de [OpenWeatherMap](https://openweathermap.org/), que nos proporciona datos meteorológicos globales variados a través de su API, incluyendo datos meteorológicos actuales, pronósticos, y datos meteorológicos históricos para cualquier ubicación geográfica con una amplia variedad de costos partiendo de un servicio gratuito.


### Algunos objetivos técnicos que se buscan son los siguientes:

 - Aplicación de una sola página ó Single Page Application (SPA).
 - Realizar una conexión a una API externa para consumir datos (JSON).
 - Utilización de Bootstrap con estilos predefinidos.
 - Usar un ambiente de desarrollo con Node.js.
 - Uso de fetch para el consumo de datos.
 - Modularización con import y export.
 - Utilización de Chart.js.
 - Uso de async y await.
 - Estilo simple.

### Pasos para su puesta en marcha de forma local

 **Requerimientos:** Solamente el **archivo .env** que previamente te haré llegar. Si no cuentas con el archivo y estas interesado en el proyecto, contactamente y con gusto te lo hago llegar. Mientras tanto puedes revisar el **live demo**, te aseguro que funciona exactamente igual.
 1. En consola ejecuta: **git clone [https://github.com/xcamarillox/proyecto-3](https://github.com/xcamarillox/proyecto-3)** o bien puedes acceder en tu navegador a [https://github.com/xcamarillox/proyecto-3](https://github.com/xcamarillox/proyecto-3). En el apartado de code, seleccionar download ZIP. Esto ultimo si no te interesa el historial de commits o la data de GIT (no tan recomendable).
 2. Coloca el archivo **.env** en el directorio raíz del proyecto (en el mismo lugar está el package.json). Este archivo protege las claves privadas y se te proporciona de antemano (no se incluye al proyecto de GIT/GITHUB por ese motivo).
 3. En consola dirigete al directorio raíz del proyecto y ejecuta **npm install**
 4. En consola ejecuta: **npm run dev**
 5. Abre tu navegador y coloca **http://localhost:1234/** en la barra de dirección. Parcel genera esa dirección generalmente, si no funciona coloca la dirección que te menciona la terminal.
 6. Listo, ahora puedes hacer pruebas del proyecto. Si adicionalmente se busca hacer un deploy ejecuta en consola: **npm run build**

- [live demo](https://xcamarillox.github.io/proyecto-3/index.html)

_________________


## PROJECT 3: Weather Board / Dashboard
- #### Tested in Chrome


The **Weather Board** web app presents a simple interface to display weather data from different regions of Mexico and the world by consuming data from a public API service, with a focus on professional results. This time the App has a broader scope, so tools such as **Parcel** (in development) are used to "package" the code and facilitate deployment to production. **Vue** is also used as the main framework for rendering data and repetitive elements in the DOM, in addition to handling user interactions. Its use with components was left aside and it was decided to add its Runtime and its compiler. To add graphs to the App, Chart.js is included, a powerful tool for data visualization.

Data is consumed from the open API of [OpenWeatherMap](https://openweathermap.org/), which provides us with a variety of global weather data through its API, including current weather data, forecasts, and historical weather data for any geographical location with a wide variety of costs starting from a free service.


### Some technical objectives that are sought are the following:

 - Application of a single page or Single Page Application (SPA).
 - Make a connection to an external API to consume data (JSON).
 - Use of Bootstrap with predefined styles.
 - Use a development environment with Node.js.
 - Use of fetch for data consumption.
 - Modularization with import and export.
 - Use of async and await.
 - Use of Chart.js.
 - Simple style.

### Steps for its local implementation

 **Requirements:** Only the **.env file** that I will send you previously. If you do not have the file and you are interested in  the project, contact me and I will gladly send it to you. In the meantime you can check the **live demo**, I assure you that it works  exactly the same.
 1. In console execute: **git clone [https://github.com/xcamarillox/proyecto-3](https://github.com/xcamarillox/proyecto-3)** or you can access on your web browser to [https://github.com/xcamarillox/proyecto-3](https://github.com/xcamarillox/proyecto-3). In the code section, select download ZIP. The latter if you are not interested in commit history or GIT data (not so recommended).
 2. Place the **.env** file in the root directory of the project (in the same place is the package.json). This file protects the private keys and is provided to you in advance (it is not included in the GIT/GITHUB project for that reason).
 3. In console go to the root directory of the project and run **npm install**
 4. In console execute: **npm run dev**
 5. Open your browser and put **http://localhost:1234/** in the address bar. Parcel generally generates that address, if it doesn't work, put the address that the terminal mentions.
 6. Ready, you can now test the project. If additionally you want to do a deploy, run in the console: **npm run build**

- [live demo](https://xcamarillox.github.io/proyecto-3/index.html)