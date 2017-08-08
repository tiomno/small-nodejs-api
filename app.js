const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const routes = require( './routes/index' )
const errorHandlers = require( './handlers/errorHandlers' )
const clc = require( 'cli-color' )

// import environmental variables from the variables.env file
require( 'dotenv' ).config( { path: 'variables.env' } )

const app = express()

//middleware to allow CORS
app.use( ( req, res, next ) => {
    res.setHeader( 'Access-Control-Allow-Origin', '*' )
    res.setHeader( 'Access-Control-Allow-Credentials', true )
    next()
} )

app.use( bodyParser.json() )

app.use( '/', routes )

// 400 not found router. If the request gets here, the API couldn't match any router to handle it.
app.use( errorHandlers.notFound )

// 404 (Bad Request) error handler
app.use( errorHandlers.badRequest )

// Unexpected errors handler
if ( app.get( 'env' ) === 'development' )
{
    app.use( errorHandlers.developmentErrors )
}

// production error handler
app.use( errorHandlers.productionErrors )

app.set( 'port', process.env.PORT || 3000 )
const server = app.listen( app.get( 'port' ), () => {
    console.log( 'API Server running on port',  clc.green( server.address().port ) )
} )
