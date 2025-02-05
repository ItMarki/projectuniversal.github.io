var existingTableNames = ["building","development","research","discover"]
var tableCellAmounts = {
  building: 4,
  development: 6,
  research: 5,
  discover: 5
}
var tableDisplayCellIndex = {
  effectDisplay: {
    building: 1,
    development: 3,
    research: 2,
    discover: 2
  },
  cost: {
    building: 2,
    development: 4,
    research: 3,
    discover: 3
  },
  desc: {
    development: 2,
    research: 1,
    discover: 1
  }
}
var onclickCodeFunc = {
  building: (id) => `buyItem(${id}, 'building')`,
  development: (id) => `buyItem(${id}, 'development')`,
  research: (id) => `startResearch(${id})`,
  discover: (id) => `buyItem(${id}, 'discover')`
}

var foo = { // I just can't name this one
  building: "Owned",
  development: "Owned",
  research: "Did",
  discover: "Done"
}

var displayNames = {
    building: ["粒子建造器", "T1建築物", "T2建築物"],
    development: ["更大的原子聚合機", "更大的粒子貯存", "研究中心", "更高效率的原子聚合", "曲軸", "分子聚合機"],
    research: ["建造一個分子", "自給自足", "平行工作"],
    discover: ["分子聚合"]
}

var itemDescs = {
  development: [
    "每秒可以聚合的原子2倍",
    "粒子貯存大10倍",
    "建築一個可以嘗試和將好事發生的中心",
    "每原子所需的粒子數量少0.5",
    "用分子建築一個曲軸",
    "從之前所知道的建造一個固定的分子聚合機"
  ],
  research: [
    "嘗試用全部粒子建造一個分子",
    "讓建築物用生產的粒維持自己，令維持更多建築物更容易",
    "Enable buildings to work together and much faster, making each new building speeding up old ones as well"
  ],
  discover: [
    "Figure out how to make more molecules"
  ]
}

var itemEffectDisplayFunc = {
  building: (id) => `${shortenMoney(player.itemPowers.building[id])} particle/s`,
  development: getDevelopmentEffectDisplay,
  research: getResearchEffectDisplay,
  discover: getDiscoverEffectDisplay
}

var showItemFunc = {
  building: () => true,
  development: showDevelopment,
  research: () => true,
  discover: () => true
}

var itemCostCurrencyNameFunc = {
  building: () => "atom",
  development: getDevelopmentCostCurrencyName,
  research: () => "particle",
  discover: () => "molecule"
}

var itemAvailabilityFunc = {
  building: (id) => player.itemAmounts.building[id].neq(player.itemAmountCaps.building[id])?canBuyItem(id, "building")?2:1:0,
  development: (id) => player.itemAmounts.development[id].neq(player.itemAmountCaps.development[id])?canBuyItem(id, "development")?2:1:0,
  research: (id) => player.itemAmounts.research[id].neq(player.itemAmountCaps.research[id])?player.researchCurrentId==id?1:2:0,
  discover: (id) => player.itemAmounts.discover[id].neq(player.itemAmountCaps.discover[id])?canBuyItem(id, "discover")?2:1:0
}

var itemDisplayTexts = {
  building: ["Maxed", "Can't afford", "Buy"],
  development: ["Maxed", "Can't afford", "Buy"],
  research: ["Mastered", "Doing", "Start"],
  discover: ["Mastered", "", "Discover"]
}

function updateItemTable(type) {
    Array.from(getElement(`${type}Rows`).rows).forEach((tr, id) => {
        let showThisItem = showItemFunc[type](id)
        decideElementDisplay(tr, showThisItem)
        if (showThisItem) {
          tr.cells[0].innerHTML = `${displayNames[type][id]} ${player.itemAmounts[type][id].gt(0)?`(${foo[type]} ${shortenMoney(player.itemAmounts[type][id])})`:""}`
          if (type != "building") tr.cells[tableDisplayCellIndex.desc[type]].innerHTML = itemDescs[type][id]
          if (type == "development") tr.cells[1].innerHTML = developmentTypeFullNames[developmentTypes[id]]
          tr.cells[tableDisplayCellIndex.effectDisplay[type]].innerHTML = itemEffectDisplayFunc[type](id)
          tr.cells[tableDisplayCellIndex.cost[type]].innerHTML = `${shortenMoney(Decimal.ceil(player.itemCosts[type][id]))} ${itemCostCurrencyNameFunc[type](id)}s`
          let buyButton = tr.cells[tr.cells.length - 1].childNodes[0]
          let availability = itemAvailabilityFunc[type](id)
          let displayTexts = itemDisplayTexts[type]
          buyButton.innerHTML = displayTexts[availability]
          buyButton.classList.toggle("btn-success", availability==2)
          buyButton.classList.toggle("btn-danger", availability==1)
          buyButton.classList.toggle("btn-info", availability===0)
        }
    })
}
