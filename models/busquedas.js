const fs = require("fs");
const axios = require("axios");
require("colors");
class Busquedas {
  historial = [];
  pathDB = "./db/database.json";
  constructor() {
    //To Do
    this.leerBD();
  }
  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }
  get historialCapitalizado() {
    //Capitalizar
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(" ");
    });
  }
  async ciudad(lugar = "") {
    //petición http
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });
      const resp = await intance.get();
      return resp.data.features.map((lugar) => {
        return {
          id: lugar.id,
          nombre: lugar.place_name,
          lng: lugar.center[0],
          lat: lugar.center[1],
        };
      });
    } catch (err) {
      console.log("ERROR!!! en la petición http");
      console.log(err);
      return [];
    }
  }
  async climaLugar(lat, lon) {
    try {
      //intance axios.create()
      const paramsOpenWeather = {
        lat: lat,
        lon: lon,
        units: "metric",
        lang: "es",
        appid: process.env.OPEN_WEATHER_KEY,
      };
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: paramsOpenWeather,
      });
      //resp.data
      const resp = await intance.get();
      const data = resp.data;
      return {
        desc: data.weather[0].description,
        min: data.main.temp_min,
        max: data.main.temp_max,
        temp: data.main.temp,
      };
    } catch (err) {
      console.log("ERROR!!!");
      console.log(err);
      return {
        desc: "error",
        min: "error",
        max: "error",
        temp: "error",
      };
    }
  }
  agregarHistorial(lugar) {
    //Cargar el lugar en el arreglo
    if (!this.historial.includes(lugar.toLowerCase())) {
      this.historial = this.historial.splice(0, 5);
      this.historial.unshift(lugar.toLowerCase());
      this.guardarDB();
    }
  }
  guardarDB() {
    //Guardar en la base de datos
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.pathDB, JSON.stringify(payload));
  }
  leerBD() {
    //Verificar si existe
    if (!fs.existsSync(this.pathDB)) {
      return;
    }
    const info = fs.readFileSync(this.pathDB, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
