import os
import sys
import traceback

# Ensure the application directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

try:
    # Try importing the flask application
    from app import app as application
except Exception as e:
    # Capture any startup errors (e.g., ModuleNotFoundError) and return them in the browser
    error_traceback = traceback.format_exc()
    
    def application(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain; charset=utf-8')])
        error_message = (
            "==================================================\n"
            " FLASK APPLICATION STARTUP ERROR\n"
            "==================================================\n\n"
            "The Python application failed to initialize. Here is the traceback:\n\n"
            f"{error_traceback}\n"
            "==================================================\n"
            "Common fixes:\n"
            "1. Did you run 'pip install' on requirements.txt inside cPanel?\n"
            "2. Make sure the virtual environment matches the Python version.\n"
        )
        return [error_message.encode('utf-8')]
