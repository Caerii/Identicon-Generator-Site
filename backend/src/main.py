import hashlib
from flask import Flask, request, jsonify
import numpy as np
import trimesh

app = Flask(__name__)

def generate_hash(input_string):
    """
    A function that generates a SHA-256 hash for the input string
    and returns the hexadecimal representation of the hash.
    """
    return hashlib.sha256(input_string.encode()).hexdigest()

def create_base_face():
    """
    Function to create a detailed base mesh for a humanoid face.
    Returns:
    vertices (np.ndarray): Array of vertices.
    faces (np.ndarray): Array of faces.
    """
    # Base mesh for a human face (simplified example)
    vertices = np.array([
        [0, 0, 0], [1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [0, 0, 2],  # Simplified structure
        [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5],  # Additional vertices for complexity
        # More vertices can be added to increase complexity
    ], dtype=np.float64)
    faces = np.array([
        [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 2, 5], [2, 3, 5], [3, 4, 5], [4, 1, 5],  # Base faces
        [6, 7, 8], [6, 8, 9], [0, 6, 1], [0, 7, 2], [0, 8, 3], [0, 9, 4],  # Additional faces for complexity
        # More faces can be added to increase complexity
    ])
    return vertices, faces

def modify_face(vertices, faces, hash_string):
    """
    Function to modify the base face mesh based on the hash string.
    Parameters:
    vertices (np.ndarray): Base vertices.
    faces (np.ndarray): Base faces.
    hash_string (str): Hash string used to modify the face.

    Returns:
    modified_vertices (np.ndarray): Modified vertices.
    faces (np.ndarray): Faces (unchanged).
    """
    size = len(vertices)
    hash_length = len(hash_string)
    index = 0

    # Modify vertices based on hash
    for i in range(size):
        scale_factor = 1 + int(hash_string[index % hash_length], 16) / 15.0
        vertices[i] *= scale_factor
        index += 1

    return vertices, faces

@app.route('/generate_3d_face', methods=['GET'])
def generate_3d_face_endpoint():
    input_string = request.args.get('input_string', 'example_string')
    hash_string = generate_hash(input_string)
    base_vertices, base_faces = create_base_face()
    modified_vertices, modified_faces = modify_face(base_vertices, base_faces, hash_string)
    face_data = {
        'vertices': modified_vertices.tolist(),
        'faces': modified_faces.tolist()
    }
    return jsonify(face_data)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
