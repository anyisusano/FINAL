let citas = JSON.parse(localStorage.getItem("citas")) || [];
let editandoId = null;


const imagenesMascotas = {
  huron: "https://i.gifer.com/cV0.gif",
  iguana: "https://i.makeagif.com/media/12-06-2017/sTViAt.gif",
  serpiente: "https://media.tenor.com/BXutxf8CHUMAAAAM/snake-cobra.gif",
  erizo: "https://i.pinimg.com/originals/2a/95/95/2a95959914ae8c3a540ccc3f9d26b84c.gif",
  canario: "https://i.pinimg.com/originals/34/a6/d0/34a6d07a9c34ca68ac57a47558c9595d.gif",
  cuy: "https://usagif.com/wp-content/uploads/2022/fzk5d/guinea-pig-acegif-39-guinea-pig-eating-carrot.gif",
  camaleon: "https://i.gifer.com/GhDi.gif",
  gato: "https://media.tenor.com/o_5RQarGvJ0AAAAM/kiss.gif",
  ardilla: "https://cdn.pixabay.com/animation/2023/08/12/21/04/21-04-54-438_512.gif",
  pez: "https://i.gifer.com/MTNX.gif",
  otro: "https://via.placeholder.com/150?text=Mascota"
};


document.addEventListener("DOMContentLoaded", () => {
  
  const fechaInput = document.getElementById("fecha");
  const hoy = new Date().toISOString().split("T")[0];
  fechaInput.min = hoy;


  mostrarCitas();


  document.getElementById("buscarPropietario")?.addEventListener("input", filtrarPorPropietario);
});


function guardar() {
  if (!validarFormulario()) return;

  const nuevaCita = {
    id: editandoId || Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    propietario: document.getElementById("propietario").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value,
    mascota: document.getElementById("mascota").value,
    sintomas: document.getElementById("sintomas").value.trim(),
    estado: document.getElementById("estado").value,
  };

  if (editandoId) {

    const indice = citas.findIndex((cita) => cita.id === editandoId);
    if (indice !== -1) {
      citas[indice] = nuevaCita;
      mostrarMensaje("Cita actualizada correctamente", "success");
    }
  } else {

    citas.push(nuevaCita);
    mostrarMensaje("Cita guardada correctamente", "success");
  }


  localStorage.setItem("citas", JSON.stringify(citas));
  filtrarPorEstado();
  limpiarFormulario();


  const modal = bootstrap.Modal.getInstance(document.getElementById("modalCita"));
  if (modal) modal.hide();
}


function mostrarCitas(lista = citas) {
  const contenedor = document.getElementById("registros");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info d-flex align-items-center">
          <i class="bi bi-info-circle-fill me-2"></i>
          No hay citas registradas
        </div>
      </div>
    `;
    return;
  }

  lista.forEach((cita) => {
    const tipoMascota = cita.mascota.toLowerCase();
    const imagen = imagenesMascotas[tipoMascota] || imagenesMascotas.otro;
    const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    contenedor.innerHTML += `
      <div class="col">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-paw me-2"></i>${cita.nombre}
            </h5>
            <span class="badge ${getBadgeClass(cita.estado)}">${cita.estado}</span>
          </div>
          
          <img src="${imagen}" class="card-img-top" alt="${cita.mascota}">
          
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">
              <i class="fas fa-user me-2"></i>${cita.propietario}
            </h6>
            
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item d-flex justify-content-between">
                <span><i class="fas fa-phone me-2"></i>Teléfono:</span>
                <span>${cita.telefono}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span><i class="fas fa-calendar-day me-2"></i>Fecha:</span>
                <span>${fechaFormateada}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span><i class="fas fa-clock me-2"></i>Hora:</span>
                <span>${cita.hora}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span><i class="fas fa-dog me-2"></i>Tipo:</span>
                <span>${cita.mascota}</span>
              </li>
            </ul>
            
            <div class="mb-3">
              <h6 class="fw-bold"><i class="fas fa-notes-medical me-2"></i>Síntomas:</h6>
              <p class="card-text">${cita.sintomas}</p>
            </div>
          </div>
          
          <div class="card-footer bg-transparent">
            <div class="d-flex justify-content-between">
              <button onclick="editarCita(${cita.id})" class="btn btn-warning btn-sm">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button onclick="eliminarCita(${cita.id})" class="btn btn-danger btn-sm">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}


function eliminarCita(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      citas = citas.filter((cita) => cita.id !== id);
      localStorage.setItem("citas", JSON.stringify(citas));
      mostrarCitas();
      mostrarMensaje("Cita eliminada correctamente", "success");
    }
  });
}


function editarCita(id) {
  const cita = citas.find((c) => c.id === id);
  if (!cita) return;

  editandoId = id;

  
  document.getElementById("nombre").value = cita.nombre;
  document.getElementById("propietario").value = cita.propietario;
  document.getElementById("telefono").value = cita.telefono;
  document.getElementById("fecha").value = cita.fecha;
  document.getElementById("hora").value = cita.hora;
  document.getElementById("mascota").value = cita.mascota;
  document.getElementById("sintomas").value = cita.sintomas;
  document.getElementById("estado").value = cita.estado;


  document.getElementById("btnGuardar").textContent = "Actualizar";
  document.getElementById("modalCitaLabel").textContent = "Editar Cita";

  
  const modal = new bootstrap.Modal(document.getElementById("modalCita"));
  modal.show();
}


function filtrarPorEstado() {
  const estadoSeleccionado = document.getElementById("filtroEstado").value;
  const citasFiltradas = estadoSeleccionado
    ? citas.filter((cita) => cita.estado === estadoSeleccionado)
    : citas;

  mostrarCitas(citasFiltradas);
}


function filtrarPorPropietario() {
  const textoBusqueda = document.getElementById("buscarPropietario").value.toLowerCase();
  const estadoSeleccionado = document.getElementById("filtroEstado").value;
  
  let citasFiltradas = citas.filter((cita) =>
    cita.propietario.toLowerCase().includes(textoBusqueda) ||
    cita.nombre.toLowerCase().includes(textoBusqueda)
  );

  if (estadoSeleccionado) {
    citasFiltradas = citasFiltradas.filter((cita) => cita.estado === estadoSeleccionado);
  }

  mostrarCitas(citasFiltradas);
}

function limpiarFormulario() {
  document.getElementById("formCita").reset();
  editandoId = null;
  document.getElementById("btnGuardar").textContent = "Guardar";
  document.getElementById("modalCitaLabel").textContent = "Nueva Cita";
}

function validarFormulario() {
  const campos = [
    { id: 'nombre', mensaje: 'Por favor ingresa el nombre de la mascota' },
    { id: 'propietario', mensaje: 'Por favor ingresa el nombre del propietario' },
    { id: 'telefono', mensaje: 'Por favor ingresa un número de teléfono válido (10 dígitos)' },
    { id: 'fecha', mensaje: 'Por favor selecciona una fecha válida' },
    { id: 'hora', mensaje: 'Por favor selecciona una hora entre 8:00 y 20:00' },
    { id: 'mascota', mensaje: 'Por favor selecciona el tipo de mascota' },
    { id: 'sintomas', mensaje: 'Por favor describe los síntomas' },
    { id: 'estado', mensaje: 'Por favor selecciona el estado de la cita' }
  ];

  for (const campo of campos) {
    const elemento = document.getElementById(campo.id);
    const valor = elemento.value.trim();
    
    if (!valor) {
      mostrarError(elemento, campo.mensaje);
      return false;
    }
    
    
    if (campo.id === 'telefono' && !/^\d{10}$/.test(valor)) {
      mostrarError(elemento, 'El teléfono debe tener 10 dígitos');
      return false;
    }
    
    if (campo.id === 'hora') {
      const hora = valor.split(':')[0];
      if (hora < 8 || hora > 19) {
        mostrarError(elemento, 'El horario de atención es de 8:00 a 20:00');
        return false;
      }
    }
    
   
    limpiarError(elemento);
  }

 
  const fechaInput = document.getElementById('fecha');
  const fecha = new Date(fechaInput.value);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fecha < hoy) {
    mostrarError(fechaInput, 'No puedes agendar citas en fechas pasadas');
    return false;
  }

  return true;
}


function mostrarError(elemento, mensaje) {
  limpiarError(elemento);
  elemento.classList.add('is-invalid');
  
  const divError = document.createElement('div');
  divError.className = 'invalid-feedback';
  divError.textContent = mensaje;
  
  elemento.parentNode.appendChild(divError);
  elemento.focus();
}


function limpiarError(elemento) {
  elemento.classList.remove('is-invalid');
  
  const feedback = elemento.parentNode.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.remove();
  }
}


function mostrarMensaje(mensaje, tipo = "success") {
  Swal.fire({
    position: 'center',
    icon: tipo,
    title: mensaje,
    showConfirmButton: false,
    timer: 1500
  });
}


function getBadgeClass(estado) {
  switch (estado) {
    case "Abierta": return "bg-primary";
    case "Terminada": return "bg-success";
    case "Anulada": return "bg-danger";
    default: return "bg-secondary";
  }
}


function borrarTodo() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Esta acción eliminará todas las citas!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("citas");
      citas = [];
      mostrarCitas();
      mostrarMensaje("Todas las citas han sido eliminadas", "success");
    }
  });
}