function status(request, response) {
  return response.status(200).json({ message: "Hello World!" });
}

export default status;
