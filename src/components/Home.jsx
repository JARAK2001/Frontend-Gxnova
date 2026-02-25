import React, { useState, useEffect } from "react";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import Hero from "./home/Hero";
import CategoriasSection from "./home/CategoriasSection";
import TrabajosDestacados from "./home/TrabajosDestacados";
import ComoFunciona from "./home/ComoFunciona";
import Beneficios from "./home/Beneficios";
import CallToAction from "./home/CallToAction";
import API_URL from '../config/api';
import { AlertCircle } from 'lucide-react';

function Home() {
    const [categorias, setCategorias] = useState([]);
    const [trabajosDestacados, setTrabajosDestacados] = useState([]);
    const [loading, setLoading] = useState(true);

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
            // Se puede intentar filtrar desde backend, pero por seguridad filtramos aquí también
            const respuesta = await fetch(`${API_URL}/api/trabajos?estado=publicado&urgente=true&limit=10`);
            const data = await respuesta.json();
            if (data.trabajos) {
                // Filtro adicional en frontend para asegurar que solo se muestren urgentes
                // (útil si el backend no se reinició o si el filtro backend falla)
                const soloUrgentes = data.trabajos.filter(t => esUrgente(t.fecha_estimada)).slice(0, 6);
                setTrabajosDestacados(soloUrgentes);
            }
        } catch (error) {
            console.error("Error al cargar trabajos:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Encabezado />
            <Hero />
            <CategoriasSection categorias={categorias} />
            <ComoFunciona />
            <TrabajosDestacados trabajos={trabajosDestacados} loading={loading} titulo={<><AlertCircle className="w-6 h-6 inline mr-2" /> Trabajos Urgentes (Cierran en 24h)</>} />
            <Beneficios />
            <CallToAction />
            <Footer />
        </div>
    );
}

export default Home;

