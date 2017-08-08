const router = require( 'express' ).Router()
const propertyController = require( '../controllers/property-controller' )
const { catchErrors } = require( '../handlers/error-handlers' )

router.post( '/', catchErrors( propertyController.filter ) )

module.exports = router
