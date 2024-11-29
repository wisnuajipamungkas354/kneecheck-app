const cekTypeDokter = (req, res, next) => {
  if (req.userType !== "Dokter") {
    res.status(403).send({ 
      status: "fail",
      message: "Forbidden" 
    });
    return;
  }
  next();
};
const cekTypePasien = (req, res, next) => {
  if (req.userType !== "Pasien") {
    res.status(403).send({ 
      status: "fail",
      message: "Forbidden" 
    });
    return;
  }
  next();
};

export { cekTypeDokter, cekTypePasien };
