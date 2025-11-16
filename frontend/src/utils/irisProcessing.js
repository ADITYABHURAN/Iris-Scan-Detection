/**
 * IRIS EMBEDDING EXTRACTION UTILITY
 * Location: frontend/src/utils/irisProcessing.js
 * 
 * This file contains functions to:
 * - Extract iris landmarks from face mesh
 * - Calculate iris features (distances, angles, ratios)
 * - Generate a unique embedding vector for each iris
 */

/**
 * Extract iris embedding from face keypoints
 * @param {Array} keypoints - All face landmark keypoints from MediaPipe
 * @returns {Array} - Iris embedding vector (128-dimensional)
 */
export const extractIrisEmbedding = (keypoints) => {
  // Iris landmark indices in MediaPipe FaceMesh
  // Left iris: 468-472 (5 points)
  // Right iris: 473-477 (5 points)
  const leftIrisIndices = [468, 469, 470, 471, 472];
  const rightIrisIndices = [473, 474, 475, 476, 477];

  // Additional eye region landmarks for context
  const leftEyeIndices = [33, 160, 158, 133, 153, 144];
  const rightEyeIndices = [362, 385, 387, 263, 373, 380];

  const embedding = [];

  // 1. Extract raw iris coordinates (normalized)
  const leftIrisPoints = leftIrisIndices.map(idx => keypoints[idx]);
  const rightIrisPoints = rightIrisIndices.map(idx => keypoints[idx]);

  // Add normalized coordinates (10 features for left, 10 for right = 20 features)
  leftIrisPoints.forEach(point => {
    if (point) {
      embedding.push(point.x / 640); // Normalize by typical video width
      embedding.push(point.y / 480); // Normalize by typical video height
    }
  });

  rightIrisPoints.forEach(point => {
    if (point) {
      embedding.push(point.x / 640);
      embedding.push(point.y / 480);
    }
  });

  // 2. Calculate iris center positions
  const leftIrisCenter = calculateCenter(leftIrisPoints);
  const rightIrisCenter = calculateCenter(rightIrisPoints);

  embedding.push(leftIrisCenter.x / 640);
  embedding.push(leftIrisCenter.y / 480);
  embedding.push(rightIrisCenter.x / 640);
  embedding.push(rightIrisCenter.y / 480);
  // Total so far: 20 + 4 = 24 features

  // 3. Calculate iris diameters (approximate size)
  const leftIrisDiameter = calculateDiameter(leftIrisPoints);
  const rightIrisDiameter = calculateDiameter(rightIrisPoints);

  embedding.push(leftIrisDiameter);
  embedding.push(rightIrisDiameter);
  // Total: 26 features

  // 4. Calculate distances between iris points
  const leftDistances = calculateAllDistances(leftIrisPoints);
  const rightDistances = calculateAllDistances(rightIrisPoints);

  embedding.push(...leftDistances); // 10 distances for left
  embedding.push(...rightDistances); // 10 distances for right
  // Total: 26 + 20 = 46 features

  // 5. Calculate eye region features for additional context
  const leftEyePoints = leftEyeIndices.map(idx => keypoints[idx]);
  const rightEyePoints = rightEyeIndices.map(idx => keypoints[idx]);

  const leftEyeCenter = calculateCenter(leftEyePoints);
  const rightEyeCenter = calculateCenter(rightEyePoints);

  embedding.push(leftEyeCenter.x / 640);
  embedding.push(leftEyeCenter.y / 480);
  embedding.push(rightEyeCenter.x / 640);
  embedding.push(rightEyeCenter.y / 480);
  // Total: 50 features

  // 6. Calculate relative positions (iris within eye)
  const leftRelativeX = (leftIrisCenter.x - leftEyeCenter.x) / 640;
  const leftRelativeY = (leftIrisCenter.y - leftEyeCenter.y) / 480;
  const rightRelativeX = (rightIrisCenter.x - rightEyeCenter.x) / 640;
  const rightRelativeY = (rightIrisCenter.y - rightEyeCenter.y) / 480;

  embedding.push(leftRelativeX, leftRelativeY, rightRelativeX, rightRelativeY);
  // Total: 54 features

  // 7. Calculate inter-ocular distance (distance between eyes)
  const interOcularDistance = calculateDistance(leftIrisCenter, rightIrisCenter);
  embedding.push(interOcularDistance / 640);
  // Total: 55 features

  // 8. Calculate aspect ratios and angles
  const leftEyeWidth = calculateDistance(leftEyePoints[0], leftEyePoints[3]);
  const leftEyeHeight = calculateDistance(leftEyePoints[1], leftEyePoints[4]);
  const rightEyeWidth = calculateDistance(rightEyePoints[0], rightEyePoints[3]);
  const rightEyeHeight = calculateDistance(rightEyePoints[1], rightEyePoints[4]);

  embedding.push(leftEyeWidth / 640);
  embedding.push(leftEyeHeight / 480);
  embedding.push(rightEyeWidth / 640);
  embedding.push(rightEyeHeight / 480);
  embedding.push(leftEyeWidth / leftEyeHeight); // aspect ratio
  embedding.push(rightEyeWidth / rightEyeHeight); // aspect ratio
  // Total: 61 features

  // 9. Add variance and statistical features
  const leftXCoords = leftIrisPoints.map(p => p ? p.x : 0);
  const leftYCoords = leftIrisPoints.map(p => p ? p.y : 0);
  const rightXCoords = rightIrisPoints.map(p => p ? p.x : 0);
  const rightYCoords = rightIrisPoints.map(p => p ? p.y : 0);

  embedding.push(calculateVariance(leftXCoords) / 1000);
  embedding.push(calculateVariance(leftYCoords) / 1000);
  embedding.push(calculateVariance(rightXCoords) / 1000);
  embedding.push(calculateVariance(rightYCoords) / 1000);
  // Total: 65 features

  // 10. Add radial distances from iris center to each iris point
  leftIrisPoints.forEach(point => {
    if (point) {
      const dist = calculateDistance(point, leftIrisCenter);
      embedding.push(dist / 100);
    }
  });

  rightIrisPoints.forEach(point => {
    if (point) {
      const dist = calculateDistance(point, rightIrisCenter);
      embedding.push(dist / 100);
    }
  });
  // Total: 65 + 10 = 75 features

  // 11. Add angular positions of iris points relative to center
  leftIrisPoints.forEach(point => {
    if (point) {
      const angle = calculateAngle(leftIrisCenter, point);
      embedding.push(angle / Math.PI); // Normalize to [-1, 1]
    }
  });

  rightIrisPoints.forEach(point => {
    if (point) {
      const angle = calculateAngle(rightIrisCenter, point);
      embedding.push(angle / Math.PI);
    }
  });
  // Total: 75 + 10 = 85 features

  // 12. Add cross-eye symmetry features
  const symmetryFeatures = calculateSymmetryFeatures(
    leftIrisPoints,
    rightIrisPoints,
    leftIrisCenter,
    rightIrisCenter
  );
  embedding.push(...symmetryFeatures);
  // Total: ~128 features (depending on symmetry calculation)

  // Ensure consistent embedding size by padding or truncating to 128
  while (embedding.length < 128) {
    embedding.push(0);
  }

  return embedding.slice(0, 128);
};

// Helper function: Calculate center point of multiple points
const calculateCenter = (points) => {
  const validPoints = points.filter(p => p);
  if (validPoints.length === 0) return { x: 0, y: 0, z: 0 };

  const sum = validPoints.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y,
      z: acc.z + (point.z || 0)
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: sum.x / validPoints.length,
    y: sum.y / validPoints.length,
    z: sum.z / validPoints.length
  };
};

// Helper function: Calculate Euclidean distance between two points
const calculateDistance = (p1, p2) => {
  if (!p1 || !p2) return 0;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Helper function: Calculate diameter (max distance between any two points)
const calculateDiameter = (points) => {
  let maxDist = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = calculateDistance(points[i], points[j]);
      if (dist > maxDist) maxDist = dist;
    }
  }
  return maxDist / 100; // Normalize
};

// Helper function: Calculate all pairwise distances
const calculateAllDistances = (points) => {
  const distances = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      distances.push(calculateDistance(points[i], points[j]) / 100);
    }
  }
  return distances;
};

// Helper function: Calculate angle from center to point
const calculateAngle = (center, point) => {
  if (!center || !point) return 0;
  return Math.atan2(point.y - center.y, point.x - center.x);
};

// Helper function: Calculate variance of an array
const calculateVariance = (arr) => {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squareDiffs = arr.map(value => Math.pow(value - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / arr.length;
};

// Helper function: Calculate symmetry features between left and right eyes
const calculateSymmetryFeatures = (leftPoints, rightPoints, leftCenter, rightCenter) => {
  const features = [];

  // Mirror symmetry: compare distances from center
  for (let i = 0; i < Math.min(leftPoints.length, rightPoints.length); i++) {
    const leftDist = calculateDistance(leftPoints[i], leftCenter);
    const rightDist = calculateDistance(rightPoints[i], rightCenter);
    features.push((leftDist - rightDist) / 100);
  }

  // Angle symmetry
  for (let i = 0; i < Math.min(leftPoints.length, rightPoints.length); i++) {
    const leftAngle = calculateAngle(leftCenter, leftPoints[i]);
    const rightAngle = calculateAngle(rightCenter, rightPoints[i]);
    features.push((leftAngle - rightAngle) / Math.PI);
  }

  // Size ratio
  const leftDiameter = calculateDiameter(leftPoints);
  const rightDiameter = calculateDiameter(rightPoints);
  features.push(leftDiameter / (rightDiameter + 0.001)); // Avoid division by zero

  return features;
};

/**
 * Normalize embedding vector
 * @param {Array} embedding - Raw embedding vector
 * @returns {Array} - Normalized embedding vector
 */
export const normalizeEmbedding = (embedding) => {
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return embedding;
  return embedding.map(val => val / magnitude);
};
