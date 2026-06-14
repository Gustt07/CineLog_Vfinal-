package com.ueg.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ueg.web.exception.ResourceNotFoundException;
import com.ueg.web.model.Filme;
import com.ueg.web.repository.FilmeRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fcontroller")
@CrossOrigin(origins = "*") // Permitir acesso de qualquer origem para facilitar o desenvolvimento mobile
public class FilmeController {

    @Autowired
    private FilmeRepository filmeRepository;

    // Listar todos os filmes
    @GetMapping("/filmes")
    public List<Filme> listar() {
        return filmeRepository.findAll();
    }

    // Consultar filme por ID
    @GetMapping("/filmes/{id}")
    public ResponseEntity<Filme> consultar(@PathVariable Long id) {
        Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filme não encontrado com id: " + id));
        return ResponseEntity.ok(filme);
    }

    // Inserir novo filme
    @PostMapping("/filmes")
    public Filme inserir(@RequestBody Filme filme) {
        return filmeRepository.save(filme);
    }

    // Alterar filme existente
    @PutMapping("/filmes/{id}")
    public ResponseEntity<Filme> alterar(@PathVariable Long id, @RequestBody Filme filmeDetalhes) {
        Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filme não encontrado com id: " + id));

        filme.setTitulo(filmeDetalhes.getTitulo());
        filme.setNota(filmeDetalhes.getNota());
        filme.setDataAssistida(filmeDetalhes.getDataAssistida());
        filme.setFinalizado(filmeDetalhes.isFinalizado());
        filme.setComentario(filmeDetalhes.getComentario());
        filme.setCapaUrl(filmeDetalhes.getCapaUrl());
        filme.setFavorito(filmeDetalhes.isFavorito());

        Filme atualizado = filmeRepository.save(filme);
        return ResponseEntity.ok(atualizado);
    }

    // Excluir filme
    @DeleteMapping("/filmes/{id}")
    public ResponseEntity<Map<String, Boolean>> excluir(@PathVariable Long id) {
        Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Filme não encontrado com id: " + id));

        filmeRepository.delete(filme);
        Map<String, Boolean> resposta = new HashMap<>();
        resposta.put("excluido", Boolean.TRUE);
        return ResponseEntity.ok(resposta);
    }
}
