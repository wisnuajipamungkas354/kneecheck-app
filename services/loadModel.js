import tf from "@tensorflow/tfjs-node";
async function loadModel() {
  return tf.loadGraphModel(
    "https://storage.googleapis.com/knee-check-storage/model-in-prod/model.json"
  );
}
export default loadModel;
