const chai = require( 'chai' )
const expect = chai.expect

const { catchErrors, notFound, badRequest, developmentErrors, productionErrors } = require( '../../handlers/error-handlers' )

describe( 'error handler catchErrors', () => {

    it( 'returns a middleware function', () => {
        expect( catchErrors( () => {} ) ).to.be.a( 'function' )
    } )

    it( 'calls the middleware function', done => {
        const getMiddlewarePromise = () => new Promise( ( resolve, reject ) => {
            resolve( 'resolved promise' )
        } )

        const middlewareFunc = async ( req, res, next ) => {
            const result = await getMiddlewarePromise()

            try
            {
                expect(result).to.be.equal( 'resolved promise' )
                done()
            }
            catch ( e )
            {
                done( new Error( 'Error calling middleware function' ) )
            }
        }

        catchErrors( middlewareFunc )( null, null, null )
    } )

    it( 'calls the middleware catch method on error', done => {
        const getMiddlewarePromise = () => new Promise( ( resolve, reject ) => {
            reject( 'rejected promise' )
        } )

        const middlewareFunc = async ( req, res, next ) => {
            await getMiddlewarePromise()
        }

        catchErrors( middlewareFunc )( null, null, err => {
            try
            {
                expect( err ).to.be.equal( 'rejected promise' )
                done()
            }
            catch ( e )
            {
                done( new Error( 'Error calling middleware function' ) )
            }
        } )
    } )

} )

describe( 'error handler notFound', () => {

    it( 'returns a middleware function', () => {
        expect( notFound ).to.be.a( 'function' )
        expect( notFound.length ).to.be.equal( 3 )
    } )

    it( 'passes on a 404 error', () => {
        notFound( null, null, ( err ) => {
            expect( err ).to.be.an( 'Error' )
            expect( err ).to.have.property( 'status', 404 )
            expect( err ).to.have.property( 'message', 'Not Found!!!' )
        } )
    } )

} )

describe( 'error handler badRequest', () => {

    it( 'returns a middleware error handler', () => {
        expect( badRequest ).to.be.a( 'function' )
        expect( badRequest.length ).to.be.equal( 4 )
    } )

    it( 'passes on a non syntax error', () => {
        const err = new Error( 'This is a standard error' )

        badRequest( err, null, null, err => {
            expect( err ).to.be.an( 'Error' )
            expect( err ).to.have.property( 'message', 'This is a standard error' )
        } )
    } )

    it( 'passes on a syntax error with status 400', () => {
        const err = new SyntaxError( 'This is a syntax error' )

        badRequest( err, null, null, err => {
            expect( err ).to.be.an( 'Error' )
            expect( err ).to.have.property( 'status', 400 )
            expect( err ).to.have.property( 'message', 'Could not decode request: JSON parsing failed' )
        } )
    } )

} )

describe( 'error handler developmentErrors', () => {

    it( 'returns a middleware error handler', () => {
        expect( developmentErrors ).to.be.a( 'function' )
        expect( developmentErrors.length ).to.be.equal( 4 )
    } )

    it( 'replies with a detailed error', () => {
        const err = {
            message: 'This is a standard error',
            status: 500,
            stack: '',
        }
        
        developmentErrors( err, null, {
            status: ( () => {
                return {
                    json: err => {
                        expect( err ).to.be.an( 'object' )
                        expect( err ).to.have.property( 'error', 'This is a standard error' )
                        expect( err ).to.have.property( 'status', 500 )
                        expect( err ).to.have.property( 'stack' )
                    },
                }
            } ),
        }, null )
    } )

} )

describe( 'error handler productionErrors', () => {

    it( 'returns a middleware error handler', () => {
        expect( productionErrors ).to.be.a( 'function' )
        expect( productionErrors.length ).to.be.equal( 4 )
    } )

    it( 'replies with a simple error', () => {
        const err = {
            message: 'This is a standard error',
            status: 500,
            stack: '',
        }

        productionErrors( err, null, {
            status: ( () => {
                return {
                    json: err => {
                        expect( err ).to.be.an( 'object' )
                        expect( err ).to.have.property( 'error', 'This is a standard error' )
                        expect( err ).not.to.have.property( 'status', 500 )
                        expect( err ).not.to.have.property( 'stack' )
                    },
                }
            } ),
        }, null )
    } )

} )
