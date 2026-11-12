"""Serve only the standalone mockup and one public example video."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

here = Path(__file__).resolve().parent
video = here.parents[1] / 'yanis-fitness-evolution/public/videos/squat-au-poids-du-corps.mp4'
files = {'/': here / 'index.html', '/essais.css': here / 'essais.css', '/essais.js': here / 'essais.js', '/squat.mp4': video}
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        return str(files.get(path.split('?', 1)[0], here / '__not_found__'))
    def list_directory(self, path):
        self.send_error(404)
        return None
ThreadingHTTPServer(('0.0.0.0', 4175), Handler).serve_forever()
