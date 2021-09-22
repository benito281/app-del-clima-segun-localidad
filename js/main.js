let provinciasVista = document.getElementById('provincia');
let departamentosVista = document.getElementById("departamentos");
let localidadesVista = document.getElementById('localidades');
let verClima = document.getElementById("resultado");
let datosLocalidades = document.getElementById("datos");

/* Traemos los datos de las provincias */
const provincias = async () =>{
    try {
    const url = '../json/provincias.json';
    const data = await fetch(url)
    const response = await data.json();
    return response.provincias;
    } catch (error) {
       console.log(error); 
    }
}
/* Traemos los departamentos de cada provincia */
const departamentos = async () =>{
    try {
    const url = '../json/departamentos.json';
    const data = await fetch(url)
    const response = await data.json();
    return response.departamentos;
    } catch (error) {
        console.log(error);
    }

}
/* Traemos las localidades de cada provincia */
const localidades = async () =>{
    try {
    const url = '../json/localidades.json';
    const data = await fetch(url)
    const response = await data.json();
    return response.localidades;   
    } catch (error) {
        console.log(error);
    }

}

/* Visualizamos las provincias atraves del select */
const traerProvincias = async () => {

    const provinciasDeArgentina = await provincias();

    provinciasDeArgentina.forEach((item) => {
            provinciasVista.innerHTML += `
            <option value="${item.id}" >${item.nombre}</option>
            `;
    });
}
traerProvincias();


/* Se visualiza el select de departamentos */
const seleccionarDepartamentos = () => {
    departamentosVista.innerHTML = `
        <label>Seleccione departamento</label>
        <select class="form-control" id="departamentosSelect">
                <option disabled selected>Elija un departamentos</option>
        </select>
   `;
}

/* Se visualiza el select de localidades */
const seleccionarLocalidades = () => {  
    localidadesVista.innerHTML = `
    <label class="mt-2">Seleccione localidad</label>
    <select class="form-control" id="localidadesSelect">
            <option disabled selected>Elija una localidad</option>
    </select>
    `;
}

/* Se obtiene los departamentos seleccionados con el select de provincias*/
provinciasVista.addEventListener('change', async (event)=>{
    const idProvincia = event.target.value;             //Id de la provincia
    let departamentosDeProvincias = await departamentos();       // Obtenemos los departamentos 
    seleccionarDepartamentos();         // Ejecutamos el select de departamentos
    let departamentoSeleccionado = document.getElementById("departamentosSelect");


    /* Recorremos los departamentos */
    departamentosDeProvincias.forEach((item)=>{
        /* Obtenemos el departamento seleccionado apartir del ID de la provincia*/
        if (idProvincia == item.provincia.id) {
            departamentoSeleccionado.innerHTML += `
                <option value="${item.id}">${item.nombre}</option>
           `;
        }
    });

    /* Obtenemos las localidades apartir de los departamentos */
    departamentoSeleccionado.addEventListener("change", async(event) =>{
        let idDepartamento = event.target.value;
        let localidadesDeDepartamentos = await localidades();
        seleccionarLocalidades();
        let localidadSeleccionada = document.getElementById("localidadesSelect");


        localidadesDeDepartamentos.forEach((item) => {
            if (idDepartamento == item.departamento.id) {
                localidadSeleccionada.innerHTML += `
                    <option value="${item.localidad_censal.id}">${item.localidad_censal.nombre}</option>
               `;
            }
        });


        localidadSeleccionada.addEventListener("change", async(event)=>{
            let keyapi = //Aqui va la clave de la api dada por onpenweather;
            let nombreDeLocalidad = Object.values(event.target.selectedOptions)[0].text;
            if (nombreDeLocalidad == '') {
                console.log('Seleccione una localidad');
            }
            else{
                /* Apartir del id obtenemos los datos de la provincia */
                let idLocalidad = event.target.value;
                localidadesDeDepartamentos.forEach((item) => {
                        if (idLocalidad === item.localidad_censal.id) {
                            let idLocalidadcensal = item.localidad_censal.id;
                            let nombreLocalidadcensal = item.localidad_censal.nombre;
                            let nombreDepartamento = item.departamento.nombre;
                            let nombreProvincia = item.provincia.nombre;
                            let latitudLocalidad = item.centroide.lat;
                            let longitudLocalidad = item.centroide.lon;

                            datosdeLocalidad(datosLocalidades,idLocalidadcensal,
                                nombreLocalidadcensal,nombreDepartamento,nombreProvincia,
                                latitudLocalidad,longitudLocalidad);
                        }
                });
                
                
                await climaLocalidad(keyapi,nombreDeLocalidad);
            }
            
        });

    });
})

/* Datos del clima por pantalla */
 const climaLocalidad = async (apiKey,nombrelocalidad) => {
    let mainDict = {
        Thunderstorm: 'Tormenta',
        Drizzle: 'Llovizna',
        Rain: 'Lluvia',
        Snow: 'Nieve',
        Mist: 'Bruma',
        Smoke: 'Humo',
        Haze: 'Neblina',
        Dust: 'Polvo',
        Fog: 'Niebla',
        Sand: 'Arena',
        Ash: 'Ceniza',
        Squall: 'Chubasco',
        Tornado: 'Tornado',
        Clear: 'Despejado',
        Clouds: 'Nubes'
      }

try {
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${nombrelocalidad}&appid=${apiKey}`;
    let data = await fetch(url);
    let response = await data.json();
    verClima.innerHTML = `
    <div class="card mx-auto mt-4 w-75">
        <div class="card-header">
        <p class="h2 text-center">${response.name}</p>
        </div>
    <div class="card-body">
        <table class="table table-bordered">
                <thead>
                    <tr class="text-center">
                        <th scope="col"></th>
                        <th scope="col">Temperatura</th>
                        <th scope="col">Sensión termica</th>
                        <th scope="col">Viento</th>
                        <th scope="col">Humedad</th>
                        <th scope="col">Estados</th>
                        <th scope="col">Presion atmosferica</th>
                        <th scope="col">Visibilidad</th>
                    </tr>
                </thead>
                <tbody class="text-center font-weight-bold w-75">
                    <tr>
                        <td scope="row" ><img src="http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="card-img-top align-center" style="max-width:200px !important;"></td>
                        <td>${Math.round(response.main.temp-273.15)}°C</td>
                        <td>${Math.round(response.main.feels_like-273.15)}°C</td>
                        <td>${Math.round(response.wind.speed)} m/s</td>
                        <td>${response.main.humidity}%</td>
                        <td>${mainDict[response.weather[0].main]}</td>
                        <td>${response.main.pressure} hPa</td>
                        <td>${Math.round(response.visibility/1000)} Km</td>
                    </tr>
                </tbody>
         </table>
    </div>
  </div>
    `;
    mensajeError(verClima,response);
} catch (error) {
    mensajeError(verClima,error);
   console.log(error); 
}

}

/* Datos de la localidad por pantalla */
const datosdeLocalidad = (elementoDiv,id,localidad,departamento,provincia,lat,lon) => {
    return elementoDiv.innerHTML = `
    <div class="card w-75 mx-auto ">
        <div class="card-header">
            <p class="h2 text-center">Datos</p>
        </div>
<div class="card-body">
<table class="table table-bordered">
    <thead class="blue white-text text-center">
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Localidad</th>
            <th scope="col">Departamento</th>
            <th scope="col">Provincia</th>
            <th scope="col">Centroide</th>

        </tr>
    </thead>
<tbody class="text-center">
  <tr>
    <th scope="row">${id}</th>
    <td>${localidad}</td>
    <td>${departamento}</td>
    <td>${provincia}</td>
    <td>
    <p class="my-2">${lat}</p>
    <p class="my-2">${lon}</p>
    </td>

  </tr>

</tbody>
</table>
</div>
</div>
    `;
}
/* Errores cuando se realiza la petición*/
const mensajeError = (elementoDiv,error) => {
    if (error == "401") {
    elementoDiv.innerHTML = `
    <div class="card text-white bg-warning mb-3 w-50 mx-auto">
        <div class="card-header text-center">Error ${error}</div>
    <div class="card-body">
        <p class="card-text text-center">Debe esperar que se active la clave de su api o agregar una nueva y esperar un rato</p>
    </div>
    </div>
    `;
    }
    if (error == "404") {
        elementoDiv.innerHTML = `
        <div class="card text-white bg-warning mb-3 w-50 mx-auto">
            <div class="card-header text-center">Error ${error}</div>
        <div class="card-body">
            <p class="card-text text-center">No se a encontrado datos meteorologicos de su localización</p>
        </div>
        </div>
        `;
    }
    if (error == "TypeError: can't access property 0, response.weather is undefined") {
        elementoDiv.innerHTML = `
        <div class="card text-white bg-danger mb-3 w-50 mx-auto">
        <div class="card-header text-center">Error fatal</div>
    <div class="card-body">
        <p class="card-text text-white text-center">Escoja otra localidad</p>
    </div>
    </div>
        `;
    }
    
}
