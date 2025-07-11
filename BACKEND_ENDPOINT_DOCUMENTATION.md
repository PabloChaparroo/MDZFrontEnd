/* 
DOCUMENTACIÓN DEL ENDPOINT OPTIMIZADO
=====================================

Este archivo contiene la documentación del endpoint que debe implementarse en el backend
para que funcione con el nuevo sistema de paginación optimizada.

ENDPOINT DEL CONTROLADOR:
========================

@GetMapping("/catalogo-optimizado/{pageNumber}")
public ResponseEntity<?> getCatalogoMueblesOptimizado(@PathVariable int pageNumber) {
    logger.info("\n=== [API-CATALOGO-OPTIMIZADO] INICIANDO CONSULTA SÚPER OPTIMIZADA ===");
    logger.info("Página solicitada: {}", pageNumber);
    
    try {
        // El servicio debe retornar un objeto con la estructura esperada
        Map<String, Object> resultado = muebleService.getCatalogoMueblesOptimizado(pageNumber);
        
        logger.info("✅ [API-CATALOGO-OPTIMIZADO] Catálogo súper optimizado cargado - Página: {}", pageNumber);
        
        return ResponseEntity.ok(resultado);
        
    } catch (Exception e) {
        logger.error("❌ [API-CATALOGO-OPTIMIZADO] Error interno al obtener catálogo optimizado: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Error interno del servidor"));
    }
}

MÉTODO DEL SERVICIO:
===================

public Map<String, Object> getCatalogoMueblesOptimizado(int pageNumber) {
    try {
        // Configurar paginación (12 elementos por página)
        int pageSize = 12;
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize); // pageNumber - 1 porque el frontend envía 1-based
        
        // Obtener muebles paginados (solo muebles activos)
        Page<Mueble> mueblesPage = muebleRepository.findByFechaBajaMuebleIsNull(pageable);
        
        // Preparar la respuesta
        Map<String, Object> response = new HashMap<>();
        response.put("content", mueblesPage.getContent());
        response.put("currentPage", pageNumber);
        response.put("totalPages", mueblesPage.getTotalPages());
        response.put("totalElements", mueblesPage.getTotalElements());
        response.put("hasNext", mueblesPage.hasNext());
        response.put("hasPrevious", mueblesPage.hasPrevious());
        
        return response;
        
    } catch (Exception e) {
        logger.error("Error al obtener catálogo optimizado: {}", e.getMessage());
        throw new RuntimeException("Error al obtener el catálogo de muebles", e);
    }
}

CONSULTA DE REPOSITORY (JPA):
=============================

// En MuebleRepository.java
@Query("SELECT m FROM Mueble m WHERE m.fechaBajaMueble IS NULL ORDER BY m.fechaAltaMueble DESC")
Page<Mueble> findByFechaBajaMuebleIsNull(Pageable pageable);

// O usando método derivado:
Page<Mueble> findByFechaBajaMuebleIsNullOrderByFechaAltaMuebleDesc(Pageable pageable);

ESTRUCTURA DE RESPUESTA ESPERADA:
=================================

{
    "content": [
        {
            "id": 1,
            "nombreMueble": "Mesa de comedor",
            "colorMueble": "Blanco",
            "dimension": "120x80x75cm",
            "tipoMadera": "MELAMINA",
            "precio": 25000,
            "descripcion": "Mesa moderna para comedor",
            "fechaAltaMueble": "2024-01-15",
            "fechaModificacionMueble": null,
            "fechaBajaMueble": null,
            "categoria": {
                "id": 1,
                "nombreCategoria": "Mesas"
            },
            "imagenes": [
                {
                    "id": 1,
                    "imagenes": "base64_string_here",
                    "esPortada": true
                }
            ]
        }
        // ... más muebles (máximo 12)
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalElements": 58,
    "hasNext": true,
    "hasPrevious": false
}

BENEFICIOS DE LA IMPLEMENTACIÓN:
===============================

1. **Rendimiento optimizado**: Solo se cargan 12 muebles por página
2. **Memoria eficiente**: No se cargan todos los muebles en memoria
3. **Experiencia de usuario mejorada**: Navegación rápida entre páginas
4. **Escalabilidad**: Funciona bien con miles de muebles
5. **SEO amigable**: URLs específicas para cada página
6. **Responsivo**: Adaptado para móviles y desktop

CONFIGURACIÓN RECOMENDADA:
=========================

- Página por defecto: 1
- Elementos por página: 12
- Orden: Por fecha de alta descendente (más nuevos primero)
- Filtro: Solo muebles activos (fechaBajaMueble IS NULL)
- Caché: Opcional, para mejorar rendimiento
*/
