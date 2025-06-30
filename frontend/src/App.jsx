import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Falha ao buscar status do backend."));

    fetch("http://localhost:5000/api/dashboard")
      .then((response) => response.json())
      .then((data) => setDashboard(data))
      .catch(() => setDashboard(null));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>LegalDesign AI</h1>
      <h2>Status da API Backend:</h2>
      <p style={{ color: status.includes("sucesso") ? "green" : "red" }}>{status}</p>

      <h2>Dashboard (Dados Simulados):</h2>
      {dashboard ? (
        <div>
          <p>Contratos Ativos: {dashboard.ativos}</p>
          <p>Processando: {dashboard.processando}</p>
          <p>Com Erro: {dashboard.com_erro}</p>
          <p>Total Processados: {dashboard.total_processados}</p>

          <h3>Contratos Recentes:</h3>
          <ul>
            {dashboard.recentes.map((item) => (
              <li key={item.id}>
                {item.nome} - Status: {item.status}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: "red" }}>Falha ao carregar o dashboard.</p>
      )}
    </div>
  );
}

export default App;