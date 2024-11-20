const tokens = ['mapArtistTitle', 'time', 'firstHitObjectTime', 'username', 'grade', 'simulatedPp', 'mapsetid','osu_mSSPP', 'gameMode', 'mania_m1_000_000PP', 'currentBpm','c300', 'c100', 'c50', 'sliderBreaks', 'miss']
const socket = CreateProxiedReconnectingWebSocket("ws://${window.overlay.config.host}:${window.overlay.config.port}/ws", tokens);
let accInfo = document.getElementById("accInfo");
let h100 = document.getElementById("h100");
let h50 = document.getElementById("h50");
let h0 = document.getElementById("h0");
let hSB = document.getElementById("hSB");
let pp = document.getElementById("pp");
let ppInGame = document.getElementById('ppInGame');
let ppFC = document.getElementById("ppFC");
let modsUsed = document.getElementById("modsUsed");
let grade = document.getElementById('grade');
let bpm = document.getElementById('BPM');
let player = document.getElementById('currentPlayer');
let ratio = document.getElementById('ratio');
let mapTitle = document.getElementById('title')
socket.onopen = () => {
    console.log("Successfully Connected");
};
socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};
socket.onerror = (error) => {
    console.log("Socket Error: ", error);
};

socket.onmessage = (event) => {
    let data = event.data;

    //map info
    title.innerHTML = data.tokens.mapArtistTitle
    diff.innerHTML = data.menu.bm.metadata.difficulty
    let width = 1920,
    height = 1080;
    data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27");
    mapCont.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${window.overlay.config.getUrl()}/backgroundImage?width=${width}&height=${height}&mapset=${data.tokens.mapsetid}&dummyData=${encodeURIComponent(data.tokens.md5)}&crop=1')`;


    //map stat
    OD.innerHTML = `OD: ${data.menu.bm.stats.OD}`
    AR.innerHTML = `AR: ${data.menu.bm.stats.AR}`
    HP.innerHTML = `HP: ${data.menu.bm.stats.HP}`
    CS.innerHTML = `CS: ${data.menu.bm.stats.CS}`
    SR.innerHTML = `★ ${data.menu.bm.stats.fullSR.toFixed(2)}`

    //BPM info
    bpm.innerHTML = `${data.tokens.currentBpm}bpm`
    if (data.menu.state === 2){
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

    //ingame hit counter
    h100.innerHTML = data.gameplay.hits[100]
    h50.innerHTML = data.gameplay.hits[50]
    h0.innerHTML = data.gameplay.hits[0]
    hSB.innerHTML = data.gameplay.hits.sliderBreaks

    const hit300 = data.tokens.c300
    const hit100 = data.tokens.c100
    const hit50 = data.tokens.c50
    const hit0 = data.tokens.miss
    const sb = data.tokens.sliderBreaks
    
    //Ratio
    const playratio = ((hit300*100)/(hit300 + hit100 + hit50 + hit0)).toFixed(2)

    ratio.innerHTML = (playratio)

    if (data.menu.state === 2 || data.menu.state === 7){
        ratioCont.style.opacity = 1
        ratioCont.style.transform = `none`;
    } else {
        ratioCont.style.opacity = 0
        ratioCont.style.transform = `translateX(50px)`
    }

    //fancy accInfo moment
    if (data.menu.state === 2){
        accInfo.style.transform = `translateX(0)`
        if (hit100 > 0){
            h100Cont.style.transform = `translateX(0)`

        } else if (hit100 === 0) {h100Cont.style.transform = `translateX(-200px)`}

        if (hit50 > 0){
            h50Cont.style.transform = `translateX(0)`
        } else {h50Cont.style.transform = `translateX(-200px)`}

        if (hit0 > 0){
            h0Cont.style.transform = `translateX(0)`
        } else if (hit0 === 0) {h0Cont.style.transform = `translateX(-200px)`}

        if (sb > 0){
            hSBCont.style.transform = `translateX(0)`
        } else if (sb === 0) {hSBCont.style.transform = `translateX(-200px)`}

    } else {accInfo.style.transform = `translateX(-200px)`
        ppInGameCont.style.transform = `translateX(200px)`
    }
    
    //pepepepepepepe
    pp.innerHTML = data.gameplay.pp.current
    ppFC.innerHTML = data.tokens.simulatedPp

    //checking current game mode, whether is mania or osu! standard
    let currentGameMode = data.tokens.gameMode
    if (currentGameMode === "Osu"){
        ppInGame.innerHTML = data.tokens.osu_mSSPP.toFixed(0)
    } else if (currentGameMode === "OsuMania"){
        ppInGame.innerHTML = data.tokens.mania_m1_000_000PP.toFixed(0)
    }

    //mod
    modsUsed.innerHTML = `Mods: ${data.menu.mods.str}`

    //osu! state
    if (data.menu.state === 2) {
        ppCont.style.transform = `translateX(0)`;
        ppCont.style.opacity = 1
        ppInGameCont.style.opacity = 0
        modsUsed.style.transform = `translateX(-200px)`
    }  else if (data.menu.state === 5 || data.menu.state === 12 || data.menu.state === 13){
        ppCont.style.opacity = 0
        ppInGameCont.style.opacity = 1
        ppInGameCont.style.transform = `translateX(0px)`;
        modsUsed.style.transform = `translateX(0px)`
    } else if (data.menu.state === 7 || data.menu.state === 14){
        ppCont.style.transform = `translateX(0)`;
        ppCont.style.opacity = 1
        ppInGameCont.style.transform = `translateX(-200px)`;
        ppInGameCont.style.opacity = 0
        modsUsed.style.transform = `translateX(-200px)`
    } else if (data.menu.state === 1){
        ppCont.style.transform = `translateX(200px)`;
        ppInGameCont.style.transform = `translateX(-200px)`;
        modsUsed.style.transform = `translateX(-200px)`
    }
    else {
        ppCont.style.transform = `translateX(200px)`;
        ppInGameCont.style.transform = `translateX(-200px)`
        modsUsed.style.transform = `translateX(-200px)`
    }

    //mod panel
    if (data.menu.mods.str === "" || "NM" && data.menu.state === 2){
        modsUsed.style.opacity = 1
    }
    else {
        modsUsed.style.opacity = 1
    }
    
    //grade ranking
    if (data.menu.state === 2){
        grade.style.opacity = 1
    } else{
        grade.style.opacity = 0
    }
}