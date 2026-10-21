export async function startRainAmbience(): Promise<() => void> {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) {
    throw new Error("Ambient audio is not supported by this browser.");
  }

  const context = new AudioContextConstructor();
  const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const channel = noiseBuffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const highPass = context.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 140;

  const lowPass = context.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.value = 950;

  const rainVolume = context.createGain();
  rainVolume.gain.value = 0.12;
  noise.connect(highPass);
  highPass.connect(lowPass);
  lowPass.connect(rainVolume);
  rainVolume.connect(context.destination);
  noise.start();
  await context.resume();

  const dropInterval = window.setInterval(() => {
    const drop = context.createOscillator();
    const dropVolume = context.createGain();
    const now = context.currentTime;
    drop.type = "sine";
    drop.frequency.setValueAtTime(1100 + Math.random() * 1200, now);
    drop.frequency.exponentialRampToValueAtTime(450 + Math.random() * 300, now + 0.09);
    dropVolume.gain.setValueAtTime(0.0001, now);
    dropVolume.gain.exponentialRampToValueAtTime(0.025, now + 0.012);
    dropVolume.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    drop.connect(dropVolume);
    dropVolume.connect(context.destination);
    drop.start(now);
    drop.stop(now + 0.13);
  }, 280 + Math.random() * 260);

  return () => {
    window.clearInterval(dropInterval);
    noise.stop();
    void context.close();
  };
}
