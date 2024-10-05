import React, { useState, useEffect } from 'react';
import './App.css'; // Mantén tu archivo CSS

const App = () => {
  const [libro, setLibro] = useState({
    Titulo: '',
    Id_autor: '',
    Isbn: '',
    Editorial: '',
    Año_publicacion: '',
    Categoría: '',
    Cantidad_disponible: '',
    Ubicacion: ''
  });

  const [libros, setLibros] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario

  useEffect(() => {
    fetchLibros();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibro({ ...libro, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `https://backejercicio.onrender.com/api/libros/update/${editId}`
      : 'https://backejercicio.onrender.com/api/libros/create';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(libro),
      });

      const data = await response.json();
      if (response.ok) {
        alert(isEdit ? 'Libro actualizado con éxito' : 'Libro creado con éxito');
        resetForm();
        fetchLibros();
        setIsEdit(false); // Regresar al modo de creación después de editar
        setShowForm(false); // Ocultar formulario después de la creación/edición
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Error al procesar el libro: ' + error.message);
    }
  };

  const fetchLibros = async () => {
    try {
      const response = await fetch('https://backejercicio.onrender.com/api/libros/all');
      const data = await response.json();

      // Verifica el estado de la respuesta
      if (!response.ok) {
        console.log('Error en la respuesta de la API:', response.statusText);
        return;
      }

      console.log('Libros obtenidos:', data);
      setLibros(data.libros);
    } catch (error) {
      console.log('Error al obtener libros:', error);
    }
  };

  const handleEdit = (libro) => {
    setLibro(libro);
    setIsEdit(true);
    setEditId(libro.Id_libro);
    setShowForm(true); // Mostrar el formulario cuando se va a editar
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://backejercicio.onrender.com/api/libros/delete/${id}`, {
        method: 'DELETE',
      });
      alert('Libro eliminado con éxito');
      fetchLibros();
    } catch (error) {
      console.log('Error al eliminar el libro:', error);
    }
  };

  const resetForm = () => {
    setLibro({
      Titulo: '',
      Id_autor: '',
      Isbn: '',
      Editorial: '',
      Año_publicacion: '',
      Categoría: '',
      Cantidad_disponible: '',
      Ubicacion: ''
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEdit(false); // Regresa al modo de creación
    setShowForm(false); // Ocultar formulario
  };

  return (
    <div className="App">
      <h1>Gestión de Libros</h1>
      {/* Encabezado con botón y título en la misma línea */}
      <div className="header-container">
        <h2>Lista de Libros</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>Agregar Libro</button>
      </div>

      {/* Mostrar el formulario solo si showForm es verdadero */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEdit ? 'Editar Libro' : 'Crear Libro'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="Titulo" placeholder="Título" value={libro.Titulo} onChange={handleChange} required />
              <input type="number" name="Id_autor" placeholder="ID del Autor" value={libro.Id_autor} onChange={handleChange} required />
              <input type="text" name="Isbn" placeholder="ISBN" value={libro.Isbn} onChange={handleChange} required />
              <input type="text" name="Editorial" placeholder="Editorial" value={libro.Editorial} onChange={handleChange} required />
              <input type="date" name="Año_publicacion" value={libro.Año_publicacion} onChange={handleChange} required />
              <input type="text" name="Categoría" placeholder="Categoría" value={libro.Categoría} onChange={handleChange} required />
              <input type="number" name="Cantidad_disponible" placeholder="Cantidad disponible" value={libro.Cantidad_disponible} onChange={handleChange} required />
              <input type="text" name="Ubicacion" placeholder="Ubicación" value={libro.Ubicacion} onChange={handleChange} required />
              <button type="submit" className="submit-button">{isEdit ? 'Actualizar Libro' : 'Crear Libro'}</button>
              {isEdit && <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancelar Edición</button>}
              {!isEdit && <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancelar</button>}
            </form>
          </div>
        </div>
      )}

      {/* Columna para la tabla de libros */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>ID del Autor</th>
              <th>ISBN</th>
              <th>Editorial</th>
              <th>Año</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.Id_libro}>
                <td>{libro.Titulo}</td>
                <td>{libro.Id_autor}</td>
                <td>{libro.Isbn}</td>
                <td>{libro.Editorial}</td>
                <td>{libro.Año_publicacion}</td>
                <td>{libro.Categoría}</td>
                <td>{libro.Cantidad_disponible}</td>
                <td>{libro.Ubicacion}</td>
                <td>
                  <div className="buttons">
                    <button className="edit" onClick={() => handleEdit(libro)}>Editar</button>
                    <button className="delete" onClick={() => handleDelete(libro.Id_libro)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
