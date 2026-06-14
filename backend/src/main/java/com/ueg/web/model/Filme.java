package com.ueg.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="filme")
public class Filme {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="titulo", nullable = false)
    private String titulo;
    
    @Column(name="nota")
    private int nota;
    
    @Column(name="data_assistida")
    private String dataAssistida;
    
    @Column(name="finalizado")
    private boolean finalizado;
    
    @Column(name="comentario", length = 1000)
    private String comentario;
    
    @Column(name="capa_url", length = 5000)
    private String capaUrl;
    
    @Column(name="favorito")
    private boolean favorito;

    public Filme() {}

    public Filme(Long id, String titulo, int nota, String dataAssistida, boolean finalizado, String comentario, String capaUrl, boolean favorito) {
        this.id = id;
        this.titulo = titulo;
        this.nota = nota;
        this.dataAssistida = dataAssistida;
        this.finalizado = finalizado;
        this.comentario = comentario;
        this.capaUrl = capaUrl;
        this.favorito = favorito;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public int getNota() { return nota; }
    public void setNota(int nota) { this.nota = nota; }
    public String getDataAssistida() { return dataAssistida; }
    public void setDataAssistida(String dataAssistida) { this.dataAssistida = dataAssistida; }
    public boolean isFinalizado() { return finalizado; }
    public void setFinalizado(boolean finalizado) { this.finalizado = finalizado; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public String getCapaUrl() { return capaUrl; }
    public void setCapaUrl(String capaUrl) { this.capaUrl = capaUrl; }
    public boolean isFavorito() { return favorito; }
    public void setFavorito(boolean favorito) { this.favorito = favorito; }
}
