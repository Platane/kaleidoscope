import {create}     from '../src'

import {GUI}          from 'dat.gui/build/dat.gui'


const attach = options => {

    const { element, resize, draw, setImage, setTransform, setTileSize } = create( options )

    setImage( imagePath[ options.image ] )

    setTileSize( 240 )

    document.body.appendChild( element )
    element.style.position = 'absolute'
    element.style.width = '100%'
    element.style.height = '100%'
    element.style.top = 0
    element.style.left = 0

    let k=0
    let timeout=null
    const loop = () => {

        k++

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

    loop()

    window.onresize = resize

    setTimeout( resize, 1 )

    return {
        setImage,
        destroy : () => {
            cancelAnimationFrame(timeout)
            element.parentNode.removeChild(element)
        }
    }
}

const imagePath = {
    'glass'     : require('../src/asset/glass.jpg'),
    'garden'    : require('../src/asset/garden.jpg'),
    'kitchen'   : require('../src/asset/kitchen.jpg'),
    'raspberry' : require('../src/asset/raspberry.jpg'),
}
const config = {
    implementation  : 'webgl',
    image           : 'glass',
}

const gui = new GUI()

let x = attach(config)

gui.add( config, 'implementation', [ 'webgl', 'svg' ] )
    .onChange( () => {
        x.destroy()
        x = attach(config)
    })

gui.add( config, 'image', Object.keys(imagePath) )
    .onChange( () => x.setImage( imagePath[ config.image ] ) )

gui.domElement.parentNode.style.zIndex = '2'
