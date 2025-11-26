
let audioCtx: AudioContext | null = null;

const getContext = () => {
    if (!audioCtx) {
        // @ts-ignore - Handle Safari's webkitAudioContext if necessary, though standard AudioContext is widely supported now
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    return audioCtx;
};

export const initAudio = () => {
    const ctx = getContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch((err) => console.warn('Audio resume failed', err));
    }
};

export const playSound = (type: 'start' | 'go' | 'timesUp' | 'reveal' | 'click' | 'tick' | 'finish') => {
    const ctx = getContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch (type) {
        case 'start': // Ascending major arpeggio
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now); // A4
            osc.frequency.setValueAtTime(554.37, now + 0.15); // C#5
            osc.frequency.setValueAtTime(659.25, now + 0.3); // E5
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            osc.start(now);
            osc.stop(now + 1.0);
            break;
            
        case 'go': // Rising tone indicating start
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
            
        case 'timesUp': // Descending alarm
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.4);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
            break;
            
        case 'reveal': // Shimmering reveal
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(1200, now + 0.2);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
            
        case 'click': // Soft pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
            
        case 'tick': // Woodblock tick
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, now);
            gainNode.gain.setValueAtTime(0.02, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;
            
        case 'finish': // Victory fanfare
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            osc.start(now);
            osc.stop(now + 2.0);
            break;
    }
};
