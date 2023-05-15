#version 460

const float PI = 3.14159265358979323846;

in vec4 Position;
in vec3 Normal;
in vec2 TexCoord;
in vec3 LightDir;
in vec3 ViewDir;

layout (binding = 0) uniform sampler2D colour;
layout (binding = 1) uniform sampler2D normalMap;

layout (location = 0) out vec4 FragColor;

uniform struct LightInfo{
    vec4 Position;
    vec3 La;
    vec3 Ld;
    vec3 Ls;
    vec3 L;
} Light;

uniform struct MaterialInfo{
    vec3 Ka;
    vec3 Kd;
    vec3 Ks;
    float Rough;
    bool Metal;
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

float ggxDistribution(float nDotH)
{
    float alpha2 = Material.Rough * Material.Rough * Material.Rough;
    float d = (nDotH * nDotH) * (alpha2 - 1) +1;
    return alpha2 / (PI*d*d);
}

float geomSmith (float dotProd)
{
    float k = (Material.Rough + 1.0) * (Material.Rough + 1.0)/8.0;
    float denom = dotProd * (1-k) + k;
    return 1.0/denom;
}

vec3 schlickFresnel(float lDotH){
    vec3 f0 = vec3(0.04);
    if(Material.Metal){
        f0 = getColour();  
    }
    return f0+(1-f0)*pow(1.0-lDotH, 5);
}

vec3 microfacetModel(vec3 position, vec3 n){
    vec3 diffuseBrdf = vec3(0.0);
    if(!Material.Metal){
        diffuseBrdf = getColour();
    }

    vec3 l = vec3(0.0), lightI = Light.L;
    if(Light.Position.w == 0.0){
        l = normalize(Light.Position.xyz);
    } 
    else{
        l = Light.Position.xyz - position;
        float dist = length(l);
        l = normalize(l);
        lightI /= (dist*dist);
    }

    vec3 v = normalize(-position);
    vec3 h = normalize(v+l);
    float nDotH = dot(n,h);
    float lDotH = dot(l,h);
    float nDotL = max(dot(n,l),0.0);
    float nDotV = dot(n,v);
    vec3 specBrdf = 0.25 * ggxDistribution(nDotH) * schlickFresnel(lDotH) * geomSmith(nDotL) * geomSmith(nDotV);

    return (diffuseBrdf + PI * specBrdf) * lightI * nDotL;
}

void main() {
    //vec3 Colour=vec3(0.0);
    //vec3 norm = texture(normalMap,TexCoord).xyz;
    //norm.xy=2.0*norm.xy-1.0;
    //FragColor = vec4(blinnphong(norm,Position),1.0);
    vec3 sum = vec3(0);
    vec3 n = normalize(Normal);
    sum+= microfacetModel(Position.xyz,n);
    sum = pow(sum,vec3(1.0/2.2));
    FragColor = vec4(sum,1);
}
