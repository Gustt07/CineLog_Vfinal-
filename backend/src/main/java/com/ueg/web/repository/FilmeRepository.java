package com.ueg.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ueg.web.model.Filme;

@Repository
public interface FilmeRepository extends JpaRepository<Filme, Long> {
}
