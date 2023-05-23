# Comp3015 Final Project
## System and Version
Visual Studio 2019
Windows 10

## How it works
Upon running the executable, a window is created displaying the dragonslayer model. The model is within a skybox and the entire scene spins around.

## Code Walkthrough
This section details the aspects of each file that plays the most significance to the running of the executable in the intended method. 

### scenebasic_uniform.cpp
1. In the initialisation of SceneBasic_Uniform the Dragonslayer model and the skybox are loaded
2. In initScene, the view and projection are set before the textures for the sword and skybox are loaded. The light and material values for the basic_uniform shaders are also set here.
3. Compile links the appropriate vert and frag shaders to their own programs.
4. Update is where the view is rotated.
5. Inside of render the model values are changed for the models seperately. The programs are also used seperately for each model. 
6. setMatrices sets the uniform values for the shader files dependent on the view and model values.
7. resize is where the display is created for the user.

### basic_uniform.vert
1. The file takes in vertex information and the information on the light source and matrices.
2. It then calculates values to do with light, view and and position.

### basic_uniform.frag
1. Initially the textures are binded to prepare for rendering.
2. The light and material structures are created here.
3. getColour gets the colour from the textures bound previously.
4. ggxDistribution, geomSmith, schlickFresnel and microfacetModel all work together to implement the PBR model.
5. In microfacetModel the calculations using the other functions are formed.
6. In main the microfacetModel is used to calculate the final fragment colour

### skybox.vert
1. This file takes in the matrices to get a gl_Position and passes the VertexPosition to the frag file.

### skybox.frag
1. This file takes in the VertexPosition and only the bound texture for the skybox.
2. Then the FragColor is calculated using the two input values.

## Predicted Mark
![Comp3015 CW2 Rubric](https://github.com/Lunderhill25/Comp3015-Final-Project/assets/72555440/6be01415-a8a9-42f2-b8a7-777e340f3f61)


## Youtube Link
