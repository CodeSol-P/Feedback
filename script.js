// Lista donde guardamos todos los feedbacks del dia
let registros = [];
let calificacion = 0;

// --- LOGICA DE ESTRELLAS ---
document.querySelectorAll('.estrella').forEach(estrella => {

  estrella.addEventListener('click', function () {

    calificacion = parseInt(this.dataset.valor);

    document.querySelectorAll('.estrella').forEach(e => {

      e.classList.toggle(
        'activa',
        parseInt(e.dataset.valor) <= calificacion
      );

    });

  });

});

// --- LOGICA DE ETIQUETAS DE PROBLEMAS ---
document.querySelectorAll('.tag').forEach(tag => {

  tag.addEventListener('click', function () {

    this.classList.toggle('seleccionada');

  });

});

// --- FUNCION PRINCIPAL ---
function enviarFeedback() {

  // Obtener valores
  const operador = document.getElementById('operador').value;
  const nombre = document.getElementById('nombre').value.trim();
  const comentario = document.getElementById('comentario').value.trim();
  const kpi = document.getElementById('kpi').value;

  // 5 POR QUE
  const porque1 = document.getElementById('porque1').value.trim();
  const porque2 = document.getElementById('porque2').value.trim();
  const porque3 = document.getElementById('porque3').value.trim();
  const porque4 = document.getElementById('porque4').value.trim();
  const porque5 = document.getElementById('porque5').value.trim();

  // VALIDACIONES
  if (!operador) {
    alert('Por favor selecciona un operador logistico.');
    return;
  }

  if (!nombre) {
    alert('Por favor ingresa tu nombre.');
    return;
  }

  if (calificacion === 0) {
    alert('Por favor selecciona una calificacion.');
    return;
  }

  if (!kpi) {
    alert('Por favor selecciona un indicador.');
    return;
  }

  if (!porque1 || !porque2) {
    alert('Por favor completá al menos los primeros 2 ¿Por qué?');
    return;
  }

  // Recolectar problemas
  const problemas = [];

  document.querySelectorAll('.tag.seleccionada').forEach(tag => {

    problemas.push(tag.dataset.valor);

  });

  // OBJETO FEEDBACK
  const feedback = {

    Fecha: new Date().toLocaleDateString('es-AR'),

    Hora: new Date().toLocaleTimeString('es-AR'),

    Operador: operador,

    Nombre: nombre,

    KPI: kpi,

    Calificacion: calificacion + ' estrella(s)',

    Problemas:
      problemas.length > 0
        ? problemas.join(', ')
        : 'Ninguno',

    Comentarios: comentario || '(sin comentarios)',

    Porque1: porque1,
    Porque2: porque2,
    Porque3: porque3 || '',
    Porque4: porque4 || '',
    Porque5: porque5 || ''

  };

  // GUARDAR LOCAL
  registros.push(feedback);

  // MOSTRAR EN PANTALLA
  mostrarRegistro(feedback);

  // ENVIAR A GOOGLE SHEETS
  fetch("https://script.google.com/macros/s/AKfycbyWDOIi1hFdkXiyTyt4Xoj_UE6ZZ_7UXcftKoGFi9JwnCZQxCP4OxS30y8_t_KL1ie9/exec", {

    method: "POST",

    body: JSON.stringify(feedback),

  })
  .then(res => res.text())
  .then(data => console.log("Guardado en Sheets:", data))
  .catch(err => console.error("Error:", err));

  // LIMPIAR FORMULARIO
  limpiarFormulario();

  // MENSAJE
  alert('Feedback enviado! Gracias, ' + nombre + '.');

}

// --- MOSTRAR REGISTRO ---
function mostrarRegistro(feedback) {

  document.getElementById('seccion-registros').style.display = 'block';

  const lista = document.getElementById('lista-registros');

  const div = document.createElement('div');

  div.className = 'registro';

  div.innerHTML = `
  
    <strong>${feedback.Nombre}</strong>
    
    &middot; ${feedback.Operador}
    
    &middot; ${feedback.Calificacion}
    
    <br>

    <span style="color:#666">
      KPI: ${feedback.KPI}
    </span>

    <br>

    <span style="color:#666">
      ${feedback.Problemas}
    </span>

    <br>

    <small>
      ${feedback.Fecha} ${feedback.Hora}
    </small>

  `;

  lista.appendChild(div);

}

// --- LIMPIAR FORMULARIO ---
function limpiarFormulario() {

  document.getElementById('operador').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('comentario').value = '';
  document.getElementById('kpi').value = '';

  // LIMPIAR 5 POR QUE
  document.getElementById('porque1').value = '';
  document.getElementById('porque2').value = '';
  document.getElementById('porque3').value = '';
  document.getElementById('porque4').value = '';
  document.getElementById('porque5').value = '';

  // LIMPIAR ESTRELLAS
  calificacion = 0;

  document.querySelectorAll('.estrella').forEach(e => {

    e.classList.remove('activa');

  });

  // LIMPIAR TAGS
  document.querySelectorAll('.tag').forEach(e => {

    e.classList.remove('seleccionada');

  });

}