#version 460
in vec4 Position;
in vec3 Normal;
in vec2 TexCoord;
in vec3 LightDir;
in vec3 ViewDir;

layout (binding = 0) uniform sampler2D colour;
layout (binding = 1) uniform sampler2D normalMap;

layout (binding = 2) uniform samplerCube skyBoxTex;

layout (location = 0) out vec4 FragColor;

uniform struct LightInfo{
    vec4 Position;
    vec3 La;
    vec3 Ld;
    vec3 Ls;
} Light;

uniform struct MaterialInfo{
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float shininess;
} Material;

const int levels=3;
const float scaleFactor=1.0/levels;

vec3 getColour()
{
    vec4 colourTexColor = texture(colour,TexCoord);
    //vec4 metalTexColor = texture(metal,TexCoord);
    //vec4 roughnessTexColor = texture(roughness,TexCoord);
    //vec3 col = mix(colourTexColor.rgb,metalTexColor.rgb,0.5f);
    //col = mix(col,roughnessTexColor.rgb,0.5f);
    vec3 col = colourTexColor.rgb;
    return col;
}


vec3 blinnphong(vec3 n,vec4 pos)
{
    vec3 texColor = getColour();
    vec3 ambient=Light.La*texColor;

    vec3 s=normalize(vec3(Light.Position-(pos*Light.Position.w)));
    float sDotN=max(dot(s,n),0.0);
    vec3 diffuse=Light.Ld*sDotN*texColor;
    vec3 spec=vec3(0.0);
    if(sDotN>0.0){
        vec3 v=normalize(-pos.xyz);
        vec3 h=normalize(v+s);
        spec=Light.Ls*Material.Ks*pow(max(dot(h,n),0.0),Material.shininess);
    }
    return ambient+diffuse+spec;
    
}

/*
vec3 blinnphongNoPos(int light,vec3 n)
{
    vec3 texColor = getColour();
    vec3 ambient=Light.La*Material.Ka*texColor;

    vec3 s=normalize(LightDir);
    float sDotN=max(dot(s,n),0.0);
    vec3 diffuse=Light.Ld*Material.Kd*sDotN*texColor;
    vec3 spec=vec3(0.0);
    if(sDotN>0.0){
        vec3 v=normalize(ViewDir);
        vec3 h=normalize(v+s);
        spec=Light.Ls*Material.Ks*pow(max(dot(h,n),0.0),Material.shininess)*texColor;
    }
    return ambient+diffuse+spec;
    
}
*/

vec3 toon(vec3 n,vec4 pos)
{
    vec3 texColor = getColour();

    //vec3 ambient=lights[light].La*Material.Ka*texColor;
    vec3 ambient=Light.La*Material.Ka;
    vec3 s=normalize(vec3(Light.Position-(pos*Light.Position.w)));
    float sDotN=max(dot(s,n),0.0);
    vec3 diffuse=Material.Kd*floor(sDotN*levels)*scaleFactor*texColor;

    return ambient+diffuse;
}

void main() {
    vec3 Colour=vec3(0.0);
    vec3 norm = texture(normalMap,TexCoord).xyz;
    norm.xy=2.0*norm.xy-1.0;
    //FragColor+=vec4(toon(norm,Position),1.0);
    FragColor = vec4(blinnphong(norm,Position),1.0);
}
