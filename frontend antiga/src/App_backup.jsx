
import React, { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/status")
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch((error) => console.error("Erro ao buscar status:", error));

    fetch("http://localhost:5001/api/dashboard")
      .then((response) => response.json())
      .then((data) => setDashboard(data))
      .catch((error) => console.error("Erro ao buscar dashboard:", error));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>LegalDesign AI</h1>

      <h2>Status da API Backend:</h2>
      {status ? (
        <p style={{ color: "green" }}>{status}</p>
      ) : (
        <p style={{ color: "red" }}>Falha ao buscar status do backend.</p>
      )}

      <h2>Dashboard (Dados Simulados):</h2>
      {dashboard ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <strong>Contratos Ativos:</strong>
            <p>{dashboard.ativos}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <strong>Processando:</strong>
            <p>{dashboard.processando}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <strong>Com Erro:</strong>
            <p>{dashboard.com_erro}</p>
          </div>
          <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
            <strong>Total Processados:</strong>
            <p>{dashboard.total_processados}</p>
          </div>
        </div>
      ) : (
        <p style={{ color: "red" }}>Falha ao carregar o dashboard.</p>
      )}

      {dashboard && dashboard.recentes && (
        <div style={{ marginTop: "20px" }}>
          <h3>Contratos Recentes:</h3>
          <ul>
            {dashboard.recentes.map((contrato) => (
              <li key={contrato.id}>
                {contrato.nome} - Status: {contrato.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
