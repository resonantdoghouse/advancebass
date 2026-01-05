export class BPMDetector {
    private sampleRate: number;
    private bufferSize: number;
    private energyHistory: { time: number; energy: number }[] = [];
    private readonly historyDuration = 3.0; // Seconds of history to keep
    private lastDetectionTime = 0;
    private detectedBPM = 0;
  
    constructor(sampleRate: number) {
      this.sampleRate = sampleRate;
      this.bufferSize = 4096; // Assumed standard buffer size passed in
    }
  
    /**
     * Process a new audio buffer and return the estimated BPM.
     * Returns 0 or last known BPM if confidence is low or insufficient data.
     */
    process(buffer: Float32Array): number {
      const now = Date.now() / 1000;
  
      // 1. Calculate RMS Energy of this buffer
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
      }
      const rms = Math.sqrt(sum / buffer.length);
  
      // 2. Add to history
      this.energyHistory.push({ time: now, energy: rms });
  
      // 3. Prune history
      const cutoff = now - this.historyDuration;
      while (this.energyHistory.length > 0 && this.energyHistory[0].time < cutoff) {
        this.energyHistory.shift();
      }
  
      // Need enough history to detect
      if (this.energyHistory.length < 10) return this.detectedBPM;
      
      // Don't re-calculate too often (e.g., only every 500ms)
      if (now - this.lastDetectionTime < 0.5) {
          return this.detectedBPM;
      }
      this.lastDetectionTime = now;
  
      // 4. Detect Peaks
      // Simple algorithm: Find local maxima in energy history
      const peaks: { time: number; energy: number }[] = [];
      const threshold = this.calculateDynamicThreshold();
  
      for (let i = 1; i < this.energyHistory.length - 1; i++) {
        const prev = this.energyHistory[i - 1];
        const curr = this.energyHistory[i];
        const next = this.energyHistory[i + 1];
  
        if (curr.energy > threshold && curr.energy > prev.energy && curr.energy > next.energy) {
          // Simple local max
          peaks.push(curr);
        }
      }
  
      // 5. Calculate Intervals
      if (peaks.length < 2) return 0;
  
      const intervals: number[] = [];
      for (let i = 1; i < peaks.length; i++) {
        const delta = peaks[i].time - peaks[i - 1].time;
        // Filter unrealistic intervals (BPM 40-220 => interval 0.27s - 1.5s)
        if (delta > 0.25 && delta < 1.5) {
            intervals.push(delta);
        }
      }
  
      if (intervals.length === 0) return 0;
  
      // 6. Find most common interval (Histogram-like approach)
      // Group intervals by similarity (e.g. +/- 10%)
      const clusters: { sum: number; count: number }[] = [];
      
      intervals.forEach(interval => {
         let foundFn = false;
         for(const cluster of clusters) {
             const avg = cluster.sum / cluster.count;
             if (Math.abs(interval - avg) / avg < 0.15) { // 15% tolerance
                 cluster.sum += interval;
                 cluster.count++;
                 foundFn = true;
                 break;
             }
         }
         if (!foundFn) {
             clusters.push({ sum: interval, count: 1 });
         }
      });
  
      // Find best cluster
      let bestCluster = null;
      let maxCount = 0;
  
      for(const cluster of clusters) {
          if (cluster.count > maxCount) {
              maxCount = cluster.count;
              bestCluster = cluster;
          }
      }
  
      if (bestCluster && maxCount >= 2) {
          const avgInterval = bestCluster.sum / bestCluster.count;
          const bpm = 60 / avgInterval;
          this.detectedBPM = Math.round(bpm);
      }
  
      // If we didn't find a strong cluster, maybe keep the old one or return 0
      // For now, let's reset if it fades out? Or just hold.
      // Holding is better for UX.
  
      return this.detectedBPM;
    }
  
    private calculateDynamicThreshold(): number {
      // Average energy of history * multiplier
      if (this.energyHistory.length === 0) return 0.05;
      
      let sum = 0;
      let max = 0;
      for (const h of this.energyHistory) {
          sum += h.energy;
          if (h.energy > max) max = h.energy;
      }
      const avg = sum / this.energyHistory.length;
      
      // Reduce threshold sensitivity: 
      // Was 1.3, let's try 1.15 to catch more beats in softer music
      // But keep absolute min higher (0.05) to avoid noise
      return Math.max(0.04, avg * 1.15);
    }
}
