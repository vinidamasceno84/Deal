from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/status", methods=["GET"])
def status():
    return jsonify({"status": "Backend funcionando com sucesso!"}), 200

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    dados = {
        "ativos": 12,
        "processando": 5,
        "com_erro": 1,
        "total_processados": 18,
        "recentes": [
            {"id": 1, "nome": "Contrato X", "status": "Ativo"},
            {"id": 2, "nome": "Contrato Y", "status": "Erro"}
        ]
    }
    return jsonify(dados), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)