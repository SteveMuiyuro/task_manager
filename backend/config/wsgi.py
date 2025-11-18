import os
from django.core.wsgi import get_wsgi_application

# Ensure settings module is set (important for Gunicorn)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()
