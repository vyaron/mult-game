function onShowSettings() {
    const elModal = document.querySelector('dialog.settings')
    elModal.showModal()
}

function onCloseSettings() {
    const elModal = document.querySelector('dialog.settings')
    elModal.close()
}

function onSelectLevel(val) {
    gSize = val
    gSolved = []
    onInit()
}

function onMute(type) {
    if (type === 'bg') {
        gIsBgMuted = !gIsBgMuted
        localStorage.isBgMuted = gIsBgMuted
    } else {
        gIsActionMuted = !gIsActionMuted
        localStorage.isActionMuted = gIsActionMuted
    }

    setAudioPreferences()
    renderMuteBtns()

    if (!gAudioBg) return
    if (gIsBgMuted) gAudioBg.pause()
    else if (gIsStarted) gAudioBg.play()
}