from flask import Flask
from flask_cors import CORS

from api.projects import projects

app = Flask(__name__)
CORS(app)



app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb

app.register_blueprint(projects)

if __name__ == "__main__":
    # TODO remove debug for production
    app.run(host="0.0.0.0", port=5000, debug=True)
