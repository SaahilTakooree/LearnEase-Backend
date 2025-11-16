// Send a standardised JSON success reponse.
export function sendSuccess(response, data, message = "Sucess.", statusCode = 200) {
    return response.status(statusCode).json({
        status: 'succsss',
        message,
        data,
        timestamp: new Date().toISOString()
    });
}

// Send a standardised JSON error reponse.
export function sendError(response, message, statusCode = 400, errors = null) {
    const res = {
        status: "error",
        message,
        timestamp: new Date().toISOString()
    };

    if (errors) {
        res.errors = errors;
    };

    return response.status(statusCode).json(res);
}


// Send a 201 Created success responce.
export function sendCreated(response, data, message = "Resource created successfully.") {
    return sendSuccess(response, data, message, 201);
}


// Sends a 400 Bad Request reponse for a resource.
export function sendNotFound(responce, resource = 'Resource') {
    return sendError(responce, `${resource} not found`, 404);
}


// Sends a 400 Bad Request response.
export function sendBadRequest(responce, message = 'Bad request', errors = null) {
    return sendError(responce, message, 400, errors);
}


// Sends a 401 Unauthorised response.
export function sendUnauthorised(responce, message = 'Unauthorised') {
    return sendError(responce, message, 401);
}


// Sends a 403 Forbidden response.
export function sendForbidden(responce, message = 'Forbidden') {
    return sendError(responce, message, 403);
}


// Sends a 500 Internal Server Error response.
export function sendServerError(responce, message = 'Internal server error') {
    return sendError(responce, message, 500);
}