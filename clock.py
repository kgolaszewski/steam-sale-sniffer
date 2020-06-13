# src: https://devcenter.heroku.com/articles/python-rq (Queueing Jobs)
# src: https://devcenter.heroku.com/articles/clock-processes-python (Execution Schedule)

# from rq import Queue
# q = Queue(connection=conn)

from apscheduler.schedulers.blocking import BlockingScheduler 
import django_rq

from scrape import scrape

q = django_rq.get_queue('high')
sched = BlockingScheduler()

@sched.scheduled_job('cron', day_of_week='thu', hour=14, minute=10)
def scheduled_job():
    q.enqueue(scrape)

sched.start()