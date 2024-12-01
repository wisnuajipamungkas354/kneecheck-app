import tf from "@tensorflow/tfjs-node";

async function predictClassification(model, image) {
  try {
    if (image.length > 1024 * 1024) {
      throw new Error(
        "Payload content length greater than maximum allowed: 1000000"
      );
    }
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Healthy", "Minimal", "Severe"];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let explanation, suggestion;
    if (label === "Healthy") {
      const level = 1;

      return { label, level, suggestion };
    }
    if (label === "Minimal") {
      const level = 2;

      return { label, level, suggestion };
    }
    if (label === "Severe") {
      const level = 3;

      return { label, level, suggestion };
    }
  } catch (error) {
    throw new Error("Terjadi kesalahan dalam melakukan prediksi");
  }
}
export default predictClassification;
