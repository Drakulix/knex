FROM python:3

CMD mkdir api


COPY requirements.txt .
RUN ls
RUN pip install --no-cache-dir -r requirements.txt

COPY . api/

WORKDIR ./api

CMD ["python", "api.py" ]