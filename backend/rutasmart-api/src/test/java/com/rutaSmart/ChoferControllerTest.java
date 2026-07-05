package com.rutasmart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.service.interfaces.ChoferService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChoferController.class)
class ChoferControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChoferService choferService;

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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

    }

}