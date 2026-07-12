package com.rutasmart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.security.JwtService;
import com.rutasmart.service.interfaces.ChoferService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChoferController.class)
@WithMockUser(roles = "ADMINISTRADOR")
class ChoferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ChoferService choferService;

    @MockitoBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registrarChofer() throws Exception {

        ChoferCreateDTO dto = new ChoferCreateDTO();
        dto.setIdUsuario(1L);
        dto.setNumeroLicencia("A123456");

        ChoferResponseDTO response = new ChoferResponseDTO();
        response.setIdChofer(1L);

        when(choferService.crear(any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/choferes")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

    }

}
