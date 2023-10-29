const apiUrl = "https://criptoya.com/api/usdc/ars/100";

const exchanges = ["buenbit", "ripio", "satoshitango", "letsbit", "fiwind", "lemoncash", "belo", "tiendacrypto", "bybit"];

const request = new Request(apiUrl);
const response = await request.loadJSON();

const filteredExchanges = {};
for (const exchange of exchanges) {
    if (exchange in response) {
        filteredExchanges[exchange] = response[exchange];
    }
}

let bestBuyExchange;
let bestBuyPrice = Number.POSITIVE_INFINITY;
for (const exchange in filteredExchanges) {
    if (filteredExchanges[exchange].ask < bestBuyPrice) {
        bestBuyPrice = filteredExchanges[exchange].ask;
        bestBuyExchange = exchange;
    }
}

let bestSellExchange;
let bestSellPrice = Number.NEGATIVE_INFINITY;
for (const exchange in filteredExchanges) {
    if (filteredExchanges[exchange].totalBid > bestSellPrice) {
        bestSellPrice = filteredExchanges[exchange].totalBid;
        bestSellExchange = exchange;
    }
}

let bestSpreadExchange;
let bestSpread = Number.POSITIVE_INFINITY;
for (const exchange in filteredExchanges) {
    const spread = filteredExchanges[exchange].ask - filteredExchanges[exchange].totalBid;
    if (spread < bestSpread) {
        bestSpread = spread;
        bestSpreadExchange = exchange;
    }
}

let widget = new ListWidget();
widget.backgroundColor = new Color("#F5F5F5"); 
widget.setPadding(10, 10, 10, 10);


let titleText = widget.addText("USDC.AR");
titleText.textColor = new Color("#121212"); 
titleText.font = Font.mediumSystemFont(16);
widget.addSpacer(10); 

let stack = widget.addStack();
stack.layoutHorizontally();
stack.spacing = 10; 

let buyStack = stack.addStack();
buyStack.layoutVertically();
buyStack.setPadding(10, 10, 10, 10); 
buyStack.addText("↘️Compra").textColor = new Color("#121212"); 
buyStack.addText(`$${bestBuyPrice}`).textColor = new Color("#30475E"); 
buyStack.addText(bestBuyExchange).textColor = new Color("#4F8A8B"); 
buyStack.cornerRadius = 10; 
buyStack.borderWidth = 1; 
buyStack.borderColor = new Color("#121212"); 
buyStack.shadowColor = new Color("#121212"); 
buyStack.shadowRadius = 5; 

let sellStack = stack.addStack();
sellStack.layoutVertically();
sellStack.setPadding(10, 10, 10, 10); 
sellStack.addText("↗️Venta").textColor = new Color("#121212"); 
sellStack.addText(`$${bestSellPrice}`).textColor = new Color("#30475E"); 
sellStack.addText(bestSellExchange).textColor = new Color("#4F8A8B"); 
sellStack.cornerRadius = 10; 
sellStack.borderWidth = 1; 
sellStack.borderColor = new Color("#121212");
sellStack.shadowColor = new Color("#121212");
sellStack.shadowRadius = 5;

let spreadStack = stack.addStack();
spreadStack.layoutVertically();
spreadStack.setPadding(10, 10, 10, 10); 
spreadStack.addText("😉Spread").textColor = new Color("#121212"); 
spreadStack.addText(`$${bestSpread.toFixed(2)}`).textColor = new Color("#30475E"); 
spreadStack.addText(bestSpreadExchange).textColor = new Color("#4F8A8B"); 
spreadStack.cornerRadius = 10; 
spreadStack.borderWidth = 1; 
spreadStack.borderColor = new Color("#121212"); 
spreadStack.shadowColor = new Color("#121212"); 
spreadStack.shadowRadius = 5; 

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}

Script.complete();
