from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.firefox.options import Options as FirefoxOptions

from wishlist.models import Game

def scrape():
    options = FirefoxOptions()
    options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)
    steam_ids = [game.steam_id for game in Game.objects.all()]
    driver = webdriver.Firefox(options=options)
    for app_id in steam_ids:
        url = f"https://store.steampowered.com/app/{app_id}/"
        driver.get(url)
        driver.implicitly_wait(30)
        if "agecheck" in driver.current_url:
            select = Select(driver.find_element_by_class_name('agegate_birthday_selector') \
                .find_element_by_id('ageYear'))
            select.select_by_value('1980')
            driver.find_element_by_class_name('btn_medium').click()
        soup = driver.find_element_by_class_name('game_area_purchase_game_wrapper')
        driver.implicitly_wait(0)
        try:
            price = float(soup.find_element_by_class_name('discount_final_price').text.strip()[1:])
        except NoSuchElementException:
            price = float(soup.find_element_by_class_name('game_purchase_price').text.strip()[1:])
        game = Game.objects.get(id=app_id)
        game.curr_price = price
        game.save()
    driver.quit()
