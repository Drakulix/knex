FROM python:3
CMD ls
CMD mkdir pythonfile


COPY requirements.txt .
RUN ls
RUN pip install --no-cache-dir -r requirements.txt

COPY . pythonfile/

WORKDIR ./pythonfile

CMD ["python", "first.py" ]