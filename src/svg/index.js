
const h = ( elementName: string, attributes: ?Object, ...children: Array< Element > ) : Element => {

    attributes = attributes || {}

    const el = document.createElementNS('http://www.w3.org/2000/svg', elementName)

    for( let key in attributes )
        switch( key.includes(':') && key.split(':',1)[0] ){
            case 'xlink' :
                el.setAttributeNS('http://www.w3.org/1999/xlink',key, attributes[key])
                break

            case false:
            default:
                el.setAttribute(key, attributes[key])
        }

    children.forEach( e => el.appendChild( e ))

    return el
}

const computeTransformForTriangle = ( i: number, size: number ) : string => {

    // height of the triangle
    const h = size * Math.sqrt(3)/2

    // ratio real size / image_size
    // ( because image size is fixed to a 100 iso triangle )
    const k = size/ 100

    let s = ''

    // probably a better way to achieve this
    switch( i%7 ){
        case 0 :
            s = `translate(${size*0},${h*0}) rotate(0) scale(${k},${k})`
            break
        case 1 :
            s = `translate(${size*0},${h*0}) rotate(300) scale(-${k},${k})`
            break
        case 2 :
            s = `translate(${size*1.5},${h*1}) rotate(60) scale(-${k},${k})`
            break
        case 3 :
            s = `translate(${size*1.5},${h*1}) rotate(240) scale(${k},${k})`
            break
        case 4 :
            s = `translate(${size*1.5},${h*1}) rotate(180) scale(-${k},${k})`
            break
        case 5 :
            s = `translate(${size*3},${h*0}) rotate(120) scale(${k},${k})`
            break

        case 6 :
            s = `translate(${size*3},${h*0}) rotate(300) scale(-${k},${k})`
            break
    }

    return `translate(0,${h*1})` + ( i > 6 ? 'scale(1,-1)' : '' )+ s
}


export const create = () => {


    let patterns = []
    let pattern
    let imageClipped
    let image
    let back

    // generate the svg markup
    // which consists in
    //  - a triangle clip path
    //  - the image cliped with the triangle, trnaformation will be applied to the image to make the kaleidoscope motion effect
    //  - a pattern which consist of 14 triangles rotated rigth
    //  - a solid rectangle which takes all the place and is filled with the pattern
    //
    // about the pattern :
    // notice how we can find a tilable pattern with 12 triangle,
    // as the shape is not a rectangle, add two more ( 14 triangles ) to have a tilable rectangle
    //
    const svg = h('svg', null,
        h('defs', null,
            h('clipPath', {id:'faceClip'},
                h('path', {d:`M-0.5 -0.5  L100.5 -0.5  L50 ${Math.ceil(50*Math.sqrt(3))+0.5}z`})
            ),
            imageClipped = h('g',
                {
                    id: 'triangle',
                    'clip-path': 'url(#faceClip)'
                },
                image = h('image',
                    {
                        width: 100,
                        height: 100,
                        x:0,
                        y:0,
                        preserveAspectRatio:'xMidYMid slice'
                    }
                ),
            ),
            pattern = h('pattern',
                {
                    id: 'mypattern',
                    patternUnits: 'userSpaceOnUse'
                },

                ...(patterns = Array.from({ length: 14 }).map((_,i) =>
                        // transformations are applied once the size is set ( see setSize )
                        h('use', {'xlink:href': '#triangle'})
                    )
                )
            )
        ),


        back = h('rect', {width: 1900, height: 1080, fill:'url(#mypattern)'}),

    )


    const setTileSize = ( s:number ) => {

        const h = s * Math.sqrt(3)/2

        pattern.setAttribute('width', ''+(s*3))
        pattern.setAttribute('height', ''+(h*2))

        patterns.forEach( (p,i) =>
            p.setAttribute('transform', computeTransformForTriangle(i, s))
        )
    }

    const setTransform = ( scale:number, angle:number, tx:number, ty:number ) =>

        image.setAttribute('transform',
            [
                `translate(${50},${50})`,
                `rotate(${angle/Math.PI*180})`,
                `scale(${1/scale},${1/scale})`,
                `translate(${-50},${-50})`,
                `translate(${tx*100},${ty*100})`,
            ]
                .join(' ')
        )


    setTransform( 1, 0, 0, 0 )
    setTileSize( 100 )

    return {

        element: svg,

        setTileSize : setTileSize,

        setTransform : setTransform,

        setImage : ( imageUrl: string ) => {
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageUrl)
        },

        resize : () => {

            const {width, height} = svg.getBoundingClientRect()

            back.setAttribute('width', ''+width)
            back.setAttribute('height', ''+height)

        },

        draw : () => 0,
    }
}
