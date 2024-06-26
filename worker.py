# src: https://devcenter.heroku.com/articles/python-rq (Create a Worker)

import os
import redis
from rq import Worker, Queue, Connection 

listen = ['high', 'default', 'low']
redis_url = os.getenv('REDISTOGO_URL')

conn = redis.from_url(redis_url)

if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()