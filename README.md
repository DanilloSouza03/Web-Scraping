# Web-Scraping

## Descrição
Este projeto foi desenvolvido para coletar informações sobre os produtos no site mercado carrefour.

## Instalação e Uso
Certifique-se de ter o Node.js instalado.

1. Clonar o repositório:
```bash
git clone https://github.com/DanilloSouza03/Web-Scraping.git
```   
2. Instalar dependências do projeto:
```bash
npm install 
```
3. Execute o scraper:
```bash
npm run scrape
```

## Saída  
Os dados coletados são armazenados em formato `JSON` no arquivo `output.json`, conforme o exemplo abaixo:

```json
[
  { 
    "name": "Água Mineral sem Gás Nestlé Pureza Vital 1,5 Litros",
    "brand": "Nestlé Pureza Vital",
    "type": "Bebidas",
    "category": "Águas",
    "subcategory": "Água sem gás",
    "originalPrice": 3.39,
    "currentPrice": 2.79,
    "discountPercentage": 17.7,
    "seller": "Carrefour",
    "links": {
      "imageUrl": "https://carrefourbrfood.vtexassets.com/arquivos/ids/192118/7026099_1.jpg?v=637272427351430000",
      "productUrl": "https://mercado.carrefour.com.br/agua-mineral-sem-gas-nestle-pureza-vital-15-litros-7026099-3516/p"
    }
  },
  {
    "name": "Energético Monster Energy Ultra White Sem Açúcar 473ml",
    "brand": "Monster",
    "type": "Bebidas",
    "category": "Energéticos e Isotônicos",
    "subcategory": "Energéticos",
    "originalPrice": 9.29,
    "currentPrice": 9.29,
    "discountPercentage": 0,
    "seller": "Carrefour",
    "links": {
      "imageUrl": "https://carrefourbrfood.vtexassets.com/arquivos/ids/85885758/energetico-monster-energy-zero-ultra-white-lata-473ml-1.jpg?v=638036211792730000",
      "productUrl": "https://mercado.carrefour.com.br/energetico-monster-energy-ultra-white-sem-acucar-473ml-8627320-7212/p"
    }
  }
]
```

**Dicionário dos Dados:**
| Campo              | Tipo     | Descrição |
|--------------------|---------|-----------|
| `name`            | `string` | Nome do produto |
| `brand`           | `string` | Marca do produto |
| `type`            | `string` | Tipo geral do produto |
| `category`        | `string` | Categoria dentro do site |
| `subcategory`     | `string` | Subcategoria mais específica |
| `originalPrice`   | `float`  | Preço original (antes do desconto) |
| `currentPrice`    | `float`  | Preço atual (com desconto, se houver) |
| `discountPercentage` | `float` | Percentual de desconto aplicado |
| `seller`          | `string` | Nome do vendedor |
| `links.imageUrl`  | `string` | URL da imagem do produto |
| `links.productUrl`| `string` | Link direto para o produto no site |

---
Desenvolvido por **Danillo Verardo**