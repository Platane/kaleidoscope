import {create as createWebGL}  from './webgl'
import {create as createSVG}    from './svg'

export const create = ( options: Object ) =>
    createSVG( options )
