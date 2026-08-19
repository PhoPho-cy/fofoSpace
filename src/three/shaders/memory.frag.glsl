precision highp float;

uniform float uTime;
uniform float uDetail;
uniform vec2 uResolution;
uniform vec2 uPointer;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(13.1, 7.7);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);
  p -= uPointer * 0.045;

  float t = uTime * 0.055;
  float low = fbm(p * 2.2 + vec2(t, -t * 0.45));
  float detail = fbm(p * 5.2 - vec2(t * 1.4, t));
  float density = mix(low, low * 0.68 + detail * 0.32, uDetail);

  float tunnel = 1.0 - smoothstep(0.24, 1.05, length(p * vec2(0.72, 1.14)));
  float veinY = sin((p.x + t) * 8.0) * 0.035 + sin((p.x - t * 0.7) * 17.0) * 0.012;
  float vein = exp(-42.0 * abs(p.y + 0.20 - veinY));
  vein *= 0.48 + 0.52 * sin((p.x - t * 2.5) * 12.0);
  vein = max(vein, 0.0);

  vec3 abyss = vec3(0.012, 0.024, 0.043);
  vec3 cyan = vec3(0.035, 0.125, 0.155);
  vec3 petal = vec3(0.88, 0.67, 0.79);
  vec3 color = mix(abyss, cyan, density * (0.34 + tunnel * 0.42));
  color += petal * vein * (0.25 + tunnel * 0.75);
  color *= 0.38 + tunnel * 0.82;

  float grain = hash(gl_FragCoord.xy + uTime) - 0.5;
  color += grain * 0.018 * uDetail;
  gl_FragColor = vec4(color, 1.0);
}
