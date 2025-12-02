import time
from datetime import datetime, timedelta

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

from tests.base_test import BaseTest, config


class TestScheduledServicePages(BaseTest):
    def test_create_scheduled_service_and_list(self, init_driver):
        wait, driver = init_driver
        base_url = config()['base_url']

        service_name = f"Servico Agenda {int(time.time())}"

        # Create a service first (reusing the UI flow)
        driver.get(base_url)
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Criar Serviço')]"))
        ).click()

        wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, "input[placeholder*='Corte de Cabelo']"))
        ).send_keys(service_name)

        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Ex: 60']").send_keys("30")
        driver.find_element(By.XPATH, "//button[contains(., 'Cadastrar Serviço')]").click()

        wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(@class,'modal-body')]//p[contains(., 'Serviço cadastrado')]"))
        )

        try:
            driver.find_element(By.XPATH, "//div[contains(@class,'modal-footer')]//button[contains(., 'OK')]").click()
        except Exception:
            pass

        # Go to booking page
        wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Agendar')]"))
        ).click()

        service_option = wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//select[@class='form-select']/option[contains(., '{service_name}')]"))
        )
        Select(driver.find_element(
            By.XPATH, "//label[contains(., 'Selecione o Serviço')]/following::select[1]")
        ).select_by_visible_text(service_option.text)

        booking_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        wait.until(EC.presence_of_element_located(
            (By.XPATH, "//label[contains(., 'Selecione a Data')]/following::input[1]"))
        ).send_keys(booking_date)

        Select(driver.find_element(
            By.XPATH, "//label[contains(., 'Horários Disponíveis')]/following::select[1]")
        ).select_by_visible_text("10:00")

        wait.until(EC.presence_of_element_located(
            (By.XPATH, "//label[contains(., 'Nome')]/following::input[1]"))
        ).send_keys("Teste Selenium")
        driver.find_element(
            By.XPATH, "//label[contains(., 'Telefone')]/following::input[1]"
        ).send_keys("11987654321")

        driver.find_element(By.XPATH, "//button[contains(., 'Confirmar Agendamento')]").click()

        wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//div[contains(@class,'modal-body')]//p[contains(., 'Agendamento confirmado')]"))
        )

        # Wait for redirect to schedules page and assert the new appointment appears
        wait.until(EC.presence_of_element_located(
            (By.XPATH, "//h2[contains(., 'Meus Agendamentos')]"))
        )
        wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//div[contains(@class,'schedule-card')]//h5[contains(., '{service_name}')]"))
        )
