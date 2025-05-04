import * as tf from '@tensorflow/tfjs';

// This is a simplified LSTM model for stock prediction
// In a real application, you would train this model on historical data
export class StockPredictor {
  private model: tf.LayersModel | null = null;
  private isModelLoaded: boolean = false;
  private meanStd: { mean: number[]; std: number[] } | null = null;

  constructor() {
    this.initModel();
  }

  // Initialize and create the model
  async initModel() {
    try {
      // Create a sequential model
      const model = tf.sequential();
      
      // Add LSTM layer
      model.add(tf.layers.lstm({
        units: 50,
        returnSequences: false,
        inputShape: [10, 5], // 10 time steps, 5 features (open, high, low, close, volume)
      }));
      
      // Add Dense output layer
      model.add(tf.layers.dense({ units: 1 }));
      
      // Compile the model
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
      });
      
      this.model = model;
      this.isModelLoaded = true;
      
      // Default mean and std for normalization
      this.meanStd = {
        mean: [150, 155, 145, 150, 1000000],
        std: [50, 50, 50, 50, 5000000],
      };
      
      console.log('Stock prediction model initialized');
    } catch (error) {
      console.error('Error initializing model:', error);
    }
  }

  // Preprocess data for the model
  private preprocessData(data: number[][]) {
    if (!this.meanStd) return null;
    
    // Normalize data
    return data.map(row => 
      row.map((val, i) => (val - this.meanStd!.mean[i]) / this.meanStd!.std[i])
    );
  }

  // Make a prediction
  async predict(historicalData: number[][]): Promise<number> {
    if (!this.isModelLoaded || !this.model) {
      console.error('Model not loaded');
      return 0;
    }
    
    try {
      // Preprocess data
      const processedData = this.preprocessData(historicalData);
      if (!processedData) return 0;
      
      // Convert to tensor
      const inputTensor = tf.tensor3d([processedData], [1, 10, 5]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const predictionValue = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
      
      // Denormalize prediction
      const denormalizedPrediction = 
        this.meanStd ? predictionValue[0] * this.meanStd.std[3] + this.meanStd.mean[3] : predictionValue[0];
      
      return denormalizedPrediction;
    } catch (error) {
      console.error('Error making prediction:', error);
      return 0;
    }
  }

  // Generate mock prediction data for development
  mockPredict(symbol: string): { prediction: number; confidence: number } {
    // Generate a random prediction based on the symbol
    // In a real app, this would use the actual model
    const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seedValue = hash / 1000;
    
    // Generate a random prediction between -5% and +5%
    const predictionPercent = (Math.sin(seedValue) * 10) - 5;
    
    // Generate a confidence between 60% and 95%
    const confidence = 60 + (Math.abs(Math.cos(seedValue)) * 35);
    
    return {
      prediction: predictionPercent,
      confidence: parseFloat(confidence.toFixed(1)),
    };
  }
}
