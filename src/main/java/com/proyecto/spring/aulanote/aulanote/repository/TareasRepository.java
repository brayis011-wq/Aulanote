package com.proyecto.spring.aulanote.aulanote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.spring.aulanote.aulanote.entity.Tareas;

public interface TareasRepository  extends JpaRepository<Tareas, Integer> {

}
