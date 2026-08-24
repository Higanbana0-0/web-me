from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    print(f"Starting local web server on http://localhost:{PORT}")
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        httpd.server_close()
