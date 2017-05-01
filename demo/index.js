import {create}     from '../src'

import {GUI}          from 'dat.gui/build/dat.gui'


const createStepper = ( setTransform, draw ) => {

    let k=0
    let vk=1
    let timeout=0

    const loop = () => {

        vk = vk * 0.98

        k += 0.07 + vk * 1.1

        const s = 0.86 * ( 0.75 + 0.25 * Math.sin( k*0.01 ) ) * 0.7

        const r = Math.min( ( 1-s ) /2, 0.2 )

        const tx = r * Math.sin( k*0.04 )
        const ty = r * Math.cos( k*0.04 )

        setTransform(
            s,
            k*0.011,
            tx,
            ty
        )

        draw()

        timeout = requestAnimationFrame(loop)
    }

    let mousex = 0
    let mousey = 0
    const mousemove = ( event: MouseEvent ) => {

        let delta = Math.abs( event.clientX - mousex ) + Math.abs( event.clientY - mousey )

        if ( mousex > event.clientX )
            delta = - delta

        mousex = event.clientX
        mousey = event.clientY

        vk = Math.max(Math.min( vk + delta / 400, 1 ), -1)
    }

    window.addEventListener( 'mousemove', mousemove )

    loop()


    return () => {
        window.removeEventListener( 'mousemove', mousemove )
        cancelAnimationFrame(timeout)
    }
}

const attach = options => {

    const { element, resize, draw, setImage, setTransform, setTileSize, setUpScaling } = create( options )

    setImage( options.image )

    setTileSize( options.tileSize )

    setUpScaling( options.upScaling )

    document.body && document.body.appendChild( element )

    if ( element instanceof HTMLElement ) {
        element.style.position = 'absolute'
        element.style.width = '100%'
        element.style.height = '100%'
        element.style.top = '0'
        element.style.left = '0'
    }

    const destroyStepper = createStepper( setTransform, draw )

    window.onresize = resize

    setTimeout( resize, 1 )

    return {
        setImage,
        setUpScaling,
        setTileSize,
        destroy : () => {
            destroyStepper()
            element.parentNode && element.parentNode.removeChild(element)
        }
    }
}

const imagePath = {
    'glass'     : require('../src/asset/glass.jpg'),
    'garden'    : require('../src/asset/garden.jpg'),
    'kitchen'   : require('../src/asset/kitchen.jpg'),
    'raspberry' : require('../src/asset/raspberry.jpg'),
}

const upScalingValue = {
    'x1 (better quality)'   : 1,
    'x2'                    : 2,
    'x4'                    : 4,
    'x8'                    : 8,
}

const config = {
    implementation  : 'webgl',
    image           : imagePath[ Object.keys(imagePath)[0] ],
    tileSize        : 200,
    upScaling       : 1,
}

const gui = new GUI()

let x = attach(config)

gui.add( config, 'implementation', [ 'webgl', 'svg' ] )
    .onChange( () => {
        x.destroy()
        x = attach(config)
    })

gui.add( config, 'image', imagePath )
    .onChange( x.setImage )

gui.add( config, 'upScaling', upScalingValue )
    .onChange( x.setUpScaling )

gui.add( config, 'tileSize', 20, 500 )
    .min( 20 )
    .max( 500 )
    .onChange( x.setTileSize )

gui.domElement.parentNode.style.zIndex = '2'
