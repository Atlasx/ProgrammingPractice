precision highp float;

uniform int width;
uniform int height;

uniform float seed; //Seeds the noise
uniform float time; //Shifts the noise over time
uniform float shiftSpeed; //Changes the speed of the noise

// We will interpolate between these two colors for each layer
uniform vec3 fColor; //Foreground Color
uniform vec3 bColor; //Background Color

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Provides the mask between two layers of noise
float cutoff(vec2 pos, int layer) {
	float w = float(height)/4.0;   	  //Width of the cutoff transition
	float h = float(layer) * 50.0;		//Height of the cutoff transition

	float y = min(pos.y-h, h);
	float g = (pos.y - h - w/2.0) / w;

	return 1.0 - clamp(g, 0.0, 1.0);
}

vec3 getColorForLayer(int layer) {
  vec3 mixed;
  float perc = float(layer)/3.0;
  mixed.x = mix(bColor.x, fColor.x, perc);
  mixed.y = mix(fColor.y, bColor.y, perc);
  mixed.z = mix(fColor.z, bColor.z, perc);
  return mix(fColor, bColor, perc);
}

void main() {
	vec3 col = fColor;

  //Time shift
  vec2 frag = gl_FragCoord.xy;
  frag.y += time * shiftSpeed;

  for (int i = 1; i < 5; i++) {
  //Sample the noise for the specific layer
    float n = (snoise(frag.xy * 0.005 + seed + float(i)) + 1.0) / 2.0;

    //Get the current layer cutoff gradient
    float cut = cutoff(gl_FragCoord.xy, 4-i);

    //Apply the cutoff gradient to the noise to get the mask
    float mask = clamp(floor((n + cut) * cut), 0.0, 1.0);

    //Apply the color using the mask
    vec3 newCol = mask * getColorForLayer(i);
    col = mix(col, newCol, mask);
	}

	gl_FragColor = vec4(col, 1.0);
}