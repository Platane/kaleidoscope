import {create}     from '../src'




const { element, resize, draw, setImage, setTransform, setTileSize } = create()

document.body.appendChild( element )
element.style.position = 'absolute'
element.style.width = '100%'
element.style.height = '100%'
element.style.top = 0
element.style.left = 0

setImage( require('../src/asset/garden.jpg') )

setTileSize( 240 )

let k=0
const loop = () => {

    k++

    const s = 0.86 * ( 0.75 + 0.25 * Math.sin( k*0.01 ) ) * 0.7

    const r = Math.min( ( 1-s ) /2, 0.4 )

    const tx = r * Math.sin( k*0.04 )
    const ty = r * Math.cos( k*0.04 )

    setTransform(
        s,
        k*0.011,
        tx,
        ty
    )

    draw()

    requestAnimationFrame(loop)
}

loop()

setTimeout( resize, 1 )
