const router = require( 'express' ).Router()
const propertyController = require( '../controllers/propertyController' )
const { catchErrors } = require( '../handlers/errorHandlers' )

router.post( '/', catchErrors( propertyController.filter ) )

module.exports = router
