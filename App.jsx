import React, { useState } from "react";
import { createRoot } from "react-dom/client";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "coleccion", label: "Colección" },
  { id: "consejos", label: "Consejos" },
  { id: "contacto", label: "Contacto" },
];

function App() {
  const [section, setSection] = useState("inicio");

  return (
    <div>
      <nav className="navbar">
        <span className="logo">OtroMundo</span>
        <ul>
          {sections.map((s) => (
            <li
              key={s.id}
              className={section === s.id ? "active" : ""}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {section === "inicio" && <Inicio />}
        {section === "coleccion" && <FakeSection title="Colección" />}
        {section === "consejos" && <FakeSection title="Consejos" />}
        {section === "contacto" && <FakeSection title="Contacto" />}
      </main>
    </div>
  );
}

function Inicio() {
  return (
    <section className="inicio-section">
      <div className="inicio-bg" />
      <div className="inicio-content">
        <h1 className="kalina-title">Colección</h1>
        <div className="subtitle">12 Suculentas de Poder</div>
        <div className="surprise">sorprendeme</div>
      </div>
    </section>
  );
}

function FakeSection({ title }) {
  return (
    <section style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem"
    }}>
      <div>{title} (en construcción)</div>
    </section>
  );
}

// Render
const root = document.getElementById("root");
createRoot(root).render(<App />);