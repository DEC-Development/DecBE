export default class ExMusic {
    constructor(manager, id, time, trackPlayers) {
        this.isInDelayStop = false;
        this.soundId = id;
        let s = time.split(":");
        this.long = (parseInt(s[0]) * 60 + parseInt(s[1])) * 1000;
        this.manager = manager;
        trackPlayers = trackPlayers;
    }
    loop(dim, vec) {
        console.warn(`play ${this.soundId} at ${vec.x} ${vec.y} ${vec.z}`);
        if (this.isInDelayStop) {
            this.isInDelayStop = false;
        }
        else {
            if (!this.trackPlayers) {
                this.trackPlayers = [];
                for (let p of dim.getPlayers({
                    maxDistance: 64,
                    location: vec
                })) {
                    this.trackPlayers.push(p);
                    p.playMusic(this.soundId, {
                        "fade": 1,
                        "loop": true,
                        "volume": 0.5
                    });
                }
            }
        }
    }
    stop() {
        console.warn(`stop ${this.soundId}`);
        if (!this.trackPlayers)
            return;
        for (let p of this.trackPlayers) {
            p.stopMusic();
        }
    }
    delayStop(time) {
        this.isInDelayStop = true;
        this.manager.setTimeout(() => {
            if (this.isInDelayStop) {
                this.stop();
            }
            this.isInDelayStop = false;
        }, time);
    }
    play(dim, vec) {
        console.warn(`play ${this.soundId} at ${vec.x} ${vec.y} ${vec.z}`);
        if (!this.trackPlayers) {
            this.trackPlayers = [];
            for (let p of dim.getPlayers({
                maxDistance: 64,
                location: vec
            })) {
                this.trackPlayers.push(p);
                p.queueMusic(this.soundId, {
                    "fade": 1,
                    "loop": false,
                    "volume": 0.5
                });
            }
        }
    }
}
//# sourceMappingURL=ExMusic.js.map