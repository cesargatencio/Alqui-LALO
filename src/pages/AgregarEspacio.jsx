import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadEspacioImage } from "../services/SupabaseService";
import { addEspacio } from "../services/EspacioService";
import "./AgregarEspacio.css";

const AgregarEspacio = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    capacidad: "",
    precio: "",
    categoria: "", 
    imagenPath: "",
    imagenUrl: "",
  });
  const [imagenPreview, setImagenPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMessage("");
    setSuccessMessage("");
    setSubiendoImagen(true);

    // Preview local
    const reader = new FileReader();
    reader.onload = (ev) => setImagenPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Subir a Supabase
    const extension = file.name.split('.').pop();
    const path = `espacios/espacio_${Date.now()}_${Math.floor(Math.random()*10000)}.${extension}`;
    try {
      const { publicUrl, path: savedPath } = await uploadEspacioImage(path, file);
      console.log("Imagen subida:", { publicUrl, savedPath }); // <-- Diagnóstico
      setFormData((prev) => ({
        ...prev,
        imagenPath: savedPath,
        imagenUrl: publicUrl,
      }));
    } catch (err) {
      setErrorMessage("Error al subir la imagen: " + err.message);
      setFormData((prev) => ({
        ...prev,
        imagenPath: "",
        imagenUrl: "",
      }));
    } finally {
      setSubiendoImagen(false);
      // Limpia el valor del input para permitir seleccionar la misma imagen de nuevo
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.capacidad ||
      !formData.precio ||
      !formData.categoria ||
      !formData.imagenUrl ||
      !formData.imagenPath
    ) {
      setErrorMessage("Todos los campos son obligatorios y la imagen debe estar subida.");
      return;
    }
    if (subiendoImagen) {
      setErrorMessage("Por favor espera a que la imagen termine de subir.");
      return;
    }
    try {
      await addEspacio({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad: formData.capacidad,
        precio: formData.precio,
        categoria: formData.categoria,
        imagen: formData.imagenUrl,
        imagenPath: formData.imagenPath,
      });
      setSuccessMessage("Espacio agregado correctamente.");
      setTimeout(() => navigate("/catalogo"), 1200);
    } catch (err) {
      setErrorMessage("Error al guardar el espacio: " + err.message);
    }
  };

  return (
    <div className="agregar-espacio-container">
      <form className="agregar-espacio-form" onSubmit={handleSubmit}>
        <h2>Agregar Espacio</h2>
        <div className="form-grid">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripción:
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Capacidad:
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              min="1"
              required
            />
          </label>
          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </label>
          <label>
  Categoría:
  <select
    name="categoria"
    value={formData.categoria}
    onChange={handleChange}
    required
  >
    <option value="" disabled>Selecciona categoría</option>
    <option value="Salon">Salón</option>
    <option value="Auditorio">Auditorio</option>
    <option value="Laboratorio">Laboratorio</option>
    <option value="Aire Libre">Aire Libre</option>
  </select>
</label>

          <label htmlFor="imagen-input">Imagen:</label>
          <div
            className="imagen-preview-box"
            style={{ marginBottom: "0.5rem", cursor: "pointer" }}
            onClick={() => fileInputRef.current.click()}
            title="Haz clic para seleccionar imagen"
          >
            {imagenPreview ? (
              <img
                src={imagenPreview}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#888" }}>Seleccionar imagen</span>
            )}
          </div>
          <input
            id="imagen-input"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImagenChange}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <button
          type="submit"
          className="guardar-btn"
          disabled={
            subiendoImagen ||
            !formData.imagenUrl ||
            !formData.imagenPath
          }
        >
          {subiendoImagen ? "Subiendo imagen..." : "Guardar Espacio"}
        </button>
      </form>
    </div>
  );
};

export default AgregarEspacio;