import os

from sanic import Sanic

app = Sanic("concert_backend")

if os.getenv("DEV") or bool(int(os.getenv("ENABLE_CORS", 0))):
    app.config.CORS = True
    app.config.CORS_ALLOW_HEADERS = "*"
    app.config.CORS_ALWAYS_SEND = True
    app.config.CORS_AUTOMATIC_OPTIONS = True
    app.config.CORS_METHODS = "*"
    app.config.CORS_ORIGINS = ",".join([*os.getenv("CORS_ORIGINS", "").split(","), os.getenv("FRONTEND_URL")])
