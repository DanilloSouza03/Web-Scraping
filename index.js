const fs = require("fs");
const pop = require('puppeteer');

const search = 'bebidas';
const baseUrl = `https://mercado.carrefour.com.br/${search}?category-1=bebidas&category-1=4599&facets=category-1&sort=score_desc&page=`;
const cep = "13403834"; // CEP do HiperMercado de Piracicaba

(async () => {
  const browser = await pop.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(baseUrl + "1");  

  const buttonSelector = 'button[title="Insira seu CEP"]'; 
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  await page.waitForSelector('input[name="zipcode"]');
  await page.type('input[name="zipcode"]', cep, { delay: 100 });
  await page.keyboard.press('Enter');

  const allProducts = new Map();
  
  for (let pageNum = 1; pageNum <= 50; pageNum++) {
    console.log(`Coletando dados da página ${pageNum}...`);

    await page.goto(baseUrl + pageNum);

    await page.waitForSelector("[data-product-card-content='true']");

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-product-card-content='true']"))
        .map(element => {
          const titleElement = element.querySelector("h3 a[data-testid='product-link']");
          const linkElement = element.querySelector("a[data-testid='product-link']");
          const rawPriceElement = element.querySelector("[data-test-id='price']");

          const title = titleElement?.innerText.trim() || "";
          const rawPrice = rawPriceElement?.innerText.trim() || "";
          const link = linkElement?.href || "";

          return { title, rawPrice, link };
        });
    });
    
    if (data.length === 0) {
      console.log(`Nenhum produto encontrado na página ${pageNum}, encerrando a coleta.`);
      break;
    }
  
    data.forEach(product => {
      if (!allProducts.has(product.link)) {
        allProducts.set(product.link, product);
      }
    });    
  };

  const uniqueProducts = Array.from(allProducts.values());

  fs.writeFileSync("output.json", JSON.stringify(uniqueProducts, null, 2));
  console.log(`Coleta concluída! Total de produtos coletados: ${uniqueProducts.length}`);

  await browser.close();
})();