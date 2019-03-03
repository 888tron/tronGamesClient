class SoundManager {
    constructor(isEnable = true) {
        this.sounds = [];
        this.isEnable = isEnable;
    }

    createSoundPlay(file, loop = false) {
        const sound = this.createSound(file, loop);
        sound.play();

        return sound;
    }

    createSound(file, loop = false) {
        const sound = new Audio(file);

        if (loop) {
            sound.addEventListener('ended', function () {
                sound.currentTime = 0;
                sound.play();
            }, false);
        } else {
            sound.addEventListener('ended', () => {
                this.sounds = this.sounds.filter(s => s !== sound);
            }, false);
        }

        this.sounds.push(sound);
        sound.muted = !this.isEnable;
        return sound;
    }

    setEnable(value) {
        this.isEnable = value;

        this.sounds.forEach(sound => sound.muted = !value);
    }
}