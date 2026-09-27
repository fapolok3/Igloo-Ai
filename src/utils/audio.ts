// Sound Effects completely disabled per app requirement (App a kono sound thakbe na)
class SoundEffects {
  public enabled: boolean = false;

  constructor() {
    this.enabled = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('igloo_sound_enabled', 'false');
    }
  }

  public toggleSound(_val?: boolean): boolean {
    this.enabled = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('igloo_sound_enabled', 'false');
    }
    return false;
  }

  public playTap() {
    // Pure silence - no audio produced
  }

  public playPop() {
    // Pure silence - no audio produced
  }

  public playSuccess() {
    // Pure silence - no audio produced
  }

  public playError() {
    // Pure silence - no audio produced
  }
}

export const sounds = new SoundEffects();

