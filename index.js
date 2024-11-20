// connecting to websocket
import WebSocketManager from './js/socket.js';
const socket = new WebSocketManager('127.0.0.1:24050');

const h100Cont = document.getElementById("h100Cont")
const h100 = document.getElementById("h100")
const h50Cont = document.getElementById("h50Cont")
const h50 = document.getElementById("h50")
const h0Cont = document.getElementById("h0Cont")
const h0 = document.getElementById("h0")
const hSBCont = document.getElementById("hSBCont")
const hSB = document.getElementById("hSB")
const ppInGameCont = document.getElementById("ppInGameCont")
const ppMenuCont = document.getElementById("ppMenuCont")
const BpmCont = document.getElementById("BpmCont")
const bpm = document.getElementById("BPM")
const OD = document.getElementById("OD")
const AR = document.getElementById("AR")
const HP = document.getElementById("HP")
const CS = document.getElementById("CS")
const SR = document.getElementById("SR")
const title = document.getElementById("title")
const accInfo = document.getElementById("accInfo")
const diff = document.getElementById("diff")
const ratioCont = document.getElementById("ratioCont")
const ratio = document.getElementById("ratio")
const currentPP = document.getElementById("currentPP")
const modsUsed = document.getElementById("modsUsed")
const mapCont = document.getElementById("mapCont")
const simulatedPP = document.getElementById("simulatedPP")
const SSpp = document.getElementById("SSpp")

const cache = {
  count300: 0,
  h100: 0,
  h50: 0,
  h0: 0,
  hSB: 0,
  gameState: 0,
  modUsed: "NM",
  cs: 0,
  ar: 0,
  od: 0,
  sr: 0,
  hp: 0,
  star: 0,
  currentPP: 0,
  currentResultPP: 0,
  simulatedPP: 0,
  mapTitle: "",
  diffName: "",
  bpm: 0,
  modValue: 0,
  SSpp: 0,
  ratioNum: 0,
};

// receive message update from websocket

socket.api_v2(({performance, play, state, beatmap, directPath, resultsScreen}) => {
  if (cache.beatmapBackground != directPath.beatmapBackground) {
    cache.beatmapBackground = directPath.beatmapBackground
    const background_path = directPath.beatmapBackground.replace("\\", "/")
    mapCont.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("http://127.0.0.1:24050/files/beatmap/${background_path}")`
  }

  //fancy hitcount and also fetching the data for my own accuracy metrics
  if (cache.gameState != state.number){
    cache.gameState = state.number
  }
  if (cache.gameState === 2){
    accInfo.style.transform = `translateX(0)`
    
    if (cache.count300 != play.hits['300']){
      cache.count300 = play.hits['300']
    }
    if (cache.h100 != play.hits['100']){
      cache.h100 = play.hits['100']
      
      if (cache.h100 > 0){
        console.log(`Cache.h100: ${cache.h100}`)
        h100Cont.style.transform = `translateX(0px)`
      }
    }

    if (cache.h50 != play.hits['50']){
      cache.h50 = play.hits['50']

      if (cache.h50 > 0){
        console.log(`Cache.h50: ${cache.h50}`)
        h50Cont.style.transform = `translateX(0px)`
      }
    }

    if (cache.h0 != play.hits['0']){
      cache.h0 = play.hits['0']

      if (cache.h0 > 0){
        console.log(`Cache.h0: ${cache.h0}`)
        h0Cont.style.transform = `translateX(0px)`
      }
    }

    if (cache.hSB != play.hits['sliderBreaks']){
      cache.hSB = play.hits['sliderBreaks']

      if (cache.hSB > 0){
        console.log(`Cache.hSB: ${cache.hSB}`)
        hSBCont.style.transform = `translateX(0px)`
      }
    }
  } else {
    accInfo.style.transform = `translateX(-200px)`
    h100Cont.style.transform = `translateX(-200px)`
    h50Cont.style.transform = `translateX(-200px)`
    h0Cont.style.transform = `translateX(-200px)`
    hSBCont.style.transform = `translateX(-200px)`
  }


  if (cache.modUsed != play.mods.name) {
    cache.modUsed = play.mods.name
    if (play.mods.number === 2 || play.mods.name === ""){
      cache.modUsed = "NM"
    }
  }
  
  if (cache.cs != beatmap.stats.cs.converted){
    cache.cs = beatmap.stats.cs.converted
  }
  if (cache.hp != beatmap.stats.hp.converted){
    cache.hp = beatmap.stats.hp.converted
  }
  if (cache.od != beatmap.stats.od.converted){
    cache.od = beatmap.stats.od.converted
  }
  if (cache.ar != beatmap.stats.ar.converted){
    cache.ar = beatmap.stats.ar.converted
  }
  if (cache.sr != beatmap.stats.stars.total){
    cache.sr = beatmap.stats.stars.total
  }
  if (cache.bpm != beatmap.stats.bpm.realtime){
    cache.bpm = beatmap.stats.bpm.realtime
  }
  if (cache.mapTitle !== beatmap.title){
    cache.mapTitle = beatmap.title
  }
  if (cache.diffName != beatmap.version){
    cache.diffName = beatmap.version
  }
  if (cache.currentResultPP != resultsScreen.pp.current){
    cache.currentResultPP = resultsScreen.pp.current
  }
  if (cache.star != beatmap.stats.stars.total.toFixed(2)){
    cache.star = beatmap.stats.stars.total.toFixed(2)
  }
  if (cache.modValue != play.mods.number){
    cache.modValue = play.mods.number
  }
  if (cache.currentPP != play.pp.current){
    cache.currentPP = play.pp.current
  }
  if (cache.SSpp != performance.accuracy["100"]){
    cache.SSpp = performance.accuracy["100"]
  }
  OD.innerHTML = `OD: ${cache.od}`
  AR.innerHTML = `AR: ${cache.ar}`
  HP.innerHTML = `HP: ${cache.hp}`
  CS.innerHTML = `CS: ${cache.cs}`
  SR.innerHTML = `${cache.star}★`
  title.innerHTML = cache.mapTitle
  diff.innerHTML = cache.diffName
  bpm.innerHTML = `${cache.bpm}BPM`
  h100.innerHTML = cache.h100
  h50.innerHTML = cache.h50
  h0.innerHTML = cache.h0
  hSB.innerHTML = cache.hSB
  simulatedPP.innerHTML = `${cache.simulatedPP}pp`
  SSpp.innerHTML = `${cache.SSpp.toFixed(0)}pp`
  modsUsed.innerHTML = `Mods: ${cache.modUsed}`

  if (cache.gameState === 2){
    BpmCont.style.transform = `translateX(0px)`
    BpmCont.style.transform = `translateY(0)`
    bpm.style.transform = `translateX(0)`
    bpm.style.transform = `translateY(5px)`
    bpm.style.opacity = 1
  } else {
    bpm.style.transform = `translateX(200px)`
    bpm.style.opacity = 0
    BpmCont.style.transform = `translateX(200px)`
  }

  const ratioValue = ((cache.count300)*100)/((cache.count300)+(cache.h100)+(cache.h50)+(cache.h0))

  if (cache.ratioNum != ratioValue){
    cache.ratioNum = ratioValue.toFixed(2)
  }
  ratio.innerHTML = cache.ratioNum

  if (cache.gameState === 2 || cache.gameState === 7){
    ratioCont.style.opacity = 1
    ratioCont.style.transform = `none`;
  } else {
    ratioCont.style.opacity = 0
    ratioCont.style.transform = `translateX(50px)`
  }

  if (cache.gameState === 2){
    currentPP.innerHTML = cache.currentPP.toFixed(0)
  } else if (cache.gameState === 7){
    currentPP.innerHTML = cache.currentResultPP.toFixed(0)
  }

  
  //gameState = 2 aka playing
  if (cache.gameState === 2 ) {
    ppMenuCont.style.transform = `translateX(200px)`
    ppInGameCont.style.transform = `translateX(0)`;
    ppInGameCont.style.opacity = 1
    ppMenuCont.style.opacity = 0
    modsUsed.style.transform = `translateX(-200px)`
  }  else if (cache.gameState === 5 || cache.gameState === 12 || cache.gameState === 13){
    ppInGameCont.style.opacity = 0
    ppMenuCont.style.opacity = 1
    ppMenuCont.style.transform = `translateX(0px)`;
    modsUsed.style.transform = `translateX(0px)`
  } else if (cache.gameState === 7 || cache.gameState === 14){
    ppInGameCont.style.transform = `translateX(0)`;
    ppInGameCont.style.opacity = 1
    ppMenuCont.style.transform = `translateX(-200px)`;
    ppMenuCont.style.opacity = 0
    modsUsed.style.transform = `translateX(-200px)`
  } else if (cache.gameState === 1){
    ppInGameCont.style.transform = `translateX(200px)`;
    ppMenuCont.style.transform = `translateX(-200px)`;
    modsUsed.style.transform = `translateX(-200px)`
  }
  else {
    ppInGameCont.style.transform = `translateX(200px)`;
    ppMenuCont.style.transform = `translateX(-200px)`
    modsUsed.style.transform = `translateX(-200px)`
  }
  if (cache.gameState === 2){
    const passedObjects = (cache.count300)+(cache.h100)+(cache.h50)+(cache.h0)
    socket.calculate_pp({
      mode: 0,
      passedObjects: passedObjects,
      acc: 100,
      mods: cache.modValue,
    }).then(data => {
      if (cache.simulatedPP != data.pp && cache.gameState === 2){
        cache.simulatedPP = data.pp.toFixed(0)
      } else {cache.simulatedPP = 0}
    })
  } else if (cache.gameState === 7) {
    cache.simulatedPP = performance.accuracy['100'].toFixed(0)
  }
  
});