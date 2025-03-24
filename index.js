const fs = require("fs");
const pop = require('puppeteer');

const search = 'bebidas';
const url = `https://mercado.carrefour.com.br/${search}?category-1=bebidas&category-1=4599&facets=category-1&sort=score_desc&page=1`;
const cep = "13403834"; // CEP do HiperMercado de Piracicaba

(async () => {
  const browser = await pop.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  const buttonSelector = 'button[title="Insira seu CEP"]'; 
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  await page.waitForSelector('input[name="zipcode"]');
  await page.type('input[name="zipcode"]', cep, { delay: 100 });
  
  await page.keyboard.press('Enter');

  await page.waitForSelector("[data-product-card-content='true']");  

  const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-product-card-content='true']"))
          .map(element => {
              const titleElement = element.querySelector("h3 a[data-testid='product-link']");
              const priceElement = element.querySelector("[data-test-id='price']");

              const title = titleElement?.innerText.trim() || "";
              const price = priceElement?.innerText.trim() || "";

              return { title, price };
          });
  });

  fs.writeFileSync("output.json", JSON.stringify(data, null, 2));
  console.log('Arquivo output.json feito!');
  await browser.close();
})();