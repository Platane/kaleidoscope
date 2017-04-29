precision highp float;

attribute vec2 aVertexPosition;
attribute vec2 aVertexUV;

uniform mat3 uTransform;

varying vec2 vCoord;

void main(void) {
    gl_Position = vec4( aVertexPosition, 0.0, 1.0 );

    vCoord = vec2(
        uTransform[0][0] * aVertexUV.x + uTransform[0][1] * aVertexUV.y + uTransform[0][2],
        uTransform[1][0] * aVertexUV.x + uTransform[1][1] * aVertexUV.y + uTransform[1][2]
    );
}