FROM python:3.12-slim

WORKDIR /app

# gcc needed to compile netifaces (C extension); clean up apt cache after
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install torch CPU-only first — avoids pulling the 2GB CUDA variant from PyPI
RUN pip install --no-cache-dir torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies (torch already satisfied, pip will skip it)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
