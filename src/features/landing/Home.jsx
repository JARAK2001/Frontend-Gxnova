import React, { useState, useEffect } from "react";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import Hero from "../jobs/Hero";
import CategoriasSection from "../jobs/CategoriasSection";
import TrabajosDestacados from "../jobs/TrabajosDestacados";
import ComoFunciona from "../jobs/ComoFunciona";
import Beneficios from "../jobs/Beneficios";
import CallToAction from "../jobs/CallToAction";
import API_URL from '../../config/api';
import { AlertCircle } from 'lucide-react';

function Home() {
    const [categorias, setCategorias] = useState([]);
    const [trabajosDestacados, setTrabajosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarUrgentes, setMostrarUrgentes] = useState(true);

    useEffect(() => {
        cargarCategorias();
        cargarTrabajosUrgentes();
    }, []);

    const cargarCategorias = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/api/categorias`);
            const data = await respuesta.json();
            if (data.categorias) {
                setCategorias(data.categorias.slice(0, 6)); // Mostrar solo las primeras 6
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const esUrgente = (fecha) => {
        if (!fecha) return false;
        const fechaEstimada = new Date(fecha);
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        return fechaEstimada <= manana && fechaEstimada >= new Date();
    };

    const cargarTrabajosUrgentes = async () => {
        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/trabajos?estado=publicado&urgente=true&limit=10`);
            const data = await respuesta.json();
            if (data.trabajos) {
                const soloUrgentes = data.trabajos.filter(t => esUrgente(t.fecha_estimada)).slice(0, 6);
                if (soloUrgentes.length > 0) {
                    setTrabajosDestacados(soloUrgentes);
                    setMostrarUrgentes(true);
                    return;
                }
            }
            // Si no hay urgentes, cargar trabajos recientes (sin filtro de urgencia)
            const resRecientes = await fetch(`${API_URL}/api/trabajos?estado=publicado&limit=6`);
            const dataRecientes = await resRecientes.json();
            if (dataRecientes.trabajos && dataRecientes.trabajos.length > 0) {
                setTrabajosDestacados(dataRecientes.trabajos.slice(0, 6));
            } else {
                setTrabajosDestacados([]);
            }
            setMostrarUrgentes(false);
        } catch (error) {
            console.error("Error al cargar trabajos:", error);
            setTrabajosDestacados([]);
            setMostrarUrgentes(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Encabezado />
            <Hero />
            <CategoriasSection categorias={categorias} />
            <TrabajosDestacados
                trabajos={trabajosDestacados}
                loading={loading}
                titulo={mostrarUrgentes ? <><AlertCircle className="w-6 h-6 inline mr-2" /> Trabajos Urgentes (Cierran en 24h)</> : null}
                esRecientes={!mostrarUrgentes}
            />
            <ComoFunciona />
            <Beneficios />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default Home;

