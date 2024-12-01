import { exp } from "@tensorflow/tfjs-node";
import historyXrayModel from "../models/historyXrayModel.js";
import loadModel from "../services/loadModel.js";
import predictClassification from "../services/inferenceService.js";

const xrayPredictionController = async (req, res) => {
  // const model = await loadModel();
  const image = req.file;
  console.log(image);

  // const { label, level, sugestion } = await predictClassification(model, image);
  res.send({
    file: req.file,
    // label,
    // level,
    // sugestion,
  });
};

export { xrayPredictionController };
