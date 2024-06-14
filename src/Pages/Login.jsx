import React from "react";
import estilos from "../static/Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaLogin = z.object({
  usuario: z
    .string()
    .min(5, "Mínimo de 5 caracteres")
    .max(20, "Máximo de 10 caracteres"),
  senha: z
    .string()
    .min(6, "Informe 6 caracteres")
    .max(20, "Máximo de 20 caracteres"),
});

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaLogin),
  });

  async function obterDadosFormulario(data) {
    try {
      const response = await axios.post(
        "https://backlindomar.pythonanywhere.com/api/token/",
        {
          username: data.usuario,
          password: data.senha,
        }
      );

      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      console.log("Login bem-sucedido!");
      navigate("/informacoes");
    } catch (error) {
      console.error("Erro de autenticação", error);
    }
  }

  return (
    <>
      <div className={estilos.loginCard}>
        <form action="#" onSubmit={handleSubmit(obterDadosFormulario)}>
          <h1>
            Smart <span>City</span>
          </h1>
          <h2>Login</h2>
          <label for="user">Usuário:</label>
          <input
            {...register("usuario")}
            placeholder="Insira o seu email"
            required
          />
          {errors.usuario && (
            <p className={estilos.mensagem}>{errors.usuario.message}</p>
          )}
          <label for="user">Senha:</label>
          <input
            type="password"
            {...register("senha")}
            placeholder="Insira a sua senha"
            required
          />
          {errors.senha && (
            <p className={estilos.mensagem}>{errors.senha.message}</p>
          )}
          <div className={estilos.buttonLink}>
            <a href="/cadastro">Cadastre-se</a>
            <button>Login</button>
          </div>
        </form>
      </div>
    </>
  );
}
