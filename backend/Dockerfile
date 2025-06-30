# Use uma imagem oficial do Python como imagem base
FROM python:3.11-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie todos os arquivos do backend para o diretório de trabalho
COPY . /app

# Instale as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta em que o Flask vai rodar
EXPOSE 5000

# Comando para iniciar o servidor Flask
CMD ["python", "main.py"]