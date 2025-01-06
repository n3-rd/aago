import { getAssetUrl } from '$lib/utils/tauri';
import { browser } from '$app/environment';

class SoundManager {
    private sounds: { [key: string]: HTMLAudioElement } = {};
    private initialized = false;
    private audioContext: AudioContext | null = null;
    private buffers: { [key: string]: AudioBuffer } = {};

    constructor() {
        if (browser) {
            this.initSounds();
        }
    }

    private async initSounds() {
        if (this.initialized || !browser) return;

        try {
            this.audioContext = new AudioContext();
            
            const soundFiles = {
                click: await getAssetUrl('click.wav'),
                complete: await getAssetUrl('complete.wav'),
                reset: await getAssetUrl('reset.wav')
            };

            // Load and decode all sounds in parallel
            await Promise.all(
                Object.entries(soundFiles).map(async ([name, url]) => {
                    const response = await fetch(url);
                    const arrayBuffer = await response.arrayBuffer();
                    this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
                })
            );

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize sounds:', error);
        }
    }

    async play(soundName: 'click' | 'complete' | 'reset') {
        if (!browser || !this.audioContext) return;
        
        try {
            if (!this.initialized) {
                await this.initSounds();
            }

            const buffer = this.buffers[soundName];
            if (buffer && this.audioContext) {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext.destination);
                source.start(0);
            }
        } catch (error) {
            console.error(`Failed to play sound ${soundName}:`, error);
        }
    }
}

export const soundManager = new SoundManager(); 