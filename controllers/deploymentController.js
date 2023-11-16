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

const startingPort = 4000;

exports.getFreePort = (numOfPorts = 1) => {
  // Get all the ports in use from active deployments
  const portsInUse = deployments.getAll().map(deployment => deployment.port)
  // Get the first free port
  const port = startingPort + portsInUse.length;
  // Return an array of incrementing ports of size numOfPorts
  return Array.from(Array(numOfPorts).keys()).map(i => port + i);
}