import { browser } from '$app/environment';

class SoundManager {
    private sounds: { [key: string]: HTMLAudioElement } = {};

    constructor() {
        if (browser) {
            this.sounds = {
                complete: new Audio('/sounds/complete.wav'),
                click: new Audio('/sounds/click.wav'),
                reset: new Audio('/sounds/reset.wav')
            };

            // Preload sounds
            Object.values(this.sounds).forEach(audio => {
                audio.load();
            });
        }
    }

    play(soundName: 'complete' | 'click' | 'reset') {
        if (browser && this.sounds[soundName]) {
            const sound = this.sounds[soundName];
            sound.currentTime = 0; // Reset to start
            sound.play().catch(() => {
                // Ignore errors (e.g., if user hasn't interacted with page yet)
            });
        }
    }
}

export const soundManager = new SoundManager(); 