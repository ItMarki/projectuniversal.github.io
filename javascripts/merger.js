function updateMergerDescs() {
  updateElement("atomMergerDesc", `原子聚合機：${player.particleAtomRatio}粒子 → 1 原子，最大批量${shorten(player.mergePower)}，時間1秒`)
}

function moleculeMergerActivate() {
  if (player.atom.lt(player.atomMoleculeRatio) || player.moleculeMergerOn) return false
  player.moleculeMergerOn = true
  player.moleculeMergerTime = 0
  return true
}
