precision highp float;

uniform float uTime;
uniform float uReduced;
uniform vec3 uPlayer;

attribute float aPhase;
attribute float aShade;

varying float vHeight;
varying float vShade;
varying float vDepth;

void main() {
  vec3 root = vec3(instanceMatrix[3].xyz);
  vec3 transformed = position;
  float height = clamp(position.y, 0.0, 1.0);
  float windTime = mix(uTime, 0.0, uReduced);
  float breeze = sin(windTime * 1.55 + root.x * 0.72 + root.z * 1.35 + aPhase);
  float gust = sin(windTime * 0.38 + root.x * 0.18) * 0.5 + 0.5;
  float bend = (0.07 + gust * 0.13) * breeze * height * height;

  float playerDistance = distance(root.xz, uPlayer.xz);
  float pressed = 1.0 - smoothstep(0.22, 1.15, playerDistance);
  float pushDirection = root.x < uPlayer.x ? -1.0 : 1.0;
  transformed.y *= mix(1.0, 0.42, pressed * height);
  transformed.x += bend + pushDirection * pressed * height * 0.52;
  transformed.z += pressed * height * 0.12;

  vec4 worldPosition = instanceMatrix * vec4(transformed, 1.0);
  vec4 viewPosition = modelViewMatrix * worldPosition;
  gl_Position = projectionMatrix * viewPosition;

  vHeight = height;
  vShade = aShade;
  vDepth = clamp((root.z + 2.8) / 5.6, 0.0, 1.0);
}
