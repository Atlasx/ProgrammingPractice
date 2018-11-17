precision highp float;

uniform int width;
uniform int height;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(10.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float cutoff(vec2 pos) {
	
	float w = float(height)/10.0;   //Width of the cutoff transition
	float h = float(height)/2.0; 	//Height of the cutoff transition

	float y = min(pos.y-h, h);

	return (y-w)/(h-w);
}

void main() {
	float n = noise(gl_FragCoord.xy * 0.03);
	vec3 col = vec3(0.5 * n) * cutoff(gl_FragCoord.xy);

	col = vec3(cutoff(gl_FragCoord.xy));
	
	gl_FragColor = vec4(col, 1.0);
}