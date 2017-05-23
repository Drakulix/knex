import json5

import jsonschema
from jsonschema import Draft4Validator
from jsonschema import FormatChecker
from jsonschema import validate


class ManifestValidator:
    def __init__(self, json_schema):
        self.schema = json5.load(json_schema)
        self.validator = Draft4Validator(self.schema, format_checker=FormatChecker())

    def validate_manifest(self, json_manifest):
        try:
            manifest = json5.load(json_manifest)
            result = self.validator.validate(manifest)
            return result
        except FileNotFoundError:
            print("no such manifest file")
        except Exception as err:
            print(err)
        except jsonschema.ValidationError as e:
            print(e.message)
        except jsonschema.SchemaError as e:
            print(e)


