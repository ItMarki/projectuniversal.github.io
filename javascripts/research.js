var researchStatText = [
  "正在尋找可以聚合的粒子……",
  "應該玩了更多Factorio……",
  "這裏一條管子，那裏一條管子……"
]
var researchOnFinish = [
  function() { player.molecule = player.molecule.plus(2); player.moleculeGained = player.moleculeGained.plus(2); },
  function() { updateResearchEffect(1); },
  function() { updateResearchEffect(2); }
]
function updateDisposePercent() {
  updateElement("researchSpendPercentDisplay", `將獲得粒子的${player.researchSpendPercent}%輸入到研究`)
}

canStartResearch = id => player.researchCurrentId != id && player.itemAmounts.research[id].neq(player.itemAmountCaps.research[id])

function startResearch(id) {
  if (!canStartResearch(id)) return
  player.researchCurrentId = id
  player.researchParticleSpent = new Decimal(0)
}

function updateAllResearchEffect() {
    for (let i=0;i<player.itemAmounts.research.length;i++) {
        updateResearchEffect(i)
    }
}

function updateResearchEffect(id) {
  switch (id) {
    case 1:
      updateBuildingCostScales();
    case 2:
      updateBuildingPowers();
  }
}

function getResearchEffectDisplay(id) {
  switch (id) {
    case 0:
      return "第一分子的創造"
    case 1:
      return "減少建築物的成本增加"
    case 2:
      return "每一個建築物都會將自己級數的單一生產力增加一個小小，但複利的比率"
  }
}

function getDiscoverEffectDisplay(id) {
  switch (id) {
    case 0:
      return "更大分子的生產力"
  }
}

function getResearchProgress() {
  return player.researchParticleSpent.div(player.itemCosts.research[player.researchCurrentId])
}

function getResearchStat() {
  if (player.researchCurrentId == -1) return "現在沒有在做什麼。"
  return `${researchStatText[player.researchCurrentId]} ${formatPercent(getResearchProgress())} done`
}
