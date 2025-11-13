// 사운드 효과 관리 클래스
class GameSounds {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // 주사위 굴리는 소리
    playDiceRoll() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(100, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    // 주사위 결과 표시 소리 (띠링!)
    playDiceResult() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    // 컵 선택 소리 (뿅!)
    playCupSelect() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    // 컵 선택 취소 소리 (뿡!)
    playCupRemove() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    // 물 붓는 소리 (촤르르~)
    playWaterPour() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // 백색 소음 생성
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
        
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.5);
    }

    // 버튼 클릭 소리
    playButtonClick() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    // 어림 정답 확인 소리 (삐비빅!)
    playCheckAnswer() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const times = [0, 0.1, 0.2];
        const frequencies = [600, 700, 800];
        
        times.forEach((time, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequencies[index], ctx.currentTime + time);
            
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime + time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.1);
            
            oscillator.start(ctx.currentTime + time);
            oscillator.stop(ctx.currentTime + time + 0.1);
        });
    }

    // 승리 팡파레 (따라라라란!)
    playVictoryFanfare() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const melody = [
            { freq: 523, time: 0 },      // C
            { freq: 659, time: 0.15 },   // E
            { freq: 784, time: 0.3 },    // G
            { freq: 1047, time: 0.45 }   // C
        ];
        
        melody.forEach(note => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
            
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.3);
            
            oscillator.start(ctx.currentTime + note.time);
            oscillator.stop(ctx.currentTime + note.time + 0.3);
        });
    }

    // 무승부 소리 (따라란~)
    playDrawSound() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const melody = [
            { freq: 523, time: 0 },      // C
            { freq: 659, time: 0.15 },   // E
            { freq: 523, time: 0.3 }     // C
        ];
        
        melody.forEach(note => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
            
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.3);
            
            oscillator.start(ctx.currentTime + note.time);
            oscillator.stop(ctx.currentTime + note.time + 0.3);
        });
    }

    // 에러 소리 (빠빠!)
    playError() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }

    // 게임 시작 소리 (띠링~)
    playGameStart() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    // 턴 전환 소리
    playTurnChange() {
        if (!this.enabled) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(700, ctx.currentTime);
        oscillator.frequency.setValueAtTime(900, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }

    // 사운드 활성화/비활성화 토글
    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // 사운드 활성화 상태 확인
    isEnabled() {
        return this.enabled;
    }
}

// 전역 사운드 인스턴스
const gameSounds = new GameSounds();
