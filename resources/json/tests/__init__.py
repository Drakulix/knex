import os
import unittest
import sys
sys.path.append("..")
from jsonschema import ValidationError

from  manifest_validator import ManifestValidator

DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DIR = os.path.abspath(os.path.join(DIR, os.pardir))


class TestManifestSchema(unittest.TestCase):
    def setUp(self):
        path = os.path.join(JSON_DIR, "schema/manifest_schema.json")
        with open(path) as schema:
            self.validator = ManifestValidator(schema)

    def test_schema_ok(self):
        with open("manifest.json") as manifest:
            self.assertEqual(None, self.validator.validate_manifest(manifest))

    def test_schema_empty(self):
        with open("manifest2.json") as manifest:
            self.assertRaises(ValidationError, self.validator.validate_manifest(manifest))

    def test_schema_invalidDate(self):
        with open("manisfest3.json") as manifest:
            self.assertRaises(ValidationError, self.validator.validate_manifest(manifest))

    def test_schema_invalidURL(self):
        with open("manifest4.json") as manifest:
            self.assertRaises(ValidationError, self.validator.validate_manifest(manifest))

    def test_schema_invalidEmail(self):
        with open("manifest5.json") as manifest:
            self.assertRaises(ValidationError, self.validator.validate_manifest(manifest))

    def test_schema_invalidJSON(self):
        with open("manifest6.json") as manifest:
            self.assertRaises(ValidationError, self.validator.validate_manifest(manifest))



if __name__ == '__main__':
    unittest.main()
