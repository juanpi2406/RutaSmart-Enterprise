package com.rutasmart.service.impl;

import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Usuario;
import com.rutasmart.mapper.ChoferMapper;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChoferServiceTest {

    @Mock
    private ChoferRepository choferRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ChoferMapper choferMapper;

    @InjectMocks
    private ChoferServiceImpl choferService;

    private Usuario usuario;
    private Chofer chofer;
    private ChoferCreateDTO createDTO;
    private ChoferResponseDTO responseDTO;

    @BeforeEach
    void setUp() {

        usuario = new Usuario();
        usuario.setIdUsuario(1L);

        chofer = new Chofer();
        chofer.setIdChofer(1L);
        chofer.setUsuario(usuario);
        chofer.setNumeroLicencia("A123456");

        createDTO = new ChoferCreateDTO();
        createDTO.setIdUsuario(1L);
        createDTO.setNumeroLicencia("A123456");

        responseDTO = new ChoferResponseDTO();
        responseDTO.setIdChofer(1L);

    }

    @Test
    void crearChoferCorrectamente() {

        when(usuarioRepository.findById(1L))
                .thenReturn(Optional.of(usuario));

        when(choferRepository.existsByUsuario_IdUsuario(1L))
                .thenReturn(false);

        when(choferRepository.existsByNumeroLicencia("A123456"))
                .thenReturn(false);

        when(choferMapper.toEntity(any(ChoferCreateDTO.class)))
        .thenReturn(chofer);

        when(choferRepository.save(any()))
                .thenReturn(chofer);

        when(choferMapper.toResponseDTO(any()))
                .thenReturn(responseDTO);

        ChoferResponseDTO respuesta =
                choferService.crear(createDTO);

        assertNotNull(respuesta);

        verify(choferRepository).save(any());

    }

}