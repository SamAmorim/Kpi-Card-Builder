
// Public domain / Creative Commons sounds suitable for UI/Sci-fi
const SOUNDS: Record<string, string> = {
    // Soft, modern glass tap
    'click': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
    // Subtle air swish
    'hover': 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', 
    // Cinematic Whoosh
    'whoosh': 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', 
    // Deep Bass Impact (Cleaner)
    'impact': 'https://assets.mixkit.co/active_storage/sfx/218/218-preview.mp3', 
    // Ethereal Space Drone
    'ambience': 'https://assets.mixkit.co/active_storage/sfx/996/996-preview.mp3' 
};

export class SoundManager {
    private audioCache: Record<string, HTMLAudioElement> = {};

    constructor() {
        // Preload sounds
        Object.keys(SOUNDS).forEach(key => {
            const audio = new Audio(SOUNDS[key]);
            audio.volume = 1.0; // Max volume
            this.audioCache[key] = audio;
        });
    }

    play(name: string) {
        const audio = this.audioCache[name];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio autoplay blocked", e));
        }
    }

    playLoop(name: string) {
        const audio = this.audioCache[name];
        if (audio) {
            audio.loop = true;
            audio.play().catch(e => console.log("Audio autoplay blocked", e));
        }
    }

    stopAll() {
        Object.values(this.audioCache).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}
