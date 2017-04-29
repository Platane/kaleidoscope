export const createProgram = ( gl: WebGLRenderingContext, vertexShaderSource : string, fragmentShaderSource : string ) : WebGLProgram => {

    const shaderProgram = gl.createProgram()

    ;[
        [ vertexShaderSource, gl.VERTEX_SHADER ],
        [ fragmentShaderSource, gl.FRAGMENT_SHADER  ],

    ].forEach( ([ source, shaderType ]) => {

        const shader = gl.createShader(shaderType)

        gl.shaderSource(shader, source)

        gl.compileShader(shader)

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
           throw ('An error occurred compiling the shaders: \n' + ( gl.getShaderInfoLog(shader) || '' )+'\n'+source )

        gl.attachShader(shaderProgram, shader)
    })

    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
        throw 'Unable to initialize the shader program.'

    return shaderProgram
}

export const bindUniformMat3 = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string ) => {

    let mat3 = new Float32Array(9)
    const location = gl.getUniformLocation(shaderProgram, name)

    if ( +location == -1 )
        throw Error(`uniform ${name} not found in the shader program`)

    return {
        update : ( v: Array< number > ) =>
            mat3.set( v )
        ,

        bind : () =>
            gl.uniformMatrix3fv( location, false, mat3 )
        ,
    }
}

export const bindAttribute = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string, size?: number = 1 ) => {

    const buffer        = gl.createBuffer()

    const location      = gl.getAttribLocation(shaderProgram, name)

    if ( +location == -1 )
        throw Error(`attribute ${name} not found in the shader program`)

    gl.enableVertexAttribArray(location)

    return {
        update : ( arr: Array<number> ) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from( arr ), gl.STATIC_DRAW)
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
        },
        bind : () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
        },
    }
}

export const bindElementIndex = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram ) => {

    const buffer         = gl.createBuffer()

    return {
        update : ( arr: Array<number> ) => {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arr), gl.STATIC_DRAW)
        },
        bind : () => {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
        },
    }
}


export const bindUniformTexture = ( gl: WebGLRenderingContext, shaderProgram: WebGLProgram, name: string ) => {

    const texture = gl.createTexture()

    const location = gl.getUniformLocation(shaderProgram, name)

    if ( +location == -1 )
        throw Error(`uniform ${name} not found in the shader program`)

    const textureUnit = 0

    return {
        update : ( image: HTMLCanvasElement | HTMLImageElement ) => {

            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(
               gl.TEXTURE_2D,
               0,                   // level , for mimapping i guess
               gl.RGBA,             // internalformat ,
               gl.RGBA,             // format
               gl.UNSIGNED_BYTE,    // type
               image
            )

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            // gl.generateMipmap(gl.TEXTURE_2D)

            gl.bindTexture(gl.TEXTURE_2D, null)

        },
        bind : () => {
            gl.activeTexture(gl.TEXTURE0+textureUnit)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.uniform1i(location, textureUnit)
        },
    }
}