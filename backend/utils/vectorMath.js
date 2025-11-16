/**
 * VECTOR MATHEMATICS UTILITIES
 * Location: backend/utils/vectorMath.js
 * 
 * Provides mathematical functions for iris embedding comparison:
 * - Cosine similarity calculation
 * - Euclidean distance calculation
 * - Vector normalization
 * - Embedding validation
 */

/**
 * Calculate cosine similarity between two vectors
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 * 
 * @param {Array} vectorA - First embedding vector
 * @param {Array} vectorB - Second embedding vector
 * @returns {number} - Cosine similarity score
 */
const cosineSimilarity = (vectorA, vectorB) => {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    throw new Error('Vectors must be of equal length');
  }

  // Calculate dot product (A · B)
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  // Calculate magnitudes ||A|| and ||B||
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Calculate Euclidean distance between two vectors
 * Lower distance = more similar
 * 
 * @param {Array} vectorA - First embedding vector
 * @param {Array} vectorB - Second embedding vector
 * @returns {number} - Euclidean distance
 */
const euclideanDistance = (vectorA, vectorB) => {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    throw new Error('Vectors must be of equal length');
  }

  let sumSquaredDiff = 0;

  for (let i = 0; i < vectorA.length; i++) {
    const diff = vectorA[i] - vectorB[i];
    sumSquaredDiff += diff * diff;
  }

  return Math.sqrt(sumSquaredDiff);
};

/**
 * Normalize a vector to unit length
 * 
 * @param {Array} vector - Input vector
 * @returns {Array} - Normalized vector
 */
const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude === 0) {
    return vector;
  }

  return vector.map(val => val / magnitude);
};

/**
 * Validate iris embedding format
 * 
 * @param {Array} embedding - Iris embedding to validate
 * @returns {Object} - { valid: boolean, message: string }
 */
const validateEmbedding = (embedding) => {
  if (!embedding) {
    return { valid: false, message: 'Embedding is required' };
  }

  if (!Array.isArray(embedding)) {
    return { valid: false, message: 'Embedding must be an array' };
  }

  if (embedding.length !== 128) {
    return { 
      valid: false, 
      message: `Embedding must be exactly 128 dimensions, got ${embedding.length}` 
    };
  }

  // Check if all values are numbers
  const allNumbers = embedding.every(val => typeof val === 'number' && !isNaN(val));
  if (!allNumbers) {
    return { valid: false, message: 'All embedding values must be valid numbers' };
  }

  // Check if embedding is not all zeros
  const allZeros = embedding.every(val => val === 0);
  if (allZeros) {
    return { valid: false, message: 'Embedding cannot be all zeros' };
  }

  return { valid: true, message: 'Valid embedding' };
};

/**
 * Calculate similarity percentage from cosine similarity
 * 
 * @param {number} cosineSim - Cosine similarity value (-1 to 1)
 * @returns {number} - Similarity percentage (0 to 100)
 */
const toSimilarityPercentage = (cosineSim) => {
  // Convert from [-1, 1] to [0, 100]
  return ((cosineSim + 1) / 2) * 100;
};

/**
 * Compare two embeddings using multiple metrics
 * 
 * @param {Array} embeddingA - First embedding
 * @param {Array} embeddingB - Second embedding
 * @returns {Object} - Comparison results with multiple metrics
 */
const compareEmbeddings = (embeddingA, embeddingB) => {
  const cosine = cosineSimilarity(embeddingA, embeddingB);
  const euclidean = euclideanDistance(embeddingA, embeddingB);
  const percentage = toSimilarityPercentage(cosine);

  return {
    cosineSimilarity: cosine,
    euclideanDistance: euclidean,
    similarityPercentage: percentage,
    isMatch: cosine >= 0.80 // 80% threshold
  };
};

module.exports = {
  cosineSimilarity,
  euclideanDistance,
  normalizeVector,
  validateEmbedding,
  toSimilarityPercentage,
  compareEmbeddings
};
