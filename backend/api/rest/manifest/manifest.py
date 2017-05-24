import json


class Manifest:
    """
    This is the Manifestclass it will initailise and serialise a json file of the manifest format wich is discribed in 
    /validator/schema the manffest.prepare() funktin will return a manifest.json that can be passed to the database. 
    """

    def __init__(self, path_to_jsonfile):
        self.manifest_json = None
        self.manifest = None

        with open(path_to_jsonfile, mode='r', encoding="UTF-8") as file:
            self.manifest_jsoon = json.loads(file)

    def prepare(self):
        # TODO validate json
        return self.manifest_json()

    def validate(self):
        pass

    def get_errors(self):
        pass
