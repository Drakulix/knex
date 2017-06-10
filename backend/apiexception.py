""" This module defines the Exception class for Flask API errors. """

class ApiException(Exception):
    """ Exception for errors of the Flask API."""
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """ Exception for errors of the Flask API.

        Args:
            message: Explanation of the error
            status_code (int, optional): Status Code of the error
            payload (dict, optional): Optional Payload of the error
        """
        Exception.__init__(self)
        self.message = message

        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """ Turn error message and payload into Python dictionary.
        Returns:
            rv (dict): Dictionary of error message and payload.
        """
        return_value = dict()
        return_value['message'] = self.message
        return_value['validation_error'] = self.payload
        return return_value
