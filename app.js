require("dotenv").config();
require("colors");

const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        //Mostrar mensaje
        const termino = await leerInput("Ciudad: ");
        //Buscar los lugares
        const lugares = await busquedas.ciudad(termino);
        //Seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === "0") continue;
        const lugarSel = lugares.find((l) => l.id === id);
        //Agregar al historial
        busquedas.agregarHistorial(lugarSel.nombre);
        //Clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
        //Mostrar resultados
        console.log("\nInformación del lugar\n".green);
        console.log("Ciudad: ", lugarSel.nombre.green);
        console.log("Lat: ", lugarSel.lat);
        console.log("Lng: ", lugarSel.lng);
        console.log("Temperatura: ", clima.temp);
        console.log("Temperatura Min: ", clima.min);
        console.log("Temperatura Max: ", clima.max);
        console.log("Como está el clima: ", clima.desc.green);
        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          let idx = `${i + 1}.`.green;
          let mostrar = `${idx} ${lugar}`;
          console.log(mostrar);
        });
        break;
      case 0:
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};
main();
