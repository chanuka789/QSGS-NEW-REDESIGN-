/** True when WebGL runs on the CPU (no GPU): animated scenes would stutter there. */
export function isSoftwareGL(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || "");
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}
