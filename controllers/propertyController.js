/**
 * ***** Please, bear in mind that I'm just using promises here to simulate async processing
 * ***** like a production environment calling and API or delegating CPU intensive computation
 * ***** The requested solution is pretty easy and straightforward to accomplish in a sync fashion
 *
 * Creates a promise to process the properties payload.
 *
 * @param {Array} properties The list of properties to filter.
 *
 * @returns {Promise} The promise to resolve with filtered properties or reject on error.
 */
const filterPromise = properties => {
    return new Promise( ( resolve, reject ) => {

        /**
         * The variable goodToGo is just to simulate an error during the async process,
         * nothing to set in a production environment!!!!
         * This is a terrible idea for testing purposes as the outcome is unpredictable!!!!
         */
        let goodToGo = true
        // Please, uncomment the following line to simulate random errors during the async process
        // goodToGo = Math.random() < .5
        console.log( 'good to go ->> ', goodToGo )

        if ( goodToGo ) {
            // setImmediate here is just to simulate an async process
            setImmediate( () => {
                resolve( properties.filter( property => {
                    return property.type === 'htv' && property.workflow === 'completed'
                } ) )
            } )
        }
        else
        {
            // setImmediate here is just to simulate an async process
            setImmediate( () => {
                reject( new Error( 'Something went wrong!' ) )
            } )
        }
    } )
}

/**
 * Concatenates an address.
 *
 * @param {Object} address The address object to concatenate.
 *
 * @returns {String} The concatenated address.
 */
const concatAddress = address => {
    const filteredAddress = [
        address.buildingNumber || '',
        address.street || '',
        address.suburb || '',
        address.state || '',
        address.postcode || '',
    ]

    // keep unitNumber out of the filteredAddress array as it is often not included in the address,
    // so we avoid an empty space at the very beginning of the concatenated address.
    return ( address.unitNumber ? `${address.unitNumber} ` : '' ) + filteredAddress.join( ' ' )
}

/**
 * Filters payload array in the request to get only the properties with type = 'htv' and workflow = 'completed'.
 *
 * @param {Object} req The Express request object,
 * @param {Object} res The Express response object,
 * @param {Function} next The next function to pass on any error to the Express middleware chain
 */
exports.filter = async ( req, res, next ) => {
    const payload = req.body.payload

    if ( typeof payload === 'undefined' )
    {
        return next( new Error( 'The payload of properties is missing in the request.' ) )
    }

    const filteredProperties = ( await filterPromise( payload ) )
        .map( property => {
            return {
                concataddress: concatAddress( property.address ),
                type: property.type,
                workflow: property.workflow,
            }
        } )

    res.json( {
        response: filteredProperties
    } )
}
