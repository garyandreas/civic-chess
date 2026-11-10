/**
 * Mesin Efek Suara (SFX) & Musik Latar Santai (Ambient Lo-Fi BGM) untuk Civic Chess.
 * Dibangun murni dengan Web Audio API (0 MB file eksternal, bebas buffering, instan).
 */

class ChessAudioEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private bgmEnabled = true;
  private bgmTimer: ReturnType<typeof setInterval> | null = null;
  private bgmStep = 0;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.stopBgm();
    }
  }

  /** Helper memainkan 1 nada dengan envelope halus */
  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = "sine",
    peakGain = 0.15,
    endFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, endFreq),
        startTime + duration
      );
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  /** Helper noise pendek untuk efek ketukan kayu bidak catur */
  private playWoodBurst(startTime: number, duration: number, filterFreq: number, peakGain: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(filterFreq, startTime);
    filter.Q.setValueAtTime(3.5, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peakGain, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  /** 1. Suara langkah bidak biasa (ketukan kayu lembut) */
  public playMove() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playWoodBurst(now, 0.065, 520, 0.28);
    this.playTone(185, now, 0.06, "triangle", 0.16, 110);
  }

  /** 2. Suara makan bidak (ketukan ganda yang lebih tegas) */
  public playCapture() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playWoodBurst(now, 0.09, 780, 0.42);
    this.playTone(260, now, 0.08, "triangle", 0.22, 95);
    this.playTone(140, now + 0.02, 0.09, "sine", 0.2, 70);
  }

  /** 3. Suara soal muncul (chime dua nada lembut) */
  public playQuestionAppear() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playTone(587.33, now, 0.16, "sine", 0.14); // D5
    this.playTone(880.0, now + 0.11, 0.28, "triangle", 0.16); // A5
  }

  /** 4. Suara jawaban benar (akor mayor naik cerah) */
  public playAnswerCorrect() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playTone(523.25, now, 0.14, "triangle", 0.15); // C5
    this.playTone(659.25, now + 0.09, 0.16, "triangle", 0.15); // E5
    this.playTone(783.99, now + 0.18, 0.28, "triangle", 0.17); // G5
  }

  /** 5. Suara jawaban salah (buzzer rendah lembut) */
  public playAnswerWrong() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playTone(240, now, 0.18, "sawtooth", 0.09, 200);
    this.playTone(180, now + 0.15, 0.28, "sawtooth", 0.1, 135);
  }

  /** 6. Suara langkah terbaik / Best Move (kilau arpeggio tinggi) */
  public playBestMove() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5 - F#5 - A5 - D6
    notes.forEach((f, idx) => {
      this.playTone(f, now + idx * 0.065, 0.24, "sine", 0.13);
    });
  }

  /** 7. Suara langkah blunder otomatis (slide turun komikal) */
  public playBlunder() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playTone(392.0, now, 0.2, "triangle", 0.16, 277.18); // G4 -> C#4
    this.playTone(261.63, now + 0.19, 0.36, "triangle", 0.18, 146.83); // C4 -> D3
  }

  /** 8. Suara Skak / Check (peringatan tegas) */
  public playCheck() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playTone(880, now, 0.11, "square", 0.08);
    this.playTone(1046.5, now + 0.09, 0.22, "triangle", 0.15);
  }

  /** 9. Suara Skakmat (dentuman akor dramatis) */
  public playCheckmate() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.playWoodBurst(now, 0.12, 650, 0.45);
    this.playTone(220, now, 0.45, "triangle", 0.2);
    this.playTone(440, now + 0.04, 0.45, "triangle", 0.16);
    this.playTone(659.25, now + 0.08, 0.55, "sine", 0.16);
  }

  /** 10. Suara Game Menang (fanfare kemenangan) */
  public playGameWin() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.0, d: 0.14 }, // C5
      { f: 659.25, t: 0.13, d: 0.14 }, // E5
      { f: 783.99, t: 0.26, d: 0.14 }, // G5
      { f: 1046.5, t: 0.4, d: 0.55 }, // C6
    ];
    melody.forEach((n) => {
      this.playTone(n.f, now + n.t, n.d, "triangle", 0.17);
    });
    this.playTone(523.25, now + 0.4, 0.55, "sine", 0.11);
  }

  /** 11. Suara Game Kalah (melodi minor turun) */
  public playGameLose() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const melody = [
      { f: 440.0, t: 0.0, d: 0.2 }, // A4
      { f: 392.0, t: 0.2, d: 0.2 }, // G4
      { f: 349.23, t: 0.4, d: 0.22 }, // F4
      { f: 329.63, t: 0.62, d: 0.5 }, // E4
    ];
    melody.forEach((n) => {
      this.playTone(n.f, now + n.t, n.d, "triangle", 0.14);
    });
  }

  /**
   * 12. Musik Pengiring Santai (Ambient Lo-Fi Rhodes Chords)
   * Progresi akor hangat yang berputar pelan selama permainan berlangsung.
   */
  public startBgm() {
    if (!this.bgmEnabled || this.bgmTimer) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Progresi akor santai: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    const chords: number[][] = [
      [174.61, 261.63, 329.63, 440.0], // Fmaj7
      [164.81, 246.94, 293.66, 392.0], // Em7
      [146.83, 220.0, 261.63, 349.23], // Dm7
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
    ];
    const gentleMelody = [523.25, 659.25, 587.33, 493.88, 523.25, 440.0, 392.0, 329.63];

    const playStep = () => {
      if (!this.bgmEnabled) return;
      const c = this.getContext();
      if (!c) return;
      const now = c.currentTime;
      const chord = chords[this.bgmStep % chords.length];

      // Bunyikan akor lembut seperti piano elektrik hangat
      chord.forEach((freq, i) => {
        this.playTone(freq, now + i * 0.06, 2.2, "sine", 0.022);
      });

      // Nada melodi tipis di atas akor
      const melNote = gentleMelody[this.bgmStep % gentleMelody.length];
      this.playTone(melNote, now + 0.9, 1.1, "sine", 0.018);

      this.bgmStep += 1;
    };

    playStep();
    this.bgmTimer = setInterval(playStep, 2400);
  }

  public stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const chessAudio = new ChessAudioEngine();
