#ifndef SCENEBASIC_UNIFORM_H
#define SCENEBASIC_UNIFORM_H

#include "helper/scene.h"

#include <glad/glad.h>
#include "helper/glslprogram.h"
#include "glm/glm.hpp"
#include "helper/objmesh.h"
#include "helper/plane.h"
#include "helper/skybox.h"
#include <glm/gtc/matrix_transform.hpp>


class SceneBasic_Uniform : public Scene
{
private:
    GLSLProgram prog;
    SkyBox sky;
    std::unique_ptr<ObjMesh> sword;

    float angle;
    float tPrev;

    glm::mat4 rotationMatrix;

    void compile();

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
    void setMatrices();
};

#endif // SCENEBASIC_UNIFORM_H
