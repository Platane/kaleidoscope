precision highp float;

varying vec2 vCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vCoord.s, vCoord.t));
}