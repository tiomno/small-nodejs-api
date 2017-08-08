/**
 * Catch Errors Handler for Promises in controllers.
 *
 * With async/await, there is needed some way to catch errors
 * Instead of using try{} catch(e) {} in each controller, the function is wrapped in catchErrors()
 * This function catches any errors they throw, and passes it along to express middleware with next()
 *
 * @param {Function} fn The function returning a Promise as a middleware.
 *
 * @returns {Function} A wrapper middleware function
 * invoking a Promise with a catch statement to pass on any error to the next error handler.
 */
exports.catchErrors = fn => {
    return ( req, res, next ) => {
        fn( req, res, next ).catch( next )
    }
}

/**
 * Not Found Error Handler. Mark any not matching route as 404 and pass it along to the next error handler.
 *
 * @param {Object} req The Express request object,
 * @param {Object} res The Express response object,
 * @param {Function} next The next function to pass on any error to the Express middleware chain
*/
exports.notFound = ( req, res, next ) => {
    const err = new Error( 'Not Found!!!' )
    err.status = 404
    next( err )
}

/**
 * Bad JSON Request Error Handler. Custom error message when JSON parsing fails.
 * ( for Express 4.x the signature of Error-handling middleware always takes four arguments.)
 *
 * @param {Object} err The Error object,
 * @param {Object} req The Express request object,
 * @param {Object} res The Express response object,
 * @param {Function} next The next function to pass on any error to the Express middleware chain
 */
exports.badRequest = ( err, req, res, next ) => {
    if ( ! ( err instanceof SyntaxError ) )
    {
        return next( err )
    }

    const errJSON = new Error( 'Could not decode request: JSON parsing failed' )
    errJSON.status = 400
    next( errJSON )
}

/**
 * Development Error Handler. Shows detailed info on what happened.
 * ( for Express 4.x the signature of Error-handling middleware always takes four arguments.)
 *
 * @param {Object} err The Error object,
 * @param {Object} req The Express request object,
 * @param {Object} res The Express response object,
 * @param {Function} next The next function to pass on any error to the Express middleware chain
 */
exports.developmentErrors = ( err, req, res, next ) => {
    res.status( err.status || 500 ).json( {
        error: err.message,
        status: err.status,
        stack: err.stack,
    } )
}

/**
 * Production Error Handler. No stack traces are leaked to user.
 * ( for Express 4.x the signature of Error-handling middleware always takes four arguments.)
 *
 * @param {Object} err The Error object,
 * @param {Object} req The Express request object,
 * @param {Object} res The Express response object,
 * @param {Function} next The next function to pass on any error to the Express middleware chain
 */
exports.productionErrors = ( err, req, res, next ) => {
    res.status( err.status || 500 ).json( {
        error: err.message,
    } )
}
