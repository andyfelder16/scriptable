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
widget.backgroundColor = new Color("#232931"); 
widget.setPadding(10, 10, 10, 10); 

let titleText = widget.addText("USDC.AR");
titleText.textColor = new Color("#EEEEEE"); 
titleText.font = Font.mediumSystemFont(16);
widget.addSpacer(10); 

let stack = widget.addStack();
stack.layoutHorizontally();
stack.spacing = 10; 

let buyStack = stack.addStack();
buyStack.layoutVertically();
buyStack.setPadding(10, 10, 10, 10);
buyStack.addText("↘️Compra").textColor = new Color("#EEEEEE"); 
buyStack.addText(`$${bestBuyPrice.toFixed(2)}`).textColor = new Color("#4ECCA3");
buyStack.addText(bestBuyExchange).textColor = new Color("#97999c");
buyStack.cornerRadius = 10; 
buyStack.borderWidth = 1; 
buyStack.borderColor = new Color("#EEEEEE");
buyStack.shadowColor = new Color("#EEEEEE");
buyStack.shadowRadius = 5;

let sellStack = stack.addStack();
sellStack.layoutVertically();
sellStack.setPadding(10, 10, 10, 10);
sellStack.addText("↗️Venta").textColor = new Color("#EEEEEE"); 
sellStack.addText(`$${bestSellPrice.toFixed(2)}`).textColor = new Color("#4ECCA3");
sellStack.addText(bestSellExchange).textColor = new Color("#97999c");
sellStack.cornerRadius = 10; 
sellStack.borderWidth = 1; 
sellStack.borderColor = new Color("#EEEEEE");
sellStack.shadowColor = new Color("#EEEEEE");
sellStack.shadowRadius = 5;

let spreadStack = stack.addStack();
spreadStack.layoutVertically();
spreadStack.setPadding(10, 10, 10, 10);
spreadStack.addText("😉Spread").textColor = new Color("#EEEEEE"); 
spreadStack.addText(`$${bestSpread.toFixed(2)}`).textColor = new Color("#4ECCA3");
spreadStack.addText(bestSpreadExchange).textColor = new Color("#97999c");
spreadStack.cornerRadius = 10; 
spreadStack.borderWidth = 1; 
spreadStack.borderColor = new Color("#EEEEEE"); 
spreadStack.shadowColor = new Color("#EEEEEE"); 
spreadStack.shadowRadius = 5; 

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}

Script.complete();
