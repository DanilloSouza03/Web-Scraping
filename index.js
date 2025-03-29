const fs = require("fs");
const pop = require("puppeteer");

(async () => {
  const browser = await pop.launch({ headless: "new" });
  const page = await browser.newPage();

  let allProducts = [];
  const baseUrl = "https://mercado.carrefour.com.br/bebidas?category-1=bebidas&category-1=4599&facets=category-1&sort=score_desc&page=1";

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const products = await page.evaluate(async () => {
    const apiUrl = "https://mercado.carrefour.com.br/api/graphql?operationName=ProductsQuery&variables=%7B%22isPharmacy%22%3Afalse%2C%22first%22%3A20%2C%22after%22%3A%220%22%2C%22sort%22%3A%22score_desc%22%2C%22term%22%3A%22%22%2C%22selectedFacets%22%3A%5B%7B%22key%22%3A%22category-1%22%2C%22value%22%3A%22bebidas%22%7D%2C%7B%22key%22%3A%22category-1%22%2C%22value%22%3A%224599%22%7D%2C%7B%22key%22%3A%22channel%22%2C%22value%22%3A%22%7B%5C%22salesChannel%5C%22%3A2%2C%5C%22regionId%5C%22%3A%5C%22v2.16805FBD22EC494F5D2BD799FE9F1FB7%5C%22%7D%22%7D%2C%7B%22key%22%3A%22locale%22%2C%22value%22%3A%22pt-BR%22%7D%2C%7B%22key%22%3A%22region-id%22%2C%22value%22%3A%22v2.16805FBD22EC494F5D2BD799FE9F1FB7%22%7D%5D%7D";

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const products = data.data?.search?.products?.edges || [];

      return products.map(product => {
        const name = product.node.name;
        const brand = product.node.brand?.name || "N/A";
        const breadcrumbs = product.node.breadcrumbList?.itemListElement || [];
        const type = breadcrumbs[0]?.name || "N/A";
        const category = breadcrumbs[1]?.name || "N/A";
        const subcategory = breadcrumbs[2]?.name || "N/A";

        const primeiraOferta = product.node.offers?.offers?.[0];
        const originalPrice = primeiraOferta?.listPrice || "N/A";
        const currentPrice = primeiraOferta?.price || "N/A";
        const discountPercentage = parseFloat((((originalPrice - currentPrice) / originalPrice * 100)).toFixed(1));

        const sellerList = product.node.sellers[0];
        const seller = sellerList?.sellerName || "N/A";

        const imageUrl = product.node.image?.[0]?.url || "N/A";
        const baseLink = "https://mercado.carrefour.com.br";
        const restanteLink = breadcrumbs[3]?.item || "N/A";
        const productUrl = restanteLink ? baseLink + restanteLink : "N/A";
        const links = { imageUrl, productUrl };

        return { name, brand, type, category, subcategory, originalPrice, currentPrice, discountPercentage, seller, links };
      });

    } catch (error) {
      console.error("Erro ao buscar produtos da API:", error);
      return [];
    }
  });

  allProducts.push(...products);

  await browser.close();

  fs.writeFileSync("output.json", JSON.stringify(allProducts, null, 2));
  console.log(`Coleta concluída! Total de produtos coletados: ${allProducts.length}`);
})();