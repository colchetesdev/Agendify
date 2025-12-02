import time
from datetime import datetime

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from tests.base_test import BaseTest, config


class TestServicePages(BaseTest):
    def test_create_service_and_list(self, init_driver):
        wait, driver = init_driver
        base_url = config()['base_url']

        service_name = f"Servico Teste {int(time.time())}"

        driver.get(base_url)

        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Criar Serviço')]"))
        ).click()

        wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[placeholder*='Corte de Cabelo']"))
        ).send_keys(service_name)

        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Ex: 60']").send_keys("45")

        driver.find_element(By.XPATH, "//button[contains(., 'Cadastrar Serviço')]").click()

        wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(@class,'modal-body')]//p[contains(., 'Serviço cadastrado')]"))
        )

        # Optionally close the modal to unblock navigation
        try:
            driver.find_element(By.XPATH, "//div[contains(@class,'modal-footer')]//button[contains(., 'OK')]").click()
        except Exception:
            pass

        wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//h5[contains(., '{service_name}')]"))
        )
