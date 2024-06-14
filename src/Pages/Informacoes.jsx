import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import estilos from "../static/Informacoes.module.css";


export function Informacoes() {
  const [sensores, setSensores] = useState([]);
  const [error, setError] = useState(null);
  const [temperaturas, setTemperaturas] = useState([]);
  const idSalas = [11, 15, 17, 32];
  const [filters, setFilters] = useState({
    responsavel: "",
    status_operacional: false,
    tipo: "",
    localizacao: "",
  });

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
        setSensores(response.data);
      } catch (err) {
        setError(err);
      }
    }

    fetchSensores();
  }, []);

  useEffect(() => {
    idSalas.forEach(async (id) => {
      try {
        const response = await axios.post(
          `https://backlindomar.pythonanywhere.com/api/temperatura_filter/`,
          {
            sensor_id: id,
            valor_gte: 10,
            valor_lt: 80,
            timestamp_gte: "2024-04-01T03:00:00Z",
            timestamp_lt: "2024-04-01T03:01:00",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setTemperaturas((prevTemperaturas) => [
          ...prevTemperaturas,
          ...response.data,
        ]);
      } catch (err) {
        setError(err);
      }
    });
  }, []);

  if (error) {
    return <div>Erro ao carregar os dados: {error.message}</div>;
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "https://backlindomar.pythonanywhere.com/api/sensor_filter/",
        filters,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSensores(response.data);
    } catch (error) {
      console.error("Error fetching sensors:", error);
      setError(error);
    }
  };

  return (
    <>
      <Header />
      <hr />
      <div className={estilos.allInformacoes}>
        <h1 className={estilos.tituloInformacoes}>Sensores Cadastrados</h1>
        <Link className={estilos.botaoCadastrar} to={`cadastrar_sensor`}>
          Cadastrar Novo Sensor
        </Link>
        <form onSubmit={handleSubmit} className={estilos.formulario}>
          <div className={estilos.filtros}>
            <label>Responsável</label>
            <input
              type="text"
              name="responsavel"
              value={filters.responsavel}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtroCheck}>
            <label>Ativo</label>
            <input
              type="checkbox"
              name="status_operacional"
              checked={filters.status_operacional}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtros}>
            <label>Tipo</label>
            <input
              type="text"
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
            />
          </div>

          <div className={estilos.filtros}>
            <label>Localização</label>
            <input
              type="text"
              name="localizacao"
              value={filters.localizacao}
              onChange={handleChange}
            />
          </div>

          <button className={estilos.botaoFiltrar} type="submit">
            Filtrar
          </button>
        </form>

        <div className={estilos.Informacoes2}>
          <table className={estilos.tabelaInformacoes}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Localização</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sensores.map((sensor) => (
                <tr key={sensor.id}>
                  <td>{sensor.id}</td>
                  <td>{sensor.tipo}</td>
                  <td>{sensor.localizacao}</td>
                  <td>{sensor.latitude}</td>
                  <td>{sensor.longitude}</td>
                  <td>{sensor.responsavel}</td>
                  <td className={estilos.tede}>
                    <Link className={estilos.editarButton} to={`alterar_sensor/${sensor.id}`}>Editar</Link>
                    <button className={estilos.deletarButton} onClick={() => deletarSensor(sensor.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  async function deletarSensor(id) {
    try {
      const response = await axios.delete(`https://backlindomar.pythonanywhere.com/api/sensores/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      alert('Sensor deletado com sucesso!');
      setSensores(sensores.filter(sensor => sensor.id !== id));
    } catch (error) {
      console.error('Erro ao deletar sensor:', error);
    }
  }
}
