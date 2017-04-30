
export type Matrix3 = [
    number, number, number,
    number, number, number,
    number, number, number,
]

const create = () : Matrix3 => Array.from({ length: 9 })


const tmp = create()
export const mult = ( a: Matrix3, b: Matrix3, out?: Matrix3 ): Matrix3 => {

    out = out || create()

    for(let x=3;x --;)
    for(let y=3;y --;)
    {
        let s = 0
        for(let k=3;k --;)
            s += a[ x + k*3 ] * b[ k + y*3 ]

        tmp[ x + y*3 ] = s
    }

    for(let i=9;i--;)
        out[i] = tmp[i]

    return out
}

export const buildScaleMatrix = ( s: number, out?: Matrix3 ) => {

    out = out || create()

    out[0] = s
    out[1] = 0
    out[2] = 0

    out[3] = 0
    out[4] = s
    out[5] = 0

    out[6] = 0
    out[7] = 0
    out[8] = 1

    return out
}

export const buildTranslateMatrix = ( tx: number, ty: number, out?: Matrix3 ) => {

    out = out || create()

    out[0] = 1
    out[1] = 0
    out[2] = tx

    out[3] = 0
    out[4] = 1
    out[5] = ty

    out[6] = 0
    out[7] = 0
    out[8] = 1

    return out
}

export const buildRotateMatrix = ( angle: number, out?: Matrix3 ) => {

    out = out || create()

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    out[0] = cos
    out[1] = -sin
    out[2] = 0

    out[3] = sin
    out[4] = cos
    out[5] = 0

    out[6] = 0
    out[7] = 0
    out[8] = 1

    return out
}


const tc    = buildTranslateMatrix(-0.5, -0.5)
const tc_   = buildTranslateMatrix( 0.5,  0.5)
const k     = create()
/**
 * assuming
 *  - scale is in [ 0, 1 ]
 *      is the size of the sub-image, relative to the big image ( which scale is 1 )
 *
 *  - angle is in radian
 *
 *  - tx and ty are in [ -1, 1 ]
 *      are translation,
 *      (0, 0) means that the sub-image is in the left top corner
 *
 *  keep in mind that in order to keep the sub image always inside the original one, some constraint need to be enforced
 *
 *      - scale must be kept between [ 0, 1/sqrt(2) ] in order to have a safe rotation
 *      - t_ must be kept between [ -(1-scale)/2, (1-scale)/2 ]
 */
export const buildTransformMatrix = ( scale: number, angle: number, tx: number, ty: number, out?: Matrix3 ) : Matrix3 => {

    out = out || create()

    buildScaleMatrix( 1, out )


    mult( out, tc,   out )
    mult( out, buildRotateMatrix( angle, k ),    out )
    mult( out, buildScaleMatrix( scale, k ),    out )
    mult( out, tc_,  out )
    mult( out, buildTranslateMatrix( tx, ty, k ),  out )

    return out
}