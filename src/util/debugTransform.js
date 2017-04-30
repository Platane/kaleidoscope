
import type {Matrix3} from './matrix'

export const create = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    document.body.appendChild(canvas)
    canvas.style.position = 'fixed'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.zIndex = 200

    const ctx = canvas.getContext('2d')

    const dot = ( x, y ) => {
        ctx.beginPath()
        ctx.arc( x*150 + 25, y*150 + 25, 4, 0, Math.PI*2 )
        ctx.fill()
    }

    const mult = ( m: Matrix3, x: number, y: number ) : { x:number, y:number } =>
        ({
            x : m[0] * x + m[1] * y + m[2],
            y : m[3] * x + m[4] * y + m[5],
        })

    return ( m: Matrix3 ) => {

        ctx.save()

        ctx.fillStyle = '#fff'
        ctx.rect(0,0,9999,9999)
        ctx.fill()

        ctx.beginPath()
        ctx.rect(25,25,150,150)
        ctx.stroke()

        ctx.globalAlpha = 0.5

        const l = 7

        for(let x_=l;x_--;)
        for(let y_=l;y_--;)
        {

            const x = x_ / ( l-1 )
            const y = y_ / ( l-1 )

            ctx.fillStyle = '#485c85'
            dot( x, y )

            const p = mult( m, x, y )

            ctx.fillStyle = '#804885'
            dot( p.x, p.y )
        }

        ctx.restore()
    }
}
