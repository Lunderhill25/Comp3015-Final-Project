# Comp3015-Set Exercises
## System and Version
Visual Studio 2019

Windows 10

## How it works
Upon running the executable, a window is created displaying the rendered model and the applied textures. 
The view is then rotated to give the impression that the model is spinning.

## Code Walkthrough
### scenebasic_uniform.cpp
1. In the initialisation of SceneBasic_Uniform the SwordOfTheDefeated model is loaded from the media file.
2. In initScene, the view and projection are initially set before loading all 3 textures of the sword. 
This is also where the 3 lights and their values are set.
3. compile links the vert and frag shader files for later use.
4. update is where the rotate command is contained.
5. Inside of render the model is scaled to a reasonable size and it's material values are set before the sword is rendered itself.
6. setMatrices is where the values in the cpp file are passed to the shader files in order to calculate the rendering correctly.
7. resize is where the display is actually created for the user.

### basic_uniform.vert
1. The file takes in information about the vertices and the matrices set in setMatrices.
2. The texture coordinates, normal and position are calculated and passed to the fragment shader.

### basic_uniform.frag
1. At first the textures are binded to prepare for rendering.
2. The structs for both the lights and materials are also created here.
3. getColour is used to combine all of the textures into one color vector.
4. phong is the implementation of the phong shader
5. blinnphong is th implementation of the blinn-phong shader.
6. toon is an implementation of the toon shader which doesn't contain the specular aspect of the rendering.
7. In main the desired function (toon in this case) is called and the resulting fragment colours returned. 

## Predicted Mark Obtained
Upon Looking at the rubric I am confident in meeting all of the criteria in green. 
The clear limitation lies in the lack of a plane being in the scene. 
For this reason I cannot reasonably enter the 50-60 range. Since that is the case, 
I'd estimate my score to be 48 with the current level of work.
![image](https://user-images.githubusercontent.com/72555440/228049849-41b5ca5c-b10d-4543-912d-e8f1fa524b4b.png)

## Youtube Link
https://youtu.be/Oamb4JO8M2k
https://youtu.be/rZJM4ZGV1UM
