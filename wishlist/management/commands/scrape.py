from django.core.management.base import BaseCommand

from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
import os

from wishlist.models import Game

def scrape():
    # src: andressevilla.com/running-chromedriver-with-python-selenium-on-heroku/
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")  # src: stackoverflow.com/questions/62195869/
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument(f"--user-data-dir={os.environ.get('TMPDIR')}")
    driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)

    steam_ids = [game.steam_id for game in Game.objects.all()]
    for app_id in steam_ids:
        # Handle games with non-standard purchase options
        edge_cases_btn_1 = [728740]
        edge_cases_btn_2 = [863550]
    
        if app_id in edge_cases_btn_1:
            btn_pos = 1
        elif app_id in edge_cases_btn_2:
            btn_pos = 2
        else:
            btn_pos = 0

        url = f"https://store.steampowered.com/app/{app_id}/"
        driver.get(url)
        # Wait up to 60 seconds, but continue if you find the element
        driver.implicitly_wait(60)

        if "agecheck" in driver.current_url:
            select = Select(driver.find_element_by_class_name('agegate_birthday_selector') \
                .find_element_by_id('ageYear'))
            select.select_by_value('1980')
            driver.find_element_by_class_name('btn_medium').click()
        
        game = Game.objects.get(steam_id=app_id)

        # Note: game_area_purchase_game_wrapper excludes Free Demos per Steam conventions
        try:
            soup = driver.find_elements_by_class_name('game_area_purchase_game_wrapper')[btn_pos]
        except NoSuchElementException:
            print('ERROR: Page never finished loading. APP_ID:', app_id)
            price = game.curr_price
        except IndexError:
            print('ERROR: outlier game did not finish loading or had wrong btn_pos assigned. APP_ID:', app_id)
            price = game.curr_price
        
        # Page is already loaded if the wrapper is present, so don't wait any longer
        driver.implicitly_wait(0)

        # Games on sale only load 'discount_final_price' & sale-less only load 'game_purchase_price' 
        try:
            text = soup.find_element_by_class_name('discount_final_price').text
            # Split on newline to handle superfluous text from bundle purchases; e.g. Hitman 2
            price = float(text.strip().split('\n')[-1][1:])
        except NoSuchElementException:
            try: 
                text = soup.find_element_by_class_name('game_purchase_price').text
                price = float(text.strip().split('\n')[-1][1:])
            except:
                print('ERROR: No price discovered. Check to see if page layout has changed. APP_ID:', app_id)
                price = game.curr_price
        except:
            print('ERROR: Unexpected Error. Check to see if page is deprecated. APP_ID:', app_id)
            price = game.curr_price

        print(game.title, price, game.curr_price)
        game.curr_price = price
        game.save()
    driver.quit()

class Command(BaseCommand):
    help = "update game curr_price"    
    def handle(self, *args, **options):
        scrape()
        self.stdout.write('\nJOB COMPLETE')