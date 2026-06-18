import axios from 'axios';

const API_URL = 'http://localhost:8082/api/auth/tutoria'; 

const obtenerHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { 'Authorization': `Bearer ${token}` }
    };
};

const tutoria = {
    crearSolicitud: (idSolicitante, emailReceptor) => {
        return axios.post(`${API_URL}/solicitar`, null, {
            params: { idSolicitante: idSolicitante, emailPaciente: emailReceptor },
            ...obtenerHeaders()
        });
    },

    obtenerEnviadas: (idSolicitante) => {
        return axios.get(`${API_URL}/enviadas/${idSolicitante}`, obtenerHeaders());
    },

    obtenerPendientes: (idReceptor) => {
        return axios.get(`${API_URL}/pendientes/${idReceptor}`, obtenerHeaders());
    },

    responderSolicitud: (idSolicitud, aceptada) => {
        return axios.post(`${API_URL}/responder`, null, {
            params: { idSolicitud: idSolicitud, aceptada: aceptada },
            ...obtenerHeaders()
        });
    },

    eliminarSolicitud: (idSolicitud) => {
        return axios.delete(`${API_URL}/eliminar/${idSolicitud}`, obtenerHeaders());
    }
};

export default tutoria;