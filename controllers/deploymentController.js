exports.createDeployment = (req, res) => {
  const deployment = req.body;
  if (!deployment) {
    res.status(400).send({ error: "No deployment" });
  }
  else {
    const deploymentId = deployments.createDeployment(deployment);
    res.send({ id: deploymentId });
  }
}