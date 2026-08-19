precision highp float;

varying float vHeight;
varying float vShade;
varying float vDepth;

void main() {
  vec3 rootColor = vec3(0.025, 0.105, 0.125);
  vec3 tipColor = vec3(0.17, 0.34, 0.38);
  vec3 nearColor = vec3(0.018, 0.075, 0.09);
  vec3 color = mix(rootColor, tipColor, smoothstep(0.05, 1.0, vHeight));
  color = mix(color * (0.74 + vShade * 0.34), nearColor, vDepth * 0.38);
  float rim = pow(vHeight, 4.0) * (0.12 + (1.0 - vDepth) * 0.08);
  color += vec3(0.42, 0.58, 0.6) * rim;
  gl_FragColor = vec4(color, 1.0);
}
