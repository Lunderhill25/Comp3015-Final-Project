#include "scenebasic_uniform.h"

#include <sstream>
#include <cstdio>
#include <cstdlib>
#include "helper/texture.h"
#include <string>
using std::string;

#include <iostream>
using std::cerr;
using std::endl;

#include <glm/gtc/matrix_transform.hpp>
#include "helper/glutils.h"

using glm::vec3;
using glm::vec4;
using glm::mat4;

//SceneBasic_Uniform::SceneBasic_Uniform() : : sky(10000.0f)
SceneBasic_Uniform::SceneBasic_Uniform() : sky(10.0f) {
    
    sword = ObjMesh::load("media/Dragonslayer.obj", true, true);
}

void SceneBasic_Uniform::initScene()
{
    angle = glm::radians(90.0f);

    compile();

    glEnable(GL_DEPTH_TEST);
    //model = glm::rotate(model, glm::radians(60.0f), vec3(1.0f, 0.0f, 0.0f));

    view = glm::lookAt(vec3(0.0f, 0.0f, 2.0f), vec3(0.0f, 0.0f, 0.0f), vec3(0.0f, 1.0f, 0.0f));
    
    projection = glm::mat4(1.0f);

    GLuint normalMap = Texture::loadTexture("media/texture/_normal_map.jpg");
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, normalMap);

    GLuint colour = Texture::loadTexture("media/texture/_diffuse.jpg");
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, colour);

    GLuint cubeTex = Texture::loadHdrCubeMap("media/texture/cube/pisa-hdr/pisa");
    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_CUBE_MAP, cubeTex);
    

    prog.setUniform("Light.Position", vec4(0.0f, 0.0f, 0.0f, 1.0f));

    prog.setUniform("Light.La", vec3(0.4f, 0.4f, 0.4f));
    prog.setUniform("Light.Ld", vec3(1.0f, 1.0f, 1.0f));
    prog.setUniform("Light.Ls", vec3(0.1f, 0.1f, 0.1f));

    prog.setUniform("Material.Ka", 0.4f, 0.4f, 0.4f);
    prog.setUniform("Material.Kd", 0.8f, 0.8f, 0.8f);
    prog.setUniform("Material.Ks", 0.2f, 0.2f, 0.2f);
    prog.setUniform("Material.shininess", 0.2f);

}

void SceneBasic_Uniform::compile()
{
	try {
		prog.compileShader("shader/basic_uniform.vert");
		prog.compileShader("shader/basic_uniform.frag");
		prog.link();
		prog.use();

        prog2.compileShader("shader/skybox.vert");
        prog2.compileShader("shader/skybox.frag");
        prog2.link();

	} catch (GLSLProgramException &e) {
		cerr << e.what() << endl;
		exit(EXIT_FAILURE);
	}
}

void SceneBasic_Uniform::update( float t )
{

    view = glm::rotate(view, glm::radians(0.5f), vec3(0.0f, 20.0f, 0.0f));

    float deltaT = t - tPrev;
    if (tPrev == 0.0f) {
        deltaT = 0.0f;
    }
    tPrev = t;
    angle += 0.25f * deltaT;
    if (angle > glm::two_pi<float>()) {
        angle -= glm::two_pi<float>();
    }
}

void SceneBasic_Uniform::render()
{
    glClear(GL_COLOR_BUFFER_BIT| GL_DEPTH_BUFFER_BIT);
  
    prog.use();
    model = glm::mat4(1.0f);
    model = glm::scale(model, glm::vec3(0.003f, 0.003f, 0.003f));
    model = glm::rotate(model, glm::radians(180.0f), vec3(1.0f, 0.0f, 0.0f));
    setMatrices();
    sword->render();

    prog2.use();
    model = glm::mat4(1.0f);
    setMatrices();
    sky.render();

}

void SceneBasic_Uniform::setMatrices() {
    mat4 mv = view * model;
    prog.setUniform("ModelViewMatrix", mv);
    prog.setUniform("NormalMatrix", glm::mat3(vec3(mv[0]), vec3(mv[1]), vec3(mv[2])));
    prog.setUniform("MVP", projection * mv);
    prog.setUniform("ProjectionMatrix", projection);

    prog2.setUniform("ModelViewMatrix", mv);
    prog2.setUniform("NormalMatrix", glm::mat3(vec3(mv[0]), vec3(mv[1]), vec3(mv[2])));
    prog2.setUniform("MVP", projection * mv);
    prog2.setUniform("ProjectionMatrix", projection);
}

void SceneBasic_Uniform::resize(int w, int h)
{
    glViewport(0, 0, w, h);
    width = w;
    height = h;
    projection = glm::perspective(glm::radians(80.0f), (float)w / h, 0.3f, 100.0f);
}