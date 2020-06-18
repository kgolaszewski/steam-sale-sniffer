release: python manage.py migrate wishlist && python manage.py migrate
web: gunicorn config.wsgi --log-file -