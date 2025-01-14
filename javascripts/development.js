var developmentTypes = ["c","c","c","i","e","e"]
var developmentTypeFullNames = {
  "c":"建築",
  "e":"擴展",
  "i":"改善"
}

function updateAllDevelopmentEffect() {
    for (let i=0;i<player.itemAmounts.development.length;i++) {
        updateDevelopmentEffect(i)
    }
}

function getDevelopmentEffect(id) {
    switch (id) {
        case 0:
        case 1:
          return Decimal.pow(player.itemPowers.development[id], player.itemAmounts.development[id])
        case 3:
          return Decimal.min(player.itemPowers.development[id].times(player.itemAmounts.development[id]),2.5)
    }
}

function updateDevelopmentEffect(id) {
    let reference = getDefaultPlayer()
    switch (id) {
        case 0:
          player.mergePower = getDevelopmentEffect(0)
          break;
        case 1:
          player.particleCap = reference.particleCap.times(getDevelopmentEffect(1))
        case 3:
          player.particleAtomRatio = reference.particleAtomRatio.sub(getDevelopmentEffect(3))
    }
}

function getDevelopmentCostCurrencyName(id) {
  switch (id) {
    case 0:
    case 1:
    case 2:
    case 5:
      return "原子"
    case 3:
    case 4:
      return "分子"
    default:
      return "bug"
  }
}

function getDevelopmentEffectDisplay(id) {
  switch (id) {
    case 0:
    case 1:
      return `${shortenMoney(getDevelopmentEffect(id))}x`
      break;
    case 2:
      return "解鎖研究"
    case 3:
      return `${new Decimal(3).sub(getDevelopmentEffect(id))}:1`
    case 4:
      return "解鎖曲軸"
    case 5:
      return "解鎖分子聚合機"
    default:
      return "Missing(BUG)"
  }
}

function showDevelopment(id) {
  if (player.itemAmounts.development[id].eq(player.itemAmountCaps.development[id]) && true) return false // Change true to bool when a toggle exists
  switch (id) {
    case 3:
      return player.moleculeGained.gt(1)
    case 4:
      return player.itemAmounts.development[3].neq(0)
    case 5:
      return player.itemAmounts.discover[0].neq(0)
    default:
      return true
  }
}
