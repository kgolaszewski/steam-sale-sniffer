release: python backend/manage.py migrate
web: gunicorn backend.config.wsgi --log-file -
clock: python clock.py
worker python worker.py