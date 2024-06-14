import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import MapaLocation from "../components/MapaLocation";
import "../static/Mapa.module.css";

export function Mapa() {
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSensores() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "https://backlindomar.pythonanywhere.com/api/sensores/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sensores = response.data;
        const pontos = sensores.map((sensor) => ({
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          tipo: sensor.tipo,
          localizacao: sensor.localizacao,
        }));
        setPontos(pontos);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchSensores();
  }, []);

  return (
    <>
      <Header />
      <div className="divAll">
        <h1 className="titleMap">Mapa</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && <MapaLocation pontos={pontos} />}
      </div>
    </>
  );
}
