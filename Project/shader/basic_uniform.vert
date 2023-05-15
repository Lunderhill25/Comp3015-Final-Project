#version 460

layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexTexCoords;
layout (location = 3) in vec4 VertexTangent;

out vec4 Position;
out vec3 Normal;
out vec2 TexCoord;
out vec3 LightDir;
out vec3 ViewDir;

uniform struct LightInfo{
    vec4 Position;
    vec3 La;
    vec3 Ld;
    vec3 Ls;
    vec3 L;
} Light;

uniform mat4 ModelViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 MVP;
uniform mat4 ProjectionMatrix;

void main()
{
    TexCoord = VertexTexCoords;

    Normal=normalize(NormalMatrix*VertexNormal);
    vec3 Tangent = normalize(NormalMatrix*vec3(VertexTangent));
    Position=ModelViewMatrix*vec4(VertexPosition,1.0);

    vec3 binormal=normalize(cross(Normal,Tangent))*VertexTangent.w;
    mat3 toObjectLocal=mat3(Tangent.x,binormal.x,Normal.x,Tangent.y,binormal.y,Normal.y,Tangent.z,binormal.z,Normal.z);
    vec3 pos=vec3(ModelViewMatrix*vec4(VertexPosition,1.0));
    
    LightDir = toObjectLocal*(Light.Position.xyz-pos);
    ViewDir=toObjectLocal*normalize(-pos);

    gl_Position=MVP*vec4(VertexPosition,1.0);
    
}
