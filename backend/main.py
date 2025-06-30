from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Liberando CORS para todas as rotas

@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Backend funcionando com sucesso!"}), 200

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    fake_data = {
        "ativos": 12,
        "com_erro": 1,
        "processando": 5,
        "recentes": [
            {"id": 1, "nome": "Contrato X", "status": "Ativo"},
            {"id": 2, "nome": "Contrato Y", "status": "Erro"},
        ],
        "total_processados": 18
    }
    return jsonify(fake_data), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
