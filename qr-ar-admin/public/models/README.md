# Modelos 3D para AR

Esta carpeta contiene los archivos de modelos 3D (.glb, .gltf) que se usan en las experiencias de realidad aumentada.

## Instrucciones para agregar modelos:

1. **Descargar modelos desde Sketchfab:**
   - Ve a https://sketchfab.com
   - Busca el modelo que quieres usar
   - Descarga el archivo en formato GLB (recomendado) o GLTF
   - Renombra el archivo usando el ID del modelo de Sketchfab

2. **Nombrado de archivos:**
   - Usa el ID del modelo como nombre: `{model-id}.glb`
   - Ejemplo: `6e47b68d13a0413d8fd5fa248a639e8b.glb` (para el modelo Ti-pche)

3. **Formatos soportados:**
   - `.glb` (recomendado - archivo binario compacto)
   - `.gltf` (archivo JSON con assets separados)

4. **Limitaciones:**
   - Tamaño máximo recomendado: 10MB por archivo
   - Los modelos muy complejos pueden causar problemas de rendimiento en dispositivos móviles

## Modelos de ejemplo disponibles:

- **Astronauta**: https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb
- **Pato**: https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf
- **Casco Dañado**: https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf

## Para el modelo Ti-pche:

Para usar el modelo Ti-pche de Sketchfab que compartiste:
1. Ve a: https://sketchfab.com/3d-models/ti-pche-6e47b68d13a0413d8fd5fa248a639e8b
2. Descarga el archivo GLB
3. Renómbralo a: `6e47b68d13a0413d8fd5fa248a639e8b.glb`
4. Colócalo en esta carpeta
5. El modelo estará disponible en la experiencia de prueba "test-tipche"