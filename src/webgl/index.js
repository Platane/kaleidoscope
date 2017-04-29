
import { createProgram, bindUniformMat3, bindAttribute, bindElementIndex, bindUniformTexture }        from './gl_util'

import { buildTransformMatrix } from './matrix'

import { loadImage }    from './loadImage'

import fragmentShaderSource     from './fragment_fs.glsl'
import vertexShaderSource       from './vertex_vs.glsl'

import {create as createDebugTransform}     from './debugTransform'

const WEBGL_OPTIONS = {}

const buildMesh = ( face_size: number, world_width: number, world_height: number ) => {

    const vertices = []
    const faces = []
    const uvs = []

    // face height
    const face_h = face_size * Math.sqrt(3)/2

    const proj_x = x =>
        ( x * face_size ) / world_width * 2 - 1

    const proj_y = y =>
        ( y * face_h ) / world_height * 2 - 1

    // size of the world ( in triangles )
    const h     = Math.ceil( world_height / face_h ) +1
    const w     = Math.ceil( world_width / face_size + 0.5 ) +1

    // each vertices is given a uv coord along this set of 3
    const uv_map = [
        [ 0, 0 ],
        [ 1, 0 ],
        [ 0.5, Math.sqrt(3)/2 ],
    ]

    // push the vertices
    for ( let y = 0; y < h; y ++ )
    for ( let x = 0; x < w; x ++ )
    {
        vertices.push( proj_x(x + (y%2 ? -0.5 : 0) ), proj_y(y) )
        uvs.push( ...uv_map[ ( x + (y%2) ) % uv_map.length ] )
    }

    // push the faces
    for ( let y = 1; y < h; y ++ )
    for ( let x = 1; x < w; x ++ )
        faces.push(
            y     * w   + x,
            y     * w   + x-1,
            (y-1) * w   + x + ( y%2 ? -1 : 0 ),

            y     * w  + x-1 + ( y%2 ? 1 : 0 ),
            (y-1) * w  + x,
            (y-1) * w  + x-1,

        )

    return { vertices, faces, uvs }
}

export const create = () => {

    const canvas = document.createElement('canvas')

    if ( !canvas )
        throw 'WebGl not supported'

    const gl: ?WebGLRenderingContext = canvas.getContext('webgl2', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental2', WEBGL_OPTIONS)
        || canvas.getContext('webgl', WEBGL_OPTIONS)
        || canvas.getContext('webgl-experimental', WEBGL_OPTIONS)

    if ( !gl )
        throw 'WebGl not supported'


    gl.clearColor(0.5, 0.5, 0.5, 1.0)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

    gl.cullFace(gl.FRONT_AND_BACK)

    gl.disable(gl.DEPTH_TEST)

    const program = createProgram( gl, vertexShaderSource, fragmentShaderSource )


    const attribute_vertices = bindAttribute( gl, program, 'aVertexPosition', 2 )
    const attribute_uvs = bindAttribute( gl, program, 'aVertexUV', 2 )
    const attribute_index = bindElementIndex( gl, program )
    const uniform_texture = bindUniformTexture( gl, program, 'uSampler' )
    const uniform_transform = bindUniformMat3( gl, program, 'uTransform' )

    uniform_transform.update(buildTransformMatrix(1,0,0,0))

    let n_faces = 0
    let tileSize = 100


    const transform_matrix = []

    const updateMesh = () => {
        const { vertices, faces, uvs } = buildMesh( tileSize, canvas.width, canvas.height )

        n_faces = faces.length

        attribute_vertices.update( vertices )
        attribute_uvs.update( uvs )
        attribute_index.update( faces )
    }
    updateMesh()


    const debugTransform = createDebugTransform()

    return {

        element: canvas,

        setTransform : ( scale:number, angle:number, tx:number, ty:number ) => {
            uniform_transform.update(buildTransformMatrix(scale, angle, tx, ty, transform_matrix))
            debugTransform( transform_matrix )
        },

        setImage : ( image: HTMLCanvasElement | HTMLImageElement | string ) =>
            (
                typeof image == 'string'
                    ? loadImage( image )
                    : Promise.resolve( image )
            )
                .then( image => uniform_texture.update( image ) )
        ,

        setTileSize : ( s: number ) => {
            tileSize = s
            updateMesh()
        },

        resize : () => {

            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

            updateMesh()
        },

        draw : () => {

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            gl.useProgram(program)

            uniform_texture.bind()
            attribute_vertices.bind()
            attribute_uvs.bind()
            attribute_index.bind()
            uniform_transform.bind()

            gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0)

        }

    }
}
