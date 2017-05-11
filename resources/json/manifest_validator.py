import json

from jsonschema import Draft4Validator
from jsonschema import FormatChecker
from jsonschema import validate


class ManifestValidator:
    def __init__(self, json_string, json_schema):
        self.json = json.load(json_string)

        self.schema = json.load(json_schema)
        self.validator = Draft4Validator(self.schema, format_checker=FormatChecker())


    def validate_json(self):
        return self.validator.validate(self.json)


m = open("./manifests/manifest.json")
s = open("./schema/manifest_schema.json")
v = ManifestValidator(m, s)
print(v.validate_json())