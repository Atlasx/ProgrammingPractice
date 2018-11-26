uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

attribute vec3 aPosition;

void main() {
  vec4 position = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}