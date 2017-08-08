const chai = require( 'chai' )
const expect = chai.expect
const rewire = require( 'rewire' )

const propertyController = rewire( '../../controllers/property-controller' )
const filter = propertyController.filter
const filterPromise = propertyController.__get__( 'filterPromise' )
const concatAddress = propertyController.__get__( 'concatAddress' )

describe( 'property controller filter', () => {

    it( 'is a middleware function', () => {
        expect( filter ).to.be.a( 'function' )
    } )

    it( 'replies a filtered list of properties', done => {
        const req = {
            body: {
                payload: [
                    {
                        address: {
                            buildingNumber: '28',
                            lat: -33.912542000000002,
                            lon: 151.00293199999999,
                            postcode: '2198',
                            state: 'NSW',
                            street: 'Donington Ave',
                            suburb: 'Georges Hall'
                        },
                        propertyTypeId: 3,
                        readyState: 'init',
                        reference: 'aqsdasd',
                        shortId: '6Laj49N3PiwZ',
                        status: 0,
                        type: 'htv',
                        workflow: 'pending'
                    },
                    {
                        address: {
                            buildingNumber: 'Level 6',
                            postcode: '2060',
                            state: 'NSW',
                            street: '146 Arthur Street',
                            suburb: 'North Sydney'
                        },
                        propertyTypeId: 3,
                        readyState: 'init',
                        reference: 'asdasd',
                        shortId: 'E9eQVYEMkub2',
                        status: 4,
                        type: 'htv',
                        valfirm: null,
                        workflow: 'completed',
                    },
                ]
            }
        }

        const res = {
            json: response => {
                expect( response ).to.be.an( 'object' )
                expect( response ).to.have.property( 'response' ).to.be.an( 'array' )
                expect( response.response ).to.deep.equal( [
                    {
                        concataddress: 'Level 6 146 Arthur Street North Sydney NSW 2060',
                        type: 'htv',
                        workflow: 'completed',
                    }
                ] )
                done()
            }
        }

        try
        {
            filter( req, res, null )
        }
        catch ( e )
        {
            done( new Error( 'Error filtering properties' ) )
        }
    } )

    it( 'passes on an error if there is no payload', done => {
        const req = {
            body: {
                NO_payload: []
            }
        }

        const res = {
            json: response => {
                done( new Error( 'Error passing on the `missing payload error`' ) )
            }
        }

        try
        {
            filter( req, res, err => {
                expect( err ).to.be.an( 'Error' )
                expect( err ).to.have.property( 'message', 'The payload of properties is missing in the request.' )
                done()
            } )
        }
        catch ( e )
        {
            done( new Error( 'Error passing on the `missing payload error`' ) )
        }
    } )

} )

describe( 'property controller filterPromise', () => {

    it( 'returns a function which returns a Promise', () => {
        expect( filterPromise ).to.be.a( 'function' )
        expect( filterPromise() ).to.be.a( 'Promise' )
    } )

    it( 'returns a matrix of filtered properties', done => {
        const payload = [
            {
                address: {
                    buildingNumber: '28',
                    lat: -33.912542000000002,
                    lon: 151.00293199999999,
                    postcode: '2198',
                    state: 'NSW',
                    street: 'Donington Ave',
                    suburb: 'Georges Hall'
                },
                propertyTypeId: 3,
                readyState: 'init',
                reference: 'aqsdasd',
                shortId: '6Laj49N3PiwZ',
                status: 0,
                type: 'htv',
                workflow: 'pending'
            },
            {
                address: {
                    buildingNumber: 'Level 6',
                    postcode: '2060',
                    state: 'NSW',
                    street: '146 Arthur Street',
                    suburb: 'North Sydney'
                },
                propertyTypeId: 3,
                readyState: 'init',
                reference: 'asdasd',
                shortId: 'E9eQVYEMkub2',
                status: 4,
                type: 'htv',
                valfirm: null,
                workflow: 'completed',
            },
        ]

        filterPromise( payload )
            .then( filteredProperties => {
                expect( filteredProperties ).to.be.an( 'array' )
                    .to.deep.equal( [
                        {
                            address: {
                                buildingNumber: 'Level 6',
                                postcode: '2060',
                                state: 'NSW',
                                street: '146 Arthur Street',
                                suburb: 'North Sydney'
                            },
                            propertyTypeId: 3,
                            readyState: 'init',
                            reference: 'asdasd',
                            shortId: 'E9eQVYEMkub2',
                            status: 4,
                            type: 'htv',
                            valfirm: null,
                            workflow: 'completed',
                        },
                    ] )
                done()
            } )
            .catch( done )
    } )

} )

describe( 'property controller concatAddress', () => {

    it( 'is a function which takes one argument', () => {
        expect( concatAddress ).to.be.a( 'function' )
        expect( concatAddress.length ).to.be.equal( 1 )
    } )

    it( 'returns a concatenated address from and address object', () => {
        const addressWithUnitNumber = {
            buildingNumber: '360',
            postcode: '3000',
            state: 'VIC',
            street: 'Elizabeth St',
            suburb: 'Melbourne',
            unitNumber: 'Level 28',
        }

        const concatAddressWithUnitNumber = concatAddress( addressWithUnitNumber )

        expect( concatAddressWithUnitNumber ).to.be.a( 'string' )
            .equal( 'Level 28 360 Elizabeth St Melbourne VIC 3000' )

        const addressWithoutUnitNumber = {
            buildingNumber: '360',
            postcode: '3000',
            state: 'VIC',
            street: 'Elizabeth St',
            suburb: 'Melbourne',
        }

        const concatAddressWithoutUnitNumber = concatAddress( addressWithoutUnitNumber )

        expect( concatAddressWithoutUnitNumber ).to.be.a( 'string' )
            .equal( '360 Elizabeth St Melbourne VIC 3000' )
    } )

} )
