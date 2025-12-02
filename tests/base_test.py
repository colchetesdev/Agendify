import os
import warnings
from pathlib import Path

import pytest
import yaml

from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.service import Service as ServiceChrome
from selenium.webdriver.firefox.service import Service as ServiceFirefox
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

os.environ['WDM_LOG_LEVEL'] = '0'
user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"


def config():
    path = Path(__file__).parent / "data/config.yaml"
    with open(path) as config_file:
        return yaml.load(config_file, Loader=yaml.FullLoader)


class BaseTest:

    @pytest.fixture(autouse=True)
    def init_driver(self):
        warnings.simplefilter("ignore", ResourceWarning)

        cfg = config()
        remote_url = cfg.get('selenium_remote_url')

        if cfg['browser'] == 'chrome':
            options = webdriver.ChromeOptions()
            options.add_argument(f'user-agent={user_agent}')
            if cfg.get('headless'):
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-gpu')
                options.add_argument('--disable-dev-shm-usage')
                options.add_argument('--window-size=1920,1080')
            if remote_url:
                self.driver = webdriver.Remote(command_executor=remote_url, options=options)
            else:
                self.driver = webdriver.Chrome(service=ServiceChrome(ChromeDriverManager().install()), options=options)

        elif cfg['browser'] == 'firefox':
            options = webdriver.FirefoxOptions()
            options.set_preference("general.useragent.override", user_agent)
            if cfg.get('headless'):
                options.add_argument('--headless')
                options.add_argument('--no-sandbox')
                options.add_argument('--disable-gpu')
                options.add_argument('--disable-dev-shm-usage')
                options.add_argument('--window-size=1920,1080')
            if remote_url:
                self.driver = webdriver.Remote(command_executor=remote_url, options=options)
            else:
                self.driver = webdriver.Firefox(service=ServiceFirefox(GeckoDriverManager().install()), options=options)

        else:
            raise Exception("Incorrect Browser")

        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        yield self.wait, self.driver

        if self.driver is not None:
            self.driver.close()
            self.driver.quit()
