import json5

import jsonschema
from jsonschema import Draft4Validator
from jsonschema import FormatChecker
from jsonschema import validate


class ManifestValidator:
    def __init__(self, json_schema):
        self.schema = json5.load(json_schema)
        try:
            self.validator = Draft4Validator(self.schema, format_checker=FormatChecker())
        except jsonschema.SchemaError as err:
            print(e)

    def validate_manifest(self, json_manifest):
        try:
            manifest = json5.load(json_manifest)
            self.validator.validate(manifest)
            return None
        except jsonschema.ValidationError as err:
            print(e.message)
            return err
        except Exception as err:
            print(err)
            return err
