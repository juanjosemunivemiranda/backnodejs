function success(res, data = {}, message = "Operación exitosa", status = 200) {
  return res.status(status).json({
    success: true,
    message,
    response: data,
    status
  });
}

function error(res, message = "Error en la operación", status = 500, details = null) {
  return res.status(status).json({
    success: false,
    message,
    error: details,
    status
  });
}



module.exports = {
  success,
  error
};