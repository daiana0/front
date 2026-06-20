import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Collapse,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Warning,
} from '@mui/icons-material';

import {
  CabeceraPagina,
  CampoBusqueda,
  CampoSelect,
  BadgeEstado,
  ListaDocumentos,
  PaginacionSistema,
} from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { axiosClient } from '@/core/api/axios.client';

export const PreinscriptosScreen: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [preinscriptosList, setPreinscriptosList] = useState<any[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorScreen, setErrorScreen] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const [buscar, setBuscar] = useState('');
  const [carreraFiltro, setCarreraFiltro] = useState('todas');
  const [estadoFiltro, setEstadoFiltro] = useState<'pendiente' | 'aprobado' | 'rechazado' | 'todos'>('todos');
  const [pagina, setPagina] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);

  const [openConfirmEstudianteDialog, setOpenConfirmEstudianteDialog] = useState(false);
  const [postulanteAConfirmar, setPostulanteAConfirmar] = useState<any | null>(null);

  useEffect(() => {
    setPagina(1);
  }, [buscar, carreraFiltro, estadoFiltro, elementosPorPagina]);

  const getFileName = (url?: string | null) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'archivo.pdf';
  };

  const getFileUrl = (urlOrFilename?: string | null, idUsuario?: number) => {
    if (!urlOrFilename) return '';
    if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://') || urlOrFilename.startsWith('/')) {
      return urlOrFilename;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
    const host = apiBase.replace('/api/v1', '');
    return `${host}/uploads/docPreinscriptos/${idUsuario}/${urlOrFilename}`;
  };

  const mapApiPreinscripto = (pre: any) => {
    const nombrePostulante = pre.usuario
      ? `${pre.usuario.nombre} ${pre.usuario.apellido || ''}`.trim()
      : 'Sin Nombre';
    const emailPostulante = pre.usuario?.email || 'Sin Email';
    const carreraNombre = pre.carrera?.nombre || 'Sin Carrera';
    const idUsuario = pre.idUsuario || pre.usuario?.id;

    let validacionesParsed: Record<string, string> = {};
    if (pre.validaciones) {
      try {
        validacionesParsed = typeof pre.validaciones === 'string'
          ? JSON.parse(pre.validaciones)
          : pre.validaciones;
      } catch (e) {
        console.error('Error al parsear validaciones', e);
      }
    }

    const getDocEstado = (docId: string) => {
      if (validacionesParsed[docId]) {
        return validacionesParsed[docId] as 'pendiente' | 'validado' | 'rechazado';
      }
      if (pre.estado === 'aprobado') return 'validado';
      if (pre.estado === 'rechazado') return 'rechazado';
      return 'pendiente';
    };

    const documentos = [
      {
        id: 'analitico',
        titulo: 'Analítico Secundario',
        nombreArchivo: getFileName(pre.analitico),
        url: getFileUrl(pre.analitico, idUsuario),
        estado: getDocEstado('analitico'),
        tamaño: 'N/A',
      },
      {
        id: 'partidaNacimiento',
        titulo: 'Partida de Nacimiento',
        nombreArchivo: getFileName(pre.partidaNacimiento),
        url: getFileUrl(pre.partidaNacimiento, idUsuario),
        estado: getDocEstado('partidaNacimiento'),
        tamaño: 'N/A',
      },
      {
        id: 'foto',
        titulo: 'Foto carnet 4x4',
        nombreArchivo: getFileName(pre.foto),
        url: getFileUrl(pre.foto, idUsuario),
        estado: getDocEstado('foto'),
        tamaño: 'N/A',
      },
      {
        id: 'dniFrente',
        titulo: 'Foto DNI Frente',
        nombreArchivo: getFileName(pre.dniFrente),
        url: getFileUrl(pre.dniFrente, idUsuario),
        estado: getDocEstado('dniFrente'),
        tamaño: 'N/A',
      },
      {
        id: 'dniDorso',
        titulo: 'Foto DNI Dorso',
        nombreArchivo: getFileName(pre.dniDorso),
        url: getFileUrl(pre.dniDorso, idUsuario),
        estado: getDocEstado('dniDorso'),
        tamaño: 'N/A',
      },
      {
        id: 'cus',
        titulo: 'CUS - Certificado Único de Salud',
        nombreArchivo: getFileName(pre.cus),
        url: getFileUrl(pre.cus, idUsuario),
        estado: getDocEstado('cus'),
        tamaño: 'N/A',
      },
      {
        id: 'isa',
        titulo: 'I.S.A. - Informe de Salud Anual',
        nombreArchivo: getFileName(pre.isa),
        url: getFileUrl(pre.isa, idUsuario),
        estado: getDocEstado('isa'),
        tamaño: 'N/A',
      },
    ];

    if (pre.emmac) {
      documentos.push({
        id: 'emmac',
        titulo: 'EMMAC - Examen Médico para Mediana y Alta Competencia',
        nombreArchivo: getFileName(pre.emmac),
        url: getFileUrl(pre.emmac, idUsuario),
        estado: getDocEstado('emmac'),
        tamaño: 'N/A',
      });
    }

    const esEstudiante = !!(pre.usuario?.estudiantes && pre.usuario.estudiantes.length > 0);

    return {
      id: pre.id,
      nombre: nombrePostulante,
      email: emailPostulante,
      carrera: carreraNombre,
      idCarrera: pre.idCarrera,
      fecha: pre.fechaInscripcion || '',
      estado: pre.estado,
      documentos,
      dni: pre.dni || '',
      domicilio: pre.domicilio || '',
      telefono: pre.telefono || '',
      fechaDeNacimiento: pre.fechaDeNacimiento || null,
      trabaja: pre.trabaja ?? null,
      esEstudiante,
    };
  };

  const parseApiError = (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as any).response;
      const backendMessage = response?.data?.message || response?.data?.error;
      const zodIssues = response?.data?.issues;

      if (Array.isArray(zodIssues) && zodIssues.length > 0) {
        return zodIssues.map((issue: any) => issue?.message).filter(Boolean).join(' ');
      }

      return backendMessage || `Error ${response?.status || 'desconocido'}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'No se pudo completar la operación.';
  };

  const cargarPreinscriptos = useCallback(async () => {
    setLoading(true);
    setErrorScreen(null);
    try {
      const response = await axiosClient.get('/preinscriptos', {
        params: { page: 1, limit: 500 },
      });
      const data = response.data?.data || [];
      setPreinscriptosList(data.map(mapApiPreinscripto));
    } catch (err) {
      setErrorScreen(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarCarreras = useCallback(async () => {
    try {
      const response = await axiosClient.get('/carreras', {
        params: { limit: 500 },
      });
      const data = response.data?.data || [];
      setCarreras(data);
    } catch (err) {
      console.error('Error al cargar carreras', err);
    }
  }, []);

  useEffect(() => {
    cargarPreinscriptos();
    cargarCarreras();
  }, [cargarPreinscriptos, cargarCarreras]);

  useEffect(() => {
    if (!mensajeExito) return;
    const timer = setTimeout(() => setMensajeExito(null), 5000);
    return () => clearTimeout(timer);
  }, [mensajeExito]);

  const handleGuardarValidacion = async (postulante: any) => {
    setErrorScreen(null);
    setLoading(true);

    const validacionesObj: Record<string, string> = {};
    postulante.documentos.forEach((d: any) => {
      validacionesObj[d.id] = d.estado;
    });

    try {
      await axiosClient.patch(`/preinscriptos/${postulante.id}`, {
        estado: postulante.estado,
        validaciones: JSON.stringify(validacionesObj),
      });

      setMensajeExito('Se guardaron las validaciones de los documentos (la preinscripción permanece en su estado actual).');
      cargarPreinscriptos();
    } catch (err) {
      setErrorScreen(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (postulante: any, nuevoEstado: 'pendiente' | 'aprobado' | 'rechazado') => {
    setErrorScreen(null);
    setLoading(true);

    const validacionesObj: Record<string, string> = {};
    postulante.documentos.forEach((d: any) => {
      if (nuevoEstado === 'aprobado') {
        validacionesObj[d.id] = 'validado';
      } else if (nuevoEstado === 'rechazado') {
        validacionesObj[d.id] = 'rechazado';
      } else {
        validacionesObj[d.id] = 'pendiente';
      }
    });

    try {
      await axiosClient.patch(`/preinscriptos/${postulante.id}`, {
        estado: nuevoEstado,
        validaciones: JSON.stringify(validacionesObj),
      });

      if (nuevoEstado === 'aprobado') {
        setMensajeExito('La documentación fue APROBADA con éxito.');
      } else if (nuevoEstado === 'rechazado') {
        setMensajeExito('La documentación fue RECHAZADA.');
      } else {
        setMensajeExito('La documentación regresó al estado pendiente.');
      }
      cargarPreinscriptos();
    } catch (err) {
      setErrorScreen(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCrearEstudiante = async (postulante: any) => {
    setErrorScreen(null);
    setLoading(true);

    try {
      await axiosClient.patch(`/preinscriptos/${postulante.id}`, {
        crearEstudiante: true,
      });

      setMensajeExito('Se dio de alta al estudiante con éxito.');
      cargarPreinscriptos();
    } catch (err) {
      setErrorScreen(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleIntentoCrearEstudiante = (postulante: any) => {
    setPostulanteAConfirmar(postulante);
    setOpenConfirmEstudianteDialog(true);
  };

  const handleConfirmarCrearEstudiante = () => {
    if (postulanteAConfirmar) {
      handleCrearEstudiante(postulanteAConfirmar);
    }
    setOpenConfirmEstudianteDialog(false);
    setPostulanteAConfirmar(null);
  };

  const handleCancelarCrearEstudiante = () => {
    setOpenConfirmEstudianteDialog(false);
    setPostulanteAConfirmar(null);
  };

  const handleRowToggle = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleAceptarDocumento = (postulanteId: number, documentoId: string) => {
    setPreinscriptosList(prev => prev.map(p => {
      if (p.id !== postulanteId) return p;
      return {
        ...p,
        documentos: p.documentos.map((d: any) =>
          d.id === documentoId ? { ...d, estado: 'validado' } : d
        )
      };
    }));
  };

  const handleRechazarDocumento = (postulanteId: number, documentoId: string) => {
    setPreinscriptosList(prev => prev.map(p => {
      if (p.id !== postulanteId) return p;
      return {
        ...p,
        documentos: p.documentos.map((d: any) =>
          d.id === documentoId ? { ...d, estado: 'rechazado' } : d
        )
      };
    }));
  };

  const handleDeshacerDocumento = (postulanteId: number, documentoId: string) => {
    setPreinscriptosList(prev => prev.map(p => {
      if (p.id !== postulanteId) return p;
      return {
        ...p,
        estado: 'pendiente',
        documentos: p.documentos.map((d: any) =>
          d.id === documentoId ? { ...d, estado: 'pendiente' } : d
        )
      };
    }));
  };

  const getValidadosCount = (documentos: any[]) => {
    return documentos.filter((doc) => doc.estado === 'validado').length;
  };

  const filteredPreinscriptos = preinscriptosList.filter((postulante) => {
    // Ocultar definitivamente si ya es estudiante y su documentación está aprobada
    if (postulante.esEstudiante && postulante.estado === 'aprobado') {
      return false;
    }

    const matchBuscar = buscar
      ? postulante.nombre.toLowerCase().split(/[\s,]+/).some((w) => w.startsWith(buscar.toLowerCase())) ||
      postulante.email.toLowerCase().startsWith(buscar.toLowerCase())
      : true;

    const matchCarrera = carreraFiltro === 'todas'
      ? true
      : String(postulante.idCarrera) === carreraFiltro;

    const matchEstado = estadoFiltro === 'todos'
      ? true
      : postulante.estado === estadoFiltro;

    return matchBuscar && matchCarrera && matchEstado;
  });

  const totalPaginas = Math.ceil(filteredPreinscriptos.length / elementosPorPagina);
  useEffect(() => {
    if (pagina > 1 && pagina > totalPaginas) {
      setPagina(Math.max(1, totalPaginas));
    }
  }, [filteredPreinscriptos.length, elementosPorPagina, totalPaginas, pagina]);

  const preinscriptosPaginados = filteredPreinscriptos.slice(
    (pagina - 1) * elementosPorPagina,
    pagina * elementosPorPagina
  );

  const pendientesCount = preinscriptosList.filter((p) => p.estado === 'pendiente').length;

  return (
    <Box>
      <CabeceraPagina
        breadcrumbs={[
          {
            label: 'Panel administrativo',
            href: '/admin/dashboard',
          },
          {
            label: 'Preinscriptos',
          },
        ]}
        titulo="Preinscriptos"
        descripcion="Administración de estudiantes preinscriptos a las carreras."
        extra={
          <BadgeEstado
            estado="pendiente"
            customLabel={`${pendientesCount} pendiente${pendientesCount === 1 ? '' : 's'}`}
            variant="filled"
          />
        }
      />

      {/* FILTROS */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: themeTokens.colors.surface,
          border: `1px solid ${themeTokens.colors.border}`,
          borderRadius: `${themeTokens.borderRadius.card}px`,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr 1fr',
            },
            gap: 2,
          }}
        >
          <CampoBusqueda
            valor={buscar}
            onChange={setBuscar}
            placeholder="Buscar por nombre o email..."
          />

          <CampoSelect
            label="Carrera"
            value={carreraFiltro}
            onChange={(e) => setCarreraFiltro(e.target.value as string)}
            opciones={[
              {
                value: 'todas',
                label: 'Todas las carreras',
              },
              ...carreras.map((c) => ({
                value: String(c.id),
                label: c.nombre,
              })),
            ]}
          />

          <CampoSelect
            label="Estado doc."
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as any)}
            opciones={[
              { value: 'todos', label: 'Todos' },
              { value: 'pendiente', label: 'Pendiente de revisión' },
              { value: 'aprobado', label: 'Aprobado' },
              { value: 'rechazado', label: 'Rechazado' },
            ]}
          />
        </Box>
      </Paper>

      {/* TABLA */}
      <Paper
        elevation={0}
        sx={{
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: themeTokens.colors.border,
          borderRadius: `${themeTokens.borderRadius.card}px`,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: 'hidden',
          bgcolor: '#ffffff',
        }}
      >
        {/* CABECERA */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr 1fr',
            gap: 2,
            p: 2,
            bgcolor: themeTokens.colors.surfaceHover,
            borderBottom: `1px solid ${themeTokens.colors.border}`,
            borderLeft: '4px solid transparent',
            fontWeight: themeTokens.typography.weights.semibold,
            fontSize: '0.875rem',
            color: 'text.primary',
          }}
        >
          <Box>Postulante</Box>
          <Box>Email</Box>
          <Box>Carrera</Box>
          <Box>Fecha</Box>
          <Box>Estado doc.</Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>Acciones</Box>
        </Box>

        {preinscriptosPaginados.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
              {loading ? 'Cargando preinscriptos...' : 'No se encontraron preinscriptos.'}
            </Typography>
          </Box>
        ) : (
          preinscriptosPaginados.map((postulante) => {
            const isExpanded = expandedRow === postulante.id;
            const validadosCount = getValidadosCount(postulante.documentos);
            const totalDocs = postulante.documentos.length;

            return (
              <Box key={postulante.id}>
                {/* FILA */}
                <Box
                  onClick={() => handleRowToggle(postulante.id)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 2fr 1fr 1fr 1fr',
                    gap: 2,
                    p: 2,
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eef2f6',
                    bgcolor: isExpanded
                      ? 'rgba(0,91,127,0.03)'
                      : 'inherit',
                    borderLeft: isExpanded
                      ? '4px solid #005b7f'
                      : '4px solid transparent',
                    '&:hover': {
                      bgcolor: '#f8fafc',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: '#005b7f',
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        fontWeight: 700,
                      }}
                    >
                      {postulante.nombre
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </Avatar>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#005b7f',
                        }}
                      >
                        {postulante.nombre}
                      </Typography>
                      {postulante.esEstudiante && (
                        <Chip
                          label="Estudiante"
                          size="small"
                          sx={{
                            bgcolor: 'rgba(74, 222, 128, 0.15)',
                            color: '#16a34a',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 18,
                            border: '1px solid rgba(22, 163, 74, 0.3)',
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#40484E' }}>
                    {postulante.email}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#40484E' }}>
                    {postulante.carrera}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#40484E' }}>
                    {postulante.fecha}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BadgeEstado
                      estado={postulante.estado}
                      customLabel={postulante.estado === 'pendiente' ? 'Pendiente de revisión' : undefined}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowToggle(postulante.id);
                      }}
                      sx={{
                        color: '#64748b',
                      }}
                    >
                      {isExpanded ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* DESPLEGABLE */}
                <Collapse
                  in={isExpanded}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: '#fafbfc',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    {/* DATOS PERSONALES DEL POSTULANTE */}
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#1e293b',
                        mb: 2,
                      }}
                    >
                      Datos personales
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1.5fr 1fr 1fr' },
                        gap: 2.5,
                        mb: 4,
                        p: 2.5,
                        bgcolor: '#ffffff',
                        border: '1px solid #eef2f6',
                        borderRadius: '8px',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>DNI</Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{postulante.dni || 'No cargado'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Teléfono</Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{postulante.telefono || 'No cargado'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Domicilio</Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mt: 0.5 }}>{postulante.domicilio || 'No cargado'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Fecha de Nacimiento</Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mt: 0.5 }}>
                          {postulante.fechaDeNacimiento ? postulante.fechaDeNacimiento : 'No cargada'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>¿Trabaja?</Typography>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '14px', mt: 0.5 }}>
                          {postulante.trabaja === true ? 'Sí' : postulante.trabaja === false ? 'No' : 'No especificado'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: 'primary.main' }}
                      >
                        Documentación adjunta
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontSize: '0.85rem',
                        }}
                      >
                        {validadosCount} de {totalDocs} documentos revisados
                      </Typography>
                    </Box>

                    <ListaDocumentos
                      titulo=""
                      columnas={2}
                      labelPendiente="Pendiente de revisión"
                      documentos={postulante.documentos}
                      onAceptar={(docId) => handleAceptarDocumento(postulante.id, docId)}
                      onRechazar={(docId) => handleRechazarDocumento(postulante.id, docId)}
                      onDeshacer={(docId) => handleDeshacerDocumento(postulante.id, docId)}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 3,
                        borderTop: '1px solid #eef2f6',
                        mt: 3,
                      }}
                    >
                      {/* Lado Izquierdo: Acciones de Matrícula (Estudiante) */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {!postulante.esEstudiante && (
                          <Button
                            variant="contained"
                            color="info"
                            disabled={loading}
                            onClick={() => handleIntentoCrearEstudiante(postulante)}
                            sx={{
                              fontWeight: 700,
                              borderRadius: `${themeTokens.borderRadius.button}px`
                            }}
                          >
                            Dar de alta Estudiante
                          </Button>
                        )}
                      </Box>

                      {/* Lado Derecho: Acciones de Documentación y Preinscripción */}
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                          variant="outlined"
                          disabled={loading}
                          onClick={() => handleGuardarValidacion(postulante)}
                          sx={{
                            borderColor: '#64748b',
                            color: '#64748b',
                            fontWeight: 600,
                            borderRadius: `${themeTokens.borderRadius.button}px`,
                            '&:hover': {
                              borderColor: '#475569',
                              bgcolor: 'rgba(100, 116, 139, 0.04)',
                            },
                          }}
                        >
                          Guardar validaciones
                        </Button>

                        {(postulante.estado !== 'aprobado' || validadosCount < totalDocs) && (
                          <Button
                            variant="contained"
                            color="success"
                            disabled={loading || validadosCount < totalDocs}
                            onClick={() => handleCambiarEstado(postulante, 'aprobado')}
                            sx={{
                              fontWeight: 600,
                              borderRadius: `${themeTokens.borderRadius.button}px`
                            }}
                          >
                            Aprobar Documentación
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            );
          }))}
      </Paper>

      {filteredPreinscriptos.length > 0 && (
        <PaginacionSistema
          totalElementos={filteredPreinscriptos.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={pagina}
          onPaginaChange={setPagina}
          onElementosPorPaginaChange={setElementosPorPagina}
          sx={{
            borderTop: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            mt: 0,
          }}
        />
      )}

      <Dialog
        open={openConfirmEstudianteDialog}
        onClose={handleCancelarCrearEstudiante}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              p: 1.5,
              maxWidth: '450px',
            }
          }
        }}
      >
        {(() => {
          const tienePendientes = postulanteAConfirmar?.documentos?.some((doc: any) => doc.estado !== 'validado');
          return (
            <>
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, color: tienePendientes ? '#9a3412' : 'primary.main' }}>
                {tienePendientes && <Warning sx={{ color: '#ea580c', fontSize: '2rem' }} />}
                {tienePendientes ? 'Documentación pendiente' : 'Confirmar alta de estudiante'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: '#374151', fontSize: '15px', mb: 2 }}>
                  {tienePendientes ? (
                    <>El postulante <strong>{postulanteAConfirmar?.nombre}</strong> aún tiene documentos que no han sido validados.</>
                  ) : (
                    <>¿Estás seguro de que deseas dar de alta al postulante <strong>{postulanteAConfirmar?.nombre}</strong> como estudiante?</>
                  )}
                </DialogContentText>
                {tienePendientes && (
                  <DialogContentText sx={{ color: '#6b7280', fontSize: '14px' }}>
                    ¿Estás seguro de que deseas darlo de alta de todos modos? Podrás revisar su documentación más adelante.
                  </DialogContentText>
                )}
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 1.5 }}>
                <Button
                  onClick={handleCancelarCrearEstudiante}
                  variant="outlined"
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#4b5563',
                    fontWeight: 600,
                    borderRadius: `${themeTokens.borderRadius.button}px`,
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                    }
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmarCrearEstudiante}
                  variant="contained"
                  color={tienePendientes ? 'warning' : 'primary'}
                  sx={{
                    fontWeight: 700,
                    bgcolor: tienePendientes ? '#ea580c' : 'primary.main',
                    borderRadius: `${themeTokens.borderRadius.button}px`,
                    '&:hover': {
                      bgcolor: tienePendientes ? '#c2410c' : 'primary.dark',
                    }
                  }}
                  autoFocus
                >
                  {tienePendientes ? 'Sí, dar de alta' : 'Confirmar alta'}
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* NOTIFICACIONES FLOTANTES (TOASTS) */}
      <Snackbar
        open={!!mensajeExito}
        autoHideDuration={5000}
        onClose={() => setMensajeExito(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setMensajeExito(null)}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {mensajeExito}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorScreen}
        autoHideDuration={6000}
        onClose={() => setErrorScreen(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setErrorScreen(null)}
          severity="error"
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {errorScreen}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PreinscriptosScreen;