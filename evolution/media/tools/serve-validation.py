#!/usr/bin/env python3
"""Sert les pages de validation du chantier visuels (lot 1, lot 2, ...).

Usage : python3 evolution/media/tools/serve-validation.py [port]
Racine servie : evolution/media/refonte-photo/hd-2026-09-30
Ecoute sur 0.0.0.0 pour etre joignable depuis le telephone.
La racine / redirige vers /sommaire.html (liste des pages).
"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir,
                      "refonte-photo", "hd-2026-09-30")


class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        if self.path in ("/", ""):
            self.send_response(302)
            self.send_header("Location", "/sommaire.html")
            self.end_headers()
            return None
        return super().send_head()

    def end_headers(self):
        # pas de cache : on veut toujours la derniere version des exports
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    racine = os.path.abspath(RACINE)
    handler = partial(Handler, directory=racine)
    with ThreadingHTTPServer(("0.0.0.0", port), handler) as httpd:
        print("validation servie sur http://0.0.0.0:%d/  (racine: %s)" % (port, racine))
        httpd.serve_forever()


if __name__ == "__main__":
    main()
