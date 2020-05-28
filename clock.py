# src: https://devcenter.heroku.com/articles/python-rq (Queueing Jobs)
# src: https://devcenter.heroku.com/articles/clock-processes-python (Execution Schedule)
from apscheduler.schedulers.blocking import BlockingScheduler 
from rq import Queue

from worker import conn
from scrape import scrape

q = Queue(connection=conn)
s = BlockingScheduler()

@s.scheduled_job('cron', day_of_week='mon', hour=17)
def scheduled_job():
    q.enqueue(scrape)

s.start()