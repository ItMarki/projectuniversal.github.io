// THE saving library, by Nyan Cat 2019
// Note: Make sure your saving variable is defined by VAR and not LET, otherwise it won't work
// And please, just please make sure you change the stuff below to suit your code, otherwise it will burst on fire
let saveName = "PUSave"
let initPlayerFunctionName = "getDefaultPlayer"
let playerVarName = "player" // DO NOT USE THE WORD "SAVE"
let importDangerAlertText = "你導入的存檔好像不見了一些數值，意思是導入這存檔可能有一些破壞性，如果你有備份，肯定要導入這存檔，請按OK，否則按取消，存檔不會導入。"
let versionTagName = "version"
let arrayTypes = getArrayTypeList() // TFW you make code to hardcode for you

function onImportError() {
  alert("錯誤：導入存檔的格式不正規，請檢查你有沒有正確地複製，而不是輸入廢話。")
}

function onLoadError() {
  console.log("存檔沒有加載？幹。")
}

function onImportSuccess() {
  alert("導入存檔成功。")
}

function onLoad() { // Put your savefile updating codes here
  if (player.version === null || player.version < 9) {
    alert("你的存檔過時了，意思是你被強迫做硬重置，才能進行，對不起！")
    if (confirm("你想不想要導出存檔做備份？這是保留舊存檔的最後機會。")) exportGame()
    alert("現在我們要做硬重置，如果你決定在做完之前要導出，請刷新，在之前的命令裏按「是」！")
    hardReset(true)
  }
  if (player.version < 10) {
    ["itemAmounts", "itemCosts", "itemPowers", "itemCostScales", "itemAmountCaps"].forEach(function (itemProperty) {
      Object.defineProperty(player[itemProperty], "development", Object.getOwnPropertyDescriptor(player[itemProperty], "upgrade"));
      delete player[itemProperty].upgrade;
      player[itemProperty].development = player[itemProperty].development.map(value => new Decimal(value))
    })
  }
  changeTab(player.storyId < 6 ? "generator" : "buildings")
  getElement("researchSpendPercent").value = player.researchSpendPercent
  refreshItems()
  refreshCrankStats()
  updateBuildingCostScales()
  updateBuildingPowers()
  updateAllDevelopmentEffect()
  updateAllResearchEffect()
  updateTabDisplay()
}
// Only change things above to fit your game UNLESS you know what you're doing

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

function saveGame() {
  localStorage.setItem(saveName, btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save, imported = false) {
  try {
    var save = JSON.parse(atob(save))
    let reference = window[initPlayerFunctionName]()
    let refLists = listItems(reference)
    let saveLists = listItems(save)
    let missingItem = refLists[0].diff(saveLists[0])
    if (missingItem.includes("save")) {
      console.log("已偵測不能恢復的破壞的存檔，正在加載默認存檔……")
      return
    }
    if (missingItem.length != 0 && imported) {
      if (!confirm(importDangerAlertText)) {
        return
      }
    }

    missingItem.forEach(function (value) {
      if (value != versionTagName) _.set(save, value, _.get(reference, value))
    })

    let decimalList = saveLists[1].diff(refLists[1])
    decimalList.forEach(function (value) {
      _.set(save, value, new Decimal(_.get(save, value)))
    })

    saveLists[2].forEach(function (value) {
      let arrayType = findArrayType(value)
      if (arrayType != "String") _.set(save, value, _.get(save, value).map(getMapFunc(arrayType)))
    })

    window[playerVarName] = save
    onLoad()
    _.set(save, versionTagName, _.get(reference, versionTagName))
    if (imported) onImportSuccess()
  } catch (err) {
    if (imported) {
      console.log(err)
      onImportError()
      return
    } else {
      console.log(err)
      onLoadError()
      return
    }
  }
}

function getMapFunc(type) {
  switch (type) {
  case "Decimal":
    return x => new Decimal(x)
  default:
    return x => x
  }
}

function findArrayType(index) {
  let definedType = arrayTypes[index]
  if (definedType === undefined) return "String"
  return definedType
}

function listItems(data, nestIndex = "") {
  let itemList = []
  let stringList = []
  let arrayList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    let thisIndex = nestIndex + (nestIndex === "" ? "" : ".") + index
    itemList.push(thisIndex)
    switch (typeof value) {
    case "object":
      if (value instanceof Array) {
        arrayList.push(thisIndex)
      } else if (!(value instanceof Decimal)) {
        let temp = listItems(value, thisIndex)
        itemList = itemList.concat(temp[0])
        stringList = stringList.concat(temp[1])
        arrayList = arrayList.concat(temp[2])
      }
      break;
    case "string":
      stringList.push(thisIndex)
      break;
    }
  });
  return [itemList, stringList, arrayList]
};
