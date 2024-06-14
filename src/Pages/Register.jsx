import React from "react";
import estilos from "../static/Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaCadastro = z.object({
  usuario: z
    .string()
    .min(5, "Mínimo de 5 caracteres")
    .max(20, "Máximo de 10 caracteres"),
  senha: z
    .string()
    .min(6, "Informe 6 caracteres")
    .max(20, "Máximo de 20 caracteres"),
});

export function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errorrors },
  } = useForm({
    resolver: zodResolver(schemaCadastro),
  });

  async function cadastrarUsuario(data) {
    try {
      const response = await axios.post(
        "https://backlindomar.pythonanywhere.com/api/token/",
        {
          username: "smart_user",
          password: "123456",
        }
      );

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const responseCadastro = await axios.post(
        `https://backlindomar.pythonanywhere.com/api/create_user`,
        {
          username: data.usuario,
          email: data.email,
          password: data.senha,
        }
      );

      navigate("/informacoes");
    } catch (errorr) {
      console.errorror("Errorro ao cadastrar usuário", errorr);
    }
  }

  return (
    <>
      <div className={estilos.loginCard}>
        <form action="#" onSubmit={handleSubmit(cadastrarUsuario)}>
          <h1>
            Smart <span>City</span>
          </h1>
          <h2>Cadastro</h2>
          <label for="user">Usuário:</label>
          <input
            {...register("usuario")}
            name="usuario"
            placeholder="Insira o seu usuario"
            required
          />

          <label for="user">Senha:</label>
          <input
            {...register("senha")}
            type="password"
            name="senha"
            placeholder="Insira a sua senha"
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            {...register("email")}
            type="email"
            name="email"
            placeholder="Insira o seu email"
            required
          />
          <div className={estilos.buttonLink}>
            <a href="/">Login</a>
            <button>Cadastrar</button>
          </div>
        </form>
      </div>
    </>
  );
}
