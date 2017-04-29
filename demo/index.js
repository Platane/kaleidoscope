import {create}     from '../src'




const { element, resize, draw, setImage, setTileSize } = create()

document.body.appendChild( element )
element.style.position = 'absolute'
element.style.width = '100%'
element.style.height = '100%'
element.style.top = 0
element.style.left = 0

setImage( require('../src/asset/kitchen.jpg') )

setTileSize( 100 )

let k=0
const loop = () => {

    k++


    draw()

    requestAnimationFrame(loop)
}

loop()

setTimeout( resize, 1 )
