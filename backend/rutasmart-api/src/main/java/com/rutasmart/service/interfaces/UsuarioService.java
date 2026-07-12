package com.rutasmart.service.interfaces;

<<<<<<< HEAD
import com.rutasmart.dto.UsuarioCreateDTO;
import com.rutasmart.dto.UsuarioResponseDTO;
import com.rutasmart.dto.UsuarioUpdateDTO;
=======
import com.rutasmart.dto.UsuarioDTO;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

import java.util.List;

public interface UsuarioService {

    /**
     * Lista todos los usuarios.
     */
<<<<<<< HEAD
    List<UsuarioResponseDTO> listar();
=======
    List<UsuarioDTO> listar();
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    /**
     * Busca un usuario por su ID.
     */
<<<<<<< HEAD
    UsuarioResponseDTO buscarPorId(Long id);
=======
    UsuarioDTO buscarPorId(Long id);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    /**
     * Registra un nuevo usuario.
     */
<<<<<<< HEAD
    UsuarioResponseDTO guardar(UsuarioCreateDTO dto);
=======
    UsuarioDTO guardar(UsuarioDTO dto);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    /**
     * Actualiza un usuario existente.
     */
<<<<<<< HEAD
    UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO dto);

    /**
     * Elimina un usuario por su ID.
=======
    UsuarioDTO actualizar(Long id, UsuarioDTO dto);

    /**
     * Elimina un usuario.
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
     */
    void eliminar(Long id);

}