# SalesZA

A mobile-friendly South African grocery price comparison prototype.

## Run locally

Open `index.html` in a browser. The prototype uses plain HTML, CSS, and JavaScript and requires no build tools.

## Price data

Product prices in this prototype are illustrative sample data. They are not live retailer prices and are not scraped from retailer websites. Each store card links to that retailer's search results for the product name and pack size; because the prototype has no retailer SKU or product URL, the shopper should confirm the exact item on the retailer's site.

A production real-time comparison requires an authorized retailer API, partner feed, or licensed data provider. To link directly to an exact product page, the provider must supply retailer-specific product URLs or IDs. Retailer, product, location, stock, and refresh coverage will depend on that source. Do not put provider credentials in client-side JavaScript; connect the provider through a server-side integration.
