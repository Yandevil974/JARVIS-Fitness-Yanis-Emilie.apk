#!/usr/bin/env python3
"""Static preview server: bind 0.0.0.0, allow iframe embedding."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        SimpleHTTPRequestHandler.end_headers(self)

    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)


if __name__ == "__main__":
    httpd = ThreadingHTTPServer(("0.0.0.0", 8080), Handler)
    print("preview on 0.0.0.0:8080", flush=True)
    httpd.serve_forever()
