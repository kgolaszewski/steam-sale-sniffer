release: python manage.py migrate wishlist && python manage.py migrate
web: gunicorn config.wsgi --log-file -
clock: python clock.py
worker: python manage.py rqworker high default low