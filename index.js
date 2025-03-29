import fs from "fs";
import fetch from "node-fetch";

const apiBaseUrl = "https://mercado.carrefour.com.br/api/graphql";

const queryParams = {
  variables: {
    isPharmacy: false,
    first: 60,
    after: "0",
    sort: "score_desc",
    term: "",
    selectedFacets: [
      { key: "category-1", value: "bebidas" },
      { key: "category-1", value: "4599" },
      {
        key: "channel",
        value: JSON.stringify({
          salesChannel: 2,
          regionId: "v2.16805FBD22EC494F5D2BD799FE9F1FB7",
        }),
      },
      { key: "locale", value: "pt-BR" },
      { key: "region-id", value: "v2.16805FBD22EC494F5D2BD799FE9F1FB7" },
    ],
  },
};

const getApiUrl = (after) => {
  return (
    apiBaseUrl +
    "?operationName=ProductsQuery&variables=" +
    encodeURIComponent(
      JSON.stringify({ ...queryParams.variables, after: after })
    )
  );
};

const getProducts = async () => {
  let after = "0";
  let allProducts = [];

  while (true) {
    try {
      const apiUrl = getApiUrl(after);
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

      if (data.data?.search?.products?.pageInfo.totalCount === allProducts.length) {
        console.log("#######################################");
        console.info("Parando coleta não há mais dados para serem coletados.");
        console.log("#######################################");
        break;
      };

      products.forEach(product => {
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

        allProducts.push({ name, brand, type, category, subcategory, originalPrice, currentPrice, discountPercentage, seller, links });
      });

      after = (parseInt(after) + 60).toString();

      fs.writeFileSync("output.json", JSON.stringify(allProducts, null, 2));
      console.log(`Dados coletados: ${allProducts.length} produtos.`);

    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  console.log(`Sucesso: Coleta concluída! Total de produtos coletados: ${allProducts.length}`);
};

getProducts();