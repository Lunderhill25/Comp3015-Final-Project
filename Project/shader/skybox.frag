#version 460

in vec3 Vec;

layout (binding = 2) uniform samplerCube SkyBoxTex;

layout (location = 0) out vec4 FragColor;

void main() {
    vec3 Colour=vec3(0.0);
    vec3 texColor = texture(SkyBoxTex,normalize(Vec)).rgb;
    FragColor = vec4(texColor,1.0);
}
