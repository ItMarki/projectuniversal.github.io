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
  updateElement("researchSpendPercentDisplay", `Dumping ${player.researchSpendPercent}% of particles gained into research`)
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
      return "Creation of first molecule"
    case 1:
      return "Cost scale decrease to buildings"
    case 2:
      return "Each building increases single production of their tier by a small rate, but compounding"
  }
}

function getDiscoverEffectDisplay(id) {
  switch (id) {
    case 0:
      return "Bigger scale production of molecules"
  }
}

function getResearchProgress() {
  return player.researchParticleSpent.div(player.itemCosts.research[player.researchCurrentId])
}

function getResearchStat() {
  if (player.researchCurrentId == -1) return "Doing nothing."
  return `${researchStatText[player.researchCurrentId]} ${formatPercent(getResearchProgress())} done`
}
