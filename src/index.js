import {create as createWebGL}  from './webgl'
import {create as createSVG}    from './svg'

const tryAndFallback = ( [ first, ...queue ], options ) => {

    if ( !first )
        throw [null]

    try {
        return first( options )
    } catch( err ){

        try{
            return tryAndFallback( queue, options )
        }catch( errStack ){

            throw [ err, ...errStack ]
        }

    }
}

export const create = ( options: Object ) => {

    let c

    switch( options && options.implementation ){
        case 'webgl' :
            c = createWebGL
            break

        case 'svg' :
            c = createSVG
            break

        default :
            c = tryAndFallback.bind( null, [ createWebGL, createSVG ] )
            break
    }

    return c( options )
}
